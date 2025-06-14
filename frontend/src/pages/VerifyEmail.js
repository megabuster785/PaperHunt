import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const hasRun = useRef(false); 

  useEffect(() => {
    if (!token || hasRun.current) return;

    hasRun.current = true;

    const verify = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/auth/verify-email/${token}`);
        console.log("Verification response:", res.data);

        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully!');
          toast.success('Verification successful');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Verification failed');
          toast.error(res.data.message || 'Verification failed');
        }
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
        toast.error(err.response?.data?.message || 'Verification failed');
      }
    };

    verify();
  }, [token, navigate]);

  useEffect(() => {
    if (status === 'success') {
      const timeout = setTimeout(() => {
        navigate('/login');
      }, 4000);
      return () => clearTimeout(timeout); 
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center animate-fade-in-down">
        {status === 'loading' ? (
          <div className="text-xl font-semibold animate-pulse text-gray-600">Verifying email...</div>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold text-green-700 mb-2">Success!</h1>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Try requesting a new verification email.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
