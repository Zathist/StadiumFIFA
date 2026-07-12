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
    dispatch: "AI Support Assistant",
    threatLevel: "Status: Normal",
    cta: "Apply AI Solution",
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
    dispatch: "Asistente de IA",
    threatLevel: "Estado: Normal",
    cta: "Aplicar Solución IA",
    sustainability: "Eco-Impacto: 92%",
    fanWelcome: "¡Bienvenido al Estadio!",
    fanSub: "Te ayudaremos a encontrar el mejor camino.",
    safetyTip: "Recordatorio: Solo bolsas transparentes permitidas."
  }
};

type Incident = {
  id: string;
  level: "URGENT" | "WATCH" | "INFO";
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
  
  // New States for Human-Friendly Feedback
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "sending" | "confirmed">("idle");
  const [actionLog, setActionLog] = useState<string[]>([]);

  const t = UI_TEXT[lang];

  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Crowded at Gate B" : "Multitud en Puerta B",
      reasoning: "Ticket scanner #4 is broken. People are waiting over 30 minutes.",
      prediction: "If we don't act, the line will wrap around the block in 15 mins.",
      location: "Gate B / North Hub",
      time: "10:32 AM"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Medical: Section 114" : "Médico: Sección 114",
      reasoning: "Temperature sensors show it's too hot here. High risk of fainting.",
      prediction: "Direct fans to water stations. Send medical unit to check the area.",
      location: "Section 114 / Upper Level",
      time: "10:38 AM"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const i = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(i);
  }, []);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  const handleApplySolution = () => {
    setDispatchStatus("sending");
    
    // Simulate a "Human" timeline of events
    setTimeout(() => {
      setDispatchStatus("confirmed");
      setActionLog(prev => [`${current.title} - Staff Dispatched (${new Date().toLocaleTimeString()})`, ...prev.slice(0, 2)]);
      
      // Reset after 5 seconds to show it's "Done"
      setTimeout(() => setDispatchStatus("idle"), 5000);
    }, 1500);
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
          
          {/* COLUMN 1: ALERTS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.incidents}</h2>

              {persona === "OPS" ? (
                <div className="space-y-3">
                  {incidents.map(i => (
                    <button key={i.id} onClick={() => { setSelectedId(i.id); setDispatchStatus("idle"); }} className={`w-full p-4 rounded-xl border text-left transition-all block ${selectedId === i.id ? "bg-slate-50 border-black ring-1 ring-black" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase">{i.title}</h3>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${i.level === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{i.level}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">{i.location}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                   <h3 className="text-base font-black">{t.fanWelcome}</h3>
                   <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-[9px] font-black text-emerald-700 uppercase mb-1">Best Entry For You</p>
                      <p className="text-sm font-bold">North Gate (A)</p>
                      <p className="text-[10px] text-emerald-600 mt-1">Short lines • 4 min walk</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">{t.safetyTip}</p>
                </div>
              )}
            </div>

            <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
               <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Entry Speed</h4>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1"><span>North Gate</span><span className="text-emerald-400">FAST</span></div>
                    <div className="h-1 w-full bg-white/10 rounded-full"><div className="h-full bg-emerald-500 w-1/4" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1"><span>South Gate</span><span className="text-red-400">BUSY</span></div>
                    <div className="h-1 w-full bg-white/10 rounded-full"><div className="h-full bg-red-500 w-[90%]" /></div>
                  </div>
               </div>
            </div>
          </div>

          {/* COLUMN 2: MAP */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm min-h-[500px] relative overflow-hidden">
             <div className="absolute top-6 left-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.heatmap}</h2>
                <p className="text-xs font-bold text-slate-900 mt-1">Live View: All Entrances</p>
             </div>

             <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <div className="absolute inset-0 border border-dashed border-slate-200 rounded-full animate-[spin_80s_linear_infinite]" />
                <div className="absolute inset-8 border border-slate-200 rounded-full bg-slate-50 flex items-center justify-center shadow-inner">
                   <div className="w-full h-full relative p-6">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">EMPTY</div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded shadow-sm animate-pulse">BUSY</div>
                      <div className="w-full h-full border-2 border-white bg-white rounded-full flex items-center justify-center shadow-sm">
                         <div className="w-24 h-16 border-2 border-slate-100 rounded bg-slate-50" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-12 flex gap-8">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase text-slate-400">Easy Entry</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-black uppercase text-slate-400">Wait Area</span></div>
             </div>
          </div>

          {/* COLUMN 3: AI ASSISTANT */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">{t.dispatch}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-white leading-tight uppercase italic">{current.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{current.location}</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-2">What's happening right now</p>
                    <p className="text-xs font-medium text-slate-300">{current.reasoning}</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-amber-400 uppercase mb-2">How the AI figured this out</p>
                    <div className="space-y-1 text-xs text-slate-300 font-medium">
                      {current.id === "INC-1" ? (
                        <>
                          <p>1. Scanner #4 turned off.</p>
                          <p>2. Line is growing by 20 people every minute.</p>
                          <p>3. The area can only hold 400 people max.</p>
                          <p className="text-amber-300 font-bold">★ Best fix: Send new arrivals to North Gate A.</p>
                        </>
                      ) : (
                        <>
                          <p>1. Seat sensors show high heat (34°C).</p>
                          <p>2. Fans are sitting packed closely together.</p>
                          <p>3. High risk of people getting sick.</p>
                          <p className="text-amber-300 font-bold">★ Best fix: Open water stations and send medics.</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-purple-400 uppercase mb-2">What happens next if we do nothing</p>
                    <p className="text-xs font-bold text-white italic">{current.prediction}</p>
                  </div>
                </div>

                <button 
                  onClick={handleApplySolution}
                  disabled={dispatchStatus !== "idle"}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all duration-300 ${
                    dispatchStatus === "confirmed" 
                      ? "bg-emerald-500 text-white" 
                      : dispatchStatus === "sending" 
                        ? "bg-blue-600 text-white animate-pulse" 
                        : "bg-white text-black hover:bg-blue-50"
                  }`}
                >
                  {dispatchStatus === "confirmed" ? "✓ Solution Applied" : dispatchStatus === "sending" ? "Sending Help..." : t.cta}
                </button>

                {/* VISUAL FEEDBACK STEPPER */}
                {dispatchStatus !== "idle" && (
                  <div className="mt-4 flex gap-1 h-1">
                     <div className={`flex-1 rounded-full ${dispatchStatus === "sending" || dispatchStatus === "confirmed" ? 'bg-blue-400' : 'bg-white/10'}`} />
                     <div className={`flex-1 rounded-full ${dispatchStatus === "confirmed" ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  </div>
                )}
              </div>
            </div>

            {/* ACTION LOG - FOR HUMAN UNDERSTANDING */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Actions</h4>
               <div className="space-y-2">
                  {actionLog.length > 0 ? actionLog.map((log, i) => (
                    <p key={i} className="text-[10px] font-bold text-slate-600 border-l-2 border-emerald-500 pl-2">{log}</p>
                  )) : <p className="text-[10px] text-slate-400 italic">No actions taken yet.</p>}
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
