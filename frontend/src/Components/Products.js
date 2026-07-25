import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import "./Products.css"; // Assuming the styles are in this file
// Import images correctly
// import iceCream1x from "./images/ice-cream-header-d.png";
// import iceCream2x from "./images/ice-cream-header-d@2x.png";
// import milk1x from "./images/milk-header-d.png";
// import milk2x from "./images/milk-header-d@2x.png";
// import girlIceCream1x from "./images/girl-icecream-d.png";
// import girlIceCream2x from "./images/girl-icecream-d@2x.png";
// import arrowRight from "./images/arrow-right.png";
// Import symbols correctly
import symbols from "./images/symbols/symbol-defs.svg";
import backgroundImage from "../Components/images/bgIceCream.png"; // Background image

const Products = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="products-section-products" id="products">
      <div
        className="products-div-products"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center",
          backgroundSize: isMobile ? "auto" : "cover", // Dynamic background size
        }}
      >
        <div className="titles-products">
          <p className="product-title">100% ambachtelijke</p>
          <h2 className="products-title">PRODUCTEN</h2>
        </div>
        <div className="products-shown">
          <div className="rectangle-product">
            <h3 className="strawberry-title-product">Bestellen</h3>
            <svg className="dots-product">
              <use href={`${symbols}#icon-dots-dots`}></use>
            </svg>
            <a href="ijs-bestellen">
              <p className="paragraph-strawberry-product">
                Zin in verfrissend, ambachtelijk ijs? Bestel nu en trakteer
                jezelf op de lekkerste smaken!
              </p>
            </a>
            <div className="icons">
              <a href="ijs-bestellen">
                <svg className="arrow-right-product">
                  <use href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"></use>
                </svg>
              </a>
            </div>
            <div className="product__overlay">
              <a href="ijs-bestellen">
                <p className="product__text">
                  Zin in verfrissend, ambachtelijk ijs? Bestel nu en trakteer
                jezelf op de lekkerste smaken!
                </p>
              </a>
            </div>
          </div>

          <div className="rectangle-2-product">
            <h3 className="coffee-title-product">Offerte aanvragen</h3>
            <svg className="dots-product">
              <use href={`${symbols}#icon-dots-dots`}></use>
            </svg>
            <a href="offer">
              <p className="paragraph-coffee-product">
                Reserveer jouw ijskar vandaag! Maak je evenement extra speciaal
                met onze ijskar vol heerlijk ambachtelijk ijs!
              </p>
            </a>
            <div className="icons">
              <a href="offer">
                <svg className="arrow-right-product">
                  <use href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"></use>
                </svg>
              </a>
            </div>
            <div className="product__overlay">
              <a href="offer">
                <p className="product__text">
                  Reserveer jouw ijskar vandaag! Maak je evenement extra speciaal
                met onze ijskar vol heerlijk ambachtelijk ijs!
                </p>
              </a>
            </div>
          </div>
          <div className="rectangle-3-product">
            <h3 className="milkshake-title-product">Contacteren</h3>
            <svg className="dots-product">
              <use href={`${symbols}#icon-dots-dots`}></use>
            </svg>
            <a href="contact">
              <p className="paragraph-milkshake-product">
                Heb je vragen, wil je een bestelling plaatsen of een ijskar
                reserveren? Neem gerust contact met ons op!
              </p>
            </a>
            <div className="icons">
              <a href="contact">
                <svg className="arrow-right-product">
                  <use href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"></use>
                </svg>
              </a>
            </div>
            <div className="product__overlay">
              <a href="contact">
                <p className="product__text">
                  Heb je vragen, wil je een bestelling plaatsen of een ijskar
                reserveren? Neem gerust contact met ons op!
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
