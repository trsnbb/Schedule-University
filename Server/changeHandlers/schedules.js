export function handleScheduleChange(change) {
  switch (change.operationType) {
    case 'insert':
      console.log('[schedules] Додано розклад:', change.fullDocument);
      break;
    case 'update':
      console.log('[schedules] Оновлено розклад:', change.updateDescription);
      break;
    case 'delete':
      console.log('[schedules] Видалено розклад з _id:', change.documentKey._id);
      break;
    default:
      console.log('[schedules] Інша зміна:', change);
  }
}
