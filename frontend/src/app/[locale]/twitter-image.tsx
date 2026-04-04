import { ImageResponse } from "next/og";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  const isEn = isLocale(l) && l === "en";

  const subtitle = isEn
    ? "Freelance Senior Full-Stack · Mobile — web apps, apps, cloud"
    : "Freelance Senior Full-Stack · Mobile — Webapps, Apps, Cloud";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(145deg, #fafaf9 0%, #e7e5e4 55%, #d6d3d1 100%)",
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 600,
            color: "#0c0a09",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Hannes Duve
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#44403c",
            maxWidth: 920,
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: "#4f46e5",
            fontWeight: 600,
          }}
        >
          hannesduve.com · DACH
        </div>
      </div>
    ),
    { ...size },
  );
}
