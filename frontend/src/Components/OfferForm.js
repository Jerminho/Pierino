import { useState, useEffect } from "react";
import axios from "axios";

const OfferForm = () => {
  const [pricingOptions, setPricingOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    number: "",
    postalCode: "",
    city: "",
    startDateTime: "",
    endDateTime: "",
    attendees: "",
    attendeeRange: "",
    commentary: "",
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  // Use your Heroku app URL here
  const API_URL = "https://pierino-backend-a1790776fc10.herokuapp.com"; // Heroku API URL

  useEffect(() => {
    axios
      .get(`${API_URL}/pricing`) // Fetch pricing data from the live backend
      .then((response) => setPricingOptions(response.data))
      .catch((error) => console.error("Error fetching pricing data", error));
  }, []);

  const calculatePrice = (attendees) => {
    const range = pricingOptions.find(
      (r) => attendees >= r.min && attendees <= r.max
    );
    if (range) {
      return range.baseCalculation * range.pricePerAttendee + 20;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "attendees") {
      const selectedOption = pricingOptions.find(
        (option) => option.max.toString() === value
      );
      const selectedRange = `${selectedOption.min} - ${selectedOption.max}`;

      setFormData({
        ...formData,
        attendees: value,
        attendeeRange: selectedRange, // 👈 New field added
      });

      setEstimatedPrice(calculatePrice(parseInt(value, 10)));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullLocation = `${formData.street} ${formData.number} ${formData.postalCode} ${formData.city}`;

    const payload = {
      ...formData,
      location: fullLocation, // 👈 send combined location
      commentary: formData.commentary,
    };

    try {
      const response = await axios.post(`${API_URL}/book`, payload); // Send booking data to the live backend
      alert(response.data.message);
      window.location.reload(); // Reload the page
    } catch (error) {
      alert("Error submitting booking");
    }
  };

  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-6">
        Reserve an Ice Cream Truck
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Straat"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="number"
          placeholder="Nummer"
          value={formData.number}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postcode"
          value={formData.postalCode}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="city"
          placeholder="Gemeente"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
        />
        <label htmlFor="startDateTime" className="block mb-1 font-medium">
          Start Date & Time
        </label>
        <input
          type="datetime-local"
          id="startDateTime"
          name="startDateTime"
          value={formData.startDateTime}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        />{" "}
        <br />
        <label htmlFor="endDateTime" className="block mb-1 font-medium">
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
        />
        <select
          name="attendees"
          value={formData.attendees}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required
        >
          <option value="">Select Attendees</option>
          {pricingOptions.map((option, index) => (
            <option key={index} value={option.max}>
              {option.min} - {option.max} Attendees
            </option>
          ))}
        </select>
        <textarea
          name="commentary"
          placeholder="Extra opmerkingen (bv. over de locatie, voorkeuren...)"
          value={formData.commentary}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          rows={4}
        />
        <p className="text-sm font-semibold text-pink-600 text-center">
          Na het versturen van uw offerteaanvraag ontvangt u een voorstel binnen
          de 24u.
        </p>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-300 hover:to-red-300 text-white font-bold rounded-lg transition-all duration-300"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
