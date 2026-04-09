import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TimeOfDay = "morning" | "afternoon" | "night"
export type TaskProgress = 0 | 50 | 100

export interface Label {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  labelId: string
  progress: TaskProgress
  timeOfDay: TimeOfDay
  createdAt: Date
  completedAt?: Date
  weekDays: boolean[]
}

export interface Reward {
  id: string
  title: string
  targetTasks: number
  completedTasks: number
  claimed: boolean
}

interface RoutineStore {
  tasks: Task[]
  completedTasks: Task[]
  labels: Label[]
  setTasks: (tasks: Task[]) => void
  setCompletedTasks: (tasks: Task[]) => void
  currentReward: Reward | null

  // Task actions
  addTask: (title: string, labelId: string, timeOfDay: TimeOfDay) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  
  deleteTask: (id: string) => void
  completeTask: (id: string) => void

  // Label actions
  addLabel: (name: string, color: string) => void
  updateLabel: (id: string, updates: Partial<Label>) => void
  deleteLabel: (id: string) => void
  toggleWeekDay: (taskId: string, dayIndex: number) => void

  // Reward actions
  setReward: (title: string, targetTasks: number) => void
  claimReward: () => void
  resetReward: () => void
}

const defaultLabels: Label[] = [
  { id: "1", name: "Estudos", color: "#3B82F6" },
  { id: "2", name: "Afazeres", color: "#EAB308" },
  { id: "3", name: "Trabalho", color: "#EF4444" },
  { id: "4", name: "Saúde", color: "#22C55E" },
  { id: "5", name: "Lazer", color: "#A855F7" },
]

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      completedTasks: [],
      labels: defaultLabels,
      currentReward: null,

      setTasks: (tasks) => set({ tasks }),
      setCompletedTasks: (tasks) => set({ completedTasks: tasks }),

      addTask: (title, labelId, timeOfDay) => {
        if (!title || !title.trim()) return
        
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          labelId,
          progress: 0,
          timeOfDay,
          createdAt: new Date(),
          weekDays: [false, false, false, false, false, false, false],
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))

        // Check if task should be completed
        const task = get().tasks.find((t) => t.id === id)
        if (task && updates.progress === 100) {
          setTimeout(() => get().completeTask(id), 500)
        }
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const completedTask: Task = {
          ...task,
          progress: 100,
          completedAt: new Date(),
        }

        set((state) => {
          const newCompletedTasks = [completedTask, ...state.completedTasks]
          const reward = state.currentReward

          if (reward && !reward.claimed) {
            const newCompletedCount = reward.completedTasks + 1
            return {
              tasks: state.tasks.filter((t) => t.id !== id),
              completedTasks: newCompletedTasks,
              currentReward: {
                ...reward,
                completedTasks: newCompletedCount,
              },
            }
          }

          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            completedTasks: newCompletedTasks,
          }
        })
      },

      addLabel: (name, color) => {
        const newLabel: Label = {
          id: crypto.randomUUID(),
          name,
          color,
        }
        set((state) => ({ labels: [...state.labels, newLabel] }))
      },

      updateLabel: (id, updates) => {
        set((state) => ({
          labels: state.labels.map((label) =>
            label.id === id ? { ...label, ...updates } : label
          ),
        }))
      },

      deleteLabel: (id) => {
        set((state) => ({
          labels: state.labels.filter((label) => label.id !== id),
        }))
      },

      setReward: (title, targetTasks) => {
        set({
          currentReward: {
            id: crypto.randomUUID(),
            title,
            targetTasks,
            completedTasks: 0,
            claimed: false,
          },
        })
      },

      claimReward: () => {
        set((state) => ({
          currentReward: state.currentReward
            ? { ...state.currentReward, claimed: true }
            : null,
        }))
      },

      resetReward: () => {
        set({ currentReward: null })
      },
        
        toggleWeekDay: (taskId, dayIndex) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task

            const newWeek = [...(task.weekDays ?? [false, false, false, false, false, false, false])]
            newWeek[dayIndex] = !newWeek[dayIndex]

            return { ...task, weekDays: newWeek }
          })
        }))
      },
    }),
    {
      name: "routine-storage",
    }
  )
)
