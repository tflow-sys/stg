import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Lock, Truck, MapPin, User, Phone, Mail, Calendar, 
  Package, Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight,
  Shield, Award, Crown, Star, Gift, Zap, Info, Eye, EyeOff
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { DeliveryAddress, PaymentDetails, Order, Rental, PackageBooking } from '../types';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getItemDetails, validateCart } = useCart();
  const { user } = useAuth();
  const { createOrder, createRental, createBooking } = useOrder();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [completedOrders, setCompletedOrders] = useState<{
    orders: Order[];
    rentals: Rental[];
    bookings: PackageBooking[];
  }>({ orders: [], rentals: [], bookings: [] });

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Malaysia',
    isDefault: false
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'credit_card'
  });

  const [showCardDetails, setShowCardDetails] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Validate cart on load
    const validation = validateCart();
    if (!validation.isValid) {
      showToast('error', 'Some items in your cart are no longer available');
      navigate('/cart');
      return;
    }

    // Pre-fill address from user profile if available
    if (user.address) {
      const addressParts = user.address.split(', ');
      if (addressParts.length >= 4) {
        setDeliveryAddress(prev => ({
          ...prev,
          addressLine1: addressParts[0],
          city: addressParts[1],
          state: addressParts[2],
          country: addressParts[3] || 'Malaysia'
        }));
      }
    }
  }, [user, items, navigate, validateCart, showToast]);

  const getMembershipDiscount = () => {
    if (!user) return 0;
    switch (user.membershipTier) {
      case 'sea-monsters': return 0.15;
      case 'dive-buddies': return 0.10;
      case 'water-babies': return 0.05;
      default: return 0;
    }
  };

  const getMembershipBadge = () => {
    if (!user) return null;
    switch (user.membershipTier) {
      case 'sea-monsters':
        return { icon: Crown, label: 'Sea Monster', color: 'from-purple-500 to-pink-600' };
      case 'dive-buddies':
        return { icon: Award, label: 'Dive Buddy', color: 'from-blue-500 to-cyan-600' };
      case 'water-babies':
        return { icon: Star, label: 'Water Baby', color: 'from-emerald-500 to-blue-600' };
      default:
        return null;
    }
  };

  const calculateTotals = () => {
    const subtotal = getSubtotal();
    const membershipDiscount = subtotal * getMembershipDiscount();
    const tax = (subtotal - membershipDiscount) * 0.06; // 6% tax
    const shipping = subtotal > 200 ? 0 : 25; // Free shipping over RM 200
    const total = subtotal - membershipDiscount + tax + shipping;

    return {
      subtotal,
      membershipDiscount,
      tax,
      shipping,
      total
    };
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? 'Full name is required' : '';
      case 'phone':
        return !value.trim() ? 'Phone number is required' : 
               !/^\+?[\d\s\-\(\)]{8,}$/.test(value) ? 'Please enter a valid phone number' : '';
      case 'addressLine1':
        return !value.trim() ? 'Address is required' : '';
      case 'city':
        return !value.trim() ? 'City is required' : '';
      case 'state':
        return !value.trim() ? 'State is required' : '';
      case 'postalCode':
        return !value.trim() ? 'Postal code is required' : 
               deliveryAddress.country === 'Malaysia' && !/^\d{5}$/.test(value) ? 'Malaysian postal code must be 5 digits' : '';
      case 'cardNumber':
        return paymentDetails.method.includes('card') && !value?.replace(/\s/g, '').match(/^\d{16}$/) ? 'Please enter a valid 16-digit card number' : '';
      case 'expiryDate':
        return paymentDetails.method.includes('card') && !value?.match(/^(0[1-9]|1[0-2])\/\d{2}$/) ? 'Please enter a valid expiry date (MM/YY)' : '';
      case 'cvv':
        return paymentDetails.method.includes('card') && !value?.match(/^\d{3,4}$/) ? 'Please enter a valid CVV' : '';
      case 'cardholderName':
        return paymentDetails.method.includes('card') && !value?.trim() ? 'Cardholder name is required' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setDeliveryAddress(prev => ({ ...prev, [addressField]: value }));
    } else if (field.startsWith('payment.')) {
      const paymentField = field.replace('payment.', '');
      setPaymentDetails(prev => ({ ...prev, [paymentField]: value }));
    }

    // Real-time validation for touched fields
    if (touchedFields.has(field)) {
      const error = validateField(field.replace('address.', '').replace('payment.', ''), value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string, value: any) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field.replace('address.', '').replace('payment.', ''), value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateStep = (step: number): boolean => {
    const stepFields: { [key: number]: string[] } = {
      1: ['address.fullName', 'address.phone', 'address.addressLine1', 'address.city', 'address.state', 'address.postalCode'],
      2: paymentDetails.method.includes('card') 
        ? ['payment.cardNumber', 'payment.expiryDate', 'payment.cvv', 'payment.cardholderName']
        : [],
      3: []
    };

    const fieldsToValidate = stepFields[step] || [];
    let isValid = true;
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach(field => {
      const fieldName = field.replace('address.', '').replace('payment.', '');
      const value = field.startsWith('address.') 
        ? deliveryAddress[fieldName as keyof DeliveryAddress]
        : paymentDetails[fieldName as keyof PaymentDetails];
      
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (step === 3 && !agreeToTerms) {
      newErrors['terms'] = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const processCheckout = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const totals = calculateTotals();
      const orders: Order[] = [];
      const rentals: Rental[] = [];
      const bookings: PackageBooking[] = [];

      // Group items by type and process accordingly
      const purchaseItems = items.filter(item => item.type === 'purchase');
      const rentalItems = items.filter(item => item.type === 'rental');
      const packageItems = items.filter(item => item.type === 'package');

      // Create purchase order
      if (purchaseItems.length > 0) {
        const purchaseTotal = purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const order = await createOrder({
          userId: user!.id,
          items: purchaseItems,
          subtotal: purchaseTotal,
          discount: purchaseTotal * getMembershipDiscount(),
          tax: (purchaseTotal - (purchaseTotal * getMembershipDiscount())) * 0.06,
          shipping: totals.shipping,
          total: purchaseTotal - (purchaseTotal * getMembershipDiscount()) + ((purchaseTotal - (purchaseTotal * getMembershipDiscount())) * 0.06) + totals.shipping,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: paymentDetails.method,
          deliveryAddress,
          notes: 'Order processed through checkout'
        });
        orders.push(order);
      }

      // Create rental orders
      for (const item of rentalItems) {
        const rental = await createRental({
          userId: user!.id,
          equipmentId: item.equipmentId!,
          quantity: item.quantity,
          rentalDuration: item.rentalDuration || 7,
          startDate: new Date(),
          endDate: new Date(Date.now() + (item.rentalDuration || 7) * 24 * 60 * 60 * 1000),
          status: 'confirmed',
          totalCost: item.price * item.quantity,
          securityDeposit: (item.price * item.quantity) * 0.3,
          deliveryMethod: 'delivery',
          deliveryAddress
        });
        rentals.push(rental);
      }

      // Create package bookings
      for (const item of packageItems) {
        const booking = await createBooking({
          userId: user!.id,
          packageId: item.packageId!,
          selectedDate: item.selectedDate!,
          participants: item.participants || 1,
          participantDetails: [], // Would be filled in a real implementation
          totalCost: item.price * (item.participants || 1),
          status: 'confirmed',
          paymentStatus: 'paid',
          emergencyContact: {
            name: deliveryAddress.fullName,
            phone: deliveryAddress.phone,
            relationship: 'Self'
          }
        });
        bookings.push(booking);
      }

      setCompletedOrders({ orders, rentals, bookings });
      clearCart();
      setShowOrderConfirmation(true);

      showToast('success', 'Order processed successfully!');

    } catch (error) {
      console.error('Checkout error:', error);
      showToast('error', 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            step <= currentStep 
              ? 'bg-ocean-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? 'bg-ocean-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderDeliveryStep = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={deliveryAddress.fullName}
              onChange={(e) => handleInputChange('address.fullName', e.target.value)}
              onBlur={(e) => handleBlur('address.fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors['address.fullName'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors['address.fullName'] && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors['address.fullName']}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              value={deliveryAddress.phone}
              onChange={(e) => handleInputChange('address.phone', e.target.value)}
              onBlur={(e) => handleBlur('address.phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors['address.phone'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors['address.phone'] && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors['address.phone']}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 1 *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={deliveryAddress.addressLine1}
            onChange={(e) => handleInputChange('address.addressLine1', e.target.value)}
            onBlur={(e) => handleBlur('address.addressLine1', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors['address.addressLine1'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Street address, building number, unit number"
          />
        </div>
        {errors['address.addressLine1'] && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {errors['address.addressLine1']}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={deliveryAddress.addressLine2}
          onChange={(e) => handleInputChange('address.addressLine2', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
          placeholder="Apartment, suite, floor (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={deliveryAddress.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            onBlur={(e) => handleBlur('address.city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors['address.city'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter city"
          />
          {errors['address.city'] && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors['address.city']}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={deliveryAddress.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            onBlur={(e) => handleBlur('address.state', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors['address.state'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            {['Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca', 'Negeri Sembilan',
              'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'].map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors['address.state'] && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors['address.state']}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={deliveryAddress.postalCode}
            onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
            onBlur={(e) => handleBlur('address.postalCode', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors['address.postalCode'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="12345"
          />
          {errors['address.postalCode'] && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors['address.postalCode']}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="defaultAddress"
          checked={deliveryAddress.isDefault}
          onChange={(e) => handleInputChange('address.isDefault', e.target.checked)}
          className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
        />
        <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-700">
          Save as default delivery address
        </label>
      </div>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
            { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
            { value: 'online_banking', label: 'Online Banking', icon: Shield }
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                paymentDetails.method === method.value
                  ? 'border-ocean-600 bg-ocean-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentDetails.method === method.value}
                onChange={(e) => handleInputChange('payment.method', e.target.value)}
                className="sr-only"
              />
              <method.icon className="h-6 w-6 text-gray-600 mr-3" />
              <span className="font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {paymentDetails.method.includes('card') && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              value={paymentDetails.cardholderName || ''}
              onChange={(e) => handleInputChange('payment.cardholderName', e.target.value)}
              onBlur={(e) => handleBlur('payment.cardholderName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors['payment.cardholderName'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter cardholder name"
            />
            {errors['payment.cardholderName'] && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors['payment.cardholderName']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={paymentDetails.cardNumber || ''}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                  handleInputChange('payment.cardNumber', value);
                }}
                onBlur={(e) => handleBlur('payment.cardNumber', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                  errors['payment.cardNumber'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            {errors['payment.cardNumber'] && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors['payment.cardNumber']}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={paymentDetails.expiryDate || ''}
                onChange={(e) => {
                  // Format expiry date MM/YY
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  }
                  handleInputChange('payment.expiryDate', value);
                }}
                onBlur={(e) => handleBlur('payment.expiryDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                  errors['payment.expiryDate'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors['payment.expiryDate'] && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors['payment.expiryDate']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <div className="relative">
                <input
                  type={showCardDetails ? 'text' : 'password'}
                  value={paymentDetails.cvv || ''}
                  onChange={(e) => handleInputChange('payment.cvv', e.target.value.replace(/\D/g, ''))}
                  onBlur={(e) => handleBlur('payment.cvv', e.target.value)}
                  className={`w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                    errors['payment.cvv'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowCardDetails(!showCardDetails)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCardDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors['payment.cvv'] && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors['payment.cvv']}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Online Banking */}
      {paymentDetails.method === 'online_banking' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Secure Online Banking</span>
          </div>
          <p className="text-sm text-blue-700">
            You will be redirected to your bank's secure payment portal to complete the transaction.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">Your payment is secure</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          All transactions are encrypted and processed through secure payment gateways.
        </p>
      </div>
    </Card>
  );

  const renderReviewStep = () => {
    const totals = calculateTotals();
    const membershipBadge = getMembershipBadge();

    return (
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const details = getItemDetails(item);
              if (!details) return null;

              return (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={details.images[0]}
                    alt={details.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{details.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {item.type === 'rental' && <Clock className="h-4 w-4" />}
                      {item.type === 'package' && <Package className="h-4 w-4" />}
                      <span className="capitalize">{item.type}</span>
                      {item.rentalDuration && <span>• {item.rentalDuration} days</span>}
                      {item.participants && <span>• {item.participants} participants</span>}
                      {item.selectedDate && <span>• {item.selectedDate.toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      RM {(item.price * (item.type === 'package' ? (item.participants || 1) : item.quantity)).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.type === 'package' ? `${item.participants || 1} × RM ${item.price.toFixed(2)}` : `${item.quantity} × RM ${item.price.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">RM {totals.subtotal.toFixed(2)}</span>
            </div>
            
            {totals.membershipDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Membership Discount ({(getMembershipDiscount() * 100).toFixed(0)}%)</span>
                <span>-RM {totals.membershipDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (6%)</span>
              <span className="font-medium">RM {totals.tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {totals.shipping === 0 ? 'FREE' : `RM ${totals.shipping.toFixed(2)}`}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-ocean-600">RM {totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Member Benefits */}
          {membershipBadge && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <membershipBadge.icon className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  {membershipBadge.label} Member Benefits Applied
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You saved RM {totals.membershipDiscount.toFixed(2)} with your membership!
              </p>
            </div>
          )}
        </Card>

        {/* Delivery & Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
            <div className="space-y-2 text-sm">
              <div className="font-medium">{deliveryAddress.fullName}</div>
              <div>{deliveryAddress.phone}</div>
              <div>{deliveryAddress.addressLine1}</div>
              {deliveryAddress.addressLine2 && <div>{deliveryAddress.addressLine2}</div>}
              <div>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.postalCode}</div>
              <div>{deliveryAddress.country}</div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="capitalize">{paymentDetails.method.replace('_', ' ')}</span>
            </div>
            {paymentDetails.method.includes('card') && paymentDetails.cardNumber && (
              <div className="text-sm text-gray-600 mt-2">
                **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </div>
            )}
          </Card>
        </div>

        {/* Terms and Conditions */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-ocean-600 hover:text-ocean-700 underline" target="_blank">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-ocean-600 hover:text-ocean-700 underline" target="_blank">
                  Privacy Policy
                </a>
                . *
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-600 text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.terms}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="subscribeNewsletter"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mt-1 h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
              />
              <label htmlFor="subscribeNewsletter" className="text-sm text-gray-700">
                Subscribe to our newsletter for exclusive offers and diving tips
              </label>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderOrderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        <p className="text-lg text-gray-600">
          Thank you for your order. We've sent a confirmation email with your order details.
        </p>
      </div>

      {/* Order Numbers */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Your Order Numbers</h3>
        <div className="space-y-2">
          {completedOrders.orders.map(order => (
            <div key={order.id} className="flex justify-between items-center">
              <span className="text-green-700">Purchase Order:</span>
              <span className="font-mono font-bold text-green-800">{order.orderNumber}</span>
            </div>
          ))}
          {completedOrders.rentals.map(rental => (
            <div key={rental.id} className="flex justify-between items-center">
              <span className="text-green-700">Rental Order:</span>
              <span className="font-mono font-bold text-green-800">{rental.rentalNumber}</span>
            </div>
          ))}
          {completedOrders.bookings.map(booking => (
            <div key={booking.id} className="flex justify-between items-center">
              <span className="text-green-700">Package Booking:</span>
              <span className="font-mono font-bold text-green-800">{booking.bookingNumber}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="font-medium text-blue-800">Order Processing</div>
          <div className="text-sm text-blue-600">We'll prepare your items</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="font-medium text-purple-800">Shipping</div>
          <div className="text-sm text-purple-600">Estimated 3-5 business days</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="font-medium text-green-800">Delivery</div>
          <div className="text-sm text-green-600">Track your order online</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-ocean-600 text-white px-8 py-3 rounded-lg hover:bg-ocean-700 transition-colors font-semibold"
        >
          View Order Status
        </button>
        <button
          onClick={() => navigate('/equipment')}
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (showOrderConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            {renderOrderConfirmation()}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepIndicator()}
            
            {currentStep === 1 && renderDeliveryStep()}
            {currentStep === 2 && renderPaymentStep()}
            {currentStep === 3 && renderReviewStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={processCheckout}
                  disabled={isProcessing || !agreeToTerms}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Complete Order</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items Preview */}
              <div className="space-y-3 mb-6">
                {items.slice(0, 3).map((item) => {
                  const details = getItemDetails(item);
                  if (!details) return null;

                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={details.images[0]}
                        alt={details.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {details.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.type === 'package' ? `${item.participants || 1} participants` : `Qty: ${item.quantity}`}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        RM {(item.price * (item.type === 'package' ? (item.participants || 1) : item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
                {items.length > 3 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{items.length - 3} more items
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>RM {calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                
                {calculateTotals().membershipDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Member Discount</span>
                    <span>-RM {calculateTotals().membershipDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>RM {calculateTotals().tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{calculateTotals().shipping === 0 ? 'FREE' : `RM ${calculateTotals().shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-ocean-600">RM {calculateTotals().total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Free shipping over RM 200</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>Earn points with purchase</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}