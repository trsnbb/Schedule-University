import React from "react";
import "./AddPare.css";

const ChooseType = ({ isOpen, onChoose, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="add-schedule-modal">
      <div className="add-schedule-modal-content" style={{ maxWidth: 500, height: "auto" }}>
        <h2>Що ви хочете додати?</h2>
        <div className="button_from_modal" style={{ gap: 16 }}>
          <button onClick={() => onChoose("lesson")} style={{}}>Пару</button>
          <button onClick={() => onChoose("event")}style={{background: "#CF8508"}}>Подію</button>
        </div>
        <div className="button_from_modal" style={{ marginTop: 10 }}>
          <button type="button" onClick={onCancel} style={{ background: "#34403A" }}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseType;