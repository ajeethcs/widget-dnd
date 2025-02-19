import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Card } from "antd";
import Ruler from "@scena/react-ruler";
import TableComponent from "./components/Table/TableComponent";
import Navbar from "./components/NavBar/NavBar";

const GRID_SIZE = 20; // Grid cell size
const GRID_WIDTH = 80; // Number of columns
const GRID_HEIGHT = 50; // Number of rows

const App = () => {
  const [widgets, setWidgets] = useState([
    { id: 1, x: 100, y: 100, width: 300, height: 200, component: <TableComponent /> },
    { id: 2, x: 500, y: 100, width: 300, height: 200, component: <Navbar /> },
  ]);

  const getOccupiedCells = (x, y, width, height) => {
    const cells = new Set();
    for (let i = x; i < x + width; i += GRID_SIZE) {
      for (let j = y; j < y + height; j += GRID_SIZE) {
        cells.add(`${Math.round(i / GRID_SIZE)},${Math.round(j / GRID_SIZE)}`);
      }
    }
    return cells;
  };

  const isSpaceFree = (x, y, width, height, movingId) => {
    const newCells = getOccupiedCells(x, y, width, height);
    return ![...newCells].some((cell) => occupied.has(cell) && !occupiedBy[movingId].has(cell));
  };

  const occupiedBy = {};
  const occupied = new Set();
  widgets.forEach(({ id, x, y, width, height }) => {
    occupiedBy[id] = getOccupiedCells(x, y, width, height);
    occupiedBy[id].forEach((cell) => occupied.add(cell));
  });

  const handleDragStop = (id, d, w, h) => {
    const gridX = Math.round(d.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.round(d.y / GRID_SIZE) * GRID_SIZE;

    if (isSpaceFree(gridX, gridY, w, h, id)) {
      setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, x: gridX, y: gridY } : w)));
    }
  };

  const handleResizeStop = (id, d, ref, pos) => {
    const newWidth = Math.round(ref.style.width.replace("px", "") / GRID_SIZE) * GRID_SIZE;
    const newHeight = Math.round(ref.style.height.replace("px", "") / GRID_SIZE) * GRID_SIZE;

    if (isSpaceFree(pos.x, pos.y, newWidth, newHeight, id)) {
      setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, x: pos.x, y: pos.y, width: newWidth, height: newHeight } : w)));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", background: "#d4d4d440" }}>
      <div
        style={{
          position: "relative",
          width: "98%",
          height: "98%",
          background: "#ffffff",
          border: "1px solid lightgray",
          borderRadius: "20px",
          // overflow: "auto",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${GRID_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${GRID_SIZE}px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage: "radial-gradient(circle, rgba(18, 129, 83, 0.3) 1px, transparent 1px)",
        }}
      >
        {/* <Ruler type="horizontal" style={{ position: "absolute", top: 0, left: 20, width: "calc(100% - 20px)", height: 20, background: "#ddd", zIndex: 1 }} unit={GRID_SIZE} />
        <Ruler type="vertical" style={{ position: "absolute", top: 20, left: 0, height: "calc(100% - 20px)", width: 20, background: "#ddd", zIndex: 1 }} unit={GRID_SIZE} /> */}

        {widgets.map(({ id, x, y, width, height, component }) => (
          <Rnd
            key={id}
            position={{ x, y }}
            size={{ width, height }}
            minWidth={100}
            minHeight={100}
            style={{ cursor: "grab" }}
            bounds="parent"
            dragGrid={[GRID_SIZE, GRID_SIZE]}
            resizeGrid={[GRID_SIZE, GRID_SIZE]}
            onDragStop={(e, d) => handleDragStop(id, d, width, height)}
            onResizeStop={(e, direction, ref, delta, pos) => handleResizeStop(id, direction, ref, pos)}
          >
            <Card title="Widget" style={{ width: "100%", height: "100%", overflow: "auto", background: "#f4f4f4" }}>
              {component}
            </Card>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default App;
