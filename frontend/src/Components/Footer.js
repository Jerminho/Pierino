import React from "react";
import { FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCreditCard } from "react-icons/fa";
import hib from "../Components/images/hib_logo.webp";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Logo */}
        <img src={hib} alt="HIB Logo" className="footer-logo" />

        {/* Center: Contact Information */}
        <div className="footer-contact">
          <p><FaMapMarkerAlt className="icon" /> Wijmenstraat 2, 9030 Mariakerke</p>
          <p><FaEnvelope className="icon" /> <a href="mailto:info@pierinoijs.be">info@pierinoijs.be</a></p>
          <p><FaBuilding className="icon" /> BE0806298642</p>
          <p><FaCreditCard className="icon" /> BE40 3631 0095 9963</p>
          
        </div>

        {/* Right: Social Media */}
        <div className="footer-social">
          <a href="https://www.facebook.com/pages/Pierino-ijs/192706620765173?fref=ts" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/pierinoijs/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Bottom: Credit */}
      <div className="footer-credit">
      <a href="privacy" target="_blank" rel="noopener noreferrer">Privacybeleid | </a>

        <a href="https://www.pierrenh.com" target="_blank" rel="noopener noreferrer">
          Built by NH - All Rights Reserved
        </a>
      </div>
    </footer>
  );
};

export default Footer;
