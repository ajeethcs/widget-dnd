import React, { useState } from "react";
import { Rnd } from "react-rnd";
// import { useWidgetContext } from "../context/WidgetContext";
// import Widget from "./Widget";
import { useWidgetContext } from "../../Context/AppContext";
import Widget from "../Widget/Widget";
import { Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

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
      //   enableResizing={false}
      onDragStop={(e, d) => {
        updateContainerPosition(container.containerId, { x: d.x, y: d.y });
        setIsDragging(false);
      }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(e, direction, ref, delta, position) => {
        // debugger;
        setIsResizing(false);
        updateContainerSize(
          container.containerId,
          {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
          delta
        );
      }}
      bounds="parent"
      style={{
        // background: isDragging ? "#a4c4e6d1" : "#fff",
        backgroundColor: isDragging || isResizing ? "#4f86ff67" : "transparent",
        mixBlendMode: isDragging || isResizing ? "multiply" : "normal",
        border: "2px solid lightgray",
        position: "absolute",
        borderRadius: "8px",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "10px",
          background: "#fc6e6e",
          color: "white",
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "4px",
          zIndex: 10,
        }}
      >
        Container-{container.containerId}
      </div>
      {container.widgets.map((widget) => (
        <Widget key={widget.widgetId} containerId={container.containerId} widget={widget} />
      ))}
    </Rnd>
  );
};

export default Container;
