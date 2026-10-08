import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { bookTicket } from "../services/ticketService";
import { downloadTicketPDF } from "../utils/generateTicketPDF";

function Booking() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;
    const train = bookingData?.train;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [seats, setSeats] = useState(bookingData?.passengers || 1);
    const [loading, setLoading] = useState(false);
    const [confirmedTicket, setConfirmedTicket] = useState(null);
    const [downloadNotification, setDownloadNotification] = useState("");

    if (!train) {
        return (
            <div className="message-box">
                <h2>No train selected</h2>
                <p>Please select a train from the search page to proceed with booking.</p>
                <button className="search-button" onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        );
    }

    const totalAmount = train.price * seats;

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!name || !email) {
            alert("Please enter both passenger name and email address.");
            return;
        }

        if (!train) {
            alert("Please select a train before booking.");
            return;
        }

        setLoading(true);

        try {
            const travelDate = bookingData?.travelDate || new Date().toISOString().split("T")[0];
            const ticket = await bookTicket({
                passenger_name: name,
                email: email,
                train: train,
                travel_date: travelDate,
                seats: seats,
                total_amount: totalAmount,
            });

            try {
                const filename = downloadTicketPDF(ticket);
                setDownloadNotification(`Ticket saved to your system: ${filename}`);
            } catch (pdfErr) {
                console.error("PDF generation error:", pdfErr);
                setDownloadNotification("Ticket booked successfully. PDF download could not be generated in this browser.");
            }

            setConfirmedTicket(ticket);
        } catch (err) {
            console.error(err);
            alert("Booking could not be completed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAgain = () => {
        if (!confirmedTicket) return;
        const filename = downloadTicketPDF(confirmedTicket);
        setDownloadNotification(`Downloaded again: ${filename}`);
    };

    // If booking was successful, render the Confirmation & Download View
    if (confirmedTicket) {
        return (
            <div className="booking-page confirmation-page">
                <div className="confirmation-card">
                    <div className="confirmation-header">
                        <div className="success-icon">✓</div>
                        <span className="success-tag">BOOKING CONFIRMED</span>
                        <h1>Your Ticket is Booked!</h1>
                        <p className="confirmation-subtitle">
                            An official E-Ticket has been generated and saved to your system as a PDF.
                        </p>
                        {downloadNotification && (
                            <div className="download-alert">
                                📥 {downloadNotification}
                            </div>
                        )}
                    </div>

                    <div className="confirmed-ticket-box">
                        <div className="ticket-top-strip">
                            <div>
                                <span className="pnr-label">PNR NUMBER</span>
                                <strong className="pnr-code">{confirmedTicket.pnr}</strong>
                            </div>
                            <span className="status-pill status-confirmed">CONFIRMED</span>
                        </div>

                        <div className="ticket-route-overview">
                            <div className="route-col">
                                <span className="station-city">{confirmedTicket.train?.source}</span>
                                <span className="station-time">{confirmedTicket.train?.departure_time}</span>
                            </div>

                            <div className="route-arrow-box">
                                <span className="route-duration">{confirmedTicket.train?.duration}</span>
                                <div className="route-line-decor">────── 🚆 ──────</div>
                            </div>

                            <div className="route-col">
                                <span className="station-city">{confirmedTicket.train?.destination}</span>
                                <span className="station-time">{confirmedTicket.train?.arrival_time}</span>
                            </div>
                        </div>

                        <div className="ticket-meta-grid">
                            <div>
                                <span>Train</span>
                                <strong>{confirmedTicket.train?.train_number} - {confirmedTicket.train?.train_name}</strong>
                            </div>
                            <div>
                                <span>Travel Date</span>
                                <strong>{confirmedTicket.travel_date}</strong>
                            </div>
                            <div>
                                <span>Passenger</span>
                                <strong>{confirmedTicket.passenger_name}</strong>
                            </div>
                            <div>
                                <span>Seats & Class</span>
                                <strong>{confirmedTicket.seats} Seat(s) • {confirmedTicket.train?.train_class}</strong>
                            </div>
                            <div>
                                <span>Total Paid</span>
                                <strong className="price-highlight">₹{confirmedTicket.total_amount}</strong>
                            </div>
                            <div>
                                <span>Email ID</span>
                                <strong>{confirmedTicket.email}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <button
                            type="button"
                            className="download-pdf-btn primary-btn"
                            onClick={handleDownloadAgain}
                        >
                            📥 Download Ticket (PDF)
                        </button>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/reservations", {
                                    state: { email: confirmedTicket.email },
                                })
                            }
                        >
                            📋 View in My Reservations
                        </button>

                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => navigate("/")}
                        >
                            🚆 Book Another Train
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <span>COMPLETE YOUR BOOKING</span>
                <h1>Reserve your seat</h1>
                <p>Enter your passenger details below to finalize booking and download your e-ticket.</p>
            </div>

            <div className="booking-layout">
                {/* FORM */}
                <div className="booking-form-card">
                    <h2>Passenger Details</h2>
                    <p className="form-description">
                        Please enter passenger information. Your PDF ticket will be downloaded upon booking.
                    </p>

                    <form onSubmit={handleBooking}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter passenger name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Number of Seats</label>
                            <select
                                value={seats}
                                onChange={(e) => setSeats(Number(e.target.value))}
                            >
                                {Array.from(
                                    {
                                        length: Math.min(
                                            train.seats_available || 5,
                                            5
                                        ),
                                    },
                                    (_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1} {index + 1 === 1 ? "Seat" : "Seats"}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="search-button book-confirm-button"
                            disabled={loading}
                        >
                            {loading ? "Processing Booking..." : "🎫 Confirm & Download Ticket PDF"}
                        </button>
                    </form>
                </div>

                {/* SUMMARY */}
                <div className="booking-summary">
                    <div className="summary-label">YOUR JOURNEY</div>
                    <h2>{train.train_name}</h2>
                    <span className="train-number">{train.train_number}</span>

                    <div className="summary-route">
                        <div>
                            <strong>{train.departure_time}</strong>
                            <span>{train.source}</span>
                        </div>

                        <div className="summary-arrow">→</div>

                        <div>
                            <strong>{train.arrival_time}</strong>
                            <span>{train.destination}</span>
                        </div>
                    </div>

                    <div className="summary-details">
                        <div>
                            <span>Date</span>
                            <strong>{bookingData.travelDate}</strong>
                        </div>

                        <div>
                            <span>Class</span>
                            <strong>{train.train_class}</strong>
                        </div>

                        <div>
                            <span>Seats</span>
                            <strong>{seats}</strong>
                        </div>
                    </div>

                    <div className="price-box">
                        <span>Total Amount</span>
                        <strong>₹{totalAmount}</strong>
                    </div>

                    <div className="pdf-feature-pill">
                        📄 Automatic PDF E-Ticket download included
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;