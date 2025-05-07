// src/util/Spotify.js

const clientId = '1e2b2bcef9364fed87cadcf8e09787ee'; // Your Spotify Client ID
// Using your specific local network IP
const redirectUri = 'http://127.0.0.1:3002/callback'; // Match this exactly with your Spotify dashboard settings

let accessToken;
let expiresIn;
let expirationTime;

const Spotify = {
  /**
   * Gets the access token - either from memory or initiates auth flow
   * @returns {string|null} The access token or null if not available
   */
  getAccessToken() {
    // If we have a valid token that's not expired, return it
    if (accessToken && expirationTime && Date.now() < expirationTime) {
      return accessToken;
    }

    // Check if the access token is in the URL (after redirect)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      // Extract token and expiration
      accessToken = accessTokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);
      
      // Set expiration time in milliseconds (with 60s safety margin)
      expirationTime = Date.now() + (expiresIn * 1000) - 60000;
      
      // Clear parameters from URL to avoid issues with expired tokens
      window.history.pushState('Access Token', null, '/');
      
      return accessToken;
    } else {
      // Redirect to Spotify authorization page with all required parameters
      const scope = 'playlist-modify-public playlist-modify-private';
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      return null;
    }
  },

  /**
   * Search for tracks on Spotify
   * @param {string} term - Search term
   * @returns {Promise<Array>} Array of track objects
   */
  search(term) {
    const token = this.getAccessToken();
    
    // If no token available yet, return empty array
    // This could happen if we're in the process of authorization
    if (!token) {
      return Promise.resolve([]);
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      // Handle API errors
      if (!response.ok) {
        // If unauthorized (token expired), clear token and try again
        if (response.status === 401) {
          accessToken = null;
          expirationTime = null;
          return this.search(term);
        }
        throw new Error(`Spotify API error: ${response.status}`);
      }
      return response.json();
    })
    .then(jsonResponse => {
      if (!jsonResponse.tracks || !jsonResponse.tracks.items) {
        return [];
      }
      
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        duration: this.formatDuration(track.duration_ms)
      }));
    })
    .catch(error => {
      console.error('Error searching tracks:', error);
      return [];
    });
  },
  
  /**
   * Format milliseconds to minutes:seconds
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted time string
   */
  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },

  /**
   * Save a playlist to user's Spotify account
   * @param {string} name - Playlist name
   * @param {Array<string>} trackUris - Array of Spotify track URIs
   * @returns {Promise} Promise resolving when playlist is saved
   */
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return Promise.reject(new Error('Playlist name or tracks are missing'));
    }

    const token = this.getAccessToken();
    if (!token) {
      return Promise.reject(new Error('Not authenticated with Spotify'));
    }
    
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    let userId;

    // Get the user's ID first
    return fetch('https://api.spotify.com/v1/me', { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to get user profile: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonResponse => {
        userId = jsonResponse.id;
        
        // Create a new playlist
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ 
            name,
            description: 'Created with Jammming',
            public: true
          })
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to create playlist: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        
        // Add tracks to the playlist
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to add tracks to playlist: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error saving playlist:', error);
        throw error;
      });
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated() {
    return !!accessToken && !!expirationTime && Date.now() < expirationTime;
  },

  /**
   * Log out by clearing token data
   */
  logout() {
    accessToken = null;
    expiresIn = null;
    expirationTime = null;
  }
};

export default Spotify;