import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star, Zap, Clock, TrendingUp } from 'lucide-react';
import { EquipmentCard } from '../components/Equipment/EquipmentCard';
import { mockEquipment } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { useToast } from '../hooks/useToast';

export function Equipment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const categories = ['all', ...Array.from(new Set(mockEquipment.map(e => e.category)))];
  const brands = ['all', ...Array.from(new Set(mockEquipment.map(e => e.brand)))];

  // Add badges to equipment for guest experience
  const enhancedEquipment = mockEquipment.map(item => ({
    ...item,
    badges: [
      ...(item.price < 100 ? ['Best Value'] : []),
      ...(item.ratings >= 4.8 ? ['Best Seller'] : []),
      ...(Math.random() > 0.7 ? ['New'] : []),
      ...(Math.random() > 0.8 ? ['On Sale'] : [])
    ]
  }));

  const filteredEquipment = useMemo(() => {
    let filtered = enhancedEquipment.filter(equipment => {
      const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           equipment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || equipment.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || equipment.brand === selectedBrand;
      const matchesPrice = equipment.price >= priceRange.min && equipment.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort equipment
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.ratings - a.ratings;
        case 'popularity':
          return b.ratings * Math.random() - a.ratings * Math.random();
        case 'latest':
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  const handleGuestAction = () => {
    setShowLoginPrompt(true);
  };

  const handleQuickAddToCart = (equipment: any, type: 'purchase' | 'rental') => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const cartItem = {
      id: `${equipment.id}-${type}-${Date.now()}`,
      type,
      equipmentId: equipment.id,
      quantity: 1,
      price: type === 'purchase' ? equipment.price : equipment.rentalPrice,
      ...(type === 'rental' && { rentalDuration: 7 })
    };

    addItem(cartItem);
    showToast('success', `${equipment.name} added to cart for ${type}!`);
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'New': return 'info';
      case 'On Sale': return 'coral';
      case 'Best Seller': return 'ocean';
      case 'Best Value': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Marketing Elements */}
      <div className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Dive Equipment
            </h1>
            <p className="text-xl md:text-2xl text-ocean-100 mb-8 max-w-3xl mx-auto">
              Discover Malaysia's largest collection of professional diving gear from world-renowned brands
            </p>
            
            {/* Trust Indicators for Guests */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">150+</div>
                <div className="text-sm text-ocean-200">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">2500+</div>
                <div className="text-sm text-ocean-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">15+</div>
                <div className="text-sm text-ocean-200">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-400">24/7</div>
                <div className="text-sm text-ocean-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Badge variant="info" size="sm">
                  {filteredEquipment.length} items
                </Badge>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'All Brands' : brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
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
                <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-ocean-800 mb-2">Join STG Today!</h4>
                  <p className="text-sm text-ocean-700 mb-3">
                    Get exclusive member discounts up to 15% off
                  </p>
                  <button
                    onClick={() => setShowLoginPrompt(true)}
                    className="w-full bg-ocean-600 text-white py-2 px-4 rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
                  >
                    Sign Up Now
                  </button>
                </div>
              )}

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setPriceRange({ min: 0, max: 1000 });
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
                    placeholder="Search equipment, brands, models..."
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
                    <option value="latest">Latest Arrivals</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-ocean-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-ocean-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count and Quick Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Showing {filteredEquipment.length} of {mockEquipment.length} products
                </p>
              </div>
              
              {/* Quick Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    sortBy === 'latest' 
                      ? 'bg-ocean-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap className="h-3 w-3 inline mr-1" />
                  New Arrivals
                </button>
                <button
                  onClick={() => setSortBy('popularity')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    sortBy === 'popularity' 
                      ? 'bg-ocean-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Trending
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    sortBy === 'rating' 
                      ? 'bg-ocean-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className="h-3 w-3 inline mr-1" />
                  Top Rated
                </button>
              </div>
            </div>

            {/* Enhanced Equipment Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredEquipment.map((equipment) => (
                <EquipmentCard 
                  key={equipment.id} 
                  equipment={equipment} 
                  onGuestAction={handleGuestAction} 
                />
              ))}
            </div>

            {/* No Results */}
            {filteredEquipment.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No equipment found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceRange({ min: 0, max: 1000 });
                  }}
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === 1 
                        ? 'bg-ocean-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Login Prompt Modal */}
      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Join STG Community"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-ocean-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Unlock Exclusive Benefits
          </h3>
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Member discounts up to 15% off</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Earn points with every purchase</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Access to exclusive dive packages</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
              <span className="text-gray-700">Priority customer support</span>
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
    </div>
  );
}