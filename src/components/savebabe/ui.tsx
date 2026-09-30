import type { ReactNode } from "react";
import { ChevronLeft, Home, HeartPulse, CalendarDays, Baby, User, Lock } from "lucide-react";
import { useSB, type Screen } from "@/lib/savebabe-store";
import { cn } from "@/lib/utils";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className={cn("font-display font-extrabold tracking-tight flex items-center gap-2", size === "lg" ? "text-4xl" : "text-2xl")}>
      <span className="grid place-items-center rounded-full bg-accent text-pink h-9 w-9">♥</span>
      <span><span className="text-primary">Save</span><span className="text-pink">Babe</span></span>
    </div>
  );
}

export function Header({ title, sub, back }: { title: string; sub?: string; back?: Screen }) {
  const { go } = useSB();
  return (
    <div className="mb-6">
      {back && (
        <button onClick={() => go(back)} className="mb-3 -ml-2 flex items-center gap-1 text-sm text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Retour
        </button>
      )}
      <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
      {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", className, disabled }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "outline" | "danger"; className?: string; disabled?: boolean;
}) {
  return (
    <button disabled={disabled} onClick={onClick} className={cn(
      "w-full rounded-full py-3.5 font-semibold transition active:scale-[0.98] disabled:opacity-50",
      variant === "primary" && "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      variant === "outline" && "border-2 border-primary text-primary bg-card",
      variant === "ghost" && "text-primary underline-offset-4 hover:underline",
      variant === "danger" && "bg-destructive text-destructive-foreground",
      className)}>{children}</button>
  );
}

export function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input {...p} className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      className={cn("relative h-7 w-12 shrink-0 rounded-full transition", on ? "bg-primary" : "bg-muted-foreground/30")}>
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card transition-all", on ? "left-6" : "left-1")} />
    </button>
  );
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} className={cn("rounded-3xl bg-card p-5 shadow-sm border border-border", onClick && "cursor-pointer", className)}>{children}</div>;
}

export function Steps({ n }: { n: number }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-2">Étape {n} sur 4</p>
      <div className="flex gap-1.5">{[1, 2, 3, 4].map((i) => <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= n ? "bg-primary" : "bg-muted")} />)}</div>
    </div>
  );
}

export function Private({ text = "Vos données restent privées" }: { text?: string }) {
  return <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" />{text}</p>;
}

const tabs: { s: Screen; label: string; Icon: typeof Home; match: Screen[] }[] = [
  { s: "home", label: "Accueil", Icon: Home, match: ["home", "ready", "chat", "voice", "import", "ocr", "confirm", "invite", "emergency"] },
  { s: "tracking", label: "Grossesse", Icon: HeartPulse, match: ["tracking", "metrics"] },
  { s: "appointments", label: "Rendez-vous", Icon: CalendarDays, match: ["appointments"] },
  { s: "baby", label: "Bébé", Icon: Baby, match: ["baby", "babyCreate"] },
  { s: "profile", label: "Profil", Icon: User, match: ["profile", "offline", "language", "theme", "aiPrivacy"] },
];

export function TabBar() {
  const { screen, go, s } = useSB();
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.match.includes(screen);
          return (
            <button key={t.s} onClick={() => go(t.s === "baby" && !s.baby ? "babyCreate" : t.s)}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px]", active ? "text-primary font-semibold" : "text-muted-foreground")}>
              <t.Icon className="h-5 w-5" />{t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
