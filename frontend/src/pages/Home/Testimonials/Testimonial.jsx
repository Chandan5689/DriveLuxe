import React from 'react'
import SectionIntro from '../../../components/ui/SectionIntro';

function Testimonial() {
  return (
   <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionIntro
            eyebrow="Testimonials"
            title="What Our Customers Say"
            description="Hear from clients who have experienced our premium rental service."
            tone="light"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Michael Thompson',
                role: 'Business Executive',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                quote: 'DriveLuxe provided an exceptional experience for my business trip. The BMW 5 Series was immaculate and the service was top-notch.'
              },
              {
                name: 'Sophia Rodriguez',
                role: 'Travel Blogger',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                quote: 'I\'ve rented luxury cars worldwide, and DriveLuxe stands out for their attention to detail and stunning vehicle selection. Highly recommended!'
              },
              {
                name: 'James Wilson',
                role: 'Photographer',
                image: 'https://randomuser.me/api/portraits/men/67.jpg',
                quote: 'The Porsche 911 I rented was the highlight of my California road trip. Easy booking process and fantastic customer service.'
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonial