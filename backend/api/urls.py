from django.urls import path,include
from .views import BookingListCreateView,CarViewSet,AuthSyncView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')

urlpatterns = [
    path('auth/sync/', AuthSyncView.as_view(), name='auth-sync'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    # path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('',include(router.urls)),
]

