import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; 

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-700">PaperHunt</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-indigo-700 hover:underline">Profile</Link>
              <Link to="/papers" className="text-indigo-700 hover:underline">Papers</Link>
              <Link to="/add-paper" className="text-indigo-700 hover:underline">AddPapers</Link>
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-700 hover:underline">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-3 px-4">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block text-indigo-700" onClick={toggleMenu}>Profile</Link>
              <Link to="/papers" className="block text-indigo-700" onClick={toggleMenu}>Papers</Link>
              <Link to="/add-paper" className="block text-indigo-700" onClick={toggleMenu}>AddPapers</Link>
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="block text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-indigo-700" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="block bg-indigo-600 text-white px-4 py-2 rounded-full" onClick={toggleMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
