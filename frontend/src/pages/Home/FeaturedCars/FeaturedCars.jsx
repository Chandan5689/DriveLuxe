import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import { getCars } from "../../../data/carData";
import CarCard from "../../../components/ui/CarCard";
import SectionIntro from "../../../components/ui/SectionIntro";
function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading,setLoading] = useState(true);
  // const [featuredCars, setFeaturedCars] = useState([]);

  //  useEffect(()=>{
  //     setFeaturedCars(cars);
  //   },[])
  useEffect(() => {
    getCars()
    .then(data => {
      setCars(data.slice(0,4));
      setLoading(false);
    })
    .catch(error =>{
      console.error("Error while fetching the cars",error);
      setLoading(false)
    })
    },[]);

  if(loading) return <p>Loading cars .....</p>
  
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
          <button
              className="border-blue-600 border-1 text-blue-600 px-6 md:px-8 py-3 rounded-md font-medium transition-all duration-300  hover:shadow-lg hover:bg-blue-50 cursor-pointer"
              type="button"
            >
              <Link to="/cars">View All Cars</Link>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map(car =>(
            <div key={car.id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCars;
