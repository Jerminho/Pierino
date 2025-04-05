import React, { useState, useEffect } from "react";
import OfferForm from "../Components/OfferForm"; // Ensure you import OfferForm correctly
import backgroundImage from "../Components/images/bgIceCream.png"; // Background image

const OfferPage = () => {
  
      const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
  return (
    <div className="p-4" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundSize: isMobile ? "auto" : "cover", // Dynamic background size
    }}
  >
      <h1 className="text-2xl font-bold"></h1>
      <OfferForm />
    </div>
  );
};

export default OfferPage;
