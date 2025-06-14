import DbChangeLog from "./models/DbChangeLog.js";

export async function logDbChange({ collection, operation, short, full, documentId }) {
  try {
    await DbChangeLog.create({
      collection,
      operation,
      short,
      full,
      documentId,
    });
  } catch (err) {
    console.error("Не вдалося записати лог зміни БД:", err.message);
  }
}
