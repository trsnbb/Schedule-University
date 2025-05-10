import React from "react";
import "./exitProfile.css";

const ExitProfile = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Якщо модалка неактивна, нічого не рендеримо

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-content">
        <h2>Ви впевнені, що хочете вийти?</h2>
        <div className="button-group">
          <button className="confirm-button" onClick={onConfirm}>
            Так
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Ні
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitProfile;