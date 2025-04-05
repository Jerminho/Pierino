import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../Components/images/bgIceCream.png"; // Background image

function ContactPage() {
  const [result, setResult] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    formData.append("access_key", "8661fa52-27ac-4ad7-9c82-459d860bdf53");
    formData.append("recipient", "info@pierinoijs.be");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("");
        event.target.reset();
        navigate("/thank-you");
      } else {
        setResult("An error occurred. Please try again later.");
        console.error("Submission error:", data);
      }
    } catch (error) {
      setResult("An error occurred. Please try again later.");
      console.error("Submission error:", error);
    }
  };

  return (
    
    <div
      className="flex flex-col min-h-screen justify-between relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-col items-center justify-center flex-grow text-center relative z-20 p-6">
        <div className="relative z-20 p-5 text-white bg-pink-400 bg-opacity-50 rounded-xl mx-2 sm:mx-4 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Contacteer ons
          </h1>

          <p className="text-base sm:text-lg text-white mb-6">
          Neem gerust contact met ons op via de onderstaande gegevens en we helpen je met plezier verder.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col space-y-4 w-full max-w-md mx-auto border border-pink-400 rounded-lg p-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Uw Name"
              className="p-3 bg-white text-pink-700 placeholder-pink-400 rounded outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Uw Email"
              className="p-3 bg-white text-pink-700 placeholder-pink-400 rounded outline-none"
              required
            />
            <textarea
              name="message"
              placeholder="Uw bericht"
              rows="5"
              className="p-3 bg-white text-pink-700 placeholder-pink-400 rounded outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-300 hover:to-red-300 text-white font-bold py-2 px-4 rounded"
            >
              Verzenden
            </button>
            {result && (
              <p className="text-center text-sm text-white mt-4">{result}</p>
            )}
          </form>

          <div className="mt-6">
            <Link to="/" className="text-white hover:text-pink-200">
              ← Startpagina
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactPage;

