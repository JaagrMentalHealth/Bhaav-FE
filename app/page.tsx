"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Smile, Trophy, Book, Star } from "lucide-react"
import AnimatedButton from "@/components/animated-button"
import FeatureCard from "@/components/feature-card"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-200 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  Learn Emotions
                </span> 
                Through Play!
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Join our fun adventure to understand feelings and make new friends!
              </p>
              <div className="flex flex-wrap gap-4">
                <AnimatedButton>Start Playing</AnimatedButton>
                <AnimatedButton className="btn-secondary bg-accent-green hover:bg-accent-green">Watch Demo</AnimatedButton>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/hero.jpg"
                  alt="Happy children playing together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3 },
              },
            }}
          >
            {[
              {
                title: "Face Museum",
                description: "Explore different emotions and learn what they mean!",
                icon: <Smile className="text-blue-500" />,
                href: "/face-museum",
                bgColor: "bg-pink-100",
              },
              {
                title: "Fun Levels",
                description: "Complete exciting challenges and earn rewards!",
                icon: <Trophy className="text-yellow-500" />,
                href: "/levels",
                bgColor: "bg-blue-100",
              },
              {
                title: "Story Time",
                description: "Create your own emotional stories and adventures!",
                icon: <Book className="text-green-500" />,
                href: "/storyboard",
                bgColor: "bg-green-100",
              },
              {
                title: "Cool Badges",
                description: "Collect awesome badges as you learn and grow!",
                icon: <Star className="text-purple-500" />,
                href: "/badges",
                bgColor: "bg-yellow-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  href={feature.href}
                  bgColor={`${feature.bgColor} shadow-md hover:shadow-lg transition`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}