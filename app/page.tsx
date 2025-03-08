"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Smile, Trophy, Book, Star, Sparkles, Gamepad2, Heart, Zap } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoverButton, setHoverButton] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-indigo-950 text-white overflow-hidden">
      {/* Game world background */}
      <div className="absolute inset-0 -z-10">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Planets */}
        <motion.div
          className="absolute top-1/4 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-40 blur-md"
          animate={{ 
            y: [0, -10, 0],
            rotate: 360,
          }}
          transition={{ 
            y: {
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            },
            rotate: {
              duration: 200,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        <motion.div
          className="absolute bottom-1/4 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-pink-800 opacity-30 blur-md"
          animate={{ 
            y: [0, 15, 0],
            rotate: 360,
          }}
          transition={{ 
            y: {
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            },
            rotate: {
              duration: 240,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* Floating game elements */}
        <motion.div
          className="absolute top-20 right-[10%] h-16 w-16 rounded-full bg-yellow-300 opacity-80 shadow-glow-yellow"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-[15%] h-12 w-12 rounded-full bg-pink-400 opacity-80 shadow-glow-pink"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-[5%] h-8 w-8 rounded-full bg-green-400 opacity-80 shadow-glow-green"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-6 z-10">
        {/* Game UI header */}
        <div className="pt-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
              <Smile className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400">
              Bhaav
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 py-12 md:py-16">
          <motion.div
            className="md:w-1/2 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* <div className="inline-block mb-3 px-4 py-2 bg-indigo-800/50 rounded-xl border-2 border-indigo-600/50 shadow-glow-purple">
              <span className="text-fuchsia-300 font-bold flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Fun for kids ages 4-10
              </span>
            </div> */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md">
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
                Learn Emotions
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-orange-400 text-transparent bg-clip-text">
                Through Play!
              </span>
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-lg">
              Join our magical adventure to understand feelings, make new friends, and develop emotional intelligence
              through interactive games and stories!
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/levels">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoverButton('play')}
                  onHoverEnd={() => setHoverButton(null)}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <Button 
                    size="lg" 
                    className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-8 py-6 text-lg font-bold text-white rounded-xl border-2 border-indigo-400/30"
                  >
                    <Gamepad2 className="mr-2 h-6 w-6" />
                    Start Playing
                    {hoverButton === 'play' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full"
                      >
                        +10 XP
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-violet-900 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
                <Link href = "face-museum">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="relative bg-indigo-900/50 hover:bg-indigo-800/50 px-6 py-6 text-lg font-bold border-2 border-indigo-500/50 text-white rounded-xl"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Sparkles className="mr-2 h-6 w-6 text-fuchsia-300" />
                  </motion.span>
                  Museum of faces
                </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Animated spinning ring with particle effects */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-fuchsia-500 rounded-full shadow-glow-pink"
                    style={{
                      top: `${50 + 46 * Math.cos(2 * Math.PI * i / 20)}%`,
                      left: `${50 + 46 * Math.sin(2 * Math.PI * i / 20)}%`,
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>

              {/* Main image */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-indigo-400 shadow-2xl shadow-glow-purple">
                <Image
                  src="/hero.jpg?height=500&width=500"
                  alt="Happy children playing together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating emotion bubbles */}
              <motion.div
                className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-indigo-800 p-2 shadow-glow-indigo"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="h-full w-full rounded-full bg-yellow-100 flex items-center justify-center border-2 border-yellow-300">
                  <Smile className="h-10 w-10 text-yellow-500" />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 -left-6 h-16 w-16 rounded-full bg-indigo-800 p-2 shadow-glow-indigo"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300">
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
              </motion.div>
              
              {/* New floating elements */}
              <motion.div
                className="absolute top-1/2 -right-8 h-14 w-14 rounded-full bg-indigo-800 p-2 shadow-glow-indigo"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                <div className="h-full w-full rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-300">
                  <Trophy className="h-7 w-7 text-pink-500" />
                </div>
              </motion.div>
              
              {/* Floating powerup */}
              <motion.div
                className="absolute bottom-28 right-0 h-10 w-10 shadow-glow-small"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, 0, -10, 0]
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
              >
                <div className="h-full w-full rounded-lg bg-indigo-800 flex items-center justify-center border-2 border-indigo-400">
                  <Zap className="h-5 w-5 text-indigo-300" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950 to-indigo-900"></div>

        {/* Wavy divider */}
        <div className="absolute top-0 left-0 right-0 h-20 -z-10 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-20 text-indigo-950 fill-current"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
            />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">Discover the Magic</h2>
              <p className="text-indigo-200 max-w-2xl mx-auto">
                Our app is filled with exciting features designed to make emotional learning fun and engaging for
                children of all ages.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              {
                title: "Face Museum",
                description: "Explore different emotions and learn what they mean through interactive exhibits!",
                icon: <Smile className="text-yellow-400" size={28} />,
                href: "/face-museum",
                color: "bg-yellow-400/20",
                border: "border-yellow-400/50",
                glow: "shadow-glow-yellow",
                bgColor: "bg-indigo-800/80",
              },
              {
                title: "Fun Levels",
                description: "Complete exciting challenges and earn rewards as you master emotional intelligence!",
                icon: <Trophy className="text-pink-400" size={28} />,
                href: "/levels",
                color: "bg-pink-400/20",
                border: "border-pink-400/50",
                glow: "shadow-glow-pink",
                bgColor: "bg-indigo-800/80",
              },
              {
                title: "Cool Badges",
                description: "Collect awesome badges as you learn and grow your emotional vocabulary!",
                icon: <Star className="text-purple-400" size={28} />,
                href: "/badges",
                color: "bg-purple-400/20",
                border: "border-purple-400/50",
                glow: "shadow-glow-purple",
                bgColor: "bg-indigo-800/80",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Link href={feature.href} className="block h-full">
                  <div className={`h-full rounded-2xl p-6 ${feature.bgColor} border-2 ${feature.border} transition-all duration-300 ${feature.glow}`}>
                    <div className="mb-4">
                      <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center border-2 ${feature.border}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-indigo-200">{feature.description}</p>
                    
                    <div className="mt-4 flex justify-end">
                      <motion.div 
                        className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center border ${feature.border}`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <Sparkles size={18} className="text-white" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Game characters */}
          <div className="mt-20 flex justify-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 rounded-full blur-xl"></div>
              <div className="relative bg-indigo-800/80 border-2 border-fuchsia-400/50 rounded-2xl p-6 max-w-3xl shadow-glow-purple">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex -space-x-4">
                    {[
                      { color: "bg-yellow-100", border: "border-yellow-300", icon: <Smile className="h-8 w-8 text-yellow-500" /> },
                      { color: "bg-pink-100", border: "border-pink-300", icon: <Heart className="h-8 w-8 text-pink-500" /> },
                      { color: "bg-blue-100", border: "border-blue-300", icon: <Star className="h-8 w-8 text-blue-500" /> },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center border-2 ${item.border} shadow-glow-small`}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          delay: i * 0.3
                        }}
                      >
                        {item.icon}
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Meet Your Emotion Friends!</h3>
                    <p className="text-indigo-200">
                      These friendly characters will guide you through your emotional learning journey. 
                      Each one represents a different feeling to help you understand emotions better!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
