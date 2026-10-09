const orders = {
  "ORD-101": {
    customer: "Priya Sharma",
    product: "Vitamin C Serum (30ml)",
    value: 699,
    status: "Out for Delivery",
    carrier: "BlueDart",
    tracking: "BD-982103",
    note: "Expected by 6 PM today",
    can_cancel: false,
    return_eligible: false
  },
  "ORD-102": {
    customer: "Rahul Verma",
    product: "Hydrating Sunscreen SPF 50",
    value: 499,
    status: "Delivered",
    carrier: "Delhivery",
    tracking: "DL-441029",
    note: "Delivered 14 days ago",
    can_cancel: false,
    return_eligible: false,
    return_note: "Outside the 7-day return window"
  },
  "ORD-103": {
    customer: "Ananya Patel",
    product: "Green Tea Face Wash + Toner",
    value: 850,
    status: "Processing",
    note: "Ordered 3 hours ago. Eligible for cancellation",
    can_cancel: true,
    return_eligible: false
  },
  "ORD-104": {
    customer: "Meera Iyer",
    product: "Rosewater Glow Kit",
    value: 1199,
    status: "Shipped",
    carrier: "Delhivery",
    tracking: "DL-772418",
    note: "Arriving tomorrow",
    can_cancel: false,
    return_eligible: false
  },
  "ORD-105": {
    customer: "Vikram Singh",
    product: "Ayurvedic Night Cream",
    value: 799,
    status: "Delivered",
    carrier: "BlueDart",
    tracking: "BD-501886",
    note: "Delivered yesterday",
    can_cancel: false,
    return_eligible: true
  },
  "ORD-106": {
    customer: "Sneha Kulkarni",
    product: "Neem & Tulsi Face Wash",
    value: 349,
    status: "Processing",
    note: "Ordered 20 minutes ago",
    can_cancel: true,
    return_eligible: false
  }
};

export function getOrderDetails(rawId) {
  const digits = String(rawId || "").replace(/\D/g, "");
  const orderId = `ORD-${digits}`;
  const order = orders[orderId];

  if (!order) {
    return {
      found: false,
      message: "No order found with this ID. Ask the customer to verify it."
    };
  }

  return { found: true, order_id: orderId, ...order };
}

export { orders };
