import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Отримуємо токен із localStorage
    console.log("Токен перед відправкою:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Додаємо токен до заголовків
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchSchedule = async () => {
  try {
    const response = await instance.get("/getScheduleByGroup", {
      params: {
        specializationId: "68235b44a70aeda58ca57e9c", // ID спеціальності
        courseId: "68235b44a70aeda58ca57e9f", // ID курсу
        groupId: "68235b44a70aeda58ca57ea3d", // ID групи
      },
    });

    const scheduleData = response.data;
    console.log("Розклад після fetch:", scheduleData);

    return scheduleData;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 404 || error.response.status === 500)
    ) {
      // Якщо розклад не знайдено або помилка сервера — повертаємо порожній масив
      return { lessons: [] };
    }
    console.error(
      "Помилка отримання розкладу:",
      error.response?.data || error.message
    );
    throw error;
  }
};

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Необхідна повторна аутентифікація");
        localStorage.removeItem("authToken"); // Видаляємо токен

        if (window.location.pathname !== "/") {
          window.location.href = "/"; // Перенаправляємо на головну сторінку
        }
      }
    }
    return Promise.reject(error);
  }
);
export const logout = async () => {
  try {
    const response = await instance.get("/auth/logout");
    console.log(response.data.message);
  } catch (error) {
    console.error("Помилка при виході:", error.response?.data || error.message);
  }
};
export default instance;
