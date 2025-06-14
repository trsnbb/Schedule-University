import { logDbChange } from "./../logDbChange.js";

export async function handleAuditoriaChange(change, io) {
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

  await logDbChange({
    collection: "auditoria",
    operation: change.operationType,
    short: shortMessage,
    full: fullMessage,
    documentId: change.documentKey?._id || change.fullDocument?._id,
  });
}
