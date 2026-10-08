import { NextResponse } from "next/server";
import Stripe from "stripe";
import { mockShopProducts } from "@/data/mock";

const PLAN_PRICES: Record<string, { price: number; title: string }> = {
  subscription_monthly: { price: 550, title: "スタンダード月額プラン（月額550円）" },
  lifetime_archive: { price: 29800, title: "永久アーカイブ保存パック（29,800円・記念盾付き）" },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      type, // 'shop_item' | 'subscription_monthly' | 'lifetime_archive'
      productId,
      title: clientTitle, 
      quantity = 1,
      metadata = {} 
    } = body;

    // サーバーサイドでの価格・商品名・送料の安全な確定（改ざん防止）
    let verifiedPrice = 0;
    let verifiedTitle = clientTitle || "発明ドットコム サービス";
    let verifiedShippingFee = 0;

    if (type === "subscription_monthly" || type === "lifetime_archive") {
      const plan = PLAN_PRICES[type];
      verifiedPrice = plan.price;
      verifiedTitle = plan.title;
      verifiedShippingFee = 0;
    } else if (type === "shop_item") {
      // 直販ショップ商品マスターから安全に照合
      const matchedProduct = mockShopProducts.find(
        (p) => p.id === productId || p.title === clientTitle
      );
      if (matchedProduct) {
        verifiedPrice = matchedProduct.price;
        verifiedTitle = matchedProduct.title;
        verifiedShippingFee = matchedProduct.shippingFee;
      } else {
        return NextResponse.json(
          { error: "指定された商品が見つかりません。価格を確定できませんでした。" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "不正な決済タイプが指定されました。" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. 本物のStripe APIキーが設定されている場合
    if (stripeSecretKey) {
      const stripe = new Stripe(stripeSecretKey);

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: verifiedTitle,
              description: `発明ドットコム - ${type === "shop_item" ? "手作り直販品" : "発明家支援プラン"}`,
            },
            unit_amount: verifiedPrice,
            recurring: type === "subscription_monthly" ? { interval: "month" } : undefined,
          },
          quantity,
        },
      ];

      // 送料がある場合
      if (verifiedShippingFee > 0) {
        lineItems.push({
          price_data: {
            currency: "jpy",
            product_data: {
              name: "配送料（工房直送便）",
            },
            unit_amount: verifiedShippingFee,
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: type === "subscription_monthly" ? "subscription" : "payment",
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=${type}&title=${encodeURIComponent(verifiedTitle)}`,
        cancel_url: `${origin}/pricing`,
        metadata: {
          ...metadata,
          type,
          productId: productId || "",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // 2. Stripe未設定時のテスト決済シミュレータ
    // 即座に成功画面へ安全にリダイレクトできるモックセッションURLを発行
    const mockSessionId = `mock_sess_${Date.now()}`;
    const mockSuccessUrl = `${origin}/checkout/success?session_id=${mockSessionId}&type=${type}&title=${encodeURIComponent(verifiedTitle)}&amount=${verifiedPrice + verifiedShippingFee}&simulated=true`;

    return NextResponse.json({ 
      url: mockSuccessUrl,
      simulated: true,
      message: "Stripeテストモード（シミュレーション決済）で実行されました。" 
    });

  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    const message = error instanceof Error ? error.message : "決済セッションの作成に失敗しました";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
