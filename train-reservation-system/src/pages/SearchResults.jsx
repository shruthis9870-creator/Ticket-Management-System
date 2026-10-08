import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../services/supabase";
import TrainCard from "../components/TrainCard";

function SearchResults() {

    const location = useLocation();
    const navigate = useNavigate();

    const searchData = location.state;

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    useEffect(() => {

        if (!searchData) {
            navigate("/");
            return;
        }

        const fetchTrains = async () => {

            setLoading(true);
            setError("");

            let query = supabase
                .from("trains")
                .select("*");

            if (searchData.trainNumber) {
                query = query.ilike(
                    "train_number",
                    `%${searchData.trainNumber}%`
                );
            } else {
                query = query
                    .ilike("source", `%${searchData.from}%`)
                    .ilike("destination", `%${searchData.to}%`);
            }

            const { data, error } = await query.order("departure_time");

            if (error) {

                console.error(error);

                setError(
                    "Unable to load trains. Please check your Supabase connection."
                );

            } else {

                setTrains(data || []);

            }

            setLoading(false);

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

                            <div className="result-count">

                                <strong>
                                    {trains.length}
                                </strong>

                                {" "}train(s) found

                            </div>


                            <div className="train-list">

                                {trains.map((train) => (

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