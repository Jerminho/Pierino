import React from "react";
import "./OverOns.css";
import PR from "../Components/images/PR.jpg";
import Aardbeien from "../Components/images/Aardbeien.png";
import GSP from "../Components/images/GSP.jpg";
import Wooden from "../Components/images/wooden.jpg";
import Cup from "../Components/images/cup.jpg";
import Offerice from "../Components/images/offerice.jpg";
import Scoop from "../Components/images/scoop.jpg";
import Wijs1 from "../Components/images/Wijs1.jpg";
import Wijs2 from "../Components/images/Wijs2.jpg";
import Wijs3 from "../Components/images/Wijs3.jpg";
import Wijs4 from "../Components/images/Wijs4.jpg";
import Wijs5 from "../Components/images/Wijs5.jpg";
import Wijs6 from "../Components/images/Wijs6.jpg";
import Blad from "../Components/images/bladicon.png";
import Aardbeiicon from "../Components/images/aardbeiicon.png";
import Iceicon from "../Components/images/iceicon.png";



/**
 * OverOns
 * -------
 * "Over ons" pagina van Pierino IJs.
 * De header/nav is bewust weggelaten: dat component wordt elders (app.js) ingeladen.
 *
 * Afbeeldingen: vervang de src-waarden (foto1.jpg t/m foto15.jpg, foto7.png)
 * door de effectieve bestandsnamen/paden, bv. via een import of een pad naar /public.
 *
 * Styling: Tailwind-classes inline + aanvullende merk-specifieke stijlen in OverOns.css
 * (kleurverlopen, schaduwen, custom knoppen, etc.). De kleuren zijn als Tailwind
 * arbitrary values (bv. text-[#e2222e]) toegepast, zodat er geen aanpassing aan
 * tailwind.config nodig is.
 */
export default function OverOns() {
  return (
    <>
      {/* =====================================================
           INTRO — Meer dan 30 jaar ambachtelijk ijs in Gent
      ====================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className=" ambacht order-2 lg:order-1">
            <h2 className=" font-display font-extrabold text-3xl sm:text-4xl text-[#e2222e] leading-tight mb-6">
              Meer dan 30 jaar
              <br className="hidden sm:block" /> ambachtelijk ijs in Gent.
            </h2>
            <div className="space-y-4  text-base sm:text-lg leading-relaxed">
              <p>
                Het verhaal van Pierino begon met een passie voor écht Italiaans
                ijs. Een passie die Pierino Ruffolo later doorgaf aan zijn zoon
                Dino en die vandaag nog altijd de basis vormt van alles wat we
                doen.
              </p>
              <p>
                Al meer dan 30 jaar maken we dagelijks vers, artisanaal ijs.
                Doorheen de jaren veranderden de ijskarren, kwamen er nieuwe
                smaken bij en groeide Pierino uit tot een vaste waarde in Gent.
                Maar onze overtuiging bleef dezelfde: goed ijs begint bij
                kwaliteitsvolle ingrediënten, vakmanschap en vooral veel liefde
                voor het product.
              </p>
              <p>
                Want uiteindelijk draait het voor ons nog altijd om dat ene
                moment: iemand zien genieten van een écht lekker ijsje.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              src={PR}
              alt="Pierino Ruffolo naast zijn ijskar, vintage foto"
              className="img-frame w-full h-64 sm:h-80 lg:h-96 rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
           QUOTE
      ====================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 py-10 lg:py-16">
        <div className="quote max-w-3xl mx-auto text-center">
          <span className="quote-mark font-display text-6xl sm:text-7xl block mb-2">
            &ldquo;
          </span>
          <p className="quote-text text-xl sm:text-2xl lg:text-3xl leading-snug -mt-6">
            Zolang mijn ijs lekker is, komen de klanten wel bij mij.
          </p>
          <p className="quote-text_author font-display font-semibold text-[#e2222e] mt-5 text-sm sm:text-base tracking-wide">
            — Pierino Ruffolo
          </p>
        </div>
      </section>

      {/* =====================================================
           HOE HET BEGON + fotostrip
      ====================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 py-14 lg:py-20">
        <div className=" ambacht max-w-7xl mx-auto">
          <h3 className="eyebrow text-sm sm:text-base mb-3 text-center lg:text-left">
            Hoe het begon
          </h3>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#e8688f] mb-6 text-center lg:text-left"></h2>
          <div className="max-w-3xl mx-auto lg:mx-0 space-y-4 text-[#6e5457] text-base sm:text-lg leading-relaxed text-center lg:text-left">
            <p>
              Wat begon als een klein familieverhaal groeide uit tot een vaste
              waarde in Gent. Doorheen de jaren veranderde er veel: nieuwe
              smaken, nieuwe generaties klanten en nieuwe locaties. Maar één
              ding bleef altijd hetzelfde: de liefde voor écht Italiaans ijs.
            </p>
            <p>
              Nog altijd maken we ons ijs volgens dezelfde filosofie. We kiezen
              voor kwaliteit boven snelheid en voor pure ingrediënten boven
              goedkope alternatieven.
            </p>
            <p>
              Veel klanten komen ondertussen al jaren langs. Sommigen kwamen
              vroeger als kind een ijsje halen en staan vandaag met hun eigen
              kinderen aan onze ijskar. Dat is misschien wel het mooiste
              compliment dat we kunnen krijgen.
            </p>
          </div>

          {/* Fotostrip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mt-10">
            <img
              src={Offerice}
              alt="Pierino's ijskar door de jaren heen"
              className="img-frame-four w-full h-40 sm:h-52 rounded-2xl shadow-md"
            />
            <img
              src={Wooden}
              alt="Historische foto van de ijskar"
              className="img-frame-four w-full h-40 sm:h-52 rounded-2xl shadow-md"
            />
            <img
              src={Cup}
              alt="Pierino's ijskar op de markt in Gent"
              className="img-frame-four w-full h-40 sm:h-52 rounded-2xl shadow-md"
            />
            <img
              src={Scoop}
              alt="Portret met een Pierino-ijsje"
              className="img-frame-four w-full h-40 sm:h-52 rounded-2xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
           ONZE WAARDEN
      ====================================================== */}
      <section id="waarden" className="px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className=" waarden max-w-7xl mx-auto">
          <h3 className="eyebrow-script text-3xl sm:text-4xl mb-8 text-center lg:text-left">
            Onze waarden
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="value-card rounded-3xl p-8 text-center sm:text-left">
              <div className="value-icon w-14 h-14 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-5">
                <img
                  src={Iceicon}
                  alt="Waarde icoon"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-display font-bold text-xl text-[#e2222e] mb-3">
                Ambacht
              </h3>
              <p className="text-[#6e5457] leading-relaxed">
                Ons ijs wordt dagelijks vers bereid. De ingrediënten waarmee we
                werken, zijn nooit exact hetzelfde. En dus is ons ijs dat ook
                niet. Elk bolletje heeft zijn eigen unieke smaak.
              </p>
            </div>

            <div className="value-card rounded-3xl p-8 text-center sm:text-left">
              <div className="value-icon w-14 h-14 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-5">
                <img
                  src={Aardbeiicon}
                  alt="Waarde icoon"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-display font-bold text-xl text-[#e2222e] mb-3">
                Echte ingrediënten
              </h3>
              <p className="text-[#6e5457] leading-relaxed">
                Waar mogelijk werken we met vers fruit, echte noten, kruiden en
                kwaliteitsvolle grondstoffen. Je proeft wat erin zit, zonder
                overbodige toevoegingen.
              </p>
            </div>

            <div className="value-card rounded-3xl p-8 text-center sm:text-left">
              <div className="value-icon w-14 h-14 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-5">
                <img
                  src={Blad}
                  alt="Waarde icoon"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-display font-bold text-xl text-[#e2222e] mb-3">
                Voor iedereen
              </h3>
              <p className="text-[#6e5457] leading-relaxed">
                Iedereen verdient een lekker ijsje. Daarom bieden we een ruim
                assortiment vegan sorbets aan. Zo kunnen ook mensen met
                specifieke voedingsvoorkeuren of intoleranties volop genieten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           BEWUST KIEZEN VOOR PURE SMAKEN
      ====================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <img
              src={Aardbeien}
              alt="Verse aardbeien in houten kratjes"
              className="img-frame-four w-full h-64 sm:h-80 lg:h-[26rem] rounded-3xl shadow-xl"
            />
            <div className="kcal-badge absolute -top-6 -right-4 sm:right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center leading-tight">
              <span className="text-lg sm:text-xl font-extrabold">
                *70 kcal
              </span>
              <span className="text-[10px] sm:text-xs">per bolletje</span>
            </div>
          </div>

          <div className="bewust">
            <h2 className=" font-display font-extrabold text-3xl sm:text-4xl text-[#e2222e] leading-tight mb-6">
              Bewust kiezen voor
              <br className="hidden sm:block" /> pure smaken
            </h2>
            <div className="ambacht space-y-4 text-[#6e5457] text-base sm:text-lg leading-relaxed">
              <p>
                Bij Pierino geloven we dat goed ijs niet ingewikkeld hoeft te
                zijn. Daarom kiezen we er bewust voor om ons ijs zo puur
                mogelijk te houden. We gebruiken geen glucose, inuline of
                kunstmatige aroma's, maar laten kwaliteitsvolle ingrediënten
                voor zichzelf spreken.
              </p>
              <p>
                Ons ijs wordt artisanaal gemaakt met de ingrediënten die op dat
                moment beschikbaar zijn. Een aardbei smaakt nu eenmaal niet elke
                dag exact hetzelfde en ons aardbeienijs dus ook niet. De smaak
                kan van seizoen tot seizoen subtiel verschillen. Net daarin zit
                voor ons de charme van écht ambachtelijk ijs.
              </p>
              <p>
                Die keuze maken we al jaren, en daar staan we vandaag nog steeds
                achter. Het resultaat? IJs met een pure smaak dat verrassend
                licht kan zijn. Een bolletje Pierino-ijs bevat gemiddeld
                ongeveer 70 calorieën.*
              </p>
            </div>
            <p className="text-xs text-[#6e5457]/70 mt-4">
              *Het exacte aantal calorieën kan variëren naargelang de smaak.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
           "Voor ons proef je goed ijs..." tussenblok
      ====================================================== */}
      <section className="bewust-b px-6 sm:px-10 lg:px-20 pb-14 lg:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6e5457] text-base sm:text-lg leading-relaxed">
            Voor ons proef je goed ijs niet alleen bij de eerste hap. Het is een
            ijsje dat licht aanvoelt en niet zwaar op de maag ligt. De smaak
            blijft aangenaam hangen, zonder dat je er een droge mond van krijgt.
            Een ijsje waarvan je rustig kunt blijven genieten. En wanneer het op
            is? Dan heb je eigenlijk vooral zin in nog een bolletje.
          </p>
        </div>
      </section>

      {/* =====================================================
           PIERINO VANDAAG
      ====================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 py-14 lg:py-20">
        <div className="vandaag max-w-7xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#e2222e] mb-10 text-center lg:text-left">
            Pierino vandaag
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-10 lg:gap-14 items-start">
            {/* Lijst */}
            <ul className="space-y-8">
              <li className="flex gap-4">
                <span className="today-icon w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 12 3.5 6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#3a2a2c] mb-1">
                    Onze vaste locaties
                  </h3>
                  <p className="text-[#6e5457]">
                    Korenmarkt · Het Zuid · Gent-Sint-Pieters
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="today-icon w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10.5 12 4l9 6.5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 9.5V20h14V9.5"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#3a2a2c] mb-1">
                    IJs voor thuis
                  </h3>
                  <p className="text-[#6e5457]">
                    Bestel je favoriete smaken per liter.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="today-icon w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <rect x="3.5" y="5" width="17" height="15" rx="2" />
                    <path strokeLinecap="round" d="M3.5 9.5h17M8 3v3M16 3v3" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#3a2a2c] mb-1">
                    Events &amp; feesten
                  </h3>
                  <p className="text-[#6e5457]">
                    Pierino komt met de ijskar tot bij jou.
                  </p>
                </div>
              </li>
            </ul>

            {/* Groene banner + fotogrid */}
            <div className="green-banner rounded-[2rem] p-6 sm:p-8">
              <p className="font-display font-extrabold text-white text-xl sm:text-2xl text-center mb-6"></p>
              <div className="photo-grid grid grid-cols-3 gap-3 sm:gap-3">
                <img
                  src={Wijs1}
                  alt="Klanten genieten van Pierino-ijs"
                  className="w-full rounded-xl"
                />
                <img
                  src={Wijs2}
                  alt="Pierino op een zomerevent"
                  className="w-full rounded-xl"
                />
                <img
                  src={Wijs3}
                  alt="IJsje van Pierino close-up"
                  className="w-full rounded-xl"
                />
                <img
                  src={Wijs4}
                  alt="Pierino-ijskar bij een feest"
                  className="w-full rounded-xl"
                />
                <img
                  src={Wijs5}
                  alt="Bezoekers aan de ijskar"
                  className="w-full rounded-xl"
                />
                <img
                  src={Wijs6}
                  alt="Team Pierino aan het werk"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left mt-10">
            <a href="\smaken-allergenen" className="link-dashed">
              Ontdek onze smaken
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
           SLOTBANNER
      ====================================================== */}
      <section id="contact" className="px-6 sm:px-10 lg:px-20 pb-16 lg:pb-24">
        <div className="relative max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img
            src={GSP}
            alt="Pierino's ijskar geparkeerd in een groene buurt"
            className="img-frame-four w-full h-64 sm:h-80 lg:h-[28rem]"
          />
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
            <span className="final-tag inline-block px-5 py-2 rounded-full text-lg sm:text-xl -rotate-2">
              Tot binnenkort?
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
