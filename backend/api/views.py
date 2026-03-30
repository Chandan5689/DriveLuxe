from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .serializers import CarSerializer, BookingSerializer, UserRegisterSerializer
from .models import Car, Booking

# ----------- User Register View --------
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny] #This allows anyone to register

    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data) #Get the serializer with data from the React frontend (request.data)
        serializer.is_valid(raise_exception=True) #Validate the data using the serializer. If invalid, it automatically sends a 400 Bad Request error.
        user = self.perform_create(serializer) # get the created user instance  # perform_create calls serializer.save()

        # Optionally create and return a token immediately upon registration
        # token, created = Token.objects.get_or_create(user=user)
        # response_data = {"message": "User registered successfully!", "token": token.key, "user_id": user.pk}

        response_data = {"message":"User registered sucessfully. Please login"}
        headers = self.get_success_headers(serializer.data)
        return Response(response_data,status=status.HTTP_201_CREATED,headers=headers)
    
#-------- User Login view--------
class LoginUserView(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    def post(self,request,*args,**kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})  # The ObtainAuthToken view has its own serializer that takes username and password and attempts to authenticate the user 
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user) # creates a new token if the user doesnot have have on already or it retrives their existing token.
        return Response({
            'token':token.key,
            'user_id':user.pk,
            'username':user.username,
            'email':user.email,
        })

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
    
        