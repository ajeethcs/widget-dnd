import React, { useState, useRef, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { Card } from "antd";
import Ruler from "@scena/react-ruler";

const GRID_SIZE = 20;

const parentBaseStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #d3d3d3",
  borderRadius: "5px",
  background: "#fcfcfc",
  position: "absolute",
  overflow: "hidden",
  transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
};

const childBaseStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #666",
  background: "#eee",
  position: "absolute",
  transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
};

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const Dashboard2 = () => {
  const horizontalRuler = useRef(null);
  const verticalRuler = useRef(null);

  const [parent, setParent] = useState({ width: 300, height: 300, x: 50, y: 50 });
  const [child, setChild] = useState({ width: 100, height: 100, x: 10, y: 10 });
  const [isDraggingParent, setIsDraggingParent] = useState(false);
  const [isDraggingChild, setIsDraggingChild] = useState(false);

  useEffect(() => {
    if (horizontalRuler.current) horizontalRuler.current.resize();
    if (verticalRuler.current) verticalRuler.current.resize();
  }, [parent.width, parent.height]);

  const onParentDragStart = () => setIsDraggingParent(true);
  const onParentDragStop = useCallback((e, d) => {
    setIsDraggingParent(false);
    setParent((prev) => ({ ...prev, x: snapToGrid(d.x), y: snapToGrid(d.y) }));
  }, []);

  const onParentResizeStop = useCallback((e, direction, ref, delta, position) => {
    setParent({
      width: snapToGrid(parseInt(ref.style.width, 10)),
      height: snapToGrid(parseInt(ref.style.height, 10)),
      ...position,
    });
  }, []);

  const onChildDragStart = () => setIsDraggingChild(true);
  const onChildDragStop = useCallback((e, d) => {
    setIsDraggingChild(false);
    setChild((prev) => ({ ...prev, x: snapToGrid(d.x), y: snapToGrid(d.y) }));
  }, []);

  const onChildResizeStop = useCallback((e, direction, ref, delta, position) => {
    setChild({
      width: snapToGrid(parseInt(ref.style.width, 10)),
      height: snapToGrid(parseInt(ref.style.height, 10)),
      ...position,
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid Background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          // backgroundImage: "linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)",
          backgroundImage: "radial-gradient(circle, #bbb 1px, transparent 1px)", // Dot grid pattern,
          zIndex: 0,
        }}
      />

      <Card
        title="Dashboard"
        style={{
          width: "90%",
          height: "90%",
          // background: "#ffffff",
          backgroundColor: "transparent",
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
          style={{
            ...parentBaseStyle,
            background: isDraggingParent
              ? "#4f86ff67" // Keep blue when dragging parent
              : "white", // Keep white when idle
            mixBlendMode: isDraggingChild ? "multiply" : "normal", // Show grid when dragging child
          }}
          size={{ width: parent.width, height: parent.height }}
          position={{ x: parent.x, y: parent.y }}
          onDragStart={onParentDragStart}
          onDragStop={onParentDragStop}
          onResizeStop={onParentResizeStop}
        >
          {!isDraggingParent && (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Parent Rnd */}
              {/* Child Rnd (Movable Inside Parent) */}
              <Rnd
                style={{
                  ...childBaseStyle,
                  background: isDraggingChild ? "#4f86ff67" : childBaseStyle.background,
                  // border: isDraggingChild ? "1px solid #ffff" : childBaseStyle.border,
                  // boxShadow: isDraggingChild ? "0px 0px 10px rgba(143, 143, 255, 0.5)" : "none",
                }}
                size={{ width: child.width, height: child.height }}
                position={{ x: child.x, y: child.y }}
                bounds="parent"
                dragAxis="both"
                enableResizing={true}
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={onChildDragStart}
                onDragStop={onChildDragStop}
                onResizeStop={onChildResizeStop}
              >
                {!isDraggingChild && "Child Rnd"}
              </Rnd>
            </div>
          )}
        </Rnd>
      </Card>
    </div>
  );
};

export default Dashboard2;
