"use client";

import { COPY } from "@/lib/stages";

export default function About() {
  return (
    <div className="center-layer">
      <h2 className="about-statement">{COPY.about}</h2>
    </div>
  );
}
