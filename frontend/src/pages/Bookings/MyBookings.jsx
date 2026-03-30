import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContextValue";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import {
  FaTimesCircle,
  FaHourglassHalf,
  FaCarSide,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaReceipt,
} from "react-icons/fa";
import { API_ENDPOINTS } from "../../config/api";

function MyBookings() {
  const statusIconMap = {
    pending: {
      icon: <FaHourglassHalf className="w-10 h-10 text-yellow-500" />,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      chip: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    confirmed: {
      icon: <FaCheck className="w-10 h-10 text-green-500" />,
      bg: "bg-blue-100",
      text: "text-blue-700",
      chip: "bg-blue-100 text-blue-700 border-blue-200",
    },
    completed: {
      icon: <FaCheck className="w-10 h-10 text-yellow-500" />,
      bg: "bg-green-100",
      text: "text-green-700",
      chip: "bg-green-100 text-green-700 border-green-200",
    },
    cancelled: {
      icon: <FaTimesCircle className="w-10 h-10 text-red-500" />,
      bg: "bg-red-100",
      text: "text-red-700",
      chip: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const { authToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [animateCards, setAnimateCards] = useState(false);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return "$0";
    return `$${amount.toLocaleString()}`;
  };

  //for getting the data from the bookings like status and other
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.BOOKINGS, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchBookings();
    }
  }, [authToken]);

  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 40);

    return () => clearTimeout(timer);
  }, [activeFilter, bookings.length]);

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + Number(booking.total_price || 0),
    0
  );

  const activeBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const filterTabs = [
    {
      key: "all",
      label: "All",
      count: bookings.length,
    },
    {
      key: "pending",
      label: "Pending",
      count: bookings.filter((booking) => booking.status === "pending").length,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      count: bookings.filter((booking) => booking.status === "confirmed").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: completedBookings,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: bookings.filter((booking) => booking.status === "cancelled").length,
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "all") return true;
    return booking.status === activeFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-blue-50 via-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-white rounded-2xl shadow-sm"></div>
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-52 bg-white rounded-2xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
        <div className="absolute -top-8 right-4 w-40 h-40 bg-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 -left-8 w-40 h-40 bg-cyan-100/60 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative bg-white/80 backdrop-blur-sm border border-white shadow-lg rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-sm font-semibold text-blue-600 tracking-[0.16em] uppercase mb-2">
            Customer Dashboard
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
            My Bookings
          </h1>
          <p className="text-gray-600 mb-6">
            Track your current reservations, review past trips, and manage your
            rental details in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-700">{bookings.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-emerald-700">{activeBookings}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-indigo-700">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-4">
              <FaReceipt className="text-blue-600 w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your first reservation and your trip history will appear
              here.
            </p>
            <Link
              to="/cars"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Explore Cars
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2 md:gap-3">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeFilter} bookings
                </h2>
                <p className="text-gray-600 mb-6">
                  Try another filter to view more reservations.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  View All Bookings
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredBookings.map((booking, index) => {
              const statusData =
                statusIconMap[booking.status] || statusIconMap.pending;

              return (
                <article
                  key={booking.id}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 p-5 md:p-6 ${
                    animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 70, 350)}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${statusData.bg}`}
                      >
                        {statusData.icon}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                          {booking.car_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Booking #{booking.id}
                          {booking.booked_at
                            ? ` • Placed on ${formatDate(booking.booked_at)}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold capitalize self-start ${statusData.chip}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" /> Pickup Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.pickup_date)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" /> Return Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.return_date)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" /> Pickup
                      </p>
                      <p className="font-semibold text-gray-900 truncate">
                        {booking.pickup_location}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" /> Return
                      </p>
                      <p className="font-semibold text-gray-900 truncate">
                        {booking.return_location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div className="rounded-lg bg-blue-50 px-3 py-2">
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(booking.total_price)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-xs text-gray-600">Customer Email</p>
                      <p className="font-medium text-gray-800 truncate">
                        {booking.email}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <FaCarSide className="text-blue-600" /> Vehicle
                      </p>
                      <p className="font-medium text-gray-800 truncate">
                        {booking.car_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/cars"
                      className="sm:w-auto w-full text-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Another Car
                    </Link>
                    <Link
                      to="/"
                      className="sm:w-auto w-full text-center bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Return to Home
                    </Link>
                  </div>
                </article>
              );
            })}
              </div>
            )}
          </>
        )}

        {bookings.length > 0 && (
          <p className="text-center text-gray-500 mt-8 text-sm">
            {completedBookings} completed bookings out of {bookings.length} total.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
