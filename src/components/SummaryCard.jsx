export function SummaryCard({ transcript, summary }) {
  if (!summary) return null;
  return (
    <section className="mt-5 rounded-2xl border border-[#e1e9e0] bg-white p-[18px] shadow-[0_5px_22px_#24352d08] sm:p-6">
      <div className="mb-[18px] flex items-start justify-between gap-4"><div><p className="mb-[5px] text-[.72rem] font-bold uppercase tracking-[.13em] text-[#458161]">Session complete</p><h2 className="m-0 text-[1.2rem] tracking-[-.02em] text-[#27382e]">Call Outcome</h2></div><span className="whitespace-nowrap text-[.72rem] text-[#42805b]">● Summary ready</span></div>
      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-[10px] bg-[#f5f8f4] p-[13px]"><span className="mb-[5px] block text-[.7rem] text-[#819087]">Intent</span><strong className="block text-[.82rem] capitalize text-[#345440]">{summary.customer_intent?.replaceAll("_", " ") || "Other"}</strong></div>
        <div className="rounded-[10px] bg-[#f5f8f4] p-[13px]"><span className="mb-[5px] block text-[.7rem] text-[#819087]">Resolution</span><strong className="block text-[.82rem] capitalize text-[#345440]">{summary.resolution_status || "Unresolved"}</strong></div>
        <div className="rounded-[10px] bg-[#f5f8f4] p-[13px]"><span className="mb-[5px] block text-[.7rem] text-[#819087]">Order</span><strong className="block text-[.82rem] capitalize text-[#345440]">{summary.order_id || "Not mentioned"}</strong></div>
      </div>
      <h3 className="mb-2 mt-[22px] text-[.9rem] text-[#35483b]">Conversation recap</h3>
      <div className="min-h-[70px] max-h-[430px] overflow-y-auto px-2.5 py-1">
        {transcript.map((message, index) => (
          <p className="my-[7px] text-[.82rem] text-[#617066]" key={`${message.role}-outcome-${index}`}><strong className="mr-[5px] text-[#3d604b]">{message.role}</strong> {message.text}</p>
        ))}
      </div>
      <p className="mt-[18px] border-l-[3px] border-[#78a384] bg-[#f2f7f2] px-4 py-[14px] text-[.86rem] leading-[1.55] text-[#496052]">{summary.call_summary}</p>
    </section>
  );
}
