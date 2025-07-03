import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Calendar, Users, Clock, CheckCircle, 
  AlertTriangle, TrendingUp, BarChart3, FileText, Settings,
  Search, Filter, Eye, Edit, Truck, Phone, Mail, MapPin,
  Activity, Zap, Target, Award, Bell, RefreshCw, Download,
  Clipboard, Wrench, Shield, Database, Gauge, Thermometer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Tabs } from '../components/UI/Tabs';
import { ProgressBar } from '../components/UI/ProgressBar';
import { AnimatedCounter } from '../components/UI/AnimatedCounter';

export function StaffDashboard() {
  const { user, isRole, isDepartment } = useAuth();
  const [activeShift, setActiveShift] = useState(true);
  const [todayTasks, setTodayTasks] = useState(12);
  const [completedTasks, setCompletedTasks] = useState(8);
  const [urgentTasks, setUrgentTasks] = useState(3);

  // Access control
  if (!user || (!isRole('staff') && !isRole('manager'))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Staff credentials required to access this dashboard.</p>
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

  const departmentData = {
    warehouse: {
      name: 'Warehouse Operations',
      icon: Package,
      color: 'from-emerald-600 to-emerald-700',
      metrics: {
        inventory: 2847,
        lowStock: 23,
        outgoing: 45,
        incoming: 12,
        maintenance: 8
      },
      tasks: [
        { id: 1, title: 'Process incoming shipment - Scubapro gear', priority: 'high', due: '2 hours' },
        { id: 2, title: 'Equipment maintenance check - Regulators', priority: 'medium', due: '4 hours' },
        { id: 3, title: 'Stock count - Masks section', priority: 'low', due: 'Tomorrow' },
        { id: 4, title: 'Prepare rental equipment for pickup', priority: 'high', due: '1 hour' }
      ]
    },
    billing: {
      name: 'Billing & Finance',
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      metrics: {
        invoices: 156,
        pending: 23,
        overdue: 5,
        processed: 128,
        revenue: 45780
      },
      tasks: [
        { id: 1, title: 'Process partner commission payments', priority: 'high', due: '3 hours' },
        { id: 2, title: 'Review overdue accounts', priority: 'medium', due: '6 hours' },
        { id: 3, title: 'Generate monthly financial report', priority: 'low', due: 'End of day' },
        { id: 4, title: 'Reconcile payment gateway transactions', priority: 'medium', due: '4 hours' }
      ]
    },
    partnerships: {
      name: 'Partner Relations',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      metrics: {
        partners: 15,
        active: 12,
        meetings: 8,
        contracts: 3,
        satisfaction: 94.2
      },
      tasks: [
        { id: 1, title: 'Partner onboarding - Langkawi Dive Center', priority: 'high', due: '2 hours' },
        { id: 2, title: 'Review Sipadan partnership agreement', priority: 'medium', due: 'Tomorrow' },
        { id: 3, title: 'Prepare quarterly partner report', priority: 'low', due: 'This week' },
        { id: 4, title: 'Schedule partner training session', priority: 'medium', due: '5 hours' }
      ]
    },
    management: {
      name: 'Operations Management',
      icon: BarChart3,
      color: 'from-indigo-600 to-indigo-700',
      metrics: {
        staff: 24,
        departments: 4,
        projects: 8,
        efficiency: 92.5,
        satisfaction: 89.3
      },
      tasks: [
        { id: 1, title: 'Review department performance metrics', priority: 'high', due: '1 hour' },
        { id: 2, title: 'Staff performance evaluations', priority: 'medium', due: 'This week' },
        { id: 3, title: 'Budget planning for Q2', priority: 'high', due: 'Tomorrow' },
        { id: 4, title: 'Approve equipment procurement requests', priority: 'medium', due: '3 hours' }
      ]
    }
  };

  const currentDept = departmentData[user.department as keyof typeof departmentData] || departmentData.warehouse;

  const renderDepartmentOverview = () => (
    <div className="space-y-6">
      {/* Department Header */}
      <Card className={`bg-gradient-to-r ${currentDept.color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <currentDept.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentDept.name}</h2>
              <p className="text-white/80">Welcome back, {user.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${activeShift ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-sm">{activeShift ? 'On Shift' : 'Off Shift'}</span>
            </div>
            <div className="text-sm text-white/80">
              Shift: 8:00 AM - 5:00 PM
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(currentDept.metrics).map(([key, value], index) => (
          <Card key={index}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' && value > 1000 ? (
                  <AnimatedCounter end={value} />
                ) : (
                  value
                )}
                {key === 'satisfaction' || key === 'efficiency' ? '%' : ''}
              </div>
              <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="info" size="sm">{completedTasks}/{todayTasks} completed</Badge>
              {urgentTasks > 0 && (
                <Badge variant="error" size="sm">{urgentTasks} urgent</Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {currentDept.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-600">Due: {task.due}</div>
                  </div>
                </div>
                <Badge 
                  variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'} 
                  size="sm"
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <ProgressBar 
              progress={(completedTasks / todayTasks) * 100} 
              color="ocean" 
              showLabel 
              label="Daily Progress"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {isDepartment('warehouse') && [
              { icon: Package, label: 'Check Inventory', color: 'bg-emerald-100 text-emerald-700' },
              { icon: Truck, label: 'Process Shipment', color: 'bg-blue-100 text-blue-700' },
              { icon: Wrench, label: 'Equipment Maintenance', color: 'bg-orange-100 text-orange-700' },
              { icon: Clipboard, label: 'Stock Report', color: 'bg-purple-100 text-purple-700' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg ${action.color} hover:scale-105 transition-all duration-300 text-center`}
              >
                <action.icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}

            {isDepartment('billing') && [
              { icon: FileText, label: 'Generate Invoice', color: 'bg-blue-100 text-blue-700' },
              { icon: CheckCircle, label: 'Process Payment', color: 'bg-green-100 text-green-700' },
              { icon: AlertTriangle, label: 'Review Overdue', color: 'bg-red-100 text-red-700' },
              { icon: BarChart3, label: 'Financial Report', color: 'bg-purple-100 text-purple-700' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg ${action.color} hover:scale-105 transition-all duration-300 text-center`}
              >
                <action.icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}

            {isDepartment('partnerships') && [
              { icon: Users, label: 'Partner Meeting', color: 'bg-purple-100 text-purple-700' },
              { icon: Phone, label: 'Contact Partner', color: 'bg-blue-100 text-blue-700' },
              { icon: FileText, label: 'Review Contract', color: 'bg-green-100 text-green-700' },
              { icon: Award, label: 'Performance Review', color: 'bg-orange-100 text-orange-700' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg ${action.color} hover:scale-105 transition-all duration-300 text-center`}
              >
                <action.icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}

            {isDepartment('management') && [
              { icon: BarChart3, label: 'View Analytics', color: 'bg-indigo-100 text-indigo-700' },
              { icon: Users, label: 'Staff Management', color: 'bg-purple-100 text-purple-700' },
              { icon: Target, label: 'Set Goals', color: 'bg-green-100 text-green-700' },
              { icon: Settings, label: 'System Config', color: 'bg-gray-100 text-gray-700' }
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg ${action.color} hover:scale-105 transition-all duration-300 text-center`}
              >
                <action.icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-ocean-600 hover:text-ocean-700 text-sm">View All</button>
          </div>
          
          <div className="space-y-3">
            {[
              { action: 'Processed equipment rental return', time: '15 minutes ago', type: 'success' },
              { action: 'Updated inventory count for masks', time: '1 hour ago', type: 'info' },
              { action: 'Completed safety inspection checklist', time: '2 hours ago', type: 'success' },
              { action: 'Flagged low stock alert for regulators', time: '3 hours ago', type: 'warning' },
              { action: 'Approved partner payment request', time: '4 hours ago', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-600">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <Badge variant="error" size="sm">3 urgent</Badge>
          </div>
          
          <div className="space-y-3">
            {[
              { 
                title: 'Equipment maintenance due', 
                message: '5 regulators require scheduled maintenance', 
                priority: 'high',
                time: '30 min ago'
              },
              { 
                title: 'Low stock alert', 
                message: 'Wetsuit inventory below minimum threshold', 
                priority: 'medium',
                time: '1 hour ago'
              },
              { 
                title: 'Partner payment processed', 
                message: 'Borneo Divers commission payment completed', 
                priority: 'low',
                time: '2 hours ago'
              },
              { 
                title: 'System backup completed', 
                message: 'Daily backup process finished successfully', 
                priority: 'low',
                time: '3 hours ago'
              }
            ].map((notification, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="font-medium text-gray-900">{notification.title}</div>
                      <Badge 
                        variant={notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'info'} 
                        size="sm"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">
              {currentDept.name} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {renderDepartmentOverview()}
      </div>
    </div>
  );
}