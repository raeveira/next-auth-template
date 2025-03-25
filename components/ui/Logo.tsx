import { Mail } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-8 w-8" : "h-7 w-7"
  const textSize = size === "sm" ? "text-xl" : size === "lg" ? "text-2xl" : "text-xl"

  return (
    <div className="flex items-center gap-2">
      <Mail className={`${iconSize} text-blue-500`} />
      <span className={`${textSize} font-bold text-white`}>FlowMail</span>
    </div>
  )
}

