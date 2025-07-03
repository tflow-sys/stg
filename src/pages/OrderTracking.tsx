import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, Package, Truck, CheckCircle, Clock, MapPin, Calendar, 
  ArrowLeft, Eye, Download, Share2, AlertTriangle, Info, Star,
  Phone, Mail, MessageCircle, RefreshCw, ExternalLink, Copy
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { Order, Rental, PackageBooking } from '../types';

export function OrderTracking() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getOrderByNumber, 
    getRentalByNumber, 
    getBookingByNumber, 
    trackOrder,
    orders,
    rentals,
    bookings 
  } = useOrder();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState(orderNumber || '');
  const [trackingData, setTrackingData] = useState<{
    order?: Order;
    rental?: Rental;
    booking?: PackageBooking;
    type?: 'order' | 'rental' | 'booking';
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'support'>('details');

  useEffect(() => {
    if (orderNumber) {
      handleTrackOrder(orderNumber);
    }
  }, [orderNumber]);

  const handleTrackOrder = async (trackingNumber: string) => {
    if (!trackingNumber.trim()) {
      showToast('error', 'Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check orders
      const order = getOrderByNumber(trackingNumber);
      if (order) {
        setTrackingData({ order, type: 'order' });
        setIsLoading(false);
        return;
      }

      // Check rentals
      const rental = getRentalByNumber(trackingNumber);
      if (rental) {
        setTrackingData({ rental, type: 'rental' });
        setIsLoading(false);
        return;
      }

      // Check bookings
      const booking = getBookingByNumber(trackingNumber);
      if (booking) {
        setTrackingData({ booking, type: 'booking' });
        setIsLoading(false);
        return;
      }

      // Not found
      setTrackingData({});
      showToast('error', 'Order not found. Please check your tracking number.');
    } catch (error) {
      showToast('error', 'Error tracking order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/track/${searchQuery.trim()}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const getStatusColor = (status: string, type: string) => {
    const statusMap: Record<string, string> = {
      // Orders
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'info',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'error',
      'refunded': 'error',
      // Rentals
      'active': 'success',
      'returned': 'success',
      'overdue': 'error',
      'damaged': 'warning',
      // Bookings
      'completed': 'success'
    };
    return statusMap[status] || 'default';
  };

  const getStatusIcon = (status: string, type: string) => {
    const iconMap: Record<string, any> = {
      'pending': Clock,
      'confirmed': CheckCircle,
      'processing': Package,
      'shipped': Truck,
      'delivered': CheckCircle,
      'cancelled': AlertTriangle,
      'refunded': AlertTriangle,
      'active': CheckCircle,
      'returned': CheckCircle,
      'overdue': AlertTriangle,
      'damaged': AlertTriangle,
      'completed': CheckCircle
    };
    return iconMap[status] || Info;
  };

  const getEstimatedDelivery = () => {
    if (trackingData.order?.estimatedDelivery) {
      return trackingData.order.estimatedDelivery;
    }
    if (trackingData.order?.shippedAt) {
      const estimated = new Date(trackingData.order.shippedAt);
      estimated.setDate(estimated.getDate() + 3);
      return estimated;
    }
    return null;
  };

  const renderTrackingTimeline = () => {
    let timeline: Array<{ status: string; timestamp: Date; notes?: string }> = [];
    
    if (trackingData.order) {
      timeline = trackingData.order.statusHistory;
    } else if (trackingData.rental) {
      timeline = trackingData.rental.statusHistory;
    } else if (trackingData.booking) {
      timeline = trackingData.booking.statusHistory;
    }

    return (
      <div className="space-y-6">
        {timeline.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status, trackingData.type || '');
          const isLatest = index === timeline.length - 1;
          
          return (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline line */}
              {index < timeline.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
              )}
              
              {/* Status icon */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${isLatest 
                  ? 'bg-ocean-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <StatusIcon className="h-6 w-6" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isLatest ? 'text-ocean-600' : 'text-gray-900'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                  </h3>
                  <time className="text-sm text-gray-500">
                    {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                  </time>
                </div>
                {item.notes && (
                  <p className="text-gray-600 mt-1">{item.notes}</p>
                )}
                {isLatest && (
                  <Badge variant="success" size="sm" className="mt-2">
                    Current Status
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOrderDetails = () => {
    const data = trackingData.order || trackingData.rental || trackingData.booking;
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {trackingData.type === 'order' ? 'Order' : 
               trackingData.type === 'rental' ? 'Rental' : 'Booking'} Summary
            </h3>
            <button
              onClick={() => copyToClipboard(
                trackingData.order?.orderNumber || 
                trackingData.rental?.rentalNumber || 
                trackingData.booking?.bookingNumber || ''
              )}
              className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy Number</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {trackingData.type === 'order' ? 'Order' : 
                 trackingData.type === 'rental' ? 'Rental' : 'Booking'} Number
              </label>
              <p className="font-mono font-bold text-lg text-ocean-600">
                {trackingData.order?.orderNumber || 
                 trackingData.rental?.rentalNumber || 
                 trackingData.booking?.bookingNumber}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Badge 
                variant={getStatusColor(data.status, trackingData.type || '') as any} 
                size="lg"
                className="mt-1"
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1).replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Date</label>
              <p className="text-gray-900">{data.createdAt.toLocaleDateString()}</p>
            </div>
            {trackingData.order && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="text-xl font-bold text-gray-900">RM {trackingData.order.total.toFixed(2)}</p>
              </div>
            )}
            {trackingData.rental && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Rental Period</label>
                <p className="text-gray-900">
                  {trackingData.rental.startDate.toLocaleDateString()} - {trackingData.rental.endDate.toLocaleDateString()}
                </p>
              </div>
            )}
            {trackingData.booking && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                <p className="text-gray-900">{trackingData.booking.selectedDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Delivery Information */}
        {trackingData.order && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium">{trackingData.order.deliveryAddress.fullName}</p>
                  <p>{trackingData.order.deliveryAddress.phone}</p>
                  <p>{trackingData.order.deliveryAddress.addressLine1}</p>
                  {trackingData.order.deliveryAddress.addressLine2 && (
                    <p>{trackingData.order.deliveryAddress.addressLine2}</p>
                  )}
                  <p>
                    {trackingData.order.deliveryAddress.city}, {trackingData.order.deliveryAddress.state} {trackingData.order.deliveryAddress.postalCode}
                  </p>
                  <p>{trackingData.order.deliveryAddress.country}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Shipping Details</h4>
                <div className="space-y-2">
                  {trackingData.order.trackingNumber && (
                    <div>
                      <span className="text-sm text-gray-600">Tracking Number:</span>
                      <p className="font-mono font-medium">{trackingData.order.trackingNumber}</p>
                    </div>
                  )}
                  {getEstimatedDelivery() && (
                    <div>
                      <span className="text-sm text-gray-600">Estimated Delivery:</span>
                      <p className="font-medium">{getEstimatedDelivery()?.toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Shipping Method:</span>
                    <p className="font-medium">Standard Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Items */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {trackingData.type === 'order' ? 'Order Items' : 
             trackingData.type === 'rental' ? 'Rental Items' : 'Package Details'}
          </h3>
          
          {trackingData.order && (
            <div className="space-y-4">
              {trackingData.order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Equipment Item</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Type: {item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">RM {item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderSupportTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Call Us</h4>
                <p className="text-blue-700">+60 3-2345-6789</p>
                <p className="text-sm text-blue-600">Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Live Chat</h4>
                <p className="text-green-700">Available 24/7</p>
                <button className="text-sm text-green-600 hover:text-green-700 underline">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600" />
              <div>
                <h4 className="font-medium text-purple-900">Email Support</h4>
                <p className="text-purple-700">support@stg.com.my</p>
                <p className="text-sm text-purple-600">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
              <ExternalLink className="h-6 w-6 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-900">Help Center</h4>
                <p className="text-orange-700">FAQs & Guides</p>
                <button className="text-sm text-orange-600 hover:text-orange-700 underline">
                  Visit Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            {
              question: "How long does shipping take?",
              answer: "Standard shipping takes 3-5 business days within Malaysia. Express shipping is available for next-day delivery."
            },
            {
              question: "Can I change my delivery address?",
              answer: "You can change your delivery address before the order is shipped. Contact our support team immediately."
            },
            {
              question: "What if my package is damaged?",
              answer: "We offer full protection for damaged packages. Contact us within 48 hours of delivery for a replacement."
            },
            {
              question: "How do I return an item?",
              answer: "Items can be returned within 30 days. Visit our returns page or contact support to initiate a return."
            }
          ].map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderUserOrders = () => {
    if (!user) return null;

    const userOrders = orders.filter(order => order.userId === user.id);
    const userRentals = rentals.filter(rental => rental.userId === user.id);
    const userBookings = bookings.filter(booking => booking.userId === user.id);

    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Your Recent Orders</h3>
        <div className="space-y-3">
          {userOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusColor(order.status, 'order') as any} size="sm">
                  {order.status}
                </Badge>
                <button
                  onClick={() => navigate(`/track/${order.orderNumber}`)}
                  className="block text-sm text-ocean-600 hover:text-ocean-700 mt-1"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
          
          {userRentals.slice(0, 3).map(rental => (
            <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{rental.rentalNumber}</p>
                <p className="text-sm text-gray-600">{rental.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusColor(rental.status, 'rental') as any} size="sm">
                  {rental.status}
                </Badge>
                <button
                  onClick={() => navigate(`/track/${rental.rentalNumber}`)}
                  className="block text-sm text-ocean-600 hover:text-ocean-700 mt-1"
                >
                  Track Rental
                </button>
              </div>
            </div>
          ))}
          
          {userBookings.slice(0, 3).map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{booking.bookingNumber}</p>
                <p className="text-sm text-gray-600">{booking.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusColor(booking.status, 'booking') as any} size="sm">
                  {booking.status}
                </Badge>
                <button
                  onClick={() => navigate(`/track/${booking.bookingNumber}`)}
                  className="block text-sm text-ocean-600 hover:text-ocean-700 mt-1"
                >
                  Track Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          </div>

          {/* Search Form */}
          <Card>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your tracking number
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="STG-123456, RNT-789012, or BKG-345678"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-ocean-600 text-white px-8 py-3 rounded-lg hover:bg-ocean-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {trackingData.order || trackingData.rental || trackingData.booking ? (
              <div className="space-y-6">
                {/* Status Card */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {trackingData.type === 'order' ? 'Order' : 
                         trackingData.type === 'rental' ? 'Rental' : 'Booking'} Status
                      </h2>
                      <p className="text-gray-600">
                        {trackingData.order?.orderNumber || 
                         trackingData.rental?.rentalNumber || 
                         trackingData.booking?.bookingNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Current Status */}
                  <div className="bg-gradient-to-r from-ocean-50 to-blue-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-4">
                      {(() => {
                        const data = trackingData.order || trackingData.rental || trackingData.booking;
                        const StatusIcon = getStatusIcon(data?.status || '', trackingData.type || '');
                        return (
                          <>
                            <div className="w-16 h-16 bg-ocean-600 rounded-full flex items-center justify-center">
                              <StatusIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-ocean-900">
                                {data?.status.charAt(0).toUpperCase() + data?.status.slice(1).replace('_', ' ')}
                              </h3>
                              <p className="text-ocean-700">
                                Last updated: {data?.updatedAt.toLocaleDateString()} at {data?.updatedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      {[
                        { id: 'details', label: 'Details', icon: Info },
                        { id: 'timeline', label: 'Timeline', icon: Clock },
                        { id: 'support', label: 'Support', icon: MessageCircle }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-ocean-600 text-ocean-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <tab.icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'details' && renderOrderDetails()}
                  {activeTab === 'timeline' && renderTrackingTimeline()}
                  {activeTab === 'support' && renderSupportTab()}
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'Order Not Found' : 'Enter Tracking Number'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? 'Please check your tracking number and try again.' 
                    : 'Enter your order, rental, or booking number to track your items.'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-ocean-600 hover:text-ocean-700 font-medium"
                  >
                    Try Another Number
                  </button>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Contact Support</span>
                </button>
                <Link
                  to="/equipment"
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Shop More Equipment</span>
                </Link>
                {user && (
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Eye className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">View All Orders</span>
                  </Link>
                )}
              </div>
            </Card>

            {/* User Orders */}
            {user && renderUserOrders()}

            {/* Help & Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>+60 3-2345-6789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>support@stg.com.my</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Mon-Fri 9AM-6PM</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Support Modal */}
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Contact Support"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Need help with your order? Our support team is here to assist you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Phone className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-blue-900">Call Us</div>
                  <div className="text-sm text-blue-700">+60 3-2345-6789</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-900">Live Chat</div>
                  <div className="text-sm text-green-700">Available 24/7</div>
                </div>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}