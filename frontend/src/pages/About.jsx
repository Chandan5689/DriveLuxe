import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdWorkspacePremium } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import SectionIntro from "../components/ui/SectionIntro";

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      icon: MdWorkspacePremium,
      title: "Curated Premium Fleet",
      description:
        "Each vehicle is selected for design, comfort, performance, and reliability.",
    },
    {
      icon: FaShieldAlt,
      title: "Trust and Transparency",
      description:
        "Clear pricing, verified condition checks, and dedicated support at every step.",
    },
    {
      icon: GiSteeringWheel,
      title: "Experience First",
      description:
        "From pickup to return, we focus on frictionless booking and premium convenience.",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "DriveLuxe Launched",
      description: "Started with a small luxury fleet and a big service vision.",
    },
    {
      year: "2025",
      title: "Expanded Categories",
      description: "Introduced sports, SUV, supercar, and electric collections.",
    },
    {
      year: "2026",
      title: "Concierge Booking",
      description: "Added personalized booking support and faster confirmations.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-20 -left-16 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-20 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-70"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6 py-14 md:py-18">
          <div className="max-w-4xl mx-auto text-center">
            <p
              className={`uppercase tracking-[0.20em] text-blue-600 text-xs md:text-sm font-semibold mb-5 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              About DriveLuxe
            </p>
            <h1
              className={`text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-[1.05] mb-6 transition-all duration-700 delay-150 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Premium Cars.
              <span className="block bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Purposeful Service.
              </span>
            </h1>
            <p
              className={`text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              DriveLuxe was created to make luxury mobility simple, reliable, and memorable.
              We focus on elegant vehicles, transparent service, and a booking experience that feels
              smooth from start to finish.
            </p>
            <div
              className={`w-28 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mx-auto mt-8 transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            ></div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <SectionIntro
              eyebrow="Our Story"
              title={
                <>
                  Built Around Confidence,
                  <span className="block">Driven by Excellence.</span>
                </>
              }
              align="left"
              className="mb-5"
            />
            <p className="text-gray-600 text-base md:text-lg mb-4 leading-relaxed">
              What started as a focused premium-rental service has evolved into a
              trusted platform for travelers, professionals, and enthusiasts.
              We continuously refine our fleet and service standards so every client
              gets reliability without compromise.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We believe luxury should feel welcoming, not complicated. That is why
              our team combines modern booking simplicity with concierge-level care.
            </p>
          </div>

          <div
            className={`bg-gray-900 rounded-2xl p-7 md:p-9 text-white shadow-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">What You Can Expect</h3>
            <div className="space-y-4">
              {[
                "Professionally maintained, premium-class vehicles",
                "Fast, transparent booking and confirmation process",
                "Flexible rental windows for real-life schedules",
                "Support team that responds with urgency and clarity",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <IoCheckmarkDoneCircle className="text-blue-400 text-xl mt-0.5" />
                  <p className="text-gray-200 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionIntro
            eyebrow="Our Values"
            title="The Principles Behind Every Ride"
            description="We measure success by how confidently and comfortably our clients move."
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 text-3xl flex items-center justify-center mb-5">
                  <value.icon />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionIntro
            eyebrow="Timeline"
            title="Our Journey"
            description="A clear path of growth focused on better vehicles and better service."
            className="mb-12"
          />

          <div className="max-w-4xl mx-auto space-y-5">
            {milestones.map((item, index) => (
              <div
                key={item.year}
                className={`bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="text-blue-600 font-bold text-2xl md:w-28">{item.year}</div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <SectionIntro
            eyebrow="Get Started"
            title="Ready for Your Next Premium Drive?"
            description="Browse the fleet, compare options, and book the car that fits your next journey."
            tone="light"
            className="mb-8"
          />
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/cars"
              className="bg-white text-blue-700 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Cars
            </Link>
            <Link
              to="/booking"
              className="border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;