export function handleSpecializationChange(change, io) {
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
}
