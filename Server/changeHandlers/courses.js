export function handleCourseChange(change) {
  switch (change.operationType) {
    case 'insert':
      console.log('[courses] Додано курс:', change.fullDocument);
      break;
    case 'update':
      console.log('[courses] Оновлено курс:', change.updateDescription);
      break;
    case 'delete':
      console.log('[courses] Видалено курс з _id:', change.documentKey._id);
      break;
    default:
      console.log('[courses] Інша зміна:', change);
  }
}
