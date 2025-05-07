import React from "react";
import styles from "./Playlist.module.css";
import TrackList from "../TrackList/TrackList";

function Playlist({ playlistName, playlistTracks, onNameChange, onRemove, onSave, isLoading }) {
    const handleNameChange = (event) => {
        onNameChange(event.target.value);
    };

    return (
        <div className={styles.Playlist}>
            <h2>Playlist</h2>
            <input 
                value={playlistName} 
                onChange={handleNameChange}
                placeholder="Name your playlist"
            />
            <TrackList 
                tracks={playlistTracks} 
                isRemoval={true} 
                onRemove={onRemove}
            />
            <button 
                className={styles['Playlist-save']} 
                onClick={onSave}
                disabled={isLoading || playlistTracks.length === 0}
            >
                {isLoading ? 'Saving...' : 'SAVE TO SPOTIFY'}
            </button>
        </div>
    );
}

export default Playlist;