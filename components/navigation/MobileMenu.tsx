"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { NavLink } from "@/components/navigation/NavLink"

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-[#0f1219] border-t border-slate-800"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <NavLink href="#features" mobile onClick={onClose}>
              Features
            </NavLink>
            <NavLink href="#pricing" mobile onClick={onClose}>
              Pricing
            </NavLink>
            <NavLink href="#about" mobile onClick={onClose}>
              About
            </NavLink>
            <NavLink href="#contact" mobile onClick={onClose}>
              Contact
            </NavLink>
            <Link href="/auth" passHref onClick={onClose}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
