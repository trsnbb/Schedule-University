export function handleGroupChange(change) {
  switch (change.operationType) {
    case 'insert':
      console.log('[groups] Додано групу:', change.fullDocument);
      break;
    case 'update':
      console.log('[groups] Оновлено групу:', change.updateDescription);
      break;
    case 'delete':
      console.log('[groups] Видалено групу з _id:', change.documentKey._id);
      break;
    default:
      console.log('[groups] Інша зміна:', change);
  }
}
