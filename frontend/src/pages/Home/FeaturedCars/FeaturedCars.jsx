import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCars } from "../../../data/carData";
import CarCard from "../../../components/ui/CarCard";
import SectionIntro from "../../../components/ui/SectionIntro";
import { useToast } from "../../../context/useToast";

function FeaturedCars() {
  const toast = useToast();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFeaturedCars = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getCars();
      if (!Array.isArray(data)) {
        setCars([]);
        setErrorMessage("Featured vehicles are temporarily unavailable.");
        return;
      }
      setCars(data.slice(0, 4));
    } catch (error) {
      console.error("Error while fetching the cars", error);
      setCars([]);
      setErrorMessage("Unable to load featured vehicles right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage, toast]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <SectionIntro
              eyebrow="Popular Picks"
              title="Featured Vehicles"
              description="Explore our most popular luxury rentals."
              align="left"
            />
            <Link
              to="/cars"
              className="border-blue-600 border text-blue-600 px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
            >
              View All Cars
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <SectionIntro
            eyebrow="Popular Picks"
            title="Featured Vehicles"
            description="Explore our most popular luxury rentals."
            align="left"
          />
          <Link
            to="/cars"
            className="border-blue-600 border text-blue-600 px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
          >
            View All Cars
          </Link>
        </div>

        {errorMessage && (
          <div
            className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            role="alert"
          >
            <p className="text-sm font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchFeaturedCars}
              className="inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>

        {!errorMessage && cars.length === 0 && (
          <div className="mt-6 rounded-md border border-gray-200 bg-white px-4 py-6 text-center text-gray-600">
            No featured vehicles are available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedCars;
