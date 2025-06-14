import { logDbChange } from "./../logDbChange.js";


export function handleAuditoriaChange(change, io) {
  switch (change.operationType) {
    case "insert":
      console.log("[auditoria] Додано аудиторію:", change.fullDocument);
      break;
    case "update":
      console.log("[auditoria] Оновлено аудиторію:", change.updateDescription);
      break;
    case "delete":
      console.log(
        "[auditoria] Видалено аудиторію з _id:",
        change.documentKey._id
      );
      break;
    default:
      console.log("[auditoria] Інша зміна:", change);
  }
  io.emit("dbChange", {
    collection: "auditoria",
    change,
  });
}
