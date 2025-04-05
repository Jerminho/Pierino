import React, { useState, useEffect } from "react";
import './Products.css'; // Assuming the styles are in this file
// Import images correctly
import iceCream1x from './images/ice-cream-header-d.png';
import iceCream2x from './images/ice-cream-header-d@2x.png';
import milk1x from './images/milk-header-d.png';
import milk2x from './images/milk-header-d@2x.png';
import girlIceCream1x from './images/girl-icecream-d.png';
import girlIceCream2x from './images/girl-icecream-d@2x.png';
import arrowRight from './images/arrow-right.png';
// Import symbols correctly
import symbols from './images/symbols/symbol-defs.svg'; 
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
      <div className="products-div-products" style={{
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
            <p className="paragraph-strawberry-product">
            Zin in verfrissend, ambachtelijk ijs? Bestel nu en trakteer jezelf op de lekkerste smaken! 
            </p>
            <div className="icons">
              <svg className="arrow-right-product">
                <use
                  href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"
                ></use>
              </svg>
            </div>
            <div className="product__overlay">
              <p className="product__text">
              Of je nu thuis geniet of een feest plant, wij zorgen voor het perfecte ijsmoment. ❄️✨
              </p>
            </div>
          </div>


          <div className="rectangle-2-product">
            <h3 className="coffee-title-product">Reserveren</h3>
            <svg className="dots-product">
            <use href={`${symbols}#icon-dots-dots`}></use>
            </svg>
            <p className="paragraph-coffee-product">
            Reserveer jouw ijskar vandaag! 

Maak je evenement extra speciaal met onze ijskar vol heerlijk ambachtelijk ijs! 
            </p>
            <div className="icons">
              <svg className="arrow-right-product">
                <use
                  href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"
                ></use>
              </svg>
            </div>
            <div className="product__overlay">
              <p className="product__text">
              Of het nu gaat om een feest, bruiloft of bedrijfsbijeenkomst – wij zorgen voor een onvergetelijke ervaring.
              </p>
            </div>
          </div>
          <div className="rectangle-3-product">
            <h3 className="milkshake-title-product">Contacteren</h3>
            <svg className="dots-product">
            <use href={`${symbols}#icon-dots-dots`}></use>
            </svg>
            <p className="paragraph-milkshake-product">
            Heb je vragen, wil je een bestelling plaatsen of een ijskar reserveren? Neem gerust contact met ons op!
            </p>
            <div className="icons">
              <svg className="arrow-right-product">
                <use
                  href="../src/images/symbols/symbol-defs.svg#icon-arrow-small"
                ></use>
              </svg>
            </div>
            <div className="product__overlay">
              <p className="product__text">
              Wij helpen je met plezier verder.

 Stuur ons een bericht en we reageren zo snel mogelijk! 
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products
