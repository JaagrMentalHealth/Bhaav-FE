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
  
  export interface GameState {
    stage: "preparation" | "video-quiz" | "complete"
    currentQuestion: number
    selectedAnswer: string | null
    correctAnswers: number
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

  // export interface QuizQuestion {
  //   emotion: string
  //   time: number
  //   question: string
  //   options: string[]
  //   correctAnswer: string
  // }
  
  
  