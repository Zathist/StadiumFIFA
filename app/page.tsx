"use client";

import { useEffect, useState, useMemo } from "react";

// --- Global UI Text (Multilingual Core) ---
const UI_TEXT = {
  en: {
    title: "VenueMind Control",
    sub: "FIFA World Cup 2026 Operations",
    opsMode: "Tactical Ops",
    fanMode: "Fan Guide",
    incidents: "Alert Console",
    heatmap: "Density Map",
    dispatch: "AI Dispatch",
    threatLevel: "Venue Pulse: Normal",
    cta: "Execute AI Directive",
    sustainability: "Eco-Impact: 92%",
    fanWelcome: "Welcome to SoFi Stadium",
    fanSub: "Live guidance tailored for your journey.",
    safetyTip: "Clear Bag Policy Active: Max 12x6x12 inches."
  },
  es: {
    title: "VenueMind Control",
    sub: "Operaciones Copa Mundial FIFA 2026",
    opsMode: "Ops Táctica",
    fanMode: "Guía del Fan",
    incidents: "Consola de Alertas",
    heatmap: "Mapa de Densidad",
    dispatch: "Despacho IA",
    threatLevel: "Pulso del Estadio: Normal",
    cta: "Ejecutar Directiva IA",
    sustainability: "Eco-Impacto: 92%",
    fanWelcome: "Bienvenido al Estadio SoFi",
    fanSub: "Guía en vivo personalizada para tu viaje.",
    safetyTip: "Política de Bolsas Transparentes: Máx 30x15x30 cm."
  }
};

type Incident = {
  id: string;
  level: "CRITICAL" | "WARNING" | "LOW";
  title: string;
  reasoning: string;
  prediction: string;
  location: string;
  time: string;
};

export default function EliteVenueConsole() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  const [isDispatched, setIsDispatched] = useState<Record<string, boolean>>({});

  const t = UI_TEXT[lang];

  // --- Live Data Stream ---
  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "CRITICAL",
      title: lang === 'en' ? "Gate B Bottleneck" : "Embotellamiento Puerta B",
      reasoning: "Sensor 4 malfunctioning. Pedestrian queue tracking currently sits at 28 mins.",
      prediction: "Est. 45 min structural delay across North Hub if not rerouted within 10 mins.",
      location: "Gate B / North Hub",
      time: "10:32 AM"
    },
    {
      id: "INC-2",
      level: "WARNING",
      title: lang === 'en' ? "Medical: Section 114" : "Médico: Sección 114",
      reasoning: "Localized thermal core spike detected. High probability of acute heat exhaustion.",
      prediction: "Ambient zone temp rising. Dispatching Emergency Response Unit 4 recommended.",
      location: "Upper Concourse",
      time: "10:38 AM"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const i = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(i);
  }, []);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  const handleDispatch = (id: string) => {
    setIsDispatched(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIsDispatched(prev => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased selection:bg-blue-600/10 selection:text-blue-700">
      
      {/* EXECUTIVE TOP BAR */}
      <header className="border-b border-slate-200 bg-white px-8 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black italic text-base">V</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">{t.title}</h1>
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">{t.sub}</p>
            </div>
          </div>

          {/* HUD SWITCHERS & TIMING */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button 
                onClick={() => setPersona("OPS")} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  persona === "OPS" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                📊 {t.opsMode}
              </button>
              <button 
                onClick={() => setPersona("FAN")} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  persona === "FAN" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                📱 {t.fanMode}
              </button>
            </div>

            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as "en" | "es")}
              className="bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase px-3 py-2 outline-none cursor-pointer text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            <div className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border border-slate-200/40">
              {time}
            </div>
          </div>
          
        </div>
      </header>

      {/* SYSTEM ARCHITECTURE CONTAINER */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= COLUMN 1: ALERT CONSOLE / PROFILE ================= */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.incidents}</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {persona === "OPS" ? (
                <div className="space-y-3">
                  {incidents.map(i => (
                    <button 
                      key={i.id}
                      onClick={() => setSelectedId(i.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all block ${
                        selectedId === i.id 
                          ? "bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-sm" 
                          : "bg-white border-slate-100 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{i.title}</h3>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide ${
                          i.level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>{i.level}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{i.location} • {i.time}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                   <h3 className="text-base font-black text-slate-900 tracking-tight">{t.fanWelcome}</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.fanSub}</p>
                   
                   <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                      <p className="text-[9px] font-black uppercase text-blue-700 mb-1 tracking-wider">Gate Recommendation</p>
                      <p className="text-sm font-bold text-slate-900 uppercase">North Entrance (Gate A)</p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Flow: Minimal Density • 4 min walk</p>
                   </div>
                   
                   <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                      <p className="text-[9px] font-black uppercase text-amber-700 mb-1 tracking-wider">Safety Guidelines</p>
                      <p className="text-[11px] text-slate-600 font-medium leading-normal">{t.safetyTip}</p>
                   </div>
                </div>
              )}
            </div>

            {/
            {/* LIVE TELEMETRY FLOW STATUS */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vendor Ingress Control</h4>
  <div className="space-y-3">
    
    {/* North Perimeters - Status */}
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
      <span className="text-[11px] font-bold text-slate-700">North Perimeters</span>
      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded">Optimal</span>
    </div>

    {/* South Transit - Interactive Vendor Button */}
    <button 
      onClick={() => alert("Vendor Alert: Dispatching Maintenance Crew to South Transit...")}
      className="w-full flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-200 hover:bg-rose-100 transition-all active:scale-[0.98]"
    >
      <span className="text-[11px] font-bold text-rose-800">South Transit Buffer</span>
      <span className="px-2 py-1 bg-rose-500 text-white text-[9px] font-black uppercase rounded animate-pulse">Request Help</span>
    </button>
    
  </div>
</div>
            </div>
          </div>

          {/* ================= COLUMN 2: VECTOR VECTOR MAP LAYOUT ================= */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm min-h-[480px]">
             <div className="w-full flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.heatmap}</h2>
                  <p className="text-[11px] font-bold text-slate-500 italic">Sector Trackers: Live Coordinates</p>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200/40">SYS_V2</span>
             </div>

             {/* DYNAMIC PURE CSS STADIUM BLUEPRINT */}
             <div className="relative w-72 h-72 flex items-center justify-center my-4 bg-slate-50 border border-slate-100 rounded-full p-4">
                <div className="absolute inset-0 border border-dashed border-slate-300 rounded-full animate-[spin_100s_linear_infinite]" />
                <div className="absolute inset-6 border border-slate-200 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
                   <div className="w-full h-full relative p-4">
                      {/* Gate Vector Hotspots */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-emerald-500/20 border border-emerald-400/40 blur-xs rounded-full flex items-center justify-center" title="Gate A: Clear">
                        <span className="text-[8px] font-black text-emerald-700">G_A</span>
                      </div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-6 bg-rose-500/30 border border-rose-400/50 rounded-full flex items-center justify-center animate-pulse" title="Gate B: Bottleneck">
                        <span className="text-[8px] font-black text-rose-700">G_B</span>
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-amber-500/20 border border-amber-400/40 blur-xs rounded-full flex items-center justify-center" title="Gate C: Heavy">
                        <span className="text-[8px] font-black text-amber-700">G_C</span>
                      </div>
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-12 h-6 bg-emerald-500/20 border border-emerald-400/40 blur-xs rounded-full flex items-center justify-center" title="Gate D: Clear">
                        <span className="text-[8px] font-black text-emerald-700">G_D</span>
                      </div>
                      
                      {/* Inner Stadium Pitch Drawing */}
                      <div className="w-full h-full border border-slate-100 rounded-full flex items-center justify-center">
                         <div className="w-24 h-16 border border-slate-200 bg-slate-50 rounded flex items-center justify-center relative">
                            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-200" />
                            <div className="w-6 h-6 border border-slate-200 rounded-full absolute" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* SCANNABLE INDEX LEGEND */}
             <div className="mt-8 grid grid-cols-3 gap-6 w-full text-center border-t border-slate-100 pt-4">
                <div className="flex items-center justify-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase text-slate-500">Low Flow</span></div>
                <div className="flex items-center justify-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-[10px] font-black uppercase text-slate-500">Moderate</span></div>
                <div className="flex items-center justify-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /><span className="text-[10px] font-black uppercase text-slate-500">Critical</span></div>
             </div>
          </div>

          {/* ================= COLUMN 3: GENAI ADVISOR TERMINAL ================= */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 text-white border border-slate-950 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-6xl italic pointer-events-none">AI</div>
              <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">{t.dispatch}</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{current.title}</h3>
                  <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-wider font-mono">{current.location}</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[8px] font-black text-blue-300 uppercase tracking-widest mb-1.5">Neural Root Telemetry</p>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed">{current.reasoning}</p>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[8px] font-black text-purple-300 uppercase tracking-widest mb-1.5">Predictive Modeling</p>
                    <p className="text-xs font-bold text-slate-200 italic leading-relaxed">{current.prediction}</p>
                  </div>
                </div>

                <<button 
 // ... inside the AI ADVISOR TERMINAL div, under the Predictive Modeling block:

<button 
  onClick={() => handleDispatch(current.id)}
  disabled={isDispatched[current.id]}
  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all duration-500 ease-in-out ${
    isDispatched[current.id]
      ? "bg-emerald-600 text-white scale-[1.02]"
      : "bg-white text-slate-900 hover:bg-slate-100 active:scale-95"
  }`}
>
  {isDispatched[current.id] ? "✓ Directive Transmitted" : t.cta}
</button>

{/* Status Indicator */}
<div className={`mt-4 p-3 rounded-lg border text-[10px] font-bold transition-opacity duration-300 ${
  isDispatched[current.id] 
    ? "opacity-100 bg-emerald-50 border-emerald-200 text-emerald-700" 
    : "opacity-0"
}`}>
  <span className="flex items-center gap-2">
    <span className="animate-spin">⚙️</span> DIRECTIVE ACTIVE: Rerouting North Hub flow...
  </span>
</div>
              </div>
            </div>

            {/* GREEN INFRASTRUCTURE PANEL */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.sustainability}</h2>
                  <span className="text-base">🌱</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 w-[92%]" />
               </div>
               <p className="text-[10px] font-bold text-slate-400">1.2 metric tons carbon mitigated during this phase loop.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
