import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const logoutTimerRef = useRef();
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false); 
  const navigate =useNavigate();

  const logout = async () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE}/auth/logout`, { token: refreshToken });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/home'); 
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return setIsLoggedIn(false);

    try {
      const decoded = jwtDecode(accessToken);
      const expirationTime = decoded.exp * 1000;
      const timeUntilLogout = expirationTime - Date.now();

      if (timeUntilLogout <= 0) {
        logout();
        return;
      }

      setIsLoggedIn(true);
      setUser(decoded);

      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, timeUntilLogout);

      return () => clearTimeout(logoutTimerRef.current);
    } catch {
      logout();
    }
  }, []);

  const login = ({accessToken,refreshToken}) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const decoded = jwtDecode(accessToken);
    setUser(decoded);
    setIsLoggedIn(true);

    const expirationTime = decoded.exp * 1000;
    const timeUntilLogout = expirationTime - Date.now();

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, timeUntilLogout);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, shouldRedirectToLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
