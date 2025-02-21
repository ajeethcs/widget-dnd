import React from "react";
import { useWidgetContext } from "../../Context/AppContext";
import { PlusOutlined } from "@ant-design/icons";
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
      {["widget1", "widget2", "widget3"].map((widget) => (
        <div
          key={widget}
          draggable
          onDragStart={(e) => handleDragStart(e, widget)}
          style={{ background: "#91dcff86", border: "1px dashed gray", borderRadius: "10px", padding: "10px", marginBottom: "8px", cursor: "grab" }}
        >
          {widget}
        </div>
      ))}
    </div>
  );
};

export default Panel;
