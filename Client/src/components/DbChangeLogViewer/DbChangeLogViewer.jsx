import React, { useEffect, useState } from "react";
import "./DbChangeLogViewer.css";

function DbChangeLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/db-logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="log-container">
      <h2>Журнал змін у БД</h2>
      {loading ? (
        <p>Завантаження...</p>
      ) : logs.length === 0 ? (
        <p>Змін поки що не було</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log._id} className={`log-item ${log.operation}`}>
              <div className="log-header">
                <span className="log-operation">{log.operation.toUpperCase()}</span>
                <span className="log-collection">{log.collection}</span>
                <span className="log-time">
                  {new Date(log.createdAt).toLocaleString("uk-UA")}
                </span>
              </div>
              <div className="log-short">{log.short}</div>
              <details className="log-details">
                <summary>Детальніше</summary>
                <pre>{log.full}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DbChangeLogViewer;
