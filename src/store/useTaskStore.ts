import { create } from 'zustand';
import type { Task, TaskStatus } from '@/types';

interface TaskState {
  tasks: Task[];

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTaskStatus: (id: string, status: TaskStatus, errorMessage?: string) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
  getActiveTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  addTask: (task) => {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    set((state) => ({
      tasks: [
        {
          ...task,
          id,
          createdAt: now,
          updatedAt: now,
        },
        ...state.tasks,
      ],
    }));

    return id;
  },

  updateTaskStatus: (id, status, errorMessage) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              errorMessage,
              updatedAt: Date.now(),
            }
          : task
      ),
    }));
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  clearTasks: () => {
    set({ tasks: [] });
  },

  getActiveTasks: () => {
    return get().tasks.filter(
      (task) => task.status === 'pending' || task.status === 'generating'
    );
  },
}));
