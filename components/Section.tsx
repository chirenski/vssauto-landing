import type { ReactNode } from "react";

export function Section({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="slide-up scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-vss-heading">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base md:text-lg text-vss-muted leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
