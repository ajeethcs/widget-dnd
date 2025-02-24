import React, { useState } from "react";
import { useWidgetContext } from "../../Context/AppContext";
import { Rnd } from "react-rnd";
import { Button } from "antd";

const DraggableButton = ({ button, containerId }) => {
  const { updateComponentPosition } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Rnd
      key={button.id}
      onMouseDown={(e) => e.stopPropagation()}
      position={{ x: button.position.x, y: button.position.y }}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        updateComponentPosition(containerId, button.id, "button", { x: d.x, y: d.y });
      }}
      style={{ zIndex: 2 }}
      enableResizing={true}
    >
      <Button variant="filled" color="magenta">
        Button
      </Button>
    </Rnd>
  );
};

export default DraggableButton;
