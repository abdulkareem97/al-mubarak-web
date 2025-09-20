import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Home, 
  Menu, 
  X, 
  Bell, 
  Search,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Briefcase,
  User
} from 'lucide-react';

// Dashboard component with role-based modules
const Dashboard = () => {
  const [activeRole, setActiveRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role configurations
  const roleConfigs = {
    admin: {
      name: 'Admin Panel',
      icon: Shield,
      color: 'bg-red-500',
      tabs: [
        { id: 'overview', name: 'Overview', icon: Home },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'analytics', name: 'Analytics', icon: BarChart3 },
        { id: 'settings', name: 'System Settings', icon: Settings },
        { id: 'reports', name: 'Reports', icon: FileText }
      ]
    },
    staff: {
      name: 'Staff Portal',
      icon: Briefcase,
      color: 'bg-blue-500',
      tabs: [
        { id: 'overview', name: 'Dashboard', icon: Home },
        { id: 'tasks', name: 'Tasks', icon: UserCheck },
        { id: 'schedule', name: 'Schedule', icon: Calendar },
        { id: 'clients', name: 'Clients', icon: Users },
        { id: 'reports', name: 'Reports', icon: FileText }
      ]
    },
    client: {
      name: 'Client Portal',
      icon: User,
      color: 'bg-green-500',
      tabs: [
        { id: 'overview', name: 'Dashboard', icon: Home },
        { id: 'services', name: 'Services', icon: Briefcase },
        { id: 'billing', name: 'Billing', icon: DollarSign },
        { id: 'support', name: 'Support', icon: Bell },
        { id: 'profile', name: 'Profile', icon: User }
      ]
    }
  };

  const currentConfig = roleConfigs[activeRole];

  // Sample data for different roles
  const getDashboardContent = () => {
    switch (activeRole) {
      case 'admin':
        return getAdminContent();
      case 'staff':
        return getStaffContent();
      case 'client':
        return getClientContent();
      default:
        return <div>Select a role</div>;
    }
  };

  const getAdminContent = () => {
    const stats = [
      { title: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'text-blue-600' },
      { title: 'Active Staff', value: '89', change: '+3%', icon: UserCheck, color: 'text-green-600' },
      { title: 'Revenue', value: '$45,231', change: '+18%', icon: DollarSign, color: 'text-purple-600' },
      { title: 'Growth', value: '23%', change: '+5%', icon: TrendingUp, color: 'text-orange-600' }
    ];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  'New user registration: john.doe@email.com',
                  'Staff member updated profile',
                  'System backup completed',
                  'Security scan passed'
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">User Management</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'John Doe', email: 'john@example.com', role: 'Client', status: 'Active' },
                      { name: 'Jane Smith', email: 'jane@example.com', role: 'Staff', status: 'Active' },
                      { name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive' }
                    ].map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{currentConfig.tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Content for {activeTab} tab will be implemented here.</p>
          </div>
        );
    }
  };

  const getStaffContent = () => {
    const tasks = [
      { title: 'Review client proposals', priority: 'High', due: '2024-09-05' },
      { title: 'Update project timeline', priority: 'Medium', due: '2024-09-06' },
      { title: 'Client meeting preparation', priority: 'Low', due: '2024-09-07' }
    ];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900">Today's Tasks</h4>
                <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900">Active Clients</h4>
                <p className="text-3xl font-bold text-green-600 mt-2">24</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900">This Month</h4>
                <p className="text-3xl font-bold text-purple-600 mt-2">156</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">Due: {task.due}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{currentConfig.tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Content for {activeTab} tab will be implemented here.</p>
          </div>
        );
    }
  };

  const getClientContent = () => {
    const services = [
      { name: 'Premium Plan', status: 'Active', nextBilling: '2024-10-01' },
      { name: 'Additional Storage', status: 'Active', nextBilling: '2024-09-15' }
    ];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900">Account Status</h4>
                <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
                <p className="text-sm text-gray-600">Since January 2024</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900">Monthly Usage</h4>
                <p className="text-2xl font-bold text-blue-600 mt-2">78%</p>
                <p className="text-sm text-gray-600">of allocated resources</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Active Services</h3>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">Next billing: {service.nextBilling}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{currentConfig.tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Content for {activeTab} tab will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${currentConfig.color} rounded-lg flex items-center justify-center`}>
                <currentConfig.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div className="p-4 border-b">
          <label className="text-sm font-medium text-gray-700 block mb-2">Role</label>
          <select 
            value={activeRole} 
            onChange={(e) => {
              setActiveRole(e.target.value);
              setActiveTab('overview');
            }}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="client">Client</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {currentConfig.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeTab === tab.id 
                    ? `${currentConfig.color} text-white` 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page Title */}
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentConfig.name} - {currentConfig.tabs.find(tab => tab.id === activeTab)?.name}
                </h1>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Search - Hidden on mobile */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative text-gray-400 hover:text-gray-600">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {activeRole === 'admin' ? 'Admin User' : activeRole === 'staff' ? 'Staff User' : 'Client User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {getDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;