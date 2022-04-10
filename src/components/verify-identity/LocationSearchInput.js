import React, {useState} from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { useVerification } from './verification-context';

const LocationSearchInput = () => {
    const verification = useVerification();
    const [address, setAddress] = useState("");

    const handleChange = address => {
        setAddress(address);
        verification.setAddress(address);
    }

    const handleSelect = address => {
        setAddress(address);
        verification.setAddress(address);
    }

    return (
        <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
                {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input form-control',
                })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, i) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div key={i}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span style={{color: "black"}}>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    )
}

export default LocationSearchInput;