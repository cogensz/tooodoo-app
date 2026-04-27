"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { GlitchText } from "@/components/GlitchText";
import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/button";
import { LogOut, Activity, Archive, Clock } from "lucide-react";
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog";
import { motion } from "framer-motion";

const AshParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-tooodoo-red rounded-full blur-[1px]"
          initial={{
            y: "110vh",
            x: Math.random() * 100 + "vw",
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: "-10vh",
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 50 - 25}px)`,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || tasksLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center scanlines bg-tooodoo-bg text-tooodoo-red">
        <GlitchText text="LOADING COMMAND CENTER..." className="text-xl tracking-widest font-mono" />
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.state === "Active" || t.state === "Paused");
  const pendingTasks = tasks.filter((t) => t.state === "Pending");
  const completedTasks = tasks.filter((t) => t.state === "Completed");

  return (
    <div className="min-h-screen scanlines overflow-x-hidden bg-tooodoo-bg pb-20 relative">
      <AshParticles />
      {/* Top Secret Stamp */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-0 opacity-5">
        <h1 className="font-heading text-[15vw] text-tooodoo-red border-8 border-tooodoo-red p-8 tracking-tighter mix-blend-overlay">
          CLASSIFIED
        </h1>
      </div>
      {/* Header */}
      <header className="border-b border-primary/20 bg-black/40 glass-panel sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GlitchText text="ToooDooo" className="text-2xl font-black text-white text-glow hidden sm:block tracking-tight" />
            <div className="h-6 w-px bg-primary/30 hidden sm:block" />
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              AGENT: {user.displayName || user.email?.split("@")[0] || "UNKNOWN"}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CreateTaskDialog />
            <Button variant="ghost" size="icon" onClick={logout} className="hover:text-primary">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Ongoing Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-primary/20 pb-2 relative">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-2xl uppercase tracking-widest text-primary text-glow">
              Active Hits
            </h2>
            <span className="ml-2 font-mono text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-sm">
              {activeTasks.length}
            </span>
          </div>
          {activeTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/50 glass-panel">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">No active hits.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Pending Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-heading text-2xl uppercase tracking-widest text-white">
              The Hitlist (Pending)
            </h2>
            <span className="ml-2 font-mono text-xs bg-muted/20 text-muted-foreground px-2 py-0.5 rounded-sm">
              {pendingTasks.length}
            </span>
          </div>
          {pendingTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/50 glass-panel opacity-50 relative overflow-hidden">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest relative z-10">No pending contracts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Archive Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
            <Archive className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-heading text-2xl uppercase tracking-widest text-muted-foreground">
              Body Count (Completed)
            </h2>
            <span className="ml-2 font-mono text-xs bg-muted/20 text-muted-foreground px-2 py-0.5 rounded-sm">
              {completedTasks.length}
            </span>
          </div>
          {completedTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/50 glass-panel opacity-50">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">No bodies yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-70 hover:opacity-100 transition-opacity">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
