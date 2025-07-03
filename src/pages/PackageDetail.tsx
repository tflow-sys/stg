import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Star, Clock, CheckCircle, AlertCircle, Heart, Share2 } from 'lucide-react';
import { mockDivePackages } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export function PackageDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [participants, setParticipants] = useState(1);

  const pkg = mockDivePackages.find(p => p.id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <Link to="/packages" className="text-ocean-600 hover:text-ocean-700 transition-colors">
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const handleBookPackage = () => {
    if (!user) {
      // Redirect to auth page for guests
      window.location.href = '/auth';
      return;
    }

    if (!selectedDate) {
      showToast('error', 'Please select a date');
      return;
    }

    const cartItem = {
      id: `${pkg.id}-package-${Date.now()}`,
      type: 'package' as const,
      packageId: pkg.id,
      quantity: participants,
      price: pkg.price,
      selectedDate
    };

    addItem(cartItem);
    showToast('success', `${pkg.name} package added to cart for ${participants} participants!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'fun-diving': return 'bg-blue-100 text-blue-800';
      case 'open-water': return 'bg-green-100 text-green-800';
      case 'advanced-open-water': return 'bg-orange-100 text-orange-800';
      case 'rescue-diver': return 'bg-red-100 text-red-800';
      case 'divemaster': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipDiscount = () => {
    if (!user) return 0;
    switch (user.membershipTier) {
      case 'sea-monsters': return 0.15;
      case 'dive-buddies': return 0.10;
      case 'water-babies': return 0.05;
      default: return 0;
    }
  };

  const discountedPrice = pkg.price * (1 - getMembershipDiscount());
  const totalPrice = discountedPrice * participants;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/packages"
          className="inline-flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Packages</span>
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={pkg.images[0]}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute top-4 left-4 flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(pkg.level)}`}>
                {pkg.level.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                {pkg.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5" />
                  <span>{pkg.diveCenterPartner}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About This Package</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{pkg.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-ocean-50 rounded-lg">
                  <Clock className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
                  <div className="font-semibold">{pkg.duration} Days</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-coral-50 rounded-lg">
                  <Users className="h-8 w-8 text-coral-600 mx-auto mb-2" />
                  <div className="font-semibold">{pkg.minParticipants}-{pkg.maxParticipants}</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">{pkg.diveCenterPartner}</div>
                  <div className="text-sm text-gray-600">Partner</div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.includedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <div className="space-y-3">
                {pkg.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-ocean-600">
                    RM {user ? discountedPrice.toFixed(2) : pkg.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
                {user && getMembershipDiscount() > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    RM {pkg.price.toFixed(2)} per person
                  </div>
                )}
              </div>

              {user && getMembershipDiscount() > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="text-sm text-green-800">
                    <strong>Membership Discount:</strong> {(getMembershipDiscount() * 100).toFixed(0)}% off!
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="space-y-2">
                  {pkg.availableDates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors ${
                        selectedDate?.getTime() === date.getTime()
                          ? 'border-ocean-600 bg-ocean-50 text-ocean-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{date.toLocaleDateString()}</span>
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants
                </label>
                <select
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  {Array.from({ length: pkg.maxParticipants - pkg.minParticipants + 1 }, (_, i) => (
                    <option key={i} value={pkg.minParticipants + i}>
                      {pkg.minParticipants + i} {pkg.minParticipants + i === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price</span>
                  <span className="text-2xl font-bold text-ocean-600">
                    RM {totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {participants} × RM {user ? discountedPrice.toFixed(2) : pkg.price.toFixed(2)}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookPackage}
                disabled={!selectedDate}
                className="w-full bg-ocean-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? 'Add to Cart' : 'Login to Book'}
              </button>

              {/* Guest CTA */}
              {!user && (
                <div className="mt-4 p-4 bg-ocean-50 border border-ocean-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-ocean-800 mb-2">
                      <strong>Sign up for exclusive benefits:</strong>
                    </p>
                    <ul className="text-xs text-ocean-700 space-y-1 mb-3">
                      <li>• Priority booking for popular packages</li>
                      <li>• Member discounts up to 15% off</li>
                      <li>• Access to exclusive dive sites</li>
                    </ul>
                    <button
                      onClick={() => window.location.href = '/auth'}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-gray-600">
                Free cancellation up to 48 hours before departure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}