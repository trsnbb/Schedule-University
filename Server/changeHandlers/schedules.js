import Predmet from "./../models/Predmet.js";
import Schedule from "../models/Schedule.js";

const dayNames = {
  0: "Пн",
  1: "Вт",
  2: "Ср",
  3: "Чт",
  4: "Пт",
  5: "Сб",
};

const typeNames = {
  lec: "Лекція",
  prac: "Практика",
  lab: "Лабораторна",
};

const formatDays = (daysArray) => {
  if (!daysArray || daysArray.length === 0) return "невідомі дні";
  return daysArray.map((d) => dayNames[d] || d).join(", ");
};

const formatType = (type) => typeNames[type] || type || "невідомий тип";

const getPredmetName = async (predmetId) => {
  if (!predmetId) return "невідомий предмет";
  try {
    const predmet = await Predmet.findById(predmetId).select("predmet");
    return predmet?.predmet || "невідомий предмет";
  } catch {
    return "невідомий предмет";
  }
};

// Простий кеш розкладів у пам’яті (для демонстрації)
const scheduleCache = new Map();

const getCachedSchedule = async (scheduleId) => {
  return scheduleCache.get(scheduleId.toString()) || null;
};

const updateCachedSchedule = (schedule) => {
  if (!schedule || !schedule._id) return;
  scheduleCache.set(schedule._id.toString(), schedule);
};

export async function handleScheduleChange(change, io) {
  let fullMessage = "";
  let shortMessage = "";

  switch (change.operationType) {
    case "insert": {
      const doc = change.fullDocument;
      const { groupId, lessons = [] } = doc;

      const lessonMessages = await Promise.all(
        lessons.map(async (lesson, index) => {
          if (lesson.isEvent) {
            return `🎉 Подія "${lesson.eventTitle}" запланована на ${lesson.date} о ${lesson.time}`;
          } else {
            const predmetName = await getPredmetName(lesson.predmetId);
            return `✅ Додано пару №${
              index + 1
            }: предмет "${predmetName}", тип: ${formatType(
              lesson.type
            )}, дні: ${formatDays(lesson.day)}, пари: ${lesson.pairNumber?.join(
              ", "
            )}`;
          }
        })
      );

      shortMessage = "📅 Створено розклад";
      fullMessage = `📅 Створено розклад для групи ${groupId}:\n${lessonMessages.join(
        "\n"
      )}`;

      // Оновлюємо кеш
      updateCachedSchedule(doc);

      break;
    }

    case "update": {
      const scheduleId = change.documentKey._id;

      // Новий стан документу повністю
      const scheduleNew = await Schedule.findById(scheduleId).lean();

      // Старий стан з кешу
      const scheduleOld = await getCachedSchedule(scheduleId);

      // Оновлюємо кеш після отримання
      updateCachedSchedule(scheduleNew);

      const oldLessons = scheduleOld?.lessons || [];
      const newLessons = scheduleNew?.lessons || [];

      let messages = [];

      // Знаходимо додані
      const added = newLessons.filter(
        (nl) => !oldLessons.some((ol) => ol._id.toString() === nl._id.toString())
      );
      // Знаходимо видалені
      const removed = oldLessons.filter(
        (ol) => !newLessons.some((nl) => nl._id.toString() === ol._id.toString())
      );
      // Знаходимо оновлені
      const updated = newLessons.filter((nl) => {
        const ol = oldLessons.find((o) => o._id.toString() === nl._id.toString());
        if (!ol) return false; // це новий, не оновлений
        // Порівнюємо серіалізовані об'єкти, можна зробити глибше, якщо треба
        return JSON.stringify(ol) !== JSON.stringify(nl);
      });

      for (const l of added) {
        if (l.isEvent) {
          messages.push(`➕ Додано подію "${l.eventTitle}" на ${l.date}`);
        } else {
          const name = await getPredmetName(l.predmetId);
          messages.push(
            `➕ Додано пару: "${name}", формат: ${l.format || "невідомий"}, тип: ${formatType(l.type)}, дні: ${formatDays(l.day)}, пари: ${l.pairNumber?.join(", ") || "невідомі"}, аудиторія: ${l.auditorium || "нема"}, посилання: ${l.link || "нема"}`
          );
        }
      }

      for (const l of removed) {
        if (l.isEvent) {
          messages.push(`➖ Видалено подію "${l.eventTitle}" (${l.date})`);
        } else {
          const name = await getPredmetName(l.predmetId);
          // Спрощене повідомлення для видалених пар:
          messages.push(`➖ Видалено пару: "${name}", пари: ${l.pairNumber?.join(", ") || "невідомі"}`);
        }
      }

      for (const l of updated) {
        if (l.isEvent) {
          messages.push(`✏️ Оновлено подію "${l.eventTitle}" на ${l.date}`);
        } else {
          const name = await getPredmetName(l.predmetId);
          messages.push(
            `✏️ Оновлено пару: "${name}", формат: ${l.format || "невідомий"}, тип: ${formatType(l.type)}, дні: ${formatDays(l.day)}, пари: ${l.pairNumber?.join(", ") || "невідомі"}, аудиторія: ${l.auditorium || "нема"}, посилання: ${l.link || "нема"}`
          );
        }
      }

      if (messages.length === 0) {
        messages.push("🔄 Змін не виявлено");
      }

      shortMessage = "📘 Зміни в парах";
      fullMessage = `📘 Зміни в розкладі:\n${messages.join("\n")}`;

      break;
    }

    case "delete": {
      const id = change.documentKey._id;
      shortMessage = "❌ Видалено розклад";
      fullMessage = `❌ Видалено розклад з ID ${id}`;

      // Видаляємо з кешу
      scheduleCache.delete(id.toString());

      break;
    }

    default: {
      shortMessage = "📦 Зміна в розкладі";
      fullMessage = "📦 Інша зміна в колекції schedules";
    }
  }

  io.emit("dbChange", {
    collection: "schedules",
    short: shortMessage,
    full: fullMessage,
  });

  console.log(`[schedules] ${shortMessage}`);
}
