"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import AnimatedButton from "@/components/animated-button"
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react"

// Story scenario with decision points
const storyScenario = {
  start: {
    id: "start",
    text: "Alex is starting at a new school today. How do you think Alex feels?",
    image: "/stories/new-school.svg",
    options: [
      { id: "nervous", text: "Nervous", next: "nervous" },
      { id: "excited", text: "Excited", next: "excited" },
      { id: "angry", text: "Angry", next: "angry" },
    ],
  },
  nervous: {
    id: "nervous",
    text: "Alex feels nervous. The teacher asks Alex to introduce themselves to the class. What should Alex do?",
    image: "/stories/nervous-intro.svg",
    options: [
      { id: "deep-breath", text: "Take a deep breath first", next: "deep-breath" },
      { id: "refuse", text: "Refuse to speak", next: "refuse" },
    ],
  },
  excited: {
    id: "excited",
    text: "Alex feels excited about meeting new friends! During lunch, Alex sees a group of kids playing. What should Alex do?",
    image: "/stories/excited-lunch.svg",
    options: [
      { id: "join", text: "Ask to join them", next: "join" },
      { id: "wait", text: "Wait for someone to invite them", next: "wait" },
    ],
  },
  angry: {
    id: "angry",
    text: "Alex feels angry about having to change schools. In class, the teacher asks why Alex looks upset. What should Alex do?",
    image: "/stories/angry-class.svg",
    options: [
      { id: "explain", text: "Explain their feelings", next: "explain" },
      { id: "hide", text: "Hide their feelings", next: "hide" },
    ],
  },
  "deep-breath": {
    id: "deep-breath",
    text: "Alex takes a deep breath and introduces themselves. The class smiles and welcomes Alex. Alex still feels a little nervous but also proud for being brave!",
    image: "/stories/success-intro.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "proud",
  },
  refuse: {
    id: "refuse",
    text: "Alex refuses to speak. The teacher understands and says it's okay to introduce themselves later when they feel ready. Alex feels relieved but wishes they had tried.",
    image: "/stories/refuse-intro.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "regret",
  },
  join: {
    id: "join",
    text: "Alex asks to join the group. They welcome Alex and share their toys. Alex makes new friends and feels happy about the new school!",
    image: "/stories/join-group.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "happy",
  },
  wait: {
    id: "wait",
    text: "Alex waits, but no one invites them to play. Alex feels disappointed but decides to try again tomorrow with more courage.",
    image: "/stories/wait-alone.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "disappointed",
  },
  explain: {
    id: "explain",
    text: "Alex explains they're upset about changing schools. The teacher listens and helps Alex feel better. Alex feels understood and a little less angry.",
    image: "/stories/explain-feelings.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "understood",
  },
  hide: {
    id: "hide",
    text: "Alex hides their feelings and says nothing's wrong. The feelings stay bottled up inside, making it harder to enjoy the new school.",
    image: "/stories/hide-feelings.svg",
    options: [{ id: "start", text: "Start a new story", next: "start" }],
    ending: true,
    emotion: "bottled-up",
  },
}

type ScenarioKey = keyof typeof storyScenario

export default function Storyboard() {
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>("start")
  const [storyPath, setStoryPath] = useState<ScenarioKey[]>(["start"])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleOptionClick = (next: ScenarioKey) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentScenario(next)
      setStoryPath([...storyPath, next])
      setIsAnimating(false)
    }, 500)
  }

  const handleBack = () => {
    if (storyPath.length > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        const newPath = [...storyPath]
        newPath.pop()
        setStoryPath(newPath)
        setCurrentScenario(newPath[newPath.length - 1])
        setIsAnimating(false)
      }, 500)
    }
  }

  const playAudio = () => {
    // In a real app, this would play the narration audio
    alert("Playing narration audio...")
  }

  const scenario = storyScenario[currentScenario]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Animated Storyboard</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Create your own emotional stories and adventures! Choose different paths to see how emotions affect outcomes.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-b from-primary/20 to-primary/5">
          <motion.div
            key={currentScenario}
            initial={isAnimating ? { opacity: 0, x: 50 } : { opacity: 1 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image src={scenario.image || "/placeholder.svg"} alt="Story scene" fill className="object-contain p-4" />
          </motion.div>

          <button
            onClick={playAudio}
            className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
            aria-label="Play narration"
          >
            <Volume2 size={24} className="text-primary" />
          </button>
        </div>

        <div className="p-6">
          <motion.div
            key={`text-${currentScenario}`}
            initial={isAnimating ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg mb-6">{scenario.text}</p>

            <div className="flex flex-col gap-3">
              {scenario.options.map((option) => (
                <AnimatedButton
                  key={option.id}
                  onClick={() => handleOptionClick(option.next as ScenarioKey)}
                  className={`btn-primary text-left justify-start ${
                    scenario.ending ? "bg-accent-green hover:bg-accent-green/90" : ""
                  }`}
                >
                  <span className="flex items-center">
                    {option.text}
                    <ChevronRight className="ml-2" size={16} />
                  </span>
                </AnimatedButton>
              ))}
            </div>

            {storyPath.length > 1 && (
              <button onClick={handleBack} className="mt-4 flex items-center text-primary hover:underline">
                <ChevronLeft size={16} />
                <span>Go back</span>
              </button>
            )}

            {scenario.ending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 p-4 bg-primary/10 rounded-lg"
              >
                <h3 className="font-bold mb-2">You learned about: {scenario.emotion}</h3>
                <p>
                  Great job completing this story! You've learned how different choices can lead to different emotions.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

