import logo from './logo.svg';
import React, { useEffect } from "react";
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage"; // Ensure the correct path
import OfferPage from "./Pages/OfferPage"; // Ensure the correct path
import ManagementScreen from './Pages/ManagementScreen';
import ContactPage from "./Pages/ContactPage"; 
import Footer from "./Components/Footer.js";
import Hero from "./Components/Hero.js";
import Cookies from "./Components/Cookies.js"
import PrivacyPage from './Pages/PrivacyPage.js';
import Bestellen from './Pages/Bestellen.js'

const App = () => {
  
useEffect(() => {
  const mobileMenu = document.querySelector('.js-menu-container');
  const openMenuBtn = document.querySelector('.js-open-menu');
  const closeMenuBtn = document.querySelector('.js-close-menu');

  if (!mobileMenu || !openMenuBtn || !closeMenuBtn) return;

  const toggleMenu = () => {
    const isMenuOpen = openMenuBtn.getAttribute('aria-expanded') === 'true';
    openMenuBtn.setAttribute('aria-expanded', !isMenuOpen);
    mobileMenu.classList.toggle('is-open');
  };

  openMenuBtn.addEventListener('click', toggleMenu);
  closeMenuBtn.addEventListener('click', toggleMenu);

  const mediaQuery = window.matchMedia('(min-width: 768px)');
  const handleResize = (e) => {
    if (e.matches) {
      mobileMenu.classList.remove('is-open');
      openMenuBtn.setAttribute('aria-expanded', false);
    }
  };
  
  mediaQuery.addEventListener('change', handleResize);

  return () => {
    openMenuBtn.removeEventListener('click', toggleMenu);
    closeMenuBtn.removeEventListener('click', toggleMenu);
    mediaQuery.removeEventListener('change', handleResize);
  };
}, []);

  return (
    <Router>
      <Cookies />
      <Hero/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path='/management' element={<ManagementScreen/>}/>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage/>}/>
        <Route path="ijs-bestellen" element={<Bestellen/>}/>
        
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
