import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card, generated at build time (inherited by every route).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #171513 0%, #2C2825 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 46, fontWeight: 800 }}>
          BlitzDeep
          <span style={{ color: "#F1592A", marginLeft: 6 }}>{">"}</span>
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 44,
            maxWidth: 940,
          }}
        >
          Websites, AI Automation &amp; Social Media Marketing
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 28 }}>
          Strategy, design &amp; performance — unified for measurable ROI.
        </div>
      </div>
    ),
    { ...size }
  );
}
