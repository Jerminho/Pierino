import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  pending: "text-orange-500",
  approved: "text-green-500",
  declined: "text-red-500",
};

const ManagementScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({}); // State to store messages for each booking
  // State for editable prices
  const [editedPrices, setEditedPrices] = useState({});
  const [editedEndTimes, setEditedEndTimes] = useState({});

  // State for search input by name
  const [searchTerm, setSearchTerm] = useState("");

  // 📌 Fetch bookings from the backend
  useEffect(() => {
    axios
      .get("https://pierino-backend-a1790776fc10.herokuapp.com/bookings") // Fetch bookings with status info
      .then((response) => {
        console.log("Fetched bookings:", response.data);
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings", error);
        setLoading(false);
      });
  }, []);

  // Handle price input change
  const handlePriceChange = (bookingId, newPrice) => {
    setEditedPrices((prev) => ({ ...prev, [bookingId]: newPrice }));
  };

  // Handle saving updated price
  const savePrice = async (bookingId) => {
    const newPrice = editedPrices[bookingId];
    if (!newPrice || isNaN(newPrice)) {
      alert("Please enter a valid numeric price.");
      return;
    }

    try {
      const res = await fetch(
        `https://pierino-backend-a1790776fc10.herokuapp.com/bookings/${bookingId}/price`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: newPrice }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update price.");
      }

      alert("Price updated successfully.");

      // Optionally: Refresh pendingBookings or update state
      window.location.reload(); // 🔁 Reload page after success
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Handle end time input change
  const handleEndTimeChange = (bookingId, newEndTime) => {
    setEditedEndTimes((prev) => ({ ...prev, [bookingId]: newEndTime }));
  };

  // Handle saving updated end time
  const saveEndTime = async (bookingId) => {
    const newEnd = editedEndTimes[bookingId];
    if (!newEnd || isNaN(new Date(newEnd).getTime())) {
      alert("Please enter a valid date/time.");
      return;
    }

    try {
      const res = await fetch(
        `https://pierino-backend-a1790776fc10.herokuapp.com/bookings/${bookingId}/endtime`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ end_datetime: newEnd }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update end time.");
      }

      alert("End time updated successfully.");
      window.location.reload(); // Or optionally refresh local state
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // 📌 Handle Approve/Decline Booking
  const updateBooking = async (id, status) => {
    try {
      const message = messages[id] || ""; // Get the message for this booking (if any)
      const response = await axios.post(
        "https://pierino-backend-a1790776fc10.herokuapp.com/update-booking",
        { id, status, message }
      );

      if (response.data.success) {
        alert(`✅ The status of this booking has been updated to '${status}'.`);
        window.location.reload(); // Reload the page
      } else {
        alert("⚠️ Failed to update booking status. Please try again.");
      }
    } catch (error) {
      console.error(`Failed to ${status} booking:`, error);
    }

    // window.location.reload(); // Reload the page
  };

  // 📌 Handle Deleting a Booking
  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(
        `https://pierino-backend-a1790776fc10.herokuapp.com/delete-booking/${id}`
      );
      const { success, eventRemoved } = response.data;

      if (success) {
        let message = "✅ Booking successfully deleted.";
        if (eventRemoved) {
          message +=
            " 📅 The associated Google Calendar event was also removed.";
        }

        alert(message); // Show confirmation message
        window.location.reload(); // Reload page
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("❌ Error deleting booking. Please try again.");
    }
  };

  // 📌 Group bookings by their status (fetched from the database)
  const sortByStartDate = (a, b) =>
    new Date(a.start_datetime) - new Date(b.start_datetime);

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingBookings = filteredBookings
    .filter((booking) => booking.status === "pending")
    .sort(sortByStartDate);

  const approvedBookings = filteredBookings
    .filter((booking) => booking.status === "approved")
    .sort(sortByStartDate);

  const declinedBookings = filteredBookings
    .filter((booking) => booking.status === "declined")
    .sort(sortByStartDate);

  // 📌 Handle message change
  const handleMessageChange = (id, message) => {
    setMessages({
      ...messages,
      [id]: message, // Update the message for the specific booking
    });
  };

  const sendOffer = async (id) => {
    try {
      const res = await fetch(
        "https://pierino-backend-a1790776fc10.herokuapp.com/send-offer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Offerte succesvol verzonden!");
      } else {
        alert("Fout bij verzenden: " + data.error);
      }
    } catch (error) {
      alert("Netwerkfout bij verzenden van offerte.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border animate-spin" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Pending Bookings Section */}
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full md:w-1/3"
            />

            <h3 className="text-xl font-semibold mb-2">Pending Bookings</h3>
            {pendingBookings.length === 0 ? (
              <p>No pending bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.name}</h4>
                    <p className="text-gray-600">{booking.email}</p>
                    <p className="text-gray-600">{booking.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        className="border p-1 rounded w-24"
                        value={editedPrices[booking.id] ?? booking.price}
                        onChange={(e) =>
                          handlePriceChange(booking.id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => savePrice(booking.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        💾 Save
                      </button>
                    </div>

                    <p className="text-gray-600">
                      Aantal bezoekers: {booking.attendee_range}
                    </p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.end_datetime).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="datetime-local"
                        className="border p-1 rounded"
                        value={
                          editedEndTimes[booking.id] ??
                          new Date(booking.end_datetime)
                            .toISOString()
                            .slice(0, 16)
                        }
                        onChange={(e) =>
                          handleEndTimeChange(booking.id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => saveEndTime(booking.id)}
                        className="bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        💾 Save End
                      </button>
                    </div>

                    <p className="text-gray-600">
                      Opmerking: {booking.commentary}
                    </p>

                    {booking.wants_invoice && (
                      <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                        <h5 className="font-semibold text-yellow-700">
                          Facturatiegegevens
                        </h5>
                        <p>
                          <strong>BTW-nummer:</strong>{" "}
                          {booking.invoice_vat || "—"}
                        </p>
                        <p>
                          <strong>Bedrijfsnaam:</strong>{" "}
                          {booking.invoice_name || "—"}
                        </p>
                        <p>
                          <strong>Adres:</strong>{" "}
                          {booking.invoice_address || "—"}
                        </p>
                      </div>
                    )}

                    <p className={`font-bold ${statusColors.pending}`}>
                      Status: Pending
                    </p>

                    {/* Message Area */}
                    <textarea
                      className="mt-2 p-2 border rounded-lg w-full"
                      placeholder="Optional message for the client"
                      value={messages[booking.id] || ""}
                      onChange={(e) =>
                        handleMessageChange(booking.id, e.target.value)
                      }
                    ></textarea>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => sendOffer(booking.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Stuur Offerte
                      </button>
                      <button
                        onClick={() => updateBooking(booking.id, "approved")}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => updateBooking(booking.id, "declined")}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg"
                      >
                        ❌ Decline
                      </button>
                      <br />
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Bookings Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Approved Bookings</h3>
            {approvedBookings.length === 0 ? (
              <p>No approved bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.name}</h4>
                    <p className="text-gray-600">{booking.email}</p>
                    <p className="text-gray-600">{booking.location}</p>
                    <p className="text-gray-600">Offerte: € {booking.price}</p>
                    <p className="text-gray-600">
                      Aantal bezoekers: {booking.attendee_range}
                    </p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.end_datetime).toLocaleString()}
                    </p>

                    <p className="text-gray-600">
                      Opmerking: {booking.commentary}
                    </p>

                    {booking.wants_invoice && (
                      <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                        <h5 className="font-semibold text-yellow-700">
                          Facturatiegegevens
                        </h5>
                        <p>
                          <strong>BTW-nummer:</strong>{" "}
                          {booking.invoice_vat || "—"}
                        </p>
                        <p>
                          <strong>Bedrijfsnaam:</strong>{" "}
                          {booking.invoice_name || "—"}
                        </p>
                        <p>
                          <strong>Adres:</strong>{" "}
                          {booking.invoice_address || "—"}
                        </p>
                      </div>
                    )}

                    <p className={`font-bold ${statusColors.approved}`}>
                      Status: Approved
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declined Bookings Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Declined Bookings</h3>
            {declinedBookings.length === 0 ? (
              <p>No declined bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {declinedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.name}</h4>
                    <p className="text-gray-600">{booking.email}</p>
                    <p className="text-gray-600">{booking.location}</p>
                    <p className="text-gray-600">Offerte: € {booking.price}</p>
                    <p className="text-gray-600">
                      Aantal bezoekers: {booking.attendee_range}
                    </p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.end_datetime).toLocaleString()}
                    </p>

                    <p className="text-gray-600">
                      Opmerking: {booking.commentary}
                    </p>

                    {booking.wants_invoice && (
                      <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                        <h5 className="font-semibold text-yellow-700">
                          Facturatiegegevens
                        </h5>
                        <p>
                          <strong>BTW-nummer:</strong>{" "}
                          {booking.invoice_vat || "—"}
                        </p>
                        <p>
                          <strong>Bedrijfsnaam:</strong>{" "}
                          {booking.invoice_name || "—"}
                        </p>
                        <p>
                          <strong>Adres:</strong>{" "}
                          {booking.invoice_address || "—"}
                        </p>
                      </div>
                    )}

                    <p className={`font-bold ${statusColors.declined}`}>
                      Status: Declined
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManagementScreen;
