"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Lock, Train, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"DRIVER" | "DISPATCHER" | "MAINTENANCE" | "ADMIN">("DRIVER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Operator identifier is required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const success = await login(username, role);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid operator credentials.");
      }
    } catch (err) {
      setError("System authentication error. Check network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[#020e24]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-container/10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-tertiary-container/10 filter blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-surface-container-low/75 backdrop-blur-xl border border-surface-container-high rounded-2xl shadow-[0_0_50px_rgba(1,14,36,0.8)] z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/80 border border-primary flex items-center justify-center shadow-[0_0_20px_rgba(177,197,255,0.4)] mb-4">
            <Train className="w-9 h-9 text-primary" />
          </div>
          <h2 className="text-2xl font-black font-headline tracking-widest text-[#ffffff]">OAVAS PORTAL</h2>
          <p className="text-xs text-outline font-mono mt-1 uppercase tracking-wider">Railway Security Terminal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-error-container/30 border border-error/30 flex items-center gap-2 text-xs text-error font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-mono font-bold text-outline uppercase tracking-wider mb-1.5 block">
              OPERATOR NAME / ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-[#a3b5db]" />
              <input
                type="text"
                placeholder="Enter pilot identifier..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest/80 border border-surface-container-high rounded-lg text-xs font-mono text-white placeholder-outline/60 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(177,197,255,0.1)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-outline uppercase tracking-wider mb-1.5 block">
              SECURITY TOKEN
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#a3b5db]" />
              <input
                type="password"
                placeholder="Enter pin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest/80 border border-surface-container-high rounded-lg text-xs font-mono text-white placeholder-outline/60 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(177,197,255,0.1)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-outline uppercase tracking-wider mb-1.5 block">
              OPERATIONAL ROLE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["DRIVER", "DISPATCHER", "MAINTENANCE", "ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                    role === r
                      ? "bg-primary-container/40 border-primary text-primary"
                      : "bg-surface-container-lowest/40 border-surface-container-high text-outline hover:border-outline hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-container/80 hover:bg-primary-container text-primary font-headline text-xs font-black tracking-widest rounded-lg border border-primary shadow-[0_0_15px_rgba(11,61,145,0.3)] transition-all uppercase flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                VERIFY & ENTER SYSTEM
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
