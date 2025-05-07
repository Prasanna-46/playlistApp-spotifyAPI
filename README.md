# Jammming - Spotify Playlist Creator

## Overview

Jammming is a React-based web application that allows users to search the Spotify library, create custom playlists, and save them to their Spotify accounts. The application leverages the Spotify API to provide a seamless music discovery and playlist management experience.

## Features

- **Spotify Authentication**: Secure OAuth 2.0 implicit grant flow authentication with Spotify
- **Track Search**: Search for songs by title, artist, or album
- **Preview Playback**: Listen to 30-second previews of tracks directly in the interface
- **Playlist Creation**: Create custom playlists with a personalized name
- **Playlist Management**: Add and remove tracks from your playlist with ease
- **Spotify Integration**: Save playlists directly to your Spotify account

## Live Demo

https://prasanna-46.github.io/playlistApp-spotifyAPI/

## Technologies Used

- **React**: Frontend UI library for building the user interface
- **JavaScript**: Core programming language
- **CSS Modules**: For component-specific styling
- **Spotify Web API**: For music data and playlist management
- **OAuth 2.0**: For secure authentication with Spotify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Spotify Developer account
- A registered Spotify application with proper redirect URIs

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jammming.git
   cd jammming
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Spotify credentials:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
   REACT_APP_REDIRECT_URI=http://127.0.0.1:3002/callback
   ```

4. Update the Spotify client ID in `spotifyAuth.js` to match your application:
   ```javascript
   CLIENT_ID: 'your_spotify_client_id',
   ```

5. Start the development server:
   ```
   npm start
   ```

6. Open your browser and navigate to `http://127.0.0.1:3002` (not localhost - Spotify requires a proper IP format for the redirect URI)

## Setting Up Spotify Developer Account

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create a new application
4. Add `http://127.0.0.1:3002/callback` to the Redirect URIs in your application settings
5. Copy your Client ID to use in the application

## Usage

### Authentication

1. When you first open the application, you'll see a "Connect to Spotify" button
2. Click the button to authenticate with your Spotify account
3. Grant the requested permissions to the application

### Searching for Tracks

1. Enter a song title, artist name, or album in the search bar
2. Press Enter or click the "Search" button
3. Browse through the search results

### Working with Previews

1. Click the play button (▶) next to any track to hear a 30-second preview
2. Click the pause button (❚❚) to stop the preview
3. Only one preview will play at a time

### Creating a Playlist

1. Click the "+" button next to tracks in the search results to add them to your playlist
2. Click the "-" button next to tracks in your playlist to remove them
3. Edit the playlist name by typing in the input field above your playlist
4. Click "SAVE TO SPOTIFY" to save your playlist to your Spotify account

## Project Structure

```
jammming/
├── public/
├── src/
│   ├── components/
│   │   ├── AudioContext.js      # Audio playback management
│   │   ├── Playlist/            # Playlist component
│   │   ├── SearchBar/           # Search functionality
│   │   ├── SearchResults/       # Display search results
│   │   ├── Track/               # Individual track display
│   │   ├── TrackList/           # List of tracks
│   │   └── spotifyAuth.js       # Spotify API integration
│   ├── App.css                  # Main application styles
│   ├── App.js                   # Main application component
│   ├── index.js                 # Application entry point
│   └── callBackHandler.js       # OAuth callback handling
└── README.md
```

## Custom Features

### Track Preview Playback

The application includes a custom feature that allows users to listen to 30-second previews of tracks:

- Play/pause controls for each track
- Visual indicators for currently playing tracks
- Automatic management to ensure only one track plays at a time
- Graceful handling of tracks without preview URLs

## Troubleshooting

### Common Issues

- **Authentication Issues**: Ensure your Spotify Developer application has the correct redirect URI (`http://127.0.0.1:3002/callback`)
- **Preview Not Playing**: Some tracks in Spotify's catalog don't have preview URLs available
- **Playlist Not Saving**: Verify that you've granted the application the necessary permissions

### Error Messages

- "Error searching: No access token available" - You need to reconnect to Spotify
- "Error saving playlist" - Check your permissions or try reconnecting to Spotify

## Future Enhancements

- Ability to view and manage multiple playlists
- Enhanced track filtering options
- Sorting options for search results
- User profile integration
- Sharing playlists via social media

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing music data
- [Create React App](https://github.com/facebook/create-react-app) for the project setup
- [React](https://reactjs.org/) for the frontend framework

---

Built with ♥ by Prasanna L
