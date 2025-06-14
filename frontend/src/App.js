import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar'; // <-- make sure you import it
import Profile from './pages/Profile';
import PapersSection from './pages/PapersSection';
import AddPaper from './pages/AddPaper';
import BookmarkedPapers from './pages/BookmarkedPapers';
import RedirectHandler from './components/RedirectHandler';

function App() {
  return (
    <Router>
      <AuthProvider>
         <RedirectHandler />
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/papers" element={<PapersSection />} />
          <Route path="/add-paper" element={<AddPaper />} />
          <Route path="/bookmarks" element={<BookmarkedPapers />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;