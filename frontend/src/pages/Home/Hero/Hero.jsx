import React from "react";
import { Link } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa6";
import { IoIosArrowRoundDown } from "react-icons/io";
function Hero({isVisible}) {
  return (
    <section className="relative w-full h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Car"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container px-4 md:px-6 relative z-20">
        <div className="max-w-2xl">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Experience Luxury on Wheels
          </h1>
          <p
            className={`text-lg md:text-xl text-gray-200 mb-8 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Rent premium vehicles for any occasion. From sleek sports cars to
            elegant sedans, we offer the finest selection of luxury automobiles.
          </p>
          <div
            className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <button
              className="bg-blue-600 text-white px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
              type="button"
            >
              <Link to="/cars">Browse Cars</Link>
            </button>
            <button
              className="bg-transparent text-white px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300 border-gray-100 border-1 cursor-pointer hover:bg-gray-50 hover:text-gray-800"
              type="button"
            >
              <Link to="/booking">Book Now</Link>
            </button>
          </div>
        </div>
      </div>

      {/* scroll to features */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 animate-bounce">
        <a href="#features" className="text-white ">
          <IoIosArrowRoundDown className="text-5xl" />
        </a>
      </div>
    </section>
  );
}

export default Hero;
