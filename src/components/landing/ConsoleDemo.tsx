"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Download,
  GitPullRequest,
  LayoutGrid,
  Network,
  Search,
  ShieldCheck,
  Square,
  CircleCheck,
} from "lucide-react";
import { useLanguage } from "../../i18n/Language";
import { Mark } from "./Chrome";
import { prefersReducedMotion } from "./motion";
import "./console.css";

export type ConsoleView =
  | "overview"
  | "topology"
  | "pentest"
  | "findings"
  | "report";

export const CONSOLE_VIEWS: ConsoleView[] = [
  "overview",
  "topology",
  "pentest",
  "findings",
  "report",
];

/** Petites minuteries annulées automatiquement quand la vue change. */
function useTimers() {
  const timers = useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach((id) => {
      window.clearTimeout(id);
      window.clearInterval(id);
    });
    timers.current = [];
  };
  useEffect(() => clear, []);
  return {
    later: (fn: () => void, ms: number) =>
      timers.current.push(
        window.setTimeout(fn, prefersReducedMotion() ? 0 : ms),
      ),
    every: (fn: () => void, ms: number) => {
      fn();
      if (!prefersReducedMotion())
        timers.current.push(window.setInterval(fn, ms));
    },
    clear,
  };
}

function useCount(target: number, active: boolean, from = 0, duration = 1400) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!active) return;
    const length = prefersReducedMotion() ? 0 : duration;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = length ? Math.min(1, (now - t0) / length) : 1;
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, from, duration]);
  return value.toLocaleString("fr-FR");
}

function Spark({ pts, color }: { pts: number[]; color: string }) {
  const d = pts
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i * 100) / (pts.length - 1)).toFixed(1)} ${(
          30 -
          v * 0.28
        ).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
      <path
        className="l"
        d={d}
        stroke={color}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---------- Vue d'ensemble ---------- */
type FeedEvent = {
  id: number;
  color: string;
  title: string;
  sub: string;
  time: string;
};

function Overview({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const timers = useTimers();
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const counter = useRef(0);
  const [loads, setLoads] = useState([0, 0, 0]);
  const score = useCount(38, active, 72, 1800);
  const open = useCount(3, active, 0, 900);
  const fixed = useCount(27, active, 0, 1500);
  const runs = useCount(18412, active, 0, 1800);

  useEffect(() => {
    if (!active) return;
    const events = [
      [
        "var(--fg-2)",
        t("Copie de l'infrastructure prête"),
        t("37 services reproduits"),
      ],
      ["var(--warn)", t("Injection testée"), "web-app · /search"],
      ["var(--warn)", t("Élévation de droits tentée"), "worker"],
      ["var(--danger)", t("Faille critique confirmée"), "api-users · CVSS 9.8"],
      ["var(--fg-2)", t("Correction générée"), "services/users/repo.py"],
      [
        "var(--success)",
        t("Correction validée"),
        t("l'attaque échoue désormais"),
      ],
      ["var(--success)", t("Pull request ouverte"), t("prête pour revue")],
    ];
    const push = () => {
      const id = counter.current++;
      const [color, title, sub] = events[id % events.length];
      const d = new Date();
      const time = `${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds(),
      ).padStart(2, "0")}`;
      setFeed((f) => [{ id, color, title, sub, time }, ...f].slice(0, 6));
    };
    push();
    push();
    timers.every(push, 2200);
    timers.later(() => setLoads([34, 52, 18]), 150);
    timers.every(
      () =>
        setLoads(
          [34, 52, 18].map((w) => Math.max(10, w + Math.random() * 24 - 12)),
        ),
      1600,
    );
    return timers.clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const agents = [t("staging-01"), t("staging-02"), t("prod (lecture seule)")];
  return (
    <>
      <div className="dv-h">
        <div>
          <h5>{t("Vue d'ensemble")}</h5>
          <p>{t("Votre niveau de risque · 30 derniers jours")}</p>
        </div>
        <span className="dbtn">
          <Download size={13} />
          {t("Exporter")}
        </span>
      </div>
      <div className="kpis">
        <div className="dcard kpi">
          <div className="dlabel">{t("Score d'exposition")}</div>
          <div className="v">
            {score}
            <span className="d up">−47 %</span>
          </div>
          <Spark
            pts={[82, 80, 76, 77, 70, 64, 60, 52, 47, 41, 38]}
            color="oklch(76% .13 142)"
          />
        </div>
        <div className="dcard kpi">
          <div className="dlabel">{t("Failles ouvertes")}</div>
          <div className="v">
            {open}
            <span className="d dn">{t("1 critique")}</span>
          </div>
          <Spark
            pts={[20, 35, 30, 42, 38, 30, 26, 22, 18, 14, 12]}
            color="oklch(72% .14 25)"
          />
        </div>
        <div className="dcard kpi">
          <div className="dlabel">{t("Corrigées · 30 j")}</div>
          <div className="v">
            {fixed}
            <span className="d up">+9</span>
          </div>
          <Spark
            pts={[4, 8, 14, 20, 26, 34, 40, 50, 60, 70, 80]}
            color="oklch(80% .014 252)"
          />
        </div>
        <div className="dcard kpi">
          <div className="dlabel">{t("Attaques · 24 h")}</div>
          <div className="v">{runs}</div>
          <Spark
            pts={[30, 42, 38, 50, 46, 60, 58, 66, 72, 70, 84]}
            color="oklch(80% .014 252)"
          />
        </div>
      </div>
      <div className="ov-grid">
        <div className="dcard">
          <div className="dlabel">
            {t("Activité de l'agent")}
            <span className="mono">{t("temps réel")}</span>
          </div>
          <div className="dfeed">
            {feed.map((e) => (
              <div className="dev" key={e.id}>
                <span
                  className="ei"
                  style={{
                    background: `color-mix(in oklch, ${e.color} 16%, transparent)`,
                  }}
                >
                  <i style={{ background: e.color }} />
                </span>
                <div>
                  <b>{e.title}</b>
                  <small>{e.sub}</small>
                </div>
                <time>{e.time}</time>
              </div>
            ))}
          </div>
        </div>
        <div className="dcard">
          <div className="dlabel">{t("Charge des agents")}</div>
          <div className="agents">
            {agents.map((name, i) => (
              <div className="ag" key={name}>
                <div className="ag-h">
                  <span>
                    <span className="dot" />
                    {name}
                  </span>
                  <span>{(loads[i] / 80).toFixed(1).replace(".", ",")} %</span>
                </div>
                <div className="bar">
                  <i style={{ width: `${loads[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dlabel" style={{ marginTop: 16 }}>
            {t("Mémoire de l'agent")}
            <span className="mono">&lt; 50 Mo</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Topologie ---------- */
type TopoNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  agent?: boolean;
  state: "idle" | "hit" | "crit" | "fixed";
  pulse: number;
};

const COLORS = {
  idle: "#c9cfd8",
  hit: "#e89b2c",
  crit: "#d2533f",
  fixed: "#4f9f55",
};
const EDGES = [
  ["ingress", "web"],
  ["web", "api"],
  ["ingress", "api"],
  ["web", "redis"],
  ["api", "pg"],
  ["api", "worker"],
  ["worker", "pg"],
  ["redis", "worker"],
];
const TARGETS = ["ingress", "web", "api"];

function Topology({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"build" | "ready" | "crit" | "fixed">(
    "build",
  );
  const agentLabel = t("agent IA");

  useEffect(() => {
    if (!active) return;
    const cv = canvas.current;
    const ctx = cv?.getContext?.("2d");
    if (!cv || !ctx) return;
    const reduce = prefersReducedMotion();
    const nodes: TopoNode[] = [
      {
        id: "agent",
        x: 0.1,
        y: 0.55,
        label: agentLabel,
        agent: true,
        state: "idle",
        pulse: 0,
      },
      {
        id: "ingress",
        x: 0.4,
        y: 0.25,
        label: "ingress",
        state: "idle",
        pulse: 0,
      },
      { id: "web", x: 0.4, y: 0.55, label: "web-app", state: "idle", pulse: 0 },
      {
        id: "api",
        x: 0.4,
        y: 0.85,
        label: "api-users",
        state: "idle",
        pulse: 0,
      },
      {
        id: "redis",
        x: 0.76,
        y: 0.25,
        label: "redis",
        state: "idle",
        pulse: 0,
      },
      {
        id: "worker",
        x: 0.76,
        y: 0.55,
        label: "worker",
        state: "idle",
        pulse: 0,
      },
      {
        id: "pg",
        x: 0.76,
        y: 0.85,
        label: "postgres",
        state: "idle",
        pulse: 0,
      },
    ];
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    let W = 0;
    let H = 0;
    let built = 0;
    let raf = 0;
    const packets: { to: TopoNode; t: number; sp: number }[] = [];
    const size = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(size) : null;
    ro?.observe(cv);
    const P = (n: TopoNode) => ({
      x: 30 + n.x * (W - 60),
      y: 34 + n.y * (H - 64),
    });
    const visible = (n: TopoNode) =>
      Math.min(1, Math.max(0, built * nodes.length - nodes.indexOf(n)));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(237,240,245,.05)";
      for (let x = 12; x < W; x += 22)
        for (let y = 12; y < H; y += 22) ctx.fillRect(x, y, 1, 1);
      built = Math.min(1, built + (reduce ? 1 : 0.012));
      EDGES.forEach(([a, b]) => {
        const A = byId[a];
        const B = byId[b];
        const k = Math.min(visible(A), visible(B));
        if (!k) return;
        const p = P(A);
        const q = P(B);
        ctx.strokeStyle = `rgba(237,240,245,${0.12 * k})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (q.x - p.x) * k, p.y + (q.y - p.y) * k);
        ctx.stroke();
      });
      if (built >= 1) {
        TARGETS.forEach((id) => {
          const p = P(byId.agent);
          const q = P(byId[id]);
          ctx.setLineDash([3, 5]);
          ctx.strokeStyle = "rgba(237,240,245,.14)";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.bezierCurveTo(p.x + 70, p.y, q.x - 70, q.y, q.x, q.y);
          ctx.stroke();
          ctx.setLineDash([]);
        });
        if (!reduce && Math.random() < 0.06)
          packets.push({
            to: byId[TARGETS[Math.floor(Math.random() * TARGETS.length)]],
            t: 0,
            sp: 0.008 + Math.random() * 0.008,
          });
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i];
        k.t += k.sp;
        const p = P(byId.agent);
        const q = P(k.to);
        const at = (s: number) => {
          const u = 1 - s;
          return {
            x:
              u * u * u * p.x +
              3 * u * u * s * (p.x + 70) +
              3 * u * s * s * (q.x - 70) +
              s * s * s * q.x,
            y:
              u * u * u * p.y +
              3 * u * u * s * p.y +
              3 * u * s * s * q.y +
              s * s * s * q.y,
          };
        };
        for (let j = 0; j < 7; j++) {
          const pt = at(Math.max(0, k.t - j * 0.014));
          ctx.fillStyle = `rgba(238,240,244,${(1 - j / 7) * 0.9})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 - j * 0.2, 0, 7);
          ctx.fill();
        }
        if (k.t >= 1) {
          packets.splice(i, 1);
          k.to.pulse = 1;
          if (k.to.state === "idle") {
            k.to.state = "hit";
            window.setTimeout(() => {
              if (k.to.state === "hit") k.to.state = "idle";
            }, 600);
          }
        }
      }
      ctx.font = '500 10.5px "JetBrains Mono", monospace';
      ctx.textBaseline = "middle";
      nodes.forEach((n) => {
        const a = visible(n);
        if (!a) return;
        const p = P(n);
        const w = n.agent ? 92 : 86;
        const h = 26;
        ctx.globalAlpha = a;
        if (n.pulse > 0) {
          n.pulse -= 0.03;
          ctx.strokeStyle = COLORS[n.state === "idle" ? "hit" : n.state];
          ctx.globalAlpha = Math.max(0, n.pulse) * 0.5;
          const g = (1 - n.pulse) * 9;
          ctx.beginPath();
          ctx.roundRect(
            p.x - w / 2 - g,
            p.y - h / 2 - g,
            w + g * 2,
            h + g * 2,
            10,
          );
          ctx.stroke();
          ctx.globalAlpha = a;
        }
        ctx.fillStyle = n.agent ? "#eef0f4" : "#0b0f17";
        ctx.beginPath();
        ctx.roundRect(p.x - w / 2, p.y - h / 2, w, h, 8);
        ctx.fill();
        if (!n.agent && a < 1) ctx.setLineDash([3, 3]);
        ctx.strokeStyle = n.agent
          ? "#eef0f4"
          : n.state === "idle"
            ? "rgba(237,240,245,.22)"
            : COLORS[n.state];
        ctx.stroke();
        ctx.setLineDash([]);
        if (!n.agent) {
          ctx.fillStyle = COLORS[n.state];
          ctx.beginPath();
          ctx.arc(p.x - w / 2 + 12, p.y, 2.8, 0, 7);
          ctx.fill();
        }
        ctx.fillStyle = n.agent ? "#0b0f17" : "#eef0f4";
        ctx.textAlign = "left";
        ctx.fillText(n.label, p.x - w / 2 + (n.agent ? 12 : 21), p.y + 0.5);
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const steps = [
      window.setTimeout(() => setStatus("ready"), reduce ? 0 : 1700),
      window.setTimeout(
        () => {
          byId.api.state = "crit";
          byId.api.pulse = 1;
          setStatus("crit");
        },
        reduce ? 0 : 4200,
      ),
      window.setTimeout(
        () => {
          byId.api.state = "fixed";
          byId.api.pulse = 1;
          setStatus("fixed");
        },
        reduce ? 0 : 7000,
      ),
    ];
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      steps.forEach((s) => window.clearTimeout(s));
      setStatus("build");
    };
  }, [active, agentLabel]);

  const state = {
    build: [t("en cours de copie"), ""],
    ready: [t("testé"), ""],
    crit: [t("faille critique"), "var(--danger-ink)"],
    fixed: [t("corrigé"), "var(--success-ink)"],
  }[status];
  return (
    <>
      <div className="dv-h">
        <div>
          <h5>{t("Votre infrastructure")}</h5>
          <p>{t("Copie isolée · 6 services")}</p>
        </div>
        <span className="dbtn">
          <span className="dot live" />
          {t("Tests en cours")}
        </span>
      </div>
      <div className="topo-wrap">
        <div className="dcard topo">
          <div className="dlabel">
            <span>{t("Carte des services")}</span>
            <span className="mono">
              {status === "build"
                ? t("copie en cours…")
                : t("6 services · 8 liens")}
            </span>
          </div>
          <canvas ref={canvas} />
        </div>
        <div className="dcard node-info">
          <div className="dlabel">{t("Service sélectionné")}</div>
          <div style={{ font: "500 14px var(--display)" }}>api-users</div>
          <div className="ni-row">
            <span>{t("rôle")}</span>
            <b>{t("comptes clients")}</b>
          </div>
          <div className="ni-row">
            <span>{t("exposé")}</span>
            <b>{t("oui, via internet")}</b>
          </div>
          <div className="ni-row">
            <span>{t("dépend de")}</span>
            <b>postgres</b>
          </div>
          <div className="ni-row" style={{ border: 0 }}>
            <span>{t("état")}</span>
            <b style={{ color: state[1] || undefined }}>{state[0]}</b>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Tests en cours ---------- */
const HEAT_CELLS = 264;

function Pentest({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const timers = useTimers();
  const [cells, setCells] = useState<string[]>(() =>
    Array(HEAT_CELLS).fill(""),
  );
  const [runs, setRuns] = useState(0);
  const [bars, setBars] = useState(false);
  const [phase, setPhase] = useState(false);
  const families = [
    [t("Injections"), 412, 78],
    [t("Élévations de droits"), 238, 46],
    [t("Vulnérabilités connues"), 316, 62],
    [t("Erreurs de configuration"), 96, 30],
  ] as const;

  useEffect(() => {
    if (!active) return;
    let k = 0;
    let total = 0;
    setPhase(false);
    setBars(false);
    timers.later(() => {
      setPhase(true);
      setBars(true);
    }, 80);
    timers.every(() => {
      setCells((prev) => {
        const next = k === 0 ? Array(HEAT_CELLS).fill("") : [...prev];
        for (let j = 0; j < 7 && k < HEAT_CELLS; j++, k++) {
          const r = Math.random();
          next[k] = r < 0.04 ? "c" : r < 0.16 ? "w" : "a";
        }
        if (k >= HEAT_CELLS) k = 0;
        return next;
      });
      total += 9 + Math.floor(Math.random() * 7);
      setRuns(total);
    }, 110);
    return timers.clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const done = cells.filter(Boolean).length;
  return (
    <>
      <div className="dv-h">
        <div>
          <h5>{t("Tests en cours")}</h5>
          <p>{t("Démarrés il y a 12 min · sur la copie de staging")}</p>
        </div>
        <span className="dbtn">
          <Square size={13} />
          {t("Tout arrêter")}
        </span>
      </div>
      <div className="phz">
        <div className="done">
          <i>
            <b />
          </i>
          {t("Copie")}
        </div>
        <div className="now">
          <i>
            <b
              style={{
                transition: phase ? "transform 9s linear" : "none",
                transform: phase ? "scaleX(.92)" : "scaleX(0)",
              }}
            />
          </i>
          {t("Attaques")}
        </div>
        <div>
          <i>
            <b />
          </i>
          {t("Détection")}
        </div>
        <div>
          <i>
            <b />
          </i>
          {t("Correction")}
        </div>
      </div>
      <div className="pt-grid">
        <div className="dcard">
          <div className="dlabel">
            {t("Attaques lancées")}
            <span className="mono">
              {Math.round((done / HEAT_CELLS) * 100)} %
            </span>
          </div>
          <div className="bignum">{runs.toLocaleString("fr-FR")}</div>
          <div className="heat">
            {cells.map((c, i) => (
              <i key={i} className={c} />
            ))}
          </div>
        </div>
        <div className="dcard">
          <div className="dlabel">{t("Par type d'attaque")}</div>
          <div className="cats">
            {families.map(([name, count, width]) => (
              <div className="cat" key={name}>
                <div className="cat-h">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
                <div className="bar">
                  <i style={{ width: bars ? `${width}%` : 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Failles trouvées ---------- */
type FindingStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function Findings({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const timers = useTimers();
  // 0 liste · 1 panneau ouvert · 2-4 étapes du replay · 5 correction · 6 validée · 7 PR ouverte
  const [stage, setStage] = useState<FindingStage>(0);

  const play = () => {
    timers.clear();
    setStage(0);
    const seq: [FindingStage, number][] = [
      [1, 600],
      [2, 1100],
      [3, 1800],
      [4, 2500],
      [5, 3600],
      [6, 4800],
      [7, 5400],
    ];
    seq.forEach(([s, ms]) => timers.later(() => setStage(s), ms));
    timers.later(play, 10000);
  };

  useEffect(() => {
    if (!active) {
      timers.clear();
      return;
    }
    play();
    return timers.clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const rows = [
    ["crit", "9.8", t("Base clients exposée"), "api-users"],
    ["high", "7.4", t("Droits trop larges"), "worker"],
    ["high", "6.1", t("Chiffrement obsolète"), "ingress"],
    ["ok", "5.3", t("Script injecté dans une page"), "web-app"],
    ["ok", "8.1", t("Bibliothèque vulnérable"), "worker"],
  ];
  return (
    <>
      <div className="dv-h">
        <div>
          <h5>{t("Failles trouvées")}</h5>
          <p>{t("3 ouvertes · 27 corrigées ce mois-ci")}</p>
        </div>
        <span className="dbtn">{t("Filtrer")}</span>
      </div>
      <div className="ftable">
        <div className="frow th">
          <span>{t("Gravité")}</span>
          <span>{t("Faille")}</span>
          <span>{t("Service")}</span>
          <span>{t("Statut")}</span>
        </div>
        {rows.map(([sev, score, title, svc], i) => {
          const fixed = sev === "ok" || (i === 0 && stage >= 7);
          return (
            <div
              key={title}
              className={`frow ${i === 0 ? "sel" : ""}`}
              style={{ "--r": i } as React.CSSProperties}
              onClick={i === 0 ? play : undefined}
            >
              <span>
                <span className={`sev ${sev}`}>{score}</span>
              </span>
              <span>{title}</span>
              <span className="svc">{svc}</span>
              <span className="st">
                <span
                  className="dot"
                  style={{
                    background: fixed
                      ? undefined
                      : sev === "crit"
                        ? "var(--danger)"
                        : "var(--warn)",
                  }}
                />
                {fixed ? t("corrigée") : t("ouverte")}
              </span>
            </div>
          );
        })}
      </div>
      <aside className={`drawer ${stage >= 1 ? "on" : ""}`}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <h6>{t("Base clients exposée")}</h6>
          <span className="sev crit">{t("Critique")}</span>
        </div>
        <div className="dlabel">{t("Ce qu'un attaquant pourrait faire")}</div>
        <div className="rp">
          <div className={stage >= 2 ? "on" : ""}>
            <span>{t("étape 1")}</span>
            <span>{t("Envoie une requête piégée")}</span>
          </div>
          <div className={stage >= 3 ? "on" : ""}>
            <span>{t("étape 2")}</span>
            <span className="w">{t("Reçoit 4 812 fiches clients")}</span>
          </div>
          <div className={stage >= 4 ? "on" : ""}>
            <span>{t("preuve")}</span>
            <span className="c">{t("Rejoué sur la copie uniquement")}</span>
          </div>
        </div>
        <div className="dlabel">{t("Correction proposée")}</div>
        <div className="diff">
          <div className="diff-h">
            <span>repo.py</span>
            <span>+2 −1</span>
          </div>
          <div className={`ln del ${stage >= 5 ? "in" : ""}`}>
            - f&quot;…WHERE id = {"{uid}"}&quot;
          </div>
          <div className={`ln add ${stage >= 5 ? "in" : ""}`}>
            + &quot;…WHERE id = %s&quot;,
          </div>
          <div className={`ln add ${stage >= 5 ? "in" : ""}`}>+ (uid,)</div>
        </div>
        <div className={`valid ${stage >= 6 ? "in" : ""}`}>
          <CircleCheck size={13} />
          {t("Attaque rejouée : elle échoue")}
        </div>
      </aside>
      <div className={`toast-pr ${stage >= 7 ? "on" : ""}`}>
        <GitPullRequest size={13} />
        {t("Correction envoyée à votre équipe")}
      </div>
    </>
  );
}

/* ---------- Rapport ---------- */
function Report({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const delay = active && !prefersReducedMotion() ? 150 : 0;
    const id = window.setTimeout(() => setDrawn(active), delay);
    return () => window.clearTimeout(id);
  }, [active]);
  const C = 2 * Math.PI * 48;
  const parts = [
    [3, "oklch(58% .18 25)"],
    [8, "oklch(72% .17 65)"],
    [19, "oklch(58% .15 142)"],
  ] as const;
  let acc = 0;
  return (
    <>
      <div className="dv-h">
        <div>
          <h5>{t("Rapport mensuel")}</h5>
          <p>{t("Pour la direction · octobre 2026")}</p>
        </div>
        <span className="dbtn">
          <Download size={13} />
          PDF
        </span>
      </div>
      <div className="rep-grid">
        <div className="dcard rchart">
          <div className="dlabel">
            {t("Failles ouvertes et corrigées · 12 semaines")}
          </div>
          <svg viewBox="0 0 400 180" preserveAspectRatio="none" fill="none">
            <g stroke="oklch(94% .008 250 / .06)">
              <path d="M0 40H400M0 90H400M0 140H400" />
            </g>
            <path
              className="area"
              d="M0 150 C40 140 70 120 110 112 S180 80 220 70 S300 44 340 36 S390 28 400 26 V180 H0Z"
              fill="oklch(58% .15 142 / .1)"
            />
            <path
              className="ln"
              d="M0 150 C40 140 70 120 110 112 S180 80 220 70 S300 44 340 36 S390 28 400 26"
              stroke="oklch(76% .13 142)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="ln"
              d="M0 40 C40 46 80 64 120 70 S200 100 240 112 S320 140 360 146 S392 150 400 152"
              stroke="oklch(80% .014 252)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="dcard">
          <div className="dlabel">{t("Par gravité")}</div>
          <div className="donut">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" stroke="oklch(16.5% .03 258)" />
              {parts.map(([value, color]) => {
                const len = (value / 30) * C;
                const offset = -acc;
                acc += len;
                return (
                  <circle
                    key={color}
                    className="seg"
                    cx="60"
                    cy="60"
                    r="48"
                    stroke={color}
                    style={{
                      strokeDasharray: drawn ? `${len - 2} ${C}` : `0 ${C}`,
                      strokeDashoffset: offset,
                    }}
                  />
                );
              })}
            </svg>
            <b>
              30<small>{t("failles")}</small>
            </b>
          </div>
          <div className="legend2">
            <span>
              <i style={{ background: "var(--danger)" }} />
              {t("Critiques · 3")}
            </span>
            <span>
              <i style={{ background: "var(--warn)" }} />
              {t("Élevées · 8")}
            </span>
            <span>
              <i style={{ background: "var(--success)" }} />
              {t("Corrigées · 19")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const NAV: {
  view: ConsoleView;
  icon: typeof LayoutGrid;
  label: string;
  count?: number;
}[] = [
  { view: "overview", icon: LayoutGrid, label: "Vue d'ensemble" },
  { view: "topology", icon: Network, label: "Infrastructure" },
  { view: "pentest", icon: ShieldCheck, label: "Tests", count: 1 },
  { view: "findings", icon: AlertTriangle, label: "Failles", count: 3 },
  { view: "report", icon: BarChart3, label: "Rapports" },
];

/** Démonstration interactive de la console Aegis (données fictives). */
export function ConsoleDemo({
  view,
  onNavigate,
}: {
  view: ConsoleView;
  onNavigate?: (view: ConsoleView) => void;
}) {
  const { t } = useLanguage();
  const index = NAV.findIndex((n) => n.view === view);
  const Views = {
    overview: Overview,
    topology: Topology,
    pentest: Pentest,
    findings: Findings,
    report: Report,
  };
  return (
    <div
      className="dsh"
      role="region"
      aria-label={t("Démonstration de la console Aegis")}
    >
      <div className="dsh-top">
        <div className="dsh-crumb">
          <Mark size={16} />
          <span>Acme</span>
          <span style={{ color: "var(--faint)" }}>/</span>
          <b>staging</b>
        </div>
        <div className="dsh-search">
          <Search size={13} />
          {t("Rechercher")}
          <kbd>⌘K</kbd>
        </div>
        <div className="dsh-status">
          <span className="dot live" />
          <span>{t("3 agents connectés")}</span>
        </div>
        <span className="dsh-av">AC</span>
      </div>
      <div className="dsh-body">
        <nav className="dsh-nav" aria-label={t("Vues de la console")}>
          <span
            className="hl"
            style={{ transform: `translateY(${index * 34}px)` }}
          />
          {NAV.map(({ view: v, icon: Icon, label, count }) => (
            <button
              key={v}
              className={v === view ? "on" : ""}
              aria-pressed={v === view}
              onClick={() => onNavigate?.(v)}
            >
              <Icon size={15} />
              <span>{t(label)}</span>
              {count ? <span className="ct">{count}</span> : null}
            </button>
          ))}
          <span className="sep">{t("Agents")}</span>
          <span className="agent-row">
            <span className="dot" />
            k8s-staging-01
          </span>
          <span className="agent-row">
            <span className="dot" />
            k8s-staging-02
          </span>
          <span className="agent-row">
            <span className="dot" />
            k8s-prod-ro
          </span>
        </nav>
        <div className="dsh-main">
          {CONSOLE_VIEWS.map((v) => {
            const View = Views[v];
            return (
              <section
                key={v}
                className={`dv ${v === view ? "on" : ""}`}
                aria-hidden={v !== view}
              >
                <View active={v === view} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
