import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      type, // 'shop_item' | 'subscription_monthly' | 'lifetime_archive'
      title, 
      price, 
      quantity = 1,
      shippingFee = 0,
      metadata = {} 
    } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. 本物のStripe APIキーが設定されている場合
    if (stripeSecretKey) {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2025-02-24.acacia" as any,
      });

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
              description: `発明ドットコム - ${type === "shop_item" ? "手作り直販品" : "発明家支援プラン"}`,
            },
            unit_amount: price,
            recurring: type === "subscription_monthly" ? { interval: "month" } : undefined,
          },
          quantity,
        },
      ];

      // 送料がある場合
      if (shippingFee > 0) {
        lineItems.push({
          price_data: {
            currency: "jpy",
            product_data: {
              name: "配送料（工房直送便）",
            },
            unit_amount: shippingFee,
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: type === "subscription_monthly" ? "subscription" : "payment",
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=${type}&title=${encodeURIComponent(title)}`,
        cancel_url: `${origin}/pricing`,
        metadata: {
          ...metadata,
          type,
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // 2. Stripe未設定時のテスト決済シミュレータ
    // 即座に成功画面へ安全にリダイレクトできるモックセッションURLを発行
    const mockSessionId = `mock_sess_${Date.now()}`;
    const mockSuccessUrl = `${origin}/checkout/success?session_id=${mockSessionId}&type=${type}&title=${encodeURIComponent(title)}&amount=${price + shippingFee}&simulated=true`;

    return NextResponse.json({ 
      url: mockSuccessUrl,
      simulated: true,
      message: "Stripeテストモード（シミュレーション決済）で実行されました。" 
    });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
