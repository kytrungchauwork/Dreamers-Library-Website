import axios from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: response interceptor (giữ để scale sau này)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default instance;