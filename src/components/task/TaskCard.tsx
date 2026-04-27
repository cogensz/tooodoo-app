"use client";

import { useEffect, useState } from "react";
import { Task, useTasks } from "@/hooks/useTasks";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Play, Pause, CheckSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: Task }) {
  const { updateTaskState, deleteTask } = useTasks();
  const [localElapsed, setLocalElapsed] = useState(task.elapsedSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (task.state === "Active") {
      // Calculate elapsed based on timestamp diff
      const startSecs = task.lastActiveTimestamp ? task.lastActiveTimestamp.seconds : Date.now() / 1000;
      
      interval = setInterval(() => {
        const now = Date.now() / 1000;
        const diff = Math.floor(now - startSecs);
        const newElapsed = Math.min(task.elapsedSeconds + diff, task.timerDurationSeconds);
        setLocalElapsed(newElapsed);
        
        // Auto-complete if timer reaches duration
        if (newElapsed >= task.timerDurationSeconds) {
          updateTaskState(task.id, "Completed", task.timerDurationSeconds);
        }
      }, 1000);
    } else {
      setLocalElapsed(task.elapsedSeconds);
    }

    return () => clearInterval(interval);
  }, [task.state, task.lastActiveTimestamp, task.elapsedSeconds, task.timerDurationSeconds, task.id, updateTaskState]);

  const handlePlayPause = () => {
    if (task.state === "Active") {
      updateTaskState(task.id, "Paused", localElapsed);
    } else {
      updateTaskState(task.id, "Active", localElapsed);
    }
  };

  const handleComplete = () => {
    updateTaskState(task.id, "Completed", localElapsed);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const progressPercentage = (localElapsed / task.timerDurationSeconds) * 100;
  
  const remaining = Math.max(0, task.timerDurationSeconds - localElapsed);
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");

  const priorityColors = {
    Critical: "text-red-500 border-red-500",
    Urgent: "text-orange-500 border-orange-500",
    Normal: "text-blue-500 border-blue-500",
  };

  return (
    <Card className={cn(
      "relative group transition-all",
      task.state === "Active" ? "glow-red border-primary" : "border-border/40 hover:border-primary/50"
    )}>
      {task.state === "Active" && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-none">
          <div className="absolute top-0 left-[-100%] w-[200%] h-1 bg-primary/50 animate-pulse" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-mono text-lg uppercase tracking-wider line-clamp-2">
            {task.title}
          </CardTitle>
          <div className={cn("text-[10px] uppercase font-mono px-2 py-1 border rounded-sm", priorityColors[task.priority])}>
            {task.priority}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex justify-center py-4">
        {task.state === "Active" || task.state === "Paused" || task.state === "Pending" ? (
          <CircularProgress value={progressPercentage} size={100} strokeWidth={6}>
            <div className="flex flex-col items-center">
              <span className={cn("text-xl font-bold font-mono", task.state === "Active" ? "text-primary text-glow" : "text-white")}>
                {m}:{s}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">{task.state}</span>
            </div>
          </CircularProgress>
        ) : (
          <div className="text-center py-4">
            <CheckSquare className="w-12 h-12 text-primary mx-auto mb-2 text-glow" />
            <span className="font-mono text-primary text-sm uppercase tracking-widest font-bold">CONTRACT FULFILLED</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between pt-2">
        <div className="flex gap-2">
          {task.state !== "Completed" && (
            <>
              <Button size="icon-sm" variant={task.state === "Active" ? "destructive" : "default"} onClick={handlePlayPause}>
                {task.state === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="icon-sm" variant="outline" onClick={handleComplete}>
                <CheckSquare className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
