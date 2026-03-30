import React from "react";
import { MdWorkspacePremium } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BiDollarCircle } from "react-icons/bi";
import SectionIntro from "../../../components/ui/SectionIntro";
function Features() {
    const features = [
        {
            icon:MdWorkspacePremium,
            title:'Premium Selection',
            description:'Choose from our curated collection of luxury and exotic vehicles from top manufacturers.'
        },
        {
            icon:IoMdTime,
            title:'Flexible Rentals',
            description:'Rent by the day, week, or month with convenient pickup and drop-off options.'
        },
        {
            icon:HiOutlineUserGroup ,
            title:'Personalized Service',
            description:'Our concierge team ensures a seamless experience from booking to return.'
        },
        {
            icon:BiDollarCircle,
            title:'Transparent Pricing',
            description:'No hidden fees or surprises. Our rates include insurance and premium features.'
        },
    ]
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionIntro
          eyebrow="Why DriveLuxe"
          title="Why Choose DriveLuxe"
          description="We offer a premium car rental experience with exceptional service and the finest vehicles."
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature,index)=>(
                <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-50 rounded-full w-14 h-14 text-blue-600 text-[32px]">
                 {<feature.icon />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
            </div>
            ))}
            

        </div>
      </div>
    </section>
  );
}

export default Features;
