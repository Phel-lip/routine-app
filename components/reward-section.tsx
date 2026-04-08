"use client"

import { useState, useEffect } from "react"
import { Key, Lock, Gift, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRoutineStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function RewardSection() {
  const { currentReward, setReward, claimReward, resetReward } = useRoutineStore()
  const [isSettingReward, setIsSettingReward] = useState(false)
  const [rewardTitle, setRewardTitle] = useState("")
  const [targetTasks, setTargetTasks] = useState(5)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const canClaim = currentReward && 
    currentReward.completedTasks >= currentReward.targetTasks && 
    !currentReward.claimed

  const handleSetReward = () => {
    if (rewardTitle.trim()) {
      setReward(rewardTitle.trim(), targetTasks)
      setRewardTitle("")
      setTargetTasks(5)
      setIsSettingReward(false)
    }
  }

  const handleClaim = () => {
    claimReward()
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

  const handleNewReward = () => {
    resetReward()
    setIsSettingReward(true)
  }

  const progress = currentReward
    ? Math.min((currentReward.completedTasks / currentReward.targetTasks) * 100, 100)
    : 0

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-32 w-32 rounded-2xl bg-muted/30 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        {/* Treasure Chest */}
        <div className="relative">
          <div
            className={cn(
              "relative flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-xl transition-all duration-500",
              canClaim && "animate-pulse shadow-amber-500/50 shadow-2xl"
            )}
          >
            {/* Chest Body */}
            <div className="absolute inset-x-2 bottom-2 top-8 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-600" />
            
            {/* Chest Lid */}
            <div className={cn(
              "absolute inset-x-2 top-2 h-8 rounded-t-lg bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-400 transition-transform duration-500",
              (currentReward?.claimed || showCelebration) && "-rotate-12 -translate-y-2"
            )} />
            
            {/* Lock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              {currentReward?.claimed ? (
                <Gift className="h-8 w-8 text-amber-300" />
              ) : (
                <Lock className="h-6 w-6 text-amber-300" />
              )}
            </div>

            {/* Glow effect when claimable */}
            {canClaim && (
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping" />
            )}
          </div>

          {/* Key */}
          {canClaim && !currentReward?.claimed && (
            <button
              onClick={handleClaim}
              className="absolute -right-4 -top-4 animate-bounce"
            >
              <Key className="h-10 w-10 text-amber-400 drop-shadow-lg hover:text-amber-300 transition-colors cursor-pointer" />
            </button>
          )}
        </div>

        {/* Reward Text */}
        <div className="text-center">
          {currentReward ? (
            <>
              <p className="text-lg font-semibold text-foreground/90 max-w-[200px]">
                {currentReward.claimed ? (
                  <span className="text-primary flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Parabéns!
                    <Sparkles className="h-5 w-5" />
                  </span>
                ) : (
                  `"${currentReward.title}"`
                )}
              </p>
              {currentReward.claimed ? (
                <Button
                  onClick={handleNewReward}
                  className="mt-4"
                  variant="outline"
                >
                  Nova Recompensa
                </Button>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentReward.completedTasks} de {currentReward.targetTasks} tarefas
                </p>
              )}
            </>
          ) : (
            <Button
              onClick={() => setIsSettingReward(true)}
              variant="outline"
              className="gap-2"
            >
              <Gift className="h-4 w-4" />
              Definir Recompensa
            </Button>
          )}
        </div>
      </div>

      {/* Set Reward Dialog */}
      <Dialog open={isSettingReward} onOpenChange={setIsSettingReward}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Definir Recompensa
            </DialogTitle>
            <DialogDescription>
              Escolha uma recompensa para se motivar a completar suas tarefas!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Qual será sua recompensa?
              </label>
              <Input
                value={rewardTitle}
                onChange={(e) => setRewardTitle(e.target.value)}
                placeholder="Ex: Tomar uma garrafa de vinho"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Quantas tarefas para desbloquear?
              </label>
              <div className="mt-2 flex items-center gap-4">
                {[3, 5, 7, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTargetTasks(num)}
                    className={cn(
                      "h-10 w-10 rounded-lg border-2 font-semibold transition-all",
                      targetTasks === num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/50 text-foreground hover:border-primary/50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleSetReward} className="w-full">
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center animate-in zoom-in-50 duration-500">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-primary mb-2">Parabéns!</h2>
            <p className="text-xl text-foreground/80">
              Você desbloqueou sua recompensa!
            </p>
            <p className="text-2xl font-semibold text-accent mt-4">
              {currentReward?.title}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
