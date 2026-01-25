export function Card({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <div className="panel rounded-3xl p-6 md:p-7 hover-lift hover:border-white/20">
      {eyebrow ? (
        <div className="text-xs text-vss-muted tracking-widest uppercase">
          {eyebrow}
        </div>
      ) : null}
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight text-vss-heading">
        {title}
      </div>
      <p className="mt-3 text-base text-vss-muted leading-relaxed">{body}</p>
    </div>
  );
}
