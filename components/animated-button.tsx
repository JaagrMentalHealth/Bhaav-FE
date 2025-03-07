"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
}

const AnimatedButton = ({ children, onClick, className = "btn-primary bg-card-pink hover:bg-card-pink opacity-90", type = "button" }: AnimatedButtonProps) => {
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton