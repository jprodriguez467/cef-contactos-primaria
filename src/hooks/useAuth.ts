"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, isAdmin, User } from "@/lib/auth";
import { getApp } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(getApp()), (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading, isAdmin: isAdmin(user?.email) };
}
