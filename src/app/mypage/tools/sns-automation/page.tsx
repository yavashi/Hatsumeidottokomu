"use client";

import { useState } from "react";
import Link from "next/link";
import { mockInventions } from "@/data/mock";
import { 
  Share2, 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Send, 
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from "lucide-react";

export default function SnsAutomationPage() {
  const [selectedInventionId, setSelectedInventionId] = useState<string>(mockInventions[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [autoScheduleActive, setAutoScheduleActive] = useState<boolean>(true);
  const [scheduleDay, setScheduleDay] = useState<string>("weekly_tue_fri");
  const [scheduleTime, setScheduleTime] = useState<string>("18:00");
  const [savedSettings, setSavedSettings] = useState<boolean>(false);

  const invention = mockInventions.find((i) => i.id === selectedInventionId) || mockInventions[0];

  const shareText = `【72歳の下町旋盤職人が本気で作った生活改善グッズ】
妻のリウマチを助けるために3年かけて開発した『${invention.title}』。
固いペットボトルのフタもテコの原理でスッと開きます！

「商品化されたら欲しい！」の応援投票を受付中👇
https://hatsumei.com/inventions/${invention.id}
#発明 #町工場 #便利グッズ #ものづくり #シニアライフ #発明ドットコム`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* 戻る導線 */}
        <div className="flex items-center justify-between">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>マイページへ戻る</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
            <Share2 className="w-3.5 h-3.5" />
            <span>SNS簡単・定期自動ポスト</span>
          </div>
        </div>

        {/* ヘッダー */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            SNS簡単シェア＆定期自動発信ツール
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            「SNSの文章を考えるのが難しい」「定期的に投稿して露出を増やしたい」。
            AIが発明品の魅力と開発ストーリーを自動でSNS向けポストに要約。ワンクリックでの即時投稿や、設定した日時に自動で定期発信できます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* 左カラム: 設定・ワンタップ投稿 (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 発明品選択 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <label className="block text-xs font-bold text-stone-700">対象の発明品を選択</label>
              <select
                value={selectedInventionId}
                onChange={(e) => setSelectedInventionId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
              >
                {mockInventions.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.title}
                  </option>
                ))}
              </select>

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span>AI生成ポスト文面（自動最適化済）</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "コピーしました！" : "全文コピー"}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {shareText}
                </div>
              </div>

              {/* ワンタップ投稿ボタン */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShareX}
                  className="flex-1 py-3 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>X (Twitter) で今すぐ投稿</span>
                </button>
                <button
                  onClick={() => {
                    const url = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
                    window.open(url, "_blank");
                  }}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>LINEで家族・友人に送る</span>
                </button>
              </div>
            </div>

            {/* 定期自動投稿スケジュール設定 */}
            <form onSubmit={handleSaveSchedule} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-stone-900 text-sm">定期自動ポスト設定（Bot連携）</h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-stone-600">
                    {autoScheduleActive ? "自動配信中" : "一時停止中"}
                  </span>
                  <input
                    type="checkbox"
                    checked={autoScheduleActive}
                    onChange={(e) => setAutoScheduleActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </label>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                忘れてしまいがちなSNSの更新をプラットフォームが代行します。
                写真と進捗メッセージを定期的に発信し、継続的なファンと応援票を獲得します。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">配信頻度</label>
                  <select
                    value={scheduleDay}
                    onChange={(e) => setScheduleDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-800"
                  >
                    <option value="weekly_tue_fri">毎週 火曜・金曜日（おすすめ）</option>
                    <option value="weekly_wed">毎週 水曜日（週1回）</option>
                    <option value="monthly_twice">月2回（隔週土曜）</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">投稿時間帯</label>
                  <select
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-800"
                  >
                    <option value="12:00">12:00（ランチタイム）</option>
                    <option value="18:00">18:00（帰宅・夕食前・おすすめ）</option>
                    <option value="21:00">21:00（就寝前リラックス時）</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSettings ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>スケジュールを保存しました</span>
                  </div>
                ) : <div />}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  設定を保存する
                </button>
              </div>
            </form>

          </div>

          {/* 右カラム: SNSタイムラインプレビュー (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold text-stone-500 px-2 flex items-center justify-between">
              <span>X (Twitter) 表示イメージ</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <RefreshCw className="w-3 h-3" /> リアルタイム更新
              </span>
            </div>

            {/* X (Twitter) ポストカード模擬UI */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-3 text-stone-900">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  義
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-stone-900 truncate">田中 義男@町工場職人</span>
                    <span className="text-stone-400">@tanaka_craft</span>
                    <span className="text-stone-400">・今</span>
                  </div>
                  <p className="text-xs text-stone-800 mt-1 whitespace-pre-wrap leading-relaxed">
                    【72歳の下町旋盤職人が本気で作った生活改善グッズ】
                    妻のリウマチを助けるために開発した『{invention.title}』。
                    「商品化されたら欲しい！」の応援投票を受付中👇
                  </p>
                </div>
              </div>

              {/* OGPカードプレビュー */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50">
                <div className="aspect-[1.91/1] overflow-hidden bg-stone-200">
                  <img
                    src={invention.primaryImageUrl}
                    alt={invention.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    hatsumei.com
                  </span>
                  <h4 className="font-bold text-xs text-stone-900 truncate">
                    {invention.title} - 発明ドットコム
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {invention.catchphrase}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-stone-400 text-xs pt-1 px-4 border-t border-stone-100">
                <span>💬 12</span>
                <span>🔁 48</span>
                <span>❤️ 196</span>
                <span>📊 3.8K</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-stone-700 space-y-1">
              <span className="font-bold text-amber-900">💡 投稿のコツ</span>
              <p>写真に「使っている様子」や「手描きの設計ノート」を添えると、共感リツイート率が3倍に向上します。</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
