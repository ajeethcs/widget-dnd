import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { Card } from "antd";
import Ruler from "@scena/react-ruler";
import TableComponent from "./components/Table/TableComponent";
import Navbar from "./components/NavBar/NavBar";

const Dashboard1 = () => {
  const horizontalRuler = useRef(null);
  const verticalRuler = useRef(null);

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
      <div
        style={{
          position: "relative",
          width: "95%",
          height: "95%",
          background: "#ffffff",
          border: "2px solid black",
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(32, 50px)",
          gridTemplateRows: "repeat(20, 50px)",
          backgroundSize: "50px 50px",
          backgroundImage: "radial-gradient(circle, rgba(18, 129, 83, 0.3) 2px, transparent 2px)",
          backgroundPosition: "0px 0px",
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
            zIndex: 1,
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
            zIndex: 1,
          }}
          unit={50}
        />

        {/* Draggable Components */}
        <Rnd
          default={{
            x: 100,
            y: 100,
            width: 300,
            height: 200,
          }}
          minWidth={200}
          minHeight={150}
          bounds="parent"
          dragGrid={[50, 50]}
          resizeGrid={[50, 50]}
        >
          <Card title="Table" style={{ width: "100%", height: "100%", overflow: "auto", background: "#f4f4f4" }}>
            <TableComponent />
          </Card>
        </Rnd>

        <Rnd
          default={{
            x: 500,
            y: 100,
            width: 300,
            height: 200,
          }}
          minWidth={200}
          minHeight={150}
          bounds="parent"
          dragGrid={[50, 50]}
          resizeGrid={[50, 50]}
        >
          <Navbar />
        </Rnd>
      </div>
    </div>
  );
};

export default Dashboard1;
