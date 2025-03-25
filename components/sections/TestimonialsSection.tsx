import { SectionHeader } from "@/components/sections/SectionHeader"
import { TestimonialCard } from "@/components/cards/TestimonialCard"

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#0a0d14]">
      <div className="container mx-auto px-4">
        <SectionHeader title="Loved by Users" subtitle="See what our customers have to say about FlowMail" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <TestimonialCard
            quote="FlowMail has completely transformed how I handle my emails. I save hours every week."
            author="Sarah Johnson"
            role="Marketing Director"
          />
          <TestimonialCard
            quote="The interface is beautiful and the smart features are genuinely helpful. Best email client I've used."
            author="Michael Chen"
            role="Software Engineer"
          />
          <TestimonialCard
            quote="Security was my main concern, and FlowMail delivers. I feel confident using it for sensitive communications."
            author="Emma Rodriguez"
            role="Financial Advisor"
          />
        </div>
      </div>
    </section>
  )
}

