import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx"; // або правильний шлях до useAuth
import "./SocketListener.css";

const LOCALSTORAGE_KEY = "notifMessageData";

function SocketListener() {
  const { user } = useAuth(); // Отримуємо користувача з контексту

  if (!user || user?.user?.role !== "deanery") return null;

  const [message, setMessage] = useState(null);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef(null);
  const notifRef = useRef(null);

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

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      try {
        const { message, details, expanded, timestamp } = JSON.parse(saved);
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

    socket.on("dbChange", ({ collection, short, full }) => {
      console.log("Received DB change:", collection, short, full);
      setMessage(short);
      setDetails(full);
      setExpanded(false);
      saveToLocalStorage(short, full, false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!expanded) {
          setMessage(null);
          setDetails(null);
          localStorage.removeItem(LOCALSTORAGE_KEY);
        }
      }, 10000);
    });

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

  useEffect(() => {
    if (message) saveToLocalStorage(message, details, expanded);
  }, [expanded, message, details]);

  if (!message) return null;

  return (
    <div
      ref={notifRef}
      className={`notif-box ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded((prev) => !prev)}
      role='alert'
      aria-live='assertive'
    >
      <div className='notif-title'>{message}</div>
      {expanded && <pre className='notif-details'>{details}</pre>}
    </div>
  );
}

export default SocketListener;
