import { useEffect, useState } from "react";

export type PlatformMode = "mobile" | "desktop";

const DESKTOP_BREAKPOINT_PX = 1024;

function normalizePlatformValue(value: string | null): PlatformMode | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "desktop" || normalized === "web") return "desktop";
  if (normalized === "mobile") return "mobile";
  return null;
}

function getHashQueryParam(key: string): string | null {
  const hash = window.location.hash || "";
  const queryStart = hash.indexOf("?");
  if (queryStart < 0) return null;
  const hashQuery = hash.slice(queryStart + 1);
  return new URLSearchParams(hashQuery).get(key);
}

function resolvePlatformMode(): PlatformMode {
  if (typeof window === "undefined") return "mobile";

  const hashPlatform = normalizePlatformValue(getHashQueryParam("platform"));
  if (hashPlatform) return hashPlatform;

  const urlPlatform = normalizePlatformValue(new URLSearchParams(window.location.search).get("platform"));
  if (urlPlatform) return urlPlatform;

  return window.innerWidth >= DESKTOP_BREAKPOINT_PX ? "desktop" : "mobile";
}

export default function usePlatformMode(): PlatformMode {
  const [mode, setMode] = useState<PlatformMode>(() => resolvePlatformMode());

  useEffect(() => {
    const syncMode = () => setMode(resolvePlatformMode());

    syncMode();
    window.addEventListener("hashchange", syncMode);
    window.addEventListener("popstate", syncMode);
    window.addEventListener("resize", syncMode);

    return () => {
      window.removeEventListener("hashchange", syncMode);
      window.removeEventListener("popstate", syncMode);
      window.removeEventListener("resize", syncMode);
    };
  }, []);

  return mode;
}
