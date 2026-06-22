import type { Metadata } from "next";
import { ProgramsHero } from "@/components/programs/ProgramsHero";
import { KaroOjireSection } from "@/components/programs/KaroOjireSection";
import { ScholarshipSection } from "@/components/programs/ScholarshipSection";
import {
  AwardsSection,
  YouthSection,
} from "@/components/programs/AwardsYouthSections";
import { ProgramIcons } from "@/components/icons/ProgramIcons";

export const metadata: Metadata = {
  title: "Programs & Initiatives | YIF",
  description:
    "Explore YIF's four core programs: Karo-Ojire Economic Empowerment, the 2024–25 Scholarship, Annual Events & Awards (Order of Odua), and Youth Development.",
  openGraph: {
    title: "Programs & Initiatives | Yoruba Indigenes' Foundation",
    description:
      "Four pillars driving Yoruba advancement — economic empowerment, education, cultural recognition, and youth development.",
    type: "website",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "Yoruba Indigenes' Foundation" }],
  },
  twitter: { card: "summary_large_image", images: ["/logo.jpg"] },
};

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />
      <KaroOjireSection />
      <ProgramIcons program="economic" />
      <ScholarshipSection />
      <ProgramIcons program="education" />
      <AwardsSection />
      <ProgramIcons program="recognition" />
      <YouthSection />
      <ProgramIcons program="youth" />
    </>
  );
}
