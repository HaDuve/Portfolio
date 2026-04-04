type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
