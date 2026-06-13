"use client";

import { Fragment, useState } from "react";
import { COPY } from "@/lib/stages";

/** One horizontal line of names, drifting right to left, wrapping forever. */

function Line({ hidden, lit, onLight }: { hidden?: boolean; lit: string | null; onLight: (n: string) => void }) {
  return (
    <span className="marquee-copy" aria-hidden={hidden}>
      {COPY.clients.map((name) => (
        <Fragment key={name}>
          <button
            type="button"
            tabIndex={hidden ? -1 : 0}
            className={`client-name${lit === name ? " lit" : ""}`}
            onClick={() => onLight(name)}
          >
            {name}
          </button>
          <span className="client-sep" aria-hidden="true">·</span>
        </Fragment>
      ))}
    </span>
  );
}

export default function Clients() {
  const [lit, setLit] = useState<string | null>(null);
  const toggle = (name: string) => setLit((prev) => (prev === name ? null : name));

  return (
    <div className="marquee" role="list" aria-label="clients">
      <div className="marquee-track">
        <Line lit={lit} onLight={toggle} />
        <Line lit={lit} onLight={toggle} hidden />
      </div>
    </div>
  );
}
