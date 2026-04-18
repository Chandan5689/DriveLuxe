from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .authentication import ClerkJWTAuthentication
from .models import Booking, Car


class AuthSyncApiTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			username='clerk_user_example',
			email='',
			password='Secret123!'
		)
		self.client.force_authenticate(user=self.user)

	def test_auth_sync_updates_user_fields(self):
		payload = {
			'username': 'john.doe',
			'email': 'John.Doe@Example.com',
			'first_name': 'John',
			'last_name': 'Doe',
		}

		response = self.client.post('/api/auth/sync/', payload, format='json')

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'john.doe')
		self.assertEqual(self.user.email, 'john.doe@example.com')
		self.assertEqual(self.user.first_name, 'John')
		self.assertEqual(self.user.last_name, 'Doe')

	def test_auth_sync_ensures_unique_username(self):
		User.objects.create_user(username='takenname', password='Secret123!')

		response = self.client.post('/api/auth/sync/', {'username': 'takenname'}, format='json')

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'takenname_1')

	def test_auth_sync_uses_email_local_part_when_username_missing_for_placeholder(self):
		self.user.username = 'clerk_user_example'
		self.user.save(update_fields=['username'])

		response = self.client.post('/api/auth/sync/', {'email': 'Jane.Doe@Example.com'}, format='json')

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'jane.doe')
		self.assertEqual(self.user.email, 'jane.doe@example.com')

	def test_auth_sync_does_not_override_non_placeholder_username_when_missing(self):
		self.user.username = 'alreadyset'
		self.user.save(update_fields=['username'])

		response = self.client.post('/api/auth/sync/', {'email': 'new.user@example.com'}, format='json')

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'alreadyset')
		self.assertEqual(self.user.email, 'new.user@example.com')


class ClerkAuthenticationSyncTests(APITestCase):
	def setUp(self):
		self.auth_backend = ClerkJWTAuthentication()
		self.clerk_user_id = '3CRPIRHnvEMCfd9pHixO0cCSE6V'
		self.user = User.objects.create_user(
			username='chosen_username',
			email='chosen@example.com',
			password='Secret123!'
		)

	def test_sync_does_not_override_real_username_with_placeholder_profile_username(self):
		profile = {
			'username': f'clerk_user_{self.clerk_user_id}',
			'email': 'chosen@example.com',
			'first_name': '',
			'last_name': '',
		}

		self.auth_backend._sync_user_fields(User, self.user, profile, self.clerk_user_id)

		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'chosen_username')

	def test_sync_replaces_placeholder_username_when_real_username_exists(self):
		self.user.username = f'clerk_user_{self.clerk_user_id}'
		self.user.save(update_fields=['username'])
		profile = {
			'username': 'real_username',
			'email': 'chosen@example.com',
			'first_name': '',
			'last_name': '',
		}

		self.auth_backend._sync_user_fields(User, self.user, profile, self.clerk_user_id)

		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'real_username')

	def test_sync_treats_user_prefixed_subject_as_same_placeholder_identity(self):
		profile = {
			'username': f'clerk_user_{self.clerk_user_id}',
			'email': 'chosen@example.com',
			'first_name': '',
			'last_name': '',
		}

		self.auth_backend._sync_user_fields(User, self.user, profile, f'user_{self.clerk_user_id}')

		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'chosen_username')

class BookingApiTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(username='booker', password='Secret123!')
		self.other_user = User.objects.create_user(username='other', password='Secret123!')
		self.client.force_authenticate(user=self.user)

		self.car = Car.objects.create(
			name='Tesla Model S',
			category='Electric',
			price=Decimal('150.00'),
			image='https://example.com/car.jpg',
			transmission='Automatic',
			fuelType='Electric',
			seats=5,
			description='Luxury electric sedan',
			features=['Autopilot'],
			specifications={'range': '600km'},
			rating=4.8,
			reviews=12,
		)

	def test_list_bookings_returns_only_authenticated_users_bookings(self):
		today = date.today()
		Booking.objects.create(
			user=self.user,
			car=self.car,
			pickup_date=today + timedelta(days=1),
			return_date=today + timedelta(days=3),
		)
		Booking.objects.create(
			user=self.other_user,
			car=self.car,
			pickup_date=today + timedelta(days=4),
			return_date=today + timedelta(days=6),
		)

		response = self.client.get('/api/bookings/', format='json')

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['user'], self.user.id)

	def test_create_booking_rejects_overlapping_dates(self):
		today = date.today()
		Booking.objects.create(
			user=self.other_user,
			car=self.car,
			pickup_date=today + timedelta(days=5),
			return_date=today + timedelta(days=10),
			status='pending',
		)

		payload = {
			'car': self.car.id,
			'pickup_date': str(today + timedelta(days=7)),
			'return_date': str(today + timedelta(days=9)),
			'pickup_location': 'Airport',
			'return_location': 'Airport',
			'first_name': 'John',
			'last_name': 'Doe',
			'email': 'john@example.com',
			'phone': '1234567890',
			'address': 'Main Street',
			'city': 'Pokhara',
			'zip_code': '33700',
			'country': 'Nepal',
			'special_requests': '',
			'agree_to_terms': True,
		}

		response = self.client.post('/api/bookings/', payload, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertIn('dates', response.data)

	def test_create_booking_rejects_non_10_digit_phone(self):
		today = date.today()
		payload = {
			'car': self.car.id,
			'pickup_date': str(today + timedelta(days=7)),
			'return_date': str(today + timedelta(days=9)),
			'pickup_location': 'Airport',
			'return_location': 'Airport',
			'first_name': 'John',
			'last_name': 'Doe',
			'email': 'john@example.com',
			'phone': '12345',
			'address': 'Main Street',
			'city': 'Pokhara',
			'zip_code': '33700',
			'country': 'Nepal',
			'special_requests': '',
			'agree_to_terms': True,
		}

		response = self.client.post('/api/bookings/', payload, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertIn('phone', response.data)

	def test_create_booking_rejects_blank_required_text_field(self):
		today = date.today()
		payload = {
			'car': self.car.id,
			'pickup_date': str(today + timedelta(days=7)),
			'return_date': str(today + timedelta(days=9)),
			'pickup_location': 'Airport',
			'return_location': 'Airport',
			'first_name': 'John',
			'last_name': 'Doe',
			'email': 'john@example.com',
			'phone': '1234567890',
			'address': '   ',
			'city': 'Pokhara',
			'zip_code': '33700',
			'country': 'Nepal',
			'special_requests': '',
			'agree_to_terms': True,
		}

		response = self.client.post('/api/bookings/', payload, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertIn('address', response.data)
