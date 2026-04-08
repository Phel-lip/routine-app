"use client"

import { useEffect, useState } from "react"
import { ClipboardList, Trophy, Sparkles } from "lucide-react"
import { useRoutineStore } from "@/lib/store"
import { TaskCard } from "@/components/task-card"
import { CompletedTask } from "@/components/completed-task"
import { RewardSection } from "@/components/reward-section"
import { ProgressHeader } from "@/components/progress-header"
import { LabelConfig } from "@/components/label-config"
import { AddTaskForm } from "@/components/add-task-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"

export default function RoutinePage() {
  const { tasks, completedTasks, setTasks } = useRoutineStore()
  const [mounted, setMounted] = useState(false)
  const handleDragEnd = (event: any) => {
  const { active, over } = event

  if (!over) return

  if (active.id !== over.id) {
    const oldIndex = tasks.findIndex(t => t.id === active.id)
    const newIndex = tasks.findIndex(t => t.id === over.id)

    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    setTasks(newTasks)
  }
}

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            DailyXP
            <Sparkles className="h-8 w-8 text-primary" />
          </h1>
          <p className="mt-2 text-muted-foreground">
            Organize suas tarefas e desbloqueie recompensas
          </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressHeader />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Tasks Column */}
          <div className="rounded-2xl bg-card p-6 border border-border/50 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <ClipboardList className="h-5 w-5 text-primary" />
                TAREFAS
              </h2>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                {mounted ? tasks.length : 0}
              </span>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {mounted && tasks.length > 0 ? (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </DndContext>
                ) : mounted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted/50 p-4">
                      <ClipboardList className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Nenhuma tarefa ainda
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Adicione sua primeira tarefa!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-4">
              <AddTaskForm />
            </div>
          </div>

          {/* Center Column - Reward */}
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-6 border border-border/50 shadow-lg lg:min-w-[280px]">
            <LabelConfig />
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <RewardSection />
            </div>
          </div>

          {/* Completed Column */}
          <div className="rounded-2xl bg-card p-6 border border-border/50 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Trophy className="h-5 w-5 text-primary" />
                CONCLUÍDOS
              </h2>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                {mounted ? completedTasks.length : 0}
              </span>
            </div>

            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-3">
                {mounted && completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <CompletedTask key={task.id} task={task} />
                  ))
                ) : mounted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted/50 p-4">
                      <Trophy className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Nenhuma tarefa concluída
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Complete tarefas para vê-las aqui!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 rounded-xl bg-muted/30 animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Desenvolvido por Phellip • React | Zustand | dnd-kit</p>
        </footer>
      </div>
    </main>
  )
}
