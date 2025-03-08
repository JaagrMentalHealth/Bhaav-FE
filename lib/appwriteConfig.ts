import { Client, Databases } from "appwrite"

const client = new Client()

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite API Endpoint
  .setProject("67c98b5e0035bedcf913") // Replace with your Project ID

const databases = new Databases(client)




// Helper function to get random items from an array
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => 0.5 - Math.random())
}

export { client, databases }
