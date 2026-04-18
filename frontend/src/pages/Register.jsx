import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSignUp } from '@clerk/react/legacy';
import { useToast } from '../context/useToast';

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const toast = useToast();
  const redirectPath = location.state?.from || '/booking';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (score === 2) return { level: 2, label: 'Fair', color: 'bg-yellow-400' };
    if (score === 3) return { level: 3, label: 'Good', color: 'bg-blue-400' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    if (!isLoaded || !signUp || !setActive) {
      toast.info('Authentication is still loading. Please try again in a moment.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.create({
        username: username.trim() || undefined,
        emailAddress: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success('Registration successful! Redirecting...');
        navigate(redirectPath);
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setRequiresVerification(true);
      toast.success(`A 6-digit verification code was sent to ${email.trim()}. Please check your inbox.`);
    } catch (error) {
      const errorMessage =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    if (!isLoaded || !signUp || !setActive) {
      toast.info('Authentication is still loading. Please try again in a moment.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success('Email verified! Redirecting...');
        navigate(redirectPath);
        return;
      }

      toast.error('Verification could not be completed. Please check the code and try again.');
    } catch (error) {
      const errorMessage =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        'Verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      toast.success('A new verification code has been sent to your email.');
    } catch {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  // Add at the beginning of Login component
  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
  //       <div className="text-center">
  //         <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
  //         <p className="text-gray-600 font-medium">Loading authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-green-500 via-green-600 to-blue-600" />

          <div className="p-8">
            {/* Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-1 text-2xl font-bold mb-2">
                <span className="text-blue-600">Drive</span>
                <span className="text-gray-900">Luxe</span>
              </div>
              {!requiresVerification ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                  <p className="text-gray-500 text-sm mt-1">Join DriveLuxe and start your journey</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Enter the 6-digit code sent to{' '}
                    <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </>
              )}
            </div>

            {/* Registration form */}
            {!requiresVerification ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="reg-username">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg-username"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="reg-email">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    autoComplete="email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="reg-password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reg-password"
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-100'
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${passwordStrength.level <= 1 ? 'text-red-500' :
                          passwordStrength.level === 2 ? 'text-yellow-500' :
                            passwordStrength.level === 3 ? 'text-blue-500' : 'text-green-600'
                        }`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="reg-password2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="reg-password2"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm ${password2 && password !== password2
                          ? 'border-red-300 focus:ring-red-400'
                          : password2 && password === password2
                            ? 'border-green-300 focus:ring-green-500'
                            : 'border-gray-200 focus:ring-green-500'
                        }`}
                      placeholder="Confirm your password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {password2 && password !== password2 && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isLoaded || loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Required mount point for Clerk Smart CAPTCHA in custom sign-up flows */}
                <div id="clerk-captcha" className="mt-2 flex justify-center" />

                <p className="text-center text-gray-500 text-sm">
                  Already have an account?{' '}
                  <NavLink to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Login here
                  </NavLink>
                </p>
              </form>
            ) : (
              /* OTP Verification form */
              <form onSubmit={handleVerification} className="space-y-5">
                {/* Visual indicator */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5 text-center" htmlFor="verification-code">
                    Enter verification code
                  </label>
                  <input
                    type="text"
                    id="verification-code"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-center text-xl font-bold tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isLoaded || loading || verificationCode.length < 6}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-gray-500 text-sm">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Resend code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRequiresVerification(false);
                    setVerificationCode('');
                  }}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors cursor-pointer"
                >
                  ← Back to registration
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;