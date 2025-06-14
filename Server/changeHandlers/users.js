import User from "../models/User.js"; // Якщо є модель User
import { logDbChange } from "./../logDbChange.js";

export async function handleUserChange(change, io) {
  let shortMessage = "";
  let fullMessage = "";

  switch (change.operationType) {
    case "insert": {
      const user = change.fullDocument;
      shortMessage = `Додано нового користувача: ${
        user.username || user.email || "невідомий"
      }`;
      fullMessage = `Додано нового користувача:\nID: ${user._id}\nІм'я: ${
        user.name || "нема"
      }\nEmail: ${user.email || "нема"}`;
      break;
    }
    case "update": {
      const userId = change.documentKey._id;
      const updatedFields =
        Object.entries(change.updateDescription.updatedFields || {})
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n") || "без деталей";

      shortMessage = `Оновлено користувача`;
      fullMessage = `Оновлено користувача ID ${userId}:\n${updatedFields}`;
      break;
    }
    case "delete": {
      const userId = change.documentKey._id;
      shortMessage = `Видалено користувача`;
      fullMessage = `Видалено користувача з ID ${userId}`;
      break;
    }
    default: {
      shortMessage = "Зміна в користувачах";
      fullMessage = "Інша зміна в колекції users";
    }
  }

  io.emit("dbChange", {
    collection: "users",
    short: shortMessage,
    full: fullMessage,
  });

  await logDbChange({
    collection: "users",
    operation: change.operationType,
    short: shortMessage,
    full: fullMessage,
    documentId: change.documentKey?._id || change.fullDocument?._id,
  });
  console.log(`[users] ${shortMessage}`);
}
