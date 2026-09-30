import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SaveBabeProvider, useSB, type Screen } from "@/lib/savebabe-store";
import { TabBar } from "@/components/savebabe/ui";
import * as O from "@/components/savebabe/onboarding";
import * as M from "@/components/savebabe/main";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SaveBabe — Grossesse et bébé, même sans internet" },
      { name: "description", content: "Suivi de grossesse et du nouveau-né privé, chiffré, hors connexion et en langues africaines." },
      { property: "og:title", content: "SaveBabe — Grossesse et bébé" },
      { property: "og:description", content: "Accompagnement mère-bébé panafricain : assistant, rendez-vous, alertes, hors connexion." },
    ],
  }),
  component: () => <SaveBabeProvider><App /></SaveBabeProvider>,
});

const map: Record<Screen, () => React.ReactNode> = {
  welcome: O.Welcome, signup: O.Signup, pregnancy: O.Pregnancy, consent: O.Consent, sync: O.Sync, ready: O.Ready,
  import: M.ImportBook, ocr: M.OCR, confirm: M.Confirm, aiPrivacy: M.AIPrivacy, voice: M.Voice, home: M.HomeScreen,
  chat: M.Chat, invite: M.Invite, tracking: M.Tracking, metrics: M.Metrics, appointments: M.Appointments,
  emergency: M.Emergency, babyCreate: M.BabyCreate, baby: M.BabyTrack, profile: M.Profile, offline: M.Offline,
  language: M.Language, theme: M.Theme,
};
const noTabs: Screen[] = ["welcome", "signup", "pregnancy", "consent", "sync", "ready"];

function App() {
  const { screen, s } = useSB();
  const C = map[screen];
  const tabs = !noTabs.includes(screen) && !(screen === "language" && !s.onboarded);
  return (
    <div className="min-h-screen bg-muted/40">
      <main key={screen} className="mx-auto min-h-screen max-w-md bg-background px-5 pb-28 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <C />
      </main>
      {tabs && <TabBar />}
      <Toaster position="top-center" />
    </div>
  );
}
