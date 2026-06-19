import { useState, useEffect } from "react";
import axios from "axios";

const OfferForm = () => {
  const [pricingOptions, setPricingOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    postalCode: "",
    city: "",
    startDateTime: "",
    // endDateTime: "",
    // testing
    attendees: "",
    attendeeRange: "",
    commentary: "",
    wantsInvoice: "", // "yes" or "no"
    invoiceVAT: "",
    invoiceName: "",
    invoiceStreet: "",
    invoiceNumber: "",
    invoicePostalCode: "",
    invoiceCity: "",
  });
  const [, setEstimatedPrice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use your Heroku app URL here
  const API_URL = "https://pierino-70f82f18a24c.herokuapp.com"; // Heroku API URL

  useEffect(() => {
    axios
      .get(`${API_URL}/pricing`) // Fetch pricing data from the live backend
      .then((response) => setPricingOptions(response.data))
      .catch((error) => console.error("Error fetching pricing data", error));
  }, []);

  const calculatePrice = (attendees) => {
    const range = pricingOptions.find(
      (r) => attendees >= r.min && attendees <= r.max,
    );
    if (range) {
      return range.baseCalculation * range.pricePerAttendee + 20;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "attendees") {
  const attendees = parseInt(value, 10);

  const selectedOption = pricingOptions.find(
    (option) =>
      attendees >= option.min &&
      attendees <= option.max
  );

  const selectedRange = selectedOption
    ? `${selectedOption.min} - ${selectedOption.max}`
    : "";

  setFormData({
    ...formData,
    attendees: value,
    attendeeRange: selectedRange,
  });

  setEstimatedPrice(calculatePrice(attendees));
}else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullLocation = `${formData.street} ${formData.number} ${formData.postalCode} ${formData.city}`;
    const wantsInvoice = formData.wantsInvoice === "yes";
    const invoiceAddress = `${formData.invoiceStreet} ${formData.invoiceNumber} ${formData.invoicePostalCode} ${formData.invoiceCity}`;
    const localDateTime = formData.startDateTime; // "2026-04-21T15:19"
    // Create a date object interpreting the input as local time
    const dateObject = new Date(localDateTime);

    const payload = {
      ...formData,
      location: fullLocation,
      startDateTime: dateObject.toISOString(),
      commentary: formData.commentary,
      wantsInvoice,
      invoiceVAT: wantsInvoice ? formData.invoiceVAT : null,
      invoiceName: wantsInvoice ? formData.invoiceName : null,
      invoiceAddress: wantsInvoice ? invoiceAddress : null,
    };

    try {
      const response = await axios.post(`${API_URL}/book`, payload);
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert("Error submitting booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-2">
        Vrijblijvende offerte voor ijswagen
      </h2>

      <p className="text-center text-gray-600 text-sm mb-6">
        Vraags een offerte aan voor reservaties van onze ijswagen.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Naam"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="+32 4 12 34 56 78"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="^\+?[0-9\s\-]{7,20}$"
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="street"
          placeholder="Straat van het evenement"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="number"
          placeholder="straatnummer"
          value={formData.number}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postcode van het evenement"
          value={formData.postalCode}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="city"
          placeholder="Gemeente van het evenement"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <label htmlFor="startDateTime" className="block mb-1 font-medium">
          Start Datum & Tijd
        </label>
        <input
          type="datetime-local"
          id="startDateTime"
          name="startDateTime"
          value={formData.startDateTime}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />{" "}
        <br />
        {/* <label htmlFor="endDateTime" className="block mb-1 font-medium">
          End Date & Time
        </label>
        <input
          type="datetime-local"
          id="endDateTime"
          name="endDateTime"
          value={formData.endDateTime}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        /> */}
        <input
  type="number"
  name="attendees"
  min="1"
  placeholder="Aantal bezoekers"
  value={formData.attendees}
  onChange={handleChange}
  required
  className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
/>
        <textarea
          name="commentary"
          placeholder="Extra opmerkingen (bv. over de locatie, voorkeuren...)"
          value={formData.commentary}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          rows={4}
        />
        <label className="block font-medium">Wenst u een factuur?</label>
        <div className="flex gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="wantsInvoice"
              value="yes"
              checked={formData.wantsInvoice === "yes"}
              onChange={handleChange}
              required
            />
            Ja
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="wantsInvoice"
              value="no"
              checked={formData.wantsInvoice === "no"}
              onChange={handleChange}
              required
            />
            Nee
          </label>
        </div>
        {formData.wantsInvoice === "yes" && (
          <>
            <input
              type="text"
              name="invoiceVAT"
              placeholder="BTW-nummer"
              value={formData.invoiceVAT}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="invoiceName"
              placeholder="Bedrijfsnaam"
              value={formData.invoiceName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="invoiceStreet"
              placeholder="Straat"
              value={formData.invoiceStreet}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="invoiceNumber"
              placeholder="Nummer"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="invoicePostalCode"
              placeholder="Postcode"
              value={formData.invoicePostalCode}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="invoiceCity"
              placeholder="Gemeente"
              value={formData.invoiceCity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            />
          </>
        )}
        <p className="text-sm font-semibold text-pink-600 text-center">
          Na het versturen van uw offerteaanvraag ontvangt u een voorstel binnen
          de 24u.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 font-bold rounded-lg transition-all duration-300 ${
            isSubmitting
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-300 hover:to-red-300 text-white"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verzenden...
            </div>
          ) : (
            "Offerteaanvraag indienen"
          )}
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
