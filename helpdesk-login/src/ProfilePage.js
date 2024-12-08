import React from "react";
import "./styles/Profile.css";

const ProfilePage = ({ name, role, onLogout, goBack }) => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-title">Profile</h2>
        <div className="profile-info">
          <div className="info-item">
            <label>Name:</label>
            <span>{name}</span>
          </div>
          <div className="info-item">
            <label>Role:</label>
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-button secondary" onClick={goBack}>
            Back to {role === "student" ? "Student Chat" : "Admin Dashboard"}
          </button>
          <button className="profile-button primary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;