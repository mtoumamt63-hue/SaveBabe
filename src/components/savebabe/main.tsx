import { useEffect, useRef, useState } from "react";
import { Bell, Sparkles, Send, Mic, MicOff, Phone, CalendarDays, HeartPulse, Baby, Camera, Upload, Trash2, Plus, AlertTriangle, Lock, WifiOff, Globe, Moon, Sun, Monitor, ChevronRight, ShieldCheck, UserPlus, LogOut, Download, Droplet, Moon as Sleep, Milk } from "lucide-react";
import { toast } from "sonner";
import { useSB, weeksOf, dueDate, type Screen } from "@/lib/savebabe-store";
import { Btn, Card, Field, Header, Logo, Private, Toggle } from "./ui";
import { cn } from "@/lib/utils";

/* ---------- Offline assistant knowledge base ---------- */
const KB: { k: string[]; a: string }[] = [
  { k: ["dos", "mal au dos", "lombaire"], a: "Le mal de dos est fréquent pendant la grossesse car le ventre modifie votre posture. Reposez-vous sur le côté, portez des chaussures plates et évitez de porter des charges lourdes. Si la douleur est intense ou accompagnée de contractions, consultez." },
  { k: ["aliment", "manger", "nourriture", "nutrition"], a: "Privilégiez les légumes verts (feuilles de manioc, gombo), les légumineuses (haricots, niébé), le poisson bien cuit, les fruits et les céréales. Buvez de l'eau potable. Évitez la viande crue, l'alcool et limitez le café." },
  { k: ["paludisme", "moustique", "palu"], a: "Dormez sous une moustiquaire imprégnée chaque nuit. Le traitement préventif (TPI) est proposé lors des consultations prénatales. En cas de fièvre, consultez rapidement." },
  { k: ["nausée", "vomi"], a: "Les nausées sont courantes au premier trimestre. Mangez de petites quantités souvent, buvez par petites gorgées. Si vous ne gardez rien, consultez." },
  { k: ["saign", "sang"], a: "⚠️ Un saignement pendant la grossesse nécessite de consulter rapidement un professionnel de santé. Utilisez le bouton Urgence si besoin." },
  { k: ["bouge", "mouvement", "coup de pied"], a: "À partir de 20 semaines, vous sentez bébé bouger. Si les mouvements diminuent nettement, allongez-vous sur le côté gauche et comptez ; si moins de 10 mouvements en 2 h, consultez." },
  { k: ["sport", "marche", "exercice"], a: "La marche quotidienne de 30 minutes est excellente. Évitez les sports à risque de chute ou de choc." },
];
function answer(q: string) {
  const l = q.toLowerCase();
  const hit = KB.find((e) => e.k.some((k) => l.includes(k)));
  return hit?.a ?? "Je n'ai pas encore de réponse enregistrée pour cette question. Notez-la pour votre prochaine consultation, ou parlez-en à votre sage-femme. En cas de doute, contactez un professionnel de santé.";
}

/* ---------- 12 Home ---------- */
export function HomeScreen() {
  const { s, go } = useSB();
  const [q, setQ] = useState("");
  const ask = (text: string) => { sessionStorage.setItem("sb-q", text); go("chat"); };
  return (
    <div className="pt-4">
      <div className="mb-5 flex items-center justify-between"><Logo /><button onClick={() => go("emergency")} className="relative grid h-10 w-10 place-items-center rounded-full bg-accent text-pink"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-destructive" /></button></div>
      <h1 className="font-display text-3xl font-bold">Bonjour, {s.name || "Grâce"}</h1>
      <p className="text-muted-foreground">{weeksOf(s.lmp)} semaines de grossesse</p>
      <div className="my-4 flex gap-2">
        <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"><Download className="h-3.5 w-3.5" /> Hors connexion</span>
        <span className="flex items-center gap-1 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success"><Lock className="h-3.5 w-3.5" /> Données chiffrées</span>
      </div>
      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary"><Sparkles className="h-5 w-5" /></span><p className="font-display text-lg font-bold text-primary">Assistant SaveBabe</p>
          <button onClick={() => go("voice")} className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary" aria-label="Assistant vocal"><Mic className="h-4 w-4" /></button></div>
        <p className="mb-3 rounded-2xl bg-muted p-3 text-sm">Bonjour {s.name || "Grâce"}, comment puis-je vous aider aujourd'hui ?</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {["Est-ce normal d'avoir mal au dos ?", "Quels aliments privilégier ?"].map((x) => <button key={x} onClick={() => ask(x)} className="rounded-full border border-primary px-3 py-1.5 text-sm text-primary">{x}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q); }} className="flex items-center gap-2 rounded-full border border-input p-1 pl-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Écrivez votre question…" className="flex-1 bg-transparent outline-none text-sm" />
          <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
        </form>
      </Card>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[{ I: HeartPulse, t: "Suivi de grossesse", to: "tracking", c: "bg-secondary text-primary" }, { I: CalendarDays, t: "Mes rendez-vous", to: "appointments", c: "bg-accent text-accent-foreground" }, { I: Baby, t: "Suivi du bébé", to: s.baby ? "baby" : "babyCreate", c: "bg-success-soft text-success" }].map((x) => (
          <button key={x.t} onClick={() => go(x.to as Screen)} className={cn("rounded-3xl p-4 text-center", x.c)}><x.I className="mx-auto mb-2 h-7 w-7" /><p className="text-xs font-bold">{x.t}</p></button>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card onClick={() => go("import")} className="flex items-center gap-2 p-4"><Camera className="h-5 w-5 text-primary" /><span className="text-sm font-semibold">Importer mon carnet</span></Card>
        <Card onClick={() => go("invite")} className="flex items-center gap-2 p-4"><UserPlus className="h-5 w-5 text-pink" /><span className="text-sm font-semibold">Inviter un proche</span></Card>
      </div>
      <Card onClick={() => go("emergency")} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-destructive text-destructive-foreground"><Phone className="h-5 w-5" /></span><span className="flex-1 font-semibold">En cas d'urgence</span><ChevronRight className="h-5 w-5 text-muted-foreground" /></Card>
      <Private text="Vos données restent privées et protégées" />
    </div>
  );
}

/* ---------- 13 Chat ---------- */
export function Chat() {
  const { s, go } = useSB();
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: `Bonjour ${s.name || "Grâce"} ! Je réponds à vos questions éducatives, même sans internet. Je ne remplace pas un professionnel de santé.` }]);
  const [q, setQ] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const send = (t: string) => {
    setMsgs((m) => [...m, { me: true, t }]);
    setTimeout(() => setMsgs((m) => [...m, { me: false, t: answer(t) }]), 600);
  };
  useEffect(() => { const p = sessionStorage.getItem("sb-q"); if (p) { sessionStorage.removeItem("sb-q"); send(p); } }, []);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);
  return (
    <div className="pt-4">
      <Header title="Assistant grossesse" sub="● Disponible hors connexion" back="home" />
      <div className="space-y-3 pb-40">
        {msgs.map((m, i) => <div key={i} className={cn("max-w-[85%] rounded-3xl px-4 py-3 text-sm", m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-card border border-border")}>{m.t}</div>)}
        <div ref={end} />
      </div>
      <div className="fixed bottom-16 left-1/2 w-full max-w-md -translate-x-1/2 bg-background px-5 pb-3 pt-2">
        <div className="mb-2 flex gap-2 overflow-x-auto">{["Paludisme", "Nausées", "Bébé bouge moins", "Sport"].map((x) => <button key={x} onClick={() => send(x)} className="shrink-0 rounded-full border border-primary px-3 py-1 text-xs text-primary">{x}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) { send(q); setQ(""); } }} className="flex items-center gap-2 rounded-full border border-input bg-card p-1 pl-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Écrivez votre question…" className="flex-1 bg-transparent text-sm outline-none" />
          <button type="button" onClick={() => go("voice")} className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary"><Mic className="h-4 w-4" /></button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
        </form>
        <button onClick={() => go("emergency")} className="mt-2 w-full text-center text-xs text-destructive underline">Besoin d'aide urgente ?</button>
      </div>
    </div>
  );
}

/* ---------- 11 Voice ---------- */
export function Voice() {
  const { go } = useSB();
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const rec = useRef<any>(null);
  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("La reconnaissance vocale n'est pas disponible sur cet appareil"); return; }
    const r = new SR(); r.lang = "fr-FR"; r.interimResults = true;
    r.onresult = (e: any) => setText(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => setListening(false);
    rec.current = r; r.start(); setListening(true); setReply("");
  };
  const stop = () => { rec.current?.stop(); setListening(false); if (text) { const a = answer(text); setReply(a); speak(a); } };
  const speak = (t: string) => { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(t); u.lang = "fr-FR"; speechSynthesis.speak(u); } };
  return (
    <div className="pt-4 text-center">
      <Header title="Assistant vocal" sub="Parlez dans votre langue" back="home" />
      <button onClick={listening ? stop : start} className={cn("mx-auto my-8 grid h-40 w-40 place-items-center rounded-full text-primary-foreground shadow-xl transition", listening ? "bg-pink animate-pulse scale-110" : "bg-primary")}>
        {listening ? <MicOff className="h-14 w-14" /> : <Mic className="h-14 w-14" />}
      </button>
      <p className="mb-4 text-muted-foreground">{listening ? "Je vous écoute… touchez pour arrêter" : "Touchez le micro pour parler"}</p>
      {text && <Card className="mb-3 text-left"><p className="text-xs text-muted-foreground">Vous</p><p>{text}</p></Card>}
      {reply && <Card className="mb-3 text-left bg-secondary"><p className="text-xs text-muted-foreground">Assistant</p><p className="text-sm">{reply}</p><Btn variant="ghost" onClick={() => speak(reply)}>🔊 Réécouter</Btn></Card>}
      <button onClick={() => go("emergency")} className="text-sm text-destructive underline">Besoin d'aide urgente ?</button>
    </div>
  );
}

/* ---------- 10 AI privacy ---------- */
export function AIPrivacy() {
  const { s, set, go } = useSB();
  const p = s.aiPrivacy;
  const rows = [
    { k: "anonymize", t: "Anonymiser mes questions", d: "Votre nom n'est jamais transmis" },
    { k: "history", t: "Garder l'historique", d: "Uniquement sur cet appareil" },
    { k: "medical", t: "Utiliser mon dossier médical", d: "Pour des réponses personnalisées" },
  ] as const;
  return (
    <div className="pt-4">
      <Header title="Confidentialité de l'assistant IA" sub="Vos données sensibles restent sous votre contrôle" back="profile" />
      <div className="space-y-3">{rows.map((r) => <Card key={r.k} className="flex items-center gap-4"><div className="flex-1"><p className="font-semibold">{r.t}</p><p className="text-sm text-muted-foreground">{r.d}</p></div><Toggle on={p[r.k]} onChange={(v) => set({ aiPrivacy: { ...p, [r.k]: v } })} /></Card>)}</div>
      <p className="my-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> L'IA ne reçoit que les informations nécessaires</p>
      <Btn onClick={() => { toast.success("Choix enregistrés"); go("chat"); }}>Enregistrer mes choix</Btn>
    </div>
  );
}

/* ---------- 07-09 Import / OCR / Confirm ---------- */
export function ImportBook() {
  const { go } = useSB();
  const input = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<string | null>(null);
  return (
    <div className="pt-4">
      <Header title="Importer mon carnet" sub="Prenez en photo une page de votre carnet de santé" back="home" />
      <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} />
      <Card className="mb-4 grid aspect-[3/4] place-items-center overflow-hidden border-2 border-dashed border-primary/40 bg-secondary p-0">
        {img ? <img src={img} alt="Carnet" className="h-full w-full object-cover" /> : <div className="text-center text-muted-foreground"><Camera className="mx-auto mb-2 h-12 w-12 text-primary" />Cadrez la page entière<br />avec une bonne lumière</div>}
      </Card>
      <div className="space-y-3">
        <Btn onClick={() => input.current?.click()}><Camera className="mr-1 inline h-4 w-4" /> {img ? "Reprendre la photo" : "Prendre une photo"}</Btn>
        {img && <Btn variant="outline" onClick={() => go("ocr")}><Upload className="mr-1 inline h-4 w-4" /> Analyser la photo</Btn>}
      </div>
      <Private text="Aucune donnée n'est envoyée sans votre accord" />
    </div>
  );
}

export function OCR() {
  const { go } = useSB();
  const [rows, setRows] = useState([
    { label: "Groupe sanguin", value: "O+" }, { label: "Tension", value: "12/8" }, { label: "Poids", value: "64 kg" },
    { label: "Hémoglobine", value: "11,2 g/dL" }, { label: "Dernière consultation", value: "02/09/2026" },
  ]);
  const [scanning, setScanning] = useState(true);
  useEffect(() => { const t = setTimeout(() => setScanning(false), 1500); return () => clearTimeout(t); }, []);
  if (scanning) return <div className="grid min-h-[70vh] place-items-center text-center"><div><div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" /><p className="font-semibold">Lecture du carnet sur votre appareil…</p></div></div>;
  return (
    <div className="pt-4">
      <Header title="Vérifier les informations" sub="Informations détectées — corrigez si besoin" back="import" />
      <div className="space-y-2">
        {rows.map((r, i) => (
          <Card key={i} className="flex items-center gap-2 p-3">
            <input value={r.label} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="w-1/2 bg-transparent text-sm text-muted-foreground outline-none" />
            <input value={r.value} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="flex-1 bg-transparent font-semibold outline-none" />
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
          </Card>
        ))}
      </div>
      <Btn variant="ghost" className="my-2" onClick={() => setRows([...rows, { label: "Nouvelle info", value: "" }])}><Plus className="mr-1 inline h-4 w-4" /> Ajouter une information</Btn>
      <Btn onClick={() => { sessionStorage.setItem("sb-ocr", JSON.stringify(rows)); go("confirm"); }}>Enregistrer dans mon dossier →</Btn>
      <Private text="Rien n'est enregistré sans votre validation" />
    </div>
  );
}

export function Confirm() {
  const { s, set, go } = useSB();
  const save = (share: boolean) => {
    const rows = JSON.parse(sessionStorage.getItem("sb-ocr") || "[]");
    set({ record: [...s.record, ...rows] });
    toast.success(share && s.partner ? `Enregistré et partagé avec ${s.partner.name}` : "Enregistré dans votre dossier");
    go("tracking");
  };
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <Card className="w-full text-center">
        <ShieldCheck className="mx-auto mb-3 h-14 w-14 text-primary" />
        <h1 className="mb-2 font-display text-2xl font-bold">Confirmer cette action</h1>
        <p className="mb-6 text-muted-foreground">Ces informations seront chiffrées et enregistrées dans votre dossier.</p>
        <div className="space-y-3">
          <Btn onClick={() => save(false)}>Enregistrer uniquement</Btn>
          <Btn variant="outline" disabled={!s.partner} onClick={() => save(true)}>Enregistrer et partager</Btn>
          <Btn variant="ghost" onClick={() => go("ocr")}>Annuler</Btn>
        </div>
        <Private />
      </Card>
    </div>
  );
}

/* ---------- 14 Invite ---------- */
export function Invite() {
  const { s, set, go } = useSB();
  const [name, setName] = useState(s.partner?.name ?? "");
  const [phone, setPhone] = useState(s.partner?.phone ?? "");
  return (
    <div className="pt-4">
      <Header title="Inviter une personne de confiance" sub="Suivre la même grossesse avec votre accord" back="home" />
      <Field label="Prénom" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kofi" />
      <Field label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 …" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="bg-success-soft p-4"><p className="mb-2 text-sm font-bold text-success">Il pourra voir</p><ul className="space-y-1 text-xs"><li>✓ Semaine de grossesse</li><li>✓ Rendez-vous</li><li>✓ Alertes urgence</li></ul></Card>
        <Card className="bg-accent p-4"><p className="mb-2 text-sm font-bold text-accent-foreground">Il ne pourra pas voir</p><ul className="space-y-1 text-xs"><li>✕ Conversations privées</li><li>✕ Notes personnelles</li><li>✕ Données médicales</li></ul></Card>
      </div>
      <Btn disabled={!name || !phone} onClick={() => { set({ partner: { name, phone } }); toast.success(`Invitation envoyée à ${name}`); go("home"); }}>Envoyer l'invitation</Btn>
      {s.partner && <Btn variant="ghost" className="mt-2 text-destructive" onClick={() => { set({ partner: null }); toast("Accès retiré"); }}>Retirer l'accès</Btn>}
      <p className="mt-3 text-center text-xs text-muted-foreground">Vous pouvez retirer l'accès à tout moment</p>
    </div>
  );
}

/* ---------- 15 Tracking ---------- */
const fruits = ["graine de pavot", "graine de sésame", "lentille", "myrtille", "framboise", "olive", "prune", "citron vert", "citron", "pêche", "pomme", "avocat", "oignon", "patate douce", "mangue", "banane", "grenade", "papaye", "maïs", "aubergine", "chou-fleur", "noix de coco", "ananas", "melon", "pastèque"];
export function Tracking() {
  const { s, go } = useSB();
  const w = weeksOf(s.lmp);
  const fruit = fruits[Math.min(fruits.length - 1, Math.max(0, Math.floor((w - 4) / 1.5)))];
  return (
    <div className="pt-4">
      <Header title="Suivi de grossesse" sub={`Accouchement prévu le ${dueDate(s.lmp) || "17/12/2026"}`} />
      <Card className="mb-4 border-0 bg-gradient-to-br from-secondary to-accent text-center">
        <p className="text-sm text-muted-foreground">Semaine</p>
        <p className="font-display text-6xl font-extrabold text-primary">{w}</p>
        <p className="mt-1">Bébé a la taille d'une <b>{fruit}</b></p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-card"><div className="h-full bg-pink" style={{ width: `${(w / 40) * 100}%` }} /></div>
        <p className="mt-1 text-xs text-muted-foreground">{w}/40 semaines · Trimestre {w < 14 ? 1 : w < 28 ? 2 : 3}</p>
      </Card>
      <Card className="mb-4"><p className="mb-2 font-bold">Conseil de la semaine</p><p className="text-sm text-muted-foreground">Buvez au moins 1,5 L d'eau potable par jour et dormez sous moustiquaire imprégnée. Continuez vos consultations prénatales.</p></Card>
      <p className="mb-2 font-bold">Chronologie</p>
      <div className="mb-4 space-y-2">{[w - 1, w, w + 1].map((x) => <Card key={x} className={cn("flex justify-between p-3", x === w && "border-primary")}><span>Semaine {x}</span><span className="text-sm text-muted-foreground">{x < w ? "✓ Terminée" : x === w ? "En cours" : "À venir"}</span></Card>)}</div>
      {s.record.length > 0 && <Card className="mb-4"><p className="mb-2 font-bold">Mon dossier</p>{s.record.map((r, i) => <div key={i} className="flex justify-between border-b border-border py-1.5 text-sm last:border-0"><span className="text-muted-foreground">{r.label}</span><b>{r.value}</b></div>)}</Card>}
      <Btn onClick={() => go("metrics")}>Mes indicateurs de santé</Btn>
    </div>
  );
}

/* ---------- 16 Metrics ---------- */
export function Metrics() {
  const { s, set } = useSB();
  const [kind, setKind] = useState<"poids" | "tension" | "glycemie">("poids");
  const [v, setV] = useState("");
  const [hist, setHist] = useState(false);
  const last = (k: string) => s.measures.filter((m) => m.kind === k).at(-1)?.value;
  const meta = { poids: { l: "Poids", u: "kg", p: "64" }, tension: { l: "Tension", u: "mmHg", p: "120/80" }, glycemie: { l: "Glycémie", u: "g/L", p: "0,9" } };
  return (
    <div className="pt-4">
      <Header title="Mes indicateurs" sub="Aujourd'hui" back="tracking" />
      <div className="mb-4 grid grid-cols-3 gap-3">
        {(Object.keys(meta) as (keyof typeof meta)[]).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={cn("rounded-3xl border p-3 text-center", kind === k ? "border-primary bg-secondary" : "border-border bg-card")}>
            <p className="text-xs text-muted-foreground">{meta[k].l}</p><p className="font-display text-xl font-bold">{last(k) ?? "—"}</p><p className="text-[10px] text-muted-foreground">{meta[k].u}</p>
          </button>
        ))}
      </div>
      <Card className="mb-4">
        <Field label={`Nouvelle mesure — ${meta[kind].l} (${meta[kind].u})`} value={v} onChange={(e) => setV(e.target.value)} placeholder={meta[kind].p} />
        <Btn disabled={!v} onClick={() => { set({ measures: [...s.measures, { id: crypto.randomUUID(), kind, value: v, date: new Date().toLocaleDateString("fr-FR") }] }); setV(""); toast.success("Mesure ajoutée"); }}>+ Ajouter une mesure</Btn>
      </Card>
      <Btn variant="ghost" onClick={() => setHist(!hist)}>{hist ? "Masquer" : "Voir"} l'historique</Btn>
      {hist && <div className="space-y-2">{s.measures.length === 0 ? <p className="text-center text-sm text-muted-foreground">Aucune mesure pour l'instant</p> : [...s.measures].reverse().map((m) => <Card key={m.id} className="flex justify-between p-3 text-sm"><span>{meta[m.kind].l} · {m.date}</span><b>{m.value} {meta[m.kind].u}</b></Card>)}</div>}
    </div>
  );
}

/* ---------- 17 Appointments ---------- */
export function Appointments() {
  const { s, set } = useSB();
  const [open, setOpen] = useState(false);
  const [a, setA] = useState({ title: "", date: "", time: "", place: s.center || "" });
  const sorted = [...s.appointments].sort((x, y) => x.date.localeCompare(y.date));
  return (
    <div className="pt-4">
      <Header title="Rendez-vous" sub={`${s.appointments.length} rendez-vous prévus`} />
      <div className="mb-4 space-y-3">
        {sorted.map((r) => {
          const d = new Date(r.date);
          return (
            <Card key={r.id} className="flex items-center gap-4">
              <div className="w-14 rounded-2xl bg-secondary py-2 text-center"><p className="font-display text-xl font-bold text-primary">{d.getDate()}</p><p className="text-xs uppercase">{d.toLocaleDateString("fr-FR", { month: "short" })}</p></div>
              <div className="flex-1"><p className="font-semibold">{r.title}</p><p className="text-sm text-muted-foreground">{r.time} · {r.place}</p></div>
              <button onClick={() => set({ appointments: s.appointments.filter((x) => x.id !== r.id) })} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
            </Card>
          );
        })}
      </div>
      {open ? (
        <Card>
          <Field label="Motif" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} placeholder="Consultation prénatale" />
          <div className="grid grid-cols-2 gap-3"><Field label="Date" type="date" value={a.date} onChange={(e) => setA({ ...a, date: e.target.value })} /><Field label="Heure" type="time" value={a.time} onChange={(e) => setA({ ...a, time: e.target.value })} /></div>
          <Field label="Lieu" value={a.place} onChange={(e) => setA({ ...a, place: e.target.value })} />
          <Btn disabled={!a.title || !a.date} onClick={() => { set({ appointments: [...s.appointments, { ...a, id: crypto.randomUUID() }] }); setOpen(false); setA({ title: "", date: "", time: "", place: s.center }); toast.success("Rendez-vous ajouté — rappel activé"); }}>Enregistrer</Btn>
        </Card>
      ) : <Btn onClick={() => setOpen(true)}>+ Ajouter un rendez-vous</Btn>}
    </div>
  );
}

/* ---------- 18 Emergency ---------- */
export function Emergency() {
  const { s } = useSB();
  const signs = ["Saignements vaginaux", "Maux de tête violents / vision trouble", "Fièvre élevée", "Perte des eaux", "Bébé ne bouge plus", "Convulsions", "Douleurs abdominales intenses"];
  return (
    <div className="pt-4">
      <Header title="Alertes et urgence" sub="Si vous avez l'un de ces signes, consultez immédiatement" back="home" />
      <a href="tel:112" className="mb-4 flex items-center justify-center gap-2 rounded-full bg-destructive py-4 text-lg font-bold text-destructive-foreground shadow-lg"><Phone className="h-5 w-5" /> Appeler les urgences</a>
      {s.partner && <a href={`tel:${s.partner.phone}`} className="mb-4 flex items-center justify-center gap-2 rounded-full border-2 border-destructive py-3 font-semibold text-destructive"><Phone className="h-4 w-4" /> Appeler {s.partner.name}</a>}
      <Card className="mb-4">
        <p className="mb-3 flex items-center gap-2 font-bold"><AlertTriangle className="h-5 w-5 text-destructive" /> Signes de danger</p>
        <ul className="space-y-2">{signs.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-destructive" />{x}</li>)}</ul>
      </Card>
      {s.center && <Card><p className="text-sm text-muted-foreground">Votre centre de santé</p><p className="font-semibold">{s.center}</p></Card>}
    </div>
  );
}

/* ---------- 19-20 Baby ---------- */
export function BabyCreate() {
  const { set, go } = useSB();
  const [b, setB] = useState({ name: "", birth: "", weight: "", sex: "Fille" });
  return (
    <div className="pt-4">
      <Header title="Créer le profil du bébé" sub="Après la naissance" />
      <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-success-soft text-5xl">👶🏾</div>
      <Field label="Prénom du bébé" value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} placeholder="Amani" />
      <Field label="Date de naissance" type="date" value={b.birth} onChange={(e) => setB({ ...b, birth: e.target.value })} />
      <Field label="Poids de naissance (kg)" value={b.weight} onChange={(e) => setB({ ...b, weight: e.target.value })} placeholder="3,2" />
      <div className="mb-5 grid grid-cols-2 gap-2">{["Fille", "Garçon"].map((x) => <button key={x} onClick={() => setB({ ...b, sex: x })} className={cn("rounded-2xl border py-3", b.sex === x ? "border-primary bg-secondary font-semibold text-primary" : "border-input bg-card")}>{x}</button>)}</div>
      <Btn disabled={!b.name || !b.birth} onClick={() => { set({ baby: b }); toast.success(`Bienvenue ${b.name} !`); go("baby"); }}>Créer le profil</Btn>
      <Private text="Les informations restent privées et chiffrées" />
    </div>
  );
}

export function BabyTrack() {
  const { s, set, go } = useSB();
  if (!s.baby) return null;
  const days = Math.max(0, Math.floor((Date.now() - new Date(s.baby.birth).getTime()) / 86400000));
  const log = (kind: string) => { set({ babyLog: [{ id: crypto.randomUUID(), kind, at: new Date().toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) }, ...s.babyLog] }); toast.success(`${kind} noté`); };
  const vax = [{ n: "BCG + Polio 0", d: 0 }, { n: "Penta 1 + Polio 1", d: 42 }, { n: "Penta 2", d: 70 }, { n: "Penta 3", d: 98 }, { n: "Rougeole", d: 270 }];
  return (
    <div className="pt-4">
      <Header title={s.baby.name} sub={`${days} jours · ${s.baby.weight || "?"} kg à la naissance`} />
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[{ I: Milk, t: "Tétée" }, { I: Sleep, t: "Sommeil" }, { I: Droplet, t: "Couche" }].map((x) => <button key={x.t} onClick={() => log(x.t)} className="rounded-3xl bg-success-soft p-4 text-success"><x.I className="mx-auto mb-1 h-6 w-6" /><p className="text-xs font-bold">+ {x.t}</p></button>)}
      </div>
      <Card className="mb-4"><p className="mb-2 font-bold">Calendrier vaccinal</p>{vax.map((v) => <div key={v.n} className="flex justify-between border-b border-border py-2 text-sm last:border-0"><span>{v.n}</span><span className={days >= v.d ? "text-success" : "text-muted-foreground"}>{days >= v.d ? "À faire / fait" : `J+${v.d}`}</span></div>)}</Card>
      <Card><p className="mb-2 font-bold">Journal</p>{s.babyLog.length === 0 ? <p className="text-sm text-muted-foreground">Rien encore aujourd'hui</p> : s.babyLog.slice(0, 8).map((l) => <div key={l.id} className="flex justify-between py-1 text-sm"><span>{l.kind}</span><span className="text-muted-foreground">{l.at}</span></div>)}</Card>
      <Btn variant="ghost" className="mt-3" onClick={() => go("babyCreate")}>Modifier le profil</Btn>
    </div>
  );
}

/* ---------- 21 Profile ---------- */
export function Profile() {
  const { s, go, reset } = useSB();
  const items: { t: string; I: typeof Lock; to: Screen }[] = [
    { t: "Confidentialité de l'assistant IA", I: Sparkles, to: "aiPrivacy" },
    { t: "Hors-ligne et chiffrement", I: WifiOff, to: "offline" },
    { t: "Langue et pays", I: Globe, to: "language" },
    { t: "Apparence", I: Moon, to: "theme" },
    { t: "Personne de confiance", I: UserPlus, to: "invite" },
  ];
  return (
    <div className="pt-4">
      <Header title="Mon profil" />
      <Card className="mb-4 flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-accent font-display text-2xl font-bold text-pink">{(s.name || "G")[0]}</div><div><p className="font-display text-xl font-bold">{s.name || "Grâce"}</p><p className="text-sm text-muted-foreground">{s.contact} · {weeksOf(s.lmp)} SA</p></div></Card>
      <Card className="mb-4 p-2">{items.map((i) => <button key={i.t} onClick={() => go(i.to)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-muted"><i.I className="h-5 w-5 text-primary" /><span className="flex-1">{i.t}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>)}</Card>
      <Btn variant="outline" className="border-destructive text-destructive" onClick={() => { if (confirm("Supprimer toutes vos données de cet appareil ?")) reset(); }}><LogOut className="mr-1 inline h-4 w-4" /> Se déconnecter et effacer</Btn>
    </div>
  );
}

/* ---------- 22 Offline ---------- */
export function Offline() {
  const { s, set } = useSB();
  const [online, setOnline] = useState(true);
  useEffect(() => { setOnline(navigator.onLine); const on = () => setOnline(true), off = () => setOnline(false); addEventListener("online", on); addEventListener("offline", off); return () => { removeEventListener("online", on); removeEventListener("offline", off); }; }, []);
  return (
    <div className="pt-4">
      <Header title="Hors-ligne et chiffrement" back="profile" />
      <Card className={cn("mb-4 flex items-center gap-3", online ? "bg-success-soft" : "bg-accent")}><WifiOff className="h-6 w-6" /><div><p className="font-semibold">{online ? "Connectée" : "Hors connexion"}</p><p className="text-sm text-muted-foreground">Vos contenus essentiels restent disponibles</p></div></Card>
      <Card className="mb-4 flex items-center gap-4"><div className="flex-1"><p className="font-semibold">Mode hors connexion</p><p className="text-sm text-muted-foreground">Contenus téléchargés sur l'appareil</p></div><Toggle on={s.consent.offline} onChange={(v) => set({ consent: { ...s.consent, offline: v } })} /></Card>
      <Card className="mb-4"><p className="mb-2 flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-success" /> Chiffrement actif</p><p className="text-sm text-muted-foreground">Vos données sont stockées uniquement sur cet appareil. Rien n'est partagé sans votre accord.</p></Card>
      <p className="rounded-2xl bg-accent p-3 text-center text-sm font-semibold text-accent-foreground">En cas d'urgence, contactez un professionnel de santé.</p>
    </div>
  );
}

/* ---------- 23 Language ---------- */
type R = { c: string[]; l: string[] };
const regionsRaw: Record<string, R> = {
  "Afrique de l'Ouest": { c: ["Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Bénin", "Togo", "Niger", "Guinée", "Nigeria", "Ghana"], l: ["Français", "Wolof", "Bambara", "Dioula", "Mooré", "Fon", "Haoussa", "Yoruba", "Peul"] },
  "Afrique Centrale": { c: ["Cameroun", "Tchad", "Gabon", "Congo", "RD Congo", "Centrafrique"], l: ["Français", "Lingala", "Sango", "Ewondo", "Arabe tchadien"] },
  "Afrique de l'Est": { c: ["Kenya", "Tanzanie", "Éthiopie", "Rwanda", "Ouganda"], l: ["Swahili", "Amharique", "Kinyarwanda", "English"] },
  "Afrique Australe": { c: ["Afrique du Sud", "Mozambique", "Zambie", "Madagascar"], l: ["Zoulou", "Xhosa", "Português", "Malagasy", "English"] },
  "Afrique du Nord": { c: ["Maroc", "Algérie", "Tunisie", "Égypte"], l: ["العربية", "Tamazight", "Français"] },
};
const regions = regionsRaw as Record<string, R> & { [k: string]: R };
const reg = (k: string): R => regionsRaw[k] ?? { c: [""], l: [""] };
export function Language() {
  const { s, set, go } = useSB();
  const initR = Object.keys(regions).find((r) => reg(r).c.includes(s.country)) ?? "Afrique de l'Ouest";
  const [r, setR] = useState(initR);
  const [c, setC] = useState(s.country);
  const [l, setL] = useState(s.language);
  return (
    <div className="pt-4">
      <Header title="Mes préférences linguistiques" back={s.onboarded ? "profile" : "welcome"} />
      <p className="mb-2 text-sm font-semibold">Région</p>
      <div className="mb-4 flex flex-wrap gap-2">{Object.keys(regions).map((x) => <button key={x} onClick={() => { setR(x); setC(reg(x).c[0] ?? ""); setL(reg(x).l[0] ?? ""); }} className={cn("rounded-full border px-3 py-1.5 text-sm", r === x ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card")}>{x}</button>)}</div>
      <p className="mb-2 text-sm font-semibold">Choisir mon pays</p>
      <select value={c} onChange={(e) => setC(e.target.value)} className="mb-4 w-full rounded-2xl border border-input bg-card px-4 py-3">{reg(r).c.map((x) => <option key={x}>{x}</option>)}</select>
      <p className="mb-2 text-sm font-semibold">Langue de l'application</p>
      <div className="mb-4 grid grid-cols-2 gap-2">{reg(r).l.map((x) => <button key={x} onClick={() => setL(x)} className={cn("rounded-2xl border py-3 text-sm", l === x ? "border-primary bg-secondary font-semibold text-primary" : "border-input bg-card")}>{x}</button>)}</div>
      <Card className="mb-4 flex items-center gap-2 p-3 text-sm"><Download className="h-4 w-4 text-primary" /> Pack hors connexion « {l} » disponible</Card>
      <Btn onClick={() => { set({ country: c, language: l }); toast.success(`Langue : ${l}`); go(s.onboarded ? "profile" : "signup"); }}>Enregistrer mes préférences</Btn>
    </div>
  );
}

/* ---------- 24 Theme ---------- */
export function Theme() {
  const { s, set } = useSB();
  const opts = [{ k: "light", t: "Mode clair", I: Sun }, { k: "dark", t: "Mode sombre", I: Moon }, { k: "system", t: "Automatique", I: Monitor }] as const;
  return (
    <div className="pt-4">
      <Header title="Apparence" sub="Choisissez votre affichage préféré" back="profile" />
      <div className="space-y-3">{opts.map((o) => <Card key={o.k} onClick={() => set({ theme: o.k })} className={cn("flex items-center gap-4", s.theme === o.k && "border-2 border-primary")}><o.I className="h-6 w-6 text-primary" /><span className="flex-1 font-semibold">{o.t}</span>{s.theme === o.k && <span className="h-4 w-4 rounded-full bg-primary" />}</Card>)}</div>
    </div>
  );
}
