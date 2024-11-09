import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaExchangeAlt, FaTrain, FaTicketAlt, FaPrint, FaMobileAlt, FaBan, FaSearch, FaTimes, FaClock, FaMapPin, FaLayerGroup } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { backEndUrl } from '../../Auth/AuthComponent/BackEndUrl';

const NormalBooking = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [departure, setDeparture] = useState({ trainNumber: '', stationName: '', stationId: '' });
  const [arrival, setArrival] = useState({ trainNumber: '', stationName: '', stationId: '' });
  const [stations, setStations] = useState([]);
  const [nextTrains, setNextTrains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [fare, setFare] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);



  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);
    
  useEffect(() => {
    const fetchStations = async () => {
      try {

        const baseUrl = await backEndUrl();
        const response = await axios.get(`${baseUrl}/stations`);
        console.log('Fetched stations:', response.data);
        setStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error.response ? error.response.data : error.message);
      }
    };

    fetchStations();
  }, []);

  const handleStationSearch = (type) => {
    if (!selectedOption) {
      setShowWarningModal(true);
      return;
    }
    setModalType(type);
    setIsModalOpen(true);
    setSearchTerm('');
  };

  const handleStationSelect = (station) => {
    if (modalType === 'departure') {
      if (station.station.id === arrival.stationId) {
        alert('You cannot select the same station for departure and arrival.');
        return;
      }
      setDeparture({ 
        trainNumber: station.trainNumber, 
        stationName: station.station.name, 
        stationId: station.station.id
      });
    } else {
      if (station.station.id === departure.stationId) {
        alert('You cannot select the same station for departure and arrival.');
        return;
      }
      setArrival({ 
        trainNumber: station.trainNumber, 
        stationName: station.station.name, 
        stationId: station.station.id
      });
    }
    setIsModalOpen(false);
  };
  
  const handleTrainSelect = (train, type) => {
    if (!selectedOption) {
      setShowWarningModal(true);
      return;
    }

    const stationId = train.station.id;
    if (type === 'departure') {
      setDeparture({ 
        trainNumber: train.trainNumber, 
        stationName: train.station.name, 
        stationId: stationId
      });
    } else {
      setArrival({ 
        trainNumber: train.trainNumber, 
        stationName: train.station.name, 
        stationId: stationId
      });
    }
  };

  const filteredStations = stations.filter(station =>
    (station.trainNumber && station.trainNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (station.station && station.station.name && station.station.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fetchNextTrains = async () => {
    if (!selectedOption) {
      setShowWarningModal(true);
      return;
    }
    if (!departure.trainNumber || !arrival.trainNumber) {
      alert('Please select both departure and arrival trains.');
      return;
    }

    try {

      const baseUrl = await backEndUrl();
      const response = await axios.get(`${baseUrl}/next-trains?from=${departure.trainNumber}&to=${arrival.trainNumber}`);
      setNextTrains(response.data);
    } catch (error) {
      console.error('Error fetching next trains:', error.response ? error.response.data : error.message);
    }
  };

  const fetchFare = async () => {
    if (!departure.trainNumber || !arrival.trainNumber || !departure.stationId || !arrival.stationId) {
      alert('All train numbers and station IDs are required.');
      return;
    }
  
    try {

      const baseUrl = await backEndUrl();
      const response = await axios.get(`${baseUrl}/fare?fromTrainNumber=${departure.trainNumber}&toTrainNumber=${arrival.trainNumber}&fromStationId=${departure.stationId}&toStationId=${arrival.stationId}`);
      const fare = response.data.totalFare;
  
      console.log('Fare response:', fare);
  
      navigate('/confirm-booking', {
        state: {
          departure,
          arrival,
          fare,
          email: userEmail,
        },
      });
  
    } catch (error) {
      console.error('Error fetching fare:', error.response ? error.response.data : error.message);
    }

  };
  return (
    <>
      <h1 className="mx-2 text-xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded">
        NORMAL BOOKING
      </h1>

      <div className="mx-auto mb-10">
        <div className="flex gap-4 mb-4 justify-center">
          <label className="flex items-center text-xs md:text-lg font-semibold">
            <input
              type="radio"
              name="bookingOption"
              value="paperless"
              checked={selectedOption === 'paperless'}
              onChange={() => setSelectedOption('paperless')}
              className="mr-2"
            />
            <FaMobileAlt className="mr-1" />
            Book & Travel (Paperless)
          </label>
          <label className="flex items-center text-xs md:text-lg font-medium">
            <input
              type="radio"
              name="bookingOption"
              value="paper"
              checked={selectedOption === 'paper'}
              onChange={() => setSelectedOption('paper')}
              className="mr-2"
            />
            <FaPrint className="mr-1" />
            Book & Print (Paper)
          </label>
        </div>

        {selectedOption === 'paperless' && (
          <div className="p-4 rounded-lg text-black">
            <h3 className="text-base font-bold mb-2">Paperless Ticket Information:</h3>
            <ul className="list-disc list-inside mb-4 text-sm">
              <li>Use this option if you are outside station premises/Railway track.</li>
              <li>Use show ticket option on mobile as the travel authority.</li>
              <li>Set your phone GPS to high accuracy mode.</li>
              <li>No cancellation is allowed for paperless tickets.</li>
            </ul>
            <h3 className="text-base font-bold text-red-500 mb-2">Important Information:</h3>
            <ul className="list-disc list-inside text-sm">
              <li className="flex items-center"><MdGpsFixed className="mr-2" /> Set your phone GPS to high accuracy mode</li>
              <li className="flex items-center"><FaBan className="mr-2" /> No cancellation allowed for paperless tickets</li>
            </ul>
          </div>
        )}
        {selectedOption === 'paper' && (
          <div className="p-4 rounded-lg text-black">
            <h3 className="text-base font-bold mb-2">Paper Ticket Information:</h3>
            <ul className="list-disc list-inside mb-4 text-sm">
              <li>Use this option if you prefer a physical ticket.</li>
              <li>You need to print the ticket before boarding.</li>
              <li>Cancellation is allowed as per railway rules.</li>
            </ul>
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <div className="flex-1">
            <div className="flex flex-col mb-4 justify-center items-center">
              <div className="text-sm text-gray-600 mb-1">Depart from Train</div>
              <div className="flex items-center justify-center">
                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                <div className="flex-grow">
                  <div className="text-lg font-semibold cursor-pointer" onClick={() => handleStationSearch('departure')}>
                    {departure.trainNumber || 'Select Train'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {departure.stationName || ''}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col mb-4 justify-center items-center">
              <div className="text-sm text-gray-600 mb-1">Going to Train</div>
              <div className="flex items-center justify-center">
                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                <div className="flex-grow">
                  <div className="text-lg font-semibold cursor-pointer" onClick={() => handleStationSearch('arrival')}>
                    {arrival.trainNumber || 'Select Train'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {arrival.stationName || ''}
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-4 px-2'>
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center justify-center w-full"
            onClick={fetchNextTrains}
          >
            <FaTrain className="mr-1" /> NEXT TRAINS
          </button>

          <button 
            className="bg-red-500 text-white px-4 py-2 rounded flex justify-center items-center w-full"
            onClick={fetchFare}
          >
            <FaTicketAlt className="mr-1" /> GET FARE
          </button>
        </div>

        {nextTrains.length > 0 && (
          <div className="mt-6 px-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <FaTrain className="mr-2 text-orange-500" /> Available Trains
            </h3>
            <div className="space-y-4">
              {nextTrains.map((train, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <FaTrain className="text-2xl text-orange-500 mr-3" />
                      <span className="text-lg font-bold text-gray-800">{train.trainNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-1" />
                      {new Date(train.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapPin className="mr-2 text-green-500" />
                      <span className="text-sm sm:text-base">From: <span className="font-semibold">{train.station.name}</span></span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-red-500" />
                      <span className="text-sm sm:text-base">Arrival: <span className="font-semibold">
                        {new Date(train.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span></span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex flex-wrap items-center text-gray-600 mb-3 sm:mb-0">
                        <FaLayerGroup className="mr-2 text-blue-500" />
                        <span className="font-medium text-sm sm:text-base">Coach Groups:</span>
                        <div className="w-full sm:w-auto sm:ml-2 flex flex-wrap gap-2 mt-2 sm:mt-0">
                          {[train.coachGroup1, train.coachGroup2, train.coachGroup3, train.coachGroup4].map((group, idx) => (
                            group && <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">{group}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleTrainSelect(train, 'departure')}
                          className="w-full sm:w-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                        >
                          Set as Departure
                        </button>
                        <button
                          onClick={() => handleTrainSelect(train, 'arrival')}
                          className="w-full sm:w-auto bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                        >
                          Set as Arrival
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {modalType === 'departure' ? 'Select Departure Train' : 'Select Arrival Train'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search trains or stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredStations.map(station => (
                  <div
                    key={`${station.trainNumber}-${station.station.id}`}
                    className="flex items-center p-3 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleStationSelect(station)}
                  >
                    <FaTrain className="text-orange-500 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-800">{station.trainNumber}</div>
                      <div className="text-sm text-gray-600">{station.station.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <FaExchangeAlt className="mx-auto text-orange-500 text-3xl mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Booking Option Required</h2>
              <p className="text-gray-600 mb-6">Please select a booking option (Paper or Paperless) before proceeding.</p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NormalBooking;