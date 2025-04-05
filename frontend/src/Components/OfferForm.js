import { useState, useEffect } from "react";
import axios from "axios";

const OfferForm = () => {
  const [pricingOptions, setPricingOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    attendees: "",
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  
  // Use your Heroku app URL here
  const API_URL = 'https://offerte-backend-112de817f722.herokuapp.com'; // Heroku API URL
  
  useEffect(() => {
    axios.get(`${API_URL}/pricing`) // Fetch pricing data from the live backend
      .then(response => setPricingOptions(response.data))
      .catch(error => console.error("Error fetching pricing data", error));
  }, []);
  
  const calculatePrice = (attendees) => {
    const range = pricingOptions.find(r => attendees >= r.min && attendees <= r.max);
    if (range) {
      return range.baseCalculation * range.pricePerAttendee + 20;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "attendees") {
      setEstimatedPrice(calculatePrice(parseInt(value, 10)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/book`, formData); // Send booking data to the live backend
      alert(response.data.message);
      window.location.reload(); // Reload the page
    } catch (error) {
      alert("Error submitting booking");
    }
  };

  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-6">Reserve an Ice Cream Truck</h2>
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
          name="location" 
          placeholder="Event Location" 
          value={formData.location} 
          onChange={handleChange} 
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required 
        />

        <input 
          type="datetime-local" 
          name="startDateTime" 
          value={formData.startDateTime} 
          onChange={handleChange} 
          className="w-full p-3 border border-pink-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
          required 
        />

        <input 
          type="datetime-local" 
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

        {estimatedPrice !== null && (
          <p className="text-lg font-semibold text-pink-600 text-center">
            Estimated Price: <span className="text-pink-700 font-bold">${estimatedPrice}</span>
          </p>
        )}

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
