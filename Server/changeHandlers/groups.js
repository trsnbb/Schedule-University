import { logDbChange } from "./../logDbChange.js";

export async function handleGroupChange(change, io) {
  switch (change.operationType) {
    case "insert":
      console.log("[groups] Додано групу:", change.fullDocument);
      break;
    case "update":
      console.log("[groups] Оновлено групу:", change.updateDescription);
      break;
    case "delete":
      console.log("[groups] Видалено групу з _id:", change.documentKey._id);
      break;
    default:
      console.log("[groups] Інша зміна:", change);
  }
  io.emit("dbChange", {
    collection: "groups",
    change,
  });

  await logDbChange({
    collection: "groups",
    operation: change.operationType,
    short: shortMessage,
    full: fullMessage,
    documentId: change.documentKey?._id || change.fullDocument?._id,
  });
}
