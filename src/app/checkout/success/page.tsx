"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Heart, Sparkles, ArrowRight, Printer } from "lucide-react";
import { Header, Footer } from "@/components/Navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "お申し込み内容";
  const type = searchParams.get("type") || "order";
  const amount = searchParams.get("amount");
  const isSimulated = searchParams.get("simulated") === "true";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-xl text-center space-y-6">
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          {isSimulated && (
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
              Stripe テスト決済完了（シミュレーション）
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            お支払いが完了いたしました
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            発明ドットコムをご利用いただき誠にありがとうございます。
            ご登録のメールアドレスへ決済完了のご案内をお送りいたしました。
          </p>
        </div>

        {/* 注文明細カード */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between text-stone-500 pb-2 border-b border-stone-200">
            <span>項目</span>
            <span className="font-bold text-stone-900">{decodeURIComponent(title)}</span>
          </div>

          {amount && (
            <div className="flex justify-between text-stone-500 pb-2 border-b border-stone-200">
              <span>決済合計金額 (税込)</span>
              <span className="font-extrabold text-stone-900 text-base">
                ¥{Number(amount).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between text-stone-500">
            <span>ステータス</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 正常に処理されました
            </span>
          </div>
        </div>

        {/* プラン別の特典・案内 */}
        {type === "lifetime_archive" && (
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/80 text-left space-y-2 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              【永久アーカイブ＆特製アクリル盾のお届け】
            </span>
            <p className="text-stone-700 leading-relaxed">
              ご指定の住所へ、特許番号とQRコードを刻印した特製アクリル記念盾を約2週間でお届けいたします。
              また、作品データは生涯にわたり永久保存され、カード更新等による自動削除は行われません。
            </p>
          </div>
        )}

        {type === "shop_item" && (
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200/80 text-left space-y-2 text-xs">
            <span className="font-bold text-emerald-950 flex items-center gap-1">
              <Heart className="w-4 h-4 text-emerald-600" />
              【発明家からの直送について】
            </span>
            <p className="text-stone-700 leading-relaxed">
              発明家の工房へ注文通知と応援メッセージが届きました。
              一つひとつ大切に梱包して発送いたします。発送完了時に伝票番号をメールでお知らせいたします。
            </p>
          </div>
        )}

        {/* アクションボタン */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>領収書を印刷</span>
          </button>

          <Link
            href="/mypage"
            className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>マイページへ進む</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-10 text-center text-xs text-stone-500">決済情報を読み込み中...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
