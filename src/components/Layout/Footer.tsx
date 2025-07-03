import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Waves, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter,
  ArrowRight, Download, Shield, Truck, Award, CreditCard, Globe
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: 'Shop Equipment', href: '/equipment' },
    { label: 'Dive Packages', href: '/packages' },
    { label: 'Equipment Rentals', href: '/equipment?type=rental' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Contact Us', href: '/contact' }
  ];

  const supportLinks = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Help Center', href: '/help' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' }
  ];

  const legalLinks = [
    { label: 'Terms and Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-ocean-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Waves className="h-10 w-10 text-coral-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold">Scuba on The Go</span>
                <div className="text-sm text-ocean-200">Malaysia's Premier Dive Store</div>
              </div>
            </div>
            
            <p className="text-ocean-200 mb-6 leading-relaxed">
              Malaysia's premier dive equipment distributor, located in the heart of Kuala Lumpur. 
              Your gateway to underwater adventures worldwide with premium equipment, expert guidance, 
              and unforgettable dive experiences.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-ocean-200">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Certified Equipment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-ocean-200">
                <Truck className="h-4 w-4 text-blue-400" />
                <span>Worldwide Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-ocean-200">
                <Award className="h-4 w-4 text-yellow-400" />
                <span>15+ Years Experience</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-ocean-200">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <span>Secure Payments</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-ocean-800 hover:bg-coral-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-ocean-200 hover:text-coral-400 transition-colors flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-ocean-200 hover:text-coral-400 transition-colors flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-coral-400 mt-0.5 flex-shrink-0" />
                <div className="text-ocean-200 text-sm">
                  <div className="font-medium">STG Headquarters</div>
                  <div>Kuala Lumpur, Malaysia</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-coral-400 flex-shrink-0" />
                <a href="tel:+60323456789" className="text-ocean-200 hover:text-coral-400 transition-colors text-sm">
                  +60 3-2345-6789
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-coral-400 flex-shrink-0" />
                <a href="mailto:info@stg.com.my" className="text-ocean-200 hover:text-coral-400 transition-colors text-sm">
                  info@stg.com.my
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <p className="text-sm text-ocean-200 mb-4">
                Get exclusive deals, diving tips, and new product alerts
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-ocean-800 border border-ocean-700 rounded-lg text-white placeholder-ocean-300 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-coral-400 transition-colors"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ocean-400" />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="w-full bg-coral-600 hover:bg-coral-700 disabled:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isSubscribed ? (
                    <>
                      <span>✓ Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="border-t border-ocean-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Download Our Mobile App</h3>
              <p className="text-ocean-200 text-sm">Shop on the go and never miss a deal</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-ocean-800 hover:bg-ocean-700 px-4 py-2 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs text-ocean-200">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center space-x-2 bg-ocean-800 hover:bg-ocean-700 px-4 py-2 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs text-ocean-200">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-ocean-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <p className="text-ocean-300 text-sm">
                © 2024 Scuba on The Go. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm text-ocean-300">
                <Globe className="h-4 w-4" />
                <span>Made with passion for diving in Malaysia</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center space-x-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-ocean-300 hover:text-coral-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}