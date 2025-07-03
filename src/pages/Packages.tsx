import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Star, Clock, Shield, Award, Globe, ChevronDown, Info } from 'lucide-react';
import { PackageCard } from '../components/Packages/PackageCard';
import { mockDivePackages } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/UI/Badge';
import { Card } from '../components/UI/Card';
import { Modal } from '../components/UI/Modal';
import { useToast } from '../hooks/useToast';

export function Packages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedDiveCenter, setSelectedDiveCenter] = useState<string | null>(null);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const levels = ['all', ...Array.from(new Set(mockDivePackages.map(p => p.level)))];
  const difficulties = ['all', ...Array.from(new Set(mockDivePackages.map(p => p.difficulty)))];
  const locations = ['all', ...Array.from(new Set(mockDivePackages.map(p => p.location)))];
  const diveCenters = Array.from(new Set(mockDivePackages.map(p => p.diveCenterPartner)));

  // Enhanced package data with additional guest-friendly information
  const enhancedPackages = mockDivePackages.map(pkg => ({
    ...pkg,
    highlights: [
      'Professional dive guide included',
      'All equipment provided',
      'Underwater photography tips',
      'Marine life identification guide'
    ],
    bestFor: pkg.difficulty === 'beginner' ? 'First-time divers' : 
             pkg.difficulty === 'intermediate' ? 'Certified divers' : 'Advanced divers',
    seasonality: 'Year-round availability',
    groupSize: `${pkg.minParticipants}-${pkg.maxParticipants} divers`,
    certification: pkg.level === 'fun-diving' ? 'Open Water or higher' : 
                  pkg.level === 'open-water' ? 'No certification required' : 
                  'Advanced certification required'
  }));

  const filteredPackages = useMemo(() => {
    let filtered = enhancedPackages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || pkg.level === selectedLevel;
      const matchesDifficulty = selectedDifficulty === 'all' || pkg.difficulty === selectedDifficulty;
      const matchesLocation = selectedLocation === 'all' || pkg.location === selectedLocation;
      const matchesPrice = pkg.price >= priceRange.min && pkg.price <= priceRange.max;
      
      return matchesSearch && matchesLevel && matchesDifficulty && matchesLocation && matchesPrice;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration - b.duration;
        case 'popularity':
          return Math.random() - 0.5; // Simulate popularity
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedLevel, selectedDifficulty, selectedLocation, priceRange, sortBy]);

  const handleBookNow = (pkg: any) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    // Add package to cart
    const cartItem = {
      id: `${pkg.id}-package-${Date.now()}`,
      type: 'package' as const,
      packageId: pkg.id,
      quantity: 1,
      price: pkg.price,
      selectedDate: pkg.availableDates[0] // Default to first available date
    };

    addItem(cartItem);
    showToast('success', `${pkg.name} package added to cart!`);
  };

  const getDiveCenterInfo = (centerName: string) => {
    const centerInfo = {
      'Borneo Divers': {
        location: 'Kota Kinabalu, Sabah',
        speciality: 'Sipadan Expeditions',
        established: '1989',
        rating: 4.9,
        description: 'Pioneer dive operator in Sabah with exclusive access to Sipadan Island.'
      },
      'Tioman Dive Centre': {
        location: 'Pulau Tioman, Pahang',
        speciality: 'Coral Garden Tours',
        established: '1995',
        rating: 4.7,
        description: 'Family-run dive center specializing in macro photography and coral conservation.'
      },
      'PD Scuba Academy': {
        location: 'Port Dickson, Negeri Sembilan',
        speciality: 'Training Courses',
        established: '2001',
        rating: 4.8,
        description: 'PADI 5-Star IDC center offering comprehensive diving education programs.'
      },
      'Redang Dive Adventures': {
        location: 'Pulau Redang, Terengganu',
        speciality: 'Photography Tours',
        established: '2003',
        rating: 4.6,
        description: 'Underwater photography specialists with professional equipment rental.'
      }
    };
    return centerInfo[centerName as keyof typeof centerInfo] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Header */}
      <div className="relative bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dive Package Adventures
            </h1>
            <p className="text-xl md:text-2xl text-ocean-100 mb-8 max-w-3xl mx-auto">
              Explore Malaysia's most spectacular dive sites with certified partners. 
              From beginner courses to advanced expeditions.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">50+</div>
                <div className="text-sm text-ocean-200">Dive Sites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">15+</div>
                <div className="text-sm text-ocean-200">Partner Centers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">1000+</div>
                <div className="text-sm text-ocean-200">Divers Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">4.8★</div>
                <div className="text-sm text-ocean-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dive Level Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-ocean-600" />
            Dive Level Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Beginner Friendly</h4>
              <p className="text-sm text-green-700">No experience required. Perfect for first-time divers and snorkelers.</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Certified Divers</h4>
              <p className="text-sm text-blue-700">Open Water certification or equivalent required for these adventures.</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold text-red-800 mb-2">Advanced</h4>
              <p className="text-sm text-red-700">Advanced certification and significant diving experience required.</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Badge variant="info" size="sm">
                  {filteredPackages.length} packages
                </Badge>
              </div>
              
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (RM)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
              </div>

              {/* Guest CTA in Filters */}
              {!user && (
                <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-800 mb-2">Member Benefits</h4>
                  <ul className="text-sm text-ocean-700 space-y-1 mb-3">
                    <li>• Priority booking</li>
                    <li>• Group discounts</li>
                    <li>• Exclusive packages</li>
                  </ul>
                  <button
                    onClick={() => setShowLoginPrompt(true)}
                    className="w-full bg-ocean-600 text-white py-2 px-4 rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
                  >
                    Join Now
                  </button>
                </div>
              )}

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                  setSelectedDifficulty('all');
                  setSelectedLocation('all');
                  setPriceRange({ min: 0, max: 2000 });
                }}
                className="w-full text-ocean-600 hover:text-ocean-700 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Enhanced Search and Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search packages, locations, dive centers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>

                  {/* Enhanced Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count and Quick Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Showing {filteredPackages.length} of {mockDivePackages.length} packages
                </p>
              </div>
              
              {/* Location Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {['Sipadan', 'Tioman', 'Redang', 'Langkawi'].map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedLocation.includes(location.toLowerCase()) 
                        ? 'bg-ocean-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Packages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} hover className="overflow-hidden">
                  {/* Image with Enhanced Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <Badge variant="ocean" size="sm">
                        {pkg.level.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={pkg.difficulty === 'beginner' ? 'success' : pkg.difficulty === 'intermediate' ? 'warning' : 'error'} size="sm">
                        {pkg.difficulty.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Location & Duration */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{pkg.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{pkg.duration} days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-ocean-600">
                          RM {pkg.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>

                    {/* Dive Center Info */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setSelectedDiveCenter(pkg.diveCenterPartner)}
                        className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                      >
                        <Star className="h-4 w-4" />
                        <span className="font-medium">{pkg.diveCenterPartner}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{pkg.groupSize}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Package Highlights */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Package Highlights:</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        {pkg.highlights.slice(0, 4).map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-ocean-600 rounded-full"></div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements Preview */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Requirements: </span>
                        <span className="text-gray-600">{pkg.certification}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(`/packages/${pkg.id}`, '_blank')}
                        className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBookNow(pkg)}
                        className="flex-1 bg-ocean-600 text-white py-2.5 px-4 rounded-lg hover:bg-ocean-700 transition-colors font-medium"
                      >
                        {user ? 'Book Now' : 'Login to Book'}
                      </button>
                    </div>

                    {/* Guest Benefits Hint */}
                    {!user && (
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">
                          <span className="text-ocean-600 font-medium">Members</span> get priority booking and group discounts
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('all');
                    setSelectedDifficulty('all');
                    setSelectedLocation('all');
                    setPriceRange({ min: 0, max: 2000 });
                  }}
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Login Prompt Modal */}
      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Join STG Diving Community"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-ocean-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Unlock Exclusive Dive Packages
          </h3>
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Priority booking for popular packages</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Group discounts and member rates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Access to exclusive dive sites</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Personalized dive recommendations</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                window.location.href = '/auth';
              }}
              className="flex-1 bg-ocean-600 text-white py-3 px-6 rounded-lg hover:bg-ocean-700 transition-colors font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                window.location.href = '/auth';
              }}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </Modal>

      {/* Dive Center Info Modal */}
      <Modal
        isOpen={!!selectedDiveCenter}
        onClose={() => setSelectedDiveCenter(null)}
        title="Dive Center Information"
        size="lg"
      >
        {selectedDiveCenter && (
          <div>
            {(() => {
              const centerInfo = getDiveCenterInfo(selectedDiveCenter);
              if (!centerInfo) return <div>Information not available</div>;
              
              return (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center">
                      <Shield className="h-8 w-8 text-ocean-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedDiveCenter}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{centerInfo.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Est. {centerInfo.established}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{centerInfo.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{centerInfo.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-ocean-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-ocean-800 mb-2">Speciality</h4>
                      <p className="text-ocean-700">{centerInfo.speciality}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Certifications</h4>
                      <p className="text-green-700">PADI 5-Star Dive Center</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setSelectedDiveCenter(null)}
                      className="bg-ocean-600 text-white px-6 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}