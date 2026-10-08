<<<<<<< Updated upstream
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import MyReservations from "./pages/MyReservations";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <main>

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/search"
                        element={<SearchResults />}
                    />

                    <Route
                        path="/booking"
                        element={<Booking />}
                    />

                    <Route
                        path="/reservations"
                        element={<MyReservations />}
                    />

                </Routes>

            </main>

            <Footer />

        </BrowserRouter>

    );

}

export default App;
=======
import React, { useState } from 'react';

const TRAIN_DATA = [
  { id: 'T101', name: 'Express Special 1201', from: 'Bengaluru', to: 'Chennai', dep: '06:00 AM', arr: '11:30 AM', fare: 450 },
  { id: 'T102', name: 'Rajdhani Express 1205', from: 'Bengaluru', to: 'Delhi', dep: '08:15 PM', arr: '06:00 AM', fare: 2100 },
  { id: 'T103', name: 'Intercity Superfast 1261', from: 'Chennai', to: 'Hyderabad', dep: '02:30 PM', arr: '09:45 PM', fare: 680 }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [classSelect, setClassSelect] = useState('Sleeper (SL)');

  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);

  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [chosenSeat, setChosenSeat] = useState('S1');
  const [selectedMeal, setSelectedMeal] = useState('None|0');

  const [userBookings, setUserBookings] = useState([]);
  const [pnrQuery, setPnrQuery] = useState('');
  const [pnrStatusMsg, setPnrStatusMsg] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    setIsLoggedIn(true);
    setSearchResults(TRAIN_DATA);
  };

  const searchTrains = () => {
    const matches = TRAIN_DATA.filter(t => 
      t.from.toLowerCase().includes(fromStation.toLowerCase()) &&
      t.to.toLowerCase().includes(toStation.toLowerCase())
    );
    setSearchResults(matches);
  };

  const openBookingModal = (train) => {
    setSelectedTrain(train);
    setSelectedMeal('None|0');
  };

  const getMealCost = () => parseInt(selectedMeal.split('|')[1], 10);
  const getTotalFare = () => (selectedTrain ? selectedTrain.fare + getMealCost() : 0);

  const processPayment = () => {
    if (!passengerName || !passengerAge) {
      alert('Please fill in passenger name and age!');
      return;
    }

    const pnr = 'PNR' + Math.floor(10000000 + Math.random() * 90000000);
    const mealName = selectedMeal.split('|')[0];

    const newBooking = {
      pnr,
      trainName: selectedTrain.name,
      from: selectedTrain.from,
      to: selectedTrain.to,
      passengerName,
      age: passengerAge,
      date: travelDate || 'Tomorrow',
      classTier: classSelect,
      seat: chosenSeat,
      meal: mealName,
      fare: getTotalFare(),
      status: 'CONFIRMED'
    };

    setUserBookings([newBooking, ...userBookings]);
    setSelectedTrain(null);
    setPassengerName('');
    setPassengerAge('');
    alert(`Booking Confirmed!\nPNR: ${pnr}\nMeal Plan: ${mealName}\nTotal Paid: ₹${getTotalFare()}`);
  };

  const cancelTicket = (index) => {
    if (confirm('Cancel this booking?')) {
      const updated = [...userBookings];
      updated.splice(index, 1);
      setUserBookings(updated);
    }
  };

  const trackPNR = () => {
    const found = userBookings.find(b => b.pnr.toLowerCase() === pnrQuery.trim().toLowerCase());
    if (found) {
      setPnrStatusMsg({ success: true, text: `Status: ${found.status} (${found.trainName} - Seat ${found.seat} | Meal: ${found.meal})` });
    } else {
      setPnrStatusMsg({ success: false, text: `No record found for PNR: ${pnrQuery}` });
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.authOverlay}>
        <div style={styles.authCard}>
          <h2 style={{ color: '#0056b3', marginBottom: '15px', textAlign: 'center' }}>🚂 Welcome to RailConnect</h2>
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password (Min 8 Characters)</label>
              <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
            </div>
            <button type="submit" style={styles.btnPrimary}>Sign In / Register</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <header style={styles.navbar}>
        <h1>🚂 RailConnect Portal</h1>
        <button onClick={() => setIsLoggedIn(false)} style={styles.btnDanger}>Logout</button>
      </header>

      <main style={styles.mainContainer}>
        {/* Search Section */}
        <section style={styles.card}>
          <h2 style={{ color: '#0056b3', marginBottom: '15px' }}>Find & Book Trains</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>From Station</label>
              <input style={styles.input} type="text" placeholder="e.g. Bengaluru" value={fromStation} onChange={e => setFromStation(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>To Station</label>
              <input style={styles.input} type="text" placeholder="e.g. Chennai" value={toStation} onChange={e => setToStation(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Travel Date</label>
              <input style={styles.input} type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class Tier</label>
              <select style={styles.input} value={classSelect} onChange={e => setClassSelect(e.target.value)}>
                <option value="Sleeper (SL)">Sleeper (SL)</option>
                <option value="AC 3 Tier (3A)">AC 3 Tier (3A)</option>
                <option value="AC 2 Tier (2A)">AC 2 Tier (2A)</option>
                <option value="AC 1st Class (1A)">AC 1st Class (1A)</option>
              </select>
            </div>
          </div>
          <button onClick={searchTrains} style={{ ...styles.btnPrimary, width: '100%' }}>Search Available Trains</button>
        </section>

        {/* Search Results */}
        <div>
          <h3>Available Trains</h3>
          {searchResults.length === 0 ? (
            <p style={{ color: '#888', marginTop: '10px' }}>No trains found.</p>
          ) : (
            searchResults.map(t => (
              <div key={t.id} style={styles.trainItem}>
                <div>
                  <h4 style={{ color: '#0056b3', fontSize: '18px' }}>{t.name}</h4>
                  <p><strong>{t.from} ➔ {t.to}</strong></p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Departs: {t.dep} | Arrives: {t.arr}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>₹{t.fare}</div>
                  <button onClick={() => openBookingModal(t)} style={styles.btnSuccess}>Book Seat</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Modal */}
        {selectedTrain && (
          <section style={{ ...styles.card, border: '2px solid #0056b3', marginTop: '20px' }}>
            <h3>Configure Booking: {selectedTrain.name}</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Passenger Name</label>
                <input style={styles.input} type="text" placeholder="Full Name" value={passengerName} onChange={e => setPassengerName(e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Age</label>
                <input style={styles.input} type="number" placeholder="Age" value={passengerAge} onChange={e => setPassengerAge(e.target.value)} />
              </div>
            </div>

            <label style={styles.label}>Select Seat Number</label>
            <div style={styles.seatGrid}>
              {Array.from({ length: 18 }, (_, i) => `S${i + 1}`).map(seat => (
                <div
                  key={seat}
                  onClick={() => setChosenSeat(seat)}
                  style={{
                    ...styles.seatBtn,
                    backgroundColor: chosenSeat === seat ? '#0056b3' : '#fff',
                    color: chosenSeat === seat ? '#fff' : '#000'
                  }}
                >
                  {seat}
                </div>
              ))}
            </div>

            {/* Food Catering Option */}
            <div style={styles.foodSection}>
              <h4 style={{ color: '#0056b3', marginBottom: '8px' }}>🍕 Add On-Board Catering / Meals</h4>
              <div style={styles.formGroup}>
                <label style={styles.label}>Choose Meal Plan</label>
                <select style={styles.input} value={selectedMeal} onChange={e => setSelectedMeal(e.target.value)}>
                  <option value="None|0">No Meals (₹0)</option>
                  <option value="Veg Thali|150">Veg Thali (+₹150)</option>
                  <option value="Non-Veg Thali|200">Non-Veg Thali (+₹200)</option>
                  <option value="Tea & Evening Snacks|80">Tea & Evening Snacks (+₹80)</option>
                </select>
              </div>
            </div>

            <div style={styles.fareDisplay}>
              Total Fare: <span>₹{getTotalFare()}</span>
            </div>

            <button onClick={processPayment} style={{ ...styles.btnSuccess, width: '100%' }}>Confirm & Pay</button>
          </section>
        )}

        {/* PNR Tracker */}
        <section style={{ ...styles.card, marginTop: '25px' }}>
          <h2 style={{ color: '#0056b3', marginBottom: '15px' }}>Check PNR Status</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={styles.input} type="text" placeholder="Enter 10-digit PNR Number" value={pnrQuery} onChange={e => setPnrQuery(e.target.value)} />
            <button onClick={trackPNR} style={{ ...styles.btnPrimary, width: '150px' }}>Track</button>
          </div>
          {pnrStatusMsg && (
            <div style={{ marginTop: '15px', color: pnrStatusMsg.success ? 'green' : 'red', fontWeight: 'bold' }}>
              {pnrStatusMsg.text}
            </div>
          )}
        </section>

        {/* Bookings List */}
        <section style={{ ...styles.card, marginTop: '25px' }}>
          <h2 style={{ color: '#0056b3', marginBottom: '15px' }}>Your Reserved Tickets</h2>
          {userBookings.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No active reservations found.</p>
          ) : (
            userBookings.map((t, idx) => (
              <div key={idx} style={styles.ticketPass}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: '#28a745' }}>{t.pnr}</strong>
                  <span style={{ fontSize: '12px', color: '#666' }}>Date: {t.date}</span>
                </div>
                <h4>{t.trainName}</h4>
                <p><strong>Route:</strong> {t.from} ➔ {t.to}</p>
                <p><strong>Passenger:</strong> {t.passengerName} ({t.age} yrs) | <strong>Seat:</strong> {t.seat}</p>
                <p><strong>Food Ordered:</strong> 🍕 {t.meal} | <strong>Total Fare:</strong> ₹{t.fare}</p>
                <button onClick={() => cancelTicket(idx)} style={{ ...styles.btnDanger, fontSize: '12px', padding: '5px 10px', marginTop: '10px' }}>Cancel</button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  body: { backgroundColor: '#f4f6f9', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
  navbar: { backgroundColor: '#0056b3', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mainContainer: { maxWidth: '900px', margin: '30px auto', padding: '0 20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', margin: '15px 0' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#555' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', width: '100%' },
  btnPrimary: { backgroundColor: '#0056b3', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnSuccess: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnDanger: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  authOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  authCard: { background: '#fff', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '380px' },
  trainItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px', background: '#fff' },
  ticketPass: { borderLeft: '6px solid #28a745', background: '#fdfdfd', padding: '15px', borderRadius: '6px', marginBottom: '12px' },
  seatGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: '15px 0' },
  seatBtn: { padding: '8px', border: '1px solid #ccc', textAlign: 'center', borderRadius: '4px', cursor: 'pointer' },
  foodSection: { background: '#fff8e1', border: '1px dashed #ffa000', padding: '12px', borderRadius: '6px', margin: '15px 0' },
  fareDisplay: { fontSize: '18px', fontWeight: 'bold', textAlign: 'right', color: '#0056b3', marginBottom: '15px' }
};
>>>>>>> Stashed changes
