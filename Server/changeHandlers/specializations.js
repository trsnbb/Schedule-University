export function handleSpecializationChange(change) {
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
}
