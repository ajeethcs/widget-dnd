import React, { useState } from "react";
import { Rnd } from "react-rnd";
// import { useWidgetContext } from "../context/WidgetContext";
// import Widget from "./Widget";
import { useWidgetContext } from "../../Context/AppContext";
import Widget from "../Widget/Widget";

const Container = ({ container }) => {
  const { updateContainerPosition, updateContainerSize } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  return (
    <Rnd
      size={{ width: container.width, height: container.height }}
      onMouseDown={(e) => e.stopPropagation()} // Prevent event bubbling
      position={{ x: container.position.x, y: container.position.y }}
      onDragStart={() => setIsDragging(true)}
      onDragStop={(e, d) => {
        updateContainerPosition(container.containerId, { x: d.x, y: d.y });
        setIsDragging(false);
      }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateContainerSize(container.containerId, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      //   bounds="parent"
      style={{
        // background: isDragging ? "#a4c4e6d1" : "#fff",
        backgroundColor: isDragging || isResizing ? "#4f86ff67" : "transparent",
        mixBlendMode: isDragging || isResizing ? "multiply" : "normal",
        border: "2px solid lightgray",
        position: "absolute",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {container.widgets.map((widget) => (
        <Widget key={widget.widgetId} containerId={container.containerId} widget={widget} />
      ))}
    </Rnd>
  );
};

export default Container;
