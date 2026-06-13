"use client";

import { COPY } from "@/lib/stages";

export default function Tagline() {
  return (
    <div className="center-layer">
      <p className="tagline">
        {COPY.tagline[0]}
        <br />
        {COPY.tagline[1]}
      </p>
    </div>
  );
}
