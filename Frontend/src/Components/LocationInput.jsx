import React, { useState } from 'react';
import axios from 'axios';
import { MapPin } from 'lucide-react';

function LocationInput({ placeholder, icon: Icon = MapPin, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('usertoken');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/maps/getSuggestion`,
        null,
        {
          params: { input: query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setError('Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false);
          }, 200);
        }}
        className="w-full p-3 pl-10 pr-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute bg-white w-full mt-2 rounded-lg shadow-lg border border-gray-300 z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center text-gray-500">
          Loading...
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

export default LocationInput;

