import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, X } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirect to Spring Boot OAuth2 endpoint
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/listings');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Subdued Background decoration for mobile */}
      <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none opacity-40 md:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-64 md:w-96 h-64 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white md:bg-white/80 md:backdrop-blur-xl border border-white md:border-slate-200 p-8 md:p-10 rounded-2xl shadow-2xl md:shadow-xl z-10 transition-all duration-300">
        <div>
          <div className="mx-auto h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500">
            Sign in to access your secure account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <X className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white shadow-xl ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <span className="flex items-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In Now'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="px-3 bg-white text-slate-400">Secure Access</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          New to StayNest?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 group">
            Create account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
