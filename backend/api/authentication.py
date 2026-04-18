from __future__ import annotations

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework import exceptions

import jwt
from jwt import InvalidTokenError, PyJWKClient
import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from .models import ClerkIdentity


class ClerkJWTAuthentication(authentication.BaseAuthentication):
    """Authenticate API requests using Clerk-issued Bearer JWTs."""

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header:
            return None

        if auth_header[0].lower() != b"bearer":
            return None

        if len(auth_header) != 2:
            raise exceptions.AuthenticationFailed("Invalid authorization header format.")

        token = auth_header[1].decode("utf-8")
        claims = self._decode_token(token)
        user = self._get_or_create_user(claims)

        return (user, None)

    def _decode_token(self, token: str) -> dict:
        jwks_url = getattr(settings, "CLERK_JWKS_URL", "").strip()
        issuer = getattr(settings, "CLERK_ISSUER", "").strip()
        audience = getattr(settings, "CLERK_AUDIENCE", "").strip()

        if not jwks_url:
            raise exceptions.AuthenticationFailed("CLERK_JWKS_URL is not configured.")

        if not issuer:
            raise exceptions.AuthenticationFailed("CLERK_ISSUER is not configured.")

        try:
            signing_key = PyJWKClient(jwks_url).get_signing_key_from_jwt(token)
            options = {"verify_aud": bool(audience)}
            decode_kwargs = {
                "key": signing_key.key,
                "algorithms": ["RS256"],
                "issuer": issuer,
                "options": options,
            }
            if audience:
                decode_kwargs["audience"] = audience

            return jwt.decode(token, **decode_kwargs)
        except InvalidTokenError as exc:
            raise exceptions.AuthenticationFailed("Invalid Clerk token.") from exc
        except Exception as exc:
            raise exceptions.AuthenticationFailed("Unable to validate Clerk token.") from exc

    def _get_or_create_user(self, claims: dict):
        clerk_user_id = claims.get("sub")
        if not clerk_user_id:
            raise exceptions.AuthenticationFailed("Token is missing user subject.")

        User = get_user_model()

        profile = self._profile_from_claims(claims)
        if self._needs_clerk_profile(profile, clerk_user_id):
            profile.update(self._fetch_profile_from_clerk(clerk_user_id, profile))

        identity = ClerkIdentity.objects.select_related("user").filter(
            clerk_user_id=clerk_user_id
        ).first()

        if identity:
            user = identity.user
        else:
            legacy_usernames = [
                f"clerk_{clerk_user_id}"[:150],
                f"clerk_user_{clerk_user_id}"[:150],
            ]
            user = User.objects.filter(username__in=legacy_usernames).order_by("id").first()

            if user:
                ClerkIdentity.objects.get_or_create(
                    user=user,
                    defaults={"clerk_user_id": clerk_user_id},
                )
            else:
                desired_username = self._preferred_username(profile, clerk_user_id)
                username = self._unique_username(User, desired_username)

                user = User.objects.create_user(
                    username=username,
                    email=profile.get("email", ""),
                    password=None,
                    first_name=(profile.get("first_name", "") or "")[:150],
                    last_name=(profile.get("last_name", "") or "")[:150],
                )
                ClerkIdentity.objects.create(user=user, clerk_user_id=clerk_user_id)

        self._sync_user_fields(User, user, profile, clerk_user_id)
        return user

    def _profile_from_claims(self, claims: dict) -> dict:
        return {
            "username": (
                claims.get("username")
                or claims.get("preferred_username")
                or ""
            ),
            "email": (
                claims.get("email")
                or claims.get("email_address")
                or ""
            ),
            "first_name": claims.get("given_name") or "",
            "last_name": claims.get("family_name") or "",
        }

    def _placeholder_username_candidates(self, clerk_user_id: str) -> set[str]:
        raw_id = (clerk_user_id or "").strip()
        stripped_id = raw_id[5:] if raw_id.startswith("user_") else raw_id
        variants = {variant for variant in [raw_id, stripped_id] if variant}
        candidates = set()

        for variant in variants:
            candidates.add(f"clerk_{variant}".lower())
            candidates.add(f"clerk_user_{variant}".lower())

        return candidates

    def _is_generated_placeholder_username(self, username: str, clerk_user_id: str) -> bool:
        normalized_username = (username or "").strip().lower()
        if not normalized_username or normalized_username == "user":
            return True

        return normalized_username in self._placeholder_username_candidates(clerk_user_id)

    def _needs_clerk_profile(self, profile: dict, clerk_user_id: str) -> bool:
        secret_key = getattr(settings, "CLERK_SECRET_KEY", "").strip()
        if not secret_key:
            return False

        username = (profile.get("username") or "").strip()
        email = (profile.get("email") or "").strip()

        return (
            not email
            or not username
            or self._is_generated_placeholder_username(username, clerk_user_id)
        )

    def _fetch_profile_from_clerk(self, clerk_user_id: str, profile: dict) -> dict:
        secret_key = getattr(settings, "CLERK_SECRET_KEY", "").strip()
        api_base_url = getattr(settings, "CLERK_API_URL", "https://api.clerk.com/v1").strip()
        api_base_url = api_base_url.rstrip("/")

        if not secret_key:
            return {}

        request = Request(
            url=f"{api_base_url}/users/{quote(clerk_user_id)}",
            headers={
                "Authorization": f"Bearer {secret_key}",
                "Accept": "application/json",
            },
            method="GET",
        )

        try:
            with urlopen(request, timeout=4) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            return {}

        primary_email_id = payload.get("primary_email_address_id")
        email = ""
        for address in payload.get("email_addresses", []):
            if primary_email_id and address.get("id") == primary_email_id:
                email = address.get("email_address") or ""
                break
            if not email:
                email = address.get("email_address") or ""

        return {
            "username": payload.get("username") or profile.get("username") or "",
            "email": email or profile.get("email") or "",
            "first_name": payload.get("first_name") or profile.get("first_name") or "",
            "last_name": payload.get("last_name") or profile.get("last_name") or "",
        }

    def _preferred_username(self, profile: dict, clerk_user_id: str) -> str:
        raw_username = (profile.get("username") or "").strip()
        if raw_username and not self._is_generated_placeholder_username(raw_username, clerk_user_id):
            return raw_username

        email = profile.get("email") or ""
        if email and "@" in email:
            return email.split("@", 1)[0]

        return f"clerk_{clerk_user_id}"[:150]

    def _sanitize_username(self, username: str) -> str:
        cleaned = re.sub(r"[^\w.@+-]", "_", (username or "").strip())
        cleaned = cleaned[:150]
        return cleaned or "user"

    def _unique_username(self, user_model, desired_username: str, current_user=None) -> str:
        base_username = self._sanitize_username(desired_username)
        candidate = base_username
        suffix = 1

        while True:
            query = user_model.objects.filter(username=candidate)
            if current_user is not None:
                query = query.exclude(pk=current_user.pk)
            if not query.exists():
                return candidate

            suffix_token = f"_{suffix}"
            trimmed_base = base_username[: 150 - len(suffix_token)]
            candidate = f"{trimmed_base}{suffix_token}"
            suffix += 1

    def _sync_user_fields(self, user_model, user, profile: dict, clerk_user_id: str) -> None:
        updated_fields = []

        current_username = (user.username or "").strip()
        profile_username = (profile.get("username") or "").strip()
        has_strong_profile_username = (
            bool(profile_username)
            and not self._is_generated_placeholder_username(profile_username, clerk_user_id)
        )
        current_username_is_placeholder = self._is_generated_placeholder_username(
            current_username,
            clerk_user_id,
        )

        desired_username = ""
        if has_strong_profile_username:
            desired_username = profile_username
        elif current_username_is_placeholder:
            desired_username = self._preferred_username(profile, clerk_user_id)

        if desired_username:
            unique_username = self._unique_username(user_model, desired_username, current_user=user)
            if unique_username != user.username:
                user.username = unique_username
                updated_fields.append("username")

        email = (profile.get("email") or "").strip()
        if email and email != user.email:
            user.email = email
            updated_fields.append("email")

        first_name = (profile.get("first_name") or "")[:150]
        if first_name and first_name != user.first_name:
            user.first_name = first_name
            updated_fields.append("first_name")

        last_name = (profile.get("last_name") or "")[:150]
        if last_name and last_name != user.last_name:
            user.last_name = last_name
            updated_fields.append("last_name")

        if updated_fields:
            user.save(update_fields=updated_fields)
