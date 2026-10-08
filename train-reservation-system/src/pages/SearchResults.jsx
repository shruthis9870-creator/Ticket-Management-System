import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { searchTrains } from "../services/ticketService";
import TrainCard from "../components/TrainCard";

function SearchResults() {

    const location = useLocation();
    const navigate = useNavigate();

    const searchData = location.state;

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("departure");

    const sortedTrains = useMemo(() => {
        const getDurationMinutes = (duration = "") => {
            const hours = Number(duration.match(/(\d+)\s*h/i)?.[1] || 0);
            const minutes = Number(duration.match(/(\d+)\s*m/i)?.[1] || 0);
            return hours * 60 + minutes;
        };
        const getSortValue = (train) => {
            if (sortBy === "price") return Number(train.price) || 0;
            if (sortBy === "duration") return getDurationMinutes(train.duration);
            if (sortBy === "seats") return Number(train.seats_available) || 0;
            return train.departure_time || "";
        };

        return [...trains].sort((first, second) => {
            const firstValue = getSortValue(first);
            const secondValue = getSortValue(second);
            return typeof firstValue === "number"
                ? firstValue - secondValue
                : firstValue.localeCompare(secondValue);
        });
    }, [sortBy, trains]);

    useEffect(() => {

        if (!searchData) {
            navigate("/");
            return;
        }

        const fetchTrains = async () => {

            setLoading(true);
            setError("");

            try {
                const result = await searchTrains(
                    searchData.from || "",
                    searchData.to || "",
                    searchData.trainNumber || ""
                );
                setTrains(result.trains || []);
            } catch (error) {
                console.error(error);
                setError(
                    "Unable to load trains. Please check your connection or search criteria."
                );
            } finally {
                setLoading(false);
            }

        };

        fetchTrains();

    }, [navigate, searchData]);



    if (!searchData) {
        return null;
    }



    return (

        <div className="results-page">

            <div className="results-header">

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>


                <div>

                    <span>
                        SEARCH RESULTS
                    </span>

                    <h1>
                        {searchData.trainNumber ? (
                            <>
                                Train No. <span>{searchData.trainNumber}</span>
                            </>
                        ) : (
                            <>
                                {searchData.from}
                                <span> → </span>
                                {searchData.to}
                            </>
                        )}
                    </h1>

                    <p>
                        {searchData.travelDate}
                        {" • "}
                        {searchData.passengers} passenger(s)
                        {" • Daily schedule"}
                    </p>

                </div>

            </div>



            <div className="results-content">

                {loading && (

                    <div className="message-box">

                        <div className="loading-circle"></div>

                        <h3>
                            Finding trains...
                        </h3>

                        <p>
                            Please wait while we search available routes.
                        </p>

                    </div>

                )}



                {!loading && error && (

                    <div className="message-box error-box">

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>

                )}



                {!loading &&
                    !error &&
                    trains.length === 0 && (

                        <div className="message-box">

                            <div className="empty-icon">
                                🚆
                            </div>

                            <h3>
                                No trains found
                            </h3>

                            <p>
                                Try another source or destination.
                            </p>

                            <button
                                className="search-button small-button"
                                onClick={() => navigate("/")}
                            >
                                Search Again
                            </button>

                        </div>

                    )}



                {!loading &&
                    !error &&
                    trains.length > 0 && (

                        <>

                            <div className="results-toolbar">
                                <p className="result-count">
                                    <strong>{sortedTrains.length}</strong>{" "}
                                    {sortedTrains.length === 1 ? "train" : "trains"} match your search
                                </p>
                                <label className="sort-control">
                                    <span>Sort by</span>
                                    <select
                                        value={sortBy}
                                        onChange={(event) => setSortBy(event.target.value)}
                                    >
                                        <option value="departure">Departure time</option>
                                        <option value="price">Lowest fare</option>
                                        <option value="duration">Shortest journey</option>
                                        <option value="seats">Most seats available</option>
                                    </select>
                                </label>
                            </div>

                            <div className="train-list">

                                {sortedTrains.map((train) => (

                                    <TrainCard
                                        key={train.id}
                                        train={train}
                                        searchData={searchData}
                                    />

                                ))}

                            </div>

                        </>

                    )}

            </div>

        </div>

    );
}

export default SearchResults;