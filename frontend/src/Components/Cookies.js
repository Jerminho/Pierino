import React, { useState, useEffect } from 'react';
import "./Cookies.css"

const Cookies = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState(false);

  // Controleer of de gebruiker al akkoord is gegaan met cookies
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'true') {
      setIsCookieAccepted(true);
    }
  }, []);

  // Cookie toestemming opslaan
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsCookieAccepted(true);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsCookieAccepted(false);
  };

  // Als de gebruiker akkoord is gegaan, tonen we geen cookie banner meer
  if (isCookieAccepted) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>
          Wij gebruiken cookies om uw ervaring op onze website te verbeteren. Door verder te gaan met het gebruiken van de site gaat u akkoord met ons gebruik van cookies.
        </p>
        <div className="cookie-banner-actions">
          <button className="btn-accept" onClick={acceptCookies}>
            Akkoord
          </button>
          <button className="btn-decline" onClick={declineCookies}>
            Weigeren
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
