import React,{useContext,useState} from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/authContextValue';
import { API_ENDPOINTS } from '../config/api';
function Login() {

    const useAuth = () => useContext(AuthContext);
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Handles login form submission. Sends credentials to Django API.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);
        setLoading(true);

        const apiUrl = API_ENDPOINTS.LOGIN; 

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming Django returns 'token' and 'user_id'
                login(data.token, data.user_id, data.username, data.email);
                setMessage('Login successful! Redirecting to booking...');
                setIsSuccess(true);
                navigate('/booking');
            } else {
                // Display specific errors from Django if available, otherwise a generic message
                const errorMessages = data.detail || (data.non_field_errors && data.non_field_errors.join(' ')) || Object.values(data).flat().join(' ');
                setMessage(errorMessages || 'Login failed. Please check your credentials.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Network error: Could not connect to the server. Ensure Django backend is running and CORS is configured.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600 animate-slide-in">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full px-4 py-2 pr-11 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                placeholder="Enter your password"
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Login'}
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 p-3 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <NavLink to="/register" className="text-blue-600 hover:underline font-semibold">Register here</NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login