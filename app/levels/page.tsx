"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, CheckCircle, Star, Trophy, Gift } from "lucide-react"
import Image from "next/image"
import confetti from "canvas-confetti"

const levels = [
  {
    id: 1,
    name: "Emotion Basics",
    description: "Learn the basic emotions",
    image: "/levels/level1.svg",
    unlocked: true,
    completed: true,
    stars: 3,
    color: "from-pink-400 to-pink-600",
    shadowColor: "shadow-pink-500/30",
  },
  {
    id: 2,
    name: "Matching Game",
    description: "Match emotions with situations",
    image: "/levels/level2.svg",
    unlocked: true,
    completed: false,
    stars: 0,
    color: "from-purple-400 to-purple-600",
    shadowColor: "shadow-purple-500/30",
  },
  {
    id: 3,
    name: "Emotion Stories",
    description: "Create stories with emotions",
    image: "/levels/level3.svg",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-blue-400 to-blue-600",
    shadowColor: "shadow-blue-500/30",
  },
  {
    id: 4,
    name: "Emotion Detective",
    description: "Find hidden emotions in scenes",
    image: "/levels/level4.svg",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-green-400 to-green-600",
    shadowColor: "shadow-green-500/30",
  },
  {
    id: 5,
    name: "Emotion Charades",
    description: "Act out and guess emotions",
    image: "/levels/level5.svg",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-yellow-400 to-yellow-600",
    shadowColor: "shadow-yellow-500/30",
  },
  {
    id: 6,
    name: "Emotion Master",
    description: "Final challenge with all emotions",
    image: "/levels/level6.svg",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-red-400 to-red-600",
    shadowColor: "shadow-red-500/30",
  },
]

export default function Levels() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [userLevels, setUserLevels] = useState(levels)
  const [showSplash, setShowSplash] = useState(false)

  const handleLevelClick = (id: number) => {
    const level = userLevels.find((l) => l.id === id)
    if (level && level.unlocked) {
      setSelectedLevel(id)
    }
  }

  const handleCompleteLevel = () => {
    if (selectedLevel) {
      // Show splash screen
      setShowSplash(true)
      
      // Trigger confetti effect
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      })

      // Update level status
      setUserLevels((prev) =>
        prev.map((level) => {
          if (level.id === selectedLevel) {
            return { ...level, completed: true, stars: 3 }
          }
          if (level.id === selectedLevel + 1) {
            return { ...level, unlocked: true }
          }
          return level
        }),
      )

      // Close level modal and splash after a delay
      setTimeout(() => {
        setShowSplash(false)
        setSelectedLevel(null)
      }, 3000)
    }
  }

  const bounceVariant = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -6, 0, -3, 0],
      transition: { duration: 1.5, times: [0, 0.3, 0.5, 0.7, 0.9, 1], repeat: Infinity, repeatDelay: 1 }
    }
  }

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 1, ease: "easeInOut" }
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-fuchsia-100 via-blue-100 to-purple-100">
      {/* Decorative elements */}
      <div className="fixed -top-20 -left-20 w-40 h-40 rounded-full bg-yellow-300 opacity-30 blur-xl"></div>
      <div className="fixed top-1/3 -right-20 w-40 h-40 rounded-full bg-pink-300 opacity-30 blur-xl"></div>
      <div className="fixed -bottom-20 left-1/3 w-40 h-40 rounded-full bg-blue-300 opacity-30 blur-xl"></div>
      
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">
            Emotion Adventure
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-indigo-700">
            Complete exciting challenges and earn sweet rewards! Each level teaches you new emotional skills.
          </p>
        </motion.div>

        {/* Path connecting levels */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 300" fill="none" preserveAspectRatio="none">
            <motion.path 
              d="M100,150 C200,50 300,250 400,150 C500,50 600,250 700,150 C800,50 900,250 1000,150" 
              stroke="url(#gradient)" 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="15,15"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {userLevels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={level.unlocked ? { scale: 1.05, rotate: 1 } : {}}
              whileTap={level.unlocked ? { scale: 0.98 } : {}}
              className={`relative rounded-2xl overflow-hidden ${level.shadowColor} shadow-xl ${
                level.unlocked ? "cursor-pointer" : "opacity-80"
              }`}
              onClick={() => handleLevelClick(level.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-80`}></div>
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
              
              {/* Level content */}
              <div className="relative p-4">
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg">
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br ${level.color}">
                      {level.id}
                    </span>
                  </div>
                </div>
                
                <div className="relative h-40 mb-3 mt-6 flex items-center justify-center">
                  <motion.div
                    variants={bounceVariant}
                    initial="initial"
                    animate={level.unlocked ? "animate" : "initial"}
                  >
                    <Image 
                      src={level.image || "/placeholder.svg"} 
                      alt={level.name} 
                      width={120} 
                      height={120} 
                      className="object-contain drop-shadow-lg" 
                    />
                  </motion.div>
                  
                  {!level.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
                        <Lock size={36} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{level.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{level.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          size={22}
                          className={i < level.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    
                    {level.completed && (
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Level Modal */}
      {selectedLevel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLevel(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                {userLevels.find((l) => l.id === selectedLevel)?.name}
              </h2>
              <p className="mb-6 text-indigo-700">{userLevels.find((l) => l.id === selectedLevel)?.description}</p>
            </div>

            <div className="relative h-48 bg-gradient-to-b from-purple-200 to-pink-100 rounded-xl mb-6 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Image
                  src={userLevels.find((l) => l.id === selectedLevel)?.image || "/placeholder.svg"}
                  alt={userLevels.find((l) => l.id === selectedLevel)?.name || "Level"}
                  width={150}
                  height={150}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>
            </div>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={handleCompleteLevel}
                  className="px-8 py-3 text-lg font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30"
                >
                  Start Level
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Victory Splash Screen */}
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1],
              rotate: [0, 10, -10, 5, -5, 0]
            }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-br from-yellow-300 to-pink-500 p-8 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <Trophy size={80} className="text-yellow-100 mb-4" />
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
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              className="mt-4"
            >
              <Gift size={32} className="text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}