import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // need this or manual decode

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthLogin } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        // Manually decode JWT safely without extra deps if not available
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        
        // extract user data from token claims
        const userData = {
          id: decoded.userId,
          email: decoded.sub,
          name: decoded.name || decoded.sub.split('@')[0], 
          role: decoded.role || 'ROLE_USER' 
        };

        const refreshToken = searchParams.get('refreshToken');
        
        handleOAuthLogin(token, refreshToken, userData);
        navigate('/');
      } catch(e) {
        console.error("Token decoding failed", e);
        navigate('/login?error=InvalidToken');
      }
    } else {
      navigate('/login?error=OAuthFailed');
    }
  }, [searchParams, navigate, handleOAuthLogin]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-medium text-slate-700">Authenticating...</h2>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
