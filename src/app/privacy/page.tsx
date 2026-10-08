import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "プライバシーポリシー | 発明ドットコム",
  description: "発明ドットコムのプライバシーポリシーです。高齢発明家およびすべての利用者の個人情報保護に関する指針を定めています。",
};

export default function PrivacyPage() {
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
          <span>プライバシーポリシー</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-3">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>プライバシーポリシー</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              個人情報保護方針（プライバシーポリシー）
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              制定日: 2026年1月15日 ／ 最終改定日: 2026年10月8日
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">1. 基本方針</h2>
              <p>
                発明ドットコム事務局（以下「当事務局」）は、個人情報保護法その他の関連法令を遵守し、お客様からお預かりする個人情報を適正に取り扱います。特に、高齢の発明家や個人工房のプライバシー保護を最重要課題と位置づけ、自宅住所や電話番号の無用な露出を防ぐ保護措置を実施します。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">2. 取得する情報</h2>
              <p>当事務局は、本サービスにおいて以下の情報を取得する場合があります。</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
                <li>アカウント登録情報（氏名、愛称、メールアドレス、パスワード）</li>
                <li>発明家プロフィール情報（活動地域、自己紹介、試作写真、保有技術）</li>
                <li>決済・配送情報（配送先住所、電話番号、決済履歴 ※クレジットカード番号はStripeが安全に保管し、当事務局サーバーには保存されません）</li>
                <li>お問い合わせ・相談情報（企業からのオファー内容、専門家への相談内容）</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">3. 利用目的</h2>
              <p>取得した個人情報は、以下の目的のために利用します。</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
                <li>本サービスの提供、認証、および作品アーカイブの運用</li>
                <li>直販ショップにおける作品の受注、配送手配、およびエスクロー精算</li>
                <li>企業からの商品化オファー・問い合わせの安全な仲介</li>
                <li>新着発明メルマガや「欲しい」通知の配信</li>
                <li>法令遵守および不正利用・迷惑行為の防止</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">4. 第三者提供の制限と代行表記</h2>
              <p>
                当事務局は、法令に定める場合を除き、ご本人の事前同意なく個人情報を第三者に提供しません。また、特定商取引法に基づく表記において、個人発明家の自宅住所や電話番号を直接公開せず、当事務局が代行して開示する仕組みを採用しています。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">5. お問い合わせ窓口</h2>
              <p>
                個人情報の開示・訂正・利用停止等のご請求、またはプライバシーに関するお問い合わせは、お問い合わせフォームまたは当事務局サポート宛（support@hatsumei.com）までご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
