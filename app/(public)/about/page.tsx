import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { FoundingStory } from "@/components/about/FoundingStory";
import { LeadershipSection } from "@/components/about/LeadershipSection";
import { DiasporaSection } from "@/components/about/DiasporaSection";
import { IconsTimeline } from "@/components/icons/IconsTimeline";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the Yoruba Indigenes' Foundation — our history, mission, leadership, and global diaspora network. UN/ECOSOC Special Consultative Status. Reg. IT 28744.",
  openGraph: {
    title: "About the Yoruba Indigenes' Foundation",
    description:
      "Rooted in heritage, united in purpose. Discover YIF's founding story, national leadership, global diaspora network, and 20+ years of advancing Yoruba unity.",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "Yoruba Indigenes' Foundation" }],
  },
  twitter: { card: "summary_large_image", images: ["/logo.jpg"] },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVisionSection />
      <FoundingStory />
      <IconsTimeline />
      <LeadershipSection />
      <DiasporaSection />
    </>
  );
}
