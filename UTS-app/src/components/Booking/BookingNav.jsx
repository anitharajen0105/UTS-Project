  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { FaTicketAlt, FaQrcode, FaBolt, FaSubway, FaCalendarAlt, FaUsers } from 'react-icons/fa';

  const BookingNav = () => {
    const [activeTab, setActiveTab] = useState(null);

    const tabs = [
      { id: 'JourneyTicket', icon: FaTicketAlt, label: 'Journey Ticket', path: '/booking/journey-ticket' },
      { id: 'QRBooking', icon: FaQrcode, label: 'QR Booking', path: '/booking/qr-booking' },
      { id: 'QuickBooking', icon: FaBolt, label: 'Quick Booking', path: '/booking/quick-booking' },
      { id: 'PlatformTicket', icon: FaSubway, label: 'Platform Ticket', path: '/booking/platform-ticket' },
      { id: 'SeasonTicket', icon: FaCalendarAlt, label: 'Season Ticket', path: '/booking/season-ticket' },
      { id: 'CrowdInfo', icon: FaUsers, label: 'Crowd Info', path: '/crowd' },
    ]; 

    return (
      <nav className="bg-gray-100 p-1 pt-2 sm:p-2 rounded-lg shadow-md">
        <ul className="flex justify-between md:justify-center md:gap-2">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-grow md:flex-grow-0">
              <Link to={tab.path}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full h-auto p-1 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-500'
                      : 'text-orange-500 hover:text-orange-600'
                  }`}
                >
                  <div className={`rounded-full p-2 mb-1 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}>
                    <tab.icon className="text-base" />
                  </div>
                  <span className="text-xs font-bold">{tab.label}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  export default BookingNav;