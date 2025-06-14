import { logDbChange } from "./../logDbChange.js";

export async function handleSpecializationChange(change, io) {
  switch (change.operationType) {
    case "insert":
      console.log(
        "[specializations] Додано спеціалізацію:",
        change.fullDocument
      );
      break;

    default:
      console.log("[specializations] Інша зміна:", change);
  }
  io.emit("dbChange", {
    collection: "specializations",
    change,
  });
  await logDbChange({
    collection: "specializations",
    operation: change.operationType,
    short: shortMessage,
    full: fullMessage,
    documentId: change.documentKey?._id || change.fullDocument?._id,
  });
}
