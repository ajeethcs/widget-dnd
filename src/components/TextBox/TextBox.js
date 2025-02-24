import { Form, Input } from "antd";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";

const TextBox = ({ item, containerId }) => {
  const { updateComponentPosition, updateComponentSize } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  return (
    <Rnd
      key={item.id}
      enableResizing={{ left: true, right: true, top: false, bottom: false, topLeft: false, topRight: false, bottomLeft: false, bottomRight: false }}
      onMouseDown={(e) => e.stopPropagation()} // Prevent event bubbling
      position={{ x: item.position.x, y: item.position.y }}
      size={{ width: item.width, height: item.height }}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        updateComponentPosition(containerId, item.id, "textBox", { x: d.x, y: d.y });
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateComponentSize(
          containerId,
          item.id,
          "textBox",
          {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
          position
        );
      }}
    >
      <Input key={item.id} placeholder="type something" />
    </Rnd>
  );
};

export default TextBox;
