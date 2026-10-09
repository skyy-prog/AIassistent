export function Transcript({ transcript }) {
  if (transcript.length === 0) return <div className="flex min-h-[130px] flex-col items-center justify-center text-center text-[#718076]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eaf3ec] text-[#458161]">✦</span><p className="my-[7px] mb-[3px] text-[.87rem] text-[#586a5e]">Your conversation will appear here.</p><small className="text-[.75rem] text-[#a0aca2]">Start a call and Aria will greet your customer.</small></div>;
  return (
    <div className="max-h-[430px] min-h-[70px] overflow-y-auto px-2.5 py-1 [scrollbar-color:#bfd4c3_transparent] [scrollbar-width:thin]">
      {transcript.map((message, index) => (
        <div className={`my-[13px] flex max-w-[94%] gap-[11px] sm:max-w-[82%] ${message.role === "Aria" ? "" : "ml-auto flex-row-reverse text-right"}`} key={`${message.role}-${index}`}>
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-[10px] bg-[#e6f1e8] text-[.7rem] font-bold text-[#246b4d] ${message.role === "Aria" ? "" : "bg-[#f7eedc] text-[#876d47]"}`}>{message.role === "Aria" ? "A" : "C"}</span>
          <div><strong className="mb-1 block text-[.7rem] text-[#6e7f73]">{message.role}</strong><p className={`m-0 w-fit max-w-full break-words rounded-[4px_12px_12px_12px] bg-[#f2f7f2] px-[13px] py-2.5 text-left text-[.85rem] leading-[1.5] text-[#3e5044] ${message.role === "Aria" ? "" : "rounded-[12px_4px_12px_12px] bg-[#f8f1e5]"}`}>{message.text}</p></div>
        </div>
      ))}
    </div>
  );
}
