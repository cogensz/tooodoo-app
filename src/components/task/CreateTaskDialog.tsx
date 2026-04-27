"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks, Priority } from "@/hooks/useTasks";
import { PlusSquare, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateTaskDialog() {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [durationMinutes, setDurationMinutes] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, priority, durationMinutes * 60);
    setOpen(false);
    setTitle("");
    setPriority("Normal");
    setDurationMinutes(25);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="w-full sm:w-auto font-mono uppercase tracking-wider group">
          <PlusSquare className="mr-2 h-4 w-4 group-hover:text-white" />
          Assign Hit
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] border-primary">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl tracking-widest text-primary text-glow">
            NEW CONTRACT
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Target Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Eliminate the Rat"
              className="font-mono text-white placeholder:text-muted-foreground/40"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Threat Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Normal", "Urgent", "Critical"] as Priority[]).map((p) => (
                <div
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "cursor-pointer text-center py-2 text-xs font-mono border transition-all select-none",
                    priority === p 
                      ? "bg-primary/20 border-primary text-primary glow-red shadow-inner" 
                      : "border-border/50 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Allocated Time (Minutes)
            </label>
            <Input
              type="number"
              min="1"
              max="99999"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="font-mono text-white"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!title.trim()} className="w-full font-mono tracking-widest text-lg">
              EXECUTE <AlertTriangle className="ml-2 w-4 h-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
