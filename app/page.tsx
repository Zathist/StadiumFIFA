"use client";

import { useEffect, useState, useMemo } from "react";

// --- Human-Friendly UI Text ---
const UI_TEXT = {
  en: {
    title: "VenueMind Control",
    sub: "FIFA World Cup 2026 Helper",
    opsMode: "Staff View",
    fanMode: "Fan View",
    incidents: "Live Alerts",
    heatmap: "Stadium Crowd Map",
    dispatch: "Agent Execution Desk",
    threatLevel: "Status: Normal",
    cta: "Execute Agent Mitigation",
    sustainability: "Eco-Impact: 92%",
    fanWelcome: "Welcome to the Stadium!",
    fanSub: "We'll help you find the best way to your seat.",
    safetyTip: "Reminder: Only clear bags allowed today."
  },
  es: {
    title: "VenueMind Control",
    sub: "Ayudante Copa Mundial 2026",
    opsMode: "Personal",
    fanMode: "Vista de Fan",
    incidents: "Alertas en Vivo",
    heatmap: "Mapa de Multitud",
    dispatch: "Mesa de Ejecución de Agentes",
    threatLevel: "Estado: Normal",
    cta: "Ejecutar Mitigación de Agente",
    sustainability: "Eco-Impacto: 92%",
    fanWelcome: "¡Bienvenido al Estadio!",
    fanSub: "Te ayudaremos a encontrar el mejor camino.",
    safetyTip: "Recordatorio: Solo bolsas transparentes permitidas."
  }
};

type Incident = {
  id: string;
  level: "CRITICAL" | "URGENT" | "WATCH";
  title: string;
  assignedAgent: string;
  agentIcon: string;
  reasoning: string;
  prediction: string;
  reasoningChain: string[];
  location: string;
  telemetryValue: number; // For the dynamic crowd logic
  time: string;
};

export default function EliteVenueConsole() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  
  // Simulation & Feedback States
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "sending" | "confirmed">("idle");
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [isCallingAI, setIsCallingAI] = useState(false);

  const t = UI_TEXT[lang];

  // 4. Heatmap Telemetry Zones (Data-driven instead of raw CSS classes)
  const zones = useMemo(() => [
    { name: "North Gate (Gate A)", load: 22, status: "CLEAR" },
    { name: "North Hub (Gate B)", load: 88, status: "OVERFLOW_RISK" },
    { name: "Upper Level (Sec 114)", load: 65, status: "WARNING" },
    { name: "South Concourse", load: 94, status: "CRITICAL" }
  ], []);

  // 2, 3, 5. Agent Names, Reasoning Chains, and Emergency Scenarios
  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Crowded at Gate B" : "Multitud en Puerta B",
      assignedAgent: "Crowd Flow Agent",
      agentIcon: "🚶",
      reasoning: "Ticket scanner #4 hardware failure. Processing capacity reduced by 25%. Current queue backlog at 320 individuals.",
      prediction: "Queue growth rate (+18/min) projects an external perimeter breach within 11 minutes if left unmitigated.",
      reasoningChain: [
        "Telemetry triggered: Scanner #4 offline",
        "Queue velocity calculated at +18 inputs/min",
        "Perimeter threshold limit evaluated at 400 max occupancy",
        "Mitigation matrix outputted: Reroute traffic to North Gate A"
      ],
      location: "Gate B / North Hub",
      telemetryValue: 88,
      time: "10:32 AM"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Thermal Spike: Section 114" : "Pico Térmico: Sección 114",
      assignedAgent: "Safety & Environment Agent",
      agentIcon: "🌡️",
      reasoning: "Ambient temperature sensors crossing 34.2°C due to structural solar exposure and high local density.",
      prediction: "Heat exhaustion probability models scale to 14% among dense clusters within the next 20 minutes.",
      reasoningChain: [
        "Thermal telemetry exceeded: 34.2°C threshold",
        "Density calculation: 4.2 humans/sqm",
        "Risk profile matched: Heat exhaustion / dehydration",
        "Mitigation matrix outputted: Activate auxiliary cooling & deploy water distribution units"
      ],
      location: "Section 114 / Upper Level",
      telemetryValue: 65,
      time: "10:38 AM"
    },
    {
      id: "INC-3",
      level: "CRITICAL",
      title: lang === 'en' ? "Severe Weather Ingress" : "Alerta de Clima Severo",
      assignedAgent: "Emergency Coordination Agent",
      agentIcon: "⛈️",
      reasoning: "Doppler radar tracking severe cloud-to-ground lightning cells within an 8km perimeter radius. Precipitation intensity climbing.",
      prediction: "Uncovered outdoor queues face immediate safety hazards. Sudden mass movement toward concourse gates expected.",
      reasoningChain: [
        "Doppler flash rate detected: 4 strikes/min within inner ring",
        "Velocity models show impact in under 5 minutes",
        "Concourse density headroom evaluated at 42%",
        "Mitigation matrix outputted: Execute structured shelter-in-place sequence to internal zones"
      ],
      location: "Stadium Perimeter / Exterior Lanes",
      telemetryValue: 94,
      time: "10:44 AM"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const i = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(i);
  }, []);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  // 1. Hooking up the Gemini Agent Logic Placeholder
  const handleApplySolution = async () => {
    setDispatchStatus("sending");
    setIsCallingAI(true);

    try {
      // --- HACKATHON LIVE AI ARCHITECTURE NOTE ---
      // To shift this from simulation to a live Gemini call:
      // const response = await fetch('/api/agent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ incidentId: current.id, context: current })
      // });
      // const aiMitigation = await response.json();
      
      // Simulating network response window for live demo feel
      await new Promise((resolve) => setTimeout(resolve, 1400));
      
      setDispatchStatus("confirmed");
      setActionLog(prev => [
        `[${current.assignedAgent}] Dispatched mitigation strategy for ${current.title} (${new Date().toLocaleTimeString()})`,
        ...prev.slice(0, 2)
      ]);
      
      setTimeout(() => setDispatchStatus("idle"), 4000);
    } catch (err) {
      console.error("AI Node failed to dispatch execution strategy", err);
      setDispatchStatus("idle");
    } finally {
      setIsCallingAI(false);
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 85) return "bg-red-500 text-white";
    if (load > 60) return "bg-orange-500 text-white";
    return "bg-emerald-500 text-white";
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans antialiased">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black italic text-xl">V</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">{t.title}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.sub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button onClick={() => setPersona("OPS")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${persona === "OPS" ? "bg-white shadow-sm text-black" : "text-slate-400"}`}>{t.opsMode}</button>
              <button onClick={() => setPersona("FAN")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${persona === "FAN" ? "bg-white shadow-sm text-black" : "text-slate-400"}`}>{t.fanMode}</button>
            </div>
            <select value={lang} onChange={(e) => setLang(e.target.value as "en" | "es")} className="bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase px-3 py-2 outline-none">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <div className="bg-slate-50 px-3 py-2 rounded-xl font-mono text-[11px] font-bold border border-slate-200 text-slate-500">{time}</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: ALERTS & NETWORK STATUS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.incidents}</h2>

              {persona === "OPS" ? (
                <div className="space-y-3">
                  {incidents.map(i => (
                    <button key={i.id} onClick={() => { setSelectedId(i.id); setDispatchStatus("idle"); }} className={`w-full p-4 rounded-xl border text-left transition-all block ${selectedId === i.id ? "bg-slate-50 border-black ring-1 ring-black" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase">{i.title}</h3>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${i.level === 'CRITICAL' ? 'bg-red-600 text-white' : i.level === 'URGENT' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{i.level}</span>
                      </div>
                      <div className="flex items-center gap-1.5 my-1.5">
                        <span className="text-xs">{i.agentIcon}</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-tight">{i.assignedAgent}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{i.location}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                   <h3 className="text-base font-black">{t.fanWelcome}</h3>
                   <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-[9px] font-black text-emerald-700 uppercase mb-1">Optimized Path</p>
                      <p className="text-sm font-bold">{current.level === 'CRITICAL' ? "Internal Concourse Gate D" : "North Gate (A)"}</p>
                      <p className="text-[10px] text-emerald-600 mt-1">{current.level === 'CRITICAL' ? "Sheltered Route • Low Rain Exposure" : "Short lines • 4 min walk"}</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">{t.safetyTip}</p>
                </div>
              )}
            </div>

            {/* VENUEMIND AGENT NETWORK MONITORS */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
               <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">VenueMind Agent Network</h4>
               <div className="space-y-4">
                  {incidents.map(i => (
                    <div key={i.id} className="opacity-95">
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="flex items-center gap-1"><span>{i.agentIcon}</span>{i.assignedAgent}</span>
                        <span className={i.telemetryValue > 85 ? "text-red-400" : i.telemetryValue > 60 ? "text-orange-400" : "text-emerald-400"}>
                          {i.telemetryValue > 85 ? "COMPUTE HIGH" : "NOMINAL"}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full">
                        <div className={`h-full rounded-full ${i.telemetryValue > 85 ? 'bg-red-500' : i.telemetryValue > 60 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${i.telemetryValue}%` }} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* COLUMN 2: TELEMETRY-DRIVEN DYNAMIC CROWD MAP */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm min-h-[500px] relative overflow-hidden">
             <div className="absolute top-6 left-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.heatmap}</h2>
                <p className="text-xs font-bold text-slate-900 mt-1">Live Telemetry-Driven Zone Layout</p>
             </div>

             <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <div className="absolute inset-0 border border-dashed border-slate-200 rounded-full animate-[spin_120s_linear_infinite]" />
                <div className="absolute inset-8 border border-slate-200 rounded-full bg-slate-50 flex items-center justify-center shadow-inner">
                   <div className="w-full h-full relative p-6">
                      {/* Dynamic map loadpoints fed directly from telemetry metrics */}
                      <div className={`absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm ${getLoadColor(zones[0].load)}`}>GATE A: {zones[0].load}%</div>
                      <div className={`absolute top-1/2 right-0 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm ${getLoadColor(zones[1].load)} animate-pulse`}>GATE B: {zones[1].load}%</div>
                      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm ${getLoadColor(zones[2].load)}`}>SEC 114: {zones[2].load}%</div>
                      <div className={`absolute top-1/2 left-0 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm ${getLoadColor(zones[3].load)}`}>SOUTH: {zones[3].load}%</div>
                      
                      <div className="w-full h-full border-2 border-white bg-white rounded-full flex items-center justify-center shadow-sm">
                         <div className="w-24 h-16 border-2 border-slate-100 rounded bg-slate-50 flex items-center justify-center">
                           <span className="text-[9px] font-mono text-slate-400 font-bold">PITCH ZONE</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-12 w-full max-w-md grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                {zones.map(z => (
                  <div key={z.name} className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{z.name}</span>
                    <span className="text-xs font-black text-slate-800">{z.load}% Telemetry Strain</span>
                  </div>
                ))}
             </div>
          </div>

          {/* COLUMN 3: AI AGENT INTERACTION & REASONING CHAIN */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.dispatch}</h2>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white font-mono">{current.id}</span>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{current.agentIcon}</span>
                    <h3 className="text-base font-black text-white leading-tight uppercase italic">{current.title}</h3>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-7">{current.location}</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Observation Diagnostics</p>
                    <p className="text-xs font-medium text-slate-300">{current.reasoning}</p>
                  </div>

                  {/* 3. The AI Reasoning Chain Pipeline */}
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-amber-400 uppercase mb-1.5">Agent Execution Log Logic</p>
                    <div className="space-y-1 font-mono text-[9px] text-slate-400">
                      {current.reasoningChain.map((step, idx) => (
                        <p key={idx} className="flex gap-1 items-start">
                          <span className="text-amber-500">↓</span>
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-purple-400 uppercase mb-1">Predictive Projection</p>
                    <p className="text-xs font-bold text-white italic">{current.prediction}</p>
                  </div>
                </div>

                <button 
                  onClick={handleApplySolution}
                  disabled={dispatchStatus !== "idle" || isCallingAI}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all duration-300 ${
                    dispatchStatus === "confirmed" 
                      ? "bg-emerald-500 text-white" 
                      : dispatchStatus === "sending" 
                        ? "bg-blue-600 text-white animate-pulse" 
                        : "bg-white text-black hover:bg-blue-50"
                  }`}
                >
                  {dispatchStatus === "confirmed" ? "✓ Mitigation Engaged" : dispatchStatus === "sending" ? "Querying Agent Layer..." : t.cta}
                </button>

                {dispatchStatus !== "idle" && (
                  <div className="mt-4 flex gap-1 h-1">
                     <div className={`flex-1 rounded-full ${dispatchStatus === "sending" || dispatchStatus === "confirmed" ? 'bg-blue-400' : 'bg-white/10'}`} />
                     <div className={`flex-1 rounded-full ${dispatchStatus === "confirmed" ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  </div>
                )}
              </div>
            </div>

            {/* ACTION LOGGER */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">System Action History</h4>
               <div className="space-y-2">
                  {actionLog.length > 0 ? actionLog.map((log, i) => (
                    <p key={i} className="text-[10px] font-bold text-slate-600 border-l-2 border-emerald-500 pl-2">{log}</p>
                  )) : <p className="text-[10px] text-slate-400 italic">No historical actions logged in current runtime.</p>}
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
