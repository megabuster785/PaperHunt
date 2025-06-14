// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const images = [img1, img2, img3];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-16">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Explore Research Papers Effortlessly</h2>
        <p className="text-lg text-gray-600">
          Discover trending papers from arXiv and find matching GitHub repositories instantly.
        </p>
      </div>
      <motion.div
        className="md:w-1/2 mb-8 md:mb-0"
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={images[index]} alt="Preview" className="w-full max-w-md mx-auto rounded-xl shadow-lg" />
      </motion.div>
    </section>
  );
}
