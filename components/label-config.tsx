"use client"

import { useState, useEffect } from "react"
import { Settings, Plus, Trash2, Palette } from "lucide-react"
import { useRoutineStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

const colorOptions = [
  "#3B82F6", // Blue
  "#EAB308", // Yellow
  "#EF4444", // Red
  "#22C55E", // Green
  "#A855F7", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#EC4899", // Pink
]

export function LabelConfig() {
  const { labels, addLabel, updateLabel, deleteLabel } = useRoutineStore()
  const [isOpen, setIsOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState(colorOptions[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      addLabel(newLabelName.trim(), newLabelColor)
      setNewLabelName("")
      setNewLabelColor(colorOptions[0])
    }
  }

  const handleEditLabel = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateLabel(id, { name: editName.trim() })
    }
    setEditingId(null)
    setEditName("")
  }

  if (!mounted) {
    return (
      <Button variant="outline" className="gap-2" disabled>
        <Settings className="h-4 w-4" />
        Configurar Labels
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Configurar Categorias
          </DialogTitle>
          <DialogDescription>
            Personalize as categorias das suas tarefas com cores e nomes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Existing Labels */}
          <div className="space-y-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
              >
                <div
                  className="h-6 w-6 rounded-md shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                {editingId === label.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveEdit(label.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(label.id)}
                    className="h-8 flex-1"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleEditLabel(label.id, label.name)}
                    className="flex-1 text-left text-sm font-medium hover:text-primary"
                  >
                    {label.name}
                  </button>
                )}
                <div className="flex items-center gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateLabel(label.id, { color })}
                      className={`h-4 w-4 rounded-full transition-transform hover:scale-125 ${
                        label.color === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {labels.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLabel(label.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Label */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">
              Adicionar nova categoria
            </p>
            <div className="flex items-center gap-3">
              <Input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
              />
              <div className="flex items-center gap-1">
                {colorOptions.slice(0, 4).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewLabelColor(color)}
                    className={`h-5 w-5 rounded-full transition-transform hover:scale-125 ${
                      newLabelColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button onClick={handleAddLabel} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
