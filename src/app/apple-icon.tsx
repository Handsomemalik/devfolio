import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: "linear-gradient(135deg, #4338CA 0%, #06B6D4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 36,
          fontWeight: 900,
          fontFamily: "sans-serif",
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.2)",
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    }
  );
}
