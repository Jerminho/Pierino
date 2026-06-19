import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusColors = {
  pending: "text-orange-500",
  approved: "text-green-500",
  declined: "text-red-500",
};

const ManagementScreen = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({}); // State to store messages for each booking
  // State for editable prices
  const [editedPrices, setEditedPrices] = useState({});
  // const [editedEndTimes, setEditedEndTimes] = useState({});
  const [offerInputs, setOfferInputs] = useState({});

  const [submittingBookingId, setSubmittingBookingId] = useState(null);

  // State for search input by name
  const [searchTerm, setSearchTerm] = useState("");

  // Inactivity logout effect
  useEffect(() => {
    let timeout;

    const logoutAfterInactivity = () => {
      localStorage.removeItem("token");
      alert("Session expired due to inactivity. You will be logged out.");
      navigate("/log-in");
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutAfterInactivity, 30 * 60 * 1000); // 5 minutes
    };

    // List of events that indicate user activity
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer),
    );

    resetTimer(); // Start timer on mount

    // Cleanup listeners and timeout on unmount
    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
      clearTimeout(timeout);
    };
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://pierino-70f82f18a24c.herokuapp.com/bookings", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token to backend
        },
      })
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
        `https://pierino-70f82f18a24c.herokuapp.com/bookings/${bookingId}/price`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: newPrice }),
        },
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
  // const handleEndTimeChange = (bookingId, newEndTime) => {
  //   setEditedEndTimes((prev) => ({ ...prev, [bookingId]: newEndTime }));
  // };

  // Handle saving updated end time
  // const saveEndTime = async (bookingId) => {
  //   const newEnd = editedEndTimes[bookingId];
  //   if (!newEnd || isNaN(new Date(newEnd).getTime())) {
  //     alert("Please enter a valid date/time.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `https://pierino-70f82f18a24c.herokuapp.com/bookings/${bookingId}/endtime`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ end_datetime: newEnd }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.error || "Failed to update end time.");
  //     }

  //     alert("End time updated successfully.");
  //     window.location.reload(); // Or optionally refresh local state
  //   } catch (error) {
  //     console.error(error);
  //     alert(error.message);
  //   }
  // };

  // 📌 Handle Approve/Decline Booking
  const updateBooking = async (id, status) => {
    if (submittingBookingId) return; // voorkomt dubbele clicks zolang er al één bezig is
    setSubmittingBookingId(id); // zet deze specifieke booking op "laden..."

    try {
      const message = messages[id] || "";
      const response = await axios.post(
        "https://pierino-70f82f18a24c.herokuapp.com/update-booking",
        { id, status, message },
      );

      if (response.data.success) {
        alert(
          `✅ De status van deze reservatie is bijgewerkt naar '${status}'.`,
        );
        window.location.reload();
      } else {
        alert(
          "⚠️ Kon de status van de reservatie niet bijwerken. Probeer het opnieuw.",
        );
      }
    } catch (error) {
      console.error(`Fout bij het verwerken van de reservatie:`, error);
      alert(
        "Er is een fout opgetreden bij het verwerken van de booking. Heb je eerst een offerte verzonden?",
      );
    } finally {
      setSubmittingBookingId(null); // reset naar geen enkele knop
    }
  };

  // 📌 Handle Deleting a Booking
  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(
        `https://pierino-70f82f18a24c.herokuapp.com/delete-booking/${id}`,
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
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

  // 1️⃣ Add handleInputChange here
  const handleInputChange = (id, field, value) => {
    setOfferInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const sendOffer = async (id) => {
    try {
      const offerData = offerInputs[id] || {};
      const message = messages[id] || "";
      const res = await fetch(
        "https://pierino-70f82f18a24c.herokuapp.com/send-offer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            message,
            transportFee: offerData.transportFee || 20,
            duration: offerData.duration || 60,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        alert("Offerte succesvol verzonden!");
        // ✅ Clear the input fields for this booking
        setOfferInputs((prev) => ({
          ...prev,
          [id]: { transportFee: "", duration: "", message: "" },
        }));

        setMessages((prev) => ({
          ...prev,
          [id]: "",
        }));

        // ✅ Pagina automatisch herladen zodat de knop grijs wordt
        window.location.reload();
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
      <h2 className="text-2xl font-bold mb-4">Reservaties beheren</h2>
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

            <h3 className="text-xl font-semibold mb-2">
              Openstaande reservaties
            </h3>
            {pendingBookings.length === 0 ? (
              <p>Geen openstaande reservaties.</p>
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
  Exact aantal bezoekers: {booking.attendees ?? "Niet beschikbaar"}
</p>

<p className="text-gray-600">
  Prijscategorie: {booking.attendee_range ?? "—"}
</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                    <br />
                    {/* <p className="text-gray-600">
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
                    </div> */}

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
                      Status: Openstaand
                    </p>

                    {/* Transport Fee */}
                    <input
                      type="number"
                      className="mt-2 p-2 border rounded-lg w-full"
                      placeholder="Verplaatsingskosten"
                      value={offerInputs[booking.id]?.transportFee || ""}
                      onChange={(e) =>
                        handleInputChange(
                          booking.id,
                          "transportFee",
                          e.target.value,
                        )
                      }
                      required
                    />

                    {/* Duration */}
                    <input
                      type="number"
                      className="mt-2 p-2 border rounded-lg w-full"
                      placeholder="Duurtijd in minuten"
                      value={offerInputs[booking.id]?.duration || ""}
                      onChange={(e) =>
                        handleInputChange(
                          booking.id,
                          "duration",
                          e.target.value,
                        )
                      }
                      required
                    />

                    {/* Message Area */}
                    <textarea
                      className="mt-2 p-2 border rounded-lg w-full"
                      placeholder="Extra optioneel bericht voor de klant"
                      value={messages[booking.id] || ""}
                      onChange={(e) =>
                        handleMessageChange(booking.id, e.target.value)
                      }
                    ></textarea>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          const transportFee =
                            offerInputs[booking.id]?.transportFee;
                          const duration = offerInputs[booking.id]?.duration;

                          if (!transportFee || !duration) {
                            alert(
                              "⚠️ Vul zowel de verplaatsingskosten als de duur in voordat je een offerte verstuurt.",
                            );
                            return; // stop de functie, offerte wordt niet verzonden
                          }

                          if (booking.offer_sent) {
                            const proceed = window.confirm(
                              "⚠️ Er werd al een offerte voor deze booking verstuurd.\n\nWil je toch nog een nieuwe offerte versturen?",
                            );
                            if (!proceed) return; // gebruiker heeft geannuleerd
                          }
                          sendOffer(booking.id); // verstuur (eerste keer of opnieuw)
                        }}
                        className={`font-bold py-1 px-2 rounded mr-2 ${
                          booking.offer_sent
                            ? "bg-gray-400 hover:bg-gray-500 text-white"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                      >
                        {booking.offer_sent ? "Stuur opnieuw" : "Stuur Offerte"}
                      </button>
                      <button
                        onClick={() => updateBooking(booking.id, "approved")}
                        disabled={submittingBookingId === booking.id}
                        className={`bg-green-500 text-white py-1 px-3 rounded-lg transition-all duration-300 ${
                          submittingBookingId === booking.id
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {submittingBookingId === booking.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Aanvaarden...
                          </div>
                        ) : (
                          "Aanvaard"
                        )}
                      </button>

                      <button
                        onClick={() => updateBooking(booking.id, "declined")}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg"
                      >
                        Weiger
                      </button>
                      <br />
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                      >
                        Verwijder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Bookings Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">
              Bevestigde reservaties
            </h3>
            {approvedBookings.length === 0 ? (
              <p>Geen bevestigde reservaties.</p>
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
  Exact aantal bezoekers: {booking.attendees ?? "Niet beschikbaar"}
</p>

<p className="text-gray-600">
  Prijscategorie: {booking.attendee_range ?? "—"}
</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                    <br />
                    {/* <p className="text-gray-600">
                      End: {new Date(booking.end_datetime).toLocaleString()}
                    </p> */}

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
                      Status: Aanvaard
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                    >
                      Verwijder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declined Bookings Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">
              Geweigerde reservaties
            </h3>
            {declinedBookings.length === 0 ? (
              <p>Geen geweigerde reservaties.</p>
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
  Exact aantal bezoekers: {booking.attendees ?? "Niet beschikbaar"}
</p>

<p className="text-gray-600">
  Prijscategorie: {booking.attendee_range ?? "—"}
</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.start_datetime).toLocaleString()}
                    </p>{" "}
                    <br />
                    {/* <p className="text-gray-600">
                      End: {new Date(booking.end_datetime).toLocaleString()}
                    </p> */}
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
                      Status: Geweigerd
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-gray-500 text-white py-1 px-3 rounded-lg mt-2"
                    >
                      Verwijder
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
