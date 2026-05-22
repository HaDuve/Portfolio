export type SchedulingPlacement = "hero" | "contact" | "cta";

export type SchedulingClickPayload = {
  type: "scheduling_click";
  path: string;
  placement: SchedulingPlacement;
  locale: "de" | "en";
};

export function buildSchedulingClickPayload(
  path: string,
  placement: SchedulingPlacement,
  locale: "de" | "en",
): SchedulingClickPayload {
  return { type: "scheduling_click", path, placement, locale };
}

type SenderDeps = {
  sendBeacon: (url: string, data: Blob) => boolean;
  ingestKey: string;
  endpoint: string;
};

/** Sends click telemetry via Beacon; returns whether the browser queued the request. */
export function createSchedulingClickSender(deps: SenderDeps) {
  return (payload: SchedulingClickPayload): boolean => {
    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "application/json" });
    const url = `${deps.endpoint}?key=${encodeURIComponent(deps.ingestKey)}`;
    return deps.sendBeacon(url, blob);
  };
}

const ingestKey = process.env.NEXT_PUBLIC_ANALYTICS_INGEST_KEY ?? "";

export function sendSchedulingClick(
  payload: SchedulingClickPayload,
): boolean {
  if (!ingestKey || typeof navigator === "undefined") {
    return false;
  }
  const send = createSchedulingClickSender({
    sendBeacon: (url, data) => navigator.sendBeacon(url, data),
    ingestKey,
    endpoint: "/api/events",
  });
  return send(payload);
}
