/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login.js';
import Signup from './signup.js';
import App from './Theapp.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();





<Router>
      <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mainpage" element={<App />}/>
      </Routes>
    </Router>  

*/

/*
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Login from './Login.js';
import Signup from './signup.js';
import App from './Theapp.js';
import Input from './Input';
import Grid from './Grid.js';
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mainpage/" element={<App />} /> 
       
         
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

<Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
     <Route path="/mainpage" element={<App />} />
    </Routes>
    </Router>


reportWebVitals();
*/

import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Main from "./Main.js";

ReactDOM.render(
  <React.StrictMode>
     <Main />
  </React.StrictMode>,
  document.getElementById("root")
);

window.addEventListener("error", function (event) {
    sendErrorToBackend(event.message, event.filename, event.lineno, event.colno);
});

window.addEventListener("unhandledrejection", function (event) {
    sendErrorToBackend(event.reason);
});

function sendErrorToBackend(errorMessage, file, line, col) {
    fetch("/sendErrorMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            errorMsg: errorMessage,
            file: file,
            line: line,
            col: col
        })
    });
}

reportWebVitals();
