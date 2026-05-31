import { describe, expect, it } from "vitest";
import {
  buildGoogleAdsConversionScript,
  buildGoogleAdsGtagInitScript,
  isModifiedClick,
  parseGoogleAdsConversionSendTo,
  parseGoogleAdsId,
  shouldInterceptForGoogleAdsConversion,
} from "./google-ads";

describe("parseGoogleAdsId", () => {
  it("accepts a valid AW- id", () => {
    expect(parseGoogleAdsId(" AW-18200085007 ")).toBe("AW-18200085007");
  });

  it("rejects malformed ids", () => {
    expect(parseGoogleAdsId("G-123")).toBeNull();
    expect(parseGoogleAdsId("AW-18200085007';alert(1)//")).toBeNull();
  });
});

describe("parseGoogleAdsConversionSendTo", () => {
  it("accepts a valid conversion label", () => {
    expect(
      parseGoogleAdsConversionSendTo(
        " AW-18200085007/ShbKCOS6rrYcEI-EveZD ",
      ),
    ).toBe("AW-18200085007/ShbKCOS6rrYcEI-EveZD");
  });

  it("rejects malformed send_to values", () => {
    expect(parseGoogleAdsConversionSendTo("AW-123")).toBeNull();
    expect(parseGoogleAdsConversionSendTo("evil")).toBeNull();
  });
});

describe("buildGoogleAdsConversionScript", () => {
  it("includes a timeout fallback so navigation still happens when gtag stalls", () => {
    const script = buildGoogleAdsConversionScript(
      "AW-18200085007/ShbKCOS6rrYcEI-EveZD",
    );

    expect(script).toContain("setTimeout(redirect, 1000)");
    expect(script).toContain("event_callback");
    expect(script).toContain("'currency': 'THB'");
  });

  it("redirects immediately when gtag is unavailable", () => {
    const script = buildGoogleAdsConversionScript(
      "AW-18200085007/ShbKCOS6rrYcEI-EveZD",
    );

    expect(script).toContain("typeof gtag !== 'function'");
  });
});

describe("buildGoogleAdsGtagInitScript", () => {
  it("configures the parsed ads id", () => {
    expect(buildGoogleAdsGtagInitScript("AW-18200085007")).toContain(
      "gtag('config', 'AW-18200085007')",
    );
  });
});

describe("isModifiedClick", () => {
  it("treats primary unmodified clicks as normal", () => {
    expect(
      isModifiedClick({
        defaultPrevented: false,
        button: 0,
        metaKey: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      }),
    ).toBe(false);
  });

  it("skips modified or non-primary clicks", () => {
    expect(isModifiedClick({ button: 0, metaKey: true })).toBe(true);
    expect(isModifiedClick({ button: 1, metaKey: false })).toBe(true);
  });
});

describe("shouldInterceptForGoogleAdsConversion", () => {
  it("intercepts only normal clicks when conversion reporting is enabled", () => {
    expect(
      shouldInterceptForGoogleAdsConversion(
        { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false },
        true,
      ),
    ).toBe(true);

    expect(
      shouldInterceptForGoogleAdsConversion(
        { button: 0, metaKey: true, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false },
        true,
      ),
    ).toBe(false);

    expect(
      shouldInterceptForGoogleAdsConversion(
        { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false },
        false,
      ),
    ).toBe(false);
  });
});
