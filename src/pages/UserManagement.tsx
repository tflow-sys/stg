import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Edit, Trash2, Eye, Shield, Award, 
  Star, Crown, Gift, Mail, Phone, MapPin, Calendar, Activity,
  Download, Upload, Settings, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { Tabs } from '../components/UI/Tabs';
import { ProgressBar } from '../components/UI/ProgressBar';

export function UserManagement() {
  const { user, isRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Access control
  if (!user || !isRole('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to manage users.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-ocean-600 text-white px-6 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
          >
            Go Back
          </button>
        </Card>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: mockUsers.length,
    customers: mockUsers.filter(u => u.role === 'customer').length,
    staff: mockUsers.filter(u => u.role === 'staff').length,
    managers: mockUsers.filter(u => u.role === 'manager').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    partners: mockUsers.filter(u => u.role === 'dive_center_partner').length
  };

  const getMembershipIcon = (tier: string) => {
    switch (tier) {
      case 'sea-monsters': return Crown;
      case 'dive-buddies': return Award;
      case 'water-babies': return Star;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'manager': return 'purple';
      case 'staff': return 'blue';
      case 'dive_center_partner': return 'green';
      case 'customer': return 'gray';
      default: return 'gray';
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const renderUserOverview = () => (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.customers}</div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{userStats.staff}</div>
            <div className="text-sm text-gray-600">Staff</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{userStats.managers}</div>
            <div className="text-sm text-gray-600">Managers</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Crown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-900">{userStats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{userStats.partners}</div>
            <div className="text-sm text-gray-600">Partners</div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="staff">Staff</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
              <option value="dive_center_partner">Partners</option>
            </select>
          </div>
          <div className="flex space-x-3">
            {selectedUsers.length > 0 && (
              <button
                onClick={() => setShowBulkActions(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Bulk Actions ({selectedUsers.length})</span>
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(userItem => {
                const MembershipIcon = getMembershipIcon(userItem.membershipTier || '');
                return (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userItem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, userItem.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== userItem.id));
                          }
                        }}
                        className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-ocean-600 to-ocean-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {userItem.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {userItem.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {userItem.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={getRoleColor(userItem.role) as any} 
                        size="sm"
                      >
                        {userItem.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userItem.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userItem.membershipTier && userItem.role === 'customer' ? (
                        <div className="flex items-center space-x-2">
                          <MembershipIcon className="h-4 w-4 text-ocean-600" />
                          <span className="text-sm font-medium">
                            {userItem.membershipTier.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success" size="sm">Active</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(Math.random() * 30) + 1} days ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedUser(userItem)}
                          className="text-ocean-600 hover:text-ocean-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderPermissions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Role & Permission Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">User Roles</h3>
          <div className="space-y-4">
            {[
              { role: 'admin', label: 'Administrator', description: 'Full system access', users: userStats.admins, color: 'red' },
              { role: 'manager', label: 'Manager', description: 'Department oversight', users: userStats.managers, color: 'purple' },
              { role: 'staff', label: 'Staff', description: 'Operational tasks', users: userStats.staff, color: 'blue' },
              { role: 'dive_center_partner', label: 'Dive Center Partner', description: 'Package management', users: userStats.partners, color: 'green' },
              { role: 'customer', label: 'Customer', description: 'Shopping and bookings', users: userStats.customers, color: 'gray' }
            ].map((roleItem, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${roleItem.color}-100 rounded-lg flex items-center justify-center`}>
                    <Shield className={`h-5 w-5 text-${roleItem.color}-600`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{roleItem.label}</div>
                    <div className="text-sm text-gray-500">{roleItem.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{roleItem.users}</div>
                  <div className="text-sm text-gray-500">users</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Permissions */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Permission Matrix</h3>
          <div className="space-y-3">
            {[
              'User Management',
              'Product Management', 
              'Order Processing',
              'Inventory Control',
              'Financial Reports',
              'System Settings'
            ].map((permission, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{permission}</span>
                <div className="flex space-x-2">
                  {['admin', 'manager', 'staff'].map((role) => (
                    <div
                      key={role}
                      className={`w-3 h-3 rounded-full ${
                        (role === 'admin') ? 'bg-green-500' :
                        (role === 'manager' && index < 4) ? 'bg-green-500' :
                        (role === 'staff' && index < 2) ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={`${role}: ${
                        (role === 'admin') ? 'Full Access' :
                        (role === 'manager' && index < 4) ? 'Access' :
                        (role === 'staff' && index < 2) ? 'Access' : 'No Access'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>New Users (This Month)</span>
                <span>+15%</span>
              </div>
              <ProgressBar progress={75} color="ocean" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Users</span>
                <span>85%</span>
              </div>
              <ProgressBar progress={85} color="green" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Customer Retention</span>
                <span>92%</span>
              </div>
              <ProgressBar progress={92} color="purple" />
            </div>
          </div>
        </Card>

        {/* Membership Distribution */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Membership Tiers</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Sea Monsters</span>
              </div>
              <Badge variant="ocean">15%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Dive Buddies</span>
              </div>
              <Badge variant="coral">35%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Water Babies</span>
              </div>
              <Badge variant="success">50%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'User Overview', icon: Users, content: renderUserOverview() },
    { id: 'permissions', label: 'Roles & Permissions', icon: Shield, content: renderPermissions() },
    { id: 'analytics', label: 'User Analytics', icon: Activity, content: renderAnalytics() }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage users, roles, and permissions</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="overview" />

        {/* User Detail Modal */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Details"
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-ocean-600 to-ocean-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <Badge variant={getRoleColor(selectedUser.role) as any} size="sm">
                    {selectedUser.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-gray-900">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="text-gray-900">RM {selectedUser.totalSpent?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {selectedUser.role === 'customer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Membership Progress</label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Tier: {selectedUser.membershipTier?.replace('-', ' ').toUpperCase()}</span>
                      <span>{selectedUser.points} points</span>
                    </div>
                    <ProgressBar 
                      progress={Math.min((selectedUser.totalSpent / 2000) * 100, 100)} 
                      color="ocean" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <p className="text-gray-900">{selectedUser.address}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
                  Edit User
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add User Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New User"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
                  <option>Select role</option>
                  <option>Customer</option>
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Admin</option>
                  <option>Dive Center Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
                  <option>Select department</option>
                  <option>Management</option>
                  <option>Warehouse</option>
                  <option>Billing</option>
                  <option>Partnerships</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Enter address"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
                Add User
              </button>
            </div>
          </div>
        </Modal>

        {/* Bulk Actions Modal */}
        <Modal
          isOpen={showBulkActions}
          onClose={() => setShowBulkActions(false)}
          title="Bulk Actions"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Perform actions on {selectedUsers.length} selected users:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Activate Users</span>
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Deactivate Users</span>
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="h-5 w-5 text-blue-600" />
                <span>Export User Data</span>
              </button>
              <button
                onClick={() => handleBulkAction('email')}
                className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Mail className="h-5 w-5 text-purple-600" />
                <span>Send Email</span>
              </button>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowBulkActions(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}