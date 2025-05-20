import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const fetchAllTeachers = async () => {
  try {
    const response = await instance.get("/getAllTeachers");
    return response.data.teachers;
  } catch (error) {
    console.error("Помилка отримання всіх викладачів:", error);
    return [];
  }
};
export const postSchedule = async (scheduleData) => {
  try {
    const response = await instance.post("/createSchedule", scheduleData);
    return response.data;
  } catch (error) {
    console.error(
      "Помилка створення розкладу:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchSchedule = async ({ specializationId, courseId, groupId }) => {
  try {
    const response = await instance.get("/getScheduleByGroup", {
      params: {
        specializationId,
        courseId,
        groupId,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 404 || error.response.status === 500)
    ) {
      return { lessons: [] };
    }
    console.error(
      "Помилка отримання розкладу:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const fetchAllSpecializations = async () => {
  const response = await instance.get("/specializations");
  return response.data;
};

export const fetchCoursesBySpecialization = async (specializationId) => {
  const response = await instance.get("/courses", {
    params: { specializationId },
  });
  return response.data;
};

export const fetchGroupsByCourse = async (courseId) => {
  const response = await instance.get("/groups", {
    params: { courseId },
  });
  return response.data;
};


instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Необхідна повторна аутентифікація");
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const logout = async () => {
  try {
    const response = await instance.get("/auth/logout");
  } catch (error) {
    console.error("Помилка при виході:", error.response?.data || error.message);
  }
};

export default instance;
