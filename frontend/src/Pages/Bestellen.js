import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const smakenLijst = [
  "Vanille", "Chocolade", "Stracciatella", "Hazelnoot", "Pistache", "Kokosnoot",
  "Mokka", "Speculoos", "Yoghurt", "Amaretto", "Banaan", "Munt", "Honing",
  "Amarettini", "Amandel", "Citroen", "Aardbei", "Meloen", "Braambessen",
  "Frambozen", "Mango", "Sinaasappel", "Kiwi", "Duvel (op aanvraag)",
  "Rabarber (beperkte periode)", "Ananas", "Watermeloen (beperkte periode)",
  "Kersen (beperkte periode)", "Peer (beperkte periode)", "Vijgen (beperkte periode)"
];

const Bestellen = () => {
  const [bestelling, setBestelling] = useState({});
  const [stap, setStap] = useState(1);
  const [klantGegevens, setKlantGegevens] = useState({
    naam: "", email: "", telefoon: "", opmerkingen: "",
  });
  const [resultaat, setResultaat] = useState("");
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

  const totaalPrijs = Object.values(bestelling).reduce((acc, cur) => acc + cur * prijsPerLiter, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultaat("Versturen...");

    const formData = new FormData();
    formData.append("access_key", "8661fa52-27ac-4ad7-9c82-459d860bdf53");
    formData.append("recipient", "info@pierinoijs.be");

    const bestellingTekst = Object.entries(bestelling)
      .map(([smaak, aantal]) => `${smaak}: ${aantal}L`)
      .join(", ");

    formData.append("bericht", `
      Bestelling details:
      ${bestellingTekst}
      Totaalprijs: €${totaalPrijs}
      
      Klantgegevens:
      Naam: ${klantGegevens.naam}
      Email: ${klantGegevens.email}
      Telefoon: ${klantGegevens.telefoon}
      Opmerkingen: ${klantGegevens.opmerkingen}
    `);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultaat("Bestelling succesvol geplaatst! Je ontvangt een bevestiging per SMS.");
        setTimeout(() => {
          setResultaat("");
          navigate("/");
        }, 4000);
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

        <div className="text-center py-6">
          <h2 className="text-2xl font-semibold text-gray-700">Heel eenvoudig je favoriete Pierino IJs online bestellen</h2>
          <p className="text-gray-600 mt-2">
            Koop je ijs online en haal het op in Mariakerke (Gent). Vul het formulier in en ontvang een bevestiging per sms.
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className={`h-2 rounded-full bg-pink-500 transition-all duration-500 ${stap === 2 ? "w-full" : "w-1/2"}`}></div>
        </div>

        {stap === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Kies je smaken (1 eenheid = 1 liter)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {smakenLijst.map((smaak) => (
                <div key={smaak} className="flex items-center justify-between border p-3 rounded-lg shadow-sm">
                  <span>{smaak}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => verwijder(smaak)} className="p-2 bg-red-500 text-white rounded disabled:opacity-50" disabled={!bestelling[smaak]}>
                      <FaMinus />
                    </button>
                    <span className="text-lg font-semibold">{bestelling[smaak] || 0}</span>
                    <button onClick={() => voegToe(smaak)} className="p-2 bg-green-500 text-white rounded">
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xl font-bold mt-4">Totaal: €{totaalPrijs}</p>
            <button onClick={() => setStap(2)} className="w-full bg-pink-500 text-white py-2 mt-4 rounded-lg">Volgende</button>
          </div>
        )}

        {stap === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Jouw gegevens</h2>
            <input type="text" placeholder="Naam" required className="w-full p-2 border rounded" onChange={(e) => setKlantGegevens({ ...klantGegevens, naam: e.target.value })} />
            <input type="email" placeholder="E-mail" required className="w-full p-2 border rounded" onChange={(e) => setKlantGegevens({ ...klantGegevens, email: e.target.value })} />
            <input type="tel" placeholder="Telefoonnummer" required className="w-full p-2 border rounded" onChange={(e) => setKlantGegevens({ ...klantGegevens, telefoon: e.target.value })} />
            <textarea placeholder="Extra opmerkingen" className="w-full p-2 border rounded" onChange={(e) => setKlantGegevens({ ...klantGegevens, opmerkingen: e.target.value })} />
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg">Bestelling plaatsen</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Bestellen;
