import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Home from "./Home";
// import ParentContainer from "./components/ParentContainer/ParentContainer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
