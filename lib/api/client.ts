import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("solardv_access_token");
}
function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("solardv_refresh_token");
}
function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("solardv_access_token", token);
}
function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("solardv_access_token");
    localStorage.removeItem("solardv_refresh_token");
  }
}

// Chỉ redirect nếu KHÔNG đang đứng ở trang login — tránh vòng lặp reload vô hạn
function redirectToLoginIfNeeded() {
  clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
}

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

function processQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      // Không có refresh token — có thể do chưa từng đăng nhập (bình thường ở trang login)
      // Chỉ redirect nếu KHÔNG đang ở trang login, tránh reload vô hạn
      redirectToLoginIfNeeded();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
      const newToken = data.data.accessToken;
      saveToken(newToken);
      processQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
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
