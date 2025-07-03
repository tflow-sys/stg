import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, Star, Heart, Eye, Zap, Clock, Info } from 'lucide-react';
import { Equipment } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../UI/Badge';
import { useToast } from '../../hooks/useToast';

interface EquipmentCardProps {
  equipment: Equipment;
  onGuestAction?: () => void;
}

export function EquipmentCard({ equipment, onGuestAction }: EquipmentCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRentalInfo, setShowRentalInfo] = useState(false);

  const handleAddToCart = (type: 'purchase' | 'rental') => {
    if (!user) {
      onGuestAction?.();
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

  const handleRentNow = () => {
    if (!user) {
      onGuestAction?.();
      return;
    }
    
    // Add to cart as rental with default 7-day duration
    handleAddToCart('rental');
  };

  const handleWishlist = () => {
    if (!user) {
      onGuestAction?.();
      return;
    }
    setIsLiked(!isLiked);
    showToast('success', isLiked ? 'Removed from wishlist' : 'Added to wishlist');
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

  // Enhanced badges for guest experience
  const badges = [];
  if (equipment.price < 100) badges.push({ label: 'Best Value', variant: 'success' });
  if (equipment.ratings >= 4.8) badges.push({ label: 'Best Seller', variant: 'ocean' });
  if (Math.random() > 0.7) badges.push({ label: 'New', variant: 'info' });
  if (Math.random() > 0.8) badges.push({ label: 'On Sale', variant: 'coral' });

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-56">
        <img
          src={equipment.images[0]}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <Badge variant="ocean" size="sm">
            {equipment.category.toUpperCase()}
          </Badge>
          {user && getMembershipDiscount() > 0 && (
            <Badge variant="coral" size="sm" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              {(getMembershipDiscount() * 100).toFixed(0)}% OFF
            </Badge>
          )}
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant as any} size="sm">
              {badge.label}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/equipment/${equipment.id}`}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {equipment.isRentable && (
            <button
              onClick={() => setShowRentalInfo(!showRentalInfo)}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Stock Status */}
        {!equipment.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Badge variant="error" size="lg">Out of Stock</Badge>
          </div>
        )}

        {/* Quick Actions for Mobile/Always Visible */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
          isHovered || window.innerWidth < 1024 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAddToCart('purchase')}
              disabled={!equipment.available}
              className="flex-1 bg-ocean-600 hover:bg-ocean-700 text-white py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 backdrop-blur-sm text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{user ? 'Buy' : 'Add to Cart'}</span>
            </button>
            
            {equipment.isRentable && (
              <button
                onClick={handleRentNow}
                disabled={!equipment.available}
                className="flex-1 bg-coral-600 hover:bg-coral-700 text-white py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 backdrop-blur-sm text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Rent</span>
              </button>
            )}
          </div>
        </div>

        {/* Rental Info Tooltip */}
        {showRentalInfo && equipment.isRentable && (
          <div className="absolute top-16 right-3 bg-gray-900 text-white p-3 rounded-lg shadow-lg z-10 w-48 text-xs">
            <div className="space-y-1">
              <div className="font-medium">Rental Information:</div>
              <div>• Minimum: 1 day</div>
              <div>• Weekly rate: RM {equipment.rentalPrice}</div>
              <div>• Security deposit required</div>
              <div>• Professional cleaning included</div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ocean-600">{equipment.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{equipment.ratings}</span>
            <span className="text-xs text-gray-500">({equipment.reviews.length})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-ocean-600 transition-colors">
          <Link to={`/equipment/${equipment.id}`}>
            {equipment.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {equipment.description}
        </p>

        {/* Pricing */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-ocean-600">
                  RM {user ? discountedPrice.toFixed(2) : equipment.price.toFixed(2)}
                </span>
                {user && getMembershipDiscount() > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    RM {equipment.price.toFixed(2)}
                  </span>
                )}
              </div>
              {equipment.isRentable && (
                <div className="text-sm text-coral-600 font-medium">
                  Rent: RM {user ? discountedRentalPrice.toFixed(2) : equipment.rentalPrice.toFixed(2)}/week
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Stock</div>
              <div className={`text-sm font-medium ${equipment.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                {equipment.stock} left
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="flex space-x-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleAddToCart('purchase')}
            disabled={!equipment.available}
            className="flex-1 bg-ocean-600 hover:bg-ocean-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{user ? 'Buy Now' : 'Add to Cart'}</span>
          </button>
          
          {equipment.isRentable && (
            <button
              onClick={handleRentNow}
              disabled={!equipment.available}
              className="flex-1 bg-coral-600 hover:bg-coral-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              <Calendar className="h-4 w-4" />
              <span>Rent</span>
            </button>
          )}
        </div>

        {/* Guest Benefits Hint */}
        {!user && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              <span className="text-ocean-600 font-medium">Sign up</span> for member discounts up to 15%
            </p>
          </div>
        )}

        {/* Member Benefits Display */}
        {user && getMembershipDiscount() > 0 && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-800 text-center">
              <strong>Member Discount Applied:</strong> {(getMembershipDiscount() * 100).toFixed(0)}% off
            </div>
          </div>
        )}
      </div>
    </div>
  );
}