import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./SocketListener.css";

const LOCALSTORAGE_KEY = "notifMessageData";

function SocketListener() {
  const [message, setMessage] = useState(null);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef(null);
  const notifRef = useRef(null);

  // Функція збереження у localStorage
  const saveToLocalStorage = (msg, det, exp) => {
    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({
        message: msg,
        details: det,
        expanded: exp,
        timestamp: Date.now(),
      })
    );
  };

  // Відновлення з localStorage при монтуванні
  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      try {
        const { message, details, expanded, timestamp } = JSON.parse(saved);

        // Якщо повідомлення свіже (наприклад, не старше 1 хвилини)
        if (Date.now() - timestamp < 60000) {
          setMessage(message);
          setDetails(details);
          setExpanded(expanded);
        } else {
          localStorage.removeItem(LOCALSTORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("dbChange", ({ collection, change }) => {
      console.log("Received DB change:", collection, change);

      const msg = `Оновлено ${collection}`;
      const det = JSON.stringify(
        change.updateDescription || change.fullDocument || change,
        null,
        2
      );

      setMessage(msg);
      setDetails(det);
      setExpanded(false);

      saveToLocalStorage(msg, det, false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setMessage((prev) => (expanded ? prev : null));
        setDetails((prev) => (expanded ? prev : null));
        if (!expanded) {
          localStorage.removeItem(LOCALSTORAGE_KEY);
        }
      }, 10000);
    });

    // Клік поза віконцем
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setExpanded(false);
        setMessage(null);
        setDetails(null);
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [expanded]);

  // Збереження expanded при зміні
  useEffect(() => {
    if (message) saveToLocalStorage(message, details, expanded);
  }, [expanded, message, details]);

  if (!message) return null;

  return (
    <div
      ref={notifRef}
      className={`notif-box ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded((prev) => !prev)}
      role="alert"
      aria-live="assertive"
    >
      <div className="notif-title">✅ {message}</div>
      {expanded && <pre className="notif-details">{details}</pre>}
    </div>
  );
}

export default SocketListener;
