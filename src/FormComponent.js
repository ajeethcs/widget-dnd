import React from "react";
import { Form, Input, Button } from "antd";

const FormComponent = () => {
  return (
    <div style={{ background: "#f4f4f4" }}>
      <Form
        layout="vertical"
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        <Form.Item label="Name">
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item label="Email">
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Message">
          <Input.TextArea rows={3} placeholder="Enter your message" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponent;
