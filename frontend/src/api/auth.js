const API = process.env.REACT_APP_API_BASE; 

export const registerUser = async (userData) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const verifyEmail = async (token) => {
  const res = await fetch(`${API}/auth/verify-email/${token}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Verification failed');
  return data;
};
