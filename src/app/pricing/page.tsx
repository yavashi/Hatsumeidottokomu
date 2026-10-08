"use client";

import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { 
  Sparkles, 
  Check, 
  Award, 
  ShieldCheck, 
  QrCode,
  FileText
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 w-full flex-1">
        {/* ヘッダーエリア */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>透明で安心な料金プラン</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
            あなたの生涯の発明を、<br />
            ずっと残る形に。
          </h1>
          <p className="text-stone-600 text-sm md:text-base mt-3 leading-relaxed">
            たった1作品でも大歓迎です。初期無料でお試しいただき、生涯の記念として残したい方や企業との商品化を目指す方に合わせたプランをご用意しています。
          </p>
        </div>

        {/* プラン比較カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          {/* プラン1: フリー（初期無料） */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  FREE TRIAL
                </span>
                <span className="bg-stone-100 text-stone-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  まずはお試し
                </span>
              </div>
              <h3 className="text-xl font-black text-stone-900">無料プラン</h3>
              <p className="text-xs text-stone-500 mt-1">1作品の登録・一般公開がずっと無料</p>

              <div className="my-6">
                <span className="text-4xl font-black text-stone-900">0</span>
                <span className="text-xs text-stone-500 ml-1">円 / ずっと無料</span>
              </div>

              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>作品1点のAI対話型自動ページ生成</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>一般ユーザー向けオープン公開</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>「商品化されたら欲しい！」投票の受付</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>応援メッセージの閲覧</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 rounded-2xl text-xs text-center transition block"
            >
              無料で試してみる
            </Link>
          </div>

          {/* プラン2: スタンダード月額（商品化支援） */}
          <div className="bg-white rounded-3xl border-2 border-amber-500 p-6 md:p-8 flex flex-col justify-between shadow-lg relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[11px] font-black px-4 py-1 rounded-full shadow-xs">
              商品化を目指す方におすすめ
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  STANDARD MONTHLY
                </span>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  人気プラン
                </span>
              </div>
              <h3 className="text-xl font-black text-stone-900">月額スタンダード</h3>
              <p className="text-xs text-stone-500 mt-1">企業連携と需要分析で商品化を加速</p>

              <div className="my-6">
                <span className="text-4xl font-black text-amber-800">550</span>
                <span className="text-xs text-stone-500 ml-1">円 / 月（1作品目込）</span>
                <p className="text-[11px] text-stone-400 mt-1">※ 2作品目以降 +110円/月/作品</p>
              </div>

              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>無料プランの全機能</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>企業向け詳細スペックシートの公開</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>メーカーからの直接オファー・問い合わせ受付</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>月次反響レポート（閲覧数・希望者属性の通知）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>応援メッセージへの返信用公式バッジ</span>
                </li>
              </ul>
            </div>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "subscription_monthly",
                        title: "発明ドットコム スタンダードプラン（月額）",
                        price: 550,
                      }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {
                    alert("決済画面の起動に失敗しました。");
                  }
                }}
                className="mt-8 w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl text-xs text-center shadow-md transition block cursor-pointer"
              >
                スタンダードで始める (月額550円)
              </button>
            </div>

            {/* プラン3: 生涯・永久アーカイブ保存パック（買い切り） */}
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-lg border border-stone-800">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    LIFETIME ARCHIVE
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    後世・家族へ残す
                  </span>
                </div>
                <h3 className="text-xl font-black text-stone-100">永久アーカイブ保存パック</h3>
                <p className="text-xs text-stone-400 mt-1">クレジットカード停止後も生涯・死後永久に保管</p>

                <div className="my-6">
                  <span className="text-3xl md:text-4xl font-black text-amber-400">29,800</span>
                  <span className="text-xs text-stone-400 ml-1">円（一括買い切り・追加料金ゼロ）</span>
                </div>

                <ul className="space-y-3 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>永久サーバー保存保証</strong>（基金プールによる維持）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>QRコード付き特製アクリル記念盾</strong>をご自宅へ送付</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>AIによる「開発年表・発明家人生史PDF」の作成</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>家族・子孫アカウントへの管理権限継承サポート</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "lifetime_archive",
                        title: "発明ドットコム 永久アーカイブ保存パック（記念盾送付付き）",
                        price: 29800,
                      }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {
                    alert("決済画面の起動に失敗しました。");
                  }
                }}
                className="mt-8 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-2xl text-xs text-center transition block cursor-pointer shadow-md"
              >
                永久アーカイブを申し込む (29,800円)
              </button>
            </div>
          </div>

        {/* 家族向け永久アーカイブの解説セクション */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 md:p-12 mb-16 shadow-xs">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Award className="w-4 h-4 text-amber-700" />
              <span>発明ドットコムならではの価値</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
              なぜ「月額」だけでなく「永久買い切り」があるのか？
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-stone-600 leading-relaxed">
              <p>
                一般的なWebサービスでは、契約者様がお亡くなりになるとクレジットカードの解約に伴い、これまでの写真や記録がすべて消去されてしまいます。
              </p>
              <p>
                しかし個人発明家の発明は、<strong>「何十年もの試行錯誤」「家族への愛情」「職人としての誇り」</strong>が詰まった生涯の記念碑（モニュメント）です。
              </p>
              <p>
                発明ドットコムの「永久アーカイブ保存パック」は、維持基金により将来にわたってサーバー代を担保し、ご本人が旅立たれた後も家族やお孫さんが「おじいちゃんはこんな素晴らしい発明をしたんだ」といつでも閲覧できるデジタル博物館として守り続けます。
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-100 text-center">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <QrCode className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <span className="font-bold text-xs text-stone-900 block">特製アクリル記念盾</span>
                <p className="text-[11px] text-stone-500 mt-1">リビングや仏壇に飾れる本物の盾をご自宅にお届け</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <FileText className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <span className="font-bold text-xs text-stone-900 block">開発クロニクルPDF</span>
                <p className="text-[11px] text-stone-500 mt-1">失敗談や特許取得までの人生ドラマを製本用PDF化</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <ShieldCheck className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <span className="font-bold text-xs text-stone-900 block">家族アカウント継承</span>
                <p className="text-[11px] text-stone-500 mt-1">ご家族へ管理者権限を移譲し後世まで安全に保管</p>
              </div>
            </div>
          </div>
        </div>

        {/* 企業・製造会社向け 提携モデル案内 */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-12 mb-16 shadow-md">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              FOR ENTERPRISE & MANUFACTURERS
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              新商品の種を探しているメーカー・企業様へ
            </h2>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed mb-6">
              「すでに一般ユーザーから数十〜数百名の『欲しい！』投票が集まっている個人発明」を検索・スカウトできます。特許実施許諾（ライセンス契約）や試作連携は運営事務局が中立的に仲介いたします。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/inventions"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-2xl text-xs transition"
              >
                企業向けに発明品を検索する
              </Link>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-stone-900 text-center mb-6">
            料金に関するよくある質問
          </h2>
          <div className="space-y-4 text-xs md:text-sm">
            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Q. 無料プランのままずっと使い続けることはできますか？</span>
              <p className="text-stone-600 leading-relaxed">
                はい、可能です。最初の1作品は無料プランのままで期限なく掲載・公開いただけます。追加料金が勝手に発生することは一切ございません。
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Q. パソコンやカード決済が苦手な高齢者でも支払いできますか？</span>
              <p className="text-stone-600 leading-relaxed">
                クレジットカードのほか、銀行振込やコンビニ決済、またご家族様による代理お支払いにも対応しております。
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Q. 商品化が決まった場合の手数料はどうなりますか？</span>
              <p className="text-stone-600 leading-relaxed">
                企業とのマッチングおよびライセンス契約が成立した場合のみ、成功報酬として契約一時金・ロイヤリティの15〜20%を仲介手数料として頂戴します。成立しなかった場合の手数料は0円です。
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
