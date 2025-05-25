import React, { useEffect, useRef, useState } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  minWidth = 120,
  isTeacher = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`custom-dropdown ${isTeacher ? "isTeacher" : ""}`} ref={ref}>
      <div
        className="dropdown-selected"
        onClick={() => setOpen((o) => !o)}
      >
        {options.find((opt) => opt.value === value)?.label || placeholder}
        <span className='dropdown-arrow'>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className='dropdown-list'>
          {options.map((opt, idx) => (
            <div
              className='dropdown-item'
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
              style={{
                borderBottom:
                  idx !== options.length - 1 ? "1px solid #353835" : "none",
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
