export type StageId = "name" | "tagline" | "about" | "services" | "clients" | "team" | "contact";

/** One continuous vertical push through the stages. */
export const STAGE_ORDER: StageId[] = ["name", "tagline", "about", "services", "clients", "team", "contact"];

/** The name and tagline stages share the root URL. */
export const PATH_FOR: Record<StageId, string> = {
  name: "/",
  tagline: "/",
  about: "/about",
  services: "/services",
  clients: "/clients",
  team: "/team",
  contact: "/contact",
};

export function pathToIndex(pathname: string): number | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return 0;
  const i = STAGE_ORDER.findIndex((id) => PATH_FOR[id] === clean);
  return i === -1 ? null : i;
}

export const STAGE_META: Record<StageId, { title: string; description: string; label: string }> = {
  name: {
    title: "By Any Other Name — a creative studio",
    description:
      "Concepts, productions and identities for the spaces in between. A creative studio for brands, venues and what happens after dark.",
    label: "Home",
  },
  tagline: {
    title: "By Any Other Name — a creative studio",
    description:
      "Concepts, productions and identities for the spaces in between. A creative studio for brands, venues and what happens after dark.",
    label: "Home",
  },
  about: {
    title: "About — By Any Other Name",
    description:
      "We develop original concepts — from after-hours clubs to immersive brand worlds — and produce them end-to-end.",
    label: "About",
  },
  services: {
    title: "Services — By Any Other Name",
    description: "Creative, production, and strategy. Concept development, immersive design, live events, positioning, growth.",
    label: "Services",
  },
  clients: {
    title: "Clients — By Any Other Name",
    description: "Selected clients and collaborators, from Cirque du Soleil to Google, LVMH, and The Box NYC.",
    label: "Clients",
  },
  team: {
    title: "Team — By Any Other Name",
    description: "Craig Klein, Zach Michaels, and Kacper Beski — the people behind the studio.",
    label: "Team",
  },
  contact: {
    title: "Contact — By Any Other Name",
    description: "rose@byanyothername.com — Los Angeles.",
    label: "Contact",
  },
};

/* ——— Verbatim copy ——— */

export const COPY = {
  wordmark: "by any other name",
  tagline: [
    "Concepts, productions and identities for the spaces in between.",
    "A creative studio for brands, venues and what happens after dark.",
  ],
  about: [
    "We develop original concepts — from after-hours clubs to immersive brand worlds — and produce them end-to-end.",
    "Our work sits at the intersection of business, art, and culture, made for hotels, venues, and brands who want their spaces to be remembered, not just visited.",
  ],
  services: [
    {
      name: "Creative",
      items: ["concept development", "immersive and experiential design", "brand worlds", "art direction"],
    },
    {
      name: "Production",
      items: ["live events", "operational design", "large-scale execution", "end-to-end delivery"],
    },
    {
      name: "Strategy",
      items: ["positioning", "growth", "vision", "brand architecture"],
    },
  ],
  clients: [
    "Activision", "Adidas", "Beauty Magic", "BOTNET", "Capcom", "Cartoon Network",
    "Cirque du Soleil", "Cloak & Dagger", "Coca-Cola", "Diageo", "EA", "Google",
    "Hugo Comte", "IKAR", "LVMH", "Meta", "Mondaine du Paris", "Night Spa",
    "Paramount+", "Reboot", "Showtime", "Summer Wagner", "The Box NYC",
    "The House of Red Doors", "Universal Studios", "YouTube",
  ],
  team: [
    {
      id: "craig",
      name: "Craig Klein",
      photo: "/team/craig.jpg",
      bio: "A seasoned creative with an expertise in the immersive and experiential. He has worked on nightlife projects in Kansas City, New York City, Berlin, Paris & Los Angeles.",
    },
    {
      id: "zach",
      name: "Zach Michaels",
      photo: "/team/zach.jpg",
      bio: "A live event producer and operator with 15+ years of production experience. Zach started in New York as assistant to high-wire artist Philippe Petit and later as operations manager and producer at The Box.",
    },
    {
      id: "kacper",
      name: "Kacper Beski",
      photo: "/team/kacper.jpg",
      bio: "Kacper operates at the intersection of business, art, and culture. An entrepreneur and strategy consultant, he has worked across the US, Europe, and Asia, focusing on vision, growth and strategy.",
    },
  ],
  contact: {
    email: "rose@byanyothername.com",
    city: "Los Angeles",
    copyright: "© BY ANY OTHER NAME 2026",
  },
};
