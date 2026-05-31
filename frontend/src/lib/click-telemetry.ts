export type SchedulingPlacement =
  | "header"
  | "mobile-freelance"
  | "mobile-coaching"
  | "hero-freelance"
  | "hero-coaching"
  | "lane-freelance"
  | "lane-coaching"
  | "contact-freelance"
  | "contact-coaching"
  | "cta";

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

export const ANALYTICS_INGEST_HEADER = "X-Analytics-Ingest-Key";

type SenderDeps = {
  fetch: (
    input: string,
    init: RequestInit,
  ) => Promise<Response>;
  ingestKey: string;
  endpoint: string;
};

/** Sends click telemetry with keepalive fetch (credential in header, not access logs). */
export function createSchedulingClickSender(deps: SenderDeps) {
  return (payload: SchedulingClickPayload): boolean => {
    const body = JSON.stringify(payload);
    void deps
      .fetch(deps.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [ANALYTICS_INGEST_HEADER]: deps.ingestKey,
        },
        body,
        keepalive: true,
      })
      .catch(() => {});
    return true;
  };
}

const ingestKey = process.env.NEXT_PUBLIC_ANALYTICS_INGEST_KEY ?? "";

export function sendSchedulingClick(
  payload: SchedulingClickPayload,
): boolean {
  if (!ingestKey || typeof fetch === "undefined") {
    return false;
  }
  const send = createSchedulingClickSender({
    fetch,
    ingestKey,
    endpoint: "/api/events",
  });
  return send(payload);
}
