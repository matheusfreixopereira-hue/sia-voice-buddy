import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type SiaSettings } from "@/types/sia";

const KEY = "sia.settings.v1";

export function useSettings() {
  const [settings, setSettings] = useState<SiaSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SiaSettings>) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);
    root.classList.toggle("dark", dark);
  }, [settings]);

  const update = useCallback((patch: Partial<SiaSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, update };
}
