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
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Помилка:", error.response.data);
      if (error.response.status === 401) {
        console.error("Необхідна повторна аутентифікація");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
