"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { databases } from "@/lib/appwriteConfig";
import type { Emotion } from "@/types/game-types";
import EmotionGame from "@/components/emotion-game";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Lock,
  Trophy,
  Gift,
  Heart,
  Clock,
  Target,
  Zap,
  Award,
  ChevronLeft,
  X,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";

// Import your existing types and data from the attachment
// Level objectives types
type ObjectiveType = "score" | "collect" | "clear" | "time";

interface Objective {
  type: ObjectiveType;
  target: number;
  current: number;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface PowerUp {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}

interface Level {
  id: number;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
  completed: boolean;
}

const powerUps: PowerUp[] = [
  {
    id: 1,
    name: "Color Bomb",
    description: "Clears all candies of one color",
    icon: <Zap size={20} className="text-white" />,
    color: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
    borderColor: "border-fuchsia-400/50",
  },
  {
    id: 2,
    name: "Striped Candy",
    description: "Clears an entire row or column",
    icon: <Target size={20} className="text-white" />,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    borderColor: "border-rose-400/50",
  },
  {
    id: 3,
    name: "Extra Moves",
    description: "+5 extra moves",
    icon: <Award size={20} className="text-white" />,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    borderColor: "border-blue-400/50",
  },
];

const levels = [
  {
    id: 1, // Added missing ID
    image:
      "https://cloud.appwrite.io/v1/storage/buckets/67c98ba30035b99f8621/files/67cd6d2b0014022526ef/view?project=67c98b5e0035bedcf913&mode=admin",
    unlocked: true,
    completed: false,
    stars: 3,
    color: "from-pink-400 to-pink-600",
    shadowColor: "shadow-glow-pink",
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
    powerUps: [powerUps[0]], // Ensure `powerUps` is defined elsewhere
    difficulty: 1,
    position: { x: 20, y: 20 },
  },
  {
    id: 2,

    image:
      "https://cloud.appwrite.io/v1/storage/buckets/67c98ba30035b99f8621/files/67d8636a00311b1aa8f4/view?project=67c98b5e0035bedcf913&mode=admin",
    unlocked: true,
    completed: false,
    stars: 0,
    color: "from-purple-400 to-purple-600",
    shadowColor: "shadow-glow-purple",
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
    image: "/placeholder.svg?height=150&width=150",
    unlocked: true,
    completed: false,
    stars: 0,
    color: "from-blue-400 to-blue-600",
    shadowColor: "shadow-glow-blue",
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
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-green-400 to-green-600",
    shadowColor: "shadow-glow-green",
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
    image: "/placeholder.svg?height=150&width=150",
    unlocked: false,
    completed: false,
    stars: 0,
    color: "from-yellow-400 to-yellow-600",
    shadowColor: "shadow-glow-yellow",
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
    shadowColor: "shadow-glow-red",
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
];

// Path points for the winding path
const pathPoints = [
  { x: 20, y: 20 },
  { x: 35, y: 35 },
  { x: 50, y: 20 },
  { x: 65, y: 35 },
  { x: 80, y: 20 },
  { x: 95, y: 35 },
];

export default function Levels() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [userLevels, setUserLevels] = useState(levels);
  const [showSplash, setShowSplash] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [currentMoves, setCurrentMoves] = useState(0);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showEmotionGame, setShowEmotionGame] = useState(false);
  const scrollRef = useRef(null);

  // Fetch emotions from Appwrite
  useEffect(() => {
    let isMounted = true;
    const fetchEmotions = async () => {
      setIsLoading(true);
      try {
        const response = await databases.listDocuments(
          "67c98cc3002b3e3dc1a5",
          "67c98ce00023c7585f67"
        );

        const emotionsData = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          image:
            doc.image.split(",") || "/placeholder.svg?height=300&width=300", // Using database image URL
          description: doc.description,
          video: doc.video,
        }));

        console.log("Fetched emotions:", emotionsData); // Debug log
        if (isMounted) {
          setEmotions(emotionsData);
        }
      } catch (error) {
        console.error("Error fetching emotions:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEmotions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    // Calculate overall game progress
    const completedLevels = userLevels.filter(
      (level) => level.completed
    ).length;
    const totalLevels = userLevels.length;
    setGameProgress(Math.round((completedLevels / totalLevels) * 100));
  }, [userLevels]);

  const handleLevelClick = (id: number) => {
    const level = userLevels.find((l) => l.id === id);
    if (level && level.unlocked) {
      setSelectedLevel(id);
      setShowLevelModal(true);
    }
  };

  const handleStartLevel = () => {
    if (selectedLevel) {
      setShowLevelModal(false);
      setShowEmotionGame(true);
    }
  };

  const handleCompleteLevel = (stars: number) => {
    if (selectedLevel) {
      // Hide game board
      setShowEmotionGame(false);

      // Show splash screen
      setShowSplash(true);

      // Trigger confetti effect
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [
          "#8b5cf6",
          "#ec4899",
          "#3b82f6",
          "#eab308",
          "#ef4444",
          "#06b6d4",
        ],
      });

      // Update level status
      setUserLevels((prev) =>
        prev.map((level) => {
          if (level.id === selectedLevel) {
            return { ...level, completed: true, stars };
          }
          if (level.id === selectedLevel + 1) {
            return { ...level, unlocked: true };
          }
          return level;
        })
      );

      // Save progress to localStorage
      localStorage.setItem(
        "emotionGameLevels",
        JSON.stringify(
          userLevels.map((level) => {
            if (level.id === selectedLevel) {
              return { ...level, completed: true, stars };
            }
            if (level.id === selectedLevel + 1) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        )
      );

      // Close level modal and splash after a delay
      setTimeout(() => {
        setShowSplash(false);
        setSelectedLevel(null);
      }, 3000);
    }
  };

  const handleMakeMove = () => {
    if (currentMoves > 0) {
      // Decrease moves
      setCurrentMoves((prev) => prev - 1);

      // Update objectives (simulating progress)
      setObjectives((prev) =>
        prev.map((obj) => ({
          ...obj,
          current: Math.min(
            obj.current + Math.floor(Math.random() * 3) + 1,
            obj.target
          ),
        }))
      );
    }

    // Check if all objectives are complete
    const allComplete = objectives.every((obj) => obj.current >= obj.target);
    if (allComplete || currentMoves === 1) {
      handleCompleteLevel(3);
    }
  };

  const renderGamePiece = (type: string, size = 40) => {
    const colors = [
      "bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-300/50",
      "bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-300/50",
      "bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-300/50",
      "bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300/50",
      "bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-pink-300/50",
      "bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-300/50",
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const shadowColors = [
      "shadow-glow-small",
      "shadow-glow-red",
      "shadow-glow-purple",
      "shadow-glow-blue",
      "shadow-glow-yellow",
      "shadow-glow-pink",
      "shadow-glow-green",
    ];
    const randomShadow =
      shadowColors[Math.floor(Math.random() * shadowColors.length)];

    return (
      <div
        className={`${randomColor} rounded-full flex items-center justify-center ${randomShadow}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {type === "special" && (
          <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
        )}
        {type === "special" && <Sparkles size={16} className="text-white" />}
      </div>
    );
  };

  const renderGameBoard = () => {
    if (!selectedLevel) return null;

    const level = userLevels.find((l) => l.id === selectedLevel);
    if (!level) return null;

    const { rows, cols } = level.gridSize;

    return (
      <div className="bg-gradient-to-b from-indigo-800/30 to-fuchsia-800/30 p-4 rounded-xl border-2 border-indigo-700/30">
        {/* Game header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-900/80 px-3 py-1.5 rounded-lg border-2 border-indigo-700/50 shadow-glow-small flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            </div>

            <div className="bg-indigo-900/80 px-3 py-1.5 rounded-lg border-2 border-indigo-700/50 shadow-glow-small flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-300" />
              <span className="text-sm font-bold text-white">
                Moves: {currentMoves}
              </span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {objectives.map((objective, idx) => {
            const progress = Math.min(objective.current / objective.target, 1);
            return (
              <div
                key={idx}
                className="bg-indigo-900/80 rounded-lg p-2 flex-shrink-0 shadow-glow-small border-2 border-indigo-700/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`${objective.color} w-6 h-6 rounded-full flex items-center justify-center`}
                  >
                    {objective.icon}
                  </div>
                  <div className="text-xs font-medium text-white">
                    {objective.label}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-xs font-bold text-indigo-200">
                    {objective.current}/{objective.target}
                  </div>
                  <div className="w-16 h-2 bg-indigo-950 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game grid */}
        <div
          className="grid gap-1 bg-indigo-900/80 p-2 rounded-lg border-2 border-indigo-700/30 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const isSpecial = Math.random() > 0.85;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center cursor-pointer"
                onClick={handleMakeMove}
              >
                {renderGamePiece(isSpecial ? "special" : "regular", 36)}
              </motion.div>
            );
          })}
        </div>

        {/* Game controls */}
        <div className="mt-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border-2 border-indigo-600/50 font-bold rounded-xl bg-indigo-900/50 text-white"
            onClick={() => setShowGameBoard(false)}
          >
            Exit Level
          </motion.button>
        </div>
      </div>
    );
  };

  // Generate SVG path for the winding road
  const generatePath = () => {
    if (pathPoints.length < 2) return "";

    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const current = pathPoints[i];

      // For a curved path
      if (i % 2 === 1) {
        // Path curves down
        path += ` Q ${(prev.x + current.x) / 2} ${prev.y + 15} ${current.x} ${
          current.y
        }`;
      } else {
        // Path curves up
        path += ` Q ${(prev.x + current.x) / 2} ${prev.y - 15} ${current.x} ${
          current.y
        }`;
      }
    }

    return path;
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-white overflow-hidden">
      {/* Header with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-800 to-indigo-950 pt-16 pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="face-museum"
              className="flex items-center text-indigo-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Hall of faces</span>
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
                <div className="absolute inset-0 bg-fuchsia-500/20 blur-md rounded-full"></div>
                <div className="relative bg-indigo-800/50 px-6 py-2 rounded-xl border-2 border-fuchsia-400/50 shadow-glow-purple">
                  <span className="text-fuchsia-300 font-bold">
                    Fun Challenges
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-24">
        {/* Candy Crush style map with bubbles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12 relative"
        >
          {/* Fixed Background Container */}
          <div className="relative w-full h-[450px] bg-indigo-900/60 rounded-3xl overflow-hidden border-2 border-indigo-700/50 shadow-glow-indigo">
            {/* Fixed Background Decorations */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-800/20 to-fuchsia-800/20"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-md"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-pink-400/20 rounded-full blur-md"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-blue-400/20 rounded-full blur-md"></div>

            {/* Clouds (Fixed) */}
            <div className="absolute top-5 left-1/4 flex space-x-1">
              <div className="w-10 h-6 bg-indigo-200/20 rounded-full"></div>
              <div className="w-14 h-8 bg-indigo-200/20 rounded-full"></div>
              <div className="w-10 h-6 bg-indigo-200/20 rounded-full"></div>
            </div>

            <div className="absolute bottom-10 right-1/4 flex space-x-1">
              <div className="w-8 h-5 bg-indigo-200/20 rounded-full"></div>
              <div className="w-12 h-7 bg-indigo-200/20 rounded-full"></div>
              <div className="w-8 h-5 bg-indigo-200/20 rounded-full"></div>
            </div>

            {/* Trees (Fixed) */}
            <div className="absolute top-1/4 left-10">
              <div className="w-12 h-12 bg-fuchsia-500/30 rounded-full"></div>
              <div className="w-3 h-6 bg-fuchsia-700/30 mx-auto -mt-1"></div>
            </div>

            <div className="absolute bottom-1/4 right-10">
              <div className="w-10 h-10 bg-fuchsia-500/30 rounded-full"></div>
              <div className="w-2 h-5 bg-fuchsia-700/30 mx-auto -mt-1"></div>
            </div>

            {/* Scrollable Level Bubbles */}
            <div
              ref={scrollRef}
              className="absolute inset-0 flex items-center space-x-10 px-10 overflow-x-scroll"
              style={{ scrollSnapType: "x mandatory", whiteSpace: "nowrap" }}
            >
              {userLevels.map((level, index) => {
                const isCompleted = level.completed;
                const isLocked = !level.unlocked;

                return (
                  <motion.div
                    key={level.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="relative"
                  >
                    <motion.div
                      whileHover={level.unlocked ? { scale: 1.1 } : {}}
                      whileTap={level.unlocked ? { scale: 0.95 } : {}}
                      onClick={() => handleLevelClick(level.id)}
                      className={`relative flex items-center justify-center cursor-pointer ${
                        isLocked ? "opacity-80" : ""
                      }`}
                    >
                      {/* Outer glow for active level */}
                      {level.unlocked && !level.completed && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-fuchsia-500/30 shadow-glow-purple"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          style={{ zIndex: -1 }}
                        />
                      )}

                      {/* Level Bubble */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                          isLocked
                            ? "bg-indigo-900/80 border-indigo-700/50"
                            : isCompleted
                            ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300/50 shadow-glow-green"
                            : "bg-gradient-to-br from-fuchsia-500 to-purple-600 border-fuchsia-400/50 shadow-glow-purple"
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={24} className="text-muted-foreground" />
                        ) : (
                          <span className="text-xl font-bold text-white">
                            {level.id}
                          </span>
                        )}
                      </div>

                      {/* Stars Indicator */}
                      {level.completed && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} size={12} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Completion Island */}
              <motion.div
                className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <span className="text-xl font-bold text-white">🏝️</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Level guide */}
        <div className="max-w-4xl mx-auto pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-900/60 rounded-2xl p-6 border-2 border-indigo-700/50 shadow-glow-small">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-fuchsia-400/30">
                  1
                </div>
                <h3 className="font-semibold text-lg text-white">
                  Select a Level
                </h3>
              </div>
              <p className="text-indigo-200">
                Choose an unlocked level from the adventure map to begin your
                emotional journey.
              </p>
            </div>

            <div className="bg-indigo-900/60 rounded-2xl p-6 border-2 border-indigo-700/50 shadow-glow-small">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-fuchsia-400/30">
                  2
                </div>
                <h3 className="font-semibold text-lg text-white">
                  Complete Objectives
                </h3>
              </div>
              <p className="text-indigo-200">
                Match emotions and complete the level objectives before you run
                out of moves.
              </p>
            </div>

            <div className="bg-indigo-900/60 rounded-2xl p-6 border-2 border-indigo-700/50 shadow-glow-small">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-fuchsia-400/30">
                  3
                </div>
                <h3 className="font-semibold text-lg text-white">
                  Earn Rewards
                </h3>
              </div>
              <p className="text-indigo-200">
                Earn stars, XP, and unlock new levels as you progress through
                your emotional learning adventure.
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
              className="bg-indigo-900/90 sm:max-h-[70vh] md:max-h-[95vh]  overflow-y-auto scrollbar-hide rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-indigo-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const level = userLevels.find((l) => l.id === selectedLevel);
                if (!level) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setSelectedLevel(null)}
                        className="p-2 rounded-full hover:bg-indigo-800/50 transition-colors"
                      >
                        <ChevronLeft size={24} className="text-indigo-300" />
                      </button>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
                        Level {level.id}
                      </h2>
                      <button
                        onClick={() => setShowLevelModal(false)}
                        className="p-2 rounded-full hover:bg-indigo-800/50 transition-colors"
                      >
                        <X size={20} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-foreground">
                        {level.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {level.description}
                      </p>
                    </div>

                    <div className="relative h-40 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-xl mb-6 flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.05, 1, 1.05, 1],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Image
                          src={
                            level.image ||
                            "/placeholder.svg?height=150&width=150"
                          }
                          alt={level.name || "Image Not Available"}
                          width={120}
                          height={120}
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
                          onClick={handleStartLevel}
                          className="relative bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 px-8 py-6 text-lg font-bold text-white rounded-xl border-2 border-fuchsia-400/30"
                        >
                          Start Level
                        </button>
                      </motion.div>
                    </div>
                  </>
                );
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
            className="fixed inset-0  bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-3xl max-h-[80vh]  overflow-y-auto scrollbar-hide p-4 max-w-4xl w-full shadow-2xl border border-border"
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
            className="fixed inset-0 h-[80vh] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-indigo-900/90 overflow-y-auto scrollbar-hide rounded-3xl p-4 max-w-md w-full shadow-2xl border-2 border-indigo-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {renderGameBoard()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Splash Screen */}
      <AnimatePresence>
        {showSplash && (
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
              className="bg-gradient-to-br from-fuchsia-600 to-purple-600 p-8 rounded-3xl shadow-2xl flex flex-col items-center border-2 border-fuchsia-400/30 shadow-glow-purple overflow-y-auto scrollbar-hide"
            >
              <Trophy size={80} className="text-primary-foreground mb-4" />
              <h2 className="text-4xl font-extrabold text-white mb-2">
                Level Complete!
              </h2>
              <div className="flex gap-2 my-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
                  >
                    <Star
                      size={40}
                      className="text-yellow-300 fill-yellow-300"
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.5,
                }}
                className="mt-4"
              >
                <Gift size={32} className="text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
