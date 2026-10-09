import { sampleOrders } from "../orders.js";

const suggestions = [
  "Where is my order ORD-101?",
  "Cancel ORD-103",
  "Can I return ORD-102?",
  "Can I return something opened 20 days ago?",
  "Is COD available for ORD-104?",
  "Track my latest order"
];

export function OrdersPanel() {
  return (
    <section className="mt-5 rounded-2xl border border-[#e1e9e0] bg-white p-[18px] shadow-[0_5px_22px_#24352d08] sm:p-6">
      <div className="mb-[18px] flex items-start justify-between gap-4">
        <div><p className="mb-[5px] text-[.72rem] font-bold uppercase tracking-[.13em] text-[#458161]">Demo workspace</p><h2 className="m-0 text-[1.2rem] tracking-[-.02em] text-[#27382e]">Recent customer orders</h2></div>
        <span className="whitespace-nowrap text-[.72rem] text-[#7a8b7f]">{sampleOrders.length} sample orders</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {sampleOrders.map((order) => (
          <article className="rounded-[13px] border border-[#e3ece3] bg-[#f7faf6] p-4" key={order.order_id}>
            <div className="flex items-center justify-between gap-2"><strong className="text-[.82rem] text-[#246b4d]">{order.order_id}</strong><span className={`rounded-full px-2 py-1 text-[.65rem] font-bold ${order.status === "Delivered" ? "bg-[#e8eff8] text-[#56749a]" : order.status === "Shipped" || order.status === "Out for Delivery" ? "bg-[#fff2ca] text-[#8b6b27]" : "bg-[#e4f0e6] text-[#567f61]"}`}>{order.status}</span></div>
            <p className="mb-[3px] mt-4 font-semibold text-[#304338]">{order.customer}</p>
            <p className="mb-[14px] min-h-9 text-[.84rem] text-[#718076]">{order.product}</p>
            <div className="flex items-center justify-between gap-2 border-t border-[#e4ece3] pt-3"><strong className="text-[#2c4938]">₹{order.value.toLocaleString("en-IN")}</strong><small className="text-right text-[.67rem] text-[#829087]">{order.note}</small></div>
          </article>
        ))}
      </div>
      <h3 className="mb-2 mt-6 text-[.9rem] text-[#35483b]">Try saying</h3>
      <ul className="m-0 flex flex-wrap gap-2 p-0">
        {suggestions.map((suggestion) => <li className="rounded-[9px] border border-[#e3ebe2] px-3 py-[9px] text-[.77rem] text-[#637469]" key={suggestion}><span className="mr-[3px] text-base text-[#a1b5a5]">“</span>{suggestion}</li>)}
      </ul>
    </section>
  );
}
