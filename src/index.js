import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from "./Routes";

ReactDOM.render(
  <React.StrictMode>
      <Router>
        <Routes/>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);