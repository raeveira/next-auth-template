import { Mail, Shield, Zap } from "lucide-react"
import { SectionHeader } from "@/components/sections/SectionHeader"
import { FeatureCard } from "@/components/cards/FeatureCard"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[#0f1219]">
      <div className="container mx-auto px-4">
        <SectionHeader title="Powerful Features" subtitle="Everything you need for efficient email management" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<Mail />}
            title="Smart Inbox"
            description="Automatically categorizes your emails and highlights what's important."
          />
          <FeatureCard
            icon={<Zap />}
            title="Lightning Fast"
            description="Optimized for speed with instant search and quick actions."
          />
          <FeatureCard
            icon={<Shield />}
            title="Advanced Security"
            description="End-to-end encryption and advanced phishing protection."
          />
        </div>
      </div>
    </section>
  )
}

