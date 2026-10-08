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
import Admin from "./pages/admin";


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
                    <Route
                        path="/admin"
                        element={<Admin />}
                    />

                </Routes>

            </main>

            <Footer />

        </BrowserRouter>

    );

}

export default App;
