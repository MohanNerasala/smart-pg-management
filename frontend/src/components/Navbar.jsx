import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, LogOut, LayoutDashboard, Menu, X, User, ChevronDown, HelpCircle, ShieldCheck, Settings, ReceiptText, IndianRupee, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsSubmenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <Home className="h-5 w-5 text-brand-600" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Stay<span className="text-brand-600">Nest</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAdminPage ? (
              <>
                <Link to="/admin" className="flex items-center gap-1.5 font-bold text-sm text-indigo-600 border-b-2 border-indigo-600 pb-1">
                  <ShieldCheck className="h-4 w-4" /> Admin Panel
                </Link>
                <Link to="/" className="flex items-center gap-1.5 font-semibold text-sm text-slate-600 hover:text-indigo-600">
                  <LayoutDashboard className="h-4 w-4" /> User View
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="font-semibold text-sm text-slate-600 hover:text-brand-600 transition-all">Home</Link>
                <Link to="/listings" className="font-semibold text-sm text-slate-600 hover:text-brand-600 transition-all">Listings</Link>
                
                {user && (
                  <>
                    {(user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') && (
                      <Link to="/admin" className="flex items-center gap-1.5 font-bold text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-xl transition-all">
                        <ShieldCheck className="h-4 w-4" /> Back to Admin
                      </Link>
                    )}
                    <Link to="/dashboard" className="flex items-center gap-1.5 font-semibold text-sm text-slate-600 hover:text-brand-600 transition-all">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link to="/bookings" className="font-semibold text-sm text-slate-600 hover:text-brand-600 transition-all">Booking</Link>
                  </>
                )}
              </>
            )}

            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            
            {user ? (
              <div className="relative flex items-center gap-2">
                {/* Profile Dropdown Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 border rounded-full transition-all group/profile
                    ${isProfileOpen 
                      ? 'bg-brand-50 border-brand-200 shadow-inner' 
                      : 'bg-white border-slate-200 hover:border-brand-200 hover:bg-slate-50'}`}
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center group-hover/profile:bg-brand-200 transition-colors">
                    <User className="h-4.5 w-4.5 text-brand-600" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsSubmenuOpen(false);
                      }}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 py-3 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="px-4 pb-3 mb-2 border-b border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">User Profile</p>
                        <p className="text-base font-black text-slate-900 text-center">{user.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 text-center">{user.email || 'Resident Account'}</p>
                      </div>

                      <div className="px-2 space-y-1">
                        <Link to="/profile" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:translate-x-1 transition-all group">
                          <User className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-colors" /> Profile Details
                        </Link>
                        
                        <Link to="/refund-request" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:translate-x-1 transition-all group">
                          <IndianRupee className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-colors" /> Refund Amount
                        </Link>
                        
                        
                        <div className="h-px bg-slate-100 my-2 mx-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-extrabold text-red-600 hover:bg-red-50 transition-all"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Profile Trigger */}
          <div className="flex items-center md:hidden">
            {user ? (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`flex items-center justify-center transition-all ${mobileMenuOpen ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${mobileMenuOpen ? 'bg-brand-50 border-brand-500 shadow-inner' : 'bg-white border-slate-200'}`}>
                  <User className={`h-5 w-5 ${mobileMenuOpen ? 'text-brand-600' : 'text-slate-500'}`} />
                </div>
              </button>
            ) : (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Mobile Menu Overlay / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop for closing */}
          <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}></div>
          
          <div className={`absolute right-4 top-16 z-50 transition-all duration-300 transform origin-top-right
            ${user ? 'w-64' : 'left-4 right-4'}`}>
            
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-400/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {user ? (
                <div className="flex flex-col">
                  {/* Header info */}
                  <div className="bg-slate-50/50 px-5 py-6 border-b border-slate-100 flex flex-col items-center">
                    <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mb-3">
                      <User className="h-7 w-7 text-brand-600" />
                    </div>
                    <p className="text-base font-black text-slate-900 leading-none mb-1 text-center">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 lowercase tracking-wide text-center">{user.email || 'Resident account'}</p>
                  </div>

                  {/* Actions */}
                  <div className="p-3 space-y-1">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 active:translate-x-1 transition-all group">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                        <User className="h-4 w-4 text-slate-500 group-hover:text-brand-600 transition-colors" />
                      </div>
                      Profile Details
                    </Link>

                    <Link to="/refund-request" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 active:translate-x-1 transition-all group">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                        <IndianRupee className="h-4 w-4 text-slate-500 group-hover:text-brand-600 transition-colors" />
                      </div>
                      Refund Amount
                    </Link>

                    <div className="h-px bg-slate-100 my-1.5 mx-2"></div>

                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-black text-red-600 hover:bg-red-50 active:bg-red-100 transition-all group">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut className="h-4 w-4 text-red-500" />
                      </div>
                      Log Out Session
                    </button>
                  </div>
                </div>
              ) : (
                /* Public / Login Links - Full width-ish but in the same card-style */
                <div className="p-4 space-y-3">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 text-sm font-black text-slate-700 active:bg-slate-50 rounded-2xl transition-all border border-slate-100"><Home className="h-5 w-5 text-brand-600" /> Home</Link>
                  <Link to="/listings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 text-sm font-black text-slate-700 active:bg-slate-50 rounded-2xl transition-all border border-slate-100"><Search className="h-5 w-5 text-brand-600" /> All Listings</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-5 bg-brand-600 active:bg-brand-700 text-white font-black text-base rounded-2xl shadow-xl shadow-brand-500/20 transition-all">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
