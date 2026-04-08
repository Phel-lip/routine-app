"use client"

import { useState } from "react"
import { Sun, Sunset, Moon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRoutineStore, type Task, type TimeOfDay, type TaskProgress } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface TaskCardProps {
  task: Task
}

const timeIcons = {
  morning: Sun,
  afternoon: Sunset,
  night: Moon,
}

const timeColors = {
  morning: "text-amber-400",
  afternoon: "text-orange-500",
  night: "text-indigo-400",
}

const timeLabels = {
  morning: "Manhã",
  afternoon: "Tarde",
  night: "Noite",
}

export function TaskCard({ task }: TaskCardProps) {
    const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const { labels, updateTask, deleteTask } = useRoutineStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const label = labels.find((l) => l.id === task.labelId) || labels[0]
  const TimeIcon = timeIcons[task.timeOfDay]

  const cycleTimeOfDay = () => {
    const times: TimeOfDay[] = ["morning", "afternoon", "night"]
    const currentIndex = times.indexOf(task.timeOfDay)
    const nextIndex = (currentIndex + 1) % times.length
    updateTask(task.id, { timeOfDay: times[nextIndex] })
  }

  const cycleLabel = () => {
    const currentIndex = labels.findIndex((l) => l.id === task.labelId)
    const nextIndex = (currentIndex + 1) % labels.length
    updateTask(task.id, { labelId: labels[nextIndex].id })
  }

  const handleProgressChange = (value: number[]) => {
    let progress: TaskProgress = 0
    if (value[0] >= 75) progress = 100
    else if (value[0] >= 25) progress = 50
    updateTask(task.id, { progress })
  }

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  return (
      <div
        ref={setNodeRef}
        style={style}
        className="group relative rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary/70 border border-border/50"
      >      
      <div className="flex items-center gap-3">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground"
      >
        ☰
      </div>
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            className="h-8 flex-1 bg-muted/50 text-sm"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-left text-sm font-medium text-foreground/90 hover:text-foreground truncate"
          >
            {task.title || "Vou estar fazendo..."}
          </button>
        )}

        <button
          onClick={cycleLabel}
          className="h-6 w-6 rounded-md transition-transform hover:scale-110 shrink-0"
          style={{ backgroundColor: label.color }}
          title={label.name}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <Slider
            value={[task.progress]}
            max={100}
            step={50}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <button
          onClick={cycleTimeOfDay}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 transition-all hover:bg-muted",
            timeColors[task.timeOfDay]
          )}
          title={timeLabels[task.timeOfDay]}
        >
          <TimeIcon className="h-4 w-4" />
        </button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTask(task.id)}
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
