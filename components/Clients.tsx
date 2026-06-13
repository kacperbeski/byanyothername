"use client";

import { Fragment, useState } from "react";
import { COPY } from "@/lib/stages";

/** One horizontal line of names, drifting right to left, wrapping forever. */
function Line({
  names,
  hidden,
  lit,
  onLight,
}: {
  names: string[];
  hidden?: boolean;
  lit: string | null;
  onLight: (n: string) => void;
}) {
  return (
    <span className="marquee-copy" aria-hidden={hidden}>
      {names.map((name) => (
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

function Row({ names, lit, onLight }: { names: string[]; lit: string | null; onLight: (n: string) => void }) {
  return (
    <div className="marquee" role="list" aria-label="clients">
      <div className="marquee-track">
        <Line names={names} lit={lit} onLight={onLight} />
        <Line names={names} lit={lit} onLight={onLight} hidden />
      </div>
    </div>
  );
}

export default function Clients() {
  const [lit, setLit] = useState<string | null>(null);
  const toggle = (name: string) => setLit((prev) => (prev === name ? null : name));

  // split the full list into three roughly-equal groups for the mobile layout
  const all = COPY.clients;
  const size = Math.ceil(all.length / 3);
  const rows = [all.slice(0, size), all.slice(size, size * 2), all.slice(size * 2)];

  return (
    <>
      {/* desktop: one long line */}
      <div className="clients-desktop">
        <Row names={all} lit={lit} onLight={toggle} />
      </div>

      {/* mobile: three shorter lines */}
      <div className="clients-mobile">
        {rows.map((names, i) => (
          <Row key={i} names={names} lit={lit} onLight={toggle} />
        ))}
      </div>
    </>
  );
}
