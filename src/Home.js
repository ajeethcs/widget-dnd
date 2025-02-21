import React from "react";
import { WidgetProvider } from "./Context/AppContext";
import ParentContainer from "./components/ParentContainer/ParentContainer";
import Panel from "./components/Panel/Panel";

const Home = () => {
  const container = {
    // border: "1px solid red",
    display: "flex",
    gap: "10px",
  };
  return (
    <div style={container}>
      <WidgetProvider>
        <ParentContainer />
      </WidgetProvider>
      <Panel />
    </div>
  );
};

export default Home;
