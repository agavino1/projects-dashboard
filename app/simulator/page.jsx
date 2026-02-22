"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, Users, ArrowRight, AlertTriangle,
  Sliders, ChevronDown, ChevronRight, Info, Zap,
  ArrowDownRight, ArrowUpRight, Layers, Plus, X
} from "lucide-react";

const AM = {
  navy: "#00263A", navyLight: "#003B5C", navyMid: "#002E4A",
  tealLight: "#0080B0",
  gold: "#D4A843", goldDim: "#8B7535",
  amber: "#E88C1E",
  white: "#FFFFFF",
  gray300: "#C5CCD3", gray400: "#8A95A0", gray500: "#5A6570", gray600: "#3D4750",
  border: "#1B3A4D", borderLight: "#2A5068",
  green: "#2E8B57", greenLight: "#3AAD6E",
  red: "#C0392B", redLight: "#E74C3C",
};

const ECAT = {
  "Cuentas": { e: -0.18, r: [-0.08, -0.32] },
  "Tarjetas": { e: -0.35, r: [-0.15, -0.55] },
  "Financiamiento": { e: -0.45, r: [-0.25, -0.70] },
  "Hipotecario": { e: -0.55, r: [-0.30, -0.80] },
  "Inversión": { e: -0.40, r: [-0.20, -0.60] },
  "Seguros": { e: -0.15, r: [-0.05, -0.30] },
  "CC Empresa": { e: -0.12, r: [-0.05, -0.25] },
  "Fin. Pyme": { e: -0.25, r: [-0.12, -0.45] },
  "Adquirencia": { e: -0.50, r: [-0.30, -0.75] },
  "Cash Mgmt": { e: -0.10, r: [-0.04, -0.20] },
  "Fin. Corp": { e: -0.30, r: [-0.15, -0.50] },
  "Comex": { e: -0.20, r: [-0.10, -0.35] },
  "Bca Inversión": { e: -0.15, r: [-0.05, -0.30] },
  "Markets": { e: -0.35, r: [-0.15, -0.55] },
};

const SEGS_MAP = {
  retail: [
    { name: "Jóvenes (<30)", share: 0.22, m: 2.1, c: AM.redLight },
    { name: "Mass market", share: 0.45, m: 1.0, c: AM.amber },
    { name: "Affluent", share: 0.20, m: 0.4, c: AM.tealLight },
    { name: "Premium", share: 0.13, m: 0.15, c: AM.green },
  ],
  pyme: [
    { name: "Micro", share: 0.35, m: 0.5, c: AM.green },
    { name: "Pequeña", share: 0.35, m: 1.0, c: AM.amber },
    { name: "Mediana", share: 0.20, m: 1.6, c: AM.redLight },
    { name: "FOGAPE", share: 0.10, m: 2.2, c: AM.redLight },
  ],
  empresa: [
    { name: "Mid-corp", share: 0.40, m: 1.2, c: AM.amber },
    { name: "Large corp", share: 0.35, m: 0.8, c: AM.tealLight },
    { name: "Multinacional", share: 0.25, m: 0.5, c: AM.green },
  ],
  cib: [
    { name: "Institucional", share: 0.50, m: 1.0, c: AM.amber },
    { name: "Soberano", share: 0.30, m: 0.3, c: AM.green },
    { name: "Corp top", share: 0.20, m: 0.7, c: AM.tealLight },
  ],
};

const CROSS_MAP = {
  "Cuentas": [{ l: "Migran a Cta Vista", s: 0.55 }, { l: "Otro banco", s: 0.30 }, { l: "Inactivos", s: 0.15 }],
  "Tarjetas": [{ l: "Downgrade", s: 0.40 }, { l: "TC competidor", s: 0.35 }, { l: "Cancelan", s: 0.25 }],
  "Financiamiento": [{ l: "Otro banco", s: 0.55 }, { l: "No toman crédito", s: 0.30 }, { l: "Fintech", s: 0.15 }],
  "Hipotecario": [{ l: "Otro banco", s: 0.70 }, { l: "Posponen", s: 0.20 }, { l: "Arriendan", s: 0.10 }],
  _default: [{ l: "Competidor", s: 0.50 }, { l: "Reducen uso", s: 0.30 }, { l: "Abandonan", s: 0.20 }],
};

const PRODUCTS = [
  { id: "r_cc_basico", n: "CC Plan Básico", cat: "Cuentas", seg: "retail", u: "UF/mes", f: 0.20, lo: 0, hi: 0.65, st: 0.01 },
  { id: "r_tc_clasica", n: "TC Clásica Mantención", cat: "Tarjetas", seg: "retail", u: "UF/año", f: 1.20, lo: 0, hi: 3.00, st: 0.05 },
  { id: "r_tc_gold", n: "TC Gold/Platinum", cat: "Tarjetas", seg: "retail", u: "UF/año", f: 2.80, lo: 0.50, hi: 5.50, st: 0.10 },
  { id: "r_cred12", n: "Crédito consumo 12M", cat: "Financiamiento", seg: "retail", u: "% CAE", f: 32.5, lo: 18, hi: 42, st: 0.5 },
  { id: "r_hip_fija", n: "Hipoteca tasa fija UF", cat: "Hipotecario", seg: "retail", u: "% CAE", f: 5.20, lo: 3.50, hi: 7.00, st: 0.05 },
  { id: "p_ktrab", n: "Crédito capital trabajo", cat: "Fin. Pyme", seg: "pyme", u: "% anual", f: 14.5, lo: 8, hi: 22, st: 0.5 },
  { id: "p_pos_cr", n: "POS Merchant crédito", cat: "Adquirencia", seg: "pyme", u: "% venta", f: 1.80, lo: 1.00, hi: 3.00, st: 0.05 },
  { id: "e_bilat", n: "Bilateral s/TAB", cat: "Fin. Corp", seg: "empresa", u: "pb", f: 180, lo: 80, hi: 300, st: 5 },
  { id: "c_ma", n: "M&A Advisory Fee", cat: "Bca Inversión", seg: "cib", u: "% deal", f: 1.50, lo: 0.50, hi: 3.00, st: 0.10 },
  { id: "c_rf", n: "RF spread BCU", cat: "Markets", seg: "cib", u: "pb", f: 5, lo: 1, hi: 12, st: 0.5 },
];

const SN = { retail: "Personas", pyme: "Pymes", empresa: "Empresas", cib: "CIB" };

function runSim(p, nf, cl, cal) {
  if (nf === p.f) return null;
  const pc = ((nf - p.f) / p.f) * 100;
  const ec = ECAT[p.cat] || ECAT["Cuentas"];
  const ea = ec.e + (cal - 0.5) * (ec.r[1] - ec.r[0]) * 0.8;
  const ch = Math.max(Math.min(Math.abs(ea * pc), 45), 0);
  const chN = Math.round(cl * ch / 100);
  const st = cl - chN;
  const revG = st * (nf - p.f) * 12;
  const revL = chN * p.f * 12;
  const cxL = chN * p.f * 12 * 2.5 * 0.6;
  const net = revG - revL - cxL;
  const lo = Math.abs(ec.r[0] * pc);
  const hi = Math.abs(ec.r[1] * pc);
  const segs = (SEGS_MAP[p.seg] || SEGS_MAP.retail).map((s) => {
    const sc = Math.min(ch * s.m, 60);
    const n = Math.round(cl * s.share);
    return { name: s.name, share: s.share, m: s.m, c: s.c, clients: n, churnPct: sc, churned: Math.round(n * sc / 100) };
  });
  const cr = (CROSS_MAP[p.cat] || CROSS_MAP._default).map((c) => ({ l: c.l, s: c.s, clients: Math.round(chN * c.s) }));
  return { pc, ch, chN, stayers: st, revG, revL, cxL, net, rng: [Math.min(lo, hi), Math.max(lo, hi)], segs, cr, ea };
}

function fM(v) { const a = Math.abs(v); if (a >= 1e6) return (v / 1e6).toFixed(1) + "M"; if (a >= 1e3) return (v / 1e3).toFixed(0) + "K"; return v.toFixed(0); }
function fK(v) { if (v >= 1e6) return (v / 1e6).toFixed(1) + "M"; if (v >= 1e3) return (v / 1e3).toFixed(0) + "K"; return String(v); }
function fV(v, step) { if (step < 1 && v < 10) return v.toFixed(2); if (v >= 100) return v.toFixed(0); return v.toFixed(1); }

function BarH({ label, value, maxVal, color, sub }) {
  const w = maxVal > 0 ? Math.min((value / maxVal) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
        <span style={{ color: AM.gray300 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{sub}</span>
      </div>
      <div style={{ height: 5, background: AM.navy, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: w + "%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

export default function ElasticitySimulatorV2() {
  const [scenarios, setScenarios] = useState([{ pid: "r_cc_basico", nf: 0.25, cl: 500000 }]);
  const [cal, setCal] = useState(0.5);
  const [ai, setAi] = useState(0);
  const [showSum, setShowSum] = useState(false);
  const [showSrc, setShowSrc] = useState(false);
  const [filter, setFilter] = useState("");
  const [segF, setSegF] = useState("all");
  const [copied, setCopied] = useState(false);

  function addScenario() { setScenarios((prev) => prev.concat([{ pid: "r_tc_clasica", nf: 1.40, cl: 500000 }])); setAi(scenarios.length); }
  function removeScenario(idx) { if (scenarios.length <= 1) return; setScenarios((prev) => prev.filter((_, j) => j !== idx)); setAi((v) => Math.max(0, v >= scenarios.length - 1 ? scenarios.length - 2 : v)); }
  function updateScenario(idx, key, val) { setScenarios((prev) => prev.map((s, j) => j === idx ? { ...s, [key]: val } : s)); }
  function selectProduct(pid) { const p = PRODUCTS.find((x) => x.id === pid); if (!p) return; updateScenario(ai, "pid", pid); updateScenario(ai, "nf", p.f); }

  const ac = scenarios[ai] || scenarios[0];
  const prod = PRODUCTS.find((x) => x.id === ac.pid) || PRODUCTS[0];
  const res = useMemo(() => runSim(prod, ac.nf, ac.cl, cal), [prod, ac.nf, ac.cl, cal]);
  const allRes = useMemo(() => scenarios.map((s) => { const p = PRODUCTS.find((x) => x.id === s.pid) || PRODUCTS[0]; return { s, p, r: runSim(p, s.nf, s.cl, cal) }; }), [scenarios, cal]);

  let totNet = 0, totCh = 0; allRes.forEach((r) => { if (r.r) { totNet += r.r.net; totCh += r.r.chN; } });
  const filtP = useMemo(() => PRODUCTS.filter((p) => (segF === "all" || p.seg === segF) && (!filter || p.n.toLowerCase().includes(filter.toLowerCase()) || p.cat.toLowerCase().includes(filter.toLowerCase()))), [segF, filter]);

  function copySummary() {
    const lines = ["SIMULACION ELASTICIDAD — A&M RIS", ""];
    allRes.forEach((r, i) => { if (!r.r) return; lines.push(`${i + 1}. ${r.p.n}: ${r.p.f} -> ${r.s.nf} ${r.p.u} | Churn ${r.r.ch.toFixed(1)}% (${fK(r.r.chN)}) | Neto ${r.r.net >= 0 ? "+" : ""}${fM(r.r.net)}`); });
    lines.push("", `TOTAL: Neto ${totNet >= 0 ? "+" : ""}${fM(totNet)} | Churn ${fK(totCh)}`);
    try { navigator.clipboard.writeText(lines.join("\n")); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const segButtons = [{ id: "all", n: "Todos" }, { id: "retail", n: "Personas" }, { id: "pyme", n: "Pymes" }, { id: "empresa", n: "Empresas" }, { id: "cib", n: "CIB" }];

  return <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: AM.navy, color: AM.white, minHeight: "100vh" }}><div style={{ background: `linear-gradient(135deg, ${AM.navyLight}, ${AM.navy})`, borderBottom: `2px solid ${AM.gold}33`, padding: "12px 24px" }}><div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}><span style={{ fontSize: 11, letterSpacing: 3, color: AM.gold, fontWeight: 700 }}>ALVAREZ & MARSAL</span><span style={{ width: 1, height: 12, background: AM.borderLight, display: "inline-block" }} /><span style={{ fontSize: 10, letterSpacing: 1.5, color: AM.gray400 }}>REVENUE IMPROVEMENT SOLUTIONS</span></div><h1 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Simulador de Elasticidad-Precio v2</h1></div><div style={{ display: "flex", gap: 8 }}><button onClick={() => setShowSum(!showSum)} style={{ padding: "7px 14px", borderRadius: 5, border: `1px solid ${showSum ? AM.gold : AM.border}`, background: showSum ? AM.gold + "15" : "transparent", color: showSum ? AM.gold : AM.gray400, cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><Layers size={13} /> Resumen {scenarios.length > 1 ? `(${scenarios.length})` : ""}</button><div style={{ background: AM.navy, border: `1px solid ${AM.border}`, borderRadius: 5, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><span style={{ color: AM.gray400 }}>Neto:</span><span style={{ fontWeight: 700, color: totNet >= 0 ? AM.greenLight : AM.redLight }}>{totNet >= 0 ? "+" : ""}{fM(totNet)}</span></div></div></div></div><div style={{ maxWidth: 1440, margin: "0 auto", padding: "14px 24px" }}><div style={{ display: "flex", gap: 4, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>{scenarios.map((s, i) => { const p = PRODUCTS.find((x) => x.id === s.pid) || PRODUCTS[0]; const r = allRes[i] ? allRes[i].r : null; return <button key={i} onClick={() => setAi(i)} style={{ padding: "6px 12px", borderRadius: 5, border: `1px solid ${i === ai ? AM.gold : AM.border}`, background: i === ai ? AM.gold + "12" : "transparent", color: i === ai ? AM.gold : AM.gray400, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 600 }}>{i + 1}.</span>{p.n.length > 22 ? p.n.substring(0, 22) + "…" : p.n}{r && <span style={{ fontSize: 9, fontWeight: 700, color: r.net >= 0 ? AM.green : AM.red, marginLeft: 4 }}>{r.net >= 0 ? "+" : ""}{fM(r.net)}</span>}{scenarios.length > 1 && i === ai && <span onClick={(ev) => { ev.stopPropagation(); removeScenario(i); }} style={{ marginLeft: 4, color: AM.gray500, cursor: "pointer", display: "flex" }}><X size={11} /></span>}</button>; })}<button onClick={addScenario} style={{ padding: "6px 10px", borderRadius: 5, border: `1px dashed ${AM.border}`, background: "transparent", color: AM.gray500, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> Añadir escenario</button></div><div style={{ display: "grid", gridTemplateColumns: "290px 1fr", gap: 16 }}><div><div style={{ display: "flex", gap: 3, marginBottom: 8, flexWrap: "wrap" }}>{segButtons.map((s) => <button key={s.id} onClick={() => setSegF(s.id)} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${segF === s.id ? AM.gold : AM.border}`, background: segF === s.id ? AM.gold + "12" : "transparent", color: segF === s.id ? AM.gold : AM.gray500, cursor: "pointer", fontSize: 9, fontWeight: segF === s.id ? 600 : 400 }}>{s.n}</button>)}</div><input type="text" placeholder="Buscar producto..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 4, border: `1px solid ${AM.border}`, background: AM.navyLight, color: AM.white, fontSize: 11, marginBottom: 8, outline: "none", boxSizing: "border-box" }} /><div style={{ maxHeight: 250, overflowY: "auto", marginBottom: 14, borderRadius: 6, border: `1px solid ${AM.border}` }}>{filtP.map((p) => { const sel = p.id === ac.pid; return <div key={p.id} onClick={() => selectProduct(p.id)} style={{ padding: "6px 10px", borderBottom: `1px solid ${AM.border}`, background: sel ? AM.gold + "10" : "transparent", color: sel ? AM.gold : AM.gray300, cursor: "pointer", fontSize: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: sel ? 600 : 400 }}>{p.n}</div><div style={{ fontSize: 8, color: AM.gray500 }}>{SN[p.seg]} · {p.cat}</div></div><div style={{ textAlign: "right", fontSize: 9 }}><div style={{ color: AM.gray400 }}>{fV(p.f, p.st)}</div><div style={{ color: AM.gray500 }}>{p.u}</div></div></div>; })}</div><div style={{ background: AM.navyLight, borderRadius: 6, padding: 14, border: `1px solid ${AM.border}`, marginBottom: 10 }}><div style={{ fontSize: 9, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Escenario #{ai + 1}: {prod.n}</div><div style={{ display: "flex", gap: 6, marginBottom: 10 }}><div style={{ flex: 1, background: AM.navy, borderRadius: 4, padding: "6px 10px" }}><div style={{ fontSize: 8, color: AM.gray500 }}>Actual</div><div style={{ fontSize: 14, fontWeight: 700, color: AM.gray300 }}>{fV(prod.f, prod.st)}</div></div><div style={{ display: "flex", alignItems: "center" }}><ArrowRight size={12} color={AM.gray500} /></div><div style={{ flex: 1, background: AM.navy, borderRadius: 4, padding: "6px 10px", border: `1px solid ${ac.nf !== prod.f ? (ac.nf > prod.f ? AM.red : AM.green) + "44" : AM.border}` }}><div style={{ fontSize: 8, color: AM.gray500 }}>Nuevo</div><div style={{ fontSize: 14, fontWeight: 700, color: ac.nf > prod.f ? AM.redLight : ac.nf < prod.f ? AM.greenLight : AM.gray300 }}>{fV(ac.nf, prod.st)}</div></div></div><div style={{ marginBottom: 10 }}><input type="range" min={prod.lo} max={prod.hi} step={prod.st} value={ac.nf} onChange={(e) => updateScenario(ai, "nf", parseFloat(e.target.value))} style={{ width: "100%", accentColor: ac.nf > prod.f ? AM.red : AM.green, cursor: "pointer" }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: AM.gray500 }}><span>{prod.lo}</span><span>{prod.u}</span><span>{prod.hi}</span></div></div><div style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}><span style={{ color: AM.gray400 }}>Clientes activos</span><span style={{ color: AM.tealLight, fontWeight: 600 }}>{fK(ac.cl)}</span></div><input type="range" min={5000} max={5000000} step={5000} value={ac.cl} onChange={(e) => updateScenario(ai, "cl", parseInt(e.target.value))} style={{ width: "100%", accentColor: AM.tealLight, cursor: "pointer" }} /></div><div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}><span style={{ color: AM.gray400 }}>Calibración elasticidad</span><span style={{ color: AM.gold, fontWeight: 600 }}>{`ε = ${res ? res.ea.toFixed(2) : "—"}`}</span></div><input type="range" min={0} max={1} step={0.05} value={cal} onChange={(e) => setCal(parseFloat(e.target.value))} style={{ width: "100%", accentColor: AM.gold, cursor: "pointer" }} /></div></div><button onClick={() => setShowSrc(!showSrc)} style={{ width: "100%", padding: "8px 12px", borderRadius: 5, border: `1px solid ${AM.border}`, background: "transparent", color: AM.gray500, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><Info size={11} /> Fuentes y supuestos</span>{showSrc ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</button>{showSrc && <div style={{ marginTop: 4, padding: "10px 12px", background: AM.navyLight, borderRadius: 5, border: `1px solid ${AM.border}`, fontSize: 9, color: AM.gray400, lineHeight: 1.5 }}><div style={{ color: AM.gold, fontWeight: 600, marginBottom: 4 }}>Papers de referencia</div><div>BCE Working Paper #2847 (2023) — Price elasticity retail banking</div><div>BIS Quarterly Review, Sep 2022 — Switching costs</div><div style={{ marginTop: 6 }}>Cat: {prod.cat} | Base: {ECAT[prod.cat] ? ECAT[prod.cat].e : "?"}</div></div>}</div><div>{!res ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 350, color: AM.gray500, textAlign: "center" }}><div><Sliders size={36} color={AM.gray600} style={{ marginBottom: 10 }} /><div>Mueve el slider de precio para simular</div></div></div> : <div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}><div style={{ background: AM.navyLight, borderRadius: 6, padding: "10px 14px", border: `1px solid ${AM.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>{res.pc > 0 ? <ArrowUpRight size={11} color={AM.redLight} /> : <ArrowDownRight size={11} color={AM.greenLight} />}<span style={{ fontSize: 8, color: AM.gray400, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Delta Precio</span></div><div style={{ fontSize: 22, fontWeight: 700, color: res.pc > 0 ? AM.redLight : AM.greenLight, lineHeight: 1 }}>{res.pc > 0 ? "+" : ""}{res.pc.toFixed(1)}%</div></div><div style={{ background: AM.navyLight, borderRadius: 6, padding: "10px 14px", border: `1px solid ${AM.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}><Users size={11} color={AM.redLight} /><span style={{ fontSize: 8, color: AM.gray400, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Churn</span></div><div style={{ fontSize: 22, fontWeight: 700, color: AM.redLight, lineHeight: 1 }}>{res.ch.toFixed(1)}%</div></div><div style={{ background: AM.navyLight, borderRadius: 6, padding: "10px 14px", border: `1px solid ${AM.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}><TrendingUp size={11} color={AM.greenLight} /><span style={{ fontSize: 8, color: AM.gray400, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Ingreso subida</span></div><div style={{ fontSize: 22, fontWeight: 700, color: AM.greenLight, lineHeight: 1 }}>+{fM(res.revG)}</div></div><div style={{ background: AM.navyLight, borderRadius: 6, padding: "10px 14px", border: `1px solid ${AM.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>{res.net >= 0 ? <Zap size={11} color={AM.greenLight} /> : <AlertTriangle size={11} color={AM.redLight} />}<span style={{ fontSize: 8, color: AM.gray400, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Neto P&L</span></div><div style={{ fontSize: 22, fontWeight: 700, color: res.net >= 0 ? AM.greenLight : AM.redLight, lineHeight: 1 }}>{res.net >= 0 ? "+" : ""}{fM(res.net)}</div></div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}><div style={{ background: AM.navyLight, borderRadius: 6, padding: "14px 16px", border: `1px solid ${AM.border}` }}><div style={{ fontSize: 9, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Sensibilidad por segmento</div>{res.segs.map((s, i) => <BarH key={i} label={`${s.name} (${(s.share * 100).toFixed(0)}%)`} value={s.churnPct} maxVal={60} color={s.c} sub={`${s.churnPct.toFixed(1)}% · ${fK(s.churned)}`} />)}</div><div style={{ background: AM.navyLight, borderRadius: 6, padding: "14px 16px", border: `1px solid ${AM.border}` }}><div style={{ fontSize: 9, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Migración ({fK(res.chN)} clientes)</div>{res.cr.map((cr, i) => { const colors = [AM.tealLight, AM.amber, AM.redLight]; const col = colors[i] || AM.gray400; return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${AM.border}` }}><div style={{ width: 28, height: 28, borderRadius: 5, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: col }}>{(cr.s * 100).toFixed(0)}%</div><div><div style={{ fontSize: 11, fontWeight: 500 }}>{cr.l}</div><div style={{ fontSize: 9, color: AM.gray500 }}>{fK(cr.clients)} clientes</div></div></div>; })}</div></div></div>}</div></div><div style={{ textAlign: "center", padding: "14px 0 20px", fontSize: 8, color: AM.gray600, borderTop: `1px solid ${AM.border}`, marginTop: 16 }}><span style={{ color: AM.goldDim, fontWeight: 600, letterSpacing: 1.5 }}>CONFIDENCIAL</span> | Alvarez & Marsal · Revenue Improvement Solutions | Feb 2026 · v2</div></div></div>;
}
