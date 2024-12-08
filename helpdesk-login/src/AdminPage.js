
// src/components/AdminPage.js
import React from "react";

const AdminPage = ({ name }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {name} (Admin)</h1>
      <p>This is the admin page. Here, you can manage administrative tasks and tools.</p>
    </div>
  );
};

export default AdminPage;
