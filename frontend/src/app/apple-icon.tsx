import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #4f46e5 0%, #312e81 100%)",
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 600,
          fontFamily: "ui-serif, Georgia, serif",
        }}
      >
        HD
      </div>
    ),
    { ...size },
  );
}
