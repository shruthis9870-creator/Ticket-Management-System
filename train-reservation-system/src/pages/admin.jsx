import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../services/supabase";

function Admin() {
    const [trains, setTrains] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [error, setError] = useState("");

    const [trainForm, setTrainForm] = useState({
        train_number: "",
        train_name: "",
        source: "",
        destination: "",
        departure_time: "",
        arrival_time: "",
        duration: "",
        seats_available: "",
        price: "",
        train_class: "SL",
    });

    // Load trains and reservations
    useEffect(() => {
        if (!isSupabaseConfigured) {
            return;
        }

        const loadData = async () => {
            const trainResult = await supabase
                .from("trains")
                .select("*")
                .order("train_number");

            const reservationResult = await supabase
                .from("reservations")
                .select(
                    "id, passenger_name, email, travel_date, seats, total_amount, status, created_at, trains(train_number, train_name, source, destination)"
                )
                .order("created_at", { ascending: false });

            if (trainResult.error) {
                console.error(trainResult.error);
                setError(trainResult.error.message);
            } else {
                setTrains(trainResult.data || []);
            }

            if (reservationResult.error) {
                console.error(reservationResult.error);
                setError(reservationResult.error.message);
            } else {
                setReservations(reservationResult.data || []);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    // Input change
    const handleChange = (e) => {
        setTrainForm({
            ...trainForm,
            [e.target.name]: e.target.value,
        });
    };

    // Add train
    const handleAddTrain = async (e) => {
        e.preventDefault();

        setError("");

        if (!isSupabaseConfigured) {
            setError("Supabase is not configured.");
            return;
        }

        const newTrain = {
            train_number: trainForm.train_number,
            train_name: trainForm.train_name,
            source: trainForm.source,
            destination: trainForm.destination,
            departure_time: trainForm.departure_time,
            arrival_time: trainForm.arrival_time,
            duration: trainForm.duration,
            seats_available: Number(trainForm.seats_available),
            price: Number(trainForm.price),
            train_class: trainForm.train_class,
        };

        const { data, error } = await supabase
            .from("trains")
            .insert([newTrain])
            .select()
            .single();

        if (error) {
            console.error(error);
            setError(error.message);
            return;
        }

        // Show new train immediately
        setTrains((oldTrains) => [...oldTrains, data]);

        // Clear form
        setTrainForm({
            train_number: "",
            train_name: "",
            source: "",
            destination: "",
            departure_time: "",
            arrival_time: "",
            duration: "",
            seats_available: "",
            price: "",
            train_class: "SL",
        });

        alert("Train added successfully!");
    };

    const confirmedReservations = reservations.filter(
        (reservation) => reservation.status === "Confirmed"
    ).length;

    return (
        <div className="page-container admin-page">

            {/* HEADER */}
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage trains and reservations</p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="message">
                    {error}
                </div>
            )}

            {!isSupabaseConfigured && (
                <div className="message">
                    Supabase is not configured.
                </div>
            )}

            {isSupabaseConfigured && (
                <>
                    {/* STATS */}
                    <div className="admin-stats">

                        <section className="admin-stat">
                            <span>Total Trains</span>
                            <strong>
                                {loading ? "..." : trains.length}
                            </strong>
                        </section>

                        <section className="admin-stat">
                            <span>Reservations</span>
                            <strong>
                                {loading ? "..." : reservations.length}
                            </strong>
                        </section>

                        <section className="admin-stat">
                            <span>Confirmed</span>
                            <strong>
                                {loading ? "..." : confirmedReservations}
                            </strong>
                        </section>

                    </div>

                    {/* ADD TRAIN FORM */}
                    <section className="admin-section">

                        <h2>➕ Add Train</h2>

                        <form
                            className="admin-train-form"
                            onSubmit={handleAddTrain}
                        >

                            <input
                                type="text"
                                name="train_number"
                                placeholder="Train Number"
                                value={trainForm.train_number}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="train_name"
                                placeholder="Train Name"
                                value={trainForm.train_name}
                                onChange={handleChange}
                                required
                            />

                            {/* Adjusted Source Placeholder */}
                            <input
                                type="text"
                                name="source"
                                placeholder="From Station (Source)"
                                value={trainForm.source}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="destination"
                                placeholder="To Station (Destination)"
                                value={trainForm.destination}
                                onChange={handleChange}
                                required
                            />

                            {/* Grouped Departure Time Label and Input into single flex row */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
                                    Departure Time
                                </label>
                                <input
                                    type="time"
                                    name="departure_time"
                                    value={trainForm.departure_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
                                    Arrival Time
                                </label>
                                <input
                                    type="time"
                                    name="arrival_time"
                                    value={trainForm.arrival_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <input
                                type="text"
                                name="duration"
                                placeholder="Journey Duration (e.g. 4h 30m)"
                                value={trainForm.duration}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="seats_available"
                                placeholder="Available Seats"
                                value={trainForm.seats_available}
                                onChange={handleChange}
                                min="1"
                                required
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Ticket Price"
                                value={trainForm.price}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                            <select
                                name="train_class"
                                value={trainForm.train_class}
                                onChange={handleChange}
                                required
                            >
                                <option value="SL">Sleeper (SL)</option>
                                <option value="CC">Chair Car (CC)</option>
                                <option value="2S">Second Sitting (2S)</option>
                                <option value="3A">AC 3 Tier (3A)</option>
                            </select>

                            <button type="submit">
                                ➕ Add Train
                            </button>

                        </form>

                    </section>

                    {/* TRAIN DETAILS */}
                    <section className="admin-section">

                        <h2>🚆 Train Details</h2>

                        {loading ? (
                            <p>Loading trains...</p>
                        ) : trains.length === 0 ? (
                            <p className="admin-empty">
                                No trains found.
                            </p>
                        ) : (

                            <div className="admin-table-wrap">

                                <table className="admin-table">

                                    <thead>
                                        <tr>
                                            <th>Train Number</th>
                                            <th>Train Name</th>
                                            <th>Route</th>
                                            <th>Departure</th>
                                            <th>Arrival</th>
                                            <th>Duration</th>
                                            <th>Class</th>
                                            <th>Seats</th>
                                            <th>Fare</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {trains.map((train) => (

                                            <tr key={train.id}>

                                                <td>
                                                    {train.train_number}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {train.train_name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {train.source} →{" "}
                                                    {train.destination}
                                                </td>

                                                <td>
                                                    {train.departure_time}
                                                </td>

                                                <td>
                                                    {train.arrival_time}
                                                </td>

                                                <td>
                                                    {train.duration}
                                                </td>

                                                <td>
                                                    {train.train_class}
                                                </td>

                                                <td>
                                                    {train.seats_available}
                                                </td>

                                                <td>
                                                    ₹{train.price}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                    {/* RESERVATIONS */}
                    <section className="admin-section">

                        <h2>📋 Reservations</h2>

                        {reservations.length === 0 ? (

                            <p className="admin-empty">
                                No reservations yet.
                            </p>

                        ) : (

                            <div className="admin-table-wrap">

                                <table className="admin-table">

                                    <thead>
                                        <tr>
                                            <th>Passenger</th>
                                            <th>Train</th>
                                            <th>Travel Date</th>
                                            <th>Seats</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {reservations.map(
                                            (reservation) => (

                                                <tr key={reservation.id}>

                                                    <td>
                                                        <strong>
                                                            {
                                                                reservation.passenger_name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                reservation.email
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {
                                                            reservation.trains
                                                                ?.train_name ||
                                                            "Train unavailable"
                                                        }

                                                        <span>
                                                            {
                                                                reservation
                                                                    .trains
                                                                    ?.train_number ||
                                                                ""
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {
                                                            reservation.travel_date
                                                        }
                                                    </td>

                                                    <td>
                                                        {reservation.seats}
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {
                                                            reservation.total_amount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            reservation.status
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </>
            )}

        </div>
    );
}

export default Admin;