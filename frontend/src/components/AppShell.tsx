"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import MainLayout from "./MainLayout";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Basic route protection
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    } else if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Render without dashboard shell on login screen
  if (pathname === "/login") {
    return <div className="h-screen w-screen bg-[#041329]">{children}</div>;
  }

  // Show nothing if loading or redirecting to login
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="h-screen w-screen bg-[#041329] flex items-center justify-center font-mono text-primary">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>ESTABLISHING SECURE SESSION...</span>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
