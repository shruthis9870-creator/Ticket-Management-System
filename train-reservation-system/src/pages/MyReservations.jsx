import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { getReservations, cancelReservation } from "../services/ticketService";
import { downloadTicketPDF } from "../utils/generateTicketPDF";

function MyReservations() {
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [downloadMsg, setDownloadMsg] = useState("");

    const searchReservations = useCallback(
        async (searchEmail) => {
            const targetEmail = (searchEmail || "").trim();
            if (!targetEmail) {
                setMessage("Please enter your email address to look up reservations.");
                return;
            }

            setLoading(true);
            setMessage("");
            setDownloadMsg("");

            try {
                const data = await getReservations(targetEmail);
                setReservations(data || []);

                if (!data || data.length === 0) {
                    setMessage("No reservations found for this email address.");
                }
            } catch (err) {
                console.error(err);
                setMessage("Unable to load reservations. Please try again.");
                setReservations([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Auto-search if email was passed from Booking page
    useEffect(() => {
        const bookingEmail = location.state?.email;
        if (bookingEmail) {
            Promise.resolve().then(() => searchReservations(bookingEmail));
        }
    }, [location.state?.email, searchReservations]);

    const handleDownload = (reservation) => {
        try {
            const filename = downloadTicketPDF(reservation);
            setDownloadMsg(`Ticket saved to your system: ${filename}`);
            setTimeout(() => setDownloadMsg(""), 6000);
        } catch (e) {
            console.error(e);
            alert("Could not generate PDF. Please try again.");
        }
    };

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this reservation?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            await cancelReservation(id);
            alert("Reservation cancelled successfully.");
            searchReservations(email);
        } catch (err) {
            console.error(err);
            alert("Could not cancel the reservation.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Reservations</h1>
                <p>Search, manage and download PDF e-tickets for your train journeys.</p>
            </div>

            <div className="reservation-search">
                <input
                    type="email"
                    placeholder="Enter your registered email (e.g. traveler@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchReservations(email)}
                />

                <button onClick={() => searchReservations(email)}>
                    {loading ? "Searching..." : "🔍 Search Reservations"}
                </button>
            </div>

            {downloadMsg && (
                <div className="download-alert-floating">
                    📥 {downloadMsg}
                </div>
            )}

            {message && <p className="message">{message}</p>}

            <div className="reservation-list">
                {reservations.map((reservation) => {
                    const trainInfo = reservation.train || reservation.trains || {};
                    const isCancelled = reservation.status === "Cancelled";

                    return (
                        <div
                            className={`reservation-card ${
                                isCancelled ? "card-cancelled" : ""
                            }`}
                            key={reservation.id}
                        >
                            <div className="reservation-card-info">
                                <div className="reservation-card-top">
                                    <h2>{trainInfo.train_name || "Express Train"}</h2>
                                    <span
                                        className={`status-pill ${
                                            isCancelled
                                                ? "status-cancelled"
                                                : "status-confirmed"
                                        }`}
                                    >
                                        {reservation.status}
                                    </span>
                                </div>

                                <div className="reservation-details-grid">
                                    <p>
                                        <strong>PNR:</strong>{" "}
                                        <span className="pnr-badge">
                                            {reservation.pnr ||
                                                `RL${String(reservation.id).padStart(6, "0")}`}
                                        </span>
                                    </p>

                                    <p>
                                        <strong>Train:</strong>{" "}
                                        {trainInfo.train_number}
                                    </p>

                                    <p>
                                        <strong>Route:</strong>{" "}
                                        {trainInfo.source} → {trainInfo.destination}
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
                                        <strong>Class:</strong>{" "}
                                        {trainInfo.train_class || "CC"}
                                    </p>
                                </div>
                            </div>

                            <div className="reservation-card-actions">
                                <button
                                    type="button"
                                    className="download-pdf-btn action-download"
                                    onClick={() => handleDownload(reservation)}
                                    title="Download and save this ticket as PDF"
                                >
                                    📥 Download PDF
                                </button>

                                {!isCancelled && (
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => handleCancel(reservation.id)}
                                    >
                                        Cancel Reservation
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyReservations;