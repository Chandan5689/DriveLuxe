from django.contrib import admin
from .models import Car, Booking, ClerkIdentity


# Register your models here.

class CarsAdmin(admin.ModelAdmin):
    list_display = ['name','category']
admin.site.register(Car,CarsAdmin)

class BookingAdmin(admin.ModelAdmin):
    list_display = ['user','car']
admin.site.register(Booking,BookingAdmin)


@admin.register(ClerkIdentity)
class ClerkIdentityAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "clerk_user_id", "synced_at"]
    search_fields = ["user__username", "user__email", "clerk_user_id"]
    list_select_related = ["user"]

