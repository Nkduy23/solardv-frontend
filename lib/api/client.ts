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

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

function processQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// Gắn access token vào mọi request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự động refresh khi 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Đợi request đang refresh xong
      return new Promise((resolve, reject) => {
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
      localStorage.removeItem("solardv_access_token");
      localStorage.removeItem("solardv_refresh_token");
      window.location.href = "/admin/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
