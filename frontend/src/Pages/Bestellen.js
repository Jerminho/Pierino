import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const smakenLijst = [
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
  "Guave",
  "Amaretto",
  "Banaan",
  "Amarettini",
  "Citroen",
  "Aardbei",
  "Meloen",
  "Frambozen",
  "Mango",
  "Sinaasappel",
  "Kiwi",
  "Munt (op aanvraag)",
  "Honing (op aanvraag)",
  "Amandel (op aanvraag)",
  "Braambes (op aanvraag)",
  "Duvel (op aanvraag)",
  "Rabarber (op aanvraag)",
  "Watermeloen (op aanvraag)",
  "Kersen (op aanvraag)",
  "Peer (op aanvraag)",
  "Vijgen (op aanvraag)",
  "Papaye (op aanvraag)",
];

const Bestellen = () => {
  const [bestelling, setBestelling] = useState({});
  const [stap, setStap] = useState(1);
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
    0,
  );
  const [afhaallocatie, setAfhaallocatie] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultaat("Versturen...");

    const formData = new FormData();
    formData.append("access_key", "94a756fa-ab63-4ff8-b4b3-2e6bccdfd0cf");
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
    `,
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

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6">
        <div className="text-center pb-6 border-b border-gray-300">
          <h1 className="text-4xl font-bold text-pink-600">IJS BESTELLEN</h1>
        </div>

        <div className="mx-auto w-full max-w-3xl px-4 py-6 text-center sm:px-6 sm:py-8">
          <h2 className="text-2xl font-semibold leading-tight text-gray-700 sm:text-3xl">
            Heel eenvoudig je favoriete Pierino IJs online bestellen
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Koop je ijs online en haal het op in Mariakerke (Gent). Vul het
            formulier in en ontvang een bevestiging per mail.
          </p>

          <p className="mt-4 text-lg font-semibold text-red-600 sm:text-xl">
            Wij draaien het ijs voor u
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className={`h-2 rounded-full bg-pink-500 transition-all duration-500 ${stap === 2 ? "w-full" : "w-1/2"}`}
          ></div>
        </div>

        {stap === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Kies je smaken (1 eenheid = 1 liter)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {smakenLijst.map((smaak) => (
                <div
                  key={smaak}
                  className="flex items-center justify-between border p-3 rounded-lg shadow-sm"
                >
                  <span>{smaak}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => verwijder(smaak)}
                      className="p-2 bg-red-500 text-white rounded disabled:opacity-50"
                      disabled={!bestelling[smaak]}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg font-semibold">
                      {bestelling[smaak] || 0}
                    </span>
                    <button
                      onClick={() => voegToe(smaak)}
                      className="p-2 bg-green-500 text-white rounded"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xl font-bold mt-4">Totaal: €{totaalPrijs}</p>

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
                    onChange={(event) => setAfhaallocatie(event.target.value)}
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
                    onChange={(event) => setAfhaallocatie(event.target.value)}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-red-600 focus:ring-2 focus:ring-red-500"
                  />

                  <div>
                    <span className="font-semibold text-gray-700">
                      Mariakerke
                    </span>

                    <p className="text-sm text-gray-600">
                      Wijmenstraat 2, 9030 Mariakerke <br/>8u - 12u elke dag, of op afspraak.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="afhaallocatie"
                    value="Gratis levering"
                    checked={afhaallocatie === "Gratis levering"}
                    onChange={(event) => setAfhaallocatie(event.target.value)}
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
              onClick={() => setStap(2)}
              className="w-full bg-pink-500 text-white py-2 mt-4 rounded-lg"
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
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setKlantGegevens({ ...klantGegevens, naam: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setKlantGegevens({ ...klantGegevens, email: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Telefoonnummer"
              required
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setKlantGegevens({ ...klantGegevens, telefoon: e.target.value })
              }
            />
            <textarea
              placeholder="Extra opmerkingen"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setKlantGegevens({
                  ...klantGegevens,
                  opmerkingen: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg"
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
