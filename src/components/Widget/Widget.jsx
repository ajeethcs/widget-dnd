import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";
import TableComponent from "../Table/TableComponent";
import Navbar from "../NavBar/NavBar";
// import { useWidgetContext } from "../context/WidgetContext";

const Widget = ({ containerId, widget }) => {
  const { updateWidgetPosition, updateWidgetSize, detectNewContainer, startDragging } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const renderWidget = (widgetType) => {
    if (widgetType === "table") {
      return <TableComponent />;
    }
    if (widgetType === "navBar") {
      return <Navbar />;
    }
  };

  return (
    <Rnd
      onMouseDown={(e) => e.stopPropagation()} // Prevent event bubbling
      size={{ width: widget.width, height: widget.height }}
      position={{ x: widget.position.x, y: widget.position.y }}
      onDragStart={() => {
        startDragging(widget.widgetId, containerId, widget.position);
        setIsDragging(true);
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        const newPosition = { x: d.x, y: d.y };
        const widgetSize = { height: widget.height, width: widget.width };
        updateWidgetPosition(containerId, widget.widgetId, { x: d.x, y: d.y });
        detectNewContainer(widget.widgetId, newPosition, widgetSize);
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateWidgetSize(
          containerId,
          widget.widgetId,
          {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
          position
        );
      }}
      style={{
        background: isDragging || isResizing ? "#4f86ff67" : "#91dcff86",
        backgroundColor: isDragging || isResizing ? "#4f86ff67" : "transparent",
        mixBlendMode: isDragging || isResizing ? "multiply" : "normal",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        overflow: "hidden",
        border: "1px solid lightgray",
        position: "absolute",
      }}
    >
      {renderWidget(widget.type)}
    </Rnd>
  );
};

export default Widget;
