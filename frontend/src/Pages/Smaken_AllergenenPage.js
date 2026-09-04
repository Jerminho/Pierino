import React, { useMemo, useState } from "react";
import "../Components/Smaken_Allergenen.css";

const GELATO = [
  {
    name: "Vanille",
    description:
      "Een tijdloze klassieker, bereid met echte vanillestokken uit Madagaskar. Deze zorgen voor een zachte en verfijnde smaak.",
    descriptionEn:
      "A timeless classic, prepared with real vanilla pods from Madagascar, providing a smooth and refined taste.",
    allergens: ["melk","ei"],
  },
  {
    name: "Chocolade",
    description:
      "Voor chocoladeliefhebbers: een intense cacaosmaak die lang blijft nazinderen.",
    descriptionEn:
      "For chocolate lovers: an intense cocoa flavor that lingers long after.",
    allergens: ["melk"],
  },
  {
    name: "Stracciatella",
    description:
      "Zacht vanille-ijs met fijne stukjes Belgische pure chocolade die zorgen voor een heerlijke crunch.",
    descriptionEn:
      "Soft vanilla ice cream with fine pieces of Belgian dark chocolate that provide a delicious crunch.",
    allergens: ["melk"],
  },
  {
    name: "Hazelnoot",
    description:
      "Geroosterde hazelnoten zorgen voor een volle, nootachtige smaak.",
    descriptionEn:
      "Roasted hazelnuts provide a full, nutty flavor.",
    allergens: ["melk", "noten"],
  },
  {
    name: "Pistache",
    description:
      "Gemaakt met echte pistachenoten uit Italië, waardoor de subtiele nootachtige smaak volledig tot zijn recht komt.",
    descriptionEn:
      "Made with real pistachios from Italy, bringing out their subtle nutty flavor completely.",
    allergens: ["melk", "noten"],
  },
  {
    name: "Kokosnoot",
    description:
      "De zachte en exotische smaak van kokos brengt je even naar tropische oorden.",
    descriptionEn:
      "The soft and exotic taste of coconut briefly transports you to tropical realms.",
    allergens: ["melk"],
  },
  {
    name: "Mokka",
    description:
      "Voor de echte koffieliefhebbers geven we de volle smaak van koffie, perfect in balans met de zachtheid van room.",
    descriptionEn:
      "For true coffee lovers, we deliver the full flavor of coffee, perfectly balanced with the softness of cream.",
    allergens: ["melk"],
  },
  {
    name: "Speculoos",
    description:
      "Belgische speculoos zorgt voor een warme, kruidige smaak die meteen vertrouwd aanvoelt.",
    descriptionEn:
      "Belgian speculoos provides a warm, spicy flavor that instantly feels familiar.",
    allergens: ["melk", "gluten"],
  },
  {
    name: "Yoghurt",
    description:
      "Een frisse smaak met het lichtzurige karakter van echte yoghurt.",
    descriptionEn:
      "A fresh flavor with the slightly sour character of real yogurt.",
    allergens: ["melk"],
  },
  {
    name: "Yoghurt-Aardbei",
    description:
      "De frisse smaak van yoghurt gecombineerd met de natuurlijke zoetheid van aardbeien.",
    descriptionEn:
      "The fresh taste of yogurt combined with the natural sweetness of strawberries.",
    allergens: ["melk"],
  },
  {
    name: "Amaretto",
    description:
      "Een zachte amandelsmaak met de verfijnde toetsen van Italiaanse amaretto.",
    descriptionEn:
      "A soft almond flavor with the refined notes of Italian amaretto.",
    allergens: ["noten"],
  },
  {
    name: "Amarettini",
    description:
      "Krokante amarettikoekjes geven dit gelato een subtiele amandelsmaak.",
    descriptionEn:
      "Crunchy amaretti cookies give this gelato a subtle almond flavor.",
    allergens: ["melk", "ei", "gluten", "noten"],
  },
  {
    name: "Amarena",
    description:
      "Zoete amarena kersen geven deze smaak een fruitige zoete toets en een heerlijk contrast met het gelato.",
    descriptionEn:
      "Sweet amarena cherries give this flavor a fruity, sweet touch and a wonderful contrast with the gelato.",
    allergens: ["melk"],
  },
  {
    name: "Banaan",
    description: "De volle smaak van rijpe bananen, eenvoudig en puur.",
    descriptionEn: "The full flavor of ripe bananas, simple and pure.",
    allergens: ["melk"],
  },
  {
    name: "Munt",
    description:
      "Verfrissend muntijs met een zachte kruidige toets. Perfect voor de zomer.",
    descriptionEn:
      "Refreshing mint ice cream with a soft herbal touch. Perfect for summer.",
    allergens: ["melk"],
  },
  {
    name: "Honing",
    description:
      "De zachte, bloemige smaak van honing zorgt voor een subtiel zoete toets.",
    descriptionEn:
      "The soft, floral taste of honey provides a subtly sweet touch.",
    allergens: ["melk"],
  },
  {
    name: "Amandel",
    description: "Romig ijs met geroosterde amandelen.",
    descriptionEn: "Creamy ice cream with roasted almonds.",
    allergens: ["melk", "noten"],
  },
];

const SORBET = [
  {
    name: "Citroen",
    description:
      "Levendig, fris en boordevol citrustoetsen, of met andere woorden: de perfecte verfrissende sorbet.",
    descriptionEn:
      "Vibrant, fresh, and full of citrus notes—in other words: the perfect refreshing sorbet.",
    allergens: [],
  },
  {
    name: "Aardbei",
    description: "Sorbet gemaakt met heerlijke zomerse aardbeien.",
    descriptionEn: "Sorbet made with delicious summer strawberries.",
    allergens: [],
  },
  {
    name: "Meloen",
    description: "Frisse sorbet die je doet denken aan een warme zomerdag.",
    descriptionEn: "Fresh sorbet that reminds you of a warm summer day.",
    allergens: [],
  },
  {
    name: "Braambes",
    description:
      "Een mooie balans tussen zoet en licht zuur, typisch voor braambessen.",
    descriptionEn:
      "A nice balance between sweet and slightly tart, typical of blackberries.",
    allergens: [],
  },
  {
    name: "Bosbes",
    description: "Een fruitige sorbet met de volle smaak van bosbessen.",
    descriptionEn: "A fruity sorbet with the full flavor of blueberries.",
    allergens: [],
  },
  {
    name: "Framboos",
    description: "Een intense frambozensorbet met frisse en lichtzure toetsen.",
    descriptionEn: "An intense raspberry sorbet with fresh and slightly tart notes.",
    allergens: [],
  },
  {
    name: "Mango",
    description: "Tropische mangosorbet boordevol fruit en exotische smaak.",
    descriptionEn: "Tropical mango sorbet packed with fruit and exotic flavor.",
    allergens: [],
  },
  {
    name: "Sinaasappel",
    description: "Frisse sinaasappelsorbet met een natuurlijke citruskick.",
    descriptionEn: "Fresh orange sorbet with a natural citrus kick.",
    allergens: [],
  },
  {
    name: "Kiwi",
    description: "Verfrissende kiwisorbet met een lichtzure toets.",
    descriptionEn: "Refreshing kiwi sorbet with a slightly tart touch.",
    allergens: [],
  },
  {
    name: "Duvel",
    description:
      "Een verrassende sorbet waarin de kenmerkende smaak van Duvel mooi tot zijn recht komt.",
    descriptionEn:
      "A surprising sorbet in which the signature taste of Duvel comes into its own.",
    allergens: ["gluten"],
  },
  {
    name: "Rabarber",
    description:
      "Frisse sorbet met het typische samenspel van frisse zuren en zachte zoetheid.",
    descriptionEn:
      "Fresh sorbet featuring the typical interplay of crisp acids and soft sweetness.",
    allergens: [],
  },
  {
    name: "Ananas",
    description:
      "Tropische sorbet gemaakt met sappige ananas. Smaakt meteen naar de zon.",
    descriptionEn:
      "Tropical sorbet made with juicy pineapple. Tastes like sunshine instantly.",
    allergens: [],
  },
  {
    name: "Watermeloen",
    description: "Lichte en verfrissende watermeloensorbet.",
    descriptionEn: "Light and refreshing watermelon sorbet.",
    allergens: [],
  },
  {
    name: "Kersen",
    description: "Fruitige kersensorbet met een licht zoete nasmaak.",
    descriptionEn: "Fruity cherry sorbet with a slightly sweet aftertaste.",
    allergens: [],
  },
  {
    name: "Peer",
    description: "Zachte, subtiele sorbet gemaakt met rijpe peren.",
    descriptionEn: "Soft, subtle sorbet made with ripe pears.",
    allergens: [],
  },
  {
    name: "Vijgen",
    description:
      "Een zachte, honingachtige smaak met een verfijnd fruitig karakter.",
    descriptionEn:
      "A soft, honey-like taste with a refined fruity character.",
    allergens: [],
  },
  {
    name: "Papaye",
    description: "Exotische papayesorbet met een milde tropische smaak.",
    descriptionEn: "Exotic papaye sorbet with a mild tropical flavor.",
    allergens: [],
  },
  {
    name: "Guave",
    description:
      "Een aromatische tropische vrucht met een verrassend frisse afdronk.",
    descriptionEn:
      "An aromatic tropical fruit with a surprisingly fresh finish.",
    allergens: [],
  },
  {
    name: "Kiwi - Aardbei",
    description:
      "De frisse toets van kiwi en de zoetheid van aardbei vullen elkaar perfect aan.",
    descriptionEn:
      "The fresh touch of kiwi and the sweetness of strawberry complement each other perfectly.",
    allergens: [],
  },
  {
    name: "Cuberdon",
    description:
      "Een knipoog naar onze thuisstad Gent, met de herkenbare smaak van de iconische cuberdon.",
    descriptionEn:
      "A nod to our hometown Ghent, featuring the recognizable taste of the iconic cuberdon.",
    allergens: ["melk"],
  },
  {
    name: "Rum Rozijn",
    description:
      "Rozijnen en rum zorgen samen voor een warme, karaktervolle klassieker.",
    descriptionEn:
      "Raisins and rum combine for a warm, characterful classic.",
    allergens: ["melk"],
  },
];

const FLAVORS = [
  ...GELATO.map((flavor) => ({
    ...flavor,
    type: "gelato",
  })),
  ...SORBET.map((flavor) => ({
    ...flavor,
    type: "sorbet",
  })),
];

const ALLERGENS = [
  {
    id: "melk",
    icon: "🥛",
    name: { nl: "Melk", en: "Milk" },
    description: {
      nl: "Dit product bevat melk of ingrediënten op basis van melk, zoals room of boter.",
      en: "This product contains milk or milk-based ingredients, such as cream or butter.",
    },
  },
  {
    id: "ei",
    icon: "🥚",
    name: { nl: "Ei", en: "Egg" },
    description: {
      nl: "Dit product bevat ei of ingrediënten op basis van ei, die bijdragen aan de structuur en romigheid van het ijs.",
      en: "This product contains egg or egg-based ingredients, which contribute to the structure and creaminess of the ice cream.",
    },
  },
  {
    id: "gluten",
    icon: "🌾",
    name: { nl: "Gluten", en: "Gluten" },
    description: {
      nl: "Dit product bevat glutenhoudende ingrediënten, zoals tarwe, gerst of rogge.",
      en: "This product contains gluten-containing ingredients, such as wheat, barley, or rye.",
    },
  },
  {
    id: "noten",
    icon: "🥜",
    name: { nl: "Noten", en: "Nuts" },
    description: {
      nl: "Dit product bevat noten of ingrediënten afkomstig van noten, zoals amandelen, hazelnoten of pistachenoten.",
      en: "This product contains nuts or nut-derived ingredients, such as almonds, hazelnuts, or pistachios.",
    },
  },
];

const FAQS = [
  {
    question: {
      nl: "Zijn alle sorbets vegan?",
      en: "Are all sorbets vegan?",
    },
    answer: {
      nl: "Onze fruitsorbets worden zonder melk bereid en zijn van nature vegan. Vraag bij bijzondere of tijdelijke smaken altijd even bevestiging aan ons team.",
      en: "Our fruit sorbets are prepared without milk and are naturally vegan. For special or temporary flavors, always ask our team for confirmation.",
    },
  },
  {
    question: {
      nl: "Welke smaken zijn glutenvrij?",
      en: "Which flavors are gluten-free?",
    },
    answer: {
      nl: "Smaken zonder het label ‘Gluten’ bevatten volgens het recept geen glutenhoudende ingrediënten. Door bereiding in dezelfde omgeving kunnen sporen echter niet volledig worden uitgesloten.",
      en: "Flavors without the 'Gluten' label contain no gluten-containing ingredients according to the recipe. However, due to preparation in the same environment, traces cannot be completely ruled out.",
    },
  },
  {
    question: {
      nl: "Worden er echte noten gebruikt?",
      en: "Are real nuts used?",
    },
    answer: {
      nl: "Ja. Voor onder meer hazelnoot, pistache en amandel gebruiken we echte noten.",
      en: "Yes. For hazelnut, pistachio, and almond, among others, we use real nuts.",
    },
  },
  {
    question: {
      nl: "Kan ik ijs eten als ik lactose-intolerant ben?",
      en: "Can I eat ice cream if I am lactose intolerant?",
    },
    answer: {
      nl: "De sorbets worden zonder melk bereid. Bespreek uw intolerantie wel met ons personeel, zeker bij een sterke gevoeligheid of allergie.",
      en: "The sorbets are prepared without milk. However, please discuss your intolerance with our staff, especially in case of strong sensitivity or allergy.",
    },
  },
];

// Vertaalwoordenboek voor vaste UI elementen
const UI_TEXT = {
  nl: {
    eyebrow: "Pierino IJs — Gent",
    title1: "Onze ",
    titleHighlight: "smaken",
    subtitle: "Echte ingrediënten. Eerlijke smaken.",
    body: "Bij Pierino maken we ijs zoals het hoort: met verse ingrediënten en zonder onnodige toevoegingen. Hieronder ontdek je al onze smaken en allergenen. Ons aanbod varieert naargelang het seizoen.",
    tabSmaken: "Smaken",
    tabAllergenen: "Allergenen & FAQ",
    gelatoCardTitle: "Gelato",
    gelatoCardText: "Italiaans Romig ijs op basis van verse melk en room, gecombineerd met echte ingrediënten zoals vanille, noten, chocolade of fruit.",
    sorbetCardTitle: "Sorbet",
    sorbetCardText: "Een verfrissend ijs op basis van fruit, zonder melk. Onze sorbets zijn van nature vegan en bevatten geen glutenhoudende ingrediënten, uitgezonderd smaken die expliciet anders zijn aangeduid.",
    offerEyebrow: "Ontdek het aanbod",
    offerTitle: "Alle smaken",
    foundSuffix: "gevonden",
    foundSingle: "smaak gevonden",
    foundPlural: "smaken gevonden",
    searchPlaceholder: "Zoek een smaak...",
    typeLegend: "Soort ijs",
    typeAll: "Alle",
    typeGelato: "Gelato",
    typeSorbet: "Sorbet",
    allergenLegend: "Allergenen",
    allergenAll: "Alle",
    allergenVegan: "Vegan",
    roomijsLabel: "Roomijs",
    sorbetLabel: "Sorbet",
    noAllergensTag: "Geen van de vermelde allergenen",
    noFlavors: "Geen smaken gevonden. Pas uw zoekopdracht of filters aan.",
    allergenSectionEyebrow: "Duidelijke informatie",
    allergenSectionTitle: "Allergenen",
    allergenSectionText: "Bekijk per allergeen wat het betekent en in welke smaken het volgens deze lijst voorkomt.",
    presentIn: "Aangeduid bij:",
    noMatchingFlavors: "geen smaken in deze lijst",
    disclaimerTitle: "Belangrijk bij allergieën",
    disclaimerText: "Alle smaken kunnen in dezelfde productieruimte en met gedeeld materiaal worden bereid. Daardoor kunnen sporen van allergenen aanwezig zijn. Meld een ernstige allergie altijd aan ons personeel vóór uw bestelling.",
    faqEyebrow: "Veelgestelde vragen",
    faqTitle: "FAQ",
    lessFlavors: "− Minder smaken",
    moreFlavors: "andere smaken",
  },
  en: {
    eyebrow: "Pierino Ice Cream — Ghent",
    title1: "Our ",
    titleHighlight: "flavors",
    subtitle: "Real ingredients. Honest flavors.",
    body: "At Pierino, we make ice cream the way it should be: with fresh ingredients and without unnecessary additives. Below you can discover all our flavors and allergens. Our offer varies by season.",
    tabSmaken: "Flavors",
    tabAllergenen: "Allergens & FAQ",
    gelatoCardTitle: "Gelato",
    gelatoCardText: "Italian creamy ice cream based on fresh milk and cream, combined with real ingredients such as vanilla, nuts, chocolate, or fruit.",
    sorbetCardTitle: "Sorbet",
    sorbetCardText: "A refreshing fruit-based ice cream without milk. Our sorbets are naturally vegan and contain no gluten-containing ingredients, except for flavors explicitly indicated otherwise.",
    offerEyebrow: "Explore the selection",
    offerTitle: "All flavors",
    foundSuffix: "found",
    foundSingle: "flavor found",
    foundPlural: "flavors found",
    searchPlaceholder: "Search a flavor...",
    typeLegend: "Ice type",
    typeAll: "All",
    typeGelato: "Gelato",
    typeSorbet: "Sorbet",
    allergenLegend: "Allergens",
    allergenAll: "All",
    allergenVegan: "Vegan",
    roomijsLabel: "Dairy Ice Cream",
    sorbetLabel: "Sorbet",
    noAllergensTag: "No listed allergens",
    noFlavors: "No flavors found. Please adjust your search or filters.",
    allergenSectionEyebrow: "Clear information",
    allergenSectionTitle: "Allergens",
    allergenSectionText: "Check what each allergen means and in which flavors it appears according to this list.",
    presentIn: "Indicated in:",
    noMatchingFlavors: "no flavors in this list",
    disclaimerTitle: "Important regarding allergies",
    disclaimerText: "All flavors may be prepared in the same production area and with shared equipment. Therefore, traces of allergens may be present. Always notify our staff of a severe allergy prior to ordering.",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Small FAQ",
    lessFlavors: "− Fewer flavors",
    moreFlavors: "other flavors",
  }
};

function AccordionItem({ title, children, meta, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const panelId = `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <article className={`sa-accordion ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="sa-accordion__button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sa-accordion__heading">
          <span className="sa-accordion__title">{title}</span>
          {meta}
        </span>
        <span className="sa-accordion__chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      <div id={panelId} className="sa-accordion__content" hidden={!open}>
        {children}
      </div>
    </article>
  );
}

function FlavorCard({ flavor, lang }) {
  const description = lang === "en" ? flavor.descriptionEn : flavor.description;
  
  return (
    <AccordionItem
      title={flavor.name}
      meta={
        <span
          className="sa-badges"
          aria-label={
            flavor.allergens.length ? (lang === "en" ? "Allergens" : "Allergenen") : "Vegan"
          }
        >
          {flavor.allergens.map((allergen) => (
            <span key={allergen} className={`sa-badge sa-badge--${allergen}`}>
              {allergen}
            </span>
          ))}
          {!flavor.allergens.length && (
            <span className="sa-badge sa-badge--free">Vegan</span>
          )}
        </span>
      }
    >
      <p>{description}</p>
      <div className="sa-tags">
        <span className={`sa-type sa-type--${flavor.type}`}>
          {flavor.type === "gelato" 
            ? UI_TEXT[lang].roomijsLabel 
            : UI_TEXT[lang].sorbetLabel}
        </span>
        {flavor.allergens.map((allergen) => (
          <span key={allergen} className={`sa-tag sa-tag--${allergen}`}>
            {allergen}
          </span>
        ))}
        {!flavor.allergens.length && (
          <span className="sa-tag sa-tag--free">
            {UI_TEXT[lang].noAllergensTag}
          </span>
        )}
      </div>
    </AccordionItem>
  );
}

export default function SmakenAllergenenPage() {
  const [lang, setLang] = useState("nl");
  const [activeTab, setActiveTab] = useState("smaken");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("alle");
  const [allergenFilter, setAllergenFilter] = useState("alle");

  const [expandedTypes, setExpandedTypes] = useState({
    gelato: false,
    sorbet: false,
  });

  const toggleExpanded = (type) => {
    setExpandedTypes((current) => ({
      ...current,
      [type]: !current[type],
    }));
  };

  const t = UI_TEXT[lang];

  const filteredFlavors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(lang);

    return FLAVORS.filter((flavor) => {
      const desc = lang === "en" ? flavor.descriptionEn : flavor.description;
      const searchableText = `${flavor.name} ${desc}`.toLocaleLowerCase(lang);

      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      const matchesType = typeFilter === "alle" || flavor.type === typeFilter;

      const matchesAllergen =
        allergenFilter === "alle" ||
        (allergenFilter === "vrij" && flavor.allergens.length === 0) ||
        flavor.allergens.includes(allergenFilter);

      return matchesQuery && matchesType && matchesAllergen;
    });
  }, [query, typeFilter, allergenFilter, lang]);

  return (
    <main className="sa-page">
      {/* Vertaal Toggle Bar - Responsive */}
      <div className="sa-shell" style={{ display: "flex", justifyContent: "flex-end", paddingTop: "1rem" }}>
        <div className="sa-lang-toggle" style={{ display: "inline-flex", background: "#f1f1f1", padding: "4px", borderRadius: "8px", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setLang("nl")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: lang === "nl" ? "#fff" : "transparent",
              fontWeight: lang === "nl" ? "bold" : "normal",
              cursor: "pointer",
              boxShadow: lang === "nl" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
            }}
          >
            🇳🇱 NL
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: lang === "en" ? "#fff" : "transparent",
              fontWeight: lang === "en" ? "bold" : "normal",
              cursor: "pointer",
              boxShadow: lang === "en" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
            }}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      <section className="sa-hero" aria-labelledby="smaken-title">
        <div className="sa-shell sa-hero__inner">
          <p className="sa-eyebrow">{t.eyebrow}</p>
          <h1 id="smaken-title">
            {t.title1}<span>{t.titleHighlight}</span>
          </h1>
          <p className="sa-hero__subtitle">{t.subtitle}</p>
          <p className="sa-hero__body">{t.body}</p>
        </div>
      </section>

      <nav className="sa-tabs" aria-label="Paginaonderdelen">
        <div className="sa-shell sa-tabs__inner" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "smaken"}
            className={activeTab === "smaken" ? "is-active" : ""}
            onClick={() => setActiveTab("smaken")}
          >
            {t.tabSmaken}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "allergenen"}
            className={activeTab === "allergenen" ? "is-active" : ""}
            onClick={() => setActiveTab("allergenen")}
          >
            {t.tabAllergenen}
          </button>
        </div>
      </nav>

      <div className="sa-shell sa-content">
        {activeTab === "smaken" ? (
          <section aria-labelledby="smaken-overzicht">
            <div className="sa-explanation-grid">
              <article className="sa-info-card">
                <h2>
                  <span className="sa-info-card__icon" aria-hidden="true">
                    🍨
                  </span>{" "}
                  {t.gelatoCardTitle}
                </h2>
                <p>{t.gelatoCardText}</p>
              </article>
              <article className="sa-info-card">
                <h2>
                  <span className="sa-info-card__icon" aria-hidden="true">
                    🍋
                  </span>{" "}
                  {t.sorbetCardTitle}
                </h2>
                <p>{t.sorbetCardText}</p>
              </article>
            </div>

            <div className="sa-section-heading">
              <div>
                <p className="sa-eyebrow">{t.offerEyebrow}</p>
                <h2 id="smaken-overzicht">{t.offerTitle}</h2>
              </div>
              <p>
                <strong>{filteredFlavors.length}</strong>{" "}
                {filteredFlavors.length === 1 ? t.foundSingle : t.foundPlural}
              </p>
            </div>

            <div className="sa-controls">
              <label className="sa-search">
                <span className="sr-only">{t.searchPlaceholder}</span>
                <span aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder={t.searchPlaceholder}
                />
              </label>

              <fieldset className="sa-filter-group">
                <legend>{t.typeLegend}</legend>
                {[
                  ["alle", t.typeAll],
                  ["gelato", t.typeGelato],
                  ["sorbet", t.typeSorbet],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={typeFilter === value ? "is-active" : ""}
                    onClick={() => setTypeFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </fieldset>

              <fieldset className="sa-filter-group">
                <legend>{t.allergenLegend}</legend>
                {[
                  ["alle", t.allergenAll],
                  ["melk", "Melk"],
                  ["ei", "Ei"],
                  ["gluten", "Gluten"],
                  ["noten", "Noten"],
                  ["vrij", t.allergenVegan],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={allergenFilter === value ? "is-active" : ""}
                    onClick={() => setAllergenFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </fieldset>
            </div>

            {filteredFlavors.length ? (
              <div className="sa-flavor-sections">
                {["gelato", "sorbet"].map((type) => {
                  const items = filteredFlavors.filter(
                    (flavor) => flavor.type === type,
                  );

                  if (!items.length) {
                    return null;
                  }

                  const isExpanded = expandedTypes[type];
                  const visibleItems = isExpanded ? items : items.slice(0, 8);

                  return (
                    <section
                      key={type}
                      className="sa-flavor-section"
                      aria-labelledby={`${type}-title`}
                    >
                      <div className="sa-category-heading">
                        <h3 id={`${type}-title`}>
                          {type === "gelato" ? t.typeGelato : t.typeSorbet}
                        </h3>
                        <span>{items.length}</span>
                      </div>
                      <div className="sa-list">
                        {visibleItems.map((flavor) => (
                          <FlavorCard
                            key={`${type}-${flavor.name}`}
                            flavor={flavor}
                            lang={lang}
                          />
                        ))}
                      </div>

                      {items.length > 8 && (
                        <button
                          type="button"
                          className={`sa-more-button ${
                            isExpanded ? "is-expanded" : ""
                          }`}
                          onClick={() => toggleExpanded(type)}
                          aria-expanded={isExpanded}
                        >
                          <span>
                            {isExpanded
                              ? t.lessFlavors
                              : `+ ${items.length - 8} ${t.moreFlavors}`}
                          </span>
                          <span
                            className="sa-more-button__arrow"
                            aria-hidden="true"
                          >
                            {isExpanded ? "⌃" : "⌄"}
                          </span>
                        </button>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <p className="sa-empty">{t.noFlavors}</p>
            )}
          </section>
        ) : (
          <section aria-labelledby="allergenen-title">
            <div className="sa-section-heading sa-section-heading--stacked">
              <div>
                <p className="sa-eyebrow">{t.allergenSectionEyebrow}</p>
                <h2 id="allergenen-title">{t.allergenSectionTitle}</h2>
                <p>{t.allergenSectionText}</p>
              </div>
            </div>

            <div className="sa-list">
              {ALLERGENS.map((allergen) => {
                const matching = FLAVORS.filter((flavor) =>
                  flavor.allergens.includes(allergen.id),
                );

                return (
                  <AccordionItem
                    key={allergen.id}
                    title={`${allergen.icon} ${allergen.name[lang]}`}
                  >
                    <p>{allergen.description[lang]}</p>
                    <p className="sa-present-in">
                      <strong>{t.presentIn}</strong>{" "}
                      {matching.length
                        ? matching.map((flavor) => flavor.name).join(", ")
                        : t.noMatchingFlavors}
                      .
                    </p>
                  </AccordionItem>
                );
              })}
            </div>

            <aside className="sa-disclaimer">
              <strong>{t.disclaimerTitle}</strong>
              <p>{t.disclaimerText}</p>
            </aside>

            <section className="sa-faq" aria-labelledby="faq-title">
  <div className="sa-section-heading">
    <div>
      <p className="sa-eyebrow">{t.faqEyebrow}</p>
      <h2 id="faq-title">{t.faqTitle}</h2>
    </div>
  </div>
  <div className="sa-list">
    {FAQS.map((item, index) => (
      <article key={index} className="sa-faq-card">
        <h3 className="sa-faq-card__title">{item.question[lang]}</h3>
        <p className="sa-faq-card__answer">{item.answer[lang]}</p>
      </article>
    ))}
  </div>
</section>
          </section>
        )}
      </div>
    </main>
  );
}