import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Calendar, Package, ArrowRight, Shield, Truck, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { mockEquipment, mockDivePackages } from '../data/mockData';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const getItemDetails = (item: any) => {
    if (item.equipmentId) {
      return mockEquipment.find(e => e.id === item.equipmentId);
    }
    if (item.packageId) {
      return mockDivePackages.find(p => p.id === item.packageId);
    }
    return null;
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
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

  const subtotal = getTotal();
  const discount = subtotal * getMembershipDiscount();
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start exploring our amazing dive equipment and packages!</p>
          <div className="space-y-3">
            <Link
              to="/equipment"
              className="block w-full bg-ocean-600 text-white py-3 px-6 rounded-lg hover:bg-ocean-700 transition-colors font-medium"
            >
              Shop Equipment
            </Link>
            <Link
              to="/packages"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const details = getItemDetails(item);
                  if (!details) return null;

                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={details.images[0]}
                          alt={details.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{details.name}</h3>
                          <p className="text-ocean-600 font-medium mb-2">{details.brand || details.diveCenterPartner}</p>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            {item.type === 'rental' && <Calendar className="h-4 w-4" />}
                            {item.type === 'package' && <Package className="h-4 w-4" />}
                            <span className="capitalize">{item.type}</span>
                            {item.rentalDuration && <span>• {item.rentalDuration} days</span>}
                            {item.selectedDate && <span>• {item.selectedDate.toLocaleDateString()}</span>}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                RM {(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                RM {item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6 flex justify-between">
              <Link
                to="/equipment"
                className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors font-medium"
              >
                <span>← Continue Shopping</span>
              </Link>
              
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Member Benefits */}
              {user && getMembershipDiscount() > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Member Benefits</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You're saving {(getMembershipDiscount() * 100).toFixed(0)}% as a {user.membershipTier.replace('-', ' ')} member!
                  </p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">RM {subtotal.toFixed(2)}</span>
                </div>
                
                {user && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Membership Discount ({(getMembershipDiscount() * 100).toFixed(0)}%)</span>
                    <span>-RM {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-ocean-600">RM {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-ocean-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{user ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Security & Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Free shipping on orders over RM 200</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>Earn points with every purchase</span>
                </div>
              </div>

              {/* Guest Benefits */}
              {!user && (
                <div className="mt-6 p-4 bg-ocean-50 border border-ocean-200 rounded-lg">
                  <h3 className="font-semibold text-ocean-800 mb-2">Join STG Today!</h3>
                  <ul className="text-sm text-ocean-700 space-y-1 mb-3">
                    <li>• Get up to 15% member discounts</li>
                    <li>• Earn points with every purchase</li>
                    <li>• Priority access to new products</li>
                    <li>• Exclusive dive packages</li>
                  </ul>
                  <Link
                    to="/auth"
                    className="block w-full text-center bg-ocean-600 text-white py-2 px-4 rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}