import { connectToDatabase } from "@/lib/database/connect";
import Order, { IOrder } from "@/lib/database/models/order.model";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  // Extra guard (not strictly needed in Next.js App Router, since this file is already POST-only)
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Not Allowed" }, { status: 405 });
  }

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    console.error("❌ Webhook signature verification failed:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  // Handle checkout session completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata?.orderId) {
      console.error("⚠️ Checkout session missing orderId in metadata");
      return new Response(null, { status: 503 });
    }

    await connectToDatabase();

   const order = await Order.findById(session.metadata.orderId).exec();

 if (!order) {
  return new Response("Order not found", { status: 404 });
}

order.isPaid = true;
order.paidAt = new Date();
await order.save();

    console.log(`✅ Order ${order._id} marked as paid.`);
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
