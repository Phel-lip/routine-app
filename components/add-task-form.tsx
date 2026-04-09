"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { useRoutineStore, type TimeOfDay } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function AddTaskForm() {
  const { labels, addTask } = useRoutineStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddTask = () => {
    const defaultLabel = labels[0]?.id || "1"
    const defaultTime: TimeOfDay = "morning"
    addTask("Nova tarefa", defaultLabel, defaultTime)
  }

  if (!mounted) {
    return (
      <Button className="w-full gap-2" disabled>
        <Plus className="h-4 w-4" />
        Nova Tarefa
      </Button>
    )
  }

  return (
    <Button onClick={handleAddTask} className="w-full gap-2">
      <Plus className="h-4 w-4" />
      Nova Tarefa
    </Button>
  )
}
