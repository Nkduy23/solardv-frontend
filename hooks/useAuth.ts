"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types/user";
import * as authApi from "@/lib/api/auth.api";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth";

/**
 * Hook quản lý trạng thái đăng nhập admin. Gọi lib/api/auth.api.ts (hiện đang
 * trỏ tới route mock /api/mock/auth/*), sẽ tự chuyển sang API thật khi nối BE.
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const current = await authApi.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const loggedInUser = await authApi.login(email, password);
      setUser(loggedInUser);
      router.push(ADMIN_HOME_PATH);
      return loggedInUser;
    },
    [router],
  );

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    router.push(ADMIN_LOGIN_PATH);
  }, [router]);

  return { user, loading, login: handleLogin, logout: handleLogout, refresh };
}
