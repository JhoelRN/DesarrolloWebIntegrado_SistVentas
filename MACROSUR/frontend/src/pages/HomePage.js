import React from 'react';
import Header from '../components/Header';
import ServicesBar from '../components/ServicesBar';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import CookiesBanner from '../components/CookiesBanner';

function HomePage({ onLoginClick }) {
  return (
    <div className="home-page">
      <Header onLoginClick={onLoginClick} />
      <ServicesBar />
      <MainContent />
      <Footer />
      <CookiesBanner />
    </div>
  );
}

export default HomePage;