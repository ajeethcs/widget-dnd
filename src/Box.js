import React from "react";
import { Typography } from "antd";

const Box = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f4f4f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solidrgb(98, 95, 95)",
        borderRadius: "8px",
      }}
    >
      <Typography.Text strong>Drag & Resize Me</Typography.Text>
    </div>
  );
};

export default Box;
