import React, { useEffect, useRef, useState } from "react";
import {getCategories,getCarsByCategory,searchCars,} from "../data/carData";
import CarCard from "../components/ui/CarCard";
import { useSearchParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { useToast } from "../context/useToast";
function Cars() {
  const toast = useToast();
  const lastToastMessageRef = useRef("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [sortBy,setSortBy] = useState('default');
  // const [minPrice,setMinPrice] = useState(0);
  // const [maxPrice,setMaxPrice] = useState(1500);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //Initialize from URL params
  useEffect(() => {
    const fetchInitialData = async () => {
      const category = searchParams.get("category") || "All";
      const query = searchParams.get("query") || "";
      // const initialMinPrice = parseInt(searchParams.get("minPrice")) || 0;
      // const initialMaxPrice = parseInt(searchParams.get("maxPrice")) || 1500;
      setSelectedCategory(category);
      setSearchQuery(query);
      setErrorMessage("");
      // setMinPrice(initialMinPrice);
      // setMaxPrice(initialMaxPrice);
      try {
        const fetchedCategory = await getCategories();
        setCategories(fetchedCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(["All"]); // Fallback in case of error
        setErrorMessage("Some filters could not be loaded. You can still browse all cars.");
      }
      //Simulate loading effect
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    fetchInitialData();
  }, [searchParams]);

  //Fiter cars based on all criteria provided in the data
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      let results = [];
      try {
        setErrorMessage("");
        const carsByCategory = await getCarsByCategory(
          selectedCategory === "All" ? null : selectedCategory
        );
        results = carsByCategory;
        // Apply search query
        if (searchQuery) {
          const searchedCars = await searchCars(searchQuery);
          if (Array.isArray(searchedCars)) {
            results = searchedCars.filter((car) =>
              results.some((c) => c.id === car.id)
            );
          } else {
            console.error("searchCars did not return an array.");
            // Handle the non-array case, perhaps set results to an empty array
            results = [];
            setErrorMessage("Search is temporarily unavailable. Please try a different query.");
          }
        }
        //price filter 
        results = results.filter(
          (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
        );
        //applying sorting
        if (sortBy === 'price-asc') {
          results.sort((a,b)=> a.price -b.price)
        } else if (sortBy === 'price-desc') {
          results.sort((a,b)=> b.price - a.price);
        } else if(sortBy === 'name'){
          results.sort((a,b) => a.name.localeCompare(b.name));
        }else if (sortBy === 'rating'){
          results.sort((a,b)=> b.rating - a.rating);
        }
      } catch (error) {
        console.error("Error filtering cars:", error);
        results = [];
        setErrorMessage("We couldn't load cars right now. Please reset filters and try again.");
      } finally {
        setFilteredCars(results);
        setIsLoading(false);
      }
    };
    applyFilters();
  }, [selectedCategory, searchQuery, priceRange,sortBy]);

  //Update filters on change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }
    if (searchQuery) {
      params.set("query", searchQuery);
    }
    // if(minPrice !== 0){
    //   params.set("minPrice",minPrice.toString());
    // }
    // if(maxPrice !== 1500){
    //   params.set("maxPrice",maxPrice.toString());
    // }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  useEffect(() => {
    if (!errorMessage) {
      lastToastMessageRef.current = "";
      return;
    }

    if (lastToastMessageRef.current !== errorMessage) {
      toast.error(errorMessage);
      lastToastMessageRef.current = errorMessage;
    }
  }, [errorMessage, toast]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
  };
  const handleSortChange = (e) =>{
    setSortBy(e.target.value);
  }
  const handleReset = ()=>{
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0,1500]);
    setSortBy('default');
    setErrorMessage('');
    setSearchParams({});
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Our Luxury Fleet
          </h1>
          <p className="text-gray-600">
            Discover our collection of premium vehicles for any occasion
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters cars and search box */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <IoSearchOutline className='absolute right-3 top-2.5 w-5 h-5 text-gray-400' />

                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories &&
                    Array.isArray(categories) &&
                    categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>
              </div>
              {/* Price range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="30"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              {/* Reset button */}
              <div className="mb-6">
                  <button onClick={handleReset} className="bg-gray-200 w-full py-2 font-medium rounded-md text-gray-800 text-base cursor-pointer hover:bg-gray-300 transition-all duration-300 ease-out">
                    Reset Filters
                  </button>
              </div>
            </div>
          </div>

          {/* Car listing */}
          <div className="lg:w-3/4">
            {errorMessage && (
              <div
                className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                role="alert"
              >
                <p className="text-sm font-medium">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-medium">{filteredCars.length}</span>{" "}
                    vehicles
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car, index) => (
                    <div
                      key={car.id}
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CarCard car={car} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <HiOutlineEmojiSad className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any cars matching your criteria. Try
                  adjusting your filters.
                </p>
                <button onClick={handleReset} className="bg-blue-500 w-full py-2 font-medium rounded-md text-base cursor-pointer text-white hover:bg-blue-600 transition-all duration-300 ease-out">
                    Reset Filters
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cars;
