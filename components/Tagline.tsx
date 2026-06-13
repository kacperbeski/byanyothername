"use client";

import { COPY } from "@/lib/stages";

export default function Tagline() {
  return (
    <div className="center-layer">
      <p className="tagline">
        <span className="tagline-line">{COPY.tagline[0]}</span>
        <span className="tagline-line">{COPY.tagline[1]}</span>
      </p>
    </div>
  );
}
