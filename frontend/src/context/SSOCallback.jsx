import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';

/**
 * SSOCallback
 * Clerk redirects here after Google OAuth completes.
 * This page handles the OAuth handshake, then redirects to /booking.
 */
function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const requestedRedirect = new URLSearchParams(window.location.search).get('redirect');
  const safeRedirect =
    requestedRedirect && requestedRedirect.startsWith('/')
      ? requestedRedirect
      : '/booking';

  useEffect(() => {
    handleRedirectCallback({
      afterSignInUrl: safeRedirect,
      afterSignUpUrl: safeRedirect,
    }).catch(() => {
      navigate('/login');
    });
  }, [handleRedirectCallback, navigate, safeRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}

export default SSOCallback;