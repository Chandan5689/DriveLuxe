import React from "react";
import { Link } from "react-router-dom";
function CTA() {
  return (
    <section className="py-20 bg-blue-500 text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Experience Luxury?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Book your premium vehicle today and elevate your journey with
          DriveLuxe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-gray-100 text-gray-800 px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300 hover:border-gray-100 hover:border-1 hover:bg-transparent hover:text-white hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
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
    </section>
  );
}

export default CTA;
