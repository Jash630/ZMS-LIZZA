import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { apiRequest } from "../lib/api";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 4000);

  return () => clearTimeout(timer);
}, [message]);


  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await apiRequest("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage("Success! You are now subscribed.");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <footer className="bg-brand-charcoal text-white" data-testid="main-footer">
      {/* Gradient Border */}
      <div className="h-1 bg-gradient-brand"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div>
            <div className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-4">
              ZMS LIZZA
            </div>
            <p className="text-gray-400 text-sm mb-4">
              European Technology for Indian Excellence
            </p>
            <p className="text-gray-400 text-sm mb-6">
              High-performance embroidery machines built with European precision for India's leading textile manufacturers.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange transition-colors"
                data-testid="facebook-link"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange transition-colors"
                data-testid="instagram-link"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange transition-colors"
                data-testid="linkedin-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange transition-colors"
                data-testid="youtube-link"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-home-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-about-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-products-link">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-gallery-link">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-services-link">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-blog-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-testimonials-link">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-contact-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-brand-orange transition-colors text-sm" data-testid="footer-demo-link">
                  Request Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start text-gray-400 text-sm">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Surat, Gujarat, India</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <a href="tel:+919999999999" className="hover:text-brand-orange transition-colors">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <a href="mailto:info@zmslizza.com" className="hover:text-brand-orange transition-colors">
                  info@zmslizza.com
                </a>
              </li>
              <li className="flex items-start text-gray-400 text-sm">
                <Clock size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Mon-Sat: 10 AM - 6 PM</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-brand-orange"
                  data-testid="newsletter-email-input"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  data-testid="newsletter-submit-button"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
                {message && (
                  <p className={`text-xs ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`} data-testid="newsletter-message">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 ZMS LIZZA European Technology. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-brand-orange transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-brand-orange transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;