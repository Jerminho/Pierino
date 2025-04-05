import React from "react";
import "./AboutAndAdvantages.css";
// Import images
import cowImageD from "./images/how-is-made-cow-d.png";
import cowImageD2x from "./images/how-is-made-cow-x2-d.png";
import cowImageT from "./images/how-is-made-cow-t.png";
import cowImageT2x from "./images/how-is-made-cow-x2-t.png";
import cowImageM from "./images/how-is-made-cow-m.png";
import cowImageM2x from "./images/how-is-made-cow-x2-m.png";

const AboutAndAdvantages = () => {
    return (
      <section className="about-and-advantages" id="about">
        <div className="content">
          <div className="section-head">
            <p className="first-section-head">Ambachtelijk, authentiek, gepassioneerd</p>
            <h2 className="second-section-head">Zo gemaakt!</h2>
          </div>
          <div className="how-is-made-section">
            <picture>
              <source
                media="(min-width: 1280px)"
                srcSet={`${cowImageD}, ${cowImageD2x} 2x`}
              />
              <source
                media="(min-width: 768px)"
                srcSet={`${cowImageT}, ${cowImageT2x} 2x`}
              />
              <img
                className="how-is-made-cow-anim"
                src={cowImageM}
              srcSet={`${cowImageM2x} 2x`}
                alt="a cow with a coffer of milk"
              />
            </picture>
            <div className="how-is-made-paragraphs-section">
              <div className="how-is-made-paragraphs">
                <p className="p-1">
                 Weer of geen weer, voor Pierino Ijs is het altijd een goed moment. Geen tijd om aan een van onze ijskarretjes te komen ? Bestel nu via onze website!
                </p>
                <p className="p-2">
                Voor ons ambachtelijk ijs gebruiken we al meer dan 30 jaar enkel natuurlijke, verse ingrediënten en vermijden we aroma’s, kleurstoffen en pasta’s.</p>
              </div>
              <button className="about-button">
                <span className="about-text-button">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="10"
                  viewBox="0 0 8 10"
                  fill="none"
                >
                  <path
                    d="M1.61646 1L6.04413 5L1.61646 9"
                    stroke="#D41443"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
  
          <section className="how-is-made-cards">
            <h2 className="hidden">Advantages</h2>
            <ul className="cards-list">
              <li className="milk-card animation-card">
                <h2 className="card-heading">uniek</h2>
                <p className="card-paragraph card-paragraph-1">
                  Ons ijs is 100% ambachtelijk en authentiek. Dat is een deel van ons unieke familierecept.
                </p>
              </li>
              <li className="apple-card animation-card">
                <h2 className="card-heading">Gezond</h2>
                <p className="card-paragraph card-paragraph-2">
                Onze bolletjes ijs barsten van de smaak en zijn bovendien ook nog eens gezond.
                </p>
              </li>
              <li className="icecream-card animation-card">
                <h2 className="card-heading">Events</h2>
                <p className="card-paragraph card-paragraph-3">
                  Leg uw gasten of personeelsleden in de watten met ons Italiaans ijs.
                </p>
              </li>
            </ul>
          </section>
        </div>
      </section>
    );
  };
  
  export default AboutAndAdvantages;