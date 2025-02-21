import React from "react";
import { useWidgetContext } from "../../Context/AppContext";
import { PlusOutlined, TableOutlined, TabletOutlined } from "@ant-design/icons";
// import { useWidgetContext } from "../../Context/AppContext";

const Panel = () => {
  //   const { addWidget, addPanel } = useWidgetContext();

  const handleDragStart = (event, type) => {
    // console.log("event=", event);
    // console.log("type=", type);
    // event.dataTransfer.setData("widgetType", type);
    event.dataTransfer.setData("text/plain", type);
  };

  return (
    <div style={{ width: "200px", padding: "10px", border: "1px solid black" }}>
      <h3>Panel</h3>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "panel")}
        style={{ background: "#ffff", border: "1px dashed gray", borderRadius: "10px", padding: "20px", marginBottom: "10px", cursor: "grab", display: "flex", gap: "10px", justifyContent: "center" }}
      >
        <PlusOutlined />
        Panel
      </div>
      <h4>Widgets</h4>
      {["table", "navBar", "widget3"].map((widget) => (
        <div
          key={widget}
          draggable
          onDragStart={(e) => handleDragStart(e, widget)}
          style={{
            height: "50px",
            background: "#c7c7c785",
            border: "0px dashed gray",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            justifyContent: "center",
            cursor: "grab",
          }}
        >
          {widget}
        </div>
      ))}
    </div>
  );
};

export default Panel;
