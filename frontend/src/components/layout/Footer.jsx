import React from 'react'
import { Link } from 'react-router-dom';
import { MdFacebook} from "react-icons/md";
import { FaInstagram,FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope, FaLocationDot,FaXTwitter } from "react-icons/fa6";
function Footer() {
 const currentYear = new Date().getFullYear();
 const socialMedia = [
  {
    id:1,
    icon:MdFacebook,
    link:'https://www.facebook.com/'
  },
  {
    id:2,
    icon:FaXTwitter,
    link:'https://x.com//'
  },
  {
    id:3,
    icon:FaInstagram,
    link:'https://www.instagram.com/'
  },
  {
    id:4,
    icon:FaLinkedin,
    link:'https://www.linkedin.com/in/chandan-tiwari-634097369/'
  },
 ]
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-blue-500">Drive</span>Luxe
            </h3>
            <p className="text-gray-400 mb-4">
              Premium car rental service providing luxury and comfort for your journeys.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {socialMedia.map((social) => (
                <a 
                  key={social.id}
                  href={social.link} 
                  className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                >
                  {<social.icon className='text-xl'/>}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Cars', path: '/cars' },
                { name: 'About Us', path: '/about' },
                { name: 'Book Now', path: '/booking' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Luxury Car Rental',
                'Airport Transfers',
                'Wedding Car Hire',
                'Corporate Services',
                'Long Term Rental',
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                  <FaLocationDot  className='text-blue-500 text-xl mt-1'/>
                <span className="text-gray-400">
                  123 Luxury Drive, Beverly Hills, CA 90210
                </span>
              </li>
              <li className="flex items-start space-x-3">
                 <FaPhoneAlt  className='text-blue-500 text-xl mt-1'/>
                <span className="text-gray-400">+1 (800) DRIVE-LUX</span>
              </li>
              <li className="flex items-start space-x-3">
                 <FaEnvelope  className='text-blue-500 text-xl mt-1'/>
                <span className="text-gray-400">info@driveluxe.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} DriveLuxe. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer