export function handleUserChange(change, io) {
  switch (change.operationType) {
    case "insert":
      console.log("[users] Додано нового користувача:", change.fullDocument);
      break;
    case "update":
      console.log("[users] Оновлено користувача:", change.updateDescription);
      break;
    case "delete":
      console.log(
        "[users] Видалено користувача з _id:",
        change.documentKey._id
      );
      break;
    default:
      console.log("[users] Інша зміна:", change);
  }
  io.emit("dbChange", {
    collection: "users",
    change,
  });
}
