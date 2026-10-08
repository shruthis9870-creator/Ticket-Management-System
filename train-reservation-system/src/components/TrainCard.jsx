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

        <div className="train-card">

            <div className="train-top">

                <div>

                    <span className="train-number">
                        {train.train_number}
                    </span>

                    <h2>
                        {train.train_name}
                    </h2>

                </div>

                <div className="class-badge">
                    {train.train_class}
                </div>

            </div>


            <div className="journey">

                <div className="time-section">

                    <strong>
                        {train.departure_time}
                    </strong>

                    <span>
                        {train.source}
                    </span>

                </div>


                <div className="journey-line">

                    <span>●</span>

                    <div></div>

                    <span>●</span>

                </div>


                <div className="time-section">

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
                    <span>Duration</span>
                    <strong>{train.duration}</strong>
                </div>

                <div>
                    <span>Available</span>
                    <strong>{train.seats_available} seats</strong>
                </div>

                <div>
                    <span>Fare</span>
                    <strong>₹{train.price}</strong>
                </div>

            </div>


            <button
                className="book-button"
                onClick={handleBooking}
            >
                Book Now →
            </button>

        </div>

    );
}

export default TrainCard;