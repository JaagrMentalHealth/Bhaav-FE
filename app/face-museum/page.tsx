"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { databases } from "@/lib/appwriteConfig"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

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

  useEffect(() => {
  let isMounted=true;
    const fetchEmotions = async () => {
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

  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 text-indigo-900 tracking-tight">Museum of Faces</h1>
          <p className="text-xl max-w-2xl mx-auto text-indigo-700 leading-relaxed">
            Explore different emotions and learn what they mean! Click on a face to learn more about that emotion.
          </p>
        </motion.div>

        {emotions.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm">
            <Carousel
              showArrows={true}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
              autoPlay
              interval={3000}
              className="emotion-carousel"
            >
              {emotions.map((emotion) => (
                <div key={emotion.id} className="p-8 text-center">
                  <div className="relative w-52 h-52 mx-auto mb-4">
                    <Image 
                      src={emotion.image} 
                      alt={emotion.name} 
                      fill 
                      className="object-contain drop-shadow-md" 
                    />
                  </div>
                  <h2 className="text-3xl font-bold mt-4 text-indigo-800">{emotion.name}</h2>
                  <p className="text-lg text-indigo-600 mt-3 max-w-lg mx-auto">{emotion.description}</p>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">Emotion Gallery</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {emotions.map((emotion) => (
            <motion.div
              key={emotion.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-indigo-300"
              onClick={() => handleEmotionClick(emotion.id)}
            >
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-indigo-50 p-2">
                <Image 
                  src={emotion.image} 
                  alt={emotion.name} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <h3 className="text-center font-bold text-lg text-indigo-800">{emotion.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedEmotionData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-indigo-900">{selectedEmotionData.name}</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-indigo-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image 
                  src={selectedEmotionData.image} 
                  alt={selectedEmotionData.name} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div>
                <p className="text-indigo-700 mb-4">{selectedEmotionData.description}</p>
                <div className="flex justify-end">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
