// src/pages/Welcome.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import './Welcome.scss';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="app-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        PaperHunt
      </motion.h1>

      <motion.button
        className="forward-button"
        onClick={() => navigate('/home')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Start
        <ArrowRightIcon className="icon" />
      </motion.button>
    </motion.div>
  );
}

