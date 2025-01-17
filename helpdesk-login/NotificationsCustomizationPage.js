import React, { useState, useEffect } from "react";
import { ref, set, onValue, push, remove, update, off } from "firebase/database";
import { database } from "./firebaseConfig";
import "./styles/NotificationPopup.css";


const NotificationsCustomizationPage = ({ onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const [editMode, setEditMode] = useState(null); // Stores the notification being edited
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const notificationsRef = ref(database, "notifications");
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      setNotifications(data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : []);
    };

    onValue(notificationsRef, handleValueChange);
    return () => off(notificationsRef);
  }, []);

  const handleAddNotification = () => {
    if (newNotification.trim() === "") return;
    const newRef = push(ref(database, "notifications"));
    set(newRef, { text: newNotification, timestamp: Date.now() });
    setNewNotification("");
  };

  const handleDeleteNotification = (id) => {
    remove(ref(database, `notifications/${id}`));
  };

  const handleEditNotification = (id, text) => {
    setEditMode(id);
    setEditedText(text);
  };

  const handleSaveEdit = (id) => {
    update(ref(database, `notifications/${id}`), { text: editedText });
    setEditMode(null);
    setEditedText("");
  };

  return (
    <div className="notifications-page">
      <button className="back-button" onClick={onBack}>
        Back
      </button>
      <h1>Manage Notifications</h1>
      <div className="notification-input">
        <input
          type="text"
          placeholder="Enter new notification"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
        />
        <button onClick={handleAddNotification}>Add Notification</button>
      </div>
      <ul className="notifications-list">
        {notifications.map(({ id, text }) => (
          <li key={id} className="notification-item">
            {editMode === id ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(id)}>Save</button>
              </div>
            ) : (
              <>
                <span>{text}</span>
                <button onClick={() => handleEditNotification(id, text)}>Edit</button>
                <button onClick={() => handleDeleteNotification(id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsCustomizationPage;
