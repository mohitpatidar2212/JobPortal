import React from 'react'
import Navbar from './components/Home page/Navbar'
import Footer from './components/Home page/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout