import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"; // Replace with the correct path

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Private from "./components/Private";

import Dashboard from "./pages/Dashboard";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
