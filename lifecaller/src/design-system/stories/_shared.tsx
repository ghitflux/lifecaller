import type { ReactNode } from "react";
import { Heading } from "../components/Heading";

export function StoryBlock({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <Heading level="h2" className="text-[var(--text)]">{title}</Heading>
        {description ? <p className="ds-body text-[var(--muted)]">{description}</p> : null}
      </div>
      <div className="card p-4 space-y-4">{children}</div>
    </section>
  );
}

export function StoryGrid({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  const colClass = cols === 3 ? "md:grid-cols-3" : cols === 4 ? "md:grid-cols-4" : "md:grid-cols-2";
  return <div className={"grid gap-4 " + colClass}>{children}</div>;
}
