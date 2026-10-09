export function StatusBadge({ state }) {
  const tone = {
    Connecting: "border-[#ead7a2] bg-[#fff7dc] text-[#9b762d]",
    Thinking: "border-[#ead7a2] bg-[#fff7dc] text-[#9b762d]",
    Speaking: "border-[#c9c2e6] bg-[#f0edfb] text-[#635489]"
  }[state] || "border-[#c6dacb] bg-[#eaf3ec] text-[#246b4d]";
  return <span className={`inline-block rounded-full border px-3 py-1.5 text-[.75rem] font-bold ${tone}`}>{state}</span>;
}
