"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Trophy, Lock, Sparkles, ArrowLeft } from "lucide-react"
import confetti from "canvas-confetti"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const badges = [
  {
    id: 1,
    name: "Emotion Explorer",
    description: "Visited the Face Museum",
    image: "/badges/explorer.svg",
    unlocked: true,
    date: "October 22, 2023",
  },
  {
    id: 2,
    name: "Story Maker",
    description: "Completed your first story",
    image: "/badges/story.svg",
    unlocked: true,
    date: "November 10, 2023",
  },
  {
    id: 3,
    name: "Level Master",
    description: "Completed Level 1 with 3 stars",
    image: "/badges/level.svg",
    unlocked: true,
    date: "November 25, 2023",
  },
  {
    id: 4,
    name: "Emotion Detective",
    description: "Found all hidden emotions",
    image: "/badges/detective.svg",
    unlocked: false,
  },
  {
    id: 5,
    name: "Friend Maker",
    description: "Helped a character make friends",
    image: "/badges/friend.svg",
    unlocked: false,
  },
  {
    id: 6,
    name: "Emotion Master",
    description: "Learned all basic emotions",
    image: "/badges/master.svg",
    unlocked: false,
  },
  {
    id: 7,
    name: "Problem Solver",
    description: "Resolved an emotional conflict",
    image: "/badges/solver.svg",
    unlocked: false,
  },
  {
    id: 8,
    name: "Empathy Star",
    description: "Showed understanding of others' feelings",
    image: "/badges/empathy.svg",
    unlocked: false,
  },
  {
    id: 9,
    name: "Emotion Champion",
    description: "Completed all levels and stories",
    image: "/badges/champion.svg",
    unlocked: false,
  },
]

export default function Badges() {
  const [userBadges, setUserBadges] = useState(badges)
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null)
  const [showNewBadge, setShowNewBadge] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const unlockRandomBadge = () => {
    const lockedBadges = userBadges.filter((badge) => !badge.unlocked)
    if (lockedBadges.length > 0) {
      const randomBadge = lockedBadges[Math.floor(Math.random() * lockedBadges.length)]
      setUserBadges((prev) =>
        prev.map((badge) =>
          badge.id === randomBadge.id
            ? {
                ...badge,
                unlocked: true,
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
              }
            : badge,
        ),
      )
      setSelectedBadge(randomBadge.id)
      setShowNewBadge(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#EC4899", "#3B82F6"],
      })
    }
  }

  const progressPercentage = Math.round((userBadges.filter((b) => b.unlocked).length / userBadges.length) * 100)

  return (
    <div className="flex flex-col min-h-screen bg-indigo-950 text-white overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 -z-10">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Planets */}
        <motion.div
          className="absolute top-1/4 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-40 blur-md"
          animate={{
            y: [0, -10, 0],
            rotate: 360,
          }}
          transition={{
            y: {
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            rotate: {
              duration: 200,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />

        <motion.div
          className="absolute bottom-1/4 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-pink-800 opacity-30 blur-md"
          animate={{
            y: [0, 15, 0],
            rotate: 360,
          }}
          transition={{
            y: {
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            rotate: {
              duration: 240,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 z-10">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="ml-2">Back to Home</span>
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-800/50 rounded-xl border-2 border-indigo-600/50 shadow-glow-purple">
            <span className="text-fuchsia-300 font-bold flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Your Achievements
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
            Cosmic Trophy Room
          </h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Collect awesome badges as you learn and grow on your emotional learning journey through the stars!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-indigo-200">Your Progress</span>
            <span className="text-sm font-medium text-indigo-200">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-indigo-900/50 rounded-full h-4 overflow-hidden border border-indigo-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-500 h-full rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Button
            onClick={unlockRandomBadge}
            className="bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-2 px-6 rounded-full transition transform hover:scale-105 shadow-md border-2 border-indigo-400/30"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Earn a New Badge
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {userBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              whileHover={badge.unlocked ? { scale: 1.05, y: -5 } : {}}
              className={`relative ${badge.unlocked ? "cursor-pointer" : "opacity-70"}`}
              onClick={() => badge.unlocked && setSelectedBadge(badge.id)}
            >
              <div
                className={`bg-indigo-900/80 rounded-xl p-4 border-2 ${badge.unlocked ? "border-indigo-500/50" : "border-indigo-800/50"} flex flex-col items-center ${badge.unlocked ? "shadow-glow-purple" : ""}`}
              >
                <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
                  <div
                    className={`w-full h-full rounded-full ${badge.unlocked ? "bg-gradient-to-br from-indigo-600 to-purple-700" : "bg-indigo-800"} p-2`}
                  >
                    <div
                      className={`w-full h-full rounded-full ${badge.unlocked ? "bg-gradient-to-br from-fuchsia-400 to-purple-500" : "bg-indigo-700"} flex items-center justify-center border-2 ${badge.unlocked ? "border-indigo-300/50" : "border-indigo-600/50"}`}
                    >
                      {badge.unlocked ? (
                        <Image
                          src={badge.image || "/placeholder.svg"}
                          alt={badge.name}
                          width={80}
                          height={80}
                          className="object-contain p-2"
                        />
                      ) : (
                        <Lock size={24} className="text-indigo-400" />
                      )}
                    </div>
                  </div>

                  {/* Badge number/level indicator */}
                  {badge.unlocked && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center text-xs font-bold border-2 border-yellow-300 shadow-glow-yellow"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {badge.id}
                    </motion.div>
                  )}
                </div>
                <h3 className="text-center font-semibold text-sm text-indigo-100 mb-1">{badge.name}</h3>
                {badge.unlocked && badge.date && <p className="text-xs text-indigo-300 mt-1">{badge.date}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-indigo-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedBadge(null)
              setShowNewBadge(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-indigo-900 rounded-2xl p-6 max-w-sm w-full border-2 border-indigo-500/50 shadow-glow-purple"
              onClick={(e) => e.stopPropagation()}
            >
              {showNewBadge && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-4"
                >
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-900 text-sm font-bold px-4 py-1 rounded-full inline-flex items-center">
                    <Sparkles className="mr-1 h-4 w-4" />
                    New Badge Unlocked!
                  </span>
                </motion.div>
              )}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative w-32 h-32 mb-6"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    rotate: { duration: 5, repeat: Number.POSITIVE_INFINITY },
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 p-3 shadow-glow-purple">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center border-2 border-indigo-300/50">
                      <Image
                        src={userBadges.find((b) => b.id === selectedBadge)?.image || ""}
                        alt={userBadges.find((b) => b.id === selectedBadge)?.name || "Badge"}
                        width={100}
                        height={100}
                        className="object-contain p-4"
                      />
                    </div>
                  </div>

                  {/* Badge number indicator */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center text-sm font-bold border-2 border-yellow-300 shadow-glow-yellow"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {selectedBadge}
                  </motion.div>
                </motion.div>

                <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
                  {userBadges.find((b) => b.id === selectedBadge)?.name}
                </h2>
                <p className="text-center mb-6 text-indigo-200">
                  {userBadges.find((b) => b.id === selectedBadge)?.description}
                </p>

                {userBadges.find((b) => b.id === selectedBadge)?.date && (
                  <p className="text-sm text-indigo-300 mb-6">
                    Earned on: {userBadges.find((b) => b.id === selectedBadge)?.date}
                  </p>
                )}

                <Button
                  onClick={() => {
                    setSelectedBadge(null)
                    setShowNewBadge(false)
                  }}
                  className="bg-indigo-800 hover:bg-indigo-700 text-indigo-200 hover:text-white border border-indigo-600 rounded-full px-6"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

