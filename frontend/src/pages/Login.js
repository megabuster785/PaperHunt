// src/pages/Login.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE}/auth/refresh-token`, { token: refreshToken });
      localStorage.setItem('accessToken', res.data.accessToken);
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE}/auth/login`, formData);
      console.log('Response:', res); 
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      login({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken
        });
    navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  (async () => {
    await refreshAccessToken();
  })();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">Login</h2>

        <div>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
        >
          {loading && <Loader2 className="animate-spin mr-2" />}
          {loading ? 'Logging in...' : 'Login'}
        </button>

       <p className="text-sm text-center">
  Forgot your password?{' '}
  <span
    onClick={() => navigate('/forgot-password')}
    className="text-blue-600 cursor-pointer hover:underline"
  >
    Reset here
  </span>
</p>

      </form>
    </div>
  );
};

export default Login;
