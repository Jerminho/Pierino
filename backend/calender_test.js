import pkg from "./server.js";

const { addToGoogleCalendar } = pkg;

(async () => {
  await addToGoogleCalendar(
    "Evi Wezenbeek",
    "Oude Gentweg 102 9840 De Pinte",
    new Date("2026-05-02T17:15:00.000Z"),
    "+32495549766",
    "evi.wezenbeek@ugent.be",
    "25 - 49",
    "De Pinte",
    true,
    "1025.857.251",
    "PRIME physio | Wezenbeek bv",
    "Oude Gentweg 102 9840 De Pinte",
    20,
    45,
    170
  );

  console.log("✅ Event attempt finished");
})();