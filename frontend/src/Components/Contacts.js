import React from "react";
import "./Contacts.css"

const Contacts = () => {
    return (
      <section className="contacts-section" id="contacts">
        <h2 className="hidden">Contacts</h2>
        <div className="cards-section">
          {/* Card 1 */}
          <div className="menu-section">
            <div className="image-block">
              <span className="crawler-cafe">CAFE</span>
            </div>
            <span className="city-locations">Chicago</span>
            <p className="details">
              Handcrafted coffee, baked goods, and premium ice cream.
            </p>
            <hr className="sprite-section" />
            <h4 className="weekdays">Monday - Friday</h4>
            <p className="work-program">06:00 AM - 10:00 PM</p>
            <h4 className="weekdays weekends">Saturday - Sunday</h4>
            <p className="work-program">08:00 AM - 16:00 PM</p>
            <hr className="sprite-section" />
            <div className="contact-info">
              <a className="color-fonts" href="tel:+40000000000" aria-label="phone">
                +40 000 000 000
              </a>
              <a
                className="color-fonts"
                href="mailto:iuliapopoaca@yahoo.com"
                aria-label="email"
              >
                iuliapopoaca@yahoo.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="button-section">
          <button type="button" className="submit-btn-top" data-modal-open-location>
            <span className="submit-btn-content-top">
              Our Locations
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="10"
                viewBox="0 0 7 10"
                fill="none"
              >
                <path
                  d="M0.999969 1L4.61032 5L0.999969 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button type="button" className="submit-btn" data-modal-open-franchise>
            <span className="submit-btn-content">
              Franchise
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="10"
                viewBox="0 0 7 10"
                fill="none"
              >
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
      </section>
    );
  };
  
  export default Contacts