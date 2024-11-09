import React from 'react'
import Header from '../components/Header/Header'
import BookingNav from '../components/Booking/BookingNav'
import Tracking from '../components/Tracking/Tracking'
import NormalBooking from '../components/NormalBoooking/NormalBooking'

const HomePage = () => {
  return (
    <>
    <Header/>
     <BookingNav/>
     <Tracking/>
     <NormalBooking/>
    </>
  )
}

export default HomePage