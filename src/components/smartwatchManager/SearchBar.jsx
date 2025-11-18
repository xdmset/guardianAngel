import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
        <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;
