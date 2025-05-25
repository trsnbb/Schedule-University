import React from "react";
import "./exitProfile.css";

const ExitProfile = ({ isOpen, onConfirm, onCancel, modalType }) => {
  if (!isOpen) return null;

  const modalText =
    modalType === "delete"
      ? "Ви впевнені, що хочете видалити свій аккаунт?"
      : "Ви впевнені, що хочете вийти?";

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-content">
        <h2>{modalText}</h2>
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