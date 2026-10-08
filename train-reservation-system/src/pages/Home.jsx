import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [passengers, setPassengers] = useState(1);

    const handleSearch = (event) => {

        event.preventDefault();

        if (!from || !to || !travelDate) {
            alert("Please fill all the fields.");
            return;
        }

        if (from.toLowerCase() === to.toLowerCase()) {
            alert("From and To stations cannot be the same.");
            return;
        }

        navigate("/search", {
            state: {
                from,
                to,
                travelDate,
                passengers
            }
        });

    };


    return (

        <div className="home-page">

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-tag">
                        🚆 SMART TRAIN RESERVATIONS
                    </span>

                    <h1>
                        Your journey starts
                        <span> here.</span>
                    </h1>

                    <p>
                        Search trains, compare routes and reserve
                        your seats easily from one place.
                    </p>

                </div>


                <div className="search-box">

                    <div className="search-title">
                        <h2>Find your train</h2>

                        <p>
                            Enter your journey details
                        </p>
                    </div>


                    <form onSubmit={handleSearch}>

                        <div className="form-grid">

                            <div className="input-group">

                                <label>
                                    From
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Bengaluru"
                                    value={from}
                                    onChange={(e) =>
                                        setFrom(e.target.value)
                                    }
                                />

                            </div>


                            <div className="swap-icon">
                                ⇄
                            </div>


                            <div className="input-group">

                                <label>
                                    To
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Chennai"
                                    value={to}
                                    onChange={(e) =>
                                        setTo(e.target.value)
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Travel Date
                                </label>

                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) =>
                                        setTravelDate(e.target.value)
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Passengers
                                </label>

                                <select
                                    value={passengers}
                                    onChange={(e) =>
                                        setPassengers(Number(e.target.value))
                                    }
                                >

                                    <option value={1}>1 Passenger</option>
                                    <option value={2}>2 Passengers</option>
                                    <option value={3}>3 Passengers</option>
                                    <option value={4}>4 Passengers</option>
                                    <option value={5}>5 Passengers</option>

                                </select>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="search-button"
                        >
                            🔍 Search Trains
                        </button>

                    </form>

                </div>

            </section>


            <section className="features">

                <div className="section-heading">

                    <span>WHY RAILEASE?</span>

                    <h2>
                        Everything you need for your journey
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Easy Search
                        </h3>

                        <p>
                            Quickly find trains based on
                            your source and destination.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            🎫
                        </div>

                        <h3>
                            Simple Booking
                        </h3>

                        <p>
                            Reserve your seats using a
                            simple and beginner-friendly form.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            📋
                        </div>

                        <h3>
                            Manage Reservations
                        </h3>

                        <p>
                            View your reservations and
                            cancel bookings when required.
                        </p>

                    </div>

                </div>

            </section>

        </div>

    );
}

export default Home;