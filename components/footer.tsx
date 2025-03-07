import Link from "next/link"
import { Twitter, Instagram, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-bubblegum text-2xl">EmotiPlay</h2>
            <p className="text-sm opacity-90">Making emotional learning fun!</p>
          </div>

          <div className="flex gap-4">
            <Link
              href="https://twitter.com"
              className="hover:text-accent-yellow transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://instagram.com"
              className="hover:text-accent-yellow transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://youtube.com"
              className="hover:text-accent-yellow transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center md:text-left text-xs opacity-80">
          <p>© {new Date().getFullYear()} EmotiPlay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

