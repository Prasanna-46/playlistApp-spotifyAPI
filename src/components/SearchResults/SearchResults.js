import React from "react";
import styles from "./SearchResults.module.css";
import TrackList from "../TrackList/TrackList";

function SearchResults({ searchResults, addTrack, isLoading }) {
    return (
        <div className={styles.SearchResults}>
            <h2>Results</h2>
            {isLoading ? (
                <div className={styles.loading}>Searching...</div>
            ) : (
                <TrackList 
                    tracks={searchResults} 
                    onAdd={addTrack} 
                    isRemoval={false} 
                />
            )}
        </div>
    );
}

export default SearchResults;