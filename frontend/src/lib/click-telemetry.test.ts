import { describe, it, expect, vi } from "vitest";
import {
  ANALYTICS_INGEST_HEADER,
  buildSchedulingClickPayload,
  createSchedulingClickSender,
} from "./click-telemetry";
import { INSTRUMENTED_SCHEDULING_CLICKS } from "./scheduling-click-sites";

describe("INSTRUMENTED_SCHEDULING_CLICKS", () => {
  it("lists seven home placements per locale plus four landing ctas", () => {
    expect(INSTRUMENTED_SCHEDULING_CLICKS).toHaveLength(18);
    expect(INSTRUMENTED_SCHEDULING_CLICKS).toEqual(
      expect.arrayContaining([
        { path: "/de/", placement: "hero-freelance", locale: "de" },
        { path: "/en/", placement: "hero-coaching", locale: "en" },
        { path: "/de/app-entwickeln-freelancer/", placement: "cta", locale: "de" },
      ]),
    );
  });
});

describe("buildSchedulingClickPayload", () => {
  it.each(INSTRUMENTED_SCHEDULING_CLICKS)(
    "builds scheduling_click for $placement on $path",
    ({ path, placement, locale }) => {
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
  it("keepalive fetch posts JSON with ingest key in header (not query)", async () => {
    const fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    const send = createSchedulingClickSender({
      fetch,
      ingestKey: "site-key",
      endpoint: "/api/events",
    });

    const ok = send(
      buildSchedulingClickPayload("/de/", "hero-freelance", "de"),
    );

    expect(ok).toBe(true);
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/events");
    expect(init.method).toBe("POST");
    expect(init.keepalive).toBe(true);
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      [ANALYTICS_INGEST_HEADER]: "site-key",
    });
    expect(init.body).toBe(
      JSON.stringify({
        type: "scheduling_click",
        path: "/de/",
        placement: "hero-freelance",
        locale: "de",
      }),
    );
  });
});
