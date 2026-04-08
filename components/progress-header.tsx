"use client"

import { Key } from "lucide-react"
import { useRoutineStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export function ProgressHeader() {
  const { currentReward } = useRoutineStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-4 rounded-xl bg-card/50 px-6 py-4 border border-border/50">
        <div className="flex-1">
          <div className="h-3 rounded-full bg-muted/30 animate-pulse" />
        </div>
        <Key className="h-6 w-6 text-muted-foreground/30" />
      </div>
    )
  }

  const progress = currentReward
    ? Math.min((currentReward.completedTasks / currentReward.targetTasks) * 100, 100)
    : 0

  const canClaim = currentReward && 
    currentReward.completedTasks >= currentReward.targetTasks && 
    !currentReward.claimed

  return (
    <div className="flex items-center gap-4 rounded-xl bg-card/50 px-6 py-4 border border-border/50">
      <div className="flex-1">
        <Progress value={progress} className="h-3" />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {currentReward
              ? `${currentReward.completedTasks}/${currentReward.targetTasks} tarefas`
              : "Defina uma recompensa"}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      <Key
        className={`h-6 w-6 transition-all duration-300 ${
          canClaim
            ? "text-amber-400 animate-bounce"
            : currentReward
            ? "text-amber-400/50"
            : "text-muted-foreground/30"
        }`}
      />
    </div>
  )
}
