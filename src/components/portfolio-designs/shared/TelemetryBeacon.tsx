"use client";

import * as React from "react";

interface TelemetryBeaconProps {
  username: string;
}

export function TelemetryBeacon({ username }: TelemetryBeaconProps) {
  React.useEffect(() => {
    if (!username || typeof window === "undefined") return;

    // Send a non-blocking beacon request
    const payload = JSON.stringify({
      referrer: document.referrer || null,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(`/api/view/${encodeURIComponent(username)}`, blob);
      } else {
        fetch(`/api/view/${encodeURIComponent(username)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Ignore network errors on view telemetry
        });
      }
    } catch {
      // Beacon failed safely
    }
  }, [username]);

  return null;
}
