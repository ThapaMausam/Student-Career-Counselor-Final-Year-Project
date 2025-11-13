import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modelRegistration, setModelRegistration] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
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
          return data.user;
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
    return null;
  }, []);

  const fetchModelRegistration = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/user/modelRegistration",
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setModelRegistration(data.modelRegistration);
          return data.modelRegistration;
        }
      }
    } catch (err) {
      console.error("Failed to fetch model registration:", err);
    }
    return null;
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/user/recommendations",
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations || []);
          return data.recommendations || [];
        }
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
    return [];
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await fetchUser();
      if (userData) {
        // Load model registration and recommendations in parallel
        await Promise.all([
          fetchModelRegistration(),
          fetchRecommendations(),
        ]);
      } else {
        // If no user, clear data
        setModelRegistration(null);
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchUser, fetchModelRegistration, fetchRecommendations]);

  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setModelRegistration(null);
      setRecommendations([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = {
    user,
    modelRegistration,
    recommendations,
    loading,
    setUser,
    setModelRegistration,
    setRecommendations,
    fetchUser,
    fetchModelRegistration,
    fetchRecommendations,
    loadAllData,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

