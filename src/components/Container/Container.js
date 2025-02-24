import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";
import Widget from "../Widget/Widget";
import DraggableButton from "../Button/Button";
import DraggbleTab from "../Tabs/DraggableTab";
import TextBox from "../TextBox/TextBox";
import Dropdown from "../Dropdown/Dropdown";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const Container = ({ container }) => {
  const { updateContainerPosition, updateContainerSize, removeWidget, removeContainer } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return (
    <Rnd
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
        setIsResizing(false);
        updateContainerSize(
          container.containerId,
          {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
          delta,
          position
        );
      }}
      bounds="parent"
      style={{
        backgroundColor: isDragging || isResizing ? "#4f86ff67" : "transparent",
        mixBlendMode: isDragging || isResizing ? "multiply" : "normal",
        border: "2px solid lightgray",
        position: "absolute",
        borderRadius: "8px",
        overflow: "visible",
      }}
    >
      {isHover && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "5px",
            background: "#fc6e6e",
            color: "white",
            fontSize: "12px",
            padding: "2px 6px",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          <Space>
            <span>Container-{container.containerId}</span>
            <DeleteOutlined style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => removeContainer(container.containerId)} />
          </Space>
        </div>
      )}
      {container?.button?.map((button) => (
        <DraggableButton key={button.id} button={button} containerId={container.containerId} />
      ))}
      {container?.tab?.map((item) => (
        <DraggbleTab key={item.id} item={item} containerId={container.containerId} />
      ))}
      {container?.textBox?.map((item) => (
        <TextBox key={item.id} item={item} containerId={container.containerId} />
      ))}
      {container?.dropdown?.map((item) => (
        <Dropdown key={item.id} item={item} containerId={container.containerId} />
      ))}
      {container.widgets.map((widget) => (
        <Widget key={widget.widgetId} containerId={container.containerId} widget={widget} />
      ))}
    </Rnd>
  );
};

export default Container;
