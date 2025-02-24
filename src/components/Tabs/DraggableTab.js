import React, { useState } from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";
const Container = styled.div`
  /* border: 1px solid red; */
`;
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];
const DraggbleTab = ({ item, containerId }) => {
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
        updateComponentPosition(containerId, item.id, "tab", { x: d.x, y: d.y });
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      disableDragging
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        updateComponentSize(
          containerId,
          item.id,
          "tab",
          {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
          position
        );
      }}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Rnd>
  );
};
export default DraggbleTab;
