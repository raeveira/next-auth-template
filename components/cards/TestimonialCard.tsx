"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="bg-[#131620] p-8 rounded-xl border border-slate-800"
    >
      <p className="text-slate-300 mb-6 italic">&#34;{quote}&#34;</p>
      <div>
        <p className="font-semibold text-white">{author}</p>
        <p className="text-slate-400 text-sm">{role}</p>
      </div>
    </motion.div>
  )
}

