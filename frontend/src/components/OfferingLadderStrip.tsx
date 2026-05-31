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
        "mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-stone-600 shadow-sm dark:text-stone-400 sm:gap-x-6 sm:px-6"
      }
      role="note"
    >
      {ladder.tiers.map((tier) => (
        <span key={tier.id} className="min-w-0 break-words">
          <strong className="font-semibold text-foreground">
            {tier.price}
          </strong>
          {" · "}
          {tier.label}
          {" · "}
          {tier.timeframe}
        </span>
      ))}
      <span className="w-full min-w-0 text-xs text-muted sm:w-auto sm:basis-full">
        {ladder.typeShiftNote}
      </span>
    </div>
  );
}
