// improved-spotifyAuth.js
/**
 * Spotify Authentication Module
 * 
 * This module handles Spotify authentication for the Jammming application
 * using the Implicit Grant Flow.
 * 
 * It follows Spotify's security requirements:
 * - Uses proper IP format for loopback address (127.0.0.1 instead of localhost)
 * - Properly handles token extraction, storage, and expiration
 * - Cleans URL parameters after extracting tokens
 */

const SpotifyAuth = {
    // Configuration constants
    CLIENT_ID: '1e2b2bcef9364fed87cadcf8e09787ee', // Your Spotify Client ID
    REDIRECT_URI: 'http://127.0.0.1:3002/callback', // Using your specific IP address
    SCOPE: 'playlist-modify-public playlist-modify-private user-read-private user-read-email',
    
    // Authentication state
    accessToken: null,
    expiresIn: null,
    expirationTime: null,
    
    /**
     * Gets access token from memory, URL, or initiates auth flow
     * @returns {string|null} Access token if available
     */
    getAccessToken() {
      // Return token if it's already in memory and not expired
      if (this.accessToken && this.expirationTime > Date.now()) {
        return this.accessToken;
      }
      
      // Look for token in URL (after redirect)
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      
      if (accessTokenMatch && expiresInMatch) {
        // Extract token and expiration
        this.accessToken = accessTokenMatch[1];
        this.expiresIn = Number(expiresInMatch[1]);
        
        // Set expiration timestamp (subtract 60 seconds for safety)
        this.expirationTime = Date.now() + (this.expiresIn * 1000) - 60000;
        
        // Save to sessionStorage for persistence during page refresh
        this.saveTokenToStorage();
        
        // Clean URL parameters to avoid issues with expired tokens
        window.history.pushState('Access Token', null, '/');
        
        return this.accessToken;
      } else {
        // Try loading from session storage first
        if (this.loadTokenFromStorage()) {
          return this.accessToken;
        }
        
        // Redirect to Spotify authorization if no token found
        this.redirectToSpotifyAuth();
        return null;
      }
    },
    
    /**
     * Save token data to session storage
     */
    saveTokenToStorage() {
      try {
        sessionStorage.setItem('spotify_access_token', this.accessToken);
        sessionStorage.setItem('spotify_expires_in', String(this.expiresIn));
        sessionStorage.setItem('spotify_expiration_time', String(this.expirationTime));
      } catch (e) {
        console.warn('Failed to save token to session storage');
      }
    },
    
    /**
     * Load token data from session storage
     * @returns {boolean} True if valid token was loaded
     */
    loadTokenFromStorage() {
      try {
        const token = sessionStorage.getItem('spotify_access_token');
        const expirationTime = sessionStorage.getItem('spotify_expiration_time');
        
        if (token && expirationTime) {
          this.accessToken = token;
          this.expirationTime = Number(expirationTime);
          this.expiresIn = sessionStorage.getItem('spotify_expires_in');
          
          // Check if token is still valid
          if (this.expirationTime > Date.now()) {
            return true;
          } else {
            // Clear expired token
            this.clearTokenData();
          }
        }
      } catch (e) {
        console.warn('Failed to load token from session storage');
      }
      
      return false;
    },
    
    /**
     * Clear token data from memory and storage
     */
    clearTokenData() {
      this.accessToken = null;
      this.expiresIn = null;
      this.expirationTime = null;
      
      try {
        sessionStorage.removeItem('spotify_access_token');
        sessionStorage.removeItem('spotify_expires_in');
        sessionStorage.removeItem('spotify_expiration_time');
      } catch (e) {
        console.warn('Failed to clear token from session storage');
      }
    },
    
    /**
     * Redirects to Spotify authorization page
     */
    redirectToSpotifyAuth() {
      const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&response_type=token&scope=${encodeURIComponent(this.SCOPE)}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}`;
      window.location = authorizeUrl;
    },
    
    /**
     * Check if user is authenticated
     * @returns {boolean} True if valid token exists
     */
    isAuthenticated() {
      return this.accessToken !== null && this.expirationTime > Date.now();
    },
    
    /**
     * Make an authenticated request to Spotify API
     * @param {string} endpoint - API endpoint (with leading slash)
     * @param {Object} options - Request options (method, headers, body)
     * @returns {Promise} API response as JSON
     */
    async fetchFromSpotify(endpoint, options = {}) {
      const token = this.getAccessToken();
      
      if (!token) {
        return Promise.reject(new Error('No access token available'));
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      try {
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          method: options.method || 'GET',
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        });
        
        // Handle 401 Unauthorized (expired token)
        if (response.status === 401) {
          this.clearTokenData();
          // Retry after clearing token
          return this.fetchFromSpotify(endpoint, options);
        }
        
        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status}`);
        }
        
        // Return null for 204 No Content
        if (response.status === 204) {
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.error('Spotify API request failed:', error);
        throw error;
      }
    },
    
    /**
     * Search for tracks on Spotify
     * @param {string} term - Search term
     * @returns {Promise<Array>} Array of track objects
     */
    search(term) {
      if (!term) {
        return Promise.resolve([]);
      }
      
      return this.fetchFromSpotify(`/search?type=track&q=${encodeURIComponent(term)}`)
        .then(data => {
          if (!data || !data.tracks || !data.tracks.items) {
            return [];
          }
          
          return data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            duration: this.formatDuration(track.duration_ms)
          }));
        });
    },
    
    /**
     * Format milliseconds as mm:ss
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration
     */
    formatDuration(ms) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    
    /**
     * Save playlist to user's Spotify account
     * @param {string} name - Playlist name
     * @param {Array<string>} trackUris - Array of Spotify track URIs
     * @returns {Promise} Resolution indicates success
     */
    savePlaylist(name, trackUris) {
      if (!name || !trackUris.length) {
        return Promise.resolve();
      }
      
      let userId;
      
      // Get current user's ID
      return this.fetchFromSpotify('/me')
        .then(user => {
          userId = user.id;
          
          // Create playlist
          return this.fetchFromSpotify(`/users/${userId}/playlists`, {
            method: 'POST',
            body: { name }
          });
        })
        .then(playlist => {
          // Add tracks to playlist
          return this.fetchFromSpotify(`/playlists/${playlist.id}/tracks`, {
            method: 'POST',
            body: { uris: trackUris }
          });
        });
    }
  };
  
  export default SpotifyAuth;