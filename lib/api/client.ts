import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true, // gửi kèm cookie httpOnly cho mọi request cross-subdomain
});

let isRefreshing = false;
let queue: (() => void)[] = [];

function processQueue() {
  queue.forEach((cb) => cb());
  queue = [];
}

function redirectToLoginIfNeeded() {
  if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push(() => resolve(apiClient(original)));
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Không cần gửi refreshToken trong body — cookie tự động đính kèm
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
      processQueue();
      return apiClient(original);
    } catch {
      queue = [];
      redirectToLoginIfNeeded();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
