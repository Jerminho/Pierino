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

  // 📌 Fetch bookings from the backend
  useEffect(() => {
    axios
      .get("https://offerte-backend-112de817f722.herokuapp.com/bookings") // Fetch bookings with status info
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

  // 📌 Handle Approve/Decline Booking
  const updateBooking = async (id, status) => {
    try {
      const message = messages[id] || ""; // Get the message for this booking (if any)
      const response = await axios.post(
        "https://offerte-backend-112de817f722.herokuapp.com/update-booking",
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

    window.location.reload(); // Reload the page
  };

  // 📌 Handle Deleting a Booking
  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(
        `https://offerte-backend-112de817f722.herokuapp.com/delete-booking/${id}`
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
  const pendingBookings = bookings.filter(
    (booking) => booking.Status === "pending"
  );
  const approvedBookings = bookings.filter(
    (booking) => booking.Status === "approved"
  );
  const declinedBookings = bookings.filter(
    (booking) => booking.Status === "declined"
  );

  // 📌 Handle message change
  const handleMessageChange = (id, message) => {
    setMessages({
      ...messages,
      [id]: message, // Update the message for the specific booking
    });
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
            <h3 className="text-xl font-semibold mb-2">Pending Bookings</h3>
            {pendingBookings.length === 0 ? (
              <p>No pending bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.Id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.Name}</h4>
                    <p className="text-gray-600">{booking.Email}</p>
                    <p className="text-gray-600">{booking.Location}</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.StartDateTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.EndDateTime).toLocaleString()}
                    </p>
                    <p className={`font-bold ${statusColors.pending}`}>
                      Status: Pending
                    </p>

                    {/* Message Area */}
                    <textarea
                      className="mt-2 p-2 border rounded-lg w-full"
                      placeholder="Optional message for the client"
                      value={messages[booking.Id] || ""}
                      onChange={(e) =>
                        handleMessageChange(booking.Id, e.target.value)
                      }
                    ></textarea>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => updateBooking(booking.Id, "approved")}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => updateBooking(booking.Id, "declined")}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg"
                      >
                        ❌ Decline
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
                    key={booking.Id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.Name}</h4>
                    <p className="text-gray-600">{booking.Email}</p>
                    <p className="text-gray-600">{booking.Location}</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.StartDateTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.EndDateTime).toLocaleString()}
                    </p>
                    <p className={`font-bold ${statusColors.approved}`}>
                      Status: Approved
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.Id)}
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
                    key={booking.Id}
                    className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <h4 className="text-lg font-semibold">{booking.Name}</h4>
                    <p className="text-gray-600">{booking.Email}</p>
                    <p className="text-gray-600">{booking.Location}</p>
                    <p className="text-gray-600">
                      Start: {new Date(booking.StartDateTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End: {new Date(booking.EndDateTime).toLocaleString()}
                    </p>
                    <p className={`font-bold ${statusColors.declined}`}>
                      Status: Declined
                    </p>
                    <br />
                    <button
                      onClick={() => deleteBooking(booking.Id)}
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
