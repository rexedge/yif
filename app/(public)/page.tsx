import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { MissionSection } from "@/components/home/MissionSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Yoruba Indigenes' Foundation — Uniting the global Yoruba in diaspora",
  description:
    "YIF is a UN/ECOSOC Special Consultative Status NGO dedicated to the unity, economic empowerment, and cultural preservation of Yoruba people worldwide. Reg. IT 28744.",
  openGraph: {
    title: "Yoruba Indigenes' Foundation",
    description:
      "Uniting the global Yoruba in diaspora through culture, education, and economic empowerment.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CtaBanner />
      <NewsletterSection />
    </>
  );
}
