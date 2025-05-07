import React, { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch, isLoading }) {
    const [term, setTerm] = useState('');

    const handleTermChange = (event) => {
        setTerm(event.target.value);
    };

    const search = () => {
        onSearch(term);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    return (
        <div className={styles.SearchBar}>
            <input 
                placeholder="Enter A Song, Album, or Artist" 
                onChange={handleTermChange}
                onKeyPress={handleKeyPress}
                value={term}
            />
            <button 
                onClick={search}
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </div>
    );
}

export default SearchBar;