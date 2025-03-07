import { Client, Databases } from "appwrite"

const client = new Client()

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite API Endpoint
  .setProject("67c98b5e0035bedcf913") // Replace with your Project ID

const databases = new Databases(client)

export { client, databases }
