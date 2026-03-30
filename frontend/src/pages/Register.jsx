import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setLoading(true);
    if (password !== password2) {
      setMessage("Passwords do not match. Try again");
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    const apiUrl = API_ENDPOINTS.REGISTER;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2 }), // password2 for confirmation in Django
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setIsSuccess(true);
        navigate('/login')
      } else {
        const errorMessages = Object.values(data).flat().join(' ');
        setMessage(errorMessages || 'Registration failed. Please try again.')
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error: Could not connect to the server.  Ensure Django backend is running and CORS is configured.')
      setIsSuccess(false);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-600 slide-in">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="reg-username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="reg-email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-password">
                            Password
                        </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="reg-password"
                          className="w-full px-4 py-2 pr-11 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-password2">
                            Confirm Password
                        </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="reg-password2"
                          className="w-full px-4 py-2 pr-11 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                          placeholder="Confirm your password"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                             <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Register'}
                    </button>
                </form>
                {message && (
                    < div className={`mt-4 p-3 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <NavLink to="/login" className="text-green-600 hover:underline font-semibold">Login here</NavLink>
                </p>
            </div>
    </div>
  )
}

export default Register;
