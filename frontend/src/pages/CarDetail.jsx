import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { getCarById } from "../data/carData";
import { useParams, Link } from "react-router-dom";
function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showGallery, setShowGallery] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsloading(true);
    setTimeout(() => {
      const fetchFoundCar = async () => {
        const foundCar = await getCarById(parseInt(id));

        if (foundCar) {
          setCar(foundCar);
        }
      };
      setIsloading(false);
      fetchFoundCar();
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>

            <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
              <div className="w-full h-96 bg-gray-300"></div>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!car) {
    return null;
  }

  const galleryImages = car.images && car.images.length > 0 ? car.images : [car.image];
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 ">
      <div className="mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <MdOutlineKeyboardArrowRight className="text-lg " />
          <a href="/cars" className="hover:text-blue-600 transition-colors">
            Cars
          </a>
          <MdOutlineKeyboardArrowRight className="text-lg " />
          <span className="text-gray-700 font-medium">{car.name}</span>
        </div>
        {/* Car details */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8 fade-in">
          <div className="relative">
            <img
              src={galleryImages[activeImageIndex]}
              alt={car.name}
              className="w-full h-96 sm:h-[460px] object-cover"
              onError={(e) => {e.target.src = car.image;}}
            />
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/80 backdrop-blur-sm text-gray-800 px-3 sm:px-4 py-2 rounded-md flex items-center hover:bg-white transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              View Gallery
            </button>
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium">
              {car.category}
            </div>
          </div>

          {/* Rating */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{car.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex mr-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(car.rating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {car.rating} ({car.reviews} reviews)
                  </span>
                </div>
              </div>
              {/* price and buttons */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center mt-4 md:mt-0">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  ${car.price}
                  <span className="text-gray-500 text-lg font-normal">
                    /day
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Includes insurance & taxes
                </p>
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                  <Link
                    to={`/booking/${car.id}`}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer text-sm sm:text-base text-center"
                  >
                    Book Now
                  </Link>
                  <Link
                    to="/about"
                    className="text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium transition-all duration-300 border-blue-600 border-1 cursor-pointer hover:bg-blue-50 text-sm sm:text-base text-center"
                  >
                    About Us
                  </Link>
                </div>
              </div>
              </div>
              {/* Quick info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  {
                    label: "Transmission",
                    value: car.transmission,
                    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
                  },
                  {
                    label: "Fuel Type",
                    value: car.fuelType,
                    icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  },
                  {
                    label: "Seats",
                    value: `${car.seats} Persons`,
                    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                  },
                  {
                    label: "Category",
                    value: car.category,
                    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg flex flex-col items-center text-center"
                  >
                    <svg
                      className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 mb-1 sm:mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      ></path>
                    </svg>
                    <span className="text-gray-500 text-xs sm:text-sm mb-1">
                      {item.label}
                    </span>
                    <span className="font-medium text-xs sm:text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  {["overview", "features", "specifications"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-4 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="py-4">
                  {activeTab === "overview" && (
                    <div className="slide-in">
                      <p className="text-gray-700 mb-4">{car.description}</p>
                      <p className="text-gray-700">
                        Experience the thrill of driving this exceptional
                        vehicle, meticulously maintained and ready for your
                        journey. Whether for a business trip, weekend getaway,
                        or special occasion, this {car.name} delivers
                        performance and style.
                      </p>
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div className="slide-in">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        {car.features.map((feature, index) => (
                          <li key={index} className="flex items-center py-1">
                            <svg
                              className="w-5 h-5 text-green-500 mr-2"
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
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div className="slide-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(car.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between py-2 border-b border-gray-100"
                            >
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
      {/* Image gallery model */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close gallery"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="relative">
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={car.name} 
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {e.target.src = car.image;}}
              />
            </div>
            
            <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <button 
                  key={index}
                  className={`flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded overflow-hidden border-2 transition-colors cursor-pointer ${
                    activeImageIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img 
                    src={image} 
                    alt={`${car.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetail;
