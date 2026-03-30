import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GiGearStick } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsFuelPumpFill } from "react-icons/bs";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { AuthContext } from "../../context/authContextValue";

function CarCard({ car }) {
  const useAuth = () => useContext(AuthContext);
  const { isAuthenticated} = useAuth();
  const {
    id,
    name,
    image,
    price,
    category,
    transmission,
    fuelType,
    seats,
    rating,
  } = car;
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            {isAuthenticated ? (
              <div>
                <Link
                  to={`/booking/${id}`}
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center block font-medium hover:bg-blue-700 transition-colors
            "
                >
                  Book Now
                </Link>
                
              </div>
            ) : (
              <div className="text-white">
                <h2>Please log in to continue booking.</h2>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium capitalize">
          {category}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold overflow-ellipsis">{name}</h3>
          <div className="text-blue-600 font-bold">
            ${price}
            <span className="text-gray-500 text-sm font-normal">/day</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center text-sm text-gray-600 capitalize font-medium">
            <GiGearStick className="mr-1 text-gray-500 text-base" />
            {transmission}
          </div>
          <div className="flex items-center text-sm text-gray-600 capitalize font-medium ml-1">
            <BsFuelPumpFill className="mr-1 text-gray-500 text-base" />
            {fuelType}
          </div>
          <div className="flex items-center text-sm text-gray-600 capitalize font-medium">
            <HiOutlineUserGroup className="mr-1 text-gray-500 text-base" />
            {seats} Seats
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Link
            to={`/cars/${id}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
          >
            View Details
            <FaArrowRight className="ml-1 mt-1 text-base" />
          </Link>

          <div className="flex items-center">
            <FaStar className="text-yellow-500 text-sm" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
