"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/GlitchText";
import { LogIn, Crosshair } from "lucide-react";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center scanlines bg-tooodoo-bg text-tooodoo-red">
        <GlitchText text="INITIALIZING..." className="text-xl tracking-widest" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden scanlines">
      {/* Background Radial Element */}
      <div className="absolute inset-0 z-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(217,4,41,0.15) 0%, transparent 60%)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="glass-panel w-full max-w-md p-8 flex flex-col gap-8 z-10 relative rounded-xl"
      >
        <div className="text-center space-y-2 flex flex-col items-center">
          <Crosshair className="w-16 h-16 text-tooodoo-red mb-4 text-glow" />
          <GlitchText text="ToooDooo" className="text-5xl md:text-6xl font-black text-white text-glow tracking-tighter" />
          <p className="text-muted-foreground font-mono text-sm tracking-widest">TACTICAL TASK UPLINK</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={loginWithGoogle}
            className="w-full h-12 text-lg font-bold tracking-wider group"
          >
            <LogIn className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            AUTHENTICATE
          </Button>
          <div className="text-center text-xs text-muted-foreground/60 font-mono">
            SECURE CONNECTION REQUIRED
          </div>
        </div>

        {/* Decorative borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1" />
      </motion.div>
    </div>
  );
}
