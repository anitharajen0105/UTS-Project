import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { FaTicketAlt, FaHistory, FaEye, FaWallet, FaUser, FaExchangeAlt } from 'react-icons/fa';
import { backEndUrl } from '../../Auth/AuthComponent/BackEndUrl';

const Tracking = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const fetchBookingHistory = async () => {
    if (!userEmail) {
      console.error('No user email found');
      return;
    }
    const baseUrl = await backEndUrl();

    const url = `${baseUrl}/booking-history?email=${encodeURIComponent(userEmail)}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }
      const data = await response.json();
      setBookings(data);
      navigate('/booking-history', { state: { bookings: data } }); // Pass bookings as state
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };
  

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    if (buttonType === 'Booking History') {
      fetchBookingHistory();
    }
  };

  return (
    <div className="bg-gray-100 p-2 pb-5">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          <Button icon={<FaTicketAlt />} text="Cancel Ticket" isActive={activeButton === 'Cancel Ticket'} onClick={() => handleButtonClick('Cancel Ticket')} />
          <Button icon={<FaHistory />} text="Booking History" isActive={activeButton === 'Booking History'} onClick={() => handleButtonClick('Booking History')} />
          <Button icon={<FaEye />} text="Show Ticket" isActive={activeButton === 'Show Ticket'} onClick={() => handleButtonClick('Show Ticket')} />
          <Button icon={<FaWallet />} text="R-Wallet" isActive={activeButton === 'R-Wallet'} onClick={() => handleButtonClick('R-Wallet')} />
          <Button icon={<FaUser />} text="Profile" isActive={activeButton === 'Profile'} onClick={() => handleButtonClick('Profile')} />
          <Button icon={<FaExchangeAlt />} text="Transactions" isActive={activeButton === 'Transactions'} onClick={() => handleButtonClick('Transactions')} />
        </div>
      </div>
    </div>
  );
};

const Button = ({ icon, text, isActive, onClick }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-2 rounded-md shadow-sm transition-all duration-200 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-white text-gray-700 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`text-2xl mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{icon}</div>
      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{text}</span>
    </button>
  );
};

export default Tracking;
