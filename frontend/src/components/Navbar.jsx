import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, Building2, LogOut, LayoutDashboard, Menu, X, User, 
  ChevronDown, ShieldCheck, ReceiptText, IndianRupee, Search, 
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const profileRef = useRef(null);

  // Detect whether user has scrolled past the hero section on the home page
  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // Hero is 100vh; trigger transition slightly before leaving hero
        const heroHeight = window.innerHeight || 650;
        setIsScrolledPastHero(window.scrollY > (heroHeight - 90));
      } else {
        setIsScrolledPastHero(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHomePage]);

  // Click outside listener so profile dropdown closes cleanly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Listings', path: '/listings', icon: Building2 },
    ...(user ? [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Booking', path: '/bookings', icon: ReceiptText },
    ] : [])
  ];

  // When on the Home page AND at the top (over the hero photo), use dark/transparent glass.
  // The moment user scrolls past the hero into the white content sections, smoothly switch to luxury white glass!
  const isDarkHeroNav = isHomePage && !isScrolledPastHero;

  return (
    <nav 
      className={`${
        isHomePage 
          ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isDarkHeroNav
                ? 'bg-gradient-to-b from-black/75 via-black/25 to-transparent backdrop-blur-xs border-b border-white/10'
                : 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-sm text-slate-900'
            }` 
          : 'sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xs transition-all duration-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 transition-all duration-200">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group select-none">
              {/* Small Glassy Single-Line House Emblem */}
              <div className={`relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 border ${
                isDarkHeroNav 
                  ? 'bg-white/10 border-white/20 text-emerald-400 shadow-sm shadow-black/20 group-hover:bg-white/15 group-hover:border-emerald-400/40' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-2xs group-hover:bg-emerald-500/15 group-hover:border-emerald-500/35'
              }`}>
                {/* Pure Single-Line House Icon (Clean line only, not double, delicate) */}
                <svg 
                  className="w-4.5 h-4.5 drop-shadow-xs" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10.5Z" />
                  <path d="M9 21V13H15V21" />
                </svg>
              </div>
              
              {/* Brand Typography (Crisp White & Vibrant Emerald) */}
              <div className="flex items-center">
                <span className={`font-display font-black text-2xl sm:text-[26px] tracking-[-0.03em] transition-colors duration-200 ${
                  isDarkHeroNav ? 'text-white' : 'text-slate-900'
                }`}>
                  Stay
                </span>
                <span className={`font-display font-black text-2xl sm:text-[26px] tracking-[-0.03em] transition-all duration-200 ${
                  isDarkHeroNav 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'
                }`}>
                  Nest
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {isAdminPage ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs"
                >
                  <ShieldCheck className="h-4 w-4 text-indigo-600" /> Admin Console
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" /> User View
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  if (isDarkHeroNav) {
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 select-none ${
                          isActive
                            ? 'bg-white/15 text-white border border-white/25 shadow-sm backdrop-blur-md'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-white/60'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 select-none ${
                        isActive 
                          ? 'bg-slate-100 text-slate-950 font-black border border-slate-200/80 shadow-2xs' 
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') && (
                  <Link 
                    to="/admin" 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ml-1 transition-colors ${
                      isDarkHeroNav 
                        ? 'text-indigo-300 hover:text-white hover:bg-white/10 border border-indigo-400/30' 
                        : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </Link>
                )}
              </div>
            )}

            <div className={`h-6 w-px mx-2 transition-colors duration-200 ${isDarkHeroNav ? 'bg-white/20' : 'bg-slate-200'}`} />
            
            {user ? (
              <div className="relative" ref={profileRef}>
                {/* Profile Trigger */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border transition-all duration-200 cursor-pointer select-none ${
                    isDarkHeroNav
                      ? (isProfileOpen 
                          ? 'bg-white/25 border-white/40 shadow-inner' 
                          : 'bg-white/10 border-white/20 hover:bg-white/15 text-white shadow-sm backdrop-blur-md')
                      : (isProfileOpen 
                          ? 'bg-slate-100 border-slate-300 shadow-inner ring-2 ring-emerald-500/10' 
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs hover:shadow-xs')
                  }`}
                  aria-expanded={isProfileOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs ring-1 ring-white/50">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  
                  <div className="text-left hidden lg:block leading-tight">
                    <p className={`text-xs font-black truncate max-w-[110px] transition-colors duration-200 ${
                      isDarkHeroNav ? 'text-white' : 'text-slate-800'
                    }`}>{user.name}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-wider leading-none transition-colors duration-200 ${
                      isDarkHeroNav ? 'text-emerald-300' : 'text-emerald-600'
                    }`}>Resident</p>
                  </div>
                  
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isDarkHeroNav ? 'text-white/70' : 'text-slate-400'
                  } ${isProfileOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right text-slate-900">
                      {/* Header with Avatar & Details */}
                      <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/70 rounded-xl border border-slate-200/60 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-white shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                            <p className="text-[11px] font-medium text-slate-500 truncate">{user.email || 'Resident Account'}</p>
                            <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Active Member
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-0.5">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all group"
                        >
                          <span className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            Profile Settings
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <Link 
                          to="/bookings" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all group"
                        >
                          <span className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs">
                              <ReceiptText className="w-3.5 h-3.5" />
                            </div>
                            My Bookings &amp; Slips
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <Link 
                          to="/refund-request" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all group"
                        >
                          <span className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs">
                              <IndianRupee className="w-3.5 h-3.5" />
                            </div>
                            Refund Request
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <div className="h-px bg-slate-200/70 my-1.5 mx-2" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer group"
                        >
                          <span className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-rose-100/60 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                              <LogOut className="w-3.5 h-3.5" />
                            </div>
                            Sign Out Session
                          </span>
                        </button>
                      </div>
                    </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 ${
                  isDarkHeroNav
                    ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkHeroNav 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <div className={`absolute left-4 right-4 top-18 z-50 rounded-3xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 border ${
            isDarkHeroNav
              ? 'bg-slate-950/95 backdrop-blur-2xl border-white/20 text-white'
              : 'bg-white/95 backdrop-blur-2xl border-slate-200/90 text-slate-900'
          }`}>
            {user ? (
              <div>
                {/* User Card */}
                <div className={`flex items-center gap-3 p-3.5 rounded-2xl mb-3 border ${
                  isDarkHeroNav
                    ? 'bg-white/10 border-white/15'
                    : 'bg-slate-50 border-slate-200/70'
                }`}>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black truncate">{user.name}</p>
                    <p className={`text-[11px] font-medium truncate ${isDarkHeroNav ? 'text-white/60' : 'text-slate-500'}`}>
                      {user.email || 'Resident Account'}
                    </p>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                          ${isActive 
                            ? (isDarkHeroNav ? 'bg-white/20 text-white font-black' : 'bg-slate-100 text-slate-900 font-black')
                            : (isDarkHeroNav ? 'text-white/80 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : (isDarkHeroNav ? 'text-white/50' : 'text-slate-400')}`} />
                          <span>{item.label}</span>
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </Link>
                    );
                  })}

                  <div className={`h-px my-2 ${isDarkHeroNav ? 'bg-white/15' : 'bg-slate-200/70'}`} />

                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isDarkHeroNav ? 'text-white/80 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 opacity-60" />
                    <span>Profile Settings</span>
                  </Link>

                  <Link 
                    to="/refund-request" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isDarkHeroNav ? 'text-white/80 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <IndianRupee className="w-4 h-4 opacity-60" />
                    <span>Refund Request</span>
                  </Link>

                  <div className={`h-px my-2 ${isDarkHeroNav ? 'bg-white/15' : 'bg-slate-200/70'}`} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center shadow-md"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
