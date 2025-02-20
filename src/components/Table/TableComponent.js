import React from "react";
import { Table } from "antd";

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "City", dataIndex: "city", key: "city" },
];

const data = [
  { key: "1", id: "1", name: "John Doe", age: "30", email: "john@example.com", phone: "123-456-7890", city: "New York" },
  { key: "2", id: "2", name: "Jane Smith", age: "25", email: "jane@example.com", phone: "987-654-3210", city: "Los Angeles" },
  { key: "3", id: "3", name: "Mike Johnson", age: "40", email: "mike@example.com", phone: "456-789-1234", city: "Chicago" },
  { key: "4", id: "4", name: "Emily Davis", age: "29", email: "emily@example.com", phone: "321-654-9870", city: "Houston" },
  { key: "5", id: "5", name: "Robert Brown", age: "35", email: "robert@example.com", phone: "654-987-1230", city: "Phoenix" },
  { key: "6", id: "6", name: "Sophia Wilson", age: "27", email: "sophia@example.com", phone: "789-123-4567", city: "San Francisco" },
  { key: "7", id: "7", name: "David Lee", age: "33", email: "david@example.com", phone: "123-789-4560", city: "Seattle" },
  { key: "8", id: "8", name: "Olivia Harris", age: "31", email: "olivia@example.com", phone: "987-123-6540", city: "Miami" },
];

const TableComponent = () => {
  return (
    // <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", zIndex: 1 }}>
    <Table style={{ width: "100%", height: "100%" }} columns={columns} dataSource={data} />
    // </div>
  );
};

export default TableComponent;
