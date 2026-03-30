import React, { useEffect, useState } from "react";

import Hero from "./Hero/Hero";
import Features from "./Features/Features";
import FeaturedCars from "./FeaturedCars/FeaturedCars";
import BrowseCategory from "./BrowseCategory/BrowseCategory";
import CTA from "../../components/layout/CTA";
import Testimonial from "./Testimonials/Testimonial";
function Home() {
  const [isVisible,setIsVisible] = useState(false)
  
  useEffect(()=>{
    
    const timer = setTimeout(() => {
      setIsVisible(true)
    },100);
    return ()=> clearTimeout(timer);
},[])
  return (
    <div className="min-h-screen w-full">
      {/* Hero section */}
      <Hero isVisible={isVisible}/>

      {/* Features section */}
      <Features />

      {/* Featured cars section */}
      <FeaturedCars />

      {/* Browse ny category section */}
      <BrowseCategory />
      
      {/* Testimonials section */}
        <Testimonial />
      {/* CTA section */}
      <CTA />
    </div>
  );
}

export default Home;
