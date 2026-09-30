import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Screen =
  | "welcome" | "signup" | "pregnancy" | "consent" | "sync" | "ready"
  | "import" | "ocr" | "confirm" | "aiPrivacy" | "voice" | "home" | "chat"
  | "invite" | "tracking" | "metrics" | "appointments" | "emergency"
  | "babyCreate" | "baby" | "profile" | "offline" | "language" | "theme";

export type Appointment = { id: string; title: string; date: string; time: string; place: string };
export type Measure = { id: string; kind: "poids" | "tension" | "glycemie"; value: string; date: string };

export type State = {
  name: string; contact: string;
  lmp: string; firstPregnancy: "oui" | "non" | "nsp"; center: string;
  consent: { health: boolean; ai: boolean; offline: boolean; share: boolean };
  aiPrivacy: { history: boolean; anonymize: boolean; medical: boolean };
  appointments: Appointment[];
  measures: Measure[];
  record: { label: string; value: string }[];
  partner: { name: string; phone: string } | null;
  baby: { name: string; birth: string; weight: string; sex: string } | null;
  babyLog: { id: string; kind: string; at: string }[];
  country: string; language: string;
  theme: "light" | "dark" | "system";
  onboarded: boolean;
};

const initial: State = {
  name: "", contact: "", lmp: "", firstPregnancy: "oui", center: "",
  consent: { health: true, ai: true, offline: true, share: false },
  aiPrivacy: { history: false, anonymize: true, medical: false },
  appointments: [
    { id: "1", title: "Consultation prénatale", date: "2026-10-12", time: "09:30", place: "Centre de santé" },
    { id: "2", title: "Échographie", date: "2026-10-28", time: "14:00", place: "Hôpital régional" },
  ],
  measures: [],
  record: [],
  partner: null, baby: null, babyLog: [],
  country: "Côte d'Ivoire", language: "Français",
  theme: "light", onboarded: false,
};

const KEY = "savebabe-state-v1";
type Ctx = { s: State; set: (p: Partial<State>) => void; screen: Screen; go: (s: Screen) => void; reset: () => void };
const C = createContext<Ctx | null>(null);

export function SaveBabeProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = { ...initial, ...JSON.parse(raw) } as State;
        setS(v);
        if (v.onboarded) setScreen("home");
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, loaded]);
  useEffect(() => {
    const dark = s.theme === "dark" || (s.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }, [s.theme]);

  return (
    <C.Provider value={{
      s, set: (p) => setS((o) => ({ ...o, ...p })), screen,
      go: (x) => { setScreen(x); window.scrollTo(0, 0); },
      reset: () => { localStorage.removeItem(KEY); setS(initial); setScreen("welcome"); },
    }}>{children}</C.Provider>
  );
}
export const useSB = () => { const c = useContext(C); if (!c) throw new Error("no provider"); return c; };

export function weeksOf(lmp: string) {
  if (!lmp) return 24;
  const d = (Date.now() - new Date(lmp).getTime()) / 86400000;
  return Math.max(1, Math.min(42, Math.floor(d / 7)));
}
export function dueDate(lmp: string) {
  if (!lmp) return "";
  const d = new Date(lmp); d.setDate(d.getDate() + 280);
  return d.toLocaleDateString("fr-FR");
}
