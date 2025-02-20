import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";
import TableComponent from "../Table/TableComponent";
import Navbar from "../NavBar/NavBar";
// import { useWidgetContext } from "../context/WidgetContext";

const Widget = ({ containerId, widget }) => {
  const { updateWidgetPosition, updateWidgetSize, startDragging } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  return (
    <Rnd
      onMouseDown={(e) => e.stopPropagation()} // Prevent event bubbling
      size={{ width: widget.width, height: widget.height }}
      position={{ x: widget.position.x, y: widget.position.y }}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        updateWidgetPosition(containerId, widget.widgetId, { x: d.x, y: d.y });
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateWidgetSize(containerId, widget.widgetId, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      //   bounds="parent"
      style={{
        // background: isDragging ? "#a4c4e6d1" : widget.type === "A" ? "#ff6961" : widget.type === "B" ? "#77dd77" : "#84b6f4",
        background: isDragging || isResizing ? "#4f86ff67" : "#c5c5c5",
        mixBlendMode: isDragging || isResizing ? "multiply" : "normal",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <TableComponent />
    </Rnd>
  );
};

export default Widget;
