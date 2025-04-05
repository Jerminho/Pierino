import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import images
import pic1 from "./images/gallery/desktop/one.jpg";
import pic2 from "./images/gallery/desktop/two.jpeg";
import pic3 from "./images/gallery/desktop/three.jpg";
import pic4Big from "./images/gallery/desktop/four.jpg";
import pic5 from "./images/gallery/desktop/five.webp";
import pic6 from "./images/gallery/desktop/six.jpg";
import pic7 from "./images/gallery/desktop/seven.jpg";
import pic8 from "./images/gallery/desktop/eight.jpg";
import pic9 from "./images/gallery/desktop/nine.jpg";
import arrowRight from "./images/icons/arrow-right.png";

import backgroundImage from "../Components/images/bgIceCream.png"; // Background image

// Images array for looping
const images = [
  { src: pic1, alt: "Ice cream in dishes" },
  { src: pic2, alt: "Ice cream in hand" },
  { src: pic3, alt: "Ice cream on stick" },
  { src: pic4Big, alt: "Eight ice cream scoops" },
  { src: pic5, alt: "A girl with ice cream" },
  { src: pic6, alt: "Ice cream in bowl" },
  { src: pic7, alt: "Ice cream in hand" },
  { src: pic8, alt: "A dog eating ice cream" },
  { src: pic9, alt: "Chocolate milkshake" },
];

function Gallery() {
  return (
    <section className="gallery" id="gallery"  style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
      <h2 hidden>Gallery</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Show 1 image at a time
        loop={true}
        navigation={true} // Enable previous/next arrows
        pagination={{ clickable: true }} // Enable pagination dots
        autoplay={{ delay: 3000 }} // Auto-slide every 3 sec
        breakpoints={{
          768: { slidesPerView: 2 }, // Show 2 images on tablets
          1024: { slidesPerView: 3 }, // Show 3 images on desktops
        }}
        className="gallery-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.src}
              alt={image.alt}
              className="gallery-image"
            //   width="300"
            //   height="300"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button type="button" className="fixedbutton" id="btn-back-to-top">
        <img src={arrowRight} alt="arrow up" />
      </button>
    </section>
  );
}

export default Gallery;
