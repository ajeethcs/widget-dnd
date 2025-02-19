import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Card } from "antd";
import Ruler from "@scena/react-ruler";

const parentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 2px #000",
  background: "#f0f0f0",
  position: "relative", // Needed for bounding the child
  overflow: "hidden", // Prevent child overflow
};

const childStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #666",
  background: "#ddd",
  position: "absolute", // Needed for correct positioning
};

const Dashboard2 = () => {
  const horizontalRuler = useRef(null);
  const verticalRuler = useRef(null);

  const [parent, setParent] = useState({ width: 300, height: 300, x: 50, y: 50 });
  const [child, setChild] = useState({ width: 100, height: 100, x: 10, y: 10 });

  // Update rulers when the parent resizes
  useEffect(() => {
    if (horizontalRuler.current) horizontalRuler.current.resize();
    if (verticalRuler.current) verticalRuler.current.resize();
  }, [parent.width, parent.height]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "#f0f0f0",
      }}
    >
      <Card
        title="Dashboard"
        style={{
          width: "90%",
          height: "90%",
          background: "#ffffff",
          border: "2px solid black",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Horizontal Ruler */}
        <Ruler
          ref={horizontalRuler}
          type="horizontal"
          style={{
            position: "absolute",
            top: 0,
            left: 20,
            width: "calc(100% - 20px)",
            height: 20,
            background: "#ddd",
            zIndex: 10,
          }}
          unit={50}
        />

        {/* Vertical Ruler */}
        <Ruler
          ref={verticalRuler}
          type="vertical"
          style={{
            position: "absolute",
            top: 20,
            left: 0,
            height: "calc(100% - 20px)",
            width: 20,
            background: "#ddd",
            zIndex: 10,
          }}
          unit={50}
        />

        {/* Parent Rnd (Movable and Resizable) */}
        <Rnd
          style={parentStyle}
          size={{ width: parent.width, height: parent.height }}
          position={{ x: parent.x, y: parent.y }}
          onDragStop={(e, d) => setParent((prev) => ({ ...prev, x: d.x, y: d.y }))}
          onResizeStop={(e, direction, ref, delta, position) => {
            setParent({
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            });
          }}
        >
          {/* Child Rnd (Movable Inside Parent) */}
          <Rnd
            style={childStyle}
            size={{ width: child.width, height: child.height }}
            position={{ x: child.x, y: child.y }}
            bounds="parent" // Restrict child movement inside parent
            dragAxis="both" // Allow dragging in both directions
            enableResizing={true} // Allow resizing
            onMouseDown={(e) => {
              e.stopPropagation(); // Stop event bubbling
            }}
            onDragStart={(e) => {
              e.stopPropagation(); // Ensure drag does not trigger parent move
            }}
            onDragStop={(e, d) => {
              setChild((prev) => ({ ...prev, x: d.x, y: d.y }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setChild({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
          >
            Child Rnd
          </Rnd>
        </Rnd>
      </Card>
    </div>
  );
};

export default Dashboard2;
