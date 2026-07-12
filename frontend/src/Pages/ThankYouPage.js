import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../Components/images/bgIceCream.png";

function ThankYouPage() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pink-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-white/40"
        aria-hidden="true"
      />

      <section
        className="relative z-10 w-full max-w-lg rounded-3xl border border-pink-200 bg-white/90 px-5 py-8 text-center shadow-2xl backdrop-blur-md sm:px-10 sm:py-12"
        aria-labelledby="thank-you-title"
      >
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600 shadow-sm sm:h-20 sm:w-20 sm:text-4xl"
          aria-hidden="true"
        >
          ✓
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 sm:text-sm">
          Pierino IJs
        </p>

        <h1
          id="thank-you-title"
          className="text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl"
        >
          Bedankt voor uw bericht
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
          Uw bericht werd succesvol verzonden. We hebben uw aanvraag goed
          ontvangen en nemen zo snel mogelijk contact met u op.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:from-pink-400 hover:to-red-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 sm:text-base"
          >
            ← Terug naar de startpagina
          </Link>

          <Link
            to="/smaken-allergenen"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-pink-400 bg-white px-6 py-3 text-sm font-bold text-pink-600 transition duration-200 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 sm:text-base"
          >
            Bekijk onze smaken
          </Link>
        </div>

        <p className="mt-7 text-xs leading-5 text-gray-500 sm:text-sm">
          Heeft u dringend hulp nodig? Neem dan telefonisch contact met ons op
          tijdens de openingsuren.
        </p>
      </section>
    </main>
  );
}

export default ThankYouPage;
