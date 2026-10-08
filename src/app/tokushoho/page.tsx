import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "特定商取引法に基づく表記 | 発明ドットコム",
  description: "発明ドットコムの特定商取引法に基づく表記です。プラットフォーム運営会社による代行表記および販売条件を明記しています。",
};

export default function TokushohoPage() {
  const rows = [
    { label: "プラットフォーム運営事業者", value: "発明ドットコム 運営事務局" },
    { label: "運営統括責任者", value: "八橋 研二（代表責任者）" },
    { label: "所在地", value: "〒144-0052 東京都大田区南蒲田2丁目16番 発明支援ラボ" },
    { label: "電話番号", value: "03-6800-8290（受付時間：平日 10:00〜17:00）" },
    { label: "メールアドレス", value: "support@hatsumei.com" },
    { label: "販売価格", value: "各商品・プラン詳細ページに表示（消費税込み）" },
    { label: "商品代金以外の必要料金", value: "配送料（直販ショップ作品ごとに工房直送送料を明記、全国一律500円〜1,000円）、銀行振込時の振込手数料" },
    { label: "お支払い方法", value: "クレジットカード（Visa, Mastercard, JCB, American Express）、コンビニ前払い、銀行振込" },
    { label: "お支払い時期", value: "クレジットカード：注文完了時即時決済 ／ コンビニ・銀行振込：ご注文後5日以内" },
    { label: "商品の引き渡し時期", value: "直販ショップ：ご注文・ご入金確認後、工房より約3〜10営業日以内に発送 ／ 月額プラン・永久アーカイブ：決済完了後、即時利用可能" },
    { 
      label: "返品・交換・キャンセル等", 
      value: "【直販ショップの手作り品・試作品】性質上、お客様都合による返品・交換は原則お受けできません。万一配送事故や明らかな初期破損が生じた場合は、商品到着後7日以内に当事務局へご連絡いただければ、返品・返金または交換を事務局エスクローにて対応いたします。【月額プラン・永久アーカイブ】サービスの性質上、購入完了後の返金は承っておりません。月額プランはマイページよりいつでも次回更新の停止（解約）が可能です。" 
    },
    { 
      label: "特定商取引法代行表記について", 
      value: "本プラットフォームの直販ショップでは、個人発明家・シニア職人のプライバシーおよび安全を守るため、特定商取引法第11条但書の規定に基づき、販売事業者の連絡先情報を当事務局が代行して開示しております。なお、購入者から開示の請求があった場合には、遅滞なく販売者（出品者）の氏名、住所、電話番号等の実開示書面（電磁的記録）を電磁的方法または書面にて提供いたします。" 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1 space-y-8">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            トップへ戻る
          </Link>
          <span>/</span>
          <span>特定商取引法に基づく表記</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>特定商取引法に基づく表記</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              特定商取引法に基づく表記
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              直販ショップ販売・有料プランに関する重要事項
            </p>
          </div>

          <div className="overflow-hidden border border-stone-200 rounded-2xl">
            <dl className="divide-y divide-stone-200 text-xs sm:text-sm">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-stone-50/50 transition">
                  <dt className="font-bold text-stone-800 sm:col-span-1">{row.label}</dt>
                  <dd className="text-stone-600 sm:col-span-2 mt-1 sm:mt-0 leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
