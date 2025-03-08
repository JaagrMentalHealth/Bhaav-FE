"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, CheckCircle, Star } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { databases } from "@/lib/appwriteConfig"

// Define the emotion type
interface Emotion {
  id: string
  name: string
  image: string
  description: string
}

// Define the level type
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
}

// Define the levels directly in the component
const initialLevels: Level[] = [
  {
    id: 1,
    name: "Emotion Basics",
    description: "Learn the basic emotions",
    image: "/levels/level1.svg",
    unlocked: true,
    completed: false,
    stars: 0,
    color: "from-pink-400 to-pink-600",
    shadowColor: "shadow-pink-500/30",
  },
  {
    id: 2,
    name: "Matching Game",
    description: "Match emotions with situations",
    image: "/levels/level2.svg",
    unlocked: false,
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
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [userLevels, setUserLevels] = useState<Level[]>(initialLevels)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    const fetchEmotions = async () => {
      try {
        // Try to fetch from Appwrite
        const response = await databases.listDocuments("67c98cc3002b3e3dc1a5", "67c98ce00023c7585f67")
        
        const emotionsData = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          image: doc.image || "/placeholder.svg", // Using database image URL
          description: doc.description,
        }))

        console.log("Fetched emotions:", emotionsData) // Debug log
        if (isMounted) {
          setEmotions(emotionsData)
        }
      } catch (error) {
        console.error("Error fetching emotions:", error)
      }
    }

    fetchEmotions()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLevelClick = (id: number) => {
    const level = userLevels.find((l) => l.id === id)
    if (level && level.unlocked) {
      // Navigate to the emotion game page with the level ID
      router.push(`/emotion-game/${id}`)
    }
  }

  const handleLevelComplete = (levelId: number) => {
    setUserLevels(prev => 
      prev.map(level => {
        if (level.id === levelId) {
          return { ...level, completed: true, stars: 3 };
        }
        if (level.id === levelId + 1) {
          return { ...level, unlocked: true };
        }
        return level;
      })
    );
  }

  const bounceVariant = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -6, 0, -3, 0],
      transition: {
        duration: 1.5,
        times: [0, 0.3, 0.5, 0.7, 0.9, 1],
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1,
      },
    },
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

        {/* Candy Crush style level path */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute inset-0 flex flex-col items-center">
            <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" preserveAspectRatio="none">
              {/* Zigzag path connecting levels */}
              <motion.path 
                d="M150,100 C200,100 250,200 300,200 C350,200 400,100 450,100 C500,100 550,200 600,200 C650,200 700,100 750,100 C800,100 850,200 900,200" 
                stroke="#8B5CF6" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="15,15"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-3 gap-8 py-12">
            {userLevels.map((level, index) => (
              <div key={level.id} className={`flex justify-center ${index % 2 === 0 ? 'mt-0' : 'mt-16'}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={level.unlocked ? { scale: 1.05, rotate: 1 } : {}}
                  whileTap={level.unlocked ? { scale: 0.98 } : {}}
                  className={`relative rounded-full w-24 h-24 md:w-32 md:h-32 ${level.shadowColor} shadow-xl ${
                    level.unlocked ? "cursor-pointer" : "opacity-80"
                  }`}
                  onClick={() => handleLevelClick(level.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-80 rounded-full`}></div>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full"></div>
                  
                  {/* Level number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white drop-shadow-md">{level.id}</span>
                  </div>
                  
                  {!level.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
                        <Lock size={36} className="text-white" />
                      </div>
                    </div>
                  )}
                  
                  {level.completed && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                      <CheckCircle size={24} />
                    </div>
                  )}
                  
                  {/* Stars */}
                  {level.completed && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < level.stars ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Level details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {userLevels.map((level, index) => (
            <motion.div
              key={`detail-${level.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${level.shadowColor} shadow-xl`}
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
    </div>
  )
}
