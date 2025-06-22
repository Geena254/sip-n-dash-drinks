import { Link } from 'react-router-dom';
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gradient-to-br from-purple-100 to-indigo-100 text-gray-800 py-8">
        <div className="container mx-auto px-4">
            {/* Top section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div>
                <span className="text-xl font-bold barrush-gradient-text">
                    Drop Appy to you
                </span>
                <p className="text-gray-600 mb-4">Your one-stop solution for all your delivery needs.</p>
                <div className="flex space-x-4 mt-4">
                    <a href="#" className="text-purple-500 hover:text-purple-700 transition-colors">
                        <FaFacebook size={20} />
                    </a>
                    <a href="#" className="text-purple-500 hover:text-purple-700 transition-colors">
                        <FaTwitter size={20} />
                    </a>
                    <a href="#" className="text-purple-500 hover:text-purple-700 transition-colors">
                        <FaInstagram size={20} />
                    </a>
                    <a href="#" className="text-purple-500 hover:text-purple-700 transition-colors">
                        <FaWhatsapp size={20} />
                    </a>
                </div>
            </div>
            
            {/* Quick Links */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Quick Links</h3>
                <ul className="space-y-2">
                <li><Link to='/categories'><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Shop</a></Link></li>
                <li><Link to='/recipes'><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Cocktail Recipes</a></Link></li>
                <li><Link to='/categories'><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Categories</a></Link></li>
                <li><Link to='/cart'><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Cart</a></Link></li>
                </ul>
            </div>
            
            {/* Contact Info */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Contact Us</h3>
                <ul className="space-y-3">
                <li className="flex items-center">
                    <FaEnvelope className="mr-2 text-purple-500" />
                    <a href="mailto:info@barrush.com" className="text-gray-600 hover:text-purple-700 transition-colors">info@barrush.co.ke</a>
                </li>
                <li className="flex items-center">
                    <FaPhone className="mr-2 text-purple-500" />
                    <a href="tel:+1234567890" className="text-gray-600 hover:text-purple-700 transition-colors">+254 796 676 253</a>
                </li>
                <li className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-purple-500" />
                    <span className="text-gray-600">Kilifi, Kenya</span>
                </li>
                </ul>
            </div>
            
            {/* Hours */}
            <div>
                <h3 className="text-xl font-bold barrush-gradient-text">Opening Hours</h3>
                <ul className="space-y-2">
                <li className="flex items-center">
                    <FaClock className="mr-2 text-purple-500" />
                    <span className="text-gray-600">Monday - Friday: 9am - 10pm</span>
                </li>
                <li className="text-gray-600 ml-6">Saturday: 10am - 12am</li>
                <li className="text-gray-600 ml-6">Sunday: 12pm - 10pm</li>
                </ul>
            </div>
            </div>
            
            {/* Divider */}
            <hr className="border-purple-200 my-6" />
            
            {/* Bottom section */}
            <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {currentYear} AppyDrop. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors">Cookie Policy</a>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
