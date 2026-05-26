declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options: {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  prefill?: { name?: string | null; email?: string | null; contact?: string | null };
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const loaded = await loadScript();
  if (!loaded) throw new Error("Failed to load Razorpay. Check your internet connection.");

  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key || key.includes("xxx")) throw new Error("Razorpay key not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local");

  const rzp = new window.Razorpay({
    key,
    amount: options.amount,
    currency: options.currency,
    name: "Healthify Women's Fitness Club",
    description: options.description,
    order_id: options.orderId,
    handler: options.onSuccess,
    prefill: {
      name: options.prefill?.name ?? undefined,
      email: options.prefill?.email ?? undefined,
      contact: options.prefill?.contact ?? undefined,
    },
    theme: { color: "#FF6B35" },
    modal: { ondismiss: options.onDismiss },
  });

  rzp.open();
}
