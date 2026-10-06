import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * Modern React 19 hook to check if component is mounted on the client.
 * Uses useSyncExternalStore to eliminate cascading renders and hydration mismatch.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
