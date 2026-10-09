export function CallControls({ state, onStart, onEnd }) {
  const active = state !== "Idle";
  return (
    <div className="mt-6 flex gap-3">
      <button className="cursor-pointer rounded-xl border-0 bg-[#246b4d] px-[21px] py-[13px] font-sans font-bold text-white shadow-[0_7px_16px_#246b4d29] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d5b40] hover:shadow-[0_10px_20px_#246b4d38] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none" onClick={onStart} disabled={active}>Start Call</button>
      <button className="cursor-pointer rounded-xl border border-[#dfbebe] bg-white px-[21px] py-[13px] font-sans font-bold text-[#a14d4d] shadow-none transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff6f5] disabled:cursor-not-allowed disabled:opacity-45" onClick={onEnd} disabled={!active}>End Call</button>
    </div>
  );
}
