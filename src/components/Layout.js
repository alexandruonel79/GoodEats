import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Layout.css"; // Add styles for the chat button

const Layout = () => {
  const navigate = useNavigate();

  const openChat = () => {
    navigate("/chat"); // Navigate to the chat page
  };

  return (
    <div>
      {/* Render the current page */}
      <Outlet />

      {/* Chat button */}
      <button className="chat-button" onClick={openChat}>
        💬
      </button>
    </div>
  );
};

export default Layout;
