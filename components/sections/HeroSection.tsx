"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 mr-2" /> Introducing FlowMail
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            Email that flows with your workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-slate-300"
          >
            Experience a new way to manage your communications. Intuitive, fast, and designed for productivity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="/auth" passHref>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 bg-[#1e2330] text-white hover:bg-slate-800 hover:text-white">
              Take a Tour
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <div className="relative z-10 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-[#0f1219] p-4 text-white border-b border-slate-800">FlowMail Dashboard</div>
            <div className="bg-[#0f1219] aspect-video"></div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-10"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10"
          />
        </motion.div>
      </div>
    </section>
  )
}

