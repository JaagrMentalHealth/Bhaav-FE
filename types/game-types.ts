export interface Emotion {
    id: string
    name: string
    image: string
    description: string
    videoUrl?: string
  }
  
  export interface QuizQuestion {
    id: string
    timestamp: number
    question: string
    options: string[]
    correctAnswer: string
  }
  
  export interface GameState {
    stage: "emotion-recognition" | "video-quiz" | "complete" | "selection"
    currentQuestion: number
    selectedAnswer: string | null
    correctAnswers: number
    currentLevel?: number | null
    levels?: Level[]
    gameStage?: string
  }
  
  export interface Level {
    id: number
    name: string
    unlocked: boolean
    completed: boolean
    stars: number
    emotion: string
    questions: QuizQuestion[]
  }
  
  