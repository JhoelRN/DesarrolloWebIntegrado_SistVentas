import React from 'react';
import Header from '../components/Header';
import ServicesBar from '../components/ServicesBar';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import CookiesBanner from '../components/CookiesBanner';

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <ServicesBar />
      <MainContent />
      <Footer />
      <CookiesBanner />
    </div>
  );
}

export default HomePage;