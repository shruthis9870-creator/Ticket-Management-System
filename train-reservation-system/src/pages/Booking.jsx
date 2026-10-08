import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../services/supabase";

function Booking() {

    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    const train = bookingData?.train;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [seats, setSeats] = useState(
        bookingData?.passengers || 1
    );

    const [loading, setLoading] = useState(false);



    if (!train) {

        return (

            <div className="message-box">

                <h2>
                    No train selected
                </h2>

                <button
                    className="search-button"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>

            </div>

        );

    }



    const totalAmount = train.price * seats;



    const handleBooking = async (event) => {

        event.preventDefault();

        if (!name || !email) {

            alert("Please enter your name and email.");

            return;

        }


        setLoading(true);


        const { error } = await supabase
            .from("reservations")
            .insert([

                {
                    passenger_name: name,
                    email: email,
                    train_id: train.id,
                    travel_date: bookingData.travelDate,
                    seats: seats,
                    total_amount: totalAmount,
                    status: "Confirmed"
                }

            ]);



        if (error) {

            console.error(error);

            alert(
                "Booking failed. Please try again."
            );

            setLoading(false);

            return;

        }



        alert(
            "🎉 Booking confirmed successfully!"
        );


        navigate("/reservations", {
            state: {
                email: email
            }
        });


        setLoading(false);

    };



    return (

        <div className="booking-page">

            <div className="booking-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <span>
                    COMPLETE YOUR BOOKING
                </span>

                <h1>
                    Reserve your seat
                </h1>

                <p>
                    Enter your passenger details below.
                </p>

            </div>



            <div className="booking-layout">


                {/* FORM */}

                <div className="booking-form-card">

                    <h2>
                        Passenger Details
                    </h2>

                    <p className="form-description">
                        Please enter the details of the passenger.
                    </p>


                    <form onSubmit={handleBooking}>

                        <div className="input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter passenger name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Number of Seats
                            </label>

                            <select
                                value={seats}
                                onChange={(e) =>
                                    setSeats(Number(e.target.value))
                                }
                            >

                                {Array.from(
                                    {
                                        length: Math.min(
                                            train.seats_available,
                                            5
                                        )
                                    },
                                    (_, index) => (

                                        <option
                                            key={index + 1}
                                            value={index + 1}
                                        >
                                            {index + 1}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <button
                            type="submit"
                            className="search-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Booking..."
                                : "🎫 Confirm Booking"
                            }

                        </button>

                    </form>

                </div>



                {/* SUMMARY */}

                <div className="booking-summary">

                    <div className="summary-label">
                        YOUR JOURNEY
                    </div>

                    <h2>
                        {train.train_name}
                    </h2>

                    <span className="train-number">
                        {train.train_number}
                    </span>


                    <div className="summary-route">

                        <div>

                            <strong>
                                {train.departure_time}
                            </strong>

                            <span>
                                {train.source}
                            </span>

                        </div>


                        <div className="summary-arrow">
                            →
                        </div>


                        <div>

                            <strong>
                                {train.arrival_time}
                            </strong>

                            <span>
                                {train.destination}
                            </span>

                        </div>

                    </div>


                    <div className="summary-details">

                        <div>
                            <span>Date</span>
                            <strong>
                                {bookingData.travelDate}
                            </strong>
                        </div>

                        <div>
                            <span>Class</span>
                            <strong>
                                {train.train_class}
                            </strong>
                        </div>

                        <div>
                            <span>Seats</span>
                            <strong>
                                {seats}
                            </strong>
                        </div>

                    </div>


                    <div className="price-box">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{totalAmount}
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Booking;