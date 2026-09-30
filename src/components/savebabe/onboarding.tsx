import { useEffect, useState } from "react";
import { Check, Lock, ShieldCheck, Pause, Play, Sparkles, MessageCircle, Camera, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useSB, weeksOf, dueDate } from "@/lib/savebabe-store";
import { Btn, Field, Header, Logo, Steps, Toggle, Card, Private } from "./ui";
import { cn } from "@/lib/utils";

export function Welcome() {
  const { go } = useSB();
  return (
    <div className="flex min-h-[90vh] flex-col justify-between pt-10">
      <div className="flex justify-center"><Logo size="lg" /></div>
      <div className="relative mx-auto my-8 grid h-56 w-56 place-items-center rounded-full bg-gradient-to-br from-secondary to-accent">
        <span className="text-8xl">🤰🏾</span>
        <span className="absolute right-4 top-6 text-3xl text-pink animate-pulse">♥</span>
      </div>
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold leading-tight">Votre grossesse, votre tranquillité.</h1>
        <p className="mt-3 text-muted-foreground">Un accompagnement simple, privé et accessible, même sans internet.</p>
      </div>
      <div className="mt-8 space-y-3">
        <Btn onClick={() => go("signup")}>Créer un compte</Btn>
        <Btn variant="outline" onClick={() => go("signup")}>Se connecter</Btn>
        <Btn variant="ghost" onClick={() => go("language")}>Découvrir l'application ›</Btn>
      </div>
      <Private />
    </div>
  );
}

export function Signup() {
  const { s, set, go } = useSB();
  const [name, setName] = useState(s.name);
  const [contact, setContact] = useState(s.contact);
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const valid = name.trim() && contact.trim() && pw.length >= 6 && ok;
  return (
    <div className="pt-4">
      <Header title="Créer votre compte" back="welcome" />
      <Steps n={1} />
      <Field label="Prénom" value={name} onChange={(e) => setName(e.target.value)} placeholder="Grâce" />
      <Field label="Adresse e-mail ou numéro de téléphone" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+225 07 00 00 00" />
      <Field label="Créer un mot de passe" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6 caractères minimum" />
      <label className="mb-6 flex items-center gap-3 text-sm">
        <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="h-5 w-5 accent-[var(--primary)]" />
        J'accepte les <span className="text-primary underline">conditions de confidentialité</span>
      </label>
      <Btn disabled={!valid} onClick={() => { set({ name: name.trim(), contact }); go("pregnancy"); }}>Continuer</Btn>
      <Private text="Vos informations sont chiffrées" />
    </div>
  );
}

export function Pregnancy() {
  const { s, set, go } = useSB();
  const [lmp, setLmp] = useState(s.lmp);
  const [first, setFirst] = useState(s.firstPregnancy);
  const [center, setCenter] = useState(s.center);
  return (
    <div className="pt-4">
      <Header title="Votre profil grossesse" back="signup" />
      <Steps n={2} />
      <Field label="Date des dernières règles" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
      <div className="mb-4 rounded-2xl bg-secondary p-4">
        <p className="text-sm font-semibold">Date prévue d'accouchement</p>
        <p className="font-display text-2xl font-bold text-primary">{dueDate(lmp) || "—"}</p>
        {lmp && <p className="text-sm text-muted-foreground">{weeksOf(lmp)} semaines de grossesse</p>}
      </div>
      <p className="mb-2 text-sm font-semibold">Est-ce votre première grossesse ?</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {([["oui", "Oui"], ["non", "Non"], ["nsp", "Je ne sais pas"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFirst(k)} className={cn("rounded-2xl border py-3 text-sm", first === k ? "border-primary bg-secondary font-semibold text-primary" : "border-input bg-card")}>{l}</button>
        ))}
      </div>
      <Field label="Centre de santé préféré" value={center} onChange={(e) => setCenter(e.target.value)} placeholder="CHU de Cocody" />
      <Btn disabled={!lmp} onClick={() => { set({ lmp, firstPregnancy: first, center }); go("consent"); }}>Continuer</Btn>
      <Btn variant="ghost" className="mt-2" onClick={() => { set({ lmp, firstPregnancy: first, center }); toast.success("Enregistré pour plus tard"); go("consent"); }}>Enregistrer pour plus tard</Btn>
    </div>
  );
}

export function Consent() {
  const { s, set, go } = useSB();
  const c = s.consent;
  const rows = [
    { k: "health", t: "Données de santé", d: "Stockage sécurisé et chiffré", req: true },
    { k: "ai", t: "Assistant IA", d: "Utiliser uniquement les informations nécessaires" },
    { k: "offline", t: "Mode hors connexion", d: "Télécharger les contenus autorisés" },
    { k: "share", t: "Partager avec un proche", d: "Jamais sans votre accord" },
  ] as const;
  return (
    <div className="pt-4">
      <Header title="Vos choix de confidentialité" back="pregnancy" />
      <Steps n={3} />
      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.k} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold">{r.t}</p>
              <p className="text-sm text-muted-foreground">{r.d}</p>
              <p className={cn("mt-1 text-xs font-semibold", "req" in r ? "text-pink" : "text-muted-foreground")}>{"req" in r ? "Requis" : "Optionnel"}</p>
            </div>
            <Toggle on={c[r.k]} onChange={(v) => !("req" in r) && set({ consent: { ...c, [r.k]: v } })} />
          </Card>
        ))}
      </div>
      <p className="my-4 text-center text-sm text-muted-foreground">Modifiable plus tard dans Profil</p>
      <Btn onClick={() => go("sync")}>Continuer</Btn>
    </div>
  );
}

export function Sync() {
  const { go } = useSB();
  const items = ["Conseils de la semaine", "Suivi de grossesse", "Questions fréquentes", "Rendez-vous", "Suivi du bébé"];
  const [done, setDone] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || done >= items.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 700);
    return () => clearTimeout(t);
  }, [done, paused]);
  useEffect(() => { if (done < items.length) return; const t = setTimeout(() => go("ready"), 800); return () => clearTimeout(t); }, [done]);
  return (
    <div className="pt-6">
      <Steps n={4} />
      <Header title="Préparer votre espace hors connexion" sub="Téléchargement en arrière-plan" />
      <Card className="space-y-4">
        {items.map((it, i) => (
          <div key={it} className="flex items-center justify-between">
            <span className={i < done ? "" : "text-muted-foreground"}>{it}</span>
            {i < done ? <span className="grid h-6 w-6 place-items-center rounded-full bg-success text-primary-foreground"><Check className="h-4 w-4" /></span>
              : i === done ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <span className="h-5 w-5 rounded-full border-2 border-muted" />}
          </div>
        ))}
        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(done / items.length) * 100}%` }} /></div>
      </Card>
      <p className="mt-4 text-sm text-muted-foreground">Seul le contenu autorisé et essentiel à votre suivi est téléchargé.</p>
      <Card className="mt-4 flex items-center gap-3 bg-success-soft">
        <ShieldCheck className="h-6 w-6 text-success" />
        <div><p className="font-semibold">Synchronisation sécurisée</p><p className="text-sm text-muted-foreground">Vous pouvez continuer à utiliser l'application</p></div>
      </Card>
      <Btn variant="outline" className="mt-5" onClick={() => setPaused(!paused)}>
        {paused ? <><Play className="mr-1 inline h-4 w-4" /> Reprendre</> : <><Pause className="mr-1 inline h-4 w-4" /> Mettre en pause</>}
      </Btn>
    </div>
  );
}

export function Ready() {
  const { s, set, go } = useSB();
  const finish = (to: Parameters<typeof go>[0]) => { set({ onboarded: true }); go(to); };
  return (
    <div className="pt-6">
      <Header title={`Bonjour, ${s.name || "Grâce"}`} sub="Votre espace est prêt" />
      <Card className="mb-4 bg-gradient-to-br from-primary to-pink text-primary-foreground border-0">
        <p className="font-display text-5xl font-bold">{weeksOf(s.lmp)}</p>
        <p>semaines de grossesse</p>
      </Card>
      <Card className="mb-4 flex items-center gap-3"><Check className="h-5 w-5 text-success" /><div><p className="font-semibold">Contenus disponibles hors connexion</p><p className="text-sm text-muted-foreground">Téléchargement terminé</p></div></Card>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[{ I: Sparkles, t: "Assistant SaveBabe", to: "aiPrivacy" }, { I: MessageCircle, t: "Poser une question", to: "chat" }, { I: Camera, t: "Importer mon carnet", to: "import" }].map((x) => (
          <Card key={x.t} onClick={() => finish(x.to as never)} className="p-3 text-center"><x.I className="mx-auto mb-2 h-6 w-6 text-primary" /><p className="text-xs font-semibold">{x.t}</p></Card>
        ))}
      </div>
      <Btn variant="outline" className="mb-3" onClick={() => finish("invite")}><UserPlus className="mr-1 inline h-4 w-4" /> Inviter une personne de confiance</Btn>
      <Btn onClick={() => finish("home")}>Continuer</Btn>
      <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Chiffré sur votre appareil</p>
    </div>
  );
}
