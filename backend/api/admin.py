from django.contrib import admin
from .models import Car,Booking
# Register your models here.

class CarsAdmin(admin.ModelAdmin):
    list_display = ['name','category']
admin.site.register(Car,CarsAdmin)

class BookingAdmin(admin.ModelAdmin):
    list_display = ['user','car']
admin.site.register(Booking,BookingAdmin)

