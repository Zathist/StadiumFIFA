"use client";

import { useEffect, useState, useMemo } from "react";

// --- Multi-Language Config ---
const UI_TEXT = {
  en: {
    title: "VenueMind",
    sub: "FIFA 2026 Hub",
    opsMode: "Staff",
    fanMode: "Fan",
    incidents: "Live Alerts",
    heatmap: "Crowd Map",
    dispatch: "AI Decision Hub",
    cta: "Run Autonomous Mitigation",
    fanWelcome: "Welcome, Fan!",
    fanSub: "Live guidance for SoFi Stadium.",
  },
  es: {
    title: "VenueMind",
    sub: "FIFA 2026 Hub",
    opsMode: "Personal",
    fanMode: "Fan",
    incidents: "Alertas",
    heatmap: "Mapa",
    dispatch: "Centro de IA",
    cta: "Ejecutar Mitigación",
    fanWelcome: "¡Bienvenido!",
    fanSub: "Guía en vivo para el Estadio SoFi.",
  }
};

type Incident = {
  id: string;
  level: "URGENT" | "WATCH";
  title: string;
  summary: string;
  location: string;
};

export default function EliteVenueConsole() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  
  // --- Agentic State Machines ---
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "running_agents" | "executing_tools" | "confirmed">("idle");
  const [agentLogs, setAgentLogs] = useState<{ crowd?: string; safety?: string; decision?: string }>({});
  const [missions, setMissions] = useState<string[]>([]);
  
  // --- Live Simulated Telemetry & Tool States ---
  const [gateBStatus, setGateBStatus] = useState<"FRICTION" | "OPEN">("FRICTION");
  const [crowdDensity, setCrowdDensity] = useState(92);
  const [safetyIndex, setSafetyIndex] = useState(9.8);

  const t = UI_TEXT[lang];

  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Gate B Bottleneck" : "Atasco Puerta B",
      summary: "Ticket scanner #4 telemetry reports offline state.",
      location: "Gate B / North Hub"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Heat Spike: Sec 114" : "Calor: Sec 114",
      summary: "Upper bowl ambient zone temperature reached 34°C.",
      location: "Section 114 / Upper"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const i = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const drift = setInterval(() => {
      if (dispatchStatus === "confirmed") {
        setCrowdDensity(prev => Math.max(45, prev - 4));
        setSafetyIndex(prev => Math.min(10.0, prev + 0.05));
      } else {
        setCrowdDensity(prev => Math.min(98, prev + (Math.random() > 0.5 ? 1 : 0)));
      }
    }, 4000);
    return () => clearInterval(drift);
  }, [dispatchStatus]);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  // --- REWIRED: Intelligent Orchestration Flow ---
  const handleApply = async () => {
    setDispatchStatus("running_agents");
    
    // 1. Immediately show "Processing" so the user knows the AI is working
    setAgentLogs({
      crowd: "Analyzing ingress density...",
      safety: "Checking heat thresholds...",
      decision: "Synthesizing mitigation..."
    });

    try {
      // 2. Add a timeout to the fetch so it doesn't hang forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zones: [{ zoneId: "Gate-B", zoneName: "North Hub", crowdLevel: current.id === "INC-1" ? "HIGH" : "MODERATE" }],
          fanProfile: { persona },
          language: lang,
          location: current.location
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 3. Fallback logic if the API is slow or fails (Essential for Demos!)
      if (!response.ok) throw new Error("API Offline");

      const data = await response.json();
      
      setAgentLogs({
        crowd: data.result.recommendation || "Crowd flow rerouted.",
        safety: data.result.reasoning || "Safety buffers cleared.",
        decision: `Action: ${data.result.recommendedZone} Optimized.`
      });

    } catch (error) {
      console.warn("Using Demo Fallback Mode (API Unavailable)");
      // This ensures your demo keeps moving even if the internet dies
      await new Promise(r => setTimeout(r, 1500)); // Simulate thinking
      setAgentLogs({
        crowd: current.id === "INC-1" ? "Identified 22% overflow at Gate B." : "Zone temp stable at 34°C.",
        safety: current.id === "INC-1" ? "Buffer zone capacity reached." : "Fans reporting heat stress.",
        decision: "RECOMMENDATION: Activate Emergency Overrides."
      });
    }

    // 4. Move to Tool Execution
    setDispatchStatus("executing_tools");
    
    setTimeout(() => {
      if (current.id === "INC-1") setGateBStatus("OPEN");
      if (current.id === "INC-2") setSafetyIndex(9.9);

      setDispatchStatus("confirmed");
      setMissions(prev => [`Fixed: ${current.title}`, ...prev.slice(0, 1)]);

      // 5. Reset to idle after victory message
      setTimeout(() => setDispatchStatus("idle"), 4000);
    }, 2000);
  };
  
  return (
    <main className="min-h-screen bg-[#F4F7F9] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">V</div>
            <h1 className="font-black tracking-tighter uppercase text-sm">{t.title} <span className="text-blue-600">{t.sub}</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button onClick={() => setPersona("OPS")} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${persona === "OPS" ? "bg-white shadow-sm" : "text-slate-400"}`}>{t.opsMode}</button>
              <button onClick={() => setPersona("FAN")} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${persona === "FAN" ? "bg-white shadow-sm" : "text-slate-400"}`}>{t.fanMode}</button>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-[10px] font-black uppercase border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition-colors">{lang}</button>
            <span className="font-mono text-xs font-bold text-slate-400">{time}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6">
        
        {/* COL 1: ALERTS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.incidents}</h2>
              <div className="flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                 <span className="text-[8px] text-blue-600 font-bold uppercase">3 Agents Active</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {incidents.map(i => (
                <button key={i.id} onClick={() => { setSelectedId(i.id); setAgentLogs({}); setDispatchStatus("idle"); }} className={`w-full p-4 rounded-xl text-left border transition-all ${selectedId === i.id ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase">{i.title}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${i.level === 'URGENT' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">{i.location}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4">Live Telemetry</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold">Crowd Load</span>
              <span className={`text-[10px] font-black ${crowdDensity > 80 ? 'text-red-500' : 'text-blue-600'}`}>{crowdDensity}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${crowdDensity}%` }} />
            </div>
            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold">Safety Index</span><span className="text-[10px] font-black text-emerald-600">{safetyIndex.toFixed(1)}/10</span></div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${safetyIndex * 10}%` }} />
            </div>
          </div>
        </div>

        {/* COL 2: MAP */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-6 left-8 flex flex-col gap-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.heatmap}</h2>
            </div>
            <p className="text-[11px] font-bold text-slate-900 italic">Sector: All Entrances</p>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 border border-slate-100 rounded-full" />
            <div className="absolute inset-4 border border-slate-100 rounded-full bg-slate-50/50 flex items-center justify-center shadow-inner">
              <div className="w-48 h-32 border-2 border-white bg-white shadow-xl rounded-[20%] flex items-center justify-center relative overflow-hidden transition-all duration-1000">
                <div className={`absolute inset-0 transition-colors duration-1000 ${gateBStatus === 'OPEN' ? 'bg-emerald-500/10' : 'bg-red-500/20'}`} />
                <div className="w-10 h-6 bg-emerald-500/20 border border-emerald-500 rounded-md" />
              </div>
            </div>
            {/* Gate Indicators */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-500">GATE A 🟢</span>
            <span className="absolute top-1/2 -right-10 -translate-y-1/2 text-[9px] font-black flex items-center gap-1">
              GATE B {gateBStatus === "OPEN" ? <span className="text-emerald-500">🟢 OPEN</span> : <span className="text-red-500 animate-pulse">🔴 SLOW</span>}
            </span>
          </div>

          <div className="mt-12 flex gap-10 border-t border-slate-100 pt-6 w-full justify-center">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">Moving Fast</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">High Friction</span></div>
          </div>
        </div>

        {/* COL 3: AI HUD */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">✨</span>
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.dispatch}</h2>
              </div>
              <span className={`text-[8px] font-mono uppercase tracking-widest ${dispatchStatus === 'idle' ? 'text-slate-600' : 'text-amber-400 animate-pulse'}`}>
                {dispatchStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black uppercase italic leading-tight">{current.title}</h3>
                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{current.location}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-wider mb-3">Multi-Agent Diagnostics</p>
                  
                  <div className="space-y-3 text-[11px]">
                    <div className="pb-2 border-b border-white/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase">👤 Crowd Agent</p>
                      <p className="text-slate-300 font-medium mt-0.5 leading-relaxed italic">
                        {agentLogs.crowd || "Awaiting telemetry..."}
                      </p>
                    </div>
                    <div className="pb-2 border-b border-white/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase">🛡️ Safety Agent</p>
                      <p className="text-slate-300 font-medium mt-0.5 leading-relaxed italic">
                        {agentLogs.safety || "Standing by..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-amber-400 uppercase">🧠 Chief Ops Agent</p>
                      <p className="text-white font-black mt-1 leading-relaxed">
                        {agentLogs.decision || "Awaiting evaluation..."}
                      </p>
                    </div>
                  </div>
                </div>

                {dispatchStatus === "executing_tools" && (
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 animate-bounce flex items-center gap-2">
                    <span className="text-lg">🛠️</span>
                    <div>
                       <p className="text-[9px] font-black text-emerald-400 uppercase">Applying Fix</p>
                       <p className="text-[10px] font-mono text-emerald-300 font-bold">system_override_v2.exec()</p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleApply}
                disabled={dispatchStatus !== "idle"}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                  dispatchStatus === "confirmed" 
                    ? "bg-emerald-500 text-white" 
                    : dispatchStatus !== "idle" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-black hover:bg-blue-50"
                }`}
              >
                {dispatchStatus === "confirmed" ? "✓ Task Resolved" : dispatchStatus !== "idle" ? "Processing..." : t.cta}
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black
