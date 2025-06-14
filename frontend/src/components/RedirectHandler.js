import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RedirectHandler = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPatterns = [
      /^\/$/,                        // root
      /^\/home$/,                    // /home
      /^\/login$/,                   // /login
      /^\/register$/,                // /register
      /^\/forgot-password$/,         // /forgot-password
      /^\/reset-password\/[^/]+$/,   // /reset-password/:token
      /^\/verify-email\/[^/]+$/,     // /verify-email/:token
    ];

    const isPublicRoute = publicPatterns.some((pattern) => pattern.test(location.pathname));

    if (!isLoggedIn && !isPublicRoute) {
      navigate('/home');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return null;
};

export default RedirectHandler;
