import { describe, it, expect, vi } from "vitest";
import {
  buildSchedulingClickPayload,
  createSchedulingClickSender,
  type SchedulingPlacement,
} from "./click-telemetry";

describe("buildSchedulingClickPayload", () => {
  const cases: [SchedulingPlacement, string, string][] = [
    ["hero", "/de/", "de"],
    ["contact", "/en/", "en"],
    ["cta", "/de/app-entwickeln-freelancer/", "de"],
    ["cta", "/en/vibe-coding-coach/", "en"],
  ];

  it.each(cases)(
    "builds scheduling_click for placement %s on %s",
    (placement, path, locale) => {
      expect(buildSchedulingClickPayload(path, placement, locale)).toEqual({
        type: "scheduling_click",
        path,
        placement,
        locale,
      });
    },
  );
});

describe("createSchedulingClickSender", () => {
  it("sendBeacon posts JSON to /api/events with ingest key in query", () => {
    const sendBeacon = vi.fn(() => true);
    const send = createSchedulingClickSender({
      sendBeacon,
      ingestKey: "site-key",
      endpoint: "/api/events",
    });

    const ok = send(
      buildSchedulingClickPayload("/de/", "hero", "de"),
    );

    expect(ok).toBe(true);
    expect(sendBeacon).toHaveBeenCalledOnce();
    const [url, blob] = sendBeacon.mock.calls[0] as [string, Blob];
    expect(url).toBe("/api/events?key=site-key");
    expect(blob.type).toBe("application/json");
  });
});
