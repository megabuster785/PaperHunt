// src/pages/Home.jsx
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import TrendingSection from './Trending';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
     
      <main className="flex-grow">
        <Hero />
         <TrendingSection /> 
      </main>
      <Footer />
    </div>
  );
}
