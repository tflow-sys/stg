import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, Settings, AlertTriangle, CheckCircle, Clock, DollarSign, Eye, Edit, Trash2, Plus, Download, Upload, Filter, Search, RefreshCw, Bell, Activity, MapPin, Calendar, Anchor, Waves, Shield, Award, Building2, FileText, PieChart, Target, Zap, Globe, Phone, Mail, Camera, Truck, CreditCard, UserCheck, AlertCircle, ChevronRight, Database, Server, Wifi, HardDrive, Cpu, Monitor, Network, BookOpen, GraduationCap, AlignCenterVertical as Certificate, Briefcase, Star, Ship, Compass, Fish, Thermometer, Wind, Gauge } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Tabs } from '../components/UI/Tabs';
import { ProgressBar } from '../components/UI/ProgressBar';
import { AnimatedCounter } from '../components/UI/AnimatedCounter';
import { Modal } from '../components/UI/Modal';

export default function Admin() {
  const { user, isRole } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [notifications, setNotifications] = useState(12);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 247,
    ongoingDives: 15,
    equipmentInUse: 89,
    revenue: 15420.50
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        ongoingDives: Math.max(0, prev.ongoingDives + Math.floor(Math.random() * 3) - 1),
        equipmentInUse: Math.max(0, prev.equipmentInUse + Math.floor(Math.random() * 4) - 2),
        revenue: prev.revenue + (Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Access control
  if (!user || !isRole('admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="text-center max-w-md bg-white/10 backdrop-blur-xl border-white/20">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
          <p className="text-slate-300 mb-6">Administrative privileges required to access this system.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
          >
            Return to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  // Business Intelligence Data
  const businessMetrics = {
    revenue: {
      total: 2847500,
      growth: 18.5,
      target: 3000000,
      monthly: 285000,
      daily: 9500
    },
    operations: {
      totalDives: 1247,
      activeCertifications: 89,
      equipmentUtilization: 87.3,
      partnerSatisfaction: 94.2
    },
    customers: {
      total: 5847,
      active: 3421,
      newThisMonth: 247,
      retention: 89.5,
      avgLifetimeValue: 1850
    },
    inventory: {
      totalItems: 2847,
      lowStock: 23,
      outOfStock: 5,
      turnoverRate: 4.2
    }
  };

  const departmentPerformance = [
    { 
      name: 'Equipment Sales', 
      manager: 'Sarah Chen', 
      performance: 94, 
      revenue: 1247500, 
      trend: 'up',
      kpis: { orders: 847, satisfaction: 96.2, returns: 2.1 }
    },
    { 
      name: 'Dive Operations', 
      manager: 'Captain James', 
      performance: 91, 
      revenue: 847200, 
      trend: 'up',
      kpis: { dives: 247, safety: 99.8, certification: 89 }
    },
    { 
      name: 'Equipment Rentals', 
      manager: 'Ahmad Rahman', 
      performance: 88, 
      revenue: 425800, 
      trend: 'stable',
      kpis: { utilization: 87, maintenance: 95, availability: 92 }
    },
    { 
      name: 'Training & Certification', 
      manager: 'Dr. Emily Wong', 
      performance: 96, 
      revenue: 327000, 
      trend: 'up',
      kpis: { students: 156, passRate: 94.5, instructors: 12 }
    }
  ];

  const partnerNetwork = [
    {
      name: 'Borneo Divers',
      location: 'Sipadan, Sabah',
      type: 'Premium Partner',
      status: 'active',
      revenue: 485000,
      satisfaction: 98.5,
      bookings: 247,
      specialties: ['Technical Diving', 'Marine Biology', 'Underwater Photography']
    },
    {
      name: 'Tioman Dive Centre',
      location: 'Pulau Tioman, Pahang',
      type: 'Gold Partner',
      status: 'active',
      revenue: 325000,
      satisfaction: 94.2,
      bookings: 189,
      specialties: ['Recreational Diving', 'PADI Courses', 'Night Diving']
    },
    {
      name: 'Redang Marine Park',
      location: 'Pulau Redang, Terengganu',
      type: 'Eco Partner',
      status: 'active',
      revenue: 275000,
      satisfaction: 96.8,
      bookings: 156,
      specialties: ['Conservation', 'Research Diving', 'Marine Education']
    }
  ];

  const systemModules = [
    {
      id: 'overview',
      name: 'Business Overview',
      icon: BarChart3,
      description: 'Executive dashboard and KPIs',
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'operations',
      name: 'Dive Operations',
      icon: Anchor,
      description: 'Dive scheduling and safety management',
      color: 'from-ocean-600 to-ocean-700'
    },
    {
      id: 'inventory',
      name: 'Equipment Management',
      icon: Package,
      description: 'Inventory, procurement, and maintenance',
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      id: 'customers',
      name: 'Customer Relations',
      icon: Users,
      description: 'CRM, memberships, and support',
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'partners',
      name: 'Partner Network',
      icon: Building2,
      description: 'Dive center partnerships and collaboration',
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 'training',
      name: 'Training & Certification',
      icon: GraduationCap,
      description: 'Course management and instructor oversight',
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      id: 'finance',
      name: 'Financial Management',
      icon: DollarSign,
      description: 'Revenue, expenses, and financial reporting',
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'analytics',
      name: 'Business Intelligence',
      icon: TrendingUp,
      description: 'Advanced analytics and forecasting',
      color: 'from-rose-600 to-rose-700'
    },
    {
      id: 'system',
      name: 'System Administration',
      icon: Settings,
      description: 'User management and system configuration',
      color: 'from-slate-600 to-slate-700'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900">
                RM <AnimatedCounter end={businessMetrics.revenue.total} />
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{businessMetrics.revenue.growth}% YoY
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar 
              progress={(businessMetrics.revenue.total / businessMetrics.revenue.target) * 100} 
              color="blue" 
              showLabel 
              label="Annual Target Progress"
            />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ocean-700">Active Customers</p>
              <p className="text-3xl font-bold text-ocean-900">
                <AnimatedCounter end={businessMetrics.customers.active} />
              </p>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 text-ocean-600 mr-1" />
                <span className="text-sm text-ocean-600 font-medium">
                  {businessMetrics.customers.retention}% retention
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-ocean-600 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 text-xs text-ocean-600">
            +{businessMetrics.customers.newThisMonth} new this month
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Equipment Utilization</p>
              <p className="text-3xl font-bold text-emerald-900">
                <AnimatedCounter end={businessMetrics.operations.equipmentUtilization} suffix="%" />
              </p>
              <div className="flex items-center mt-2">
                <Package className="h-4 w-4 text-emerald-600 mr-1" />
                <span className="text-sm text-emerald-600 font-medium">
                  {businessMetrics.inventory.totalItems} items
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 text-xs text-emerald-600">
            {businessMetrics.inventory.lowStock} items need restocking
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Partner Satisfaction</p>
              <p className="text-3xl font-bold text-purple-900">
                <AnimatedCounter end={businessMetrics.operations.partnerSatisfaction} suffix="%" />
              </p>
              <div className="flex items-center mt-2">
                <Building2 className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600 font-medium">
                  {partnerNetwork.length} active partners
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 text-xs text-purple-600">
            All partners meeting SLA requirements
          </div>
        </Card>
      </div>

      {/* Real-time Operations Monitor */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold">Live Operations Center</h3>
          </div>
          <div className="text-sm text-slate-300">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              <AnimatedCounter end={realTimeData.activeUsers} />
            </div>
            <div className="text-sm text-slate-300">Active Users Online</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-ocean-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Anchor className="h-8 w-8 text-ocean-400" />
            </div>
            <div className="text-2xl font-bold text-ocean-400">
              <AnimatedCounter end={realTimeData.ongoingDives} />
            </div>
            <div className="text-sm text-slate-300">Ongoing Dives</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              <AnimatedCounter end={realTimeData.equipmentInUse} />
            </div>
            <div className="text-sm text-slate-300">Equipment in Use</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              RM <AnimatedCounter end={realTimeData.revenue} />
            </div>
            <div className="text-sm text-slate-300">Today's Revenue</div>
          </div>
        </div>
      </Card>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Department Performance</h3>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          
          <div className="space-y-6">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-600">Manager: {dept.manager}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      RM {dept.revenue.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        dept.trend === 'up' ? 'text-green-600' : 
                        dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <span className="text-sm text-gray-600">{dept.performance}% efficiency</span>
                    </div>
                  </div>
                </div>
                
                <ProgressBar progress={dept.performance} color="ocean" className="mb-3" />
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {Object.entries(dept.kpis).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-medium text-gray-900">{value}</div>
                      <div className="text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Partner Network Status</h3>
            <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
              View All Partners
            </button>
          </div>
          
          <div className="space-y-4">
            {partnerNetwork.map((partner, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {partner.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" size="sm">{partner.type}</Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      {partner.satisfaction}% satisfaction
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium ml-2">RM {partner.revenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bookings:</span>
                    <span className="font-medium ml-2">{partner.bookings}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {partner.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="info" size="sm">{specialty}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <button 
            onClick={() => setShowQuickAction(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: Plus, label: 'Add Equipment', action: 'equipment' },
            { icon: Users, label: 'New Customer', action: 'customer' },
            { icon: Calendar, label: 'Schedule Dive', action: 'dive' },
            { icon: FileText, label: 'Generate Report', action: 'report' },
            { icon: Building2, label: 'Partner Meeting', action: 'partner' },
            { icon: AlertTriangle, label: 'Safety Alert', action: 'safety' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <action.icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSystemHealth = () => (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health Monitor</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { name: 'Database', status: 99.9, icon: Database, color: 'green' },
          { name: 'API Server', status: 98.5, icon: Server, color: 'green' },
          { name: 'Network', status: 97.8, icon: Wifi, color: 'yellow' },
          { name: 'Storage', status: 95.2, icon: HardDrive, color: 'yellow' },
          { name: 'Processing', status: 99.1, icon: Cpu, color: 'green' },
          { name: 'Monitoring', status: 100, icon: Monitor, color: 'green' }
        ].map((system, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 bg-${system.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <system.icon className={`h-6 w-6 text-${system.color}-600`} />
            </div>
            <div className="text-sm font-medium text-gray-900">{system.name}</div>
            <div className={`text-xs text-${system.color}-600`}>{system.status}%</div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-ocean-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-ocean-600 to-ocean-700 rounded-xl flex items-center justify-center">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">STG Business Management</h1>
                <p className="text-sm text-gray-600">Enterprise Administration Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Health: {systemHealth}%</span>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-600">System Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Monitor */}
        {renderSystemHealth()}

        {/* Module Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systemModules.map((module) => (
            <Card
              key={module.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                activeModule === module.id ? 'ring-2 ring-ocean-500 shadow-lg' : ''
              }`}
              onClick={() => setActiveModule(module.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center`}>
                  <module.icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {activeModule === 'overview' && renderOverview()}
          
          {activeModule !== 'overview' && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {React.createElement(
                  systemModules.find(m => m.id === activeModule)?.icon || Settings,
                  { className: "h-10 w-10 text-gray-400" }
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {systemModules.find(m => m.id === activeModule)?.name}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {systemModules.find(m => m.id === activeModule)?.description}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-blue-900">Module Under Development</span>
                </div>
                <p className="text-sm text-blue-700">
                  This advanced module is being developed with enterprise-grade features 
                  including real-time analytics, automated workflows, and comprehensive reporting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Modal */}
      <Modal
        isOpen={showQuickAction}
        onClose={() => setShowQuickAction(false)}
        title="Quick Actions Center"
        size="lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Package, label: 'Add Equipment', desc: 'Register new diving equipment' },
            { icon: Users, label: 'New Customer', desc: 'Create customer account' },
            { icon: Calendar, label: 'Schedule Dive', desc: 'Plan diving expedition' },
            { icon: FileText, label: 'Generate Report', desc: 'Create business report' },
            { icon: Building2, label: 'Partner Meeting', desc: 'Schedule partner call' },
            { icon: AlertTriangle, label: 'Safety Alert', desc: 'Issue safety notification' },
            { icon: CreditCard, label: 'Process Payment', desc: 'Handle transactions' },
            { icon: Truck, label: 'Track Shipment', desc: 'Monitor deliveries' },
            { icon: Certificate, label: 'Issue Certificate', desc: 'Generate diving certification' }
          ].map((action, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-ocean-300 hover:bg-ocean-50 transition-all duration-300 text-left"
            >
              <action.icon className="h-8 w-8 text-ocean-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">{action.label}</h4>
              <p className="text-sm text-gray-600">{action.desc}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}