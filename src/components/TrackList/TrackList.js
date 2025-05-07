import React from 'react';
import styles from './TrackList.module.css';
import Track from '../Track/Track';

function TrackList({ tracks, isRemoval, onRemove, onAdd }) {
  return (
    <div className={styles.Tracklist}>
      {tracks.length === 0 ? (
        <p className={styles.emptyMessage}>
          {isRemoval ? 'No tracks in playlist yet' : 'No search results'}
        </p>
      ) : (
        tracks.map(track => (
          <Track 
            key={track.id} 
            track={track} 
            isRemoval={isRemoval}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}

export default TrackList;