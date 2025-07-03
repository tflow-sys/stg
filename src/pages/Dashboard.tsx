import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Package, Calendar, Award, MapPin, Phone, Mail, Edit3, Star, Clock, 
  CheckCircle, Truck, Eye, Download, ExternalLink, Copy, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { useToast } from '../hooks/useToast';

export function Dashboard() {
  const { user, updateUser } = useAuth();
  const { orders, rentals, bookings } = useOrder();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h2>
          <Link to="/auth" className="bg-ocean-600 text-white px-6 py-3 rounded-lg hover:bg-ocean-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditing(false);
    showToast('success', 'Profile updated successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'sea-monsters': return 'from-purple-500 to-pink-500';
      case 'dive-buddies': return 'from-blue-500 to-cyan-500';
      case 'water-babies': return 'from-green-400 to-blue-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getNextTierInfo = () => {
    switch (user.membershipTier) {
      case 'water-babies':
        return { next: 'Dive Buddies', required: 2000, current: user.totalSpent };
      case 'dive-buddies':
        return { next: 'Sea Monsters', required: 10000, current: user.totalSpent };
      case 'sea-monsters':
        return { next: 'Max Level', required: user.totalSpent, current: user.totalSpent };
      default:
        return { next: 'Water Babies', required: 500, current: user.totalSpent };
    }
  };

  const nextTier = getNextTierInfo();
  const progress = Math.min((nextTier.current / nextTier.required) * 100, 100);

  const userOrders = orders.filter(order => order.userId === user.id);
  const userRentals = rentals.filter(rental => rental.userId === user.id);
  const userBookings = bookings.filter(booking => booking.userId === user.id);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'info',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'error',
      'active': 'success',
      'returned': 'success',
      'overdue': 'error',
      'completed': 'success'
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getMembershipColor(user.membershipTier)} mt-2`}>
                  <Star className="h-4 w-4 mr-1" />
                  {user.membershipTier.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ocean-600">{user.points} Points</div>
              <div className="text-sm text-gray-600">Total Spent: RM {user.totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'rentals', label: 'Rentals', icon: Calendar },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'profile', label: 'Profile', icon: Edit3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-ocean-600 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Membership Progress */}
                <div className="bg-gradient-to-r from-ocean-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Membership Progress</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress to {nextTier.next}</span>
                    <span className="text-sm text-gray-600">
                      RM {nextTier.current.toFixed(2)} / RM {nextTier.required.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-ocean-600 to-ocean-700 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  {user.membershipTier !== 'sea-monsters' && (
                    <p className="text-sm text-gray-600 mt-2">
                      Spend RM {(nextTier.required - nextTier.current).toFixed(2)} more to reach {nextTier.next}!
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userOrders.length}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Calendar className="h-8 w-8 text-coral-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userRentals.length}</div>
                    <div className="text-sm text-gray-600">Rentals</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userBookings.length}</div>
                    <div className="text-sm text-gray-600">Bookings</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{user.points}</div>
                    <div className="text-sm text-gray-600">Reward Points</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[...userOrders, ...userRentals, ...userBookings]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((item) => {
                        const isOrder = 'orderNumber' in item;
                        const isRental = 'rentalNumber' in item;
                        const number = isOrder ? item.orderNumber : isRental ? item.rentalNumber : item.bookingNumber;
                        const type = isOrder ? 'Order' : isRental ? 'Rental' : 'Booking';
                        
                        return (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">{type} {number}</div>
                                <div className="text-sm text-gray-600">
                                  {item.createdAt.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {isOrder && (
                                <div className="font-medium">RM {item.total.toFixed(2)}</div>
                              )}
                              {isRental && (
                                <div className="font-medium">RM {item.totalCost.toFixed(2)}</div>
                              )}
                              {!isOrder && !isRental && (
                                <div className="font-medium">RM {item.totalCost.toFixed(2)}</div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Badge variant={getStatusColor(item.status) as any} size="sm">
                                  {item.status}
                                </Badge>
                                <button
                                  onClick={() => navigate(`/track/${number}`)}
                                  className="text-ocean-600 hover:text-ocean-700 text-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Order History</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">Order {order.orderNumber}</h4>
                            <button
                              onClick={() => copyToClipboard(order.orderNumber)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            Placed on {order.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">RM {order.total.toFixed(2)}</div>
                          <Badge variant={getStatusColor(order.status) as any} size="sm">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {order.items.length} items • Payment: {order.paymentMethod.replace('_', ' ')}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => navigate(`/track/${order.orderNumber}`)}
                            className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Track Order</span>
                          </button>
                          {order.status === 'delivered' && (
                            <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                              <Download className="h-4 w-4" />
                              <span>Download Invoice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {userOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                      <Link
                        to="/equipment"
                        className="bg-ocean-600 text-white px-6 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rentals Tab */}
            {activeTab === 'rentals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Equipment Rentals</h3>
                  <Link
                    to="/equipment?type=rental"
                    className="bg-coral-600 text-white px-4 py-2 rounded-lg hover:bg-coral-700 transition-colors"
                  >
                    Rent Equipment
                  </Link>
                </div>
                <div className="space-y-4">
                  {userRentals.map(rental => (
                    <div key={rental.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">Rental {rental.rentalNumber}</h4>
                            <button
                              onClick={() => copyToClipboard(rental.rentalNumber)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            {rental.startDate.toLocaleDateString()} - {rental.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">RM {rental.totalCost.toFixed(2)}</div>
                          <Badge variant={getStatusColor(rental.status) as any} size="sm">
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Duration: {rental.rentalDuration} days • Quantity: {rental.quantity}
                        </div>
                        <button
                          onClick={() => navigate(`/track/${rental.rentalNumber}`)}
                          className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Track Rental</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {userRentals.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals yet</h3>
                      <p className="text-gray-600 mb-4">Try our equipment before buying</p>
                      <Link
                        to="/equipment?type=rental"
                        className="bg-coral-600 text-white px-6 py-2 rounded-lg hover:bg-coral-700 transition-colors"
                      >
                        Browse Rentals
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Package Bookings</h3>
                  <Link
                    to="/packages"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Book Package
                  </Link>
                </div>
                <div className="space-y-4">
                  {userBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">Booking {booking.bookingNumber}</h4>
                            <button
                              onClick={() => copyToClipboard(booking.bookingNumber)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            Event Date: {booking.selectedDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">RM {booking.totalCost.toFixed(2)}</div>
                          <Badge variant={getStatusColor(booking.status) as any} size="sm">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Participants: {booking.participants}
                        </div>
                        <button
                          onClick={() => navigate(`/track/${booking.bookingNumber}`)}
                          className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Booking</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {userBookings.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-4">Book amazing dive packages</p>
                      <Link
                        to="/packages"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Browse Packages
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          value={editForm.address}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        className="bg-ocean-600 text-white px-6 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Full Name</div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Email</div>
                            <div className="font-medium">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Phone</div>
                            <div className="font-medium">{user.phone}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm text-gray-600">Address</div>
                            <div className="font-medium">{user.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Member Since</div>
                            <div className="font-medium">{user.createdAt.toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}