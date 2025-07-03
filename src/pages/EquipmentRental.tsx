import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, CreditCard, CheckCircle, AlertCircle, 
  ArrowLeft, ArrowRight, Package, Shield, Truck, Calculator,
  User, Phone, Mail, Info, Star, Award, Crown
} from 'lucide-react';
import { mockEquipment } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

interface RentalDetails {
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  quantity: number;
  totalCost: number;
  securityDeposit: number;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  specialRequests?: string;
}

interface PaymentDetails {
  method: 'credit_card' | 'debit_card' | 'online_banking';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export function EquipmentRental() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  // Process steps
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rentalId, setRentalId] = useState<string | null>(null);

  // Form data
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [rentalDetails, setRentalDetails] = useState<RentalDetails>({
    equipmentId: '',
    startDate: new Date(),
    endDate: new Date(),
    duration: 1,
    quantity: 1,
    totalCost: 0,
    securityDeposit: 0,
    deliveryMethod: 'pickup'
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'credit_card'
  });

  // Validation and errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if equipment ID is provided in URL params
    const equipmentId = searchParams.get('equipment');
    if (equipmentId) {
      const equipment = mockEquipment.find(e => e.id === equipmentId);
      if (equipment && equipment.isRentable) {
        setSelectedEquipment(equipment);
        setRentalDetails(prev => ({ ...prev, equipmentId: equipment.id }));
      }
    }
  }, [searchParams]);

  // Step 1: Select Equipment for Rental
  const renderEquipmentSelection = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Equipment for Rental</h2>
      
      {selectedEquipment ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-start space-x-4">
            <img
              src={selectedEquipment.images[0]}
              alt={selectedEquipment.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEquipment.name}</h3>
              <p className="text-ocean-600 font-medium">{selectedEquipment.brand}</p>
              <p className="text-gray-600 text-sm mt-2">{selectedEquipment.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{selectedEquipment.ratings}</span>
                </div>
                <Badge variant="success" size="sm">Available for Rental</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ocean-600">
                RM {selectedEquipment.rentalPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">per week</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedEquipment(null)}
            className="mt-4 text-ocean-600 hover:text-ocean-700 text-sm font-medium"
          >
            Choose Different Equipment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEquipment.filter(e => e.isRentable).map(equipment => (
            <div
              key={equipment.id}
              onClick={() => {
                setSelectedEquipment(equipment);
                setRentalDetails(prev => ({ ...prev, equipmentId: equipment.id }));
              }}
              className="border border-gray-200 rounded-lg p-4 hover:border-ocean-500 hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={equipment.images[0]}
                alt={equipment.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-1">{equipment.name}</h3>
              <p className="text-ocean-600 text-sm mb-2">{equipment.brand}</p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-ocean-600">
                  RM {equipment.rentalPrice.toFixed(2)}/week
                </div>
                <Badge variant="success" size="sm">Rentable</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  // Step 2: Specify Rental Start and End Dates
  const renderDateSelection = () => {
    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
      const date = new Date(value);
      const updatedDetails = { ...rentalDetails, [field]: date };
      
      if (field === 'startDate' && date >= updatedDetails.endDate) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        updatedDetails.endDate = newEndDate;
      }
      
      // Calculate duration in days
      const timeDiff = updatedDetails.endDate.getTime() - updatedDetails.startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      updatedDetails.duration = daysDiff;
      
      setRentalDetails(updatedDetails);
      setAvailabilityChecked(false);
    };

    return (
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Specify Rental Dates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={rentalDetails.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              min={new Date(rentalDetails.startDate.getTime() + 86400000).toISOString().split('T')[0]}
              value={rentalDetails.endDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              value={rentalDetails.quantity}
              onChange={(e) => setRentalDetails(prev => ({ 
                ...prev, 
                quantity: parseInt(e.target.value) 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'item' : 'items'}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-ocean-50 p-4 rounded-lg w-full">
              <div className="text-sm text-ocean-700 mb-1">Rental Duration</div>
              <div className="text-2xl font-bold text-ocean-600">
                {rentalDetails.duration} {rentalDetails.duration === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Step 3: Check Equipment Availability
  const checkAvailability = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate availability check (90% chance of being available)
    const available = Math.random() > 0.1;
    setIsAvailable(available);
    setAvailabilityChecked(true);
    setIsProcessing(false);
    
    if (!available) {
      setErrors({ availability: 'Equipment is not available for the selected dates' });
    } else {
      setErrors({});
    }
  };

  const renderAvailabilityCheck = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Availability</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Equipment</div>
            <div className="font-semibold">{selectedEquipment?.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Quantity</div>
            <div className="font-semibold">{rentalDetails.quantity} items</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Start Date</div>
            <div className="font-semibold">{rentalDetails.startDate.toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">End Date</div>
            <div className="font-semibold">{rentalDetails.endDate.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {!availabilityChecked ? (
        <div className="text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600">Checking availability...</p>
            </div>
          ) : (
            <button
              onClick={checkAvailability}
              className="bg-ocean-600 text-white px-8 py-3 rounded-lg hover:bg-ocean-700 transition-colors font-semibold"
            >
              Check Availability
            </button>
          )}
        </div>
      ) : (
        <div className="text-center">
          {isAvailable ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Equipment Available!</h3>
              <p className="text-green-700">The equipment is available for your selected dates.</p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Equipment Unavailable</h3>
              <p className="text-red-700 mb-4">Sorry, this equipment is not available for the selected dates.</p>
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Choose Different Dates
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  // Step 4: Calculate Rental Cost
  const calculateCosts = () => {
    if (!selectedEquipment) return;
    
    const baseWeeklyRate = selectedEquipment.rentalPrice;
    const weeks = Math.ceil(rentalDetails.duration / 7);
    const subtotal = baseWeeklyRate * weeks * rentalDetails.quantity;
    
    // Apply member discount
    let discount = 0;
    if (user) {
      switch (user.membershipTier) {
        case 'sea-monsters': discount = 0.15; break;
        case 'dive-buddies': discount = 0.10; break;
        case 'water-babies': discount = 0.05; break;
      }
    }
    
    const discountAmount = subtotal * discount;
    const totalCost = subtotal - discountAmount;
    const securityDeposit = totalCost * 0.3; // 30% security deposit
    
    setRentalDetails(prev => ({
      ...prev,
      totalCost,
      securityDeposit
    }));
  };

  useEffect(() => {
    if (selectedEquipment && rentalDetails.duration > 0) {
      calculateCosts();
    }
  }, [selectedEquipment, rentalDetails.duration, rentalDetails.quantity, user]);

  const renderCostCalculation = () => {
    const baseWeeklyRate = selectedEquipment?.rentalPrice || 0;
    const weeks = Math.ceil(rentalDetails.duration / 7);
    const subtotal = baseWeeklyRate * weeks * rentalDetails.quantity;
    
    let discount = 0;
    if (user) {
      switch (user.membershipTier) {
        case 'sea-monsters': discount = 0.15; break;
        case 'dive-buddies': discount = 0.10; break;
        case 'water-babies': discount = 0.05; break;
      }
    }
    
    const discountAmount = subtotal * discount;

    return (
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental Cost Calculation</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Base Rate (per week)</span>
            <span className="font-semibold">RM {baseWeeklyRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Duration</span>
            <span className="font-semibold">{weeks} weeks ({rentalDetails.duration} days)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Quantity</span>
            <span className="font-semibold">{rentalDetails.quantity} items</span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">RM {subtotal.toFixed(2)}</span>
            </div>
            {user && discount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Member Discount ({(discount * 100).toFixed(0)}%)</span>
                <span>-RM {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold text-ocean-600 mt-2">
              <span>Rental Total</span>
              <span>RM {rentalDetails.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-orange-600 mt-2">
              <span>Security Deposit (refundable)</span>
              <span>RM {rentalDetails.securityDeposit.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount Due</span>
              <span>RM {(rentalDetails.totalCost + rentalDetails.securityDeposit).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              {user.membershipTier === 'sea-monsters' && <Crown className="h-5 w-5 text-purple-600" />}
              {user.membershipTier === 'dive-buddies' && <Award className="h-5 w-5 text-blue-600" />}
              {user.membershipTier === 'water-babies' && <Star className="h-5 w-5 text-green-600" />}
              <span className="font-semibold text-green-800">
                Member Benefit Applied: {(discount * 100).toFixed(0)}% discount
              </span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  // Step 5: Review Rental Details
  const renderRentalReview = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Rental Details</h2>
      
      <div className="space-y-6">
        {/* Equipment Details */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Equipment</h3>
          <div className="flex items-center space-x-4">
            <img
              src={selectedEquipment?.images[0]}
              alt={selectedEquipment?.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <div className="font-semibold">{selectedEquipment?.name}</div>
              <div className="text-ocean-600">{selectedEquipment?.brand}</div>
              <div className="text-sm text-gray-600">Quantity: {rentalDetails.quantity}</div>
            </div>
          </div>
        </div>

        {/* Rental Period */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Rental Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Start Date</div>
              <div className="font-semibold">{rentalDetails.startDate.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">End Date</div>
              <div className="font-semibold">{rentalDetails.endDate.toLocaleDateString()}</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold">{rentalDetails.duration} days</div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Delivery Method</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={rentalDetails.deliveryMethod === 'pickup'}
                onChange={(e) => setRentalDetails(prev => ({ 
                  ...prev, 
                  deliveryMethod: e.target.value as 'pickup' | 'delivery' 
                }))}
                className="text-ocean-600 focus:ring-ocean-500"
              />
              <div>
                <div className="font-medium">Store Pickup (Free)</div>
                <div className="text-sm text-gray-600">Collect from our Kuala Lumpur store</div>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={rentalDetails.deliveryMethod === 'delivery'}
                onChange={(e) => setRentalDetails(prev => ({ 
                  ...prev, 
                  deliveryMethod: e.target.value as 'pickup' | 'delivery' 
                }))}
                className="text-ocean-600 focus:ring-ocean-500"
              />
              <div>
                <div className="font-medium">Home Delivery (+RM 25)</div>
                <div className="text-sm text-gray-600">Delivered to your address</div>
              </div>
            </label>
          </div>
          
          {rentalDetails.deliveryMethod === 'delivery' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={rentalDetails.deliveryAddress || ''}
                onChange={(e) => setRentalDetails(prev => ({ 
                  ...prev, 
                  deliveryAddress: e.target.value 
                }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Enter your delivery address"
              />
            </div>
          )}
        </div>

        {/* Special Requests */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Special Requests (Optional)</h3>
          <textarea
            value={rentalDetails.specialRequests || ''}
            onChange={(e) => setRentalDetails(prev => ({ 
              ...prev, 
              specialRequests: e.target.value 
            }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            placeholder="Any special requirements or notes..."
          />
        </div>

        {/* Cost Summary */}
        <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4">
          <h3 className="font-semibold text-ocean-900 mb-3">Cost Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Rental Cost</span>
              <span>RM {rentalDetails.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>RM {rentalDetails.securityDeposit.toFixed(2)}</span>
            </div>
            {rentalDetails.deliveryMethod === 'delivery' && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>RM 25.00</span>
              </div>
            )}
            <div className="border-t border-ocean-200 pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>RM {(rentalDetails.totalCost + rentalDetails.securityDeposit + (rentalDetails.deliveryMethod === 'delivery' ? 25 : 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Step 6: Process Payment
  const renderPaymentProcessing = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3 mb-6">
            {[
              { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
              { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
              { value: 'online_banking', label: 'Online Banking', icon: CreditCard }
            ].map((method) => (
              <label key={method.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={paymentDetails.method === method.value}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    method: e.target.value as any 
                  }))}
                  className="text-ocean-600 focus:ring-ocean-500"
                />
                <method.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{method.label}</span>
              </label>
            ))}
          </div>

          {(paymentDetails.method === 'credit_card' || paymentDetails.method === 'debit_card') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardholderName || ''}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    cardholderName: e.target.value 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Enter cardholder name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardNumber || ''}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    cardNumber: e.target.value 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.expiryDate || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ 
                      ...prev, 
                      expiryDate: e.target.value 
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cvv || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ 
                      ...prev, 
                      cvv: e.target.value 
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment Rental</span>
                <span>RM {rentalDetails.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span>RM {rentalDetails.securityDeposit.toFixed(2)}</span>
              </div>
              {rentalDetails.deliveryMethod === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>RM 25.00</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>RM {(rentalDetails.totalCost + rentalDetails.securityDeposit + (rentalDetails.deliveryMethod === 'delivery' ? 25 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Security Deposit</div>
                  <div>The security deposit will be refunded within 3-5 business days after equipment return, subject to inspection.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Process rental payment
  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate rental ID
    const newRentalId = `RNT-${Date.now()}`;
    setRentalId(newRentalId);
    
    setIsProcessing(false);
    setShowConfirmation(true);
  };

  // Step 7: Display Rental Confirmation
  const renderConfirmation = () => (
    <Card>
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Confirmed!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Your equipment rental has been successfully processed.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="text-left space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Rental ID:</span>
              <span className="font-bold text-green-800">{rentalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Equipment:</span>
              <span>{selectedEquipment?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rental Period:</span>
              <span>{rentalDetails.startDate.toLocaleDateString()} - {rentalDetails.endDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Paid:</span>
              <span className="font-bold">RM {(rentalDetails.totalCost + rentalDetails.securityDeposit + (rentalDetails.deliveryMethod === 'delivery' ? 25 : 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-medium text-blue-800">Equipment Ready</div>
            <div className="text-sm text-blue-600">We'll prepare your equipment</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="font-medium text-purple-800">
              {rentalDetails.deliveryMethod === 'delivery' ? 'Delivery Scheduled' : 'Ready for Pickup'}
            </div>
            <div className="text-sm text-purple-600">
              {rentalDetails.deliveryMethod === 'delivery' ? 'On your start date' : 'Visit our store'}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium text-green-800">Insured & Protected</div>
            <div className="text-sm text-green-600">Full coverage included</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-ocean-600 text-white px-8 py-3 rounded-lg hover:bg-ocean-700 transition-colors font-semibold"
          >
            View My Rentals
          </button>
          <button
            onClick={() => navigate('/equipment')}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Rent More Equipment
          </button>
        </div>
      </div>
    </Card>
  );

  // Navigation functions
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedEquipment !== null;
      case 2: return rentalDetails.duration > 0;
      case 3: return availabilityChecked && isAvailable;
      case 4: return rentalDetails.totalCost > 0;
      case 5: return true;
      case 6: return paymentDetails.method !== '';
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 3 && !availabilityChecked) {
      checkAvailability();
      return;
    }
    
    if (currentStep === 6) {
      processPayment();
      return;
    }
    
    if (canProceedToNext()) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const steps = [
    { number: 1, title: 'Select Equipment', component: renderEquipmentSelection },
    { number: 2, title: 'Choose Dates', component: renderDateSelection },
    { number: 3, title: 'Check Availability', component: renderAvailabilityCheck },
    { number: 4, title: 'Calculate Cost', component: renderCostCalculation },
    { number: 5, title: 'Review Details', component: renderRentalReview },
    { number: 6, title: 'Payment', component: renderPaymentProcessing },
    { number: 7, title: 'Confirmation', component: renderConfirmation }
  ];

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderConfirmation()}
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
            onClick={() => navigate('/equipment')}
            className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Equipment</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Rental Process</h1>
          <p className="text-gray-600 mt-2">Follow the steps below to complete your equipment rental</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.slice(0, 6).map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-ocean-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    currentStep >= step.number ? 'text-ocean-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.slice(0, 6).length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-ocean-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          {steps[currentStep - 1]?.component()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 7 && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceedToNext() || isProcessing}
              className="flex items-center space-x-2 px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>
                    {currentStep === 3 ? 'Checking...' : 
                     currentStep === 6 ? 'Processing...' : 'Loading...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {currentStep === 3 && !availabilityChecked ? 'Check Availability' :
                     currentStep === 6 ? 'Process Payment' : 'Next'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}