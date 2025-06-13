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

// Простий кеш розкладів у пам’яті
const scheduleCache = new Map();

const getCachedSchedule = async (scheduleId) => {
  const key = scheduleId.toString();
  if (scheduleCache.has(key)) {
    return scheduleCache.get(key);
  }

  try {
    const schedule = await Schedule.findById(scheduleId).lean();
    if (schedule) {
      scheduleCache.set(key, schedule);
    }
    return schedule || null;
  } catch {
    return null;
  }
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
            return `Подія "${lesson.eventTitle}" запланована на ${lesson.date} о ${lesson.time}`;
          } else {
            const predmetName = await getPredmetName(lesson.predmetId);
            return `Додано пару №${
              index + 1
            }: предмет "${predmetName}", тип: ${formatType(
              lesson.type
            )}, дні: ${formatDays(lesson.day)}, пари: ${lesson.pairNumber?.join(
              ", "
            )}`;
          }
        })
      );

      shortMessage = "Створено розклад";
      fullMessage = `Створено розклад для групи ${groupId}:\n${lessonMessages.join(
        "\n"
      )}`;

      updateCachedSchedule(doc);
      break;
    }

    case "update": {
      const scheduleId = change.documentKey._id;

      const scheduleOld = await getCachedSchedule(scheduleId);
      const scheduleNew = await Schedule.findById(scheduleId).lean();

      updateCachedSchedule(scheduleNew);

      const oldLessons = scheduleOld?.lessons || [];
      const newLessons = scheduleNew?.lessons || [];

      const added = newLessons.filter(
        (nl) =>
          !oldLessons.some((ol) => JSON.stringify(ol) === JSON.stringify(nl))
      );

      const removed = oldLessons.filter(
        (ol) =>
          !newLessons.some((nl) => JSON.stringify(ol) === JSON.stringify(nl))
      );

      const messages = [];

      for (const lesson of added) {
        if (lesson.isEvent) {
          messages.push(
            `Додано подію "${lesson.eventTitle}" на ${lesson.date}`
          );
        } else {
          const name = await getPredmetName(lesson.predmetId);
          messages.push(
            `Додано пару: "${name}", формат: ${
              lesson.format || "невідомий"
            }, тип: ${formatType(lesson.type)}, дні: ${formatDays(
              lesson.day
            )}, пари: ${
              lesson.pairNumber?.join(", ") || "невідомі"
            }, аудиторія: ${lesson.auditorium || "нема"}, посилання: ${
              lesson.link || "нема"
            }`
          );
        }
      }

      for (const lesson of removed) {
        if (lesson.isEvent) {
          messages.push(
            `Видалено подію "${lesson.eventTitle}" з ${lesson.date}`
          );
        } else {
          const name = await getPredmetName(lesson.predmetId);
          messages.push(
            `Видалено пару: "${name}", формат: ${
              lesson.format || "невідомий"
            }, тип: ${formatType(lesson.type)}, дні: ${formatDays(
              lesson.day
            )}, пари: ${
              lesson.pairNumber?.join(", ") || "невідомі"
            }, аудиторія: ${lesson.auditorium || "нема"}, посилання: ${
              lesson.link || "нема"
            }`
          );
        }
      }

      if (messages.length === 0) {
        messages.push("Змін не виявлено");
      }

      shortMessage = "Зміни в розкладі";
      fullMessage = `Зміни в розкладі:\n${messages.join("\n")}`;

      break;
    }

    case "delete": {
      const id = change.documentKey._id;
      shortMessage = "Видалено розклад";
      fullMessage = `Видалено розклад з ID ${id}`;

      scheduleCache.delete(id.toString());
      break;
    }

    default: {
      shortMessage = "Зміна в розкладі";
      fullMessage = "Інша зміна в колекції schedules";
    }
  }

  io.emit("dbChange", {
    collection: "schedules",
    short: shortMessage,
    full: fullMessage,
  });

  console.log(`[schedules] ${shortMessage}`);
}
