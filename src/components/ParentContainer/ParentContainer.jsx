import React from "react";
import { useWidgetContext } from "../../Context/AppContext";
import GridBackground from "../GridBackground/GridBackground";
import Container from "../Container/Container";

const ParentContainer = () => {
  const { data, addPanel, addWidget, addButton, addComponent } = useWidgetContext();

  const handleDrop = (event) => {
    console.log("handle drop", event);
    // debugger;
    event.preventDefault();

    // const type = event.dataTransfer.getData("type"); // Get dropped item type
    const type = event.dataTransfer.getData("text/plain");
    const dropX = event.clientX;
    const dropY = event.clientY;

    if (type === "panel") {
      addPanel({ x: dropX, y: dropY }); // Create new panel
    } else if (type === "button") {
      console.log("button is dragged");
      addComponent(type, { x: dropX, y: dropY }); // Create new widget
    } else if (type === "tab") {
      addComponent(type, { x: dropX, y: dropY });
    } else if (type === "textBox") {
      addComponent(type, { x: dropX, y: dropY }, { width: 100, height: 10 });
    } else if (type === "dropdown") {
      addComponent(type, { x: dropX, y: dropY }, { width: 100, height: 10 });
    } else {
      addWidget(type, { x: dropX, y: dropY });
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
