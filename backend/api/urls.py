from django.urls import path,include
from .views import RegisterUserView,LoginUserView,BookingListCreateView,CarViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')

urlpatterns = [
    path('register/',RegisterUserView.as_view(),name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    # path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('',include(router.urls)),
]

