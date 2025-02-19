import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/NavBar";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";

const Home = () => <h2>Home Page</h2>;

const App = () => {
  return (
    <Router>       
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
      </Routes>
    </Router>
  );
};

export default App;
