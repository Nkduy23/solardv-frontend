"use client";

import { motion } from "framer-motion";
import { Project } from "@/types/project";

export function ProjectGallery({ projects }: { projects: (Project & { image?: string })[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy ${i % 5 === 0 ? "sm:row-span-2 sm:aspect-[3/4]" : "aspect-[4/3]"}`}
        >
          {project.image && <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/90 via-navy/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="font-display text-base font-semibold text-paper">{project.title}</h3>
            <p className="mt-1 font-mono text-xs text-sunrise-amber">
              {project.location} · {project.capacity} · {project.completedYear}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
