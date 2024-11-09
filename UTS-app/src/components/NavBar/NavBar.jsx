    import React, { useState, useEffect } from 'react';

    import { FaTrain, FaTimes, FaHome, FaTicketAlt, FaInfoCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
    import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
    import { MdTrain, MdLocationOn } from 'react-icons/md';

    const NavBar = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [userInitial, setUserInitial] = useState('');
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
          setUserInitial(email.charAt(0).toUpperCase());
          setIsLoggedIn(true);
        }
      }, []);

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setUserInitial('');
        setIsLoggedIn(false);
        window.location.href = '/';
      };

      return (
        <header className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-3 py-3 shadow-md" role="banner">
          <div className=" mx-auto flex flex-wrap justify-between items-center">
            <div className="flex items-center select-none">
             <FaTrain className="text-3xl mr-2" aria-hidden="true" />
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold">UTS </h1>
                <p className="text-sm font-medium md:text-base">IR Unreserved Tracking System</p>
              </div>
            </div>

            <div className="flex items-center md:hidden">
              {userInitial && (
                <div className="w-8 h-8 rounded-full select-none bg-white text-orange-500 flex items-center justify-center font-bold mr-4" aria-label="User profile">
                  {userInitial}
                </div>
              )}
              <button
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="text-white focus:outline-none"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <FaTimes className="text-2xl" aria-hidden="true" /> : <BsThreeDotsVertical className="text-2xl" aria-hidden="true" />}
              </button>
            </div>
            <nav className={`w-full md:w-auto ${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0 `} role="navigation" aria-label="Main navigation">
              <ul className="flex flex-col select-none md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                <li><a href="/" className="hover:text-red-300 flex items-center" title="Home page"><FaHome className="mr-1" aria-hidden="true" />Home</a></li>
                <li><a href="/trains" className="hover:text-red-300 flex items-center" title="View trains"><MdTrain className="mr-1" aria-hidden="true" />Trains</a></li>
                <li><a href="/stations" className="hover:text-red-300 flex items-center" title="View stations"><MdLocationOn className="mr-1" aria-hidden="true" />Stations</a></li>
                <li><a href="/tickets" className="hover:text-red-300 flex items-center" title="View tickets"><FaTicketAlt className="mr-1" aria-hidden="true" />Tickets</a></li>
                <li><a href="/about" className="hover:text-red-300 flex items-center" title="About UTS"><FaInfoCircle className="mr-1" aria-hidden="true" />About</a></li>
                {isLoggedIn ? (
                  <li><button onClick={handleLogout} className="hover:text-red-300 flex items-center" aria-label="Logout"><FaSignOutAlt className="mr-1" aria-hidden="true" />Logout</button></li>
                ) : (
                  <li><a href="/" className="hover:text-red-300 flex items-center" aria-label="Login"><FaSignInAlt className="mr-1" aria-hidden="true" />Login</a></li>
                )}

                {userInitial && (
                  <>
                    <li className="hidden md:block">
                      <div className="w-8 h-8 rounded-full select-none bg-white text-orange-500 flex items-center justify-center font-bold" aria-label="User profile">
                        {userInitial}
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
      );
    };

    export default NavBar;