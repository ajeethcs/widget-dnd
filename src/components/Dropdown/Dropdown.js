import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWidgetContext } from "../../Context/AppContext";
import { Form, Select } from "antd";

const Dropdown = ({ item, containerId }) => {
  const { updateComponentPosition } = useWidgetContext();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Rnd
      key={item.id}
      onMouseDown={(e) => e.stopPropagation()} // Prevent event bubbling
      position={{ x: item.position.x, y: item.position.y }}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        updateComponentPosition(containerId, item.id, "dropdown", { x: d.x, y: d.y });
      }}
      enableResizing={true}
    >
      <Form.Item layout="horizontal" label="Name">
        <Select
          aria-readonly
          defaultValue="lucy"
          style={{ width: 120 }}
          options={[
            { value: "jack", label: "Jack" },
            { value: "lucy", label: "Lucy" },
            { value: "Yiminghe", label: "yiminghe" },
            { value: "disabled", label: "Disabled" },
          ]}
        />
      </Form.Item>
    </Rnd>
  );
};

export default Dropdown;
