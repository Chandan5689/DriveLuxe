import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getCarById, getCars } from "../../data/carData";
import { AuthContext } from "../../context/authContextValue";
import { API_ENDPOINTS } from "../../config/api";
import { useToast } from "../../context/useToast";
const Booking = () => {
  const useAuth = () => useContext(AuthContext);
  const { getAuthToken } = useAuth();
  const toast = useToast();
  const { id } = useParams();
  const [selectedCar, setSelectedCar] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    specialRequests: "",
    agreeToTerms: false,
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set minimum dates for pickup and return
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minPickupDate = formatDate(today);
  const minReturnDate = formatDate(tomorrow);

  const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    if (Array.isArray(payload)) return payload.join(" ").trim() || fallback;
    if (typeof payload === "object") {
      if (typeof payload.detail === "string" && payload.detail.trim()) {
        return payload.detail;
      }
      const flattened = Object.values(payload).flat().join(" ").trim();
      return flattened || fallback;
    }
    return fallback;
  };

  useEffect(() => {
    const fetchCarData = async () => {
      setIsLoading(true);
      try {
        // If ID is provided, fetch specific car
        if (id) {
          const car = await getCarById(id);
          if (car) {
            setSelectedCar(car);
          }
        }

        // Fetch all cars
        const cars = await getCars();
        setAvailableCars(cars);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
        setAvailableCars([]);
        toast.error("Unable to load available vehicles right now. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, [id, toast]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const normalizedValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setBookingData({
      ...bookingData,
      [name]: type === "checkbox" ? checked : normalizedValue,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!selectedCar) {
        newErrors.car = "Please select a car";
      }
      if (!bookingData.pickupDate) {
        newErrors.pickupDate = "Pickup date is required";
      }
      if (!bookingData.returnDate) {
        newErrors.returnDate = "Return date is required";
      } else if (bookingData.returnDate <= bookingData.pickupDate) {
        newErrors.returnDate = "Return date must be after pickup date";
      }
      if (!bookingData.pickupLocation.trim()) {
        newErrors.pickupLocation = "Pickup location is required";
      }
      if (!bookingData.returnLocation.trim()) {
        newErrors.returnLocation = "Return location is required";
      }
    } else if (step === 2) {
      if (!bookingData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!bookingData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      const normalizedEmail = bookingData.email.trim();
      const normalizedPhone = bookingData.phone.replace(/\D/g, "");

      if (!normalizedEmail) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
        newErrors.email = "Email is invalid";
      }
      if (!normalizedPhone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(normalizedPhone)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
      if (!bookingData.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!bookingData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!bookingData.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required";
      }
      if (!bookingData.country.trim()) {
        newErrors.country = "Country is required";
      }
    } else if (step === 3) {
      if (!bookingData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    const apiUrl = API_ENDPOINTS.BOOKINGS;

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car: selectedCar?.id,
          pickup_date: bookingData.pickupDate,
          return_date: bookingData.returnDate,
          pickup_location: bookingData.pickupLocation.trim(),
          return_location: bookingData.returnLocation.trim(),
          first_name: bookingData.firstName.trim(),
          last_name: bookingData.lastName.trim(),
          email: bookingData.email.trim(),
          phone: bookingData.phone.replace(/\D/g, ""),
          address: bookingData.address.trim(),
          city: bookingData.city.trim(),
          zip_code: bookingData.zipCode.trim(),
          country: bookingData.country.trim(),
          special_requests: bookingData.specialRequests.trim(),
          agree_to_terms: bookingData.agreeToTerms,
        }),
      });

      const responseIsJson =
        response.headers.get("content-type")?.includes("application/json") ||
        false;
      const data = responseIsJson ? await response.json() : null;

      if (response.ok) {
        setBookingComplete(true);
        setBookingData(data);
        toast.success("Booking confirmed successfully.");
      } else {
        toast.error(
          extractErrorMessage(data, "Booking failed. Please check your details and try again.")
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error?.message ||
          "We could not complete your booking. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate rental duration and total price
  const calculateRentalDetails = () => {
    if (!selectedCar || !bookingData.pickupDate || !bookingData.returnDate) {
      return { days: 0, totalPrice: 0 };
    }

    const pickup = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    const diffTime = Math.abs(returnDate - pickup);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days,
      totalPrice: days * selectedCar.price,
    };
  };

  const { days, totalPrice } = calculateRentalDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Booking{" "}
              <span
                className={
                  bookingData.status === "pending"
                    ? "text-yellow-600"
                    : bookingData.status === "confirmed"
                    ? "text-blue-600"
                    : bookingData.status === "completed"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {bookingData.status}
              </span>
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for booking. We will send a confirmation email to{" "}
              {bookingData.email} after the booking is confirmed.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-gray-500 text-sm">Booking ID</p>
                  <p className="font-medium">#{bookingData.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Vehicle</p>
                  <p className="font-medium">{bookingData.car_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pickup Date</p>
                  <p className="font-medium">{bookingData.pickup_date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Return Date</p>
                  <p className="font-medium">{bookingData.return_date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pickup Location</p>
                  <p className="font-medium">{bookingData.pickup_location}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Return Location</p>
                  <p className="font-medium">{bookingData.return_location}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="font-bold text-blue-600">${bookingData.total_price}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-green-600 font-medium">
                    {bookingData.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors">
                <Link to="/">Return to Home</Link>
              </button>

              <button className="bg-gray-200 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors">
                <Link to="/cars">Browse More Cars</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Book Your Luxury Car</h1>
          <p className="text-gray-600 mb-8">
            Complete the form below to reserve your vehicle
          </p>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: "Vehicle & Dates" },
                { step: 2, label: "Personal Details" },
                { step: 3, label: "Review & Payment" },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= item.step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > item.step ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      currentStep >= item.step
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Vehicle & Dates */}
            {currentStep === 1 && (
              <div className="fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Select Vehicle
                      </h2>

                      {selectedCar ? (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center">
                          <img
                            src={selectedCar.image}
                            alt={selectedCar.name}
                            className="w-24 h-16 object-cover rounded mr-4"
                          />
                          <div className="flex-grow">
                            <h3 className="font-medium">{selectedCar.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {selectedCar.category} •{" "}
                              {selectedCar.transmission} • {selectedCar.seats}{" "}
                              Seats
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              ${selectedCar.price}
                              <span className="text-gray-500 text-sm font-normal">
                                /day
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedCar(null)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-4 text-gray-600">
                            Please select a vehicle from our fleet:
                          </p>
                          {availableCars.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                              {availableCars.map((car) => (
                                <button
                                  key={car.id}
                                  type="button"
                                  onClick={() => handleCarSelect(car)}
                                  className="bg-gray-50 rounded-lg p-3 flex items-center hover:bg-gray-100 transition-colors text-left"
                                >
                                  <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-20 h-14 object-cover rounded mr-3"
                                  />
                                  <div className="flex-grow">
                                    <h3 className="font-medium text-sm">
                                      {car.name}
                                    </h3>
                                    <p className="text-gray-600 text-xs">
                                      {car.category}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-blue-600">
                                      ${car.price}
                                      <span className="text-gray-500 text-xs font-normal">
                                        /day
                                      </span>
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                              No vehicles are available at the moment. Please try again shortly.
                            </div>
                          )}
                          {errors.car && (
                            <p className="text-red-600 text-sm mt-2">
                              {errors.car}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Rental Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="pickupDate"
                          >
                            Pickup Date*
                          </label>
                          <input
                            type="date"
                            id="pickupDate"
                            name="pickupDate"
                            required
                            min={minPickupDate}
                            value={bookingData.pickupDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.pickupDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.pickupDate && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.pickupDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="returnDate"
                          >
                            Return Date*
                          </label>
                          <input
                            type="date"
                            id="returnDate"
                            name="returnDate"
                            required
                            min={bookingData.pickupDate || minReturnDate}
                            value={bookingData.returnDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.returnDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.returnDate && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.returnDate}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="pickupLocation"
                          >
                            Pickup Location*
                          </label>
                          <select
                            id="pickupLocation"
                            name="pickupLocation"
                            required
                            value={bookingData.pickupLocation}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.pickupLocation
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select location</option>
                            <option value="Downtown Office">
                              Downtown Office
                            </option>
                            <option value="Airport Terminal">
                              Airport Terminal
                            </option>
                            <option value="Hotel Delivery">
                              Hotel Delivery
                            </option>
                            <option value="Beverly Hills Branch">
                              Beverly Hills Branch
                            </option>
                          </select>
                          {errors.pickupLocation && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.pickupLocation}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="returnLocation"
                          >
                            Return Location*
                          </label>
                          <select
                            id="returnLocation"
                            name="returnLocation"
                            required
                            value={bookingData.returnLocation}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.returnLocation
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select location</option>
                            <option value="Downtown Office">
                              Downtown Office
                            </option>
                            <option value="Airport Terminal">
                              Airport Terminal
                            </option>
                            <option value="Hotel Pickup">Hotel Pickup</option>
                            <option value="Beverly Hills Branch">
                              Beverly Hills Branch
                            </option>
                          </select>
                          {errors.returnLocation && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.returnLocation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                      <h2 className="text-xl font-semibold mb-4">
                        Booking Summary
                      </h2>

                      {selectedCar ? (
                        <div>
                          <div className="mb-4">
                            <img
                              src={selectedCar.image}
                              alt={selectedCar.name}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-lg">
                              {selectedCar.name}
                            </h3>
                            <p className="text-gray-600">
                              {selectedCar.category}
                            </p>
                          </div>

                          <div className="border-t border-b border-gray-200 py-4 mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Daily Rate:</span>
                              <span className="font-medium">
                                ${selectedCar.price}/day
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">
                                Rental Duration:
                              </span>
                              <span className="font-medium">{days} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Insurance:</span>
                              <span className="font-medium">Included</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold">
                              Total:
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                              ${totalPrice}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            ></path>
                          </svg>
                          <p>
                            Please select a vehicle to see the booking summary
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!selectedCar || isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6 cursor-pointer"
                      >
                        Continue to Personal Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <div className="fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Personal Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="firstName"
                          >
                            First Name*
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={bookingData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="lastName"
                          >
                            Last Name*
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={bookingData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="email"
                          >
                            Email Address*
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={bookingData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="phone"
                          >
                            Phone Number*
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            placeholder="Enter 10-digit phone number"
                            value={bookingData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-medium mb-2"
                          htmlFor="address"
                        >
                          Address*
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          value={bookingData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.address
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.address && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="city"
                          >
                            City*
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={bookingData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.city && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="zipCode"
                          >
                            ZIP Code*
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            required
                            value={bookingData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.zipCode
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.zipCode && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.zipCode}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="country"
                          >
                            Country*
                          </label>
                          <select
                            id="country"
                            name="country"
                            required
                            value={bookingData.country}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.country
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select country</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Italy">Italy</option>
                            <option value="Spain">Spain</option>
                            <option value="Japan">Japan</option>
                          </select>
                          {errors.country && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.country}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label
                          className="block text-gray-700 text-sm font-medium mb-2"
                          htmlFor="specialRequests"
                        >
                          Special Requests (Optional)
                        </label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          rows="3"
                          value={bookingData.specialRequests}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Any special requirements or requests..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                      <h2 className="text-xl font-semibold mb-4">
                        Booking Summary
                      </h2>

                      {selectedCar && (
                        <div>
                          <div className="mb-4">
                            <img
                              src={selectedCar.image}
                              alt={selectedCar.name}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-lg">
                              {selectedCar.name}
                            </h3>
                            <p className="text-gray-600">
                              {selectedCar.category}
                            </p>
                          </div>

                          <div className="border-t border-gray-200 py-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Pickup Date:
                              </span>
                              <span className="font-medium">
                                {bookingData.pickupDate || "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Return Date:
                              </span>
                              <span className="font-medium">
                                {bookingData.returnDate || "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Pickup Location:
                              </span>
                              <span className="font-medium">
                                {bookingData.pickupLocation || "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Return Location:
                              </span>
                              <span className="font-medium">
                                {bookingData.returnLocation || "Not selected"}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-b border-gray-200 py-4 mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Daily Rate:</span>
                              <span className="font-medium">
                                ${selectedCar.price}/day
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">
                                Rental Duration:
                              </span>
                              <span className="font-medium">{days} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Insurance:</span>
                              <span className="font-medium">Included</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold">
                              Total:
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                              ${totalPrice}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          disabled={isSubmitting}
                          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-400 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          disabled={isSubmitting}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Payment */}
            {currentStep === 3 && (
              <div className="fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Review Your Booking
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">
                            Vehicle Details
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-3">
                              <img
                                src={selectedCar.image}
                                alt={selectedCar.name}
                                className="w-20 h-14 object-cover rounded mr-3"
                              />
                              <div>
                                <h4 className="font-medium">
                                  {selectedCar.name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {selectedCar.category}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Transmission:
                                </span>
                                <span className="ml-1 font-medium">
                                  {selectedCar.transmission}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Fuel Type:
                                </span>
                                <span className="ml-1 font-medium">
                                  {selectedCar.fuelType}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Seats:</span>
                                <span className="ml-1 font-medium">
                                  {selectedCar.seats}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Daily Rate:
                                </span>
                                <span className="ml-1 font-medium">
                                  ${selectedCar.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">
                            Rental Period
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Pickup Date:
                                </span>
                                <span className="ml-1 font-medium">
                                  {bookingData.pickupDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Return Date:
                                </span>
                                <span className="ml-1 font-medium">
                                  {bookingData.returnDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Pickup Location:
                                </span>
                                <span className="ml-1 font-medium">
                                  {bookingData.pickupLocation}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Return Location:
                                </span>
                                <span className="ml-1 font-medium">
                                  {bookingData.returnLocation}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-1 font-medium">
                                  {days} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">
                          Personal Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
                            <div>
                              <span className="text-gray-500">Name:</span>
                              <span className="ml-1 font-medium">
                                {bookingData.firstName} {bookingData.lastName}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <span className="ml-1 font-medium">
                                {bookingData.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <span className="ml-1 font-medium">
                                {bookingData.phone}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Country:</span>
                              <span className="ml-1 font-medium">
                                {bookingData.country}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">Address:</span>
                              <span className="ml-1 font-medium">
                                {bookingData.address}, {bookingData.city},{" "}
                                {bookingData.zipCode}
                              </span>
                            </div>
                            {bookingData.specialRequests && (
                              <div className="col-span-2">
                                <span className="text-gray-500">
                                  Special Requests:
                                </span>
                                <span className="ml-1 font-medium">
                                  {bookingData.specialRequests}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">
                          Payment Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-600 mb-4">
                            For demo purposes, no actual payment will be
                            processed. In a real application, a secure payment
                            form would be displayed here.
                          </p>

                          <div className="flex items-center mb-4">
                            <div className="flex space-x-2">
                              {["visa", "mastercard", "amex", "discover"].map(
                                (card) => (
                                  <div
                                    key={card}
                                    className="w-10 h-6 bg-white rounded border border-gray-300 flex items-center justify-center"
                                  >
                                    <span className="text-xs font-medium text-gray-700">
                                      {card === "visa" && "Visa"}
                                      {card === "mastercard" && "MC"}
                                      {card === "amex" && "Amex"}
                                      {card === "discover" && "Disc"}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                            <span className="ml-3 text-sm text-gray-600">
                              All major credit cards accepted
                            </span>
                          </div>

                          <div className="mb-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={bookingData.agreeToTerms}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                I agree to the{" "}
                                <a
                                  href="#"
                                  className="text-blue-600 hover:underline"
                                >
                                  Terms and Conditions
                                </a>{" "}
                                and{" "}
                                <a
                                  href="#"
                                  className="text-blue-600 hover:underline"
                                >
                                  Privacy Policy
                                </a>
                              </span>
                            </label>
                            {errors.agreeToTerms && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.agreeToTerms}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                      <h2 className="text-xl font-semibold mb-4">
                        Booking Summary
                      </h2>

                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={selectedCar.image}
                            alt={selectedCar.name}
                            className="w-16 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <h3 className="font-medium">{selectedCar.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {selectedCar.category}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pickup:</span>
                            <span className="font-medium">
                              {bookingData.pickupDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Return:</span>
                            <span className="font-medium">
                              {bookingData.returnDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{days} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rental Charge:</span>
                          <span className="font-medium">
                            ${selectedCar.price} × {days} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            ${selectedCar.price * days}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">Included</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxes & Fees:</span>
                          <span className="font-medium">Included</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ${totalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-4">
                        <button
                          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors mt-6 cursor-pointer"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing Booking..." : "Confirm & Pay"}
                        </button>
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          disabled={isSubmitting}
                          className="w-full bg-gray-200 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-400 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
