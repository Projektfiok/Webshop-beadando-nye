import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Registration from "./pages/Registration";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.css";


function App() {
  const navItems = ["Home", "Regisztráció", "Bejelentkezés", "Keresés"];

  return (
    <Router>
       <NavBar brandName={"Webshop"} items={navItems} />
      <Routes>
      <Route path="/regisztracio" element={<Registration />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>

  );
}

export default App;
