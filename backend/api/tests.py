from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Booking, Car


class AuthApiTests(APITestCase):
	def test_register_user_success(self):
		payload = {
			'username': 'newuser',
			'email': 'newuser@example.com',
			'password': 'StrongPass123!',
			'password2': 'StrongPass123!',
		}

		response = self.client.post('/api/register/', payload, format='json')

		self.assertEqual(response.status_code, 201)
		self.assertTrue(User.objects.filter(username='newuser').exists())

	def test_login_returns_token(self):
		user = User.objects.create_user(username='loginuser', password='Secret123!')

		response = self.client.post(
			'/api/login/',
			{'username': 'loginuser', 'password': 'Secret123!'},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		self.assertIn('token', response.data)
		self.assertEqual(response.data['user_id'], user.id)


class BookingApiTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(username='booker', password='Secret123!')
		self.other_user = User.objects.create_user(username='other', password='Secret123!')
		self.token = Token.objects.create(user=self.user)
		self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

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
			'phone': '+1234567890',
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
