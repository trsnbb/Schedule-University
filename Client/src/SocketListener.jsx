import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./SocketListener.css";

function SocketListener() {
  const [message, setMessage] = useState(null);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("dbChange", ({ collection, change }) => {
      console.log("Received DB change:", collection, change);

      if (collection === "schedules") {
        setMessage("Оновлено розклад");
        setDetails(JSON.stringify(change.updateDescription || change.fullDocument || change, null, 2));
        setExpanded(false);

        // Очистити старий таймер
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Закриваємо тільки якщо не розкрито
        timeoutRef.current = setTimeout(() => {
          setMessage((prev) => (expanded ? prev : null));
          setDetails((prev) => (expanded ? prev : null));
        }, 10000);
      }
    });

    // Клік поза вікном — закрити
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setExpanded(false);
        setMessage(null);
        setDetails(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      socket.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [expanded]);

  if (!message) return null;

  return (
    <div
      ref={notifRef}
      className={`notif-box ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="notif-title">✅ {message}</div>
      {expanded && <pre className="notif-details">{details}</pre>}
    </div>
  );
}

export default SocketListener;
