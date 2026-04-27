import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy } from "firebase/firestore";
import { useAuth } from "./useAuth";

export type Priority = "Critical" | "Urgent" | "Normal";
export type TaskState = "Active" | "Paused" | "Completed" | "Pending";

export interface Task {
  id: string;
  userId: string;
  title: string;
  priority: Priority;
  state: TaskState;
  timerDurationSeconds: number; // e.g. 25 mins = 1500
  elapsedSeconds: number;
  lastActiveTimestamp: Timestamp | null;
  createdAt: Timestamp;
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (title: string, priority: Priority, timerDurationSeconds: number) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title,
        priority,
        state: "Pending",
        timerDurationSeconds,
        elapsedSeconds: 0,
        lastActiveTimestamp: null,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTaskState = async (taskId: string, newState: TaskState, elapsedSeconds?: number) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const updateData: any = { state: newState };
      
      if (newState === "Active") {
        updateData.lastActiveTimestamp = Timestamp.now();
      }
      
      if (elapsedSeconds !== undefined) {
        updateData.elapsedSeconds = elapsedSeconds;
      }

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return { tasks, loading, addTask, updateTaskState, deleteTask };
}
