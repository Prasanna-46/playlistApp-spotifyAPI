// CallbackHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyAuth from '../components/spotifyAuth'; // Adjust the import path as necessary

/**
 * This component handles the redirect from Spotify OAuth
 * It extracts the access token from the URL hash and then
 * redirects to the main application
 */
function CallbackHandler() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to extract token from URL
    try {
      const token = SpotifyAuth.getAccessToken();
      
      if (token) {
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to main app after short delay
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Failed to extract access token from URL');
      }
    } catch (err) {
      setError(`Authentication error: ${err.message}`);
    }
  }, [navigate]);

  return (
    <div className="callback-container">
      <h2>Spotify Authentication</h2>
      
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>
            Return to Application
          </button>
        </div>
      ) : (
        <div className="status-message">
          <p>{status}</p>
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default CallbackHandler;