import React from "react";
import "./Hero.css"
import logoIceCream from './images/pierino-logo.webp';
import iceCreamHeaderD from "./images/ice-cream-header-d.png";
import iceCreamHeaderD2x from "./images/ice-cream-header-d@2x.png";
import iceCreamHeaderT from "./images/ice-cream-header-t.png";
import iceCreamHeaderT2x from "./images/ice-cream-header-t@2x.png";
import iceCreamHeaderM from "./images/ice-cream-header-m.png";
import iceCreamHeaderM2x from "./images/ice-cream-header-m@2x.png";
import milkHeaderD from "./images/milk-header-d.png";
import milkHeaderD2x from "./images/milk-header-d@2x.png";
import milkHeaderT from "./images/milk-header-t.png";
import milkHeaderT2x from "./images/milk-header-t@2x.png";
import arrowRight from "./images/arrow-right.png";
import girlIceCreamD from "./images/girl-icecream-d.png";
import girlIceCreamD2x from "./images/girl-icecream-d@2x.png";
import girlIceCreamT from "./images/girl-icecream-t.png";
import girlIceCreamT2x from "./images/girl-icecream-t@2x.png";

const Hero = () => {

  
  return (
    <header id="header" className="wrapper">
      <div className="js-menu-container">
        <button className="menu-toggle js-close-menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentcolor">
            <path d="M1.25925 1L14.7407 15" stroke="currentcolor" />
            <path d="M1 14.7407L15 1.25924" stroke="currentcolor" />
          </svg>
        </button>
        <div className="menu-drawer-navigation">
          <button data-modal-open-mobile-buy type="button" className="submit-btn">
            <span className="submit-btn-content">
              Manage
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none">
                <path
                  d="M1.03772 1L5.71697 5L1.03772 9"
                  stroke="#D41443"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <ul className="menu-drawer">
            <li><a href="/" className="link">Home</a></li>
            <li><a href="ijs-bestellen" className="link">Bestellen</a></li>
            <li><a href="offer" className="link">Reserveren</a></li>
            <li className="last-link">
              <a href="contact" className="link">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <div className="header-container">
        <div className="header-container-nav">
          {/* <!-- logo --> */}
          <div>
            <a href="\" className="logo">
              <img src={logoIceCream} alt="logo" width="200" />
            </a>
          </div>

          {/* <!-- PC navigation menu --> */}
          <div>
            <ul className="menu-pc">
              <li><a href="/" className="link">Home</a></li>
              <li><a href="ijs-bestellen" className="link">Bestellen</a></li>
              <li><a href="offer" className="link">Reserveren</a></li>
              <li className="last-link">
                <a href="contact" className="link">Contact</a>
              </li>
            </ul>
          </div>

          <div className="header-buttons">
            {/* <!-- burger menu --> */}
            <button className="menu-button js-open-menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none">
                <path d="M0 1H20" stroke="#D41443" />
                <path d="M0 7H20" stroke="#D41443" />
                <path d="M0 13H20" stroke="#D41443" />
              </svg>
            </button>

            <button data-modal-open-buy data-modal-open-mobile-buy type="button" className="submit-btn">
              <span className="submit-btn-content">
                <a href="\management">Manage</a>
                
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none">
                  <path
                    d="M1.03772 1L5.71697 5L1.03772 9"
                    stroke="#D41443"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <picture className="hero-image">
          {/* <!-- Desktop --> */}
          <source
            media="(min-width:1280px)"
            srcSet={`${iceCreamHeaderD}, ${iceCreamHeaderD2x} 2x`}
          />
          {/* <!-- Tablet --> */}
          <source
            media="(min-width:768px)"
            srcSet={`${iceCreamHeaderT}, ${iceCreamHeaderT2x} 2x`}
          />
          {/* <!-- Mobile --> */}
          <source
            media="(min-width:480px)"
            srcSet={`${iceCreamHeaderM}, ${iceCreamHeaderM2x} 2x`} 
          />
          {/* <!-- Fallback image for unsupported browsers --> */}
          <img src={iceCreamHeaderD} alt="Icecream cone" />
        </picture>

        <div className="elipse"></div>

        <div className="header-title">
          <div className="left-header-container">
            <h1>
             Pierino ijs <br />
              made with <br /><span className="passion">passion</span>
            </h1>
            <div className="hero-buttons">
              <a className="link-hero-button hero-btn-red" href="\ijs-bestellen">
                <span className="btn-products">Bestellen</span>
              </a>
              <a className="link-hero-button hero-btn" href="#about">
                <span className="btn-about">Onze werkwijze</span>
              </a>
            </div>

            <div className="milk-header">
              <picture>
                {/* <!-- Desktop --> */}
                <source
                  media="(min-width:1280px)"
                  srcSet={`${milkHeaderD}, ${milkHeaderD2x} 2x`}
                />
                {/* <!-- Tablet --> */}
                <source
                  media="(min-width:768px)"
                  srcSet={`${milkHeaderT}, ${milkHeaderT2x} 2x`}
                />
                {/* <!-- Fallback image for unsupported browsers --> */}
                <img
                  src={milkHeaderD} 
                  className="milk-header-img"
                  alt="bio milk"
                />
              </picture>

              <div className="milk-description">
                <p>
                Geniet van een bolletje ijs gemaakt met passie en trakteer je smaakpapillen op een onvergetelijke ervaring.
                </p>
                <a href="#about">
                  <img
                    src={arrowRight}
                    className="link-how-its-made"
                    alt="arrow right"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="right-header-container">
            <div className="numbers-header">
              <div className="col-md-4">
                <span id="count1" className="big-number"></span>
              </div>
              <span className="small-text"></span>
              <div className="elipse-small"></div>
            </div>
            <div className="numbers-header">
              <div className="col-md-4">
                <span id="count2" className="big-number"></span>
              </div>
              <span className="small-text"></span>
              <div className="elipse-small"></div>
            </div>

            <picture>
              {/* <!-- Desktop --> */}
              <source
                media="(min-width:1280px)"
                srcSet={`${girlIceCreamD}, ${girlIceCreamD2x} 2x`}
              />
              {/* <!-- Tablet --> */}
              <source
                media="(min-width:768px)"
                srcSet={`${girlIceCreamT}, ${girlIceCreamT2x} 2x`}
              />
              {/* <!-- Fallback image for unsupported browsers --> */}
              <img
                src={girlIceCreamD}
                className="girl-icecream"
                alt="soo tasty"
              />
            </picture>
          </div>
        </div>
      </div>
      {/* <!-- modal  --> */}
      <div className="modal-buy is-hidden-buy" data-modal-buy data-modal-mobile-buy>
        <div className="modal-content-buy">
          <button className="close-btn-buy" data-modal-close-buy>
            <svg
              className="close-x"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M15 4.10786L13.8921 3L9.5 7.39214L5.10786 3L4 4.10786L8.39214 8.5L4 12.8921L5.10786 14L9.5 9.60786L13.8921 14L15 12.8921L10.6079 8.5L15 4.10786Z"
                fill="currentcolor"
              />
            </svg>
          </button>
          <form className="form-buy">
            <span className="form-title">
              Leave your order here and maybe we will deliver it
            </span>
            <div className="modal-buy-items">
              <div className="modal-buy-item1">
                <span className="modal-buy-item-name">Ice Cream</span>
                <input
                  className="modal-buy-item-amount"
                  type="number"
                  name="quantity"
                  min="0"
                  max="9"
                  placeholder="0"
                />
              </div>
              <div className="modal-buy-item2">
                <span className="modal-buy-item-name">Coffee</span>
                <input
                  className="modal-buy-item-amount"
                  type="number"
                  name="quantity"
                  min="0"
                  max="9"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-buy-footer">
              <input
                type="email"
                name="email"
                className="form-buy-email"
                placeholder="Email"
              />
              <input
                type="submit"
                className="submit-btn-buy"
                value="Submit"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Hero;
