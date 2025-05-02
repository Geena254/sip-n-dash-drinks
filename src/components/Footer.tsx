
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
            {/* Top section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div>
                <span className="text-xl font-bold barrush-gradient-text">
                    Booze To You
                </span>
                <p className="text-gray-300 mb-4">Your one-stop solution for all your drink needs.</p>
                <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-barlogo-pink transition-colors">
                    <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-barlogo-pink transition-colors">
                    <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-barlogo-pink transition-colors">
                    <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-barlogo-pink transition-colors">
                    <FaWhatsapp size={20} />
                </a>
                </div>
            </div>
            
            {/* Quick Links */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Quick Links</h3>
                <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shop</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cocktail Recipes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a></li>
                </ul>
            </div>
            
            {/* Contact Info */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Contact Us</h3>
                <ul className="space-y-3">
                <li className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <a href="mailto:info@barrush.com" className="text-gray-300 hover:text-white transition-colors">info@boozetoyou.com</a>
                </li>
                <li className="flex items-center">
                    <FaPhone className="mr-2 text-gray-400" />
                    <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">+254 703 320 399/+254 796 676 253</a>
                </li>
                <li className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-gray-400" />
                    <span className="text-gray-300">123 Bar Street, Drink City, DR 45678</span>
                </li>
                </ul>
            </div>
            
            {/* Hours */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Opening Hours</h3>
                <ul className="space-y-2">
                <li className="flex items-center">
                    <FaClock className="mr-2 text-gray-400" />
                    <span className="text-gray-300">Monday - Friday: 9am - 10pm</span>
                </li>
                <li className="text-gray-300 ml-6">Saturday: 10am - 12am</li>
                <li className="text-gray-300 ml-6">Sunday: 12pm - 10pm</li>
                </ul>
            </div>
            </div>
            
            {/* Divider */}
            <hr className="border-gray-800 my-6" />
            
            {/* Bottom section */}
            <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {currentYear} BarRush. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-barlogo-pink transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-barlogo-pink transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-barlogo-pink transition-colors">Cookie Policy</a>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
