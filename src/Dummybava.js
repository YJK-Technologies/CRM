import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
    
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:2000/city');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Data from Server</h1>
      <h2>Data from Server</h2>
      <h3>Data from Server</h3>
      <h4>Data from Server</h4>
      <h5>Data from Server</h5>
      <h6>Data from Server</h6>
      
    </div>
  );
}

export default App;

