import { logDbChange } from "./../logDbChange.js";

export async function handleCourseChange(change, io) {
  switch (change.operationType) {
    case "insert":
      console.log("[courses] Додано курс:", change.fullDocument);
      break;
    case "update":
      console.log("[courses] Оновлено курс:", change.updateDescription);
      break;
    case "delete":
      console.log("[courses] Видалено курс з _id:", change.documentKey._id);
      break;
    default:
      console.log("[courses] Інша зміна:", change);
  }
  io.emit("dbChange", {
    collection: "courses",
    change,
  });

  await logDbChange({
    collection: "courses",
    operation: change.operationType,
    short: shortMessage,
    full: fullMessage,
    documentId: change.documentKey?._id || change.fullDocument?._id,
  });
}
