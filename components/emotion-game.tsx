"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, CheckCircle, XCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Emotion, GameState, QuizQuestion } from "@/types/game-types";
import confetti from "canvas-confetti";

interface EmotionGameProps {
  levelId: number;
  onComplete: (stars: number) => void;
  onExit: () => void;
  emotions: Emotion[];
}

export default function EmotionGame({
  levelId,
  onComplete,
  onExit,
  emotions,
}: EmotionGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    stage: "emotion-recognition",
    currentQuestion: 0,
    selectedAnswer: null,
    correctAnswers: 0,
  });
  const [options, setOptions] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] =
    useState<QuizQuestion | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Initialize the game with the current level's emotion
  useEffect(() => {
    // For demo purposes, we'll select an emotion based on the level ID
    // In a real app, you'd map this to your level data
    const emotionIndex = (levelId - 1) % emotions.length;
    const selectedEmotion = emotions[emotionIndex];

    if (selectedEmotion) {
      setCurrentEmotion(selectedEmotion);

      // Generate emotion options (1 correct + 3 random)
      const otherEmotions = emotions
        .filter((e) => e.id !== selectedEmotion.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((e) => e.name);

      const allOptions = [selectedEmotion.name, ...otherEmotions].sort(
        () => Math.random() - 0.5
      );
      setOptions(allOptions);

      // Generate quiz questions for this emotion
      const quizQuestionsForEmotion = [
        {
          id: "q1",
          timestamp: 5,
          question: `What physical signs might someone show when feeling ${selectedEmotion.name.toLowerCase()}?`,
          options: getOptionsForEmotion(selectedEmotion.name, 0),
          correctAnswer: getCorrectAnswerForEmotion(selectedEmotion.name, 0),
        },
        {
          id: "q2",
          timestamp: 15,
          question: `How can recognizing ${selectedEmotion.name.toLowerCase()} help in social situations?`,
          options: getOptionsForEmotion(selectedEmotion.name, 1),
          correctAnswer: getCorrectAnswerForEmotion(selectedEmotion.name, 1),
        },
      ];

      setQuizQuestions(quizQuestionsForEmotion);
    }
  }, [levelId, emotions]);

  // Helper function to get question options based on emotion
  const getOptionsForEmotion = (
    emotion: string,
    questionIndex: number
  ): string[] => {
    const optionsMap: Record<string, string[][]> = {
      Happiness: [
        ["Smiling", "Frowning", "Crying", "Shaking"],
        [
          "Building stronger relationships",
          "Avoiding others",
          "Staying quiet",
          "Hiding your feelings",
        ],
      ],
      Sadness: [
        ["Tears", "Jumping", "Laughing loudly", "Rapid movements"],
        [
          "Processing loss",
          "Ignoring problems",
          "Avoiding difficult situations",
          "Pretending everything is fine",
        ],
      ],
      Anger: [
        ["Clenched fists", "Relaxed posture", "Slow breathing", "Smiling"],
        [
          "Communicating boundaries",
          "Lashing out",
          "Holding grudges",
          "Avoiding the person",
        ],
      ],
      Fear: [
        ["Wide eyes", "Relaxed muscles", "Slow heart rate", "Casual posture"],
        [
          "Identifying real threats",
          "Ignoring warning signs",
          "Taking unnecessary risks",
          "Avoiding all new experiences",
        ],
      ],
      Surprise: [
        ["Raised eyebrows", "Slouching", "Yawning", "Slow movements"],
        [
          "Being adaptable",
          "Resisting change",
          "Ignoring new information",
          "Sticking to routine",
        ],
      ],
    };

    // Default options if the emotion isn't in our map
    const defaultOptions = [
      [
        "Physical sign 1",
        "Physical sign 2",
        "Physical sign 3",
        "Physical sign 4",
      ],
      ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
    ];

    return optionsMap[emotion]
      ? optionsMap[emotion][questionIndex]
      : defaultOptions[questionIndex];
  };

  // Helper function to get correct answers based on emotion
  const getCorrectAnswerForEmotion = (
    emotion: string,
    questionIndex: number
  ): string => {
    const answersMap: Record<string, string[]> = {
      Happiness: ["Smiling", "Building stronger relationships"],
      Sadness: ["Tears", "Processing loss"],
      Anger: ["Clenched fists", "Communicating boundaries"],
      Fear: ["Wide eyes", "Identifying real threats"],
      Surprise: ["Raised eyebrows", "Being adaptable"],
    };

    // Default answer if the emotion isn't in our map
    const defaultAnswers = ["Physical sign 1", "Benefit 1"];

    return answersMap[emotion]
      ? answersMap[emotion][questionIndex]
      : defaultAnswers[questionIndex];
  };

  // Handle video timeupdate to check for quiz timestamps
  useEffect(() => {
    if (gameState.stage === "video-quiz" && videoRef.current) {
      const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        setVideoTime(videoRef.current.currentTime);

        // Check if we need to show a quiz at this timestamp
        const questionAtTimestamp = quizQuestions.find((q, index) => {
          // Check if we're within 0.5 seconds of the timestamp, haven't shown this question yet,
          // and this is the current question we should be showing
          return (
            Math.abs(q.timestamp - videoRef.current!.currentTime) < 0.5 &&
            index === gameState.currentQuestion &&
            !showQuiz
          );
        });

        if (questionAtTimestamp) {
          videoRef.current.pause();
          setVideoPlaying(false);
          setCurrentQuizQuestion(questionAtTimestamp);
          setShowQuiz(true);

          // Generate options (including the correct answer)
          setOptions(
            [...questionAtTimestamp.options].sort(() => Math.random() - 0.5)
          );
        }
      };

      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [gameState.stage, gameState.currentQuestion, quizQuestions, showQuiz]);

  // Handle emotion selection in the first stage
  const handleEmotionSelect = (emotion: string) => {
    setGameState((prev) => ({ ...prev, selectedAnswer: emotion }));

    if (!currentEmotion) return;

    // Check if the selected emotion is correct
    if (emotion === currentEmotion.name) {
      setQuizResult("correct");

      // Move to video stage after a short delay
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          stage: "video-quiz",
          selectedAnswer: null,
          correctAnswers: prev.correctAnswers + 1,
        }));
        setQuizResult(null);
      }, 1500);
    } else {
      setQuizResult("incorrect");

      // Clear incorrect answer after a short delay
      setTimeout(() => {
        setQuizResult(null);
        setGameState((prev) => ({ ...prev, selectedAnswer: null }));
      }, 1500);
    }
  };

  // Handle quiz answer selection
  const handleQuizAnswer = (answer: string) => {
    if (!currentQuizQuestion) return;

    setGameState((prev) => ({ ...prev, selectedAnswer: answer }));

    // Check if answer is correct
    if (answer === currentQuizQuestion.correctAnswer) {
      setQuizResult("correct");

      // Resume video after a short delay
      setTimeout(() => {
        setShowQuiz(false);
        setCurrentQuizQuestion(null);
        setQuizResult(null);
        setGameState((prev) => ({
          ...prev,
          selectedAnswer: null,
          correctAnswers: prev.correctAnswers + 1,
          currentQuestion: prev.currentQuestion + 1, // Increment the current question
        }));

        if (videoRef.current) {
          videoRef.current.play();
          setVideoPlaying(true);
        }
      }, 1500);
    } else {
      setQuizResult("incorrect");

      // Clear incorrect answer after a short delay
      setTimeout(() => {
        setQuizResult(null);
        setGameState((prev) => ({ ...prev, selectedAnswer: null }));
      }, 1500);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    // Calculate stars based on correct answers
    const totalQuestions = quizQuestions.length + 1; // +1 for the emotion recognition
    const correctPercentage = (gameState.correctAnswers / totalQuestions) * 100;

    let stars = 1;
    if (correctPercentage >= 50) stars = 2;
    if (correctPercentage >= 75) stars = 3;

    // Show completion screen
    setGameState((prev) => ({ ...prev, stage: "complete" }));

    // Trigger confetti effect
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ],
    });

    // Complete the level after a short delay
    setTimeout(() => {
      onComplete(stars);
    }, 3000);
  };

  // Render current emotion for recognition stage
  const renderEmotionRecognition = () => {
    if (!currentEmotion) return null;

    return (
      <div className="flex flex-col items-center overflow-y-scroll">
        <div className="relative w-64 h-64 mb-6">
          <Image
            src={
              currentEmotion.image || "/placeholder.svg?height=300&width=300"
            }
            alt="Emotion"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <h2 className="text-xl font-bold mb-6">
          What emotion is shown in this image?
        </h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={
                gameState.selectedAnswer === option ? "default" : "outline"
              }
              className={`p-4 h-auto text-lg ${
                quizResult === "correct" && option === currentEmotion.name
                  ? "bg-green-500 hover:bg-green-600"
                  : quizResult === "incorrect" &&
                    gameState.selectedAnswer === option
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
              onClick={() => handleEmotionSelect(option)}
              disabled={gameState.selectedAnswer !== null}
            >
              {option}
              {quizResult === "correct" && option === currentEmotion.name && (
                <CheckCircle className="ml-2 h-5 w-5" />
              )}
              {quizResult === "incorrect" &&
                gameState.selectedAnswer === option && (
                  <XCircle className="ml-2 h-5 w-5" />
                )}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // Render video quiz stage
  const renderVideoQuiz = () => {
    if (!currentEmotion) return null;

    // For demo purposes, we'll use a sample video
    // In a real app, you'd use the video URL from your emotion data
    const videoUrl =
      "https://cloud.appwrite.io/v1/storage/buckets/67cc30a4000ee0980bad/files/67cc30fc002c356aab1a/view?project=67c98b5e0035bedcf913&mode=admin";

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
          {!videoPlaying && !showQuiz && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play();
                    setVideoPlaying(true);
                  }
                }}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl mb-6">
          <Progress
            value={(videoTime / (videoRef.current?.duration || 1)) * 100}
            className="h-2"
          />
        </div>

        <AnimatePresence>
          {showQuiz && currentQuizQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
              <h3 className="text-xl font-bold mb-4">
                {currentQuizQuestion.question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      gameState.selectedAnswer === option
                        ? "default"
                        : "outline"
                    }
                    className={`p-4 h-auto text-left justify-start ${
                      quizResult === "correct" &&
                      option === currentQuizQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : quizResult === "incorrect" &&
                          gameState.selectedAnswer === option
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }`}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={gameState.selectedAnswer !== null}
                  >
                    {option}
                    {quizResult === "correct" &&
                      option === currentQuizQuestion.correctAnswer && (
                        <CheckCircle className="ml-auto h-5 w-5" />
                      )}
                    {quizResult === "incorrect" &&
                      gameState.selectedAnswer === option && (
                        <XCircle className="ml-auto h-5 w-5" />
                      )}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Render completion screen
  const renderCompletionScreen = () => {
    // Calculate stars based on correct answers
    const totalQuestions = quizQuestions.length + 1; // +1 for the emotion recognition
    const correctPercentage = (gameState.correctAnswers / totalQuestions) * 100;

    let stars = 1;
    if (correctPercentage >= 50) stars = 2;
    if (correctPercentage >= 75) stars = 3;

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
              <Star
                className={`h-10 w-10 ${
                  i < stars ? "text-yellow-400 fill-yellow-400" : "text-muted"
                }`}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-xl mb-8">
          {currentEmotion
            ? `You've learned about ${currentEmotion.name}!`
            : "Level completed!"}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onExit}>
          Exit Game
        </Button>
        <div className="text-lg font-semibold">
          Level {levelId}: {currentEmotion?.name || "Emotion Learning"}
        </div>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {gameState.stage === "emotion-recognition" &&
          renderEmotionRecognition()}
        {gameState.stage === "video-quiz" && renderVideoQuiz()}
        {gameState.stage === "complete" && renderCompletionScreen()}
      </div>
    </div>
  );
}
