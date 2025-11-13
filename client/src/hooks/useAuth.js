import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  return { user, loading, fetchUser, logout };
}
