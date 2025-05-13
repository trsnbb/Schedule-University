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
        groupId: "68235b44a70aeda58ca57ea3", // ID групи
      },
    });

    const scheduleData = response.data;
    console.log("Розклад:", scheduleData);

    return scheduleData; // Повертаємо розклад
  } catch (error) {
    console.error("Помилка отримання розкладу:", error.response?.data || error.message);
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
