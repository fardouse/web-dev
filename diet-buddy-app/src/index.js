import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HOMEPAGE_DATA from './data/homepage.json';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBq5GrFEfi3-lH1dxxAV2QzBYK-fwLO9ts",
  authDomain: "diet-buddy-web-app.firebaseapp.com",
  projectId: "diet-buddy-web-app",
  storageBucket: "diet-buddy-web-app.appspot.com",
  messagingSenderId: "937783859800",
  appId: "1:937783859800:web:dbd1cf6a9c3169ddd7882d",
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App homepageData={HOMEPAGE_DATA}/>
  </BrowserRouter>
);


