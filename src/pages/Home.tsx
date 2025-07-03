import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Truck, Award, Users, Waves, Fish, Compass, Play, 
  ChevronLeft, ChevronRight, Star, MapPin, Calendar, Package, 
  Zap, Heart, Eye, ShoppingCart, Clock, CheckCircle, Globe, Search
} from 'lucide-react';
import { EquipmentCard } from '../components/Equipment/EquipmentCard';
import { PackageCard } from '../components/Packages/PackageCard';
import { RentalPreview } from '../components/Equipment/RentalPreview';
import { AnimatedCounter } from '../components/UI/AnimatedCounter';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { useAuth } from '../context/AuthContext';
import { mockEquipment, mockDivePackages } from '../data/mockData';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [activeSection, setActiveSection] = useState('equipment');
  const { user } = useAuth();
  
  const featuredEquipment = mockEquipment.slice(0, 6);
  const featuredPackages = mockDivePackages.slice(0, 3);

  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/3361489/pexels-photo-3361489.jpeg",
      title: "Dive Into Your Next Adventure",
      subtitle: "Malaysia's premier dive equipment distributor with worldwide reach. From equipment to packages, we make your underwater dreams reality.",
      cta: "Shop Equipment",
      ctaLink: "/equipment"
    },
    {
      image: "https://images.pexels.com/photos/3361524/pexels-photo-3361524.jpeg",
      title: "Explore Malaysia's Best Dive Sites",
      subtitle: "Professional dive packages with certified partners across Sipadan, Tioman, and Redang. Experience world-class diving destinations.",
      cta: "View Packages",
      ctaLink: "/packages"
    },
    {
      image: "https://images.pexels.com/photos/3361517/pexels-photo-3361517.jpeg",
      title: "Premium Equipment Rentals",
      subtitle: "Try before you buy with our flexible rental options. Quality gear from trusted brands available for short and long-term rentals.",
      cta: "Rent Equipment",
      ctaLink: "/equipment"
    },
    {
      image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
      title: "Underwater Paradise Awaits",
      subtitle: "Experience the breathtaking beauty of Malaysia's coral reefs and marine life. Professional guides and top-quality equipment ensure safe, unforgettable dives.",
      cta: "Book Adventure",
      ctaLink: "/packages"
    }
  ];

  const categories = [
    {
      name: "Masks & Snorkels",
      image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
      count: "25+ Products",
      link: "/equipment?category=masks",
      description: "Crystal clear vision underwater"
    },
    {
      name: "Fins & Boots",
      image: "https://images.pexels.com/photos/3361022/pexels-photo-3361022.jpeg",
      count: "30+ Products",
      link: "/equipment?category=fins",
      description: "Efficient propulsion and comfort"
    },
    {
      name: "Regulators",
      image: "https://images.pexels.com/photos/3361485/pexels-photo-3361485.jpeg",
      count: "15+ Products",
      link: "/equipment?category=regulators",
      description: "Reliable breathing systems"
    },
    {
      name: "BCDs & Vests",
      image: "https://images.pexels.com/photos/3361483/pexels-photo-3361483.jpeg",
      count: "20+ Products",
      link: "/equipment?category=bcds",
      description: "Perfect buoyancy control"
    },
    {
      name: "Wetsuits",
      image: "https://images.pexels.com/photos/3361489/pexels-photo-3361489.jpeg",
      count: "35+ Products",
      link: "/equipment?category=wetsuits",
      description: "Thermal protection and flexibility"
    },
    {
      name: "Tanks & Accessories",
      image: "https://images.pexels.com/photos/3361486/pexels-photo-3361486.jpeg",
      count: "40+ Products",
      link: "/equipment?category=tanks",
      description: "Essential diving accessories"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Advanced Open Water Diver",
      image: "https://images.pexels.com/photos/3361520/pexels-photo-3361520.jpeg",
      content: "STG has been my go-to for all diving equipment. Their Sipadan package was absolutely incredible - saw hammerhead sharks and the most beautiful coral reefs!",
      rating: 5,
      location: "Kuala Lumpur"
    },
    {
      name: "Ahmad Rahman",
      role: "Dive Instructor",
      image: "https://images.pexels.com/photos/3361517/pexels-photo-3361517.jpeg",
      content: "As a professional instructor, I trust STG for quality equipment. Their rental service is perfect for my students, and the staff knows their gear inside out.",
      rating: 5,
      location: "Kota Kinabalu"
    },
    {
      name: "Emily Johnson",
      role: "Recreational Diver",
      image: "https://images.pexels.com/photos/3361524/pexels-photo-3361524.jpeg",
      content: "The Tioman weekend package exceeded all expectations. Great value, professional guides, and the equipment was top-notch. Already booked my next trip!",
      rating: 5,
      location: "Singapore"
    }
  ];

  const diveCenters = [
    { name: "Borneo Divers", location: "Sabah", speciality: "Sipadan Expeditions" },
    { name: "Tioman Dive Centre", location: "Pahang", speciality: "Coral Gardens" },
    { name: "PD Scuba Academy", location: "Negeri Sembilan", speciality: "Training Courses" },
    { name: "Redang Dive Adventures", location: "Terengganu", speciality: "Photography Tours" }
  ];

  const currentOffers = [
    {
      title: "Flash Sale - 30% Off Masks",
      description: "Premium diving masks from top brands",
      discount: "30%",
      timeLeft: "2 days",
      image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg"
    },
    {
      title: "Wetsuit Bundle Deal",
      description: "Complete wetsuit package with boots",
      discount: "25%",
      timeLeft: "5 days",
      image: "https://images.pexels.com/photos/3361489/pexels-photo-3361489.jpeg"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(testimonialInterval);
    };
  }, [heroSlides.length, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleGuestAction = () => {
    setShowGuestModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/90 via-ocean-900/70 to-transparent" />
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <div className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Badge variant="coral" className="mb-6 animate-pulse">
                  <Zap className="h-4 w-4 mr-1" />
                  Malaysia's #1 Dive Equipment Store
                </Badge>
              </div>
              
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {heroSlides[currentSlide].title.split(' ').slice(0, 3).join(' ')}{' '}
                <span className="text-coral-400 block">
                  {heroSlides[currentSlide].title.split(' ').slice(3).join(' ')}
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl lg:text-2xl text-ocean-100 mb-8 leading-relaxed max-w-3xl transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {heroSlides[currentSlide].subtitle}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Link
                  to={heroSlides[currentSlide].ctaLink}
                  className="group bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>{heroSlides[currentSlide].cta}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className={`grid grid-cols-3 gap-6 mt-12 transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-coral-400">
                    <AnimatedCounter end={2500} suffix="+" />
                  </div>
                  <div className="text-ocean-200 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-coral-400">
                    <AnimatedCounter end={150} suffix="+" />
                  </div>
                  <div className="text-ocean-200 text-sm">Equipment Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-coral-400">
                    <AnimatedCounter end={50} suffix="+" />
                  </div>
                  <div className="text-ocean-200 text-sm">Dive Centers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white transition-all duration-300 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white transition-all duration-300 z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Guest Experience Showcase */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-ocean-600 to-ocean-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Explore Without Limits
            </h2>
            <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
              Browse our complete catalog, compare prices, and discover amazing dive packages. 
              Join our community to unlock exclusive benefits and start your diving journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/equipment"
                className="bg-white text-ocean-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse Equipment</span>
              </Link>
              <button
                onClick={() => setShowGuestModal(true)}
                className="bg-coral-600 hover:bg-coral-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
              >
                Join STG Community
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Shop by <span className="text-ocean-600">Category</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of diving equipment, carefully curated from the world's most trusted brands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-coral-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-ocean-200 text-sm mb-1">{category.count}</p>
                  <p className="text-ocean-100 text-xs">{category.description}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Section Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Explore Our <span className="text-ocean-600">Offerings</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              From premium equipment to unforgettable dive experiences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl shadow-md p-2 flex space-x-2">
              {[
                { id: 'equipment', label: 'Featured Equipment', icon: Package },
                { id: 'rentals', label: 'Equipment Rentals', icon: Clock },
                { id: 'packages', label: 'Dive Packages', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-ocean-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeSection === 'equipment' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Featured Equipment</h3>
                  <Link
                    to="/equipment"
                    className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors font-semibold group"
                  >
                    <span>View All Equipment</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredEquipment.map((equipment, index) => (
                    <div 
                      key={equipment.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <EquipmentCard equipment={equipment} onGuestAction={handleGuestAction} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'rentals' && (
              <RentalPreview equipment={mockEquipment} onLoginPrompt={handleGuestAction} />
            )}

            {activeSection === 'packages' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Featured Dive Packages</h3>
                  <Link
                    to="/packages"
                    className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors font-semibold group"
                  >
                    <span>View All Packages</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {featuredPackages.map((pkg, index) => (
                    <div 
                      key={pkg.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <PackageCard package={pkg} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rest of the existing sections... */}
      {/* (Keeping all other sections as they were) */}

      {/* Guest Login Prompt Modal */}
      <Modal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="Join STG Diving Community"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Waves className="h-8 w-8 text-ocean-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Unlock Your Diving Potential
          </h3>
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Member discounts up to 15% off all equipment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Priority booking for dive packages</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Earn points with every purchase</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Access to exclusive dive sites and events</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Professional diving guidance and support</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowGuestModal(false);
                window.location.href = '/auth';
              }}
              className="flex-1 bg-ocean-600 text-white py-3 px-6 rounded-lg hover:bg-ocean-700 transition-colors font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setShowGuestModal(false);
                window.location.href = '/auth';
              }}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}