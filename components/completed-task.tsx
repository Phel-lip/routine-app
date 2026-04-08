"use client"

import { CheckCircle2 } from "lucide-react"
import { useRoutineStore, type Task } from "@/lib/store"

interface CompletedTaskProps {
  task: Task
}

export function CompletedTask({ task }: CompletedTaskProps) {
  const { labels } = useRoutineStore()
  const label = labels.find((l) => l.id === task.labelId)
  const { tasks, setTasks, completedTasks, setCompletedTasks, currentReward } = useRoutineStore()
  const handleDelete = () => {
    setCompletedTasks(completedTasks.filter(t => t.id !== task.id))

    if (currentReward && !currentReward.claimed) {
      useRoutineStore.setState({
        currentReward: {
          ...currentReward,
          completedTasks: Math.max(0, currentReward.completedTasks - 1)
        }
      })
    }
  }
  const handleUndo = () => {
    setCompletedTasks(completedTasks.filter(t => t.id !== task.id))

    const { completedAt, ...rest } = task

    const restoredTask: Task = {
      ...rest,
      progress: 0 as 0
    }

    setTasks([restoredTask, ...tasks])

    if (currentReward && !currentReward.claimed) {
      useRoutineStore.setState({
        currentReward: {
          ...currentReward,
          completedTasks: Math.max(0, currentReward.completedTasks - 1)
        }
      })
    }
  }

  return (
    <div className="group relative flex items-center gap-3 rounded-xl bg-secondary/50 p-3 border border-border/50">      <span className="flex-1 text-sm font-medium text-foreground/80 truncate">
        {task.title}
      </span>
      <div
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{ backgroundColor: "#22C55E" }}
      >
        <CheckCircle2 className="h-4 w-4 text-white" />
      </div>
      <button
        onClick={handleDelete}
        className="absolute right-2 top-2 h-6 w-6 rounded-full bg-destructive/80 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
      >
        ❌
      </button>
      <button
      onClick={handleUndo}
      className="absolute right-10 top-2 h-6 w-6 rounded-full bg-primary/80 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary"
    >
      ↩️
    </button>
    </div>
  )
}
