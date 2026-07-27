import React, { useMemo, useState } from "react";
import "../Components/Smaken_Allergenen.css";

const GELATO = [
  {
    name: "Vanille",
    description:
      "Een tijdloze klassieker, bereid met echte vanillestokken uit Madagaskar. Deze zorgen voor een zachte en verfijnde smaak.",
    allergens: ["melk"],
  },
  {
    name: "Chocolade",
    description:
      "Voor chocoladeliefhebbers: een intense cacaosmaak die lang blijft nazinderen.",
    allergens: ["melk"],
  },
  {
    name: "Stracciatella",
    description:
      "Zacht vanille-ijs met fijne stukjes Belgische pure chocolade die zorgen voor een heerlijke crunch.",
    allergens: ["melk"],
  },
  {
    name: "Hazelnoot",
    description:
      "Geroosterde hazelnoten zorgen voor een volle, nootachtige smaak.",
    allergens: ["melk", "noten"],
  },
  {
    name: "Pistache",
    description:
      "Gemaakt met echte pistachenoten uit Italië, waardoor de subtiele nootachtige smaak volledig tot zijn recht komt.",
    allergens: ["melk", "noten"],
  },
  {
    name: "Kokosnoot",
    description:
      "De zachte en exotische smaak van kokos brengt je even naar tropische oorden.",
    allergens: ["melk"],
  },
  {
    name: "Mokka",
    description:
      "Voor de echte koffieliefhebbers geven we de volle smaak van koffie, perfect in balans met de zachtheid van room.",
    allergens: ["melk"],
  },
  {
    name: "Speculoos",
    description:
      "Belgische speculoos zorgt voor een warme, kruidige smaak die meteen vertrouwd aanvoelt.",
    allergens: ["melk", "gluten"],
  },
  {
    name: "Yoghurt",
    description:
      "Een frisse smaak met het lichtzurige karakter van echte yoghurt.",
    allergens: ["melk"],
  },
  {
    name: "Yoghurt Aardbei",
    description:
      "De frisse smaak van yoghurt gecombineerd met de natuurlijke zoetheid van aardbeien.",
    allergens: ["melk"],
  },
  {
    name: "Amaretto",
    description:
      "Een zachte amandelsmaak met de verfijnde toetsen van Italiaanse amaretto.",
    allergens: ["melk", "noten"],
  },
  {
    name: "Amarettini",
    description:
      "Krokante amarettikoekjes geven dit roomijs een subtiele amandelsmaak.",
    allergens: ["melk", "ei", "gluten", "noten"],
  },
  {
    name: "Amarena",
    description:
      "Zoete amarena kersen geven deze smaak een fruitige zoete toets en een heerlijk contrast met het roomijs.",
    allergens: ["melk"],
  },
  {
    name: "Banaan",
    description: "De volle smaak van rijpe bananen, eenvoudig en puur.",
    allergens: ["melk"],
  },
  {
    name: "Munt",
    description:
      "Verfrissend muntijs met een zachte kruidige toets. Perfect voor de zomer.",
    allergens: ["melk"],
  },
  {
    name: "Honing",
    description:
      "De zachte, bloemige smaak van honing zorgt voor een subtiel zoete toets.",
    allergens: ["melk"],
  },
  {
    name: "Amandel",
    description: "Romig ijs met geroosterde amandelen.",
    allergens: ["melk", "noten"],
  },
];

const SORBET = [
  {
    name: "Citroen",
    description:
      "Levendig, fris en boordevol citrustoetsen, of met andere woorden: de perfecte verfrissende sorbet.",
    allergens: [],
  },
  {
    name: "Aardbei",
    description: "Sorbet gemaakt met heerlijke zomerse aardbeien.",
    allergens: [],
  },
  {
    name: "Meloen",
    description: "Frisse sorbet die je doet denken aan een warme zomerdag.",
    allergens: [],
  },
  {
    name: "Braambes",
    description:
      "Een mooie balans tussen zoet en licht zuur, typisch voor braambessen.",
    allergens: [],
  },
  {
    name: "Bosbes",
    description: "Een fruitige sorbet met de volle smaak van bosbessen.",
    allergens: [],
  },
  {
    name: "Framboos",
    description: "Een intense frambozensorbet met frisse en lichtzure toetsen.",
    allergens: [],
  },
  {
    name: "Mango",
    description: "Tropische mangosorbet boordevol fruit en exotische smaak.",
    allergens: [],
  },
  {
    name: "Sinaasappel",
    description: "Frisse sinaasappelsorbet met een natuurlijke citruskick.",
    allergens: [],
  },
  {
    name: "Kiwi",
    description: "Verfrissende kiwisorbet met een lichtzure toets.",
    allergens: [],
  },
  {
    name: "Duvel",
    description:
      "Een verrassende sorbet waarin de kenmerkende smaak van Duvel mooi tot zijn recht komt.",
    allergens: ["gluten"],
  },
  {
    name: "Rabarber",
    description:
      "Frisse sorbet met het typische samenspel van frisse zuren en zachte zoetheid.",
    allergens: [],
  },
  {
    name: "Ananas",
    description:
      "Tropische sorbet gemaakt met sappige ananas. Smaakt meteen naar de zon.",
    allergens: [],
  },
  {
    name: "Watermeloen",
    description: "Lichte en verfrissende watermeloensorbet.",
    allergens: [],
  },
  {
    name: "Kersen",
    description: "Fruitige kersensorbet met een licht zoete nasmaak.",
    allergens: [],
  },
  {
    name: "Peer",
    description: "Zachte, subtiele sorbet gemaakt met rijpe peren.",
    allergens: [],
  },
  {
    name: "Vijgen",
    description:
      "Een zachte, honingachtige smaak met een verfijnd fruitig karakter.",
    allergens: [],
  },
  {
    name: "Papaya",
    description: "Exotische papayasorbet met een milde tropische smaak.",
    allergens: [],
  },
  {
    name: "Guave",
    description:
      "Een aromatische tropische vrucht met een verrassend frisse afdronk.",
    allergens: [],
  },
  {
    name: "Kiwi - Aardbei",
    description:
      "De frisse toets van kiwi en de zoetheid van aardbei vullen elkaar perfect aan.",
    allergens: [],
  },
  {
    name: "Cuberdon",
    description:
      "Een knipoog naar onze thuisstad Gent, met de herkenbare smaak van de iconische cuberdon.",
    allergens: [],
  },
  {
    name: "Rum Rozijn",
    description:
      "Rozijnen en rum zorgen samen voor een warme, karaktervolle klassieker.",
    allergens: [],
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
    name: "Melk",
    description:
      "Dit product bevat melk of ingrediënten op basis van melk, zoals room of boter.",
  },
  {
    id: "ei",
    icon: "🥚",
    name: "Ei",
    description:
      "Dit product bevat ei of ingrediënten op basis van ei, die bijdragen aan de structuur en romigheid van het ijs.",
  },
  {
    id: "gluten",
    icon: "🌾",
    name: "Gluten",
    description:
      "Dit product bevat glutenhoudende ingrediënten, zoals tarwe, gerst of rogge.",
  },
  {
    id: "noten",
    icon: "🥜",
    name: "Noten",
    description:
      "Dit product bevat noten of ingrediënten afkomstig van noten, zoals amandelen, hazelnoten of pistachenoten.",
  },
];

const FAQS = [
  {
    question: "Zijn alle sorbets vegan?",
    answer:
      "Onze fruitsorbets worden zonder melk bereid en zijn van nature vegan. Vraag bij bijzondere of tijdelijke smaken altijd even bevestiging aan ons team.",
  },
  {
    question: "Welke smaken zijn glutenvrij?",
    answer:
      "Smaken zonder het label ‘Gluten’ bevatten volgens het recept geen glutenhoudende ingrediënten. Door bereiding in dezelfde omgeving kunnen sporen echter niet volledig worden uitgesloten.",
  },
  {
    question: "Worden er echte noten gebruikt?",
    answer:
      "Ja. Voor onder meer hazelnoot, pistache en amandel gebruiken we echte noten.",
  },
  {
    question: "Kan ik ijs eten als ik lactose-intolerant ben?",
    answer:
      "De sorbets worden zonder melk bereid. Bespreek uw intolerantie wel met ons personeel, zeker bij een sterke gevoeligheid of allergie.",
  },
];

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

function FlavorCard({ flavor }) {
  return (
    <AccordionItem
      title={flavor.name}
      meta={
        <span
          className="sa-badges"
          aria-label={
            flavor.allergens.length ? "Allergenen" : "Geen vermelde allergenen"
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
      <p>{flavor.description}</p>

      <div className="sa-tags">
        <span className={`sa-type sa-type--${flavor.type}`}>
          {flavor.type === "gelato" ? "Roomijs" : "Sorbet"}
        </span>

        {flavor.allergens.map((allergen) => (
          <span key={allergen} className={`sa-tag sa-tag--${allergen}`}>
            {allergen}
          </span>
        ))}

        {!flavor.allergens.length && (
          <span className="sa-tag sa-tag--free">
            Geen van de vermelde allergenen
          </span>
        )}
      </div>
    </AccordionItem>
  );
}

export default function SmakenAllergenenPage() {
  const [activeTab, setActiveTab] = useState("smaken");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("alle");
  const [allergenFilter, setAllergenFilter] = useState("alle");

  // Houd bij of de volledige lijst per categorie zichtbaar is
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

  const filteredFlavors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("nl");

    return FLAVORS.filter((flavor) => {
      const searchableText =
        `${flavor.name} ${flavor.description}`.toLocaleLowerCase("nl");

      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      const matchesType = typeFilter === "alle" || flavor.type === typeFilter;

      const matchesAllergen =
        allergenFilter === "alle" ||
        (allergenFilter === "vrij" && flavor.allergens.length === 0) ||
        flavor.allergens.includes(allergenFilter);

      return matchesQuery && matchesType && matchesAllergen;
    });
  }, [query, typeFilter, allergenFilter]);

  return (
    <main className="sa-page">
      <section className="sa-hero" aria-labelledby="smaken-title">
        <div className="sa-shell sa-hero__inner">
          <p className="sa-eyebrow">Pierino IJs — Gent</p>

          <h1 id="smaken-title">
            Onze <span>smaken</span>
          </h1>

          <p className="sa-hero__subtitle">
            Echte ingrediënten. Eerlijke smaken.
          </p>

          <p className="sa-hero__body">
            Bij Pierino maken we ijs zoals het hoort: met verse ingrediënten en
            zonder onnodige toevoegingen. Hieronder ontdek je al onze smaken en
            allergenen. Ons aanbod varieert naargelang het seizoen.
          </p>
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
            Smaken
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "allergenen"}
            className={activeTab === "allergenen" ? "is-active" : ""}
            onClick={() => setActiveTab("allergenen")}
          >
            Allergenen & FAQ
          </button>
        </div>
      </nav>

      <div className="sa-shell sa-content">
        {activeTab === "smaken" ? (
          <section aria-labelledby="smaken-overzicht">
            <div className="sa-explanation-grid">
              <article className="sa-info-card">
                <h2>
                  {" "}
                  <span className="sa-info-card__icon" aria-hidden="true">
                    🍨
                  </span>{" "}
                  Gelato
                </h2>

                <p>
                  Italiaans Romig ijs op basis van verse melk en room,
                  gecombineerd met echte ingrediënten zoals vanille, noten,
                  chocolade of fruit.
                </p>
              </article>

              <article className="sa-info-card">
                <h2>
                  {" "}
                  <span className="sa-info-card__icon" aria-hidden="true">
                    🍋
                  </span>{" "}
                  Sorbet
                </h2>

                <p>
                  Een verfrissend ijs op basis van fruit, zonder melk. Onze
                  sorbets zijn van nature vegan en bevatten geen glutenhoudende
                  ingrediënten, uitgezonderd smaken die expliciet anders zijn
                  aangeduid.
                </p>
              </article>
            </div>

            <div className="sa-section-heading">
              <div>
                <p className="sa-eyebrow">Ontdek het aanbod</p>

                <h2 id="smaken-overzicht">Alle smaken</h2>
              </div>

              <p>
                <strong>{filteredFlavors.length}</strong>{" "}
                {filteredFlavors.length === 1 ? "smaak" : "smaken"} gevonden
              </p>
            </div>

            <div className="sa-controls">
              <label className="sa-search">
                <span className="sr-only">Zoek een smaak</span>

                <span aria-hidden="true">⌕</span>

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="Zoek een smaak..."
                />
              </label>

              <fieldset className="sa-filter-group">
                <legend>Soort ijs</legend>

                {[
                  ["alle", "Alle"],
                  ["gelato", "Gelato"],
                  ["sorbet", "Sorbet"],
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
                <legend>Allergenen</legend>

                {[
                  ["alle", "Alle"],
                  ["melk", "Melk"],
                  ["ei", "Ei"],
                  ["gluten", "Gluten"],
                  ["noten", "Noten"],
                  ["vrij", "Vegan"],
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

                  // Toon standaard maximaal 8 smaken
                  const visibleItems = isExpanded ? items : items.slice(0, 8);

                  // const remainingCount =
                  //   items.length - visibleItems.length;

                  return (
                    <section
                      key={type}
                      className="sa-flavor-section"
                      aria-labelledby={`${type}-title`}
                    >
                      <div className="sa-category-heading">
                        <h3 id={`${type}-title`}>
                          {type === "gelato" ? "Gelato" : "Sorbet"}
                        </h3>

                        <span>{items.length}</span>
                      </div>

                      <div className="sa-list">
                        {visibleItems.map((flavor) => (
                          <FlavorCard
                            key={`${type}-${flavor.name}`}
                            flavor={flavor}
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
                              ? "− Minder smaken"
                              : `+ ${items.length - 8} andere smaken`}
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
              <p className="sa-empty">
                Geen smaken gevonden. Pas uw zoekopdracht of filters aan.
              </p>
            )}
          </section>
        ) : (
          <section aria-labelledby="allergenen-title">
            <div className="sa-section-heading sa-section-heading--stacked">
              <div>
                <p className="sa-eyebrow">Duidelijke informatie</p>

                <h2 id="allergenen-title">Allergenen</h2>
                <p>
                Bekijk per allergeen wat het betekent en in welke smaken het
                volgens deze lijst voorkomt.
              </p>
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
                    title={`${allergen.icon} ${allergen.name}`}
                  >
                    <p>{allergen.description}</p>

                    <p className="sa-present-in">
                      <strong>Aangeduid bij:</strong>{" "}
                      {matching.length
                        ? matching.map((flavor) => flavor.name).join(", ")
                        : "geen smaken in deze lijst"}
                      .
                    </p>
                  </AccordionItem>
                );
              })}
            </div>

            <aside className="sa-disclaimer">
              <strong>Belangrijk bij allergieën</strong>

              <p>
                Alle smaken kunnen in dezelfde productieruimte en met gedeeld
                materiaal worden bereid. Daardoor kunnen sporen van allergenen
                aanwezig zijn. Meld een ernstige allergie altijd aan ons
                personeel vóór uw bestelling.
              </p>
            </aside>

            <section className="sa-faq" aria-labelledby="faq-title">
              <div className="sa-section-heading">
                <div>
                  <p className="sa-eyebrow">Veelgestelde vragen</p>

                  <h2 id="faq-title">Kleine FAQ</h2>
                </div>
              </div>

              <div className="sa-list">
                {FAQS.map((item) => (
                  <AccordionItem key={item.question} title={item.question}>
                    <p>{item.answer}</p>
                  </AccordionItem>
                ))}
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
