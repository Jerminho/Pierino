import React, { useState, useEffect } from "react";
import "./Cookies.css";

const Cookies = () => {
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "true" || cookieConsent === "false") {
      setHasConsented(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setHasConsented(true);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setHasConsented(true);
  };

  if (hasConsented) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>
          Wij gebruiken cookies om uw ervaring op onze website te verbeteren.
          Door verder te gaan met het gebruiken van de site gaat u akkoord met
          ons gebruik van cookies.
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
