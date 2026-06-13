import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Theater from "@/components/Theater";
import { PATH_FOR, STAGE_META, type StageId } from "@/lib/stages";

export const dynamicParams = false;

const SLUGS: Record<string, StageId> = {
  about: "about",
  services: "services",
  clients: "clients",
  team: "team",
  contact: "contact",
};

function resolve(stage?: string[]): StageId | null {
  if (!stage || stage.length === 0) return "name";
  if (stage.length === 1 && SLUGS[stage[0]]) return SLUGS[stage[0]];
  return null;
}

export function generateStaticParams() {
  return [{ stage: [] }, ...Object.keys(SLUGS).map((s) => ({ stage: [s] }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage?: string[] }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const id = resolve(stage);
  if (!id) return {};
  const meta = STAGE_META[id];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: PATH_FOR[id] },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: PATH_FOR[id],
      siteName: "By Any Other Name",
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ stage?: string[] }>;
}) {
  const { stage } = await params;
  const id = resolve(stage);
  if (!id) notFound();
  return <Theater initialStage={id} />;
}
