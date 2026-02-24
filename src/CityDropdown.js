import React, { useState, useEffect } from 'react';
const config = require('./Apiconfig');

function CityDropdown() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(`${config.apiBaseUrl}/city`)
      .then(response => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        // Parse the JSON response
        return response.json();
      })
      .then(data => {
        // Set the fetched data to the state
        setCities(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h3>Select a City:</h3>
      <select>
        {/* Map through the cities array and create an option for each city */}
        {cities.map(city => (
          <option key={city.id} value={city.id}>{city.name}</option>
        ))}
      </select>
    </div>
  );
}

export default CityDropdown;
