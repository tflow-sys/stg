import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Calendar, Star, Shield, Truck, Award, Heart, Share2, Minus, Plus } from 'lucide-react';
import { mockEquipment } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export function EquipmentDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentalDuration, setRentalDuration] = useState(7);
  const [activeTab, setActiveTab] = useState('description');

  const equipment = mockEquipment.find(e => e.id === id);

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Equipment not found</h2>
          <Link to="/equipment" className="text-ocean-600 hover:text-ocean-700 transition-colors">
            Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (type: 'purchase' | 'rental') => {
    if (!user) {
      // Redirect to auth page for guests
      window.location.href = '/auth';
      return;
    }

    const cartItem = {
      id: `${equipment.id}-${type}-${Date.now()}`,
      type,
      equipmentId: equipment.id,
      quantity,
      price: type === 'purchase' ? equipment.price : equipment.rentalPrice,
      ...(type === 'rental' && { rentalDuration })
    };

    addItem(cartItem);
    showToast('success', `${equipment.name} added to cart for ${type}!`);
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

  const discountedPrice = equipment.price * (1 - getMembershipDiscount());
  const discountedRentalPrice = equipment.rentalPrice * (1 - getMembershipDiscount());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/equipment" className="hover:text-ocean-600 transition-colors">Equipment</Link>
          <span>/</span>
          <span className="capitalize">{equipment.category}</span>
          <span>/</span>
          <span className="text-gray-900">{equipment.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/equipment"
          className="inline-flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Equipment</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
              <img
                src={equipment.images[selectedImage]}
                alt={equipment.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {equipment.images.length > 1 && (
              <div className="flex space-x-2">
                {equipment.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-ocean-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${equipment.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-full text-sm font-medium">
                  {equipment.category.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-ocean-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
              <p className="text-lg text-ocean-600 font-medium mb-4">{equipment.brand}</p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{equipment.ratings}</span>
                  <span className="text-gray-600">({equipment.reviews.length} reviews)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Stock: {equipment.stock} available
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-4">
                  <div>
                    <div className="text-3xl font-bold text-ocean-600">
                      RM {user ? discountedPrice.toFixed(2) : equipment.price.toFixed(2)}
                    </div>
                    {user && getMembershipDiscount() > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        RM {equipment.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  {equipment.isRentable && (
                    <div>
                      <div className="text-lg font-semibold text-coral-600">
                        RM {user ? discountedRentalPrice.toFixed(2) : equipment.rentalPrice.toFixed(2)}/week
                      </div>
                      {user && getMembershipDiscount() > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          RM {equipment.rentalPrice.toFixed(2)}/week
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {user && getMembershipDiscount() > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <div className="text-sm text-green-800">
                      <strong>Membership Discount:</strong> {(getMembershipDiscount() * 100).toFixed(0)}% off as a {user.membershipTier.replace('-', ' ')} member!
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6">{equipment.description}</p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(equipment.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rental Duration */}
              {equipment.isRentable && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Duration</label>
                  <select
                    value={rentalDuration}
                    onChange={(e) => setRentalDuration(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  >
                    <option value={7}>1 Week</option>
                    <option value={14}>2 Weeks</option>
                    <option value={21}>3 Weeks</option>
                    <option value={30}>1 Month</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleAddToCart('purchase')}
                  disabled={!equipment.available}
                  className="w-full bg-ocean-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{user ? 'Add to Cart - Buy' : 'Login to Buy'}</span>
                </button>

                {equipment.isRentable && (
                  <button
                    onClick={() => handleAddToCart('rental')}
                    disabled={!equipment.available}
                    className="w-full bg-coral-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-coral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>{user ? 'Add to Cart - Rent' : 'Login to Rent'}</span>
                  </button>
                )}
              </div>

              {/* Guest CTA */}
              {!user && (
                <div className="mt-4 p-4 bg-ocean-50 border border-ocean-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-ocean-800 mb-2">
                      <strong>Sign up for exclusive member benefits:</strong>
                    </p>
                    <ul className="text-xs text-ocean-700 space-y-1 mb-3">
                      <li>• Up to 15% discount on all equipment</li>
                      <li>• Earn points with every purchase</li>
                      <li>• Priority access to new products</li>
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

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="h-6 w-6 text-ocean-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Quality Guaranteed</div>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 text-ocean-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Free Shipping</div>
                </div>
                <div className="text-center">
                  <Award className="h-6 w-6 text-ocean-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Certified Gear</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'reviews', label: 'Reviews' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-ocean-600 text-ocean-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">{equipment.description}</p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(equipment.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}