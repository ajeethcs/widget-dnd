import React from "react";
import { useWidgetContext } from "../../Context/AppContext";
import GridBackground from "../GridBackground/GridBackground";
import Container from "../Container/Container";

const ParentContainer = () => {
  const { data, addPanel, addWidget } = useWidgetContext();

  const handleDrop = (event) => {
    console.log("handle drop", event);
    // debugger;
    event.preventDefault();

    // const type = event.dataTransfer.getData("type"); // Get dropped item type
    const type = event.dataTransfer.getData("text/plain");
    const dropX = event.clientX;
    const dropY = event.clientY;
    console.log("type=", type);
    console.log(type);
    console.log("dropX", dropX);
    console.log("dropY", dropY);
    if (type === "panel") {
      addPanel({ x: dropX, y: dropY }); // Create new panel
    } else {
      addWidget(type, { x: dropX, y: dropY }); // Create new widget
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="parent-container" onDrop={handleDrop} onDragOver={handleDragOver}>
      <GridBackground />
      {data?.containers?.map((container) => (
        <Container key={container.containerId} container={container} />
      ))}
    </div>
  );
};

export default ParentContainer;
