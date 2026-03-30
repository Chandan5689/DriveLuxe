import React, { useEffect } from "react";
import { getCars, getCategories } from "../../../data/carData";
import { useState } from "react";
import { Link } from "react-router-dom";
import SectionIntro from "../../../components/ui/SectionIntro";
function BrowseCategory() {
  const [categoryCards, setCategoryCards] = useState([]);

  const getCategoryDescription = (category) => {
    if (category === "Luxury") return "Experience ultimate comfort and elegance";
    if (category === "Sports") return "Feel the thrill of high performance";
    if (category === "SUV") return "Spacious vehicles for any adventure";
    if (category === "Electric") return "Eco-friendly with cutting-edge tech";
    if (category === "Supercar") return "Extraordinary power and design";
    if (category === "Ultra Luxury" || category === "Ultra luxury") {
      return "The pinnacle of automotive excellence";
    }
    return "Explore our premium collection";
  };

  const getFallbackImage = (category) =>
    `https://placehold.co/600x400?text=${encodeURIComponent(category + " Car")}`;

  useEffect(()=>{
    const fetchCategories = async () => {
      try {
        const [fetchedCategories, cars] = await Promise.all([getCategories(), getCars()]);
        const filteredCategories = fetchedCategories.filter((cat) => cat !== "All");

        const cards = filteredCategories.map((category) => {
          const matchingCar = cars.find((car) => car.category === category);
          return {
            name: category,
            image: matchingCar?.image || getFallbackImage(category),
            description: getCategoryDescription(category),
          };
        });

        setCategoryCards(cards);
      } catch (error) {
        console.error("Failed to load category cards:", error);
      }
    };
    fetchCategories();
    
  },[])
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto px-4 md:px-6">
        <SectionIntro
          eyebrow="Explore"
          title="Browse by Category"
          description="Find the perfect vehicle for any occasion, from business trips to weekend getaways."
          className="mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((category)=>(
            <Link to={`/cars?category=${encodeURIComponent(category.name)}`} key={category.name} className="group relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
               <img 
                  src={category.image}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImage(category.name);
                  }}
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-sm">{category.description}</p>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseCategory;
