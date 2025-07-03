import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Waves, ShoppingCart, User, Menu, X, Search, Settings, BarChart3, 
  Package, Users as UsersIcon, Bell, Heart, ChevronDown, 
  Star, Award, Shield, Crown, Gift, Zap, Activity, Database, 
  AlertTriangle, ArrowRight, TrendingUp, Filter, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../UI/Badge';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, logout, isRole, isDepartment } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  // Handle scroll effect with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Real-time notifications simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setNotifications(prev => Math.min(prev + 1, 99));
      }
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const getMembershipBadge = (tier: string) => {
    switch (tier) {
      case 'sea-monsters':
        return { 
          color: 'from-purple-500 via-purple-600 to-pink-600', 
          icon: Crown, 
          label: 'Sea Monster',
          glow: 'shadow-purple-500/25'
        };
      case 'dive-buddies':
        return { 
          color: 'from-blue-500 via-blue-600 to-cyan-600', 
          icon: Award, 
          label: 'Dive Buddy',
          glow: 'shadow-blue-500/25'
        };
      case 'water-babies':
        return { 
          color: 'from-emerald-500 via-green-600 to-blue-600', 
          icon: Star, 
          label: 'Water Baby',
          glow: 'shadow-emerald-500/25'
        };
      default:
        return { 
          color: 'from-gray-400 to-gray-600', 
          icon: User, 
          label: 'Member',
          glow: ''
        };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { color: 'bg-red-50 text-red-700 border-red-200', label: 'Admin', icon: Shield };
      case 'manager':
        return { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Manager', icon: Star };
      case 'staff':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Staff', icon: User };
      case 'dive_center_partner':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Partner', icon: Award };
      default:
        return { color: 'bg-gray-50 text-gray-700 border-gray-200', label: 'Customer', icon: User };
    }
  };

  // Customer Navigation Items
  const customerNavigationItems = [
    { 
      label: 'Shop', 
      href: '/equipment', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Equipment', href: '/equipment', icon: Package },
        { label: 'Masks & Snorkels', href: '/equipment?category=masks', icon: '🥽' },
        { label: 'Fins & Boots', href: '/equipment?category=fins', icon: '🦶' },
        { label: 'Regulators', href: '/equipment?category=regulators', icon: '🔧' },
        { label: 'BCDs & Vests', href: '/equipment?category=bcds', icon: '🦺' },
        { label: 'Wetsuits', href: '/equipment?category=wetsuits', icon: '👕' },
        { label: 'Accessories', href: '/equipment?category=accessories', icon: '⚙️' }
      ]
    },
    { label: 'Rent Equipment', href: '/equipment?type=rental' },
    { label: 'Dive Packages', href: '/packages' },
    { label: 'Promotions', href: '/promotions' }
  ];

  // System Navigation Items for Staff/Admin
  const systemNavigationItems = [
    { label: 'Dashboard', href: isRole('admin') ? '/admin' : '/staff-dashboard', icon: BarChart3 },
    ...(isRole('admin') ? [
      { label: 'Users', href: '/user-management', icon: UsersIcon },
      { label: 'Products', href: '/admin', icon: Package },
      { label: 'Orders', href: '/admin', icon: ShoppingCart },
      { label: 'Analytics', href: '/admin', icon: TrendingUp }
    ] : []),
    ...(isRole('manager') || isRole('staff') ? [
      { label: 'Orders', href: '/staff-dashboard', icon: ShoppingCart },
      { label: 'Rentals', href: '/staff-dashboard', icon: Activity },
      ...(isDepartment('warehouse') ? [{ label: 'Inventory', href: '/staff-dashboard', icon: Database }] : [])
    ] : []),
    ...(isRole('dive_center_partner') ? [
      { label: 'Packages', href: '/partner-dashboard', icon: Package },
      { label: 'Bookings', href: '/partner-dashboard', icon: UsersIcon }
    ] : [])
  ];

  const membershipBadge = user ? getMembershipBadge(user.membershipTier) : null;
  const roleBadge = user ? getRoleBadge(user.role) : null;
  const isSystemUser = user && !isRole('customer');

  return (
    <>
      {/* Animated Background Paths */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(8, 145, 178, 0.03)" />
              <stop offset="50%" stopColor="rgba(249, 115, 22, 0.02)" />
              <stop offset="100%" stopColor="rgba(8, 145, 178, 0.01)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Flowing paths that respond to mouse movement */}
          <path
            d={`M0,50 Q${mousePosition.x * 0.1},${50 + mousePosition.y * 0.05} 400,60 T800,50`}
            stroke="url(#pathGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            className="animate-pulse"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.001) * 10}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
          <path
            d={`M0,100 Q${mousePosition.x * 0.08},${100 + mousePosition.y * 0.03} 600,110 T1200,100`}
            stroke="url(#pathGradient)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
            className="animate-pulse"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.0015) * 15}px)`,
              transition: 'transform 0.4s ease-out',
              animationDelay: '1s'
            }}
          />
        </svg>
      </div>

      {/* Premium Top Bar - Only for customers */}
      {(!user || isRole('customer')) && (
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 hidden md:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 group">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="group-hover:text-emerald-300 transition-colors duration-300">Free shipping on orders over RM 200</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <Gift className="h-3 w-3 text-amber-400" />
                  <span className="group-hover:text-amber-300 transition-colors duration-300">New member? Get 10% off your first order</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 group">
                  <Globe className="h-3 w-3 text-blue-400" />
                  <span className="group-hover:text-blue-300 transition-colors duration-300">Worldwide Shipping</span>
                </div>
                <span className="text-slate-300">📞 +60 3-2345-6789</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header with Glass Morphism */}
      <header className={`
        ${isSystemUser ? 'bg-slate-900/95' : 'bg-white/95'} 
        backdrop-blur-xl border-b 
        ${isSystemUser ? 'border-slate-700/50' : 'border-slate-200/50'} 
        sticky top-0 z-50 transition-all duration-500 ease-out
        ${isScrolled ? 'shadow-2xl shadow-slate-900/10' : 'shadow-lg shadow-slate-900/5'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section with Sophisticated Animation */}
            <Link to="/" className={`flex items-center space-x-3 ${isSystemUser ? 'text-white' : 'text-slate-900'} group`}>
              <div className="relative">
                <div className={`
                  w-11 h-11 rounded-2xl flex items-center justify-center
                  ${isSystemUser 
                    ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800' 
                    : 'bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700'
                  }
                  shadow-lg group-hover:shadow-xl
                  transform group-hover:scale-105 group-hover:rotate-3
                  transition-all duration-500 ease-out
                  ${isScrolled ? 'shadow-ocean-500/20' : ''}
                `}>
                  <Waves className="h-6 w-6 text-white transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Floating indicator for non-system users */}
                {!isSystemUser && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-coral-400 to-coral-500 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-coral-500 rounded-full animate-ping opacity-75" />
                    <div className="relative w-full h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="hidden sm:block">
                <div className={`
                  text-xl font-bold tracking-tight
                  ${isSystemUser ? 'text-white' : 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'}
                  group-hover:scale-105 transition-transform duration-300 origin-left
                `}>
                  {isSystemUser ? 'STG System' : 'STG'}
                </div>
                <div className={`
                  text-xs font-medium tracking-wide
                  ${isSystemUser ? 'text-slate-400' : 'text-slate-500'}
                  group-hover:text-ocean-600 transition-colors duration-300
                `}>
                  {isSystemUser ? 'Management Portal' : 'Dive Equipment Store'}
                </div>
              </div>
            </Link>

            {/* Premium Search Bar - Enhanced for customers */}
            {!isSystemUser && (
              <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative w-full group">
                  <div className={`
                    relative overflow-hidden rounded-2xl
                    ${isSearchFocused 
                      ? 'bg-white shadow-2xl shadow-ocean-500/20 ring-2 ring-ocean-500/20' 
                      : 'bg-slate-50/80 hover:bg-white/90 shadow-lg hover:shadow-xl'
                    }
                    backdrop-blur-sm transition-all duration-500 ease-out
                  `}>
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ocean-500/5 via-transparent to-coral-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    
                    <Search className={`
                      absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5
                      ${isSearchFocused ? 'text-ocean-600' : 'text-slate-400'}
                      transition-all duration-300
                    `} />
                    
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder="Search equipment, packages, brands..."
                      className="
                        w-full pl-12 pr-16 py-3.5 bg-transparent
                        text-slate-900 placeholder-slate-500
                        focus:outline-none focus:placeholder-slate-400
                        font-medium text-sm
                        transition-all duration-300
                      "
                    />
                    
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-xl transition-all duration-300"
                      >
                        <Filter className="h-4 w-4" />
                      </button>
                      <button
                        type="submit"
                        className="
                          bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700
                          text-white p-2 rounded-xl shadow-lg hover:shadow-xl
                          transform hover:scale-105 active:scale-95
                          transition-all duration-300
                        "
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* System Status Indicators - Refined for system users */}
            {isSystemUser && (
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">System Online</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">3 Alerts</span>
                </div>
              </div>
            )}

            {/* Navigation - Minimalist approach */}
            <nav className="hidden lg:flex items-center space-x-1">
              {isSystemUser ? (
                // System Navigation
                systemNavigationItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href} 
                    className="
                      flex items-center space-x-2 px-4 py-2.5 rounded-xl
                      text-slate-300 hover:text-white hover:bg-slate-800/50
                      font-medium text-sm
                      transition-all duration-300 ease-out
                      group
                    "
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </Link>
                ))
              ) : (
                // Customer Navigation
                customerNavigationItems.map((item, index) => (
                  <div key={index} className="relative group">
                    <Link 
                      to={item.href} 
                      className="
                        flex items-center space-x-1 px-4 py-2.5 rounded-xl
                        text-slate-700 hover:text-ocean-600 hover:bg-ocean-50/50
                        font-medium text-sm
                        transition-all duration-300 ease-out
                        group
                      "
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>
                    
                    {/* Premium Dropdown */}
                    {item.hasDropdown && (
                      <div className="
                        absolute top-full left-0 mt-2 w-80
                        bg-white/95 backdrop-blur-xl rounded-2xl
                        shadow-2xl shadow-slate-900/20 border border-slate-200/50
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transform translate-y-2 group-hover:translate-y-0
                        transition-all duration-500 ease-out
                        z-50
                      ">
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Shop by Category</h3>
                            <p className="text-sm text-slate-600">Discover premium diving equipment from trusted brands</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-1">
                            {item.dropdownItems?.map((dropdownItem, idx) => (
                              <Link
                                key={idx}
                                to={dropdownItem.href}
                                className="
                                  flex items-center space-x-3 p-3 rounded-xl
                                  text-slate-700 hover:text-ocean-600 hover:bg-ocean-50/50
                                  transition-all duration-300 ease-out
                                  group/item
                                "
                              >
                                {typeof dropdownItem.icon === 'string' ? (
                                  <span className="text-lg">{dropdownItem.icon}</span>
                                ) : (
                                  React.createElement(dropdownItem.icon, { className: 'h-5 w-5' })
                                )}
                                <span className="font-medium flex-1">{dropdownItem.label}</span>
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                              </Link>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-200/50">
                            <Link
                              to="/equipment"
                              className="
                                block w-full text-center py-3 px-4 rounded-xl
                                bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700
                                text-white font-medium shadow-lg hover:shadow-xl
                                transform hover:scale-105 active:scale-95
                                transition-all duration-300
                              "
                            >
                              View All Equipment
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </nav>

            {/* Right Side Actions - Refined */}
            <div className="flex items-center space-x-2">
              
              {/* Notifications */}
              {user && (
                <button className={`
                  relative p-3 rounded-xl
                  ${isSystemUser 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                    : 'text-slate-600 hover:text-ocean-600 hover:bg-ocean-50/50'
                  }
                  transition-all duration-300 ease-out group
                `}>
                  <Bell className="h-5 w-5 group-hover:animate-pulse" />
                  {notifications > 0 && (
                    <span className="
                      absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1
                      bg-gradient-to-r from-coral-500 to-coral-600
                      text-white text-xs font-medium rounded-full
                      flex items-center justify-center
                      shadow-lg animate-pulse
                    ">
                      {notifications > 99 ? '99+' : notifications}
                    </span>
                  )}
                </button>
              )}

              {/* Wishlist - Only for customers */}
              {user && isRole('customer') && (
                <button className="
                  relative p-3 rounded-xl
                  text-slate-600 hover:text-red-500 hover:bg-red-50/50
                  transition-all duration-300 ease-out group
                ">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {wishlistCount > 0 && (
                    <span className="
                      absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1
                      bg-gradient-to-r from-red-500 to-red-600
                      text-white text-xs font-medium rounded-full
                      flex items-center justify-center shadow-lg
                    ">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart - Only for customers */}
              {user && isRole('customer') && (
                <Link 
                  to="/cart" 
                  className="
                    relative p-3 rounded-xl
                    text-slate-600 hover:text-ocean-600 hover:bg-ocean-50/50
                    transition-all duration-300 ease-out group
                  "
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {getItemCount() > 0 && (
                    <span className="
                      absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1
                      bg-gradient-to-r from-coral-500 to-coral-600
                      text-white text-xs font-medium rounded-full
                      flex items-center justify-center shadow-lg animate-bounce
                    ">
                      {getItemCount() > 99 ? '99+' : getItemCount()}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu - Premium Design */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`
                      flex items-center space-x-3 p-2 rounded-xl
                      ${isSystemUser ? 'text-white hover:bg-slate-800/50' : 'text-slate-700 hover:bg-slate-50/50'}
                      transition-all duration-300 ease-out group
                    `}
                  >
                    <div className="relative">
                      <div className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center
                        ${isSystemUser 
                          ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                          : 'bg-gradient-to-br from-ocean-500 to-ocean-700'
                        }
                        shadow-lg group-hover:shadow-xl
                        ${membershipBadge?.glow}
                        transform group-hover:scale-105
                        transition-all duration-300
                      `}>
                        <User className="h-5 w-5 text-white" />
                      </div>
                      
                      {user.membershipTier && membershipBadge && isRole('customer') && (
                        <div className="absolute -bottom-1 -right-1">
                          <div className={`
                            w-5 h-5 rounded-full flex items-center justify-center
                            bg-gradient-to-r ${membershipBadge.color}
                            shadow-lg animate-pulse
                          `}>
                            <membershipBadge.icon className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="hidden md:block text-left">
                      <div className={`text-sm font-semibold ${isSystemUser ? 'text-white' : 'text-slate-900'}`}>
                        {user.name.split(' ')[0]}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`
                          px-2 py-0.5 rounded-md text-xs font-medium border
                          ${roleBadge?.color}
                        `}>
                          {roleBadge?.label}
                        </span>
                        {user.department && (
                          <span className={`text-xs ${isSystemUser ? 'text-slate-400' : 'text-slate-500'}`}>
                            {user.department}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ChevronDown className={`
                      h-4 w-4 ${isSystemUser ? 'text-slate-400' : 'text-slate-400'}
                      transition-transform duration-300 group-hover:rotate-180
                    `} />
                  </button>

                  {/* Premium User Dropdown */}
                  {isUserMenuOpen && (
                    <div className={`
                      absolute right-0 mt-2 w-80
                      ${isSystemUser ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'}
                      backdrop-blur-xl rounded-2xl shadow-2xl border
                      transform transition-all duration-500 ease-out
                      animate-slide-up z-50
                    `}>
                      {/* User Info Header */}
                      <div className={`
                        px-6 py-4 border-b
                        ${isSystemUser ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200/50 bg-gradient-to-r from-ocean-50/50 to-blue-50/50'}
                      `}>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className={`
                              w-14 h-14 rounded-2xl flex items-center justify-center
                              ${isSystemUser 
                                ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                                : 'bg-gradient-to-br from-ocean-500 to-ocean-700'
                              }
                              shadow-xl ${membershipBadge?.glow}
                            `}>
                              <User className="h-7 w-7 text-white" />
                            </div>
                            {user.membershipTier && membershipBadge && isRole('customer') && (
                              <div className="absolute -bottom-1 -right-1">
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center
                                  bg-gradient-to-r ${membershipBadge.color} shadow-lg
                                `}>
                                  <membershipBadge.icon className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-bold text-lg ${isSystemUser ? 'text-white' : 'text-slate-900'}`}>
                              {user.name}
                            </div>
                            <div className={`text-sm ${isSystemUser ? 'text-slate-400' : 'text-slate-600'}`}>
                              {user.email}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`
                                px-2 py-1 rounded-lg text-xs font-medium border
                                ${roleBadge?.color}
                              `}>
                                {roleBadge?.label}
                              </span>
                              {user.department && (
                                <span className={`
                                  px-2 py-1 rounded-lg text-xs font-medium border
                                  ${isSystemUser ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-600 border-slate-200'}
                                `}>
                                  {user.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Customer Menu */}
                        {isRole('customer') && (
                          <Link
                            to="/dashboard"
                            className={`
                              flex items-center px-6 py-3
                              ${isSystemUser 
                                ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                                : 'text-slate-700 hover:bg-ocean-50/50 hover:text-ocean-600'
                              }
                              transition-all duration-300 group
                            `}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        )}

                        {/* Staff Menu */}
                        {(isRole('staff') || isRole('manager')) && (
                          <Link
                            to="/staff-dashboard"
                            className={`
                              flex items-center px-6 py-3
                              ${isSystemUser 
                                ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                                : 'text-slate-700 hover:bg-ocean-50/50 hover:text-ocean-600'
                              }
                              transition-all duration-300 group
                            `}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Staff Dashboard</span>
                          </Link>
                        )}

                        {/* Admin Menu */}
                        {isRole('admin') && (
                          <>
                            <Link
                              to="/admin"
                              className={`
                                flex items-center px-6 py-3
                                ${isSystemUser 
                                  ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                                  : 'text-slate-700 hover:bg-red-50/50 hover:text-red-600'
                                }
                                transition-all duration-300 group
                              `}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-medium">Admin Panel</span>
                            </Link>
                            <Link
                              to="/user-management"
                              className={`
                                flex items-center px-6 py-3
                                ${isSystemUser 
                                  ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                                  : 'text-slate-700 hover:bg-red-50/50 hover:text-red-600'
                                }
                                transition-all duration-300 group
                              `}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <UsersIcon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-medium">User Management</span>
                            </Link>
                          </>
                        )}

                        {/* Common Menu Items */}
                        <div className={`border-t ${isSystemUser ? 'border-slate-700/50' : 'border-slate-200/50'} mt-2 pt-2`}>
                          <Link
                            to="/profile"
                            className={`
                              flex items-center px-6 py-3
                              ${isSystemUser 
                                ? 'text-slate-300 hover:bg-slate-700/50' 
                                : 'text-slate-700 hover:bg-slate-50/50'
                              }
                              transition-all duration-300 group
                            `}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Account Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className={`
                              flex items-center w-full px-6 py-3
                              ${isSystemUser 
                                ? 'text-slate-300 hover:bg-slate-700/50 hover:text-red-400' 
                                : 'text-slate-700 hover:bg-red-50/50 hover:text-red-600'
                              }
                              transition-all duration-300 group
                            `}
                          >
                            <span className="mr-3 text-lg">🚪</span>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth"
                    className="
                      px-4 py-2.5 rounded-xl font-medium text-sm
                      text-slate-700 hover:text-ocean-600 hover:bg-ocean-50/50
                      transition-all duration-300
                    "
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="
                      px-6 py-2.5 rounded-xl font-medium text-sm
                      bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700
                      text-white shadow-lg hover:shadow-xl
                      transform hover:scale-105 active:scale-95
                      transition-all duration-300
                    "
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`
                  lg:hidden p-3 rounded-xl
                  ${isSystemUser 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                    : 'text-slate-600 hover:text-ocean-600 hover:bg-ocean-50/50'
                  }
                  transition-all duration-300
                `}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`
              lg:hidden py-4 border-t
              ${isSystemUser ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200/50 bg-white/50'}
              backdrop-blur-xl animate-slide-up
            `}>
              {/* Mobile Search for customers */}
              {!isSystemUser && (
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search equipment, packages, brands..."
                      className="
                        w-full pl-10 pr-4 py-3 rounded-xl
                        bg-slate-50/80 border border-slate-200/50
                        focus:bg-white focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500/50
                        transition-all duration-300
                      "
                      autoFocus
                    />
                  </form>
                </div>
              )}
              
              <nav className="flex flex-col space-y-1">
                {(isSystemUser ? systemNavigationItems : customerNavigationItems).map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className={`
                      px-4 py-3 rounded-xl font-medium text-sm
                      ${isSystemUser 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' 
                        : 'text-slate-700 hover:text-ocean-600 hover:bg-ocean-50/50'
                      }
                      transition-all duration-300 flex items-center space-x-2
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isSystemUser && 'icon' in item && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}