'use client';
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Building2, CreditCard, Landmark, TrendingUp, BarChart3, Shield,
  Store, Briefcase, Wallet, Globe, ChevronDown, ChevronRight, Search,
  Target, AlertCircle, LineChart, Layers, Building, Factory, Banknote,
  HandCoins, Receipt, BadgeDollarSign, ExternalLink, FolderOpen,
  Plus, Save, Trash2, AlertTriangle, ArrowUpRight, ArrowDownRight,
  CircleDollarSign, Zap, TrendingDown, ChevronUp, Info, X, ArrowRight
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// A&M RIS — BENCHMARK COMPETITIVO v3
// ═══════════════════════════════════════════════════════════════

const AM = {
  navy: "#00263A", navyLight: "#003B5C", navyMid: "#002E4A",
  teal: "#005B7F", tealLight: "#0080B0",
  gold: "#D4A843", goldLight: "#E8C46A", goldDim: "#8B7535",
  amber: "#E88C1E",
  white: "#FFFFFF", gray100: "#F4F6F8", gray200: "#E2E6EA",
  gray300: "#C5CCD3", gray400: "#8A95A0", gray500: "#5A6570", gray600: "#3D4750",
  border: "#1B3A4D", borderLight: "#2A5068",
  green: "#2E8B57", greenLight: "#3AAD6E",
  red: "#C0392B", redLight: "#E74C3C",
};

// ═══ BANK DEFINITIONS WITH SVG LOGOS ═══
const BANKS = [
  { id: "santander", name: "Santander", short: "SAN", color: "#EC0000", bg: "#EC0000", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Banco_Santander_Logotipo.svg" },
  { id: "bchile", name: "Banco de Chile", short: "BCH", color: "#00205B", bg: "#00205B", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Banco_de_Chile_logo.svg" },
  { id: "bci", name: "BCI", short: "BCI", color: "#FF6600", bg: "#FF6600", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Logo_BCI.svg" },
  { id: "scotiabank", name: "Scotiabank", short: "SCO", color: "#EC111A", bg: "#EC111A", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Scotiabank_logo.svg" },
  { id: "itau", name: "Itaú", short: "ITÚ", color: "#003778", bg: "#FF6200", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Ita%C3%BA_Unibanco_logo_2023.svg" },
  { id: "bEstado", name: "BancoEstado", short: "BES", color: "#009B3A", bg: "#009B3A", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/BancoEstado_logo.svg" },
  { id: "bice", name: "BICE", short: "BIC", color: "#1A1F71", bg: "#1A1F71", text: "#FFF" },
  { id: "security", name: "Security", short: "SEC", color: "#003366", bg: "#003366", text: "#FFF" },
  { id: "falabella", name: "Falabella", short: "FAL", color: "#8CC63F", bg: "#8CC63F", text: "#FFF", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Banco_Falabella_logo.svg" },
  { id: "consorcio", name: "Consorcio", short: "CON", color: "#7B2D8E", bg: "#7B2D8E", text: "#FFF" },
];

function BankBadge({ bank, size = 28 }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: 5,
      background: bank.bg, color: bank.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800, letterSpacing: -0.5,
      flexShrink: 0, lineHeight: 1, overflow: "hidden",
      border: bank.isClient ? "2px solid #EC0000" : `1px solid ${bank.bg}88`,
      boxShadow: bank.isClient ? "0 0 8px #EC000044" : undefined,
    }}>
      {bank.logo && !failed ? (
        <img src={bank.logo} alt={bank.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff", padding: 2 }} onError={() => setFailed(true)} />
      ) : bank.short}
    </div>
  );
}

const SEGMENTS = [
  { id: "retail", name: "Personas", icon: Building2 },
  { id: "pyme", name: "Pymes", icon: Store },
  { id: "empresa", name: "Empresas", icon: Factory },
  { id: "cib", name: "CIB", icon: LineChart },
];

const VIEWS = [
  { id: "benchmark", name: "Benchmark", icon: BarChart3 },
  { id: "opportunities", name: "Oportunidades", icon: Zap },
  { id: "projects", name: "Proyectos", icon: FolderOpen },
];

const CAT_ICONS = {
  "Cuentas": Landmark, "Tarjetas de Crédito": CreditCard,
  "Financiamiento Consumo": Banknote, "Hipotecario": Building,
  "Inversión": TrendingUp, "Seguros Bancaseguros": Shield,
  "Cuenta Corriente Empresa": Wallet, "Financiamiento Pyme": HandCoins,
  "Medios de Pago / Adquirencia": Receipt, "Cash Management": BadgeDollarSign,
  "Financiamiento Corporativo": Briefcase, "Comercio Exterior": Globe,
  "Banca de Inversión": BarChart3, "Markets & Trading": LineChart,
};

// ═══ SOURCES REGISTRY ═══
const SOURCES = {
  cmf_tasas: { name: "CMF — Tasas de interés", url: "https://tasas.cmfchile.cl/", type: "regulador" },
  cmf_comisiones: { name: "CMF — Comisiones bancarias", url: "https://www.cmfchile.cl/portal/estadisticas/617/w3-propertyvalue-30179.html", type: "regulador" },
  cmf_simulador: { name: "CMF — Simulador cuentas vista", url: "https://servicios.cmfchile.cl/simuladorcuentavista/simulacionpromedio", type: "regulador" },
  sernac_cc: { name: "SERNAC — Estudio cuentas corrientes", url: "https://www.sernac.cl/portal/619/w3-article-3604.html", type: "regulador" },
  san_tarifas: { name: "Santander Chile — Tarifas", url: "https://banco.santander.cl/tarifas-y-comisiones", type: "banco" },
  san_planes: { name: "Santander Chile — Planes personas", url: "https://banco.santander.cl/uploads/000/016/836/3efd86a6-4a06-47cc-a9b7-e420cae2ee45/original/Tarifas_Planes_BBPP_VF.pdf", type: "banco" },
  san_tc: { name: "Santander Chile — Tarjetas crédito", url: "https://www.santander.cl/tarifas_comisiones/tasas_tarjeta_credito.asp", type: "banco" },
  bch_tarifas: { name: "Banco de Chile — Tarifas", url: "https://www.bancochile.cl/tarifas", type: "banco" },
  bci_tarifas: { name: "BCI — Tarifas y comisiones", url: "https://www.bci.cl/corporacion/tarifas-y-comisiones", type: "banco" },
  sco_tarifas: { name: "Scotiabank Chile — Tarifas", url: "https://cdn.aglty.io/scotiabank-chile/scotiabankpdf/tarifa-cuenta-corriente.pdf", type: "banco" },
  itau_tarifas: { name: "Itaú Chile — Tarifas y contratos", url: "https://ww2.itau.cl/personas/documentacion-normativa/tarifas-y-contratos", type: "banco" },
  bes_tarifas: { name: "BancoEstado — Tarifas", url: "https://www.bancoestado.cl/imagenes/cuentacorriente/TarifasCuentaCorrienteBancoEstado.pdf", type: "banco" },
  rankia_cc: { name: "Rankia — Comparativa CC Chile 2026", url: "https://www.rankia.cl/blog/mejores-cuentas-bancarias/3243484-cuales-son-mejores-cuentas-corrientes", type: "análisis" },
  comparaonline: { name: "ComparaOnline — Cuentas corrientes", url: "https://www.comparaonline.cl/cuenta-corriente", type: "análisis" },
};

// ═══ FULL PRODUCT DATA ═══
const PRODUCTS = {
  retail: [
    {
      category: "Cuentas",
      products: [
        { name: "Cuenta Corriente — Plan Básico", unit: "UF/mes", fees: { santander: 0.20, bchile: 0.18, bci: 0.15, scotiabank: 0.00, itau: 0.00, bEstado: 0.06, bice: 0.00, security: 0.22, falabella: 0.10, consorcio: 0.11 }, notes: "Scotiabank e Itaú $0 para jóvenes (<29). BancoEstado $0 con 2 condiciones.", sources: ["san_planes", "sco_tarifas", "itau_tarifas", "sernac_cc", "cmf_simulador"] },
        { name: "Cuenta Corriente — Plan Premium", unit: "UF/mes", fees: { santander: 0.65, bchile: 0.58, bci: 0.52, scotiabank: 0.55, itau: 0.40, bEstado: null, bice: 0.35, security: 0.48, falabella: null, consorcio: null }, notes: "Incluye TC, TD, línea y seguro. Santander LATAM Pass Limited el más caro.", sources: ["san_planes", "sco_tarifas", "rankia_cc"] },
        { name: "Cuenta Vista / Prepago", unit: "UF/mes", fees: { santander: 0.00, bchile: 0.00, bci: 0.00, scotiabank: 0.00, itau: 0.00, bEstado: 0.00, bice: 0.00, security: null, falabella: 0.00, consorcio: 0.00 }, notes: "Regulado, sin costo. CuentaRUT domina (~15M usuarios).", sources: ["cmf_simulador", "bes_tarifas"] },
        { name: "Cuenta Corriente USD", unit: "USD/mes", fees: { santander: 10, bchile: 15, bci: 12, scotiabank: 0, itau: 8, bEstado: null, bice: 10, security: 15, falabella: null, consorcio: null }, notes: "Scotiabank incluye USD sin costo en Plan Futuro.", sources: ["sco_tarifas", "san_tarifas"] },
        { name: "Depósito a Plazo (spread vs ref.)", unit: "pb", fees: { santander: 45, bchile: 40, bci: 42, scotiabank: 50, itau: 35, bEstado: 55, bice: 30, security: 38, falabella: 48, consorcio: 32 }, notes: "BICE y Consorcio mejores tasas para captar depósitos.", sources: ["cmf_tasas"], invert: true },
      ]
    },
    {
      category: "Tarjetas de Crédito",
      products: [
        { name: "TC Clásica — Mantención anual", unit: "UF/año", fees: { santander: 1.20, bchile: 1.10, bci: 0.95, scotiabank: 0.90, itau: 0.80, bEstado: 0.75, bice: 0.85, security: 1.00, falabella: 0.00, consorcio: 0.70 }, notes: "Falabella $0 (modelo retail). Consorcio muy competitivo.", sources: ["san_tc", "cmf_comisiones", "comparaonline"] },
        { name: "TC Gold / Platinum — Mant. anual", unit: "UF/año", fees: { santander: 2.80, bchile: 2.50, bci: 2.20, scotiabank: 2.40, itau: 2.10, bEstado: null, bice: 1.90, security: 2.30, falabella: 0.90, consorcio: 1.50 }, notes: "Santander LATAM Pass alto por programa de millas.", sources: ["san_tc", "cmf_comisiones"] },
        { name: "TC Black / Infinite — Mant. anual", unit: "UF/año", fees: { santander: 5.50, bchile: 5.00, bci: 4.80, scotiabank: 4.50, itau: 4.20, bEstado: null, bice: 3.80, security: null, falabella: null, consorcio: null }, notes: "Ultra-premium. BICE agresivo para patrimoniales.", sources: ["san_tc", "cmf_comisiones"] },
        { name: "Avance efectivo TC", unit: "% monto", fees: { santander: 3.50, bchile: 3.50, bci: 3.00, scotiabank: 3.50, itau: 3.00, bEstado: 3.00, bice: 3.00, security: 3.50, falabella: 3.50, consorcio: 3.00 }, notes: "Homogéneo entre 3–3.5%.", sources: ["cmf_comisiones"] },
        { name: "Compra internacional (FX markup)", unit: "%", fees: { santander: 2.50, bchile: 2.00, bci: 2.50, scotiabank: 2.50, itau: 2.00, bEstado: 2.50, bice: 2.00, security: 2.50, falabella: 2.50, consorcio: 2.00 }, notes: "Oportunidad de diferenciación. Bco Chile, Itaú, BICE al 2%.", sources: ["cmf_comisiones", "san_tc"] },
        { name: "Tasa interés rotativo", unit: "% anual", fees: { santander: 28.8, bchile: 30.0, bci: 27.6, scotiabank: 29.4, itau: 26.4, bEstado: 25.2, bice: 24.0, security: 28.0, falabella: 36.0, consorcio: 27.0 }, notes: "TMC vigente ~39.6%. Falabella la más alta. BICE la más baja.", sources: ["cmf_tasas"] },
      ]
    },
    {
      category: "Financiamiento Consumo",
      products: [
        { name: "Crédito consumo 12M", unit: "% CAE", fees: { santander: 32.5, bchile: 34.0, bci: 30.8, scotiabank: 33.2, itau: 29.5, bEstado: 28.0, bice: 27.5, security: 31.0, falabella: 38.5, consorcio: 30.0 }, notes: "BancoEstado y BICE más baratos. Falabella muy caro.", sources: ["cmf_tasas", "comparaonline"] },
        { name: "Crédito consumo 36M", unit: "% CAE", fees: { santander: 28.0, bchile: 29.5, bci: 26.5, scotiabank: 28.8, itau: 25.0, bEstado: 24.5, bice: 23.5, security: 27.0, falabella: 35.0, consorcio: 26.0 }, notes: "Plazos largos comprimen CAE.", sources: ["cmf_tasas"] },
        { name: "Línea de crédito (sobregiro)", unit: "% mensual", fees: { santander: 2.80, bchile: 2.90, bci: 2.60, scotiabank: 2.75, itau: 2.50, bEstado: 2.40, bice: 2.30, security: 2.70, falabella: 3.20, consorcio: 2.55 }, notes: "Producto de alto margen. Santander medio-alto.", sources: ["cmf_tasas", "san_tarifas"] },
        { name: "Crédito automotriz", unit: "% CAE", fees: { santander: 18.5, bchile: 19.0, bci: 17.5, scotiabank: 18.0, itau: 16.5, bEstado: 17.0, bice: 16.0, security: 18.5, falabella: null, consorcio: null }, notes: "Forum (Scotiabank) líder. BICE agresivo.", sources: ["cmf_tasas"] },
      ]
    },
    {
      category: "Hipotecario",
      products: [
        { name: "Tasa fija UF (80% LTV)", unit: "% CAE", fees: { santander: 5.20, bchile: 5.10, bci: 4.95, scotiabank: 5.15, itau: 4.80, bEstado: 4.60, bice: 4.50, security: 5.00, falabella: null, consorcio: null }, notes: "BancoEstado y BICE lideran. Santander rango medio.", sources: ["cmf_tasas"] },
        { name: "Tasa mixta (3–5a fija)", unit: "% CAE", fees: { santander: 4.80, bchile: 4.70, bci: 4.55, scotiabank: 4.75, itau: 4.40, bEstado: 4.30, bice: 4.20, security: 4.60, falabella: null, consorcio: null }, notes: "Producto en crecimiento.", sources: ["cmf_tasas"] },
        { name: "Comisión prepago", unit: "meses int.", fees: { santander: 1.5, bchile: 1.5, bci: 1.5, scotiabank: 1.5, itau: 1.0, bEstado: 1.5, bice: 1.0, security: 1.5, falabella: null, consorcio: null }, notes: "Regulado. Itaú y BICE ofrecen 1 mes.", sources: ["cmf_comisiones"] },
        { name: "Seguro desgravamen", unit: "% saldo/año", fees: { santander: 0.024, bchile: 0.022, bci: 0.020, scotiabank: 0.023, itau: 0.019, bEstado: 0.018, bice: 0.017, security: 0.021, falabella: null, consorcio: null }, notes: "Impacto acumulado significativo a largo plazo.", sources: ["cmf_comisiones"] },
      ]
    },
    {
      category: "Inversión",
      products: [
        { name: "FFMM Renta Fija — Admin.", unit: "% anual", fees: { santander: 1.20, bchile: 1.10, bci: 0.95, scotiabank: 1.15, itau: 0.90, bEstado: 0.80, bice: 0.75, security: 1.00, falabella: 1.30, consorcio: 0.85 }, notes: "BICE y Consorcio lideran.", sources: ["cmf_comisiones"] },
        { name: "FFMM Renta Variable — Admin.", unit: "% anual", fees: { santander: 2.80, bchile: 2.50, bci: 2.30, scotiabank: 2.60, itau: 2.20, bEstado: 2.00, bice: 1.80, security: 2.40, falabella: null, consorcio: 2.10 }, notes: "BICE claramente más competitivo.", sources: ["cmf_comisiones"] },
        { name: "Corretaje acciones", unit: "% op.", fees: { santander: 0.50, bchile: 0.50, bci: 0.40, scotiabank: 0.50, itau: 0.45, bEstado: null, bice: 0.30, security: 0.35, falabella: null, consorcio: null }, notes: "BICE y Security referentes.", sources: ["cmf_comisiones"] },
        { name: "Custodia valores", unit: "% anual", fees: { santander: 0.25, bchile: 0.20, bci: 0.18, scotiabank: 0.22, itau: 0.15, bEstado: null, bice: 0.12, security: 0.15, falabella: null, consorcio: null }, notes: "BICE más competitivo.", sources: ["cmf_comisiones"] },
      ]
    },
    {
      category: "Seguros Bancaseguros",
      products: [
        { name: "Seguro fraude TC", unit: "UF/mes", fees: { santander: 0.05, bchile: 0.05, bci: 0.04, scotiabank: 0.05, itau: 0.04, bEstado: 0.03, bice: 0.04, security: 0.05, falabella: 0.04, consorcio: 0.04 }, notes: "Alta penetración. Margen relevante.", sources: ["cmf_comisiones"] },
        { name: "Seguro cesantía crédito", unit: "% cuota", fees: { santander: 2.50, bchile: 2.80, bci: 2.20, scotiabank: 2.50, itau: 2.00, bEstado: 1.80, bice: 2.00, security: 2.50, falabella: 3.00, consorcio: 2.20 }, notes: "Falabella prima más alta.", sources: ["cmf_comisiones"] },
      ]
    },
  ],
  pyme: [
    {
      category: "Cuenta Corriente Empresa",
      products: [
        { name: "Plan Pyme Básico", unit: "UF/mes", fees: { santander: 0.35, bchile: 0.30, bci: 0.25, scotiabank: 0.28, itau: 0.22, bEstado: 0.15, bice: 0.30, security: 0.35, falabella: null, consorcio: null }, notes: "BancoEstado líder. Santander rango alto.", sources: ["san_tarifas", "bes_tarifas"] },
        { name: "Plan Pyme Premium", unit: "UF/mes", fees: { santander: 0.85, bchile: 0.75, bci: 0.65, scotiabank: 0.70, itau: 0.60, bEstado: null, bice: null, security: null, falabella: null, consorcio: null }, notes: "Integrado con línea, TC empresarial y seguros.", sources: ["san_tarifas"] },
        { name: "TEF masivas", unit: "CLP/transf", fees: { santander: 120, bchile: 100, bci: 85, scotiabank: 110, itau: 90, bEstado: 70, bice: 100, security: 130, falabella: null, consorcio: null }, notes: "Nóminas y proveedores. BancoEstado más barato.", sources: ["san_tarifas", "bci_tarifas"] },
      ]
    },
    {
      category: "Financiamiento Pyme",
      products: [
        { name: "Crédito capital trabajo", unit: "% anual", fees: { santander: 14.5, bchile: 13.8, bci: 12.5, scotiabank: 14.0, itau: 12.0, bEstado: 11.0, bice: 12.5, security: 14.5, falabella: null, consorcio: null }, notes: "BancoEstado + FOGAPE mejores condiciones.", sources: ["cmf_tasas"] },
        { name: "Línea de crédito Pyme", unit: "% mensual", fees: { santander: 2.50, bchile: 2.40, bci: 2.20, scotiabank: 2.35, itau: 2.10, bEstado: 1.90, bice: 2.20, security: 2.50, falabella: null, consorcio: null }, notes: "Margen alto. BancoEstado vía FOGAPE.", sources: ["cmf_tasas"] },
        { name: "Factoring", unit: "% desc./mes", fees: { santander: 1.80, bchile: 1.70, bci: 1.50, scotiabank: 1.75, itau: 1.45, bEstado: 1.30, bice: 1.60, security: 1.80, falabella: null, consorcio: null }, notes: "BCI e Itaú competitivos.", sources: ["cmf_tasas"] },
        { name: "Leasing (spread s/base)", unit: "pb", fees: { santander: 280, bchile: 260, bci: 240, scotiabank: 270, itau: 230, bEstado: 220, bice: 250, security: 280, falabella: null, consorcio: null }, notes: "Concentrado en los 6 grandes.", sources: ["cmf_tasas"] },
        { name: "Boleta de garantía", unit: "% trim.", fees: { santander: 0.75, bchile: 0.70, bci: 0.60, scotiabank: 0.70, itau: 0.55, bEstado: 0.50, bice: 0.65, security: 0.75, falabella: null, consorcio: null }, notes: "Clave para contratos públicos.", sources: ["cmf_comisiones"] },
      ]
    },
    {
      category: "Medios de Pago / Adquirencia",
      products: [
        { name: "POS — Merchant débito", unit: "% venta", fees: { santander: 0.80, bchile: 0.80, bci: 0.75, scotiabank: 0.80, itau: 0.75, bEstado: 0.70, bice: null, security: null, falabella: null, consorcio: null }, notes: "Post-Transbank. Nuevos adquirentes.", sources: ["cmf_comisiones"] },
        { name: "POS — Merchant crédito", unit: "% venta", fees: { santander: 1.80, bchile: 1.80, bci: 1.70, scotiabank: 1.80, itau: 1.70, bEstado: 1.60, bice: null, security: null, falabella: null, consorcio: null }, notes: "Interchange regulado CMF.", sources: ["cmf_comisiones"] },
        { name: "E-commerce gateway", unit: "%", fees: { santander: 2.95, bchile: 2.90, bci: 2.80, scotiabank: 2.95, itau: 2.75, bEstado: null, bice: null, security: null, falabella: null, consorcio: null }, notes: "Competencia con Mercado Pago, Flow.", sources: ["cmf_comisiones"] },
      ]
    },
  ],
  empresa: [
    {
      category: "Cash Management",
      products: [
        { name: "Cta. Cte. empresa", unit: "UF/mes", fees: { santander: 0.80, bchile: 0.70, bci: 0.60, scotiabank: 0.65, itau: 0.55, bEstado: 0.40, bice: 0.65, security: 0.75, falabella: null, consorcio: null }, notes: "Negociado según volumen.", sources: ["san_tarifas"] },
        { name: "SWIFT", unit: "USD flat", fees: { santander: 35, bchile: 40, bci: 30, scotiabank: 35, itau: 30, bEstado: 45, bice: 35, security: 40, falabella: null, consorcio: null }, notes: "BCI e Itaú más competitivos.", sources: ["san_tarifas", "bci_tarifas"] },
        { name: "Cash pooling (setup)", unit: "USD", fees: { santander: 500, bchile: 750, bci: 400, scotiabank: 600, itau: 350, bEstado: null, bice: 500, security: null, falabella: null, consorcio: null }, notes: "Diferenciador multinacionales.", sources: ["san_tarifas"] },
      ]
    },
    {
      category: "Financiamiento Corporativo",
      products: [
        { name: "Bilateral (s/TAB)", unit: "pb", fees: { santander: 180, bchile: 170, bci: 160, scotiabank: 175, itau: 155, bEstado: 150, bice: 170, security: 185, falabella: null, consorcio: null }, notes: "Según rating y relación.", sources: ["cmf_tasas"] },
        { name: "Sindicado — Estructuración", unit: "pb flat", fees: { santander: 75, bchile: 70, bci: 65, scotiabank: 70, itau: 60, bEstado: null, bice: 65, security: null, falabella: null, consorcio: null }, notes: "Santander compite con red global.", sources: ["cmf_tasas"] },
        { name: "Boleta garantía empresa", unit: "% trim.", fees: { santander: 0.50, bchile: 0.45, bci: 0.40, scotiabank: 0.45, itau: 0.38, bEstado: 0.35, bice: 0.42, security: 0.50, falabella: null, consorcio: null }, notes: "Minería e infraestructura.", sources: ["cmf_comisiones"] },
      ]
    },
    {
      category: "Comercio Exterior",
      products: [
        { name: "Carta de crédito", unit: "% monto", fees: { santander: 0.20, bchile: 0.25, bci: 0.18, scotiabank: 0.22, itau: 0.18, bEstado: 0.25, bice: 0.20, security: 0.25, falabella: null, consorcio: null }, notes: "BCI e Itaú con pricing agresivo.", sources: ["san_tarifas", "cmf_comisiones"] },
        { name: "Cobranza documentaria", unit: "USD flat", fees: { santander: 80, bchile: 90, bci: 70, scotiabank: 85, itau: 65, bEstado: 95, bice: 80, security: 90, falabella: null, consorcio: null }, notes: "Itaú benchmark red Latam.", sources: ["san_tarifas"] },
        { name: "FX Spot USD/CLP", unit: "CLP sprd", fees: { santander: 3.5, bchile: 4.0, bci: 3.0, scotiabank: 3.5, itau: 2.8, bEstado: 5.0, bice: 3.5, security: 4.0, falabella: null, consorcio: null }, notes: "Itaú y BCI más ajustados.", sources: ["cmf_tasas"] },
        { name: "Forward USD/CLP", unit: "pb", fees: { santander: 15, bchile: 18, bci: 12, scotiabank: 15, itau: 10, bEstado: 25, bice: 15, security: 18, falabella: null, consorcio: null }, notes: "Itaú y BCI líderes mesa.", sources: ["cmf_tasas"] },
      ]
    },
  ],
  cib: [
    {
      category: "Banca de Inversión",
      products: [
        { name: "M&A Advisory — Fee éxito", unit: "% deal", fees: { santander: 1.50, bchile: 1.50, bci: 1.20, scotiabank: 1.50, itau: 1.30, bEstado: null, bice: 1.00, security: null, falabella: null, consorcio: null }, notes: "BICE mid-market. Santander/Scotia large-cap.", sources: ["cmf_comisiones"] },
        { name: "Project Finance", unit: "pb flat", fees: { santander: 100, bchile: 95, bci: 85, scotiabank: 90, itau: 80, bEstado: null, bice: 90, security: null, falabella: null, consorcio: null }, notes: "Santander activo renovables. Chile líder Latam PF.", sources: ["cmf_comisiones"] },
        { name: "Bonos corp. — Colocación", unit: "pb", fees: { santander: 40, bchile: 35, bci: 30, scotiabank: 35, itau: 30, bEstado: null, bice: 35, security: null, falabella: null, consorcio: null }, notes: "BCI e Itaú dominan volumen.", sources: ["cmf_comisiones"] },
      ]
    },
    {
      category: "Markets & Trading",
      products: [
        { name: "Renta fija — Spread BCU", unit: "pb", fees: { santander: 5, bchile: 4, bci: 3, scotiabank: 5, itau: 3, bEstado: 6, bice: 4, security: 5, falabella: null, consorcio: null }, notes: "BCI e Itaú más tight.", sources: ["cmf_tasas"] },
        { name: "IRS — Spread", unit: "pb", fees: { santander: 3, bchile: 3, bci: 2, scotiabank: 3, itau: 2, bEstado: null, bice: 3, security: null, falabella: null, consorcio: null }, notes: "Concentrado en 5 bancos.", sources: ["cmf_tasas"] },
        { name: "Custodia institucional", unit: "pb/año", fees: { santander: 8, bchile: 7, bci: 6, scotiabank: 8, itau: 5, bEstado: null, bice: 5, security: 6, falabella: null, consorcio: null }, notes: "Itaú y BICE líderes.", sources: ["cmf_comisiones"] },
      ]
    },
  ],
};

function getPosition(bankId, fees) {
  const vals = Object.entries(fees).filter(([, v]) => v !== null && v !== undefined).map(([, v]) => v);
  if (fees[bankId] === null || fees[bankId] === undefined) return null;
  const val = fees[bankId];
  const sorted = [...new Set(vals)].sort((a, b) => a - b);
  const pos = sorted.indexOf(val) + 1;
  return { position: pos, total: sorted.length, percentile: sorted.length > 1 ? ((pos - 1) / (sorted.length - 1)) * 100 : 50 };
}

function posColor(pct, inv) {
  const p = inv ? 100 - pct : pct;
  if (p <= 25) return AM.green;
  if (p <= 50) return AM.tealLight;
  if (p <= 75) return AM.amber;
  return AM.red;
}

function fmt(v, u) {
  if (v === null || v === undefined) return "—";
  if (typeof v !== "number") return v;
  if (u?.includes("UF") && v < 1) return v.toFixed(2);
  if (v < 0.1) return v.toFixed(3);
  if (v >= 100) return v.toLocaleString();
  return String(v);
}

const METRIC_HELP = [
  "UF/mes: cargo mensual expresado en Unidad de Fomento.",
  "%: porcentaje sobre monto, saldo o venta según producto.",
  "pb: puntos base (100 pb = 1%).",
  "Percentil: posición relativa del banco entre competidores.",
  "Ranking (x/y): puesto absoluto en el comparativo.",
  "Invert logic: en métricas de beneficio mayor valor es mejor.",
  "Gap%: diferencia porcentual del cliente versus benchmark líder.",
];

// ═══ OPPORTUNITIES ENGINE ═══
function computeOpportunities(clientId, allProducts) {
  const opps = [];
  Object.entries(allProducts).forEach(([seg, cats]) => {
    cats.forEach(cat => {
      cat.products.forEach(p => {
        const clientVal = p.fees[clientId];
        if (clientVal === null || clientVal === undefined) return;
        const others = Object.entries(p.fees).filter(([k, v]) => k !== clientId && v !== null && v !== undefined);
        if (others.length === 0) return;
        const inv = !!p.invert;
        const pos = getPosition(clientId, p.fees);
        if (!pos) return;
        const cheapest = inv ? Math.max(...others.map(([,v]) => v)) : Math.min(...others.map(([,v]) => v));
        const cheapestBank = others.find(([,v]) => v === cheapest);
        const gap = inv ? (cheapest - clientVal) : (clientVal - cheapest);
        const gapPct = clientVal !== 0 ? (gap / clientVal * 100) : 0;
        if ((!inv && pos.percentile >= 60) || (inv && pos.percentile <= 40)) {
          opps.push({
            segment: seg, category: cat.category, product: p.name, unit: p.unit,
            clientVal, bestVal: cheapest, bestBank: cheapestBank ? cheapestBank[0] : null,
            gap, gapPct, percentile: pos.percentile, position: pos.position, total: pos.total,
            notes: p.notes, inv, sources: p.sources || [],
          });
        }
      });
    });
  });
  return opps.sort((a, b) => b.gapPct - a.gapPct);
}

// ═══ MAIN COMPONENT ═══
export default function App() {
  const [view, setView] = useState("benchmark");
  const [segment, setSegment] = useState("retail");
  const [selectedBanks, setSelectedBanks] = useState(BANKS.map(b => b.id));
  const [expandedCats, setExpandedCats] = useState(new Set([0]));
  const [search, setSearch] = useState("");
  const [detailProduct, setDetailProduct] = useState(null);

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/benchmark/projects', { cache: 'no-store' });
      const data = await res.json();
      const list = data.projects || [];
      setProjects(list);
      setActiveProject(prev => prev || list[0]?.id || null);
    } catch (e) {
      console.error('Cannot load benchmark projects', e);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const products = PRODUCTS[segment] || [];
  const filtered = useMemo(() => {
    if (!search) return products;
    return products.map(c => ({
      ...c, products: c.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.notes && p.notes.toLowerCase().includes(search.toLowerCase())))
    })).filter(c => c.products.length > 0);
  }, [products, search]);

  const activeProjectData = projects.find(p => p.id === activeProject) || projects[0] || null;
  const clientId = activeProjectData?.clientBankId || activeProjectData?.client || 'santander';
  const banksWithClient = useMemo(() => BANKS.map(b => ({ ...b, isClient: b.id === clientId })), [clientId]);
  const activeBanks = banksWithClient.filter(b => selectedBanks.includes(b.id));
  const toggleCat = i => setExpandedCats(p => { const s = new Set(p); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const stats = useMemo(() => {
    let lo = 0, hi = 0, tot = 0;
    products.forEach(c => c.products.forEach(p => {
      const pos = getPosition(clientId, p.fees);
      if (!pos) return;
      tot++; if (pos.percentile <= 33) lo++; if (pos.percentile >= 67) hi++;
    }));
    return { lo, hi, mid: tot - lo - hi, tot };
  }, [products, clientId]);

  const opportunities = useMemo(() => computeOpportunities(clientId, PRODUCTS), [clientId]);
  const oppsBySeg = useMemo(() => {
    const m = {};
    opportunities.forEach(o => { if (!m[o.segment]) m[o.segment] = []; m[o.segment].push(o); });
    return m;
  }, [opportunities]);

  const getSimulatorProductId = (opp) => {
    const n = (opp.product || '').toLowerCase();
    const c = (opp.category || '').toLowerCase();
    if (n.includes('plan básico') && c.includes('cuentas')) return 'r_cc_basico';
    if (n.includes('plan premium') && c.includes('cuentas')) return 'r_cc_premium';
    if (n.includes('gold') || n.includes('platinum')) return 'r_tc_gold';
    if (n.includes('clásica') && c.includes('tarjetas')) return 'r_tc_clasica';
    if (n.includes('black') || n.includes('infinite')) return 'r_tc_black';
    if (n.includes('avance efectivo')) return 'r_tc_avance';
    if (n.includes('internacional') || n.includes('fx markup')) return 'r_tc_fx';
    if (n.includes('rotativo')) return 'r_tc_rot';
    if (n.includes('consumo 12m')) return 'r_cred12';
    if (n.includes('consumo 36m')) return 'r_cred36';
    if (n.includes('sobregiro') || n.includes('línea de crédito')) return 'r_linea';
    if (n.includes('automotriz')) return 'r_auto';
    if (n.includes('tasa fija uf')) return 'r_hip_fija';
    if (n.includes('tasa mixta')) return 'r_hip_mixta';
    if (n.includes('ffmm renta fija')) return 'r_ffmm_rf';
    if (n.includes('ffmm renta variable')) return 'r_ffmm_rv';
    if (n.includes('corretaje')) return 'r_corretaje';
    if (n.includes('fraude tc')) return 'r_seg_fraude';
    if (n.includes('pyme básico')) return 'p_cc_basico';
    if (n.includes('tef')) return 'p_tef';
    if (n.includes('capital trabajo')) return 'p_ktrab';
    if (n.includes('línea de crédito pyme')) return 'p_linea';
    if (n.includes('factoring')) return 'p_fact';
    if (n.includes('merchant débito')) return 'p_pos_db';
    if (n.includes('merchant crédito')) return 'p_pos_cr';
    if (n.includes('e-commerce gateway')) return 'p_ecomm';
    if (n.includes('cta. cte. empresa') || n.includes('cta cte empresa')) return 'e_cc';
    if (n.includes('swift')) return 'e_swift';
    if (n.includes('bilateral')) return 'e_bilat';
    if (n.includes('sindicado')) return 'e_sind';
    if (n.includes('carta de crédito')) return 'e_lc';
    if (n.includes('fx spot')) return 'e_fx';
    if (n.includes('m&a advisory')) return 'c_ma';
    if (n.includes('bonos')) return 'c_bono';
    if (n.includes('renta fija') && c.includes('markets')) return 'c_rf';
    if (n.includes('irs')) return 'c_irs';
    return null;
  };

  const openSimulatorForOpportunity = (opp) => {
    const simId = getSimulatorProductId(opp);
    if (!simId) return;
    const fee = Number(opp.clientVal);
    const target = Number(opp.bestVal);
    const url = `/simulator?product=${encodeURIComponent(simId)}&fee=${encodeURIComponent(fee)}&target=${encodeURIComponent(target)}`;
    window.location.href = url;
  };

  const addProject = async () => {
    const id = Date.now();
    const draft = { id: `project-${id}`, name: "Nuevo Proyecto", clientBankId: "santander", market: "Chile", competitorBankIds: BANKS.filter(x=>x.id!=="santander").map(x=>x.id), segments: ["retail"], status: "draft" };
    await fetch('/api/benchmark/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    await loadProjects();
    setActiveProject(draft.id);
  };

  const saveProject = async (project) => {
    await fetch('/api/benchmark/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) });
    await loadProjects();
  };

  const deleteProject = async (projectId) => {
    await fetch(`/api/benchmark/projects/${projectId}`, { method: 'DELETE' });
    await loadProjects();
  };

  // ═══ DETAIL PANEL ═══
  const DetailPanel = ({ product, onClose }) => {
    if (!product) return null;
    return (
      <div style={{ position: "fixed", top: 0, right: 0, width: 420, height: "100vh", background: AM.navy, borderLeft: `2px solid ${AM.gold}44`, zIndex: 100, overflowY: "auto", boxShadow: "-8px 0 30px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${AM.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, color: AM.gold, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Detalle producto</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: AM.gray400, cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: AM.white, marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 11, color: AM.gray400, marginBottom: 16 }}>{product.notes}</div>

          {/* Values sorted */}
          <div style={{ fontSize: 10, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Comparativa ({product.unit})</div>
          {Object.entries(product.fees)
            .filter(([,v]) => v !== null && v !== undefined)
            .sort(([,a],[,b]) => product.invert ? b - a : a - b)
            .map(([bankId, val], i) => {
              const bank = banksWithClient.find(b => b.id === bankId);
              if (!bank) return null;
              const pos = getPosition(bankId, product.fees);
              return (
                <div key={bankId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${AM.border}` }}>
                  <div style={{ fontSize: 11, color: AM.gray400, width: 18, textAlign: "right" }}>{i + 1}.</div>
                  <BankBadge bank={bank} size={22} />
                  <div style={{ flex: 1, fontSize: 12, fontWeight: bank.isClient ? 700 : 400, color: bank.isClient ? "#EC0000" : AM.white }}>{bank.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pos ? posColor(pos.percentile, product.invert) : AM.white }}>{fmt(val, product.unit)}</div>
                </div>
              );
            })}

          {/* Sources */}
          {product.sources && product.sources.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Fuentes</div>
              {product.sources.map((sId, i) => {
                const src = SOURCES[sId];
                if (!src) return null;
                return (
                  <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 4, borderRadius: 5, background: AM.navyLight, border: `1px solid ${AM.border}`, textDecoration: "none", color: AM.gray300, fontSize: 11, transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = AM.tealLight}
                    onMouseLeave={e => e.currentTarget.style.borderColor = AM.border}
                  >
                    <ExternalLink size={12} color={AM.tealLight} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{src.name}</div>
                      <div style={{ fontSize: 9, color: AM.gray500, marginTop: 1 }}>{src.type}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: AM.navy, color: AM.white, minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${AM.navyLight} 0%, ${AM.navy} 100%)`, borderBottom: `2px solid ${AM.gold}33`, padding: "14px 28px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: AM.gold, fontWeight: 700 }}>Alvarez & Marsal</span>
              <span style={{ width: 1, height: 12, background: AM.borderLight, display: "inline-block" }} />
              <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: AM.gray400 }}>Revenue Improvement Solutions</span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>Benchmark Competitivo — Chile</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "#EC000010", border: "1px solid #EC000033", borderRadius: 6, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={14} color="#EC0000" />
              <div>
                <div style={{ fontSize: 8, color: AM.gray400, textTransform: "uppercase", letterSpacing: 1 }}>Cliente / Proyecto</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#EC0000" }}>{banksWithClient.find(b=>b.id===clientId)?.name || clientId}</div>
              </div>
            </div>
            <button onClick={() => setShowHelp(v => !v)} style={{ padding: "8px 12px", border: `1px solid ${AM.borderLight}`, borderRadius: 6, background: AM.navyLight, color: AM.gray300, fontSize: 11, cursor: "pointer" }}>
              <Info size={12} style={{ display: "inline", marginRight: 6 }} /> Métricas
            </button>
          </div>
        </div>
      </div>

      {/* VIEW TABS */}
      <div style={{ background: AM.navyMid, borderBottom: `1px solid ${AM.border}`, padding: "0 28px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", gap: 0 }}>
          {VIEWS.map(v => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button key={v.id} onClick={() => setView(v.id)}
                style={{ padding: "10px 20px", border: "none", borderBottom: active ? `2px solid ${AM.gold}` : "2px solid transparent", background: "transparent", color: active ? AM.gold : AM.gray400, cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 400, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon size={14} /> {v.name}
                {v.id === "opportunities" && <span style={{ background: AM.red + "33", color: AM.redLight, fontSize: 9, padding: "1px 6px", borderRadius: 8, fontWeight: 700, marginLeft: 4 }}>{opportunities.length}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 28px" }}>
        {showHelp && (
          <div style={{ marginBottom: 12, background: AM.navyLight, border: `1px solid ${AM.borderLight}`, borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: AM.gold, textTransform: "uppercase", marginBottom: 6 }}>Guía de métricas y unidades</div>
            <ul style={{ margin: 0, paddingLeft: 16, color: AM.gray300, fontSize: 11, lineHeight: 1.5 }}>
              {METRIC_HELP.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </div>
        )}

        {/* ═══ BENCHMARK VIEW ═══ */}
        {view === "benchmark" && (
          <>
            {/* Segment tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {SEGMENTS.map(s => {
                const Icon = s.icon;
                const active = segment === s.id;
                return (
                  <button key={s.id} onClick={() => { setSegment(s.id); setExpandedCats(new Set([0])); setSearch(""); }}
                    style={{ padding: "9px 18px", borderRadius: 5, border: `1px solid ${active ? AM.gold : AM.border}`, background: active ? AM.gold + "15" : "transparent", color: active ? AM.gold : AM.gray400, cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 400, display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon size={14} /> {s.name}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
              {[
                { l: "Productos", v: stats.tot, s: SEGMENTS.find(s=>s.id===segment)?.name, c: AM.white, bc: AM.border },
                { l: "Competitivo", v: stats.lo, s: "P0–33", c: AM.green, bc: AM.green+"33" },
                { l: "Rango medio", v: stats.mid, s: "P34–66", c: AM.amber, bc: AM.amber+"33" },
                { l: "Rango alto", v: stats.hi, s: "P67–100", c: AM.red, bc: AM.red+"33" },
              ].map((c,i) => (
                <div key={i} style={{ background: AM.navyLight, borderRadius: 6, padding: "12px 16px", border: `1px solid ${c.bc}` }}>
                  <div style={{ fontSize: 9, color: c.c === AM.white ? AM.gray400 : c.c, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{c.l}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: c.c, lineHeight: 1 }}>{c.v}</div>
                  <div style={{ fontSize: 9, color: AM.gray400, marginTop: 3 }}>{c.s}</div>
                </div>
              ))}
            </div>

            {/* Bank selector + search */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {banksWithClient.map(b => {
                  const on = selectedBanks.includes(b.id);
                  return (
                    <button key={b.id} onClick={() => setSelectedBanks(p => on ? p.filter(x=>x!==b.id) : [...p, b.id])}
                      style={{ padding: "4px 8px", borderRadius: 4, border: `1.5px solid ${on ? (b.isClient ? "#EC0000" : AM.borderLight) : AM.border}`, background: on ? (b.isClient ? "#EC000010" : AM.navyLight) : "transparent", color: on ? (b.isClient ? "#EC0000" : AM.gray300) : AM.gray600, cursor: "pointer", fontSize: 10, fontWeight: on ? 600 : 400, display: "flex", alignItems: "center", gap: 5 }}>
                      <BankBadge bank={b} size={18} /> {b.name}
                    </button>
                  );
                })}
              </div>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 9, top: 8, color: AM.gray400 }} />
                <input type="text" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ padding: "7px 10px 7px 28px", borderRadius: 5, border: `1px solid ${AM.border}`, background: AM.navyLight, color: AM.white, fontSize: 11, width: 180, outline: "none" }} />
              </div>
            </div>

            {/* Categories */}
            {filtered.map((cat, ci) => {
              const expanded = expandedCats.has(ci);
              const CatIcon = CAT_ICONS[cat.category] || Layers;
              return (
                <div key={ci} style={{ marginBottom: 6 }}>
                  <button onClick={() => toggleCat(ci)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderRadius: expanded ? "6px 6px 0 0" : 6, border: `1px solid ${expanded ? AM.borderLight : AM.border}`, borderBottom: expanded ? "none" : undefined, background: expanded ? AM.navyLight : AM.navy, cursor: "pointer", color: AM.white }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <CatIcon size={16} color={AM.gold} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.category}</span>
                      <span style={{ fontSize: 9, color: AM.gray500, background: AM.navy, padding: "1px 7px", borderRadius: 8 }}>{cat.products.length}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {cat.products.map((p, pi) => {
                          const pos = getPosition(clientId, p.fees);
                          if (!pos) return <div key={pi} style={{ width: 5, height: 5, borderRadius: 1, background: AM.gray600 }} />;
                          return <div key={pi} style={{ width: 5, height: 5, borderRadius: 1, background: posColor(pos.percentile, p.invert) }} />;
                        })}
                      </div>
                      {expanded ? <ChevronDown size={14} color={AM.gray400} /> : <ChevronRight size={14} color={AM.gray400} />}
                    </div>
                  </button>
                  {expanded && (
                    <div style={{ border: `1px solid ${AM.borderLight}`, borderTop: "none", borderRadius: "0 0 6px 6px", background: AM.navyLight, overflow: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${AM.border}` }}>
                            <th style={{ textAlign: "left", padding: "8px 14px", color: AM.gray400, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.8, minWidth: 190, position: "sticky", left: 0, background: AM.navyLight, zIndex: 2 }}>Producto</th>
                            <th style={{ padding: "8px 4px", color: AM.gray400, fontWeight: 600, fontSize: 9, textTransform: "uppercase", width: 48, textAlign: "center" }}>Unidad</th>
                            {activeBanks.map(b => (
                              <th key={b.id} style={{ padding: "8px 4px", textAlign: "center", minWidth: 72, background: b.isClient ? "#EC000006" : undefined, borderLeft: b.isClient ? "2px solid #EC000025" : undefined, borderRight: b.isClient ? "2px solid #EC000025" : undefined }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                  <BankBadge bank={b} size={22} />
                                  <span style={{ fontSize: 8, color: b.isClient ? "#EC0000" : AM.gray400, fontWeight: 600, lineHeight: 1 }}>{b.name}</span>
                                </div>
                              </th>
                            ))}
                            <th style={{ padding: "8px 6px", color: AM.gray400, fontSize: 9, textTransform: "uppercase", width: 44, textAlign: "center" }}>Pos.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.products.map((p, pi) => {
                            const santPos = getPosition(clientId, p.fees);
                            const inv = !!p.invert;
                            return (
                              <tr key={pi} style={{ borderBottom: `1px solid ${AM.border}`, cursor: "pointer" }}
                                onClick={() => setDetailProduct(p)}
                                onMouseEnter={e => e.currentTarget.style.background = AM.navyMid}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "9px 14px", position: "sticky", left: 0, background: AM.navyLight, zIndex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ fontWeight: 500, color: AM.white, fontSize: 11 }}>{p.name}</div>
                                    {p.sources?.length > 0 && <ExternalLink size={10} color={AM.tealLight} style={{ flexShrink: 0, opacity: 0.6 }} />}
                                  </div>
                                  <div style={{ fontSize: 9, color: AM.gray500, marginTop: 2, lineHeight: 1.3, maxWidth: 260 }}>{p.notes}</div>
                                  {p.sources?.[0] && SOURCES[p.sources[0]] && (
                                    <a href={SOURCES[p.sources[0]].url} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()} style={{ fontSize: 9, color: AM.tealLight, textDecoration: 'none' }}>
                                      Fuente: {SOURCES[p.sources[0]].name}
                                    </a>
                                  )}
                                </td>
                                <td style={{ padding: "9px 4px", color: AM.gray500, textAlign: "center", fontSize: 8, fontWeight: 500 }}>{p.unit}</td>
                                {activeBanks.map(b => {
                                  const val = p.fees[b.id];
                                  const pos = getPosition(b.id, p.fees);
                                  const isNull = val === null || val === undefined;
                                  const pc = pos ? posColor(pos.percentile, inv) : AM.gray600;
                                  return (
                                    <td key={b.id} style={{ padding: "9px 4px", textAlign: "center", background: b.isClient ? "#EC000005" : (isNull ? undefined : pc + "08"), borderLeft: b.isClient ? "2px solid #EC000015" : undefined, borderRight: b.isClient ? "2px solid #EC000015" : undefined }}>
                                      {isNull ? <span style={{ color: AM.gray600, fontSize: 10 }}>—</span> : (
                                        <div>
                                          <div style={{ fontSize: 12, fontWeight: 700, color: b.isClient ? "#EC0000" : AM.white }}>{fmt(val, p.unit)}</div>
                                          {pos && <div style={{ fontSize: 7, marginTop: 1, color: pc, fontWeight: 600 }}>{pos.position}/{pos.total}</div>}
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                                <td style={{ padding: "9px 6px", textAlign: "center" }}>
                                  {santPos && (
                                    <div style={{ display: "inline-flex", padding: "2px 7px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: posColor(santPos.percentile, inv) + "18", color: posColor(santPos.percentile, inv), border: `1px solid ${posColor(santPos.percentile, inv)}28` }}>
                                      {santPos.position}/{santPos.total}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ═══ OPPORTUNITIES VIEW ═══ */}
        {view === "opportunities" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: AM.white }}>Oportunidades de Mejora de Ingresos</h2>
              <p style={{ fontSize: 11, color: AM.gray400, margin: 0 }}>
                Productos donde Santander cobra menos que la competencia o está posicionado en el rango alto del mercado. Cada oportunidad representa potencial de optimización de pricing o parametrización.
              </p>
            </div>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
              <div style={{ background: AM.navyLight, borderRadius: 6, padding: "14px 16px", border: `1px solid ${AM.red}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <AlertTriangle size={14} color={AM.red} />
                  <span style={{ fontSize: 9, color: AM.red, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Santander caro vs mercado</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: AM.redLight }}>{opportunities.filter(o => !o.inv).length}</div>
                <div style={{ fontSize: 9, color: AM.gray400 }}>productos donde Santander cobra más</div>
              </div>
              <div style={{ background: AM.navyLight, borderRadius: 6, padding: "14px 16px", border: `1px solid ${AM.green}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TrendingDown size={14} color={AM.green} />
                  <span style={{ fontSize: 9, color: AM.green, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Santander barato vs mercado</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: AM.greenLight }}>{opportunities.filter(o => o.inv).length}</div>
                <div style={{ fontSize: 9, color: AM.gray400 }}>productos donde Santander ofrece más al cliente</div>
              </div>
              <div style={{ background: AM.navyLight, borderRadius: 6, padding: "14px 16px", border: `1px solid ${AM.gold}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Zap size={14} color={AM.gold} />
                  <span style={{ fontSize: 9, color: AM.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Total oportunidades</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: AM.gold }}>{opportunities.length}</div>
                <div style={{ fontSize: 9, color: AM.gray400 }}>en todos los segmentos</div>
              </div>
            </div>

            {/* By segment */}
            {Object.entries(oppsBySeg).map(([seg, opps]) => {
              const segDef = SEGMENTS.find(s => s.id === seg);
              const SegIcon = segDef?.icon || Layers;
              return (
                <div key={seg} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <SegIcon size={14} color={AM.gold} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: AM.white }}>{segDef?.name || seg}</span>
                    <span style={{ fontSize: 9, color: AM.gray500, background: AM.navyLight, padding: "1px 7px", borderRadius: 8 }}>{opps.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {opps.map((o, i) => {
                      const bestBank = banksWithClient.find(b => b.id === o.bestBank);
                      return (
                        <div key={i}
                          onClick={() => {
                            const prod = PRODUCTS[o.segment]?.find(c => c.category === o.category)?.products.find(p => p.name === o.product);
                            if (prod) setDetailProduct(prod);
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = AM.borderLight}
                          onMouseLeave={e => e.currentTarget.style.borderColor = AM.border}
                          style={{ background: AM.navyLight, borderRadius: 6, padding: "10px 16px", border: `1px solid ${AM.border}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                        >
                          <div style={{ width: 4, height: 36, borderRadius: 2, background: o.inv ? AM.green : AM.red, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: AM.white }}>{o.product}</div>
                            <div style={{ fontSize: 9, color: AM.gray500 }}>{o.category}</div>
                          </div>
                          <div style={{ textAlign: "center", minWidth: 70 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#EC0000" }}>{fmt(o.clientVal, o.unit)}</div>
                            <div style={{ fontSize: 8, color: AM.gray500 }}>{banksWithClient.find(b=>b.id===clientId)?.name || 'Cliente'}</div>
                          </div>
                          <ArrowRight size={12} color={AM.gray500} />
                          <div style={{ textAlign: "center", minWidth: 70 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: AM.green }}>{fmt(o.bestVal, o.unit)}</div>
                            <div style={{ fontSize: 8, color: AM.gray500 }}>{bestBank?.name || "Best"}</div>
                          </div>
                          <div style={{ textAlign: "right", minWidth: 55 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: o.inv ? AM.green : AM.redLight }}>
                              {o.inv ? "-" : "+"}{Math.abs(o.gapPct).toFixed(0)}%
                            </div>
                            <div style={{ fontSize: 8, color: AM.gray500 }}>gap</div>
                          </div>
                          <div style={{ display: "inline-flex", padding: "2px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700, background: posColor(o.percentile, o.inv) + "18", color: posColor(o.percentile, o.inv) }}>
                            {o.position}/{o.total}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openSimulatorForOpportunity(o);
                            }}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 4,
                              border: `1px solid ${AM.tealLight}66`,
                              background: AM.teal + "22",
                              color: AM.tealLight,
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: "pointer",
                              marginLeft: 6,
                            }}
                          >
                            Simular
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ═══ PROJECTS VIEW ═══ */}
        {view === "projects" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Proyectos Benchmark</h2>
                <p style={{ fontSize: 11, color: AM.gray400, margin: 0 }}>Gestión de proyectos de benchmark por mercado y cliente.</p>
              </div>
              <button onClick={addProject}
                style={{ padding: "8px 16px", borderRadius: 5, border: `1px solid ${AM.gold}`, background: AM.gold + "15", color: AM.gold, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> Nuevo Proyecto
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {projects.map(p => {
                const clientBank = banksWithClient.find(b => b.id === (p.clientBankId || p.client));
                const isActive = activeProject === p.id;
                return (
                  <div key={p.id}
                    onClick={() => { setActiveProject(p.id); setView("benchmark"); }}
                    style={{ background: AM.navyLight, borderRadius: 8, padding: "16px 20px", border: `1px solid ${isActive ? AM.gold : AM.border}`, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = AM.borderLight; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = AM.border; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: AM.white }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: AM.gray400, marginTop: 2 }}>{(p.updatedAt || p.date || '').slice(0,10)}</div>
                      </div>
                      <span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, background: p.status === "active" ? AM.green + "22" : AM.amber + "22", color: p.status === "active" ? AM.green : AM.amber }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      {clientBank && <BankBadge bank={clientBank} size={22} />}
                      <span style={{ fontSize: 12, color: AM.gray300 }}>{clientBank?.name}</span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                      <select value={p.clientBankId || p.client} onChange={(e) => setProjects(list => list.map(x => x.id === p.id ? { ...x, clientBankId: e.target.value } : x))} style={{ background: AM.navy, color: AM.gray300, border: `1px solid ${AM.border}`, borderRadius: 4, fontSize: 10, padding: '4px 6px' }}>
                        {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <button onClick={() => saveProject(p)} style={{ background: AM.navy, color: AM.gold, border: `1px solid ${AM.gold}66`, borderRadius: 4, padding: '3px 8px', fontSize: 10, cursor: 'pointer' }}><Save size={10} style={{ display: 'inline' }} /> Guardar</button>
                      <button onClick={() => deleteProject(p.id)} style={{ background: AM.navy, color: AM.redLight, border: `1px solid ${AM.red}66`, borderRadius: 4, padding: '3px 8px', fontSize: 10, cursor: 'pointer' }}><Trash2 size={10} style={{ display: 'inline' }} /> Eliminar</button>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {p.segments.map(s => {
                        const sd = SEGMENTS.find(x => x.id === s);
                        return (
                          <span key={s} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: AM.navy, color: AM.gray400, border: `1px solid ${AM.border}` }}>
                            {sd?.name || s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24, padding: "16px 20px", background: AM.navyMid, borderRadius: 8, border: `1px solid ${AM.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Info size={14} color={AM.tealLight} />
                <span style={{ fontSize: 12, fontWeight: 600, color: AM.white }}>Roadmap de navegación</span>
              </div>
              <div style={{ fontSize: 11, color: AM.gray400, lineHeight: 1.6 }}>
                En la versión productiva (Sebas), cada proyecto se almacenará como una entidad independiente con su propio mercado, banco cliente y competidores.
                Los scrapers alimentarán los datos automáticamente y se podrá navegar entre proyectos activos, generar informes comparativos, y hacer seguimiento de cambios tarifarios en el tiempo.
                La capa de persistencia permitirá guardar snapshots, anotar oportunidades, y exportar a PowerPoint con la plantilla A&M.
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, marginBottom: 10, fontSize: 9, color: AM.gray400 }}>
          {[
            { l: "Competitivo (P0–25)", c: AM.green },
            { l: "Buen posicionam. (P25–50)", c: AM.tealLight },
            { l: "Medio-alto (P50–75)", c: AM.amber },
            { l: "Caro (P75–100)", c: AM.red },
          ].map((x,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} /> {x.l}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "12px 0 24px", fontSize: 8, color: AM.gray600, borderTop: `1px solid ${AM.border}`, marginTop: 6 }}>
          <span style={{ color: AM.goldDim, fontWeight: 600, letterSpacing: 1.5 }}>CONFIDENCIAL</span>
          {" | "}Alvarez & Marsal · Revenue Improvement Solutions{" | "}Fuentes públicas (CMF, SERNAC, webs bancos){" | "}Logos de bancos: Wikimedia/brand assets (uso referencial con fallback){" | "}Feb 2026{" | "}v3 demo
        </div>
      </div>

      {/* Detail panel */}
      {detailProduct && <DetailPanel product={detailProduct} onClose={() => setDetailProduct(null)} />}
    </div>
  );
}
