import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home/Home";
import Cars from "./pages/Cars";
import About from "./pages/About";
import Booking from "./pages/Bookings/Booking";
import MyBookings from "./pages/Bookings/MyBookings";
import CarDetail from "./pages/CarDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SSOCallback from "./context/SSOCallback";
function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route path='/mybookings' element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }/>

            <Route path="/sso-callback" element={<SSOCallback />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
