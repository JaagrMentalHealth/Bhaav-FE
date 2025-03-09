"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { databases } from "@/lib/appwriteConfig"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { X, ChevronLeft, ChevronRight, Info, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Emotion {
  id: string
  name: string
  image: string
  description: string
}

export default function FaceMuseum() {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  let isMounted=true;
    const fetchEmotions = async () => {
      setIsLoading(true)
      try {
        const response = await databases.listDocuments("67c98cc3002b3e3dc1a5", "67c98ce00023c7585f67")

        const emotionsData = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          image: doc.image || "/placeholder.svg", // Using database image URL
          description: doc.description,
        }))

        console.log("Fetched emotions:", emotionsData) // Debug log
        setEmotions(emotionsData)
      } catch (error) {
        console.error("Error fetching emotions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmotions()

    return ()=>{
      isMounted=false;
    }
  }, [])

  const handleEmotionClick = (id: string) => {
    setSelectedEmotion(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion)

  // Custom carousel arrows
  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 25px)",
    width: 50,
    height: 50,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "50%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  } as const

  const renderArrowPrev = (clickHandler: () => void) => (
    <div onClick={clickHandler} style={{ ...arrowStyles, left: 20 }} className="hover:bg-white">
      <ChevronLeft className="h-6 w-6 text-primary" />
    </div>
  )

  const renderArrowNext = (clickHandler: () => void) => (
    <div onClick={clickHandler} style={{ ...arrowStyles, right: 20 }} className="hover:bg-white">
      <ChevronRight className="h-6 w-6 text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-indigo-950 text-white overflow-hidden">
      {/* Museum-like header with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-800 to-indigo-950 pt-16 pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
          
    </div>    
       <div className="container relative z-10 mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center text-indigo-200 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Home</span>
            </Link>
        </div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-fuchsia-500/20 blur-md rounded-full"></div>
                
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
                Hall of Faces
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto text-indigo-200 leading-relaxed">
              Explore different emotions and learn what they mean! Click on a face to learn more about that emotion.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 "></div>
          </div>
        ) : emotions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-24 rounded-3xl overflow-hidden shadow-glow-purple"
          >
            <div className="relative">
            <div className="emotion-carousel bg-indigo-800/60 ">
              <Carousel
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                autoPlay
                interval={4000}
                className="emotion-carousel"
                renderArrowPrev={renderArrowPrev}
                renderArrowNext={renderArrowNext}
              >
                {emotions.map((emotion) => (
                  <div key={emotion.id} className="p-8 md:p-12 text-center">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6">
                      <div className="absolute inset-0 bg-fuchsia-500/10 rounded-full"></div>
                      <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
                      <div className="absolute inset-8 bg-indigo-900 rounded-full shadow-inner flex items-center justify-center border-2 border-indigo-700/50">
                      <Image
                      src={emotion.image || "/placeholder.svg"}
                      alt={emotion.name}
                      fill
                            className="object-cover rounded-full p-2"
                      />
                      </div>
                    </div>
                      <h2 className="text-2xl md:text-3xl font-bold mt-4 text-white">{emotion.name}</h2>
                      <p className="text-base md:text-lg text-indigo-200 mt-3 max-w-lg mx-auto">
                      {emotion.description}
                    </p>
                    <button
                      onClick={() => handleEmotionClick(emotion.id)}
                      className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Learn More
                    </button>
                  </div>
                ))}
              </Carousel>
            </div>
            </div>
          </motion.div>
        ) : null} */}

        <div className="mb-16">

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  zIndex: 10,
                }}
                whileTap={{ scale: 0.98 }}
                className={`bg-indigo-800/60 rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 `}
                onClick={() => handleEmotionClick(emotion.id)}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-primary/5">
                  <Image
                    src={emotion.image || "/placeholder.svg"}
                    alt={emotion.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-center font-medium text-white">{emotion.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Museum-like footer */}
      <div className="bg-indigo-900/80 py-12 border-t-2 border-indigo-700/50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">About Hall of faces</h3>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Our interactive museum helps children understand and identify different emotions. By exploring these
            exhibits, kids develop emotional intelligence and empathy.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEmotionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`bg-indigo-800/90 max-w-lg w-full rounded-3xl p-6 shadow-2xl border-2 `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedEmotionData.name}</h2>
                <button
                  onClick={closeModal}
                  className="text-indigo-200 hover:text-white transition-colors rounded-full p-1 hover:bg-indigo-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0 bg-primary/10 rounded-2xl p-2">
                  <Image
                    src={selectedEmotionData.image || "/placeholder.svg"}
                    alt={selectedEmotionData.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-indigo-200 mb-6">{selectedEmotionData.description}</p>

                  <div className="bg-indigo-900/80 p-4 rounded-xl mb-6 border-2 border-indigo-700/50">
                    <h4 className="font-medium mb-2">When you might feel this way:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmotionData.name === "Happy"
                        ? "When you're playing with friends, celebrating, or received a gift you love!"
                        : selectedEmotionData.name === "Sad"
                          ? "When you lose something special, miss someone, or things don't go as planned."
                          : selectedEmotionData.name === "Angry"
                            ? "When something feels unfair, you're frustrated, or someone hurt your feelings."
                            : selectedEmotionData.name === "Surprised"
                              ? "When something unexpected happens, you get a surprise gift, or see something amazing!"
                              : selectedEmotionData.name === "Scared"
                                ? "When you face something new, are in the dark, or hear a loud noise."
                                : "When you experience something new or unexpected in your day."}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

