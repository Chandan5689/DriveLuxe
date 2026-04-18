from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
import re
from .serializers import CarSerializer, BookingSerializer
from .models import Car, Booking


class AuthSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def _sanitize_username(self, username: str) -> str:
        cleaned = re.sub(r"[^\w.@+-]", "_", (username or "").strip())
        return cleaned[:150]

    def _username_from_email(self, email: str) -> str:
        normalized_email = (email or "").strip().lower()
        if "@" not in normalized_email:
            return ""
        return normalized_email.split("@", 1)[0]

    def _is_placeholder_username(self, username: str) -> bool:
        normalized = (username or "").strip().lower()
        return (
            not normalized
            or normalized == "user"
            or normalized.startswith("clerk_")
            or normalized.startswith("clerk_user_")
        )

    def _unique_username(self, user_model, current_user, desired_username: str) -> str:
        base_username = self._sanitize_username(desired_username)
        if not base_username:
            return current_user.username

        candidate = base_username
        suffix = 1

        while (
            user_model.objects.filter(username=candidate)
            .exclude(pk=current_user.pk)
            .exists()
        ):
            suffix_token = f"_{suffix}"
            candidate = f"{base_username[: 150 - len(suffix_token)]}{suffix_token}"
            suffix += 1

        return candidate

    def post(self, request):
        user = request.user
        User = get_user_model()

        payload_username = request.data.get("username")
        payload_email = request.data.get("email")
        payload_first_name = request.data.get("first_name")
        payload_last_name = request.data.get("last_name")

        updated_fields = []
        normalized_email = ""

        if isinstance(payload_email, str):
            normalized_email = payload_email.strip().lower()
            if normalized_email and normalized_email != user.email:
                user.email = normalized_email
                updated_fields.append("email")

        desired_username = ""
        if isinstance(payload_username, str) and payload_username.strip():
            desired_username = payload_username.strip()
        elif normalized_email and self._is_placeholder_username(user.username):
            desired_username = self._username_from_email(normalized_email)

        if desired_username:
            unique_username = self._unique_username(User, user, desired_username)
            if unique_username != user.username:
                user.username = unique_username
                updated_fields.append("username")

        if isinstance(payload_first_name, str):
            first_name = payload_first_name.strip()[:150]
            if first_name and first_name != user.first_name:
                user.first_name = first_name
                updated_fields.append("first_name")

        if isinstance(payload_last_name, str):
            last_name = payload_last_name.strip()[:150]
            if last_name and last_name != user.last_name:
                user.last_name = last_name
                updated_fields.append("last_name")

        if updated_fields:
            user.save(update_fields=updated_fields)

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        )

# ---- Booking List and Create View ------
class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated] # only the logged-in users can access or authenticated users can access.

    def get_queryset(self):
        #Returns bookings only for the authenticated user
        # This is key for security! It filters the list of bookings
        # so a user only sees their OWN bookings, not everyone else's.
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # def perform_create(self, serializer):
    #     car_id = self.request.data.get('car')

    #     if not car_id:
    #         raise serializers.ValidationError({"car":"Car ID is required."})
    #     try:
    #         car_instance = Car.objects.get(pk=car_id) #pk is primary key (ID)
    #     except Car.DoesNotExist:
    #         raise serializers.ValidationError({"car":f"Car with ID {car_id} does not exist."})
    #     serializer.save(user=self.request.user,car=car_instance)
            
# class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = BookingSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Booking.objects.filter(user=self.request.user)

# class BookingViewSet(viewsets.ModelViewSet):
#     queryset = Booking.objects.all()
#     serializer_class = BookingSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [AllowAny]
    
        