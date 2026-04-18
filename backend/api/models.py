from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.

class Car(models.Model):
    Category_Choices = [
        ('Electric','Electric'),
        ('Luxury','Luxury'),
        ('SUV','SUV'),
        ('Sports','Sports'),
        ('Supercar','Supercar'),
        ('Ultra luxury','Ultra Luxury'),
    ]
    Transmission_Choices = [
        ('Automatic','Automatic'),
        ('Manual','Manual'),
        ('IMT','Intelligent Manual Transmission')
    ]
    
    FuelType_Choices = [
        ('Electric','Electric'),
        ('Petrol','Petrol'),
        ('Diesel','Diesel'),
        ('Hydrogen','Hydrogen'),
        ('Hybrid','Hybrid')
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100,choices=Category_Choices,default='Electric')
    price = models.DecimalField(max_digits=6,decimal_places=2)
    # image = models.ImageField(upload_to="projects/",null=False)
    image = models.TextField()
    transmission = models.CharField(max_length=20,choices=Transmission_Choices,default='Automatic')
    fuelType = models.CharField(max_length=30,choices=FuelType_Choices,default='Electric')
    seats = models.IntegerField()
    description = models.TextField()
    features = models.JSONField(default=list) # List of strings
    specifications = models.JSONField(default=dict)   # Dict with key-value pairs
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField()

    def __str__(self):
        return f"{self.name}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE,related_name='bookings')
    pickup_date = models.DateField()
    return_date = models.DateField()
    pickup_location = models.CharField(max_length=255,default="Airport Terminal")
    return_location = models.CharField(max_length=255,default="Airport Terminal")
    first_name = models.CharField(max_length=50,default='Eg:John')
    last_name = models.CharField(max_length=50,default='Eg:Doe')
    email = models.EmailField(default='example@gmail.com')
    phone = models.CharField(max_length=20,default='+1234567890')
    address = models.TextField(default="address")
    city = models.CharField(max_length=100,default='Pokhara')
    zip_code = models.CharField(max_length=20,default='33210')
    country = models.CharField(max_length=100,default='Nepal')
    special_requests = models.TextField(blank=True)
    agree_to_terms = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    total_price = models.DecimalField(max_digits=10, decimal_places=2,default=00.00,null=True)
    booked_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50,choices=[
        ('pending','Pending'),
        ('confirmed','Confirmed'),
        ('cancelled','Cancelled'),
        ('completed','Completed'),
    ],
    default='pending'
    )
    class Meta:
        ordering = ['-booked_at']

    def __str__(self):
        return f"Booking of {self.car.name} by {self.user.username} from {self.pickup_date} to {self.return_date}"
    
    def save(self, *args, **kwargs):
        if self.pickup_date and self.return_date and self.car and self.car.price:
            num_days = (self.return_date - self.pickup_date).days
            self.total_price = self.car.price*max(1,num_days) # at least 1 day
        super().save(*args, **kwargs)


class ClerkIdentity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='clerk_identity')
    clerk_user_id = models.CharField(max_length=255, unique=True, db_index=True)
    synced_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.clerk_user_id})"

