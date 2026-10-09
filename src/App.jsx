import { CallControls } from "./components/CallControls.jsx";
import { OrdersPanel } from "./components/OrdersPanel.jsx";
import { StatusBadge } from "./components/StatusBadge.jsx";
import { SummaryCard } from "./components/SummaryCard.jsx";
import { Transcript } from "./components/Transcript.jsx";
import { useVoiceCall } from "./hooks/useVoiceCall.js";

export default function App() {
  const voiceCall = useVoiceCall();

  return (
    <div className="min-h-screen bg-[#f7f9f6] font-mono text-[#20332a]">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <p className="m-0 text-[.85rem] font-bold tracking-[.02em] text-[#1c5a3e]">Aura Skincare</p>
        <span className="text-[.72rem] text-[#718076]">Support console</span>
      </header>

      <section className="flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center px-5 pb-24 text-center sm:px-10">
        <p className="mb-6 text-[.72rem] uppercase tracking-[.2em] text-[#6f8a7a]">Your AI care companion</p>
        <h1 className="m-0 text-[clamp(3.2rem,11vw,9rem)] font-bold leading-[.95] tracking-[-.07em]">
          Talk to <span className="text-[#246b4d]">Aria</span>
        </h1>
        <p className="mb-8 mt-7 max-w-[460px] text-[.95rem] leading-relaxed text-[#68786e]">
          Support for every Aura order. Tracking, returns and routines, by voice.
        </p>
        <div className="mb-8">
          <StatusBadge state={voiceCall.state} />
        </div>
        <CallControls state={voiceCall.state} onStart={voiceCall.startCall} onEnd={voiceCall.endCall} />
        {voiceCall.errorMessage && (
          <p role="alert" className="mt-6 max-w-[460px] text-[.82rem] text-[#a14d4d]">
            {voiceCall.errorMessage}
          </p>
        )}
      </section>

      <section className="mx-auto grid w-full max-w-[1800px] grid-cols-1 items-stretch gap-6 px-5 pb-20 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 lg:min-h-[720px] [&>*]:!m-0 lg:[&>*]:h-full">
          <OrdersPanel />
        </div>
        <div className="relative min-h-[480px] min-w-0 rounded-xl border border-[#e1e9e0] bg-white">
          <div className="flex h-full min-h-[480px] flex-col p-7 lg:absolute lg:inset-0 lg:min-h-0">
            <h2 className="m-0 mb-5 border-b border-[#edf1eb] pb-5 text-[1.1rem] font-bold tracking-[-.01em] text-[#27382e]">Live transcript</h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Transcript transcript={voiceCall.transcript} />
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <SummaryCard transcript={voiceCall.transcript} summary={voiceCall.summary} />
        </div>
      </section>
    </div>
  );
}