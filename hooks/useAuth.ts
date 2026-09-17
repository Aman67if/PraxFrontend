"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_URL, apiFetch } from "@/lib/api";

export type UserRole = "ADMIN" | "EMPLOYEE" | "STUDENT";

interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  class_level: number | null;
  profile_image: string | null;
}

interface UseAuthOptions {
  /** The role(s) allowed to access this section */
  allowedRoles: UserRole[];
}

/**
 * Hook that fetches the current user and redirects if:
 *  - Not logged in → /auth/login
 *  - Logged in but wrong role → their correct dashboard
 */
export function useAuth({ allowedRoles }: UseAuthOptions) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    apiFetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const u: AuthUser = data.data;

        if (!allowedRoles.includes(u.role)) {
          // Redirect to their correct dashboard
          const roleDashboard: Record<UserRole, string> = {
            ADMIN: "/admin",
            EMPLOYEE: "/employee",
            STUDENT: "/student",
          };
          router.replace(roleDashboard[u.role]);
          return;
        }

        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Not logged in — redirect to login with return URL
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
