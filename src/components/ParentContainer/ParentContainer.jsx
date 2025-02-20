import React from "react";
import { useWidgetContext } from "../../Context/AppContext";
import GridBackground from "../GridBackground/GridBackground";
import Container from "../Container/Container";

const ParentContainer = () => {
  const { data } = useWidgetContext();

  return (
    <div className="parent-container">
      <GridBackground />
      {data.containers.map((container) => (
        <Container key={container.containerId} container={container} />
      ))}
    </div>
  );
};

export default ParentContainer;
