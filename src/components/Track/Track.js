import React from 'react';
import styles from './Track.module.css';

function Track({ track, isRemoval, onAdd, onRemove }) {
  const { name, artist, album, duration } = track;

  const handleClick = () => {
    if (isRemoval) {
      onRemove(track);
    } else {
      onAdd(track);
    }
  };

  return (
    <div className={styles.Track}>
      <div className={styles.TrackInfo}>
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
        <p className={styles.Duration}>{duration}</p>
      </div>
      <button 
        className={styles.TrackAction}
        onClick={handleClick}
      >
        {isRemoval ? '-' : '+'}
      </button>
    </div>
  );
}

export default Track;