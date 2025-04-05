import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaBuilding, FaCreditCard } from "react-icons/fa";
import "../Components/Privacypage.css";

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <h1>Privacybeleid</h1>
      <p>
        Wij zijn er van bewust dat u vertrouwen stelt in ons. Wij zien het dan ook als onze verantwoordelijkheid om uw privacy te beschermen. Op deze pagina laten we u weten welke gegevens we verzamelen als u onze website gebruikt, waarom we deze gegevens verzamelen en hoe we hiermee uw gebruikservaring verbeteren. Zo snapt u precies hoe wij werken.
      </p>

      <section>
        <h2>Ons gebruik van verzamelde gegevens</h2>
        <h3>Gebruik van onze diensten</h3>
        <p>
          Wanneer u zich aanmeldt voor een van onze diensten vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om de dienst uit te kunnen voeren. De gegevens worden opgeslagen op eigen beveiligde servers van Pierino of die van een derde partij. Wij zullen deze gegevens niet combineren met andere persoonlijke gegevens waarover wij beschikken.
        </p>
        <h3>Communicatie</h3>
        <p>
          Wanneer u e-mail of andere berichten naar ons verzendt, is het mogelijk dat we die berichten bewaren. Soms vragen wij u naar uw persoonlijke gegevens die voor de desbetreffende situatie relevant zijn. Dit maakt het mogelijk uw vragen te verwerken en uw verzoeken te beantwoorden. De gegevens worden opgeslagen op eigen beveiligde servers van Pierino of die van een derde partij. Wij zullen deze gegevens niet combineren met andere persoonlijke gegevens waarover wij beschikken.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Wij verzamelen gegevens voor onderzoek om zo een beter inzicht te krijgen in onze klanten, zodat wij onze diensten hierop kunnen afstemmen.
        </p>
        <p>
          Deze website maakt gebruik van “cookies” (tekstbestandjes die op uw computer worden geplaatst) om de website te helpen analyseren hoe gebruikers de site gebruiken. De door het cookie gegenereerde informatie over uw gebruik van de website kan worden overgebracht naar eigen beveiligde servers van Pierino of die van een derde partij. Wij gebruiken deze informatie om bij te houden hoe u de website gebruikt, om rapporten over de website-activiteit op te stellen en andere diensten aan te bieden met betrekking tot website-activiteit en internetgebruik.
        </p>
      </section>

      <section>
        <h2>Derden</h2>
        <p>
          De informatie wordt niet met derden gedeeld. In enkele gevallen kan de informatie intern gedeeld worden. Onze werknemers zijn verplicht om de vertrouwelijkheid van uw gegevens te respecteren.
        </p>
      </section>

      <section>
        <h2>Veranderingen</h2>
        <p>
          Deze privacyverklaring is afgestemd op het gebruik van en de mogelijkheden op deze site. Eventuele aanpassingen en/of veranderingen van deze site, kunnen leiden tot wijzigingen in deze privacyverklaring. Het is daarom raadzaam om regelmatig deze privacyverklaring te raadplegen.
        </p>
      </section>

      <section>
        <h2>Keuzes voor persoonsgegevens</h2>
        <p>
          Wij bieden alle bezoekers de mogelijkheid tot het inzien, veranderen, of verwijderen van alle persoonlijke informatie die op moment aan ons is verstrekt.
        </p>
      </section>

      <section>
        <h2>Aanpassen/uitschrijven communicatie</h2>
        <p>
          Als u uw gegevens aan wilt passen of uzelf uit onze bestanden wilt laten halen, kunt u contact met ons op nemen. Zie onderstaande contactgegevens.
        </p>
      </section>

      <section>
        <h2>Cookies uitzetten</h2>
        <p>
          De meeste browsers zijn standaard ingesteld om cookies te accepteren, maar u kunt uw browser opnieuw instellen om alle cookies te weigeren of om aan te geven wanneer een cookie wordt verzonden. Het is echter mogelijk dat sommige functies en services, op onze en andere websites, niet correct functioneren als cookies zijn uitgeschakeld in uw browser.
        </p>
      </section>

      <section>
        <h2>Vragen en feedback</h2>
        <p>
          We controleren regelmatig of we aan dit privacybeleid voldoen. Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen:
        </p>
        <p><FaMapMarkerAlt /> Wijmenstraat 2 – 9030 Mariakerke</p>
        <p><FaEnvelope /> <a href="mailto:info@pierinoijs.be">info@pierinoijs.be</a></p>
        <p><FaBuilding /> BE0806298642</p>
        <p><FaCreditCard /> BE40 3631 0095 9963</p>
      </section>
    </div>
  );
};

export default PrivacyPage;
