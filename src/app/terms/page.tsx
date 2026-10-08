import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "利用規約 | 発明ドットコム",
  description: "発明ドットコムの利用規約です。発明家の権利保護と安心・安全なプラットフォーム運用のためのルールを定めています。",
};

export default function TermsPage() {
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
          <span>利用規約</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>利用規約</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              発明ドットコム 利用規約
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              制定日: 2026年1月15日 ／ 最終改定日: 2026年10月8日
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第1条（目的）</h2>
              <p>
                本利用規約（以下「本規約」）は、発明ドットコム事務局（以下「当事務局」）が提供する発明公開・デジタルアーカイブプラットフォーム「発明ドットコム」（以下「本サービス」）の利用条件を定めるものです。すべての登録会員および利用者は、本規約に同意の上で本サービスを利用するものとします。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第2条（知的財産権の帰属）</h2>
              <p>
                1. ユーザーが本サービスに登録・投稿した発明、アイデア、図面、写真、文章等の著作権および特許権・実用新案権等の知的財産権は、すべて当該ユーザー（発明家本人）に帰属します。
              </p>
              <p>
                2. 当事務局は、本サービスの広報・宣伝およびアーカイブ展示の目的の範囲内に限り、登録されたコンテンツを無償で非独占的に利用（掲載・要約・広報メディアへの提供）できるものとします。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第3条（特許法第29条・新規性喪失に関する注意と合意）</h2>
              <p>
                1. ユーザーは、特許出願前のアイデア・構造・機構を本サービス上で一般公開した場合、特許法第29条第1項各号に定める「公然知られた発明」に該当し、以後の特許取得や権利化が困難になるリスク（新規性の喪失）を十分に理解し、自己の責任において公開設定を行うものとします。
              </p>
              <p>
                2. 特許出願を検討しているユーザーは、当事務局が提供する「非公開アーカイブ機能（タイムスタンプ付き下書き保管）」を利用するか、提携弁理士へ事前相談を行うことが推奨されます。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第4条（コミュニティ・誹謗中傷の禁止）</h2>
              <p>
                本サービスは発明家と支援者を温かくつなぐプラットフォームです。他者の作品に対する誹謗中傷、心無い批判、名誉毀損、または盗用を目的とした行為は固く禁止されており、違反が認められた場合は事前の通知なくアカウントの停止および投稿の削除を行います。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第5条（直販ショップ取引・手作り品の性質）</h2>
              <p>
                直販ショップで販売される作品は、工房や個人による少量生産・手作り試作品を含みます。購入者は工業規格量産品とは異なる天然素材の個体差や手仕事の特性を理解した上で購入するものとします。万一の配送事故・初期不良については事務局エスクロー基準に基づき適切に対応します。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">第6条（免責事項）</h2>
              <p>
                当事務局は、本サービスを利用して発生したユーザー間、または企業とユーザー間の商談・契約（ライセンス契約・共同開発契約等）に関して、当事者間の合意事項について生じた紛争・損害について、当事務局に故意または重過失がある場合を除き、責任を負いません。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
