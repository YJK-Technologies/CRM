import React from 'react'
import { useState,useEffect } from "react";
const config = require('./Apiconfig');

function GlobalUser() {
  const user_code = sessionStorage.getItem('user_code'); 
  const [companyName,setCompanyName] = useState("")
  const [locationName,setLocationName] = useState("")
  const [userName,setUserName] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`${config.apiBaseUrl}/getusercompany`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ user_code })
            });
    
            if (response.ok) {
              const searchData = await response.json();
              console.log(searchData);
              const[{company_name,location_name,company_no,location_no,user_code,user_name}] = searchData
              setCompanyName(company_name);
              setLocationName(location_name);
              setUserName(user_name)
            } else if (response.status === 404) {
              console.log("Data not found");
            } else {
              console.log("Bad request"); // Log the message for other errors
            }
          } catch (error) {
            console.error("Error fetching search data:", error);
          }
        };
    
        fetchUserData(); 
      }, [user_code]);

  return (
    <div>
      <h1>GlobalUser</h1>
      <p>user Name : {userName}</p>
      <p>Company Name : {companyName}</p>
      <p>Location Name : {locationName}</p>
    </div>
  )
}

export default GlobalUser