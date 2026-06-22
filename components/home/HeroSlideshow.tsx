"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PlaceImage = {
  src: string;
  name: string;
  location: string;
  alt: string;
};

/**
 * Curated background images of sacred Yoruba places.
 * Files live in /public/image/yoruba-places/<slug>/...
 */
const PLACE_IMAGES: PlaceImage[] = [
  {
    src: "/image/yoruba-places/osun-osogbo-sacred-grove/site_1118_0001-1000-740-20090922145846.jpg",
    name: "Osun-Osogbo Sacred Grove",
    location: "Osun State · UNESCO World Heritage",
    alt: "Osun-Osogbo Sacred Grove, UNESCO World Heritage Site, Osun State",
  },
  {
    src: "/image/yoruba-places/osun-osogbo-sacred-grove/site_1118_0005-1000-1118-20121213163409.jpg",
    name: "Osun-Osogbo Sacred Grove",
    location: "Osun State · Sculpture Walk",
    alt: "Sculptures along the Osun-Osogbo Sacred Grove",
  },
  {
    src: "/image/yoruba-places/osun-osogbo-sacred-grove/site_1118_0006-1000-1535-20121213163614.jpg",
    name: "Osun-Osogbo Sacred Grove",
    location: "Osun State · Riverside Shrine",
    alt: "Shrine within the Osun-Osogbo Sacred Grove",
  },
  {
    src: "/image/yoruba-places/idanre-hill/Idanre_Hills,_UNESCO_World_Heritage.jpg",
    name: "Idanre Hills",
    location: "Ondo State · UNESCO Tentative List",
    alt: "Idanre Hills, UNESCO World Heritage Site, Ondo State",
  },
  {
    src: "/image/yoruba-places/idanre-hill/Artistic_shot_of_the_hill.jpg",
    name: "Idanre Hills",
    location: "Ondo State",
    alt: "Artistic view of Idanre Hill, Ondo State",
  },
  {
    src: "/image/yoruba-places/olumo-rock/Entrance_to_Olumo_Rock.jpg",
    name: "Olumo Rock",
    location: "Abeokuta, Ogun State",
    alt: "Entrance to Olumo Rock, Abeokuta, Ogun State",
  },
  {
    src: "/image/yoruba-places/olumo-rock/Hide_out_cave_during_19th_century_Egba_war.jpg",
    name: "Olumo Rock",
    location: "Ogun State · 19th-century Egba refuge",
    alt: "Olumo Rock hide-out cave from the 19th-century Egba war",
  },
  {
    src: "/image/yoruba-places/ooni-palace/Ile_Oodua.jpg",
    name: "Ile Oodua",
    location: "Ile-Ife, Osun State · Ooni's Palace",
    alt: "Ile Oodua, the Ooni of Ife's royal palace, Ile-Ife",
  },
  {
    src: "/image/yoruba-places/ooni-palace/Palace_of_the_current_Ooni_of_Ife.jpg",
    name: "Palace of the Ooni of Ife",
    location: "Ile-Ife, Osun State",
    alt: "Palace of the current Ooni of Ife, Osun State",
  },
  {
    src: "/image/yoruba-places/erin-ijesha-waterfalls/Olumirin_falls.jpg",
    name: "Olumirin (Erin-Ijesha) Waterfalls",
    location: "Osun State",
    alt: "Olumirin (Erin-Ijesha) waterfalls, Osun State",
  },
  {
    src: "/image/yoruba-places/erin-ijesha-waterfalls/Erin-Ijesha_WaterFalls_StepsHikers.jpg",
    name: "Erin-Ijesha Waterfalls",
    location: "Osun State · Seven-tier ascent",
    alt: "Hikers ascending Erin-Ijesha waterfalls",
  },
  {
    src: "/image/yoruba-places/ikogosi-warm-springs/Ikogosi_Warm_Spring,_Ekiti_State,_Nigeria_-_1.jpg",
    name: "Ikogosi Warm Springs",
    location: "Ekiti State",
    alt: "Ikogosi Warm Springs, Ekiti State",
  },
  {
    src: "/image/yoruba-places/ikogosi-warm-springs/Ikogosi_Cold_and_Warm_Spring_Waterpath.jpg",
    name: "Ikogosi Warm & Cold Springs",
    location: "Ekiti State · Confluence point",
    alt: "Confluence of cold and warm springs at Ikogosi, Ekiti State",
  },
];

const INTERVAL_MS = 6500;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (PLACE_IMAGES.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % PLACE_IMAGES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const current = PLACE_IMAGES[active];

  return (
    <>
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {PLACE_IMAGES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1400 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center will-change-transform animate-hero-kenburns"
            />
          </div>
        ))}

        {/* Cinematic wash — balances photo visibility with text legibility */}
        <div className="absolute inset-0 bg-(--yif-navy)/30" />
        <div className="absolute inset-0 bg-linear-to-r from-(--yif-navy)/92 via-(--yif-navy)/65 to-(--yif-navy)/30" />
        <div className="absolute inset-0 bg-linear-to-t from-(--yif-navy)/90 via-transparent to-(--yif-navy)/40" />
      </div>

      {/* Place caption — strategic bottom-right pin, away from headline + CTAs */}
      <figcaption
        aria-live="polite"
        className="pointer-events-none absolute bottom-20 right-4 z-20 hidden max-w-[18rem] sm:bottom-24 sm:right-8 sm:block"
      >
        <div
          key={current.src}
          className="animate-fade-up rounded-l-md border-l-2 border-yif-gold bg-(--yif-navy)/55 px-4 py-3 text-right text-white shadow-2xl backdrop-blur-md"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-yif-gold">
            Yoruba Heritage
          </p>
          <p className="mt-1 font-display text-base leading-tight text-white">
            {current.name}
          </p>
          <p className="mt-1 text-xs text-white/70">{current.location}</p>
        </div>
      </figcaption>
    </>
  );
}
