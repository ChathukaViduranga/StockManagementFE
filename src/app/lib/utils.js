"use client";

import { useAuth } from "../providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Optionally, show a loading spinner here
    }

    return <Component {...props} />;
  };
}
