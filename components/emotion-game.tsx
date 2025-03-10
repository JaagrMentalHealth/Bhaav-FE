"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, CheckCircle, XCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Emotion, GameState, QuizQuestion } from "@/types/game-types"
import confetti from "canvas-confetti"


// Import local data
import gameData from "@/data/data.json"

interface EmotionGameProps {
  levelId: number
  onComplete: (stars: number) => void
  onExit: () => void
  emotions: Emotion[]
}

export default function EmotionGame({ levelId, onComplete, onExit, emotions }: EmotionGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    stage: "preparation", // Changed initial stage to preparation
    currentQuestion: 0,
    selectedAnswer: null,
    correctAnswers: 0,
  })
  const [options, setOptions] = useState<string[]>([])
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoTime, setVideoTime] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<QuizQuestion | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // New state for preparation timer
  const [prepTime, setPrepTime] = useState(5)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load questions from local data instead of Appwrite
  const loadQuestions = (emotionName: string) => {
    try {
      // Find questions for the current emotion from the local data
      const questions = gameData.questions.filter((q) => q.emotion === emotionName)

      if (questions.length > 0) {
        const formattedQuestions = questions.map((doc) => ({
          id: doc.id,
          timestamp: doc.time,
          question: doc.question,
          options: doc.options,
          correctAnswer: doc.correctOption,
          image: doc.image || null, // Support optional image
        }))

        setQuizQuestions(formattedQuestions)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
    }
  }

  // Initialize the game with the current level's emotion
  useEffect(() => {
    // Select an emotion based on the level ID
    const emotionIndex = (levelId - 1) % emotions.length
    const selectedEmotion = emotions[emotionIndex]

    if (selectedEmotion) {
      setCurrentEmotion(selectedEmotion)
      setVideoUrl(selectedEmotion.video || "")

      // Load questions for this emotion from local data
      loadQuestions(selectedEmotion.name)
    }
  }, [levelId, emotions])

  // Handle preparation timer
  useEffect(() => {
    if (gameState.stage === "preparation" && prepTime > 0) {
      timerRef.current = setTimeout(() => {
        setPrepTime((prev) => prev - 1)
      }, 1000)
    } else if (gameState.stage === "preparation" && prepTime === 0) {
      // Move to video stage when timer completes
      setGameState((prev) => ({
        ...prev,
        stage: "video-quiz",
      }))
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameState.stage, prepTime])

  // Handle video timeupdate to check for quiz timestamps
  useEffect(() => {
    if (gameState.stage === "video-quiz" && videoRef.current) {
      const handleTimeUpdate = () => {
        if (!videoRef.current) return

        setVideoTime(videoRef.current.currentTime)

        // Check if we need to show a quiz at this timestamp
        const questionAtTimestamp = quizQuestions.find((q, index) => {
          // Check if we're within 0.5 seconds of the timestamp, haven't shown this question yet,
          // and this is the current question we should be showing
          return (
            Math.abs(q.timestamp - videoRef.current!.currentTime) < 0.5 &&
            index === gameState.currentQuestion &&
            !showQuiz
          )
        })

        if (questionAtTimestamp) {
          videoRef.current.pause()
          setVideoPlaying(false)
          setCurrentQuizQuestion(questionAtTimestamp)
          setShowQuiz(true)

          // Use the options from the data
          setOptions([...questionAtTimestamp.options])
        }
      }

      videoRef.current.addEventListener("timeupdate", handleTimeUpdate)

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        }
      }
    }
  }, [gameState.stage, gameState.currentQuestion, quizQuestions, showQuiz])

  // Handle quiz answer selection
  const handleQuizAnswer = (answer: string) => {
    if (!currentQuizQuestion) return

    setGameState((prev) => ({ ...prev, selectedAnswer: answer }))

    // Check if answer is correct
    if (answer === currentQuizQuestion.correctAnswer) {
      setQuizResult("correct")

      // Resume video after a short delay
      setTimeout(() => {
        setShowQuiz(false)
        setCurrentQuizQuestion(null)
        setQuizResult(null)
        setGameState((prev) => ({
          ...prev,
          selectedAnswer: null,
          correctAnswers: prev.correctAnswers + 1,
          currentQuestion: prev.currentQuestion + 1, // Increment the current question
        }))

        if (videoRef.current) {
          videoRef.current.play()
          setVideoPlaying(true)
        }
      }, 1500)
    } else {
      setQuizResult("incorrect")

      // Clear incorrect answer after a short delay
      setTimeout(() => {
        setQuizResult(null)
        setGameState((prev) => ({ ...prev, selectedAnswer: null }))
      }, 1500)
    }
  }

  // Handle video end
  const handleVideoEnd = () => {
    // Calculate stars based on correct answers
    const totalQuestions = quizQuestions.length
    const correctPercentage = totalQuestions > 0 ? (gameState.correctAnswers / totalQuestions) * 100 : 0

    let stars = 1
    if (correctPercentage >= 50) stars = 2
    if (correctPercentage >= 75) stars = 3

    // Show completion screen
    setGameState((prev) => ({ ...prev, stage: "complete" }))

    // Trigger confetti effect
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    })

    // Complete the level after a short delay
    setTimeout(() => {
      onComplete(stars)
    }, 3000)
  }

  // Render preparation screen with circular timer
  const renderPreparationScreen = () => {
    const circumference = 2 * Math.PI * 40 // Circle radius is 40
    const strokeDashoffset = circumference * (1 - prepTime / 5)

    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-6">Get Ready!</h2>

        <div className="relative w-32 h-32 mb-6">
          {/* Circular progress bar */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#4f46e5"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{prepTime}</span>
          </div>
        </div>

        <p className="text-lg">{currentEmotion ? `Learning about ${currentEmotion.name}` : "Preparing your lesson"}</p>
      </div>
    )
  }

  // Render video quiz stage
  const renderVideoQuiz = () => {
    if (!currentEmotion) return null

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-2xl aspect-video mb-4 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            
            autoPlay
          />
          {/* {!videoPlaying && !showQuiz && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play()
                    setVideoPlaying(true)
                  }
                }}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )} */}
        </div>

        <div className="w-full max-w-2xl mb-6">
          <Progress value={(videoTime / (videoRef.current?.duration || 1)) * 100} className="h-2" />
        </div>

        <AnimatePresence>
          {showQuiz && currentQuizQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-black/80 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
                          >
              <h3 className="text-xl font-bold mb-4">{currentQuizQuestion.question}</h3>

              {/* Conditionally render question image if it exists */}
              {currentQuizQuestion.image && (
                <div className="mb-4 relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={currentQuizQuestion.image || "/placeholder.svg"}
                    alt="Question image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant={gameState.selectedAnswer === option ? "default" : "outline"}
                    className={`p-4 h-auto text-left bg-indigo-600 text-white hover:bg-indigo-700 justify-start ${
                      quizResult === "correct" && option === currentQuizQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : quizResult === "incorrect" && gameState.selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                    }`}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={gameState.selectedAnswer !== null}
                  >
                    {option}
                    {quizResult === "correct" && option === currentQuizQuestion.correctAnswer && (
                      <CheckCircle className="ml-auto h-5 w-5" />
                    )}
                    {quizResult === "incorrect" && gameState.selectedAnswer === option && (
                      <XCircle className="ml-auto h-5 w-5" />
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Render completion screen
  const renderCompletionScreen = () => {
    // Calculate stars based on correct answers
    const totalQuestions = quizQuestions.length
    const correctPercentage = totalQuestions > 0 ? (gameState.correctAnswers / totalQuestions) * 100 : 0

    let stars = 1
    if (correctPercentage >= 50) stars = 2
    if (correctPercentage >= 75) stars = 3

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
            >
              <Star className={`h-10 w-10 ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
            </motion.div>
          ))}
        </div>
        <p className="text-xl mb-8">
          {currentEmotion ? `You've learned about ${currentEmotion.name}!` : "Level completed!"}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-indigo-800 w-full rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={onExit}>
          Exit Game
        </Button>
        <div className="text-lg font-semibold text-white">
          Level {levelId}: Harvest of Hope
        </div>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        {gameState.stage === "preparation" && renderPreparationScreen()}
        {gameState.stage === "video-quiz" && renderVideoQuiz()}
        {gameState.stage === "complete" && renderCompletionScreen()}
      </div>
    </div>
  )
}

