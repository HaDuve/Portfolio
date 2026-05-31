import {
  buildGoogleAdsConversionScript,
  buildGoogleAdsGtagInitScript,
  parseGoogleAdsConversionSendTo,
  parseGoogleAdsId,
} from "@/lib/google-ads";

const googleAdsId = parseGoogleAdsId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
const conversionSendTo = parseGoogleAdsConversionSendTo(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO,
);

/**
 * Google Ads gtag in static HTML — required for Google's tag verification crawler.
 * Loads only when NEXT_PUBLIC_GOOGLE_ADS_ID is set at build time.
 */
export function GoogleAdsTag() {
  if (!googleAdsId) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: buildGoogleAdsGtagInitScript(googleAdsId),
        }}
      />
      {conversionSendTo ? (
        <script
          dangerouslySetInnerHTML={{
            __html: buildGoogleAdsConversionScript(conversionSendTo),
          }}
        />
      ) : null}
    </>
  );
}
