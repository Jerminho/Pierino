import React, { useState } from "react";
import { FaPlus, FaMinus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const vastAssortiment = [
  "Vanille",
  "Chocolade",
  "Stracciatella",
  "Hazelnoot",
  "Pistache",
  "Kokosnoot",
  "Passievrucht",
  "Mokka",
  "Speculoos",
  "Yoghurt",
  "Ananas",
  "Banaan",
  "Cuberdon",
  "Rum Rozijn",
  "Citroen",
  "Aardbei",
  "Meloen",
  "Mango",
  "Sinaasappel",
  "Kiwi",
  "Kiwi-Aardbei",
  "Yoghurt-Aardbei",
  "Bosbes",
];

const opAanvraag = [
  "Amaretto",
  "Amarena",
  "Amarettini",
  "Munt",
  "Honing",
  "Amandel",
  "Framboos",
  "Braambes",
  "Duvel",
  "Rabarber",
  "Watermeloen",
  "Kersen",
  "Peer",
  "Vijgen",
  "Guave",
  "Papaya",
];

const Bestellen = () => {
  const [bestelling, setBestelling] = useState({});
  const [stap, setStap] = useState(1);

  const [toonMeerVast, setToonMeerVast] = useState(false);
  const [toonMeerAanvraag, setToonMeerAanvraag] = useState(false);

  const [klantGegevens, setKlantGegevens] = useState({
    naam: "",
    email: "",
    telefoon: "",
    opmerkingen: "",
  });

  const [, setResultaat] = useState("");
  const navigate = useNavigate();

  const prijsPerLiter = 15;

  const voegToe = (smaak) => {
    setBestelling((prev) => ({
      ...prev,
      [smaak]: (prev[smaak] || 0) + 1,
    }));
  };

  const verwijder = (smaak) => {
    setBestelling((prev) => {
      if (prev[smaak] > 1) {
        return { ...prev, [smaak]: prev[smaak] - 1 };
      } else {
        const { [smaak]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const totaalPrijs = Object.values(bestelling).reduce(
    (acc, cur) => acc + cur * prijsPerLiter,
    0
  );

  const [afhaallocatie, setAfhaallocatie] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultaat("Versturen...");

    const formData = new FormData();

    formData.append(
      "access_key",
      "94a756fa-ab63-4ff8-b4b3-2e6bccdfd0cf"
    );

    formData.append("recipient", "info@pierinoijs.be");

    const bestellingTekst = Object.entries(bestelling)
      .map(([smaak, aantal]) => `${smaak}: ${aantal}L`)
      .join(", ");

    formData.append(
      "bericht",
      `
Bestelling details:
${bestellingTekst}
Totaalprijs: €${totaalPrijs}

Afhaallocatie:
${afhaallocatie}

Klantgegevens:
Naam: ${klantGegevens.naam}
Email: ${klantGegevens.email}
Telefoon: ${klantGegevens.telefoon}
Opmerkingen: ${klantGegevens.opmerkingen}
`
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultaat("");

        setBestelling({});

        setKlantGegevens({
          naam: "",
          email: "",
          telefoon: "",
          opmerkingen: "",
        });

        navigate("/thank-you");
      } else {
        setResultaat("Er is een fout opgetreden, probeer opnieuw.");
      }
    } catch (error) {
      setResultaat("Fout bij het verzenden, probeer opnieuw.");
    }
  };

  // Hoeveel smaken standaard zichtbaar zijn
  const aantalZichtbareSmaken = 9;

  const zichtbareVasteSmaken = toonMeerVast
    ? vastAssortiment
    : vastAssortiment.slice(0, aantalZichtbareSmaken);

  const zichtbareAanvraagSmaken = toonMeerAanvraag
    ? opAanvraag
    : opAanvraag.slice(0, aantalZichtbareSmaken);

  // Herbruikbare component voor een smaak
  const SmaakKaart = ({ smaak }) => (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4">
      <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 sm:text-base">
        {smaak}
      </span>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => verwijder(smaak)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
          disabled={!bestelling[smaak]}
          aria-label={`${smaak} verminderen`}
        >
          <FaMinus className="text-xs sm:text-sm" />
        </button>

        <span className="w-6 text-center text-base font-semibold text-gray-800 sm:text-lg">
          {bestelling[smaak] || 0}
        </span>

        <button
          type="button"
          onClick={() => voegToe(smaak)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600 sm:h-10 sm:w-10"
          aria-label={`${smaak} toevoegen`}
        >
          <FaPlus className="text-xs sm:text-sm" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-100 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <div className="border-b border-gray-300 pb-5 text-center sm:pb-6">
          <h1 className="text-3xl font-bold text-pink-600 sm:text-4xl">
            IJS BESTELLEN
          </h1>
        </div>

        <div className="mx-auto w-full max-w-3xl px-1 py-5 text-center sm:px-6 sm:py-8">
          <h2 className="text-xl font-semibold leading-tight text-gray-700 sm:text-3xl">
            Heel eenvoudig je favoriete Pierino IJs online bestellen
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Koop je ijs online en haal het op in één van onze locaties
            hieronder. <br className="hidden sm:block" />
            Vul het formulier in en ontvang een bevestiging per mail.
          </p>

          <p className="mt-4 text-lg font-semibold text-red-600 sm:text-xl">
            Wij draaien het ijs voor u
          </p>
        </div>

        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full bg-pink-500 transition-all duration-500 ${
              stap === 2 ? "w-full" : "w-1/2"
            }`}
          />
        </div>

        {stap === 1 && (
          <div>
            <h2 className="mb-5 text-lg font-semibold text-gray-800 sm:text-xl">
              Kies je smaken{" "}
              <span className="font-normal text-gray-500">
                (1 eenheid = 1 liter)
              </span>
            </h2>

            {/* =========================
                VAST ASSORTIMENT
            ========================== */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-pink-500" />

                <div>
                  <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                    Vast assortiment
                  </h3>

                  <p className="text-xs text-gray-500 sm:text-sm">
                    Onze vaste smaken
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {zichtbareVasteSmaken.map((smaak) => (
                  <SmaakKaart key={smaak} smaak={smaak} />
                ))}
              </div>

              {vastAssortiment.length > aantalZichtbareSmaken && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setToonMeerVast(!toonMeerVast)}
                    className="flex items-center gap-2 rounded-lg border border-pink-300 bg-pink-50 px-5 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100 sm:text-base"
                  >
                    {toonMeerVast ? (
                      <>
                        Toon minder
                        <FaChevronUp className="text-xs" />
                      </>
                    ) : (
                      <>
                        Toon meer
                        <FaChevronDown className="text-xs" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* =========================
                OP AANVRAAG
            ========================== */}
            <section className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gray-400" />

                <div>
                  <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                    Op aanvraag
                  </h3>

                  <p className="text-xs text-gray-500 sm:text-sm">
                    Deze smaken zijn enkel op aanvraag beschikbaar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {zichtbareAanvraagSmaken.map((smaak) => (
                  <SmaakKaart key={smaak} smaak={smaak} />
                ))}
              </div>

              {opAanvraag.length > aantalZichtbareSmaken && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setToonMeerAanvraag(!toonMeerAanvraag)
                    }
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:text-base"
                  >
                    {toonMeerAanvraag ? (
                      <>
                        Toon minder
                        <FaChevronUp className="text-xs" />
                      </>
                    ) : (
                      <>
                        Toon meer
                        <FaChevronDown className="text-xs" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* TOTAAL */}
            <div className="mt-6 rounded-lg bg-pink-50 p-4 text-center">
              <p className="text-lg font-bold text-gray-800 sm:text-xl">
                Totaal: €{totaalPrijs}
              </p>
            </div>

            {/* AFHALEN */}
            <div className="mx-auto mt-6 max-w-xl text-left">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Waar afhalen?
              </h3>

              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="afhaallocatie"
                    value="Het Zuid"
                    checked={afhaallocatie === "Het Zuid"}
                    onChange={(event) =>
                      setAfhaallocatie(event.target.value)
                    }
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-red-600 focus:ring-2 focus:ring-red-500"
                    required
                  />

                  <div>
                    <span className="font-semibold text-gray-700">
                      Het Zuid
                    </span>

                    <p className="text-sm text-gray-600">
                      Afhalen van 13u - 19u bij goed weer.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="afhaallocatie"
                    value="Mariakerke"
                    checked={afhaallocatie === "Mariakerke"}
                    onChange={(event) =>
                      setAfhaallocatie(event.target.value)
                    }
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-red-600 focus:ring-2 focus:ring-red-500"
                  />

                  <div>
                    <span className="font-semibold text-gray-700">
                      Mariakerke
                    </span>

                    <p className="text-sm text-gray-600">
                      Wijmenstraat 2, 9030 Mariakerke
                      <br />
                      8u - 12u elke dag, of op afspraak.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="afhaallocatie"
                    value="Gratis levering"
                    checked={afhaallocatie === "Gratis levering"}
                    onChange={(event) =>
                      setAfhaallocatie(event.target.value)
                    }
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-red-600 focus:ring-2 focus:ring-red-500"
                  />

                  <div>
                    <span className="font-semibold text-gray-700">
                      Gratis levering
                    </span>

                    <p className="text-sm text-gray-600">
                      In Mariakerke, Wondelgem en Lovendegem wordt gratis
                      geleverd vanaf 2 potten.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStap(2)}
              className="mt-5 w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
            >
              Volgende
            </button>
          </div>
        )}

        {stap === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Jouw gegevens</h2>

            <input
              type="text"
              placeholder="Naam"
              required
              className="w-full rounded border p-3"
              onChange={(e) =>
                setKlantGegevens({
                  ...klantGegevens,
                  naam: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              required
              className="w-full rounded border p-3"
              onChange={(e) =>
                setKlantGegevens({
                  ...klantGegevens,
                  email: e.target.value,
                })
              }
            />

            <input
              type="tel"
              placeholder="Telefoonnummer"
              required
              className="w-full rounded border p-3"
              onChange={(e) =>
                setKlantGegevens({
                  ...klantGegevens,
                  telefoon: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Extra opmerkingen"
              className="w-full rounded border p-3"
              rows="4"
              onChange={(e) =>
                setKlantGegevens({
                  ...klantGegevens,
                  opmerkingen: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              Bestelling plaatsen
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Bestellen;