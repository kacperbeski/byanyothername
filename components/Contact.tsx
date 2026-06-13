"use client";

import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";

export default function Contact({ reduce, active }: { reduce: boolean; active: boolean }) {
  return (
    <motion.div
      className="contact"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: reduce ? 0.5 : 1.5, delay: active ? 0.4 : 0, ease: "easeOut" }}
    >
      <h2 className="contact-email">
        <a href={`mailto:${COPY.contact.email}`}>{COPY.contact.email}</a>
      </h2>
    </motion.div>
  );
}
