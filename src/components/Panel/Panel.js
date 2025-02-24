import React from "react";
import styled from "styled-components";
import { Menu } from "antd";
import { BorderOuterOutlined } from "@ant-design/icons";
// import { TfiLayoutTabWindow } from "react-icons/tfi";
import { PiLayout, PiTextbox } from "react-icons/pi";
import { RxButton, RxDropdownMenu } from "react-icons/rx";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #fff;
  width: 320px;
  border-left: 1px solid #e7e7e7;
  overflow-y: auto;
`;

const Panel = () => {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData("text/plain", type);
  };

  return (
    <SidebarContainer>
      <Menu selectable={false} mode="inline" defaultOpenKeys={["layout", "buttons", "widgets"]}>
        <Menu.SubMenu key="layout" title="Layout">
          <Menu.Item style={{ cursor: "grab" }} icon={<BorderOuterOutlined />} key="container" draggable onDragStart={(e) => handleDragStart(e, "panel")}>
            Container
          </Menu.Item>
          <Menu.Item style={{ cursor: "grab" }} icon={<PiLayout size={16} />} key="container" draggable onDragStart={(e) => handleDragStart(e, "tab")}>
            Tabs
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="buttons" title="UI elements">
          <Menu.Item icon={<RxButton />} key="button" style={{ cursor: "grab" }} draggable onDragStart={(e) => handleDragStart(e, "button")}>
            Button
          </Menu.Item>
          <Menu.Item icon={<PiTextbox />} key="textBox" style={{ cursor: "grab" }} draggable onDragStart={(e) => handleDragStart(e, "textBox")}>
            Text box
          </Menu.Item>
          <Menu.Item icon={<RxDropdownMenu />} key="dropdown" style={{ cursor: "grab" }} draggable onDragStart={(e) => handleDragStart(e, "dropdown")}>
            Dropdown
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="widgets" title="Widgets">
          <Menu.Item draggable onDragStart={(e) => handleDragStart(e, "table")} key="table">
            Table
          </Menu.Item>
          <Menu.Item draggable onDragStart={(e) => handleDragStart(e, "navBar")} key="navBar">
            Nav bar
          </Menu.Item>
          {/* <Menu.Item key="navbar">NavBar</Menu.Item> */}
        </Menu.SubMenu>
      </Menu>
    </SidebarContainer>
  );
};

export default Panel;
