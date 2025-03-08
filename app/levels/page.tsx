"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { databases } from "@/lib/appwriteConfig"
import type { Emotion } from "@/types/game-types"
import EmotionGame from "@/components/emotion-game"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Lock, Trophy, Gift, Heart, Clock, Target, Zap, Award, ChevronLeft, X, ArrowLeft, Sparkles } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import confetti from "canvas-confetti"

// Import your existing types and data from the attachment
// Level objectives types
type ObjectiveType = "score" | "collect" | "clear" | "time"

interface Objective {
  type: ObjectiveType
  target: number
  current: number
  icon: React.ReactNode
  label: string
  color: string
}

interface PowerUp {
  id: number
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

interface Level {
  id: number
  name: string
  description: string
  image: string
  unlocked: boolean
  completed: boolean
  stars: number
  color: string
  shadowColor: string
  gridSize: { rows: number; cols: number }
  moves: number
  objectives: Objective[]
  powerUps: PowerUp[]
  difficulty: 1 | 2 | 3 | 4 | 5
  position: { x: number; y: number }
}

const powerUps: PowerUp[] = [
  {
    id: 1,
    name: "Color Bomb",
    description: "Clears all candies of one color",
    icon: <Zap size={20} className="text-white" />,
    color: "bg-primary",
  },
  {
    id: 2,
    name: "Striped Candy",
    description: "Clears an entire row or column",
    icon: <Target size={20} className="text-white" />,
    color: "bg-secondary",
  },
  {
    id: 3,
    name: "Extra Moves",
    description: "+5 extra moves",
    icon: <Award size={20} className="text-white" />,
    color: "bg-accent",
  },
]

const levels: Level[] = [
  {
    id: 1,
    name: "Sweet Start",
    description: "Match 3 emotions to begin your journey",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: true,
    completed: true,
    stars: 3,
    color: "from-pink-400 to-pink-600",
    shadowColor: "shadow-pink-500/30",
    gridSize: { rows: 6, cols: 6 },
    moves: 15,
    objectives: [
      {
        type: "score",
        target: 1000,
        current: 1000,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
    ],
    powerUps: [powerUps[0]],
    difficulty: 1,
    position: { x: 20, y: 20 },
  },
  {
    id: 2,
    name: "Emotion Match",
    description: "Match emotions with situations",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: true,
    completed: false,
    stars: 0,
    color: "from-purple-400 to-purple-600",
    shadowColor: "shadow-purple-500/30",
    gridSize: { rows: 7, cols: 7 },
    moves: 20,
    objectives: [
      {
        type: "score",
        target: 2000,
        current: 0,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
      {
        type: "collect",
        target: 10,
        current: 0,
        icon: <Heart size={16} className="text-red-500" />,
        label: "Hearts",
        color: "bg-red-400",
      },
    ],
    powerUps: [powerUps[0], powerUps[1]],
    difficulty: 2,
    position: { x: 35, y: 35 },
  },
  {
    id: 3,
    name: "Emotion Stories",
    description: "Create stories with emotions",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-blue-400 to-blue-600",
    shadowColor: "shadow-blue-500/30",
    gridSize: { rows: 7, cols: 8 },
    moves: 25,
    objectives: [
      {
        type: "score",
        target: 3000,
        current: 0,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
      {
        type: "clear",
        target: 15,
        current: 0,
        icon: <Target size={16} className="text-blue-500" />,
        label: "Blocks",
        color: "bg-blue-400",
      },
    ],
    powerUps: [powerUps[0], powerUps[1], powerUps[2]],
    difficulty: 3,
    position: { x: 50, y: 20 },
  },
  {
    id: 4,
    name: "Emotion Detective",
    description: "Find hidden emotions in scenes",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-green-400 to-green-600",
    shadowColor: "shadow-green-500/30",
    gridSize: { rows: 8, cols: 8 },
    moves: 30,
    objectives: [
      {
        type: "score",
        target: 4000,
        current: 0,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
      {
        type: "time",
        target: 60,
        current: 0,
        icon: <Clock size={16} className="text-green-500" />,
        label: "Seconds",
        color: "bg-green-400",
      },
    ],
    powerUps: [powerUps[0], powerUps[1]],
    difficulty: 4,
    position: { x: 65, y: 35 },
  },
  {
    id: 5,
    name: "Emotion Charades",
    description: "Act out and guess emotions",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-yellow-400 to-yellow-600",
    shadowColor: "shadow-yellow-500/30",
    gridSize: { rows: 8, cols: 9 },
    moves: 35,
    objectives: [
      {
        type: "score",
        target: 5000,
        current: 0,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
      {
        type: "collect",
        target: 20,
        current: 0,
        icon: <Heart size={16} className="text-red-500" />,
        label: "Hearts",
        color: "bg-red-400",
      },
      {
        type: "clear",
        target: 10,
        current: 0,
        icon: <Target size={16} className="text-blue-500" />,
        label: "Blocks",
        color: "bg-blue-400",
      },
    ],
    powerUps: [powerUps[0], powerUps[1], powerUps[2]],
    difficulty: 5,
    position: { x: 80, y: 20 },
  },
  {
    id: 6,
    name: "Emotion Master",
    description: "Final challenge with all emotions",
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-red-400 to-red-600",
    shadowColor: "shadow-red-500/30",
    gridSize: { rows: 9, cols: 9 },
    moves: 40,
    objectives: [
      {
        type: "score",
        target: 6000,
        current: 0,
        icon: <Star size={16} className="text-yellow-400" />,
        label: "Score",
        color: "bg-yellow-400",
      },
      {
        type: "collect",
        target: 25,
        current: 0,
        icon: <Heart size={16} className="text-red-500" />,
        label: "Hearts",
        color: "bg-red-400",
      },
      {
        type: "clear",
        target: 20,
        current: 0,
        icon: <Target size={16} className="text-blue-500" />,
        label: "Blocks",
        color: "bg-blue-400",
      },
      {
        type: "time",
        target: 90,
        current: 0,
        icon: <Clock size={16} className="text-green-500" />,
        label: "Seconds",
        color: "bg-green-400",
      },
    ],
    powerUps: [powerUps[0], powerUps[1], powerUps[2]],
    difficulty: 5,
    position: { x: 95, y: 35 },
  },
]

// Path points for the winding path
const pathPoints = [
  { x: 20, y: 20 },
  { x: 35, y: 35 },
  { x: 50, y: 20 },
  { x: 65, y: 35 },
  { x: 80, y: 20 },
  { x: 95, y: 35 },
]

export default function Levels() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [userLevels, setUserLevels] = useState(levels)
  const [showSplash, setShowSplash] = useState(false)
  const [gameProgress, setGameProgress] = useState(0)
  const [showGameBoard, setShowGameBoard] = useState(false)
  const [currentMoves, setCurrentMoves] = useState(0)
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showEmotionGame, setShowEmotionGame] = useState(false)

  // Fetch emotions from Appwrite
  useEffect(() => {
    let isMounted = true
    const fetchEmotions = async () => {
      setIsLoading(true)
      try {
        const response = await databases.listDocuments("67c98cc3002b3e3dc1a5", "67c98ce00023c7585f67")

        const emotionsData = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          image: doc.image || "/placeholder.svg?height=300&width=300", // Using database image URL
          description: doc.description,
        }))

        console.log("Fetched emotions:", emotionsData) // Debug log
        if (isMounted) {
          setEmotions(emotionsData)
        }
      } catch (error) {
        console.error("Error fetching emotions:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchEmotions()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    // Calculate overall game progress
    const completedLevels = userLevels.filter((level) => level.completed).length
    const totalLevels = userLevels.length
    setGameProgress(Math.round((completedLevels / totalLevels) * 100))
  }, [userLevels])

  const handleLevelClick = (id: number) => {
    const level = userLevels.find((l) => l.id === id)
    if (level && level.unlocked) {
      setSelectedLevel(id)
      setShowLevelModal(true)
    }
  }

  const handleStartLevel = () => {
    if (selectedLevel) {
      setShowLevelModal(false)
      setShowEmotionGame(true)
    }
  }

  const handleCompleteLevel = (stars: number) => {
    if (selectedLevel) {
      // Hide game board
      setShowEmotionGame(false)

      // Show splash screen
      setShowSplash(true)

      // Trigger confetti effect
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
      })

      // Update level status
      setUserLevels((prev) =>
        prev.map((level) => {
          if (level.id === selectedLevel) {
            return { ...level, completed: true, stars }
          }
          if (level.id === selectedLevel + 1) {
            return { ...level, unlocked: true }
          }
          return level
        }),
      )

      // Save progress to localStorage
      localStorage.setItem(
        "emotionGameLevels",
        JSON.stringify(
          userLevels.map((level) => {
            if (level.id === selectedLevel) {
              return { ...level, completed: true, stars }
            }
            if (level.id === selectedLevel + 1) {
              return { ...level, unlocked: true }
            }
            return level
          }),
        ),
      )

      // Close level modal and splash after a delay
      setTimeout(() => {
        setShowSplash(false)
        setSelectedLevel(null)
      }, 3000)
    }
  }

  const handleMakeMove = () => {
    if (currentMoves > 0) {
      // Decrease moves
      setCurrentMoves((prev) => prev - 1)

      // Update objectives (simulating progress)
      setObjectives((prev) =>
        prev.map((obj) => ({
          ...obj,
          current: Math.min(obj.current + Math.floor(Math.random() * 3) + 1, obj.target),
        })),
      )
    }

    // Check if all objectives are complete
    const allComplete = objectives.every((obj) => obj.current >= obj.target)
    if (allComplete || currentMoves === 1) {
      handleCompleteLevel(3)
    }
  }

  const renderGamePiece = (type: string, size = 40) => {
    const colors = ["bg-red-400", "bg-primary/80", "bg-accent/80", "bg-yellow-400", "bg-secondary/80", "bg-pink-400"]

    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    return (
      <div
        className={`${randomColor} rounded-full flex items-center justify-center`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {type === "special" && <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>}
        {type === "special" && <Sparkles size={16} className="text-white" />}
      </div>
    )
  }

  const renderGameBoard = () => {
    if (!selectedLevel) return null

    const level = userLevels.find((l) => l.id === selectedLevel)
    if (!level) return null

    const { rows, cols } = level.gridSize

    return (
      <div className="bg-gradient-to-b from-primary/5 to-secondary/5 p-4 rounded-xl">
        {/* Game info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full shadow-sm">
            <div className="text-primary font-bold">Moves:</div>
            <div className="text-foreground font-bold">{currentMoves}</div>
          </div>

          <div className="flex gap-2">
            {level.powerUps.map((powerUp) => (
              <motion.div
                key={powerUp.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${powerUp.color} w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md`}
              >
                {powerUp.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {objectives.map((objective, idx) => {
            const progress = Math.min(objective.current / objective.target, 1)
            return (
              <div key={idx} className="bg-card rounded-lg p-2 flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`${objective.color} w-6 h-6 rounded-full flex items-center justify-center`}>
                    {objective.icon}
                  </div>
                  <div className="text-xs font-medium">{objective.label}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-xs font-bold">
                    {objective.current}{' / '}{objective.target}
                  </div>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Game grid */}
        <div
          className="grid gap-1 bg-card/80 p-2 rounded-lg border-2 border-primary/20"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const isSpecial = Math.random() > 0.85
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center cursor-pointer"
                onClick={handleMakeMove}
              >
                {renderGamePiece(isSpecial ? "special" : "regular", 36)}
              </motion.div>
            )
          })}
        </div>

        {/* Game controls */}
        <div className="mt-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full shadow-lg"
            onClick={() => setShowGameBoard(false)}
          >
            Exit Level
          </motion.button>
        </div>
      </div>
    )
  }

  // Generate SVG path for the winding road
  const generatePath = () => {
    if (pathPoints.length < 2) return ""

    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`

    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1]
      const current = pathPoints[i]

      // For a curved path
      if (i % 2 === 1) {
        // Path curves down
        path += ` Q ${(prev.x + current.x) / 2} ${prev.y + 15} ${current.x} ${current.y}`
      } else {
        // Path curves up
        path += ` Q ${(prev.x + current.x) / 2} ${prev.y - 15} ${current.x} ${current.y}`
      }
    }

    return path
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
                <div className="relative bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                  <span className="text-primary font-medium">Fun Challenges</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Emotion Adventure
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Complete exciting challenges and earn sweet rewards as you master emotional intelligence!
            </p>

            {/* Overall progress bar */}
            <div className="max-w-md mx-auto mt-8 bg-muted rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${gameProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-2">Overall Progress: {gameProgress}%</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-24">
        {/* Candy Crush style map with bubbles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12 relative"
        >
          <div className="relative w-full h-[450px] bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-blue-200 rounded-full opacity-20"></div>

            {/* Clouds */}
            <div className="absolute top-5 left-1/4 flex space-x-1">
              <div className="w-10 h-6 bg-white rounded-full opacity-50"></div>
              <div className="w-14 h-8 bg-white rounded-full opacity-50"></div>
              <div className="w-10 h-6 bg-white rounded-full opacity-50"></div>
            </div>

            <div className="absolute bottom-10 right-1/4 flex space-x-1">
              <div className="w-8 h-5 bg-white rounded-full opacity-50"></div>
              <div className="w-12 h-7 bg-white rounded-full opacity-50"></div>
              <div className="w-8 h-5 bg-white rounded-full opacity-50"></div>
            </div>

            {/* Trees and decorations */}
            <div className="absolute top-1/4 left-10">
              <div className="w-12 h-12 bg-accent/50 rounded-full"></div>
              <div className="w-3 h-6 bg-amber-700/50 mx-auto -mt-1"></div>
            </div>

            <div className="absolute bottom-1/4 right-10">
              <div className="w-10 h-10 bg-accent/50 rounded-full"></div>
              <div className="w-2 h-5 bg-amber-700/50 mx-auto -mt-1"></div>
            </div>

            {/* Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Dotted path background */}
              <path
                d={generatePath()}
                stroke="rgba(var(--primary), 0.2)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Solid path foreground */}
              <motion.path
                d={generatePath()}
                stroke="rgba(var(--primary), 0.4)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1,1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>

            {/* Level bubbles */}
            {userLevels.map((level, index) => {
              const isCompleted = level.completed
              const isLocked = !level.unlocked

              return (
                <motion.div
                  key={level.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  style={{
                    left: `${level.position.x}%`,
                    top: `${level.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute"
                >
                  <motion.div
                    whileHover={level.unlocked ? { scale: 1.1 } : {}}
                    whileTap={level.unlocked ? { scale: 0.95 } : {}}
                    onClick={() => handleLevelClick(level.id)}
                    className={`relative flex items-center justify-center cursor-pointer ${isLocked ? "opacity-80" : ""}`}
                  >
                    {/* Outer glow for active level */}
                    {level.unlocked && !level.completed && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        style={{ zIndex: -1 }}
                      />
                    )}

                    {/* Level bubble */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        isLocked
                          ? "bg-muted"
                          : isCompleted
                            ? "bg-gradient-to-br from-accent to-accent/80"
                            : "bg-gradient-to-br from-primary to-secondary"
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={24} className="text-muted-foreground" />
                      ) : (
                        <span className="text-xl font-bold text-white">{level.id}</span>
                      )}
                    </div>

                    {/* Stars indicator */}
                    {level.completed && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < level.stars ? "text-yellow-400 fill-yellow-400 -mx-0.5" : "text-muted -mx-0.5"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Level guide */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold text-lg">Select a Level</h3>
              </div>
              <p className="text-muted-foreground">
                Choose an unlocked level from the adventure map to begin your emotional journey.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold text-lg">Complete Objectives</h3>
              </div>
              <p className="text-muted-foreground">
                Match emotions and complete the level objectives before you run out of moves.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold text-lg">Earn Rewards</h3>
              </div>
              <p className="text-muted-foreground">
                Earn stars and unlock new levels as you progress through your emotional learning adventure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Modal */}
      <AnimatePresence>
        {showLevelModal && selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const level = userLevels.find((l) => l.id === selectedLevel)
                if (!level) return null

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowLevelModal(false)}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <ChevronLeft size={24} className="text-muted-foreground" />
                      </button>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Level {level.id}
                      </h2>
                      <button
                        onClick={() => setShowLevelModal(false)}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <X size={20} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-foreground">{level.name}</h3>
                      <p className="text-muted-foreground">{level.description}</p>
                    </div>

                    <div className="relative h-40 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-xl mb-6 flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.05, 1, 1.05, 1],
                        }}
                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Image
                          src={level.image || "/placeholder.svg?height=150&width=150"}
                          alt={level.name}
                          width={120}
                          height={120}
                          className="object-contain drop-shadow-lg"
                        />
                      </motion.div>
                    </div>

                    {/* Level details */}
                    <div className="bg-muted rounded-xl p-4 mb-6">
                      <h3 className="font-bold text-foreground mb-2">Level Details</h3>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary/40 rounded-lg"></div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Grid Size</div>
                            <div className="font-medium">
                              {level.gridSize.rows}×{level.gridSize.cols}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <Clock size={20} className="text-secondary/70" />
                          </div>
                          <div>
                            <div className="text-muted-foreground">Moves</div>
                            <div className="font-medium">{level.moves}</div>
                          </div>
                        </div>
                      </div>

                      {/* Objectives */}
                      <h3 className="font-bold text-foreground mt-4 mb-2">Objectives</h3>
                      <div className="space-y-2">
                        {level.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-card p-2 rounded-lg">
                            <div className={`${obj.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                              {obj.icon}
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">{obj.label}</div>
                              <div className="font-medium">{obj.target}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Power-ups */}
                      {level.powerUps.length > 0 && (
                        <>
                          <h3 className="font-bold text-foreground mt-4 mb-2">Available Power-ups</h3>
                          <div className="flex gap-2 flex-wrap">
                            {level.powerUps.map((powerUp) => (
                              <div key={powerUp.id} className="bg-card p-2 rounded-lg flex items-center gap-2">
                                <div
                                  className={`${powerUp.color} w-8 h-8 rounded-full flex items-center justify-center`}
                                >
                                  {powerUp.icon}
                                </div>
                                <div className="text-xs">{powerUp.name}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={handleStartLevel}
                          className="px-8 py-3 text-lg font-bold text-white rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                        >
                          Start Level
                        </button>
                      </motion.div>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotion Game */}
      <AnimatePresence>
        {showEmotionGame && selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-3xl p-4 max-w-4xl w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <EmotionGame
                levelId={selectedLevel}
                onComplete={handleCompleteLevel}
                onExit={() => setShowEmotionGame(false)}
                emotions={emotions}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board Modal */}
      <AnimatePresence>
        {showGameBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-3xl p-4 max-w-md w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {renderGameBoard()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Splash Screen */}
      <AnimatePresence>
        {showSplash &&
          (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.2, 1],
                opacity: [0, 1, 1],
                rotate: [0, 10, -10, 5, -5, 0],
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl shadow-2xl flex flex-col items-center"
            >
              <Trophy size={80} className="text-primary-foreground mb-4" />
              <h2 className="text-4xl font-extrabold text-white mb-2">Level Complete!</h2>
              <div className="flex gap-2 my-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
                  >
                    <Star size={40} className="text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
                className="mt-4"
              >
                <Gift size={32} className="text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
          )}
      </AnimatePresence>
    </div>
  )
}
