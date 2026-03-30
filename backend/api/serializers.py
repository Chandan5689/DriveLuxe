from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import re
from . models import Car,Booking

class UserRegisterSerializer(serializers.ModelSerializer):
    password =serializers.CharField(write_only=True, required=True,style={'input_type':'password'})
    password2 = serializers.CharField(write_only=True, required=True,style={'input_type':'password'})
    email =serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ['username','email','password','password2']
        extra_kwargs = {
            'password':{'write_only':True},
            'password2':{'write_only':True},
        }

    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.Try again.")
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2":"Passwords do not match."})
        return data
    
    def create(self,validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'



class BookingSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    car_name = serializers.ReadOnlyField(source='car.name')

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = [
            'id','user','user_username','car_name','total_price','status','booked_at'
        ]
    def validate(self,data):
        """Custom validation to check for overlapping bookings and valid dates """
        pickup_date = data.get('pickup_date')
        return_date = data.get('return_date')
        car = data.get('car') # This 'car' will be the Car instance from the validated car ID

        required_text_fields = [
            'pickup_location',
            'return_location',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'city',
            'zip_code',
            'country',
        ]

        for field in required_text_fields:
            value = data.get(field)
            if not value or not str(value).strip():
                raise serializers.ValidationError({field: 'This field is required.'})
            data[field] = str(value).strip()

        phone = data.get('phone', '')
        if not re.fullmatch(r'\d{10}', phone):
            raise serializers.ValidationError({'phone': 'Phone number must be exactly 10 digits.'})

        if not data.get('agree_to_terms'):
            raise serializers.ValidationError({'agree_to_terms': 'You must agree to the terms and conditions.'})

        if not pickup_date or not return_date:
            raise serializers.ValidationError("Pickup date and return date are required")
        if pickup_date >= return_date:
            raise serializers.ValidationError("Return date must be after pickup date.")
        if car:
            overlapping_bookings = Booking.objects.filter(
                car=car,
                pickup_date__lt=return_date, # Booking starts before current ends
                return_date__gt=pickup_date, # Booking ends after current starts
            ).exclude(status__in=['cancelled','completed']) #Ignores the bookings that were cancelled or completed
            if self.instance:
                overlapping_bookings = overlapping_bookings.exclude(pk=self.instance.pk) #If I'm editing an existing booking, don't say that this very booking is an overlap with itself.
            if overlapping_bookings.exists():
                raise serializers.ValidationError({"dates":"This car is already booked for the selected dates."})
        return data # if all validation pass,return the data and book the car
        
