import { CallControls } from "./components/CallControls.jsx";
import { OrdersPanel } from "./components/OrdersPanel.jsx";
import { StatusBadge } from "./components/StatusBadge.jsx";
import { SummaryCard } from "./components/SummaryCard.jsx";
import { useVoiceCall } from "./hooks/useVoiceCall.js";

const AGENT_ROLES = ["agent", "assistant", "aria", "ai", "bot", "model"];

const getRole = (message) => String(message?.role ?? message?.speaker ?? message?.from ?? message?.sender ?? "").toLowerCase();

const getText = (message) => (typeof message === "string" ? message : message?.text ?? message?.content ?? message?.message ?? message?.transcript ?? "");

const popKeyframes = `@keyframes bubble-pop {
  0% { opacity: 0; transform: translateY(16px) scale(.85); }
  60% { opacity: 1; transform: translateY(-2px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}`;

export default function App() {
  const voiceCall = useVoiceCall();
  const messages = (voiceCall.transcript ?? []).filter((message) => getText(message).trim());
  const hasChat = messages.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9f6] font-mono text-[#20332a]">
      <style>{popKeyframes}</style>

      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <p className="m-0 text-[.85rem] font-bold tracking-[.02em] text-[#1c5a3e]">Aura Skincare</p>
        <span className="text-[.72rem] text-[#718076]">Support console</span>
      </header>

      <section
        className={`flex w-full flex-col items-center justify-center px-5 pb-14 pt-4 text-center transition-[padding] duration-500 sm:px-10 ${hasChat ? "lg:pr-[460px]" : ""}`}
      >
        <p className="mb-4 text-[.72rem] uppercase tracking-[.2em] text-[#6f8a7a]">Your AI care companion</p>
        <h1 className="m-0 text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[.95] tracking-[-.07em]">
          Talk to <span className="text-[#246b4d]">Aria</span>
        </h1>
        <p className="mb-5 mt-5 max-w-[460px] text-[.95rem] leading-relaxed text-[#68786e]">
          Support for every Aura order. Tracking, returns and routines, by voice.
        </p>
        <div className="mb-5">
          <StatusBadge state={voiceCall.state} />
        </div>
        <CallControls state={voiceCall.state} onStart={voiceCall.startCall} onEnd={voiceCall.endCall} />
        {voiceCall.errorMessage && (
          <p role="alert" className="mt-6 max-w-[460px] text-[.82rem] text-[#a14d4d]">
            {voiceCall.errorMessage}
          </p>
        )}
      </section>

      {hasChat && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-6 right-5 top-[72px] z-20 flex w-[400px] max-w-[calc(100vw-2.5rem)] flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%)] sm:right-10"
        >
          {messages.map((message, index) => {
            const isAgent = AGENT_ROLES.includes(getRole(message));
            return (
              <div
                key={message?.id ?? index}
                className={`flex flex-col gap-1 ${isAgent ? "items-start" : "items-end"}`}
              >
                <span className="px-1 text-[.64rem] uppercase tracking-[.14em] text-[#7b8d81]">{isAgent ? "Aria" : "Customer"}</span>
                <p
                  className={`m-0 max-w-[88%] animate-[bubble-pop_.4s_ease-out_both] px-4 py-3 text-[.84rem] leading-relaxed shadow-[0_8px_24px_#24352d18] ${
                    isAgent
                      ? "origin-bottom-left rounded-2xl rounded-bl-md bg-white text-[#27382e]"
                      : "origin-bottom-right rounded-2xl rounded-br-md bg-[#246b4d] text-white"
                  }`}
                >
                  {getText(message)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <section
        className={`w-full px-5 pb-20 transition-[padding] duration-500 sm:px-10 ${hasChat ? "lg:pr-[460px]" : ""}`}
      >
        <div className="mx-auto w-full max-w-[1500px] [&>*]:!m-0">
          <OrdersPanel />
        </div>
        <div className="mx-auto mt-6 w-full max-w-[1500px]">
          <SummaryCard transcript={voiceCall.transcript} summary={voiceCall.summary} />
        </div>
      </section>
    </div>
  );
}