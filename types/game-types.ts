import { ReactNode } from "react"
export interface Emotion {
  id: number | String
  name: string
  image: string[]
  video: string
  description?: string
}

  
  export interface QuizQuestion {
    id: string
    timestamp: number
    wrongMessage: string
    question: string
    options: string[]
    correctAnswer: string
    image?: string | null
  }
  export interface PowerUp {
    id: number
    name: string
    description: string
    icon: ReactNode
    color: string
    borderColor: string
  }
  
  export interface GameState {
    stage: "preparation" | "video-quiz" | "complete"
    currentQuestion: number
    selectedAnswer: string | null
    correctAnswers: number
  }

  export type ObjectiveType = "score" | "collect" | "clear" | "time"


  export interface Objective {
    type: ObjectiveType
    target: number
    current: number
    icon: ReactNode
    label: string
    color: string
  }
  
  export interface Level {
    id: number
    name: string
    description: string
    image: string
    videoUrl: string
    unlocked: boolean
    completed: boolean
    stars: number
    color: string
    shadowColor: string
    gridSize: { rows: number; cols: number }
    moves: number
    objectives: Objective[]
    powerUps: PowerUp[]
    difficulty: number
    position: { x: number; y: number }
  }

  // export interface QuizQuestion {
  //   emotion: string
  //   time: number
  //   question: string
  //   options: string[]
  //   correctAnswer: string
  // }
  
  
  