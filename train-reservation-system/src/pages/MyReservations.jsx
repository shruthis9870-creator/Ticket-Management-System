import { useState } from "react";
import { supabase } from "../services/supabase";

function MyReservations() {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchReservations = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        trains (
          train_number,
          train_name,
          source,
          destination,
          departure_time,
          arrival_time
        )
      `)
      .eq("email", email);

    if (error) {
      console.error(error);
      setMessage("Unable to load reservations.");
      setReservations([]);
    } else {
      setReservations(data || []);

      if (!data || data.length === 0) {
        setMessage("No reservations found for this email.");
      }
    }

    setLoading(false);
  };

  const cancelReservation = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmCancel) {
      return;
    }

    const { error } = await supabase
      .from("reservations")
      .update({ status: "Cancelled" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not cancel the reservation.");
      return;
    }

    alert("Reservation cancelled successfully.");

    searchReservations();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Reservations</h1>
        <p>Search and manage your train bookings.</p>
      </div>

      <div className="reservation-search">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={searchReservations}>
          {loading ? "Searching..." : "Search Reservations"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="reservation-list">
        {reservations.map((reservation) => (
          <div className="reservation-card" key={reservation.id}>
            <div>
              <h2>{reservation.trains?.train_name}</h2>

              <p>
                <strong>Train:</strong>{" "}
                {reservation.trains?.train_number}
              </p>

              <p>
                <strong>Route:</strong>{" "}
                {reservation.trains?.source} →{" "}
                {reservation.trains?.destination}
              </p>

              <p>
                <strong>Passenger:</strong>{" "}
                {reservation.passenger_name}
              </p>

              <p>
                <strong>Travel Date:</strong>{" "}
                {reservation.travel_date}
              </p>

              <p>
                <strong>Seats:</strong> {reservation.seats}
              </p>

              <p>
                <strong>Total Amount:</strong> ₹
                {reservation.total_amount}
              </p>

              <p>
                <strong>Status:</strong> {reservation.status}
              </p>
            </div>

            {reservation.status !== "Cancelled" && (
              <button
                className="cancel-button"
                onClick={() => cancelReservation(reservation.id)}
              >
                Cancel Reservation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReservations;