"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Trophy, Lock, Star } from "lucide-react"
import confetti from "canvas-confetti"

const badges = [
  { id: 1, name: "Emotion Explorer", description: "Visited the Face Museum", image: "/badges/explorer.svg", unlocked: true },
  { id: 2, name: "Story Maker", description: "Completed your first story", image: "/badges/story.svg", unlocked: true },
  { id: 3, name: "Level Master", description: "Completed Level 1 with 3 stars", image: "/badges/level.svg", unlocked: true },
  { id: 4, name: "Emotion Detective", description: "Found all hidden emotions", image: "/badges/detective.svg", unlocked: false },
  { id: 5, name: "Friend Maker", description: "Helped a character make friends", image: "/badges/friend.svg", unlocked: false },
  { id: 6, name: "Emotion Master", description: "Learned all basic emotions", image: "/badges/master.svg", unlocked: false },
  { id: 7, name: "Problem Solver", description: "Resolved an emotional conflict", image: "/badges/solver.svg", unlocked: false },
  { id: 8, name: "Empathy Star", description: "Showed understanding of others' feelings", image: "/badges/empathy.svg", unlocked: false },
  { id: 9, name: "Emotion Champion", description: "Completed all levels and stories", image: "/badges/champion.svg", unlocked: false },
]

export default function Badges() {
  const [userBadges, setUserBadges] = useState(badges)
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null)
  const [showNewBadge, setShowNewBadge] = useState(false)

  const unlockRandomBadge = () => {
    const lockedBadges = userBadges.filter((badge) => !badge.unlocked)
    if (lockedBadges.length > 0) {
      const randomBadge = lockedBadges[Math.floor(Math.random() * lockedBadges.length)]
      setUserBadges((prev) => prev.map((badge) => (badge.id === randomBadge.id ? { ...badge, unlocked: true } : badge)))
      setSelectedBadge(randomBadge.id)
      setShowNewBadge(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
  }

  const progressPercentage = Math.round((userBadges.filter((b) => b.unlocked).length / userBadges.length) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Trophy Room</h1>
        <p className="text-lg text-gray-700">Collect awesome badges as you learn and grow on your emotional learning journey.</p>
      </motion.div>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Your Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full" />
        </div>
      </div>

      <div className="text-center mb-8">
        <button onClick={unlockRandomBadge} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition transform hover:scale-105 shadow-md">
          Earn a New Badge
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {userBadges.map((badge) => (
          <motion.div key={badge.id} whileHover={badge.unlocked ? { scale: 1.05 } : {}} className={`relative bg-white rounded-xl shadow-lg p-4 ${badge.unlocked ? "cursor-pointer" : "opacity-70"}`}
            onClick={() => badge.unlocked && setSelectedBadge(badge.id)}>
            <div className="relative w-full aspect-square mb-3">
              <Image src={badge.image} alt={badge.name} fill className={`object-contain ${!badge.unlocked ? "grayscale" : ""}`} />
              {!badge.unlocked && <Lock size={24} className="absolute inset-0 m-auto text-gray-400" />}
            </div>
            <h3 className="text-center font-semibold text-sm">{badge.name}</h3>
          </motion.div>
        ))}
      </div>

      {selectedBadge && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => { setSelectedBadge(null); setShowNewBadge(false); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full">
            {showNewBadge && <div className="text-center mb-4"><span className="bg-yellow-400 text-white text-sm font-bold px-3 py-1 rounded-full">New Badge Unlocked!</span></div>}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image src={userBadges.find((b) => b.id === selectedBadge)?.image || ""} alt={userBadges.find((b) => b.id === selectedBadge)?.name || "Badge"} fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">{userBadges.find((b) => b.id === selectedBadge)?.name}</h2>
              <p className="text-center mb-4">{userBadges.find((b) => b.id === selectedBadge)?.description}</p>
              <button onClick={() => { setSelectedBadge(null); setShowNewBadge(false); }} className="text-blue-500 hover:underline">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
