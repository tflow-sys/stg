import React, { useState } from 'react';
import { Calendar, Clock, Info, Calculator, MapPin, Shield, AlertCircle } from 'lucide-react';
import { Equipment } from '../../types';
import { Badge } from '../UI/Badge';
import { Card } from '../UI/Card';
import { useAuth } from '../../context/AuthContext';

interface RentalPreviewProps {
  equipment: Equipment[];
  onLoginPrompt: () => void;
}

export function RentalPreview({ equipment, onLoginPrompt }: RentalPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user } = useAuth();

  const rentalCategories = [
    { id: 'all', name: 'All Equipment', count: equipment.filter(e => e.isRentable).length },
    { id: 'masks', name: 'Masks & Snorkels', count: equipment.filter(e => e.isRentable && e.category === 'masks').length },
    { id: 'fins', name: 'Fins & Boots', count: equipment.filter(e => e.isRentable && e.category === 'fins').length },
    { id: 'wetsuits', name: 'Wetsuits', count: equipment.filter(e => e.isRentable && e.category === 'wetsuits').length },
    { id: 'tanks', name: 'Tanks & Gear', count: equipment.filter(e => e.isRentable && e.category === 'tanks').length },
    { id: 'bcds', name: 'BCDs & Vests', count: equipment.filter(e => e.isRentable && e.category === 'bcds').length }
  ];

  const rentalDurations = [
    { days: 1, label: '1 Day', multiplier: 0.2 },
    { days: 3, label: '3 Days', multiplier: 0.5 },
    { days: 7, label: '1 Week', multiplier: 1 },
    { days: 14, label: '2 Weeks', multiplier: 1.8 },
    { days: 30, label: '1 Month', multiplier: 3.5 }
  ];

  const filteredEquipment = equipment.filter(item => 
    item.isRentable && 
    (selectedCategory === 'all' || item.category === selectedCategory)
  );

  const calculateRentalPrice = (weeklyPrice: number, days: number) => {
    const duration = rentalDurations.find(d => d.days === days);
    return weeklyPrice * (duration?.multiplier || 1);
  };

  const handleRentNow = (item: Equipment) => {
    if (!user) {
      onLoginPrompt();
      return;
    }
    // Handle authenticated rental logic
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Equipment Rental Preview
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Try before you buy with our flexible rental options. Perfect for travelers and occasional divers.
        </p>
      </div>

      {/* Rental Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center" hover>
          <Shield className="h-12 w-12 text-ocean-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
          <p className="text-gray-600 text-sm">All rental equipment is professionally maintained and sanitized</p>
        </Card>
        <Card className="text-center" hover>
          <Calculator className="h-12 w-12 text-coral-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Flexible Pricing</h3>
          <p className="text-gray-600 text-sm">Daily, weekly, and monthly rates available with bulk discounts</p>
        </Card>
        <Card className="text-center" hover>
          <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Convenient Pickup</h3>
          <p className="text-gray-600 text-sm">Multiple locations across Malaysia or delivery to your hotel</p>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {rentalCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg text-center transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-ocean-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-sm">{category.name}</div>
              <div className="text-xs opacity-75">{category.count} items</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration & Pricing Calculator */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Rental Duration Calculator</h3>
          <Info className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {rentalDurations.map((duration) => (
            <button
              key={duration.days}
              onClick={() => setSelectedDuration(duration.days)}
              className={`p-3 rounded-lg text-center transition-all duration-300 ${
                selectedDuration === duration.days
                  ? 'bg-coral-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{duration.label}</div>
              <div className="text-xs opacity-75">
                {duration.multiplier}x weekly rate
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card
            key={item.id}
            hover
            className="relative overflow-hidden group"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="coral" size="sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Rentable
                </Badge>
              </div>
              {!item.available && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Badge variant="error">Currently Unavailable</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ocean-600">{item.brand}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">{item.stock} available</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>

              {/* Pricing Display */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weekly Rate:</span>
                  <span className="font-semibold text-ocean-600">
                    RM {item.rentalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {rentalDurations.find(d => d.days === selectedDuration)?.label}:
                  </span>
                  <span className="font-bold text-lg text-coral-600">
                    RM {calculateRentalPrice(item.rentalPrice, selectedDuration).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Availability Calendar Preview */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Availability Calendar</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }, (_, i) => {
                    const isAvailable = Math.random() > 0.3;
                    return (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                          isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                {!user && (
                  <p className="text-xs text-gray-500 mt-2">
                    Login to view full calendar and make reservations
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRentNow(item)}
                disabled={!item.available}
                className="w-full bg-coral-600 hover:bg-coral-700 text-white py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {user ? 'Rent Now' : 'Login to Rent'}
              </button>

              {/* Rental Terms Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                  <div className="space-y-1">
                    <div>• Minimum rental: 1 day</div>
                    <div>• Security deposit required</div>
                    <div>• Free delivery for 7+ days</div>
                    <div>• Professional cleaning included</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Guest CTA Section */}
      {!user && (
        <Card className="text-center bg-gradient-to-r from-ocean-50 to-blue-50">
          <div className="max-w-2xl mx-auto">
            <AlertCircle className="h-12 w-12 text-ocean-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Start Renting?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your account to access our full rental calendar, make reservations, 
              and enjoy member benefits including discounted rates and priority booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onLoginPrompt}
                className="bg-ocean-600 text-white px-6 py-3 rounded-lg hover:bg-ocean-700 transition-colors font-medium"
              >
                Create Account
              </button>
              <button
                onClick={onLoginPrompt}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Rental Terms & Conditions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Rental Terms & Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rental Process</h4>
            <ul className="space-y-1">
              <li>• Valid ID and credit card required</li>
              <li>• Security deposit held during rental</li>
              <li>• Equipment inspection upon return</li>
              <li>• Late return fees may apply</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What's Included</h4>
            <ul className="space-y-1">
              <li>• Professional cleaning & sanitization</li>
              <li>• Basic maintenance check</li>
              <li>• Rental instruction guide</li>
              <li>• 24/7 emergency support</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}