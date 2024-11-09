import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backEndUrl } from "../../Auth/AuthComponent/BackEndUrl";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting data from location state
  const { departure, arrival, fare } = location.state || {};
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch userId based on email stored in localStorage
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      const fetchUserId = async () => {
        try {
          const baseUrl = await backEndUrl();

          const response = await axios.get(`${baseUrl}/get-user-id`, {
            params: { email },
          });

          if (response.data.userId) {
            setUserId(response.data.userId);
          } else {
            setError("User ID not found");
          }
        } catch (error) {
          setError("Error fetching user ID");
        }
      };

      fetchUserId();
    } else {
      setError("User email not found");
    }
  }, []);

  // Handle the booking confirmation
  const handleConfirmBooking = async () => {
    if (!userId) {
      alert("User ID is required. Please login first.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = await backEndUrl();

      const response = await axios.post(`${baseUrl}/book`, {
        departureTrainId: departure.stationId,
        arrivalTrainId: arrival.stationId,
        userId,
      });

      if (response.data.message === "Booking successful!") {
        setSuccessMessage("Booking successful!");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setError("Error confirming booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-orange-500">
        Confirm Your Booking
      </h1>

      {/* Error message */}
      {error && (
        <div className="text-red-500 bg-red-300 p-2 mb-4 rounded">{error}</div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="text-green-500 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <p className="text-xl font-semibold">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Train details */}
      <div className="bg-gradient-to-r from-orange-200 to-red-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold text-orange-600">Departure Train:</h2>
        <p className="text-red-600">
          {departure?.trainNumber} - {departure?.stationName}
        </p>
      </div>
      <div className="bg-gradient-to-r from-orange-100 to-red-50 p-4 rounded-lg mb-4">
        <h2 className="font-semibold text-orange-600">Arrival Train:</h2>
        <p className="text-red-600">
          {arrival?.trainNumber} - {arrival?.stationName}
        </p>
      </div>
      <div className="bg-gradient-to-r from-orange-100 to-red-50 p-4 rounded-lg mb-4">
        <h2 className="font-semibold text-orange-600">Total Fare:</h2>
        <p className="text-red-600">${fare}</p>
      </div>

      {/* Booking button */}
      <button
        onClick={handleConfirmBooking}
        className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 rounded mt-4 hover:from-orange-600 hover:to-red-500"
        disabled={loading || !userId}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>

      {/* Cancel button to navigate back */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2 hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

export default BookingConfirmation;
