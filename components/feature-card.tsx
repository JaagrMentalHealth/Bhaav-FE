import type { ReactNode } from "react"
import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  bgColor: string
}

const FeatureCard = ({ title, description, icon, href, bgColor }: FeatureCardProps) => {
  return (
    <Link href={href} className={`feature-card ${bgColor}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bubblegum text-xl mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </Link>
  )
}

export default FeatureCard

