import React from "react";
import { Link } from "react-router-dom";

import Products from "../Components/Products";
import AboutAndAdvantages from "../Components/AboutAndAdvantages";
import Gallery from "../Components/Gallery";
import Contacts from "../Components/Contacts";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-pink-200 via-red-300 via-red-200 to-red-300 min-h-screen">

      {/* Products Section */}
      <Products />

      {/* About and Advantages Section */}
      <AboutAndAdvantages />

      {/* Gallery Section */}
      <Gallery />

      {/* Contacts Section */}
      {/* <Contacts /> */}
    </div>
  );
};

export default HomePage;
