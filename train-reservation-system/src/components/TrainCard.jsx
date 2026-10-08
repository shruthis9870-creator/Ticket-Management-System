import { useNavigate } from "react-router-dom";

function TrainCard({ train, searchData }) {

    const navigate = useNavigate();

    const handleBooking = () => {

        navigate("/booking", {
            state: {
                train: train,
                travelDate: searchData.travelDate,
                passengers: searchData.passengers
            }
        });

    };

    return (

        <article className="train-card">

            <div className="train-top">

                <div>

                    <span className="train-number">
                        Train {train.train_number}
                    </span>

                    <h2>
                        {train.train_name}
                    </h2>

                </div>

                <div className="class-badge" title="Travel class">
                    Class {train.train_class}
                </div>

            </div>


            <div className="journey">

                <div className="time-section">

                    <span className="station-label">DEPARTS</span>
                    <strong>
                        {train.departure_time}
                    </strong>

                    <span>
                        {train.source}
                    </span>

                </div>


                <div className="journey-connector">
                    <small>{train.duration}</small>
                    <div className="journey-line">
                        <span>●</span>
                        <div></div>
                        <span>●</span>
                    </div>
                </div>


                <div className="time-section">

                    <span className="station-label">ARRIVES</span>
                    <strong>
                        {train.arrival_time}
                    </strong>

                    <span>
                        {train.destination}
                    </span>

                </div>

            </div>


            <div className="train-info">
                <div>
                    <span>Seats available</span>
                    <strong>{train.seats_available} seats</strong>
                </div>

                <div>
                    <span>Fare per passenger</span>
                    <strong>₹{Number(train.price).toLocaleString("en-IN")}</strong>
                </div>

            </div>


            <button
                className="book-button"
                onClick={handleBooking}
            >
                Book Now →
            </button>

        </article>

    );
}

export default TrainCard;