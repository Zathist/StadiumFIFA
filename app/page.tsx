"use client";

import { useEffect, useState, useMemo } from "react";

// --- Enterprise Branding & Language ---
const UI_TEXT = {
  en: {
    title: "VENUE INTELLIGENCE SYSTEM",
    sub: "FIFA WORLD CUP 2026",
    opsMode: "Operations Center",
    fanMode: "Fan Companion",
    incidents: "Tactical Alerts",
    heatmap: "Real-time Perimeter Flow",
    dispatch: "Multi-Agent AI Hub",
    cta: "Apply AI Solution",
    resolved: "Flow Restored",
    confidence: "AI CONFIDENCE: 94%",
    agents: "3 Autonomous Agents Active",
  },
  es: {
    title: "SISTEMA DE INTELIGENCIA",
    sub: "COPA MUNDIAL FIFA 2026",
    opsMode: "Centro de Operaciones",
    fanMode: "Guía del Fan",
    incidents: "Alertas Tácticas",
    heatmap: "Flujo Perimetral",
    dispatch: "Hub de IA Multi-Agente",
    cta: "Aplicar Solución IA",
    resolved: "Flujo Restaurado",
    confidence: "CONFIANZA IA: 94%",
    agents: "3 Agentes Autónomos Activos",
  }
};

type Incident = {
  id: string;
  level: "URGENT" | "WATCH";
  title: string;
  summary: string;
  steps: string[];
  prediction: string;
  location: string;
};

export default function FIFAVenueIntelligence() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  
  // Logic States
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "sending" | "confirmed">("idle");
  const [fixedIncidents, setFixedIncidents] = useState<string[]>([]);
  const [missions, setMissions] = useState<string[]>([]);

  const t = UI_TEXT[lang];

  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Gate B Bottleneck" : "Atasco Puerta B",
      summary: "Scanner #4 Offline / Crowd Surge",
      steps: [
        "Crowd Agent: Queue growth +22 ppl/min.",
        "Flow Agent: Rerouting capacity reached.",
        "Logic Agent: Manual override required."
      ],
      prediction: "Mass-stall expected in 12 mins.",
      location: "Gate B / North Hub"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Heat Alert: Section 114" : "Calor: Sección 114",
      summary: "Thermal core spike detected (34°C).",
      steps: [
        "Heat Agent: Peak temp in Upper Tier.",
        "Thermal Agent: Fans density at 88%.",
        "Med Agent: High dehydration risk."
      ],
      prediction: "Emergency medical calls likely soon.",
      location: "Section 114 / Upper"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const i = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(i);
  }, []);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  const handleApply = () => {
    setDispatchStatus("sending");
    setTimeout(() => {
      setDispatchStatus("confirmed");
      setFixedIncidents(prev => [...prev, current.id]);
      setMissions(prev => [`${current.title} - FIXED`, ...prev.slice(0, 1)]);
      setTimeout(() => setDispatchStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* ENTERPRISE HUD HEADER */}
      <header className="bg-slate-900 text-white px-8 py-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black italic text-xl">V</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.2em]">{t.title}</h1>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t.sub}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-white/10 rounded-xl border border-white/10">
              <button onClick={() => setPersona("OPS")} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${persona === "OPS" ? "bg-white text-black" : "text-white/50"}`}>{t.opsMode}</button>
              <button onClick={() => setPersona("FAN")} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${persona === "FAN" ? "bg-white text-black" : "text-white/50"}`}>{t.fanMode}</button>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-[10px] font-black uppercase border border-white/20 px-3 py-2 rounded-xl hover:bg-white/10">{lang}</button>
            <span className="font-mono text-xs font-bold text-slate-400 bg-black/40 px-3 py-2 rounded-xl border border-white/5">{time}</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-100px)]">
        
        {/* LEFT: ALERTS & STATS */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.incidents}</h2>
            
            {persona === "OPS" ? (
              <div className="space-y-3">
                {incidents.map(i => {
                  const isFixed = fixedIncidents.includes(i.id);
                  return (
                    <button key={i.id} onClick={() => setSelectedId(i.id)} className={`w-full p-4 rounded-2xl text-left border transition-all ${selectedId === i.id ? "bg-slate-900 border-slate-900 text-white shadow-xl translate-x-2" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-black uppercase">{i.title}</span>
                        {isFixed ? <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">FIXED</span> : <div className={`w-2 h-2 rounded-full ${i.level === 'URGENT' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400">{i.location}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* PERSONALIZED FAN JOURNEY */
              <div className="space-y-6">
                <h3 className="text-base font-black italic">{lang === 'en' ? "Your Personal Journey" : "Tu Viaje Personalizado"}</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black">1</div>
                      <div className="text-xs"><b>Parking:</b> Lot B (North)</div>
                   </div>
                   <div className="flex items-center gap-3 border-l-2 border-blue-100 ml-4 pl-7 pb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</div>
                      <div className="text-xs"><b>Entry:</b> Gate A (5m wait)</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black italic text-slate-400">3</div>
                      <div className="text-xs text-slate-400 italic"><b>Seat:</b> Section 114</div>
                   </div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                   <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Time to Seat</p>
                   <p className="text-2xl font-black">12 MINS</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-6 rounded-[24px] text-white shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Safety Telemetry</h3>
            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold">Stadium Pulse</span><span className="text-[10px] font-black text-blue-400">OPTIMAL</span></div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[96%]" /></div>
          </div>
        </div>

        {/* CENTER: INTERACTIVE MAP */}
        <div className="lg:col-span-6 bg-white rounded-[32px] border border-slate-200 shadow-xl p-10 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-8 left-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${fixedIncidents.includes("INC-1") ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.heatmap}</h2>
            </div>
            <p className="text-[11px] font-bold italic">{lang === 'en' ? "Active Scanning..." : "Escaneo Activo..."}</p>
          </div>

          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 border-2 border-slate-50 rounded-full" />
            <div className="absolute inset-6 border border-slate-100 rounded-full bg-slate-50/30 flex items-center justify-center shadow-inner">
              <div className="w-60 h-40 border-4 border-white bg-white shadow-2xl rounded-[30px] flex items-center justify-center relative overflow-hidden transition-all duration-1000">
                {/* Dynamic Map Color Change */}
                <div className={`absolute top-0 right-0 w-full h-full transition-colors duration-1000 ${fixedIncidents.includes("INC-1") ? 'bg-emerald-500/10' : 'bg-red-500/20'}`} />
                <div className="w-14 h-8 bg-emerald-500/20 border border-emerald-500 rounded-lg flex items-center justify-center text-[8px] font-black text-emerald-700">G_A</div>
              </div>
            </div>
            {/* Visual Callouts */}
            <div className={`absolute top-1/2 -right-10 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-black transition-all duration-700 ${fixedIncidents.includes("INC-1") ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
              {fixedIncidents.includes("INC-1") ? "RESTORED" : "STALLED"}
            </div>
          </div>

          <div className="mt-16 flex gap-12 border-t border-slate-100 pt-8 w-full justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Normal Flow</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Congestion</span></div>
          </div>
        </div>

        {/* RIGHT: MULTI-AGENT AI ADVISOR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-[28px] p-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="flex flex-col gap-1 mb-8">
              <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{t.dispatch}</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase italic">{t.agents}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black italic uppercase leading-none mb-1">{current.title}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{current.location}</p>
              </div>

              <div className="space-y-5">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-3 tracking-widest">Autonomous Diagnostic</p>
                  <div className="space-y-2">
                    {current.steps.map((step, i) => (
                      <p key={i} className="text-[11px] font-medium text-slate-300 flex gap-3">
                        <span className="text-blue-500 font-black italic">#{i + 1}</span> {step}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-[9px] font-black text-orange-400 uppercase mb-1 tracking-widest">Impact Prediction</p>
                  <p className="text-[11px] font-bold italic leading-relaxed">{current.prediction}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-orange-500/20">
                     <span className="text-[9px] font-black text-orange-400/50">{t.confidence}</span>
                     <span className="text-[10px] font-black text-emerald-400">94%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={dispatchStatus !== "idle" || fixedIncidents.includes(current.id)}
                className={`w-full py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg ${
                  fixedIncidents.includes(current.id) ? "bg-emerald-500 cursor-default" : dispatchStatus === "sending" ? "bg-blue-600 animate-pulse" : "bg-white text-black hover:bg-blue-100"
                }`}
              >
                {fixedIncidents.includes(current.id) ? t.resolved : dispatchStatus === "sending" ? "TRANSMITTING..." : t.cta}
              </button>
            </div>
          </div>

          {/* ACTIVE MISSION RECAP */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Active Deployments</h2>
            <div className="space-y-3">
              {missions.length > 0 ? missions.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">{m}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
              )) : <p className="text-[10px] text-slate-400 font-bold italic">Awaiting AI Directives...</p>}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
