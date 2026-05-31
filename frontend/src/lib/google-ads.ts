declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtag_report_conversion?: (
      url?: string,
      openInNewTab?: boolean,
    ) => boolean;
  }
}

const GOOGLE_ADS_ID_RE = /^AW-\d+$/;
const CONVERSION_SEND_TO_RE = /^AW-\d+\/[\w-]+$/;

export type ClickLike = Pick<
  MouseEvent,
  "defaultPrevented" | "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey"
>;

export function parseGoogleAdsId(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed || !GOOGLE_ADS_ID_RE.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function parseGoogleAdsConversionSendTo(
  raw: string | undefined,
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed || !CONVERSION_SEND_TO_RE.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function buildGoogleAdsGtagInitScript(googleAdsId: string): string {
  return `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAdsId}');
          `;
}

export function buildGoogleAdsConversionScript(conversionSendTo: string): string {
  return `
              function gtag_report_conversion(url, openInNewTab) {
                var redirected = false;
                var redirect = function () {
                  if (redirected) return;
                  redirected = true;
                  if (typeof url !== 'undefined') {
                    if (openInNewTab) {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location = url;
                    }
                  }
                };
                if (typeof gtag !== 'function') {
                  redirect();
                  return false;
                }
                gtag('event', 'conversion', {
                  'send_to': '${conversionSendTo}',
                  'value': 1.0,
                  'currency': 'THB',
                  'event_callback': redirect
                });
                setTimeout(redirect, 1000);
                return false;
              }
            `;
}

/** Skip modified clicks so browser default (new tab, etc.) still works. */
export function isModifiedClick(event: ClickLike): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/** Scheduling clicks only — do not intercept modified clicks or when ads conversion is off. */
export function shouldInterceptForGoogleAdsConversion(
  event: ClickLike,
  conversionEnabled: boolean,
): boolean {
  return conversionEnabled && !isModifiedClick(event);
}
