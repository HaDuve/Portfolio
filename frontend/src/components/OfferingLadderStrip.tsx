import type { OfferingLadder } from "@/lib/offeringLadder";

type Props = {
  ladder: OfferingLadder;
  className?: string;
};

export function OfferingLadderStrip({ ladder, className }: Props) {
  return (
    <div
      className={
        className ??
        "mt-10 flex flex-col gap-2 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-stone-600 shadow-sm dark:text-stone-400 sm:px-6"
      }
      role="note"
    >
      {ladder.tiers.map((tier) => (
        <span key={tier.id} className="block min-w-0 break-words">
          <strong className="font-semibold text-foreground">
            {tier.price}
          </strong>
          {" · "}
          {tier.label}
          {" · "}
          {tier.timeframe}
        </span>
      ))}
      <span className="min-w-0 text-xs text-muted">
        {ladder.typeShiftNote}
      </span>
    </div>
  );
}
