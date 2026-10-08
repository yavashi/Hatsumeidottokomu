"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Heart, 
  MessageSquare, 
  Building2, 
  BarChart3, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Send,
  Check
} from "lucide-react";

export default function NotificationSettingsPage() {
  const [channels, setChannels] = useState({
    email: true,
    line: false,
    push: true,
  });

  const [triggers, setTriggers] = useState({
    wantsInstant: true,       // 「欲しい」ボタンが押された時（即時）
    wantsDailySummary: false, // 「欲しい」1日1回まとめ
    comments: true,           // 応援コメント・質問
    b2bInquiry: true,         // 企業からの商品化打診・ライセンス相談（最重要）
    weeklyReport: true,       // 週間閲覧数・ランキングレポート
    newsletter: true,         // 公式メールマガジン
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTestNotification = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

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
            <Bell className="w-3.5 h-3.5" />
            <span>通知設定センター</span>
          </div>
        </div>

        {/* タイトル */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            通知方法と受信内容のカスタマイズ
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            「欲しい」ボタンが押された感動の瞬間をすぐに知りたい方、あるいは夜間や作業中はまとめて受け取りたい方など、
            あなたのライフスタイルに合わせて通知方法と受け取る内容を細かく設定できます。
          </p>
        </div>

        {/* テスト通知体験アラート */}
        {testNotificationSent && (
          <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold">【通知プレビュー】たった今「欲しい！」が押されました！</p>
                <p className="text-[11px] text-amber-100">
                  あなたの発明品「らくらく開栓テコオープナー」に 1件 の商品化希望票が入りました。（目標まであと8件）
                </p>
              </div>
            </div>
            <button
              onClick={() => setTestNotificationSent(false)}
              className="text-xs font-bold underline shrink-0 px-2 py-1"
            >
              閉じる
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">

          {/* セクション 1: 通知を受け取る方法（チャネル） */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            <div className="border-b pb-4 border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-stone-900">
                  1. 通知を受け取る方法（受け取り先）
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  通知を受け取りたいチャネルをオンにしてください
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* メール */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  channels.email
                    ? "border-amber-600 bg-amber-50/40 ring-1 ring-amber-600"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">メール通知</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    tanaka-craft@example.jp 宛に送信
                  </p>
                </div>
              </label>

              {/* LINE */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  channels.line
                    ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.line}
                    onChange={(e) => setChannels({ ...channels, line: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">LINE公式連携</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {channels.line ? "連携済み（トークに届きます）" : "未連携（クリックしてLINE登録）"}
                  </p>
                </div>
              </label>

              {/* ブラウザ/プッシュ */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  channels.push
                    ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.push}
                    onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">画面プッシュ通知</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    PC・スマホの画面上にバナー表示
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* セクション 2: 受け取る内容（トリガー・イベント） */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            <div className="border-b pb-4 border-stone-100">
              <h2 className="text-base font-extrabold text-stone-900">
                2. どのような時に通知を受け取るか（イベント設定）
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                必要な通知だけを選んで受信できます
              </p>
            </div>

            <div className="space-y-4">

              {/* 「欲しい！」ボタンの即時通知 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      「商品化されたら欲しい」ボタンが押された時（即時通知）
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      例: 『たった今、あなたの作品に1件の欲しい！が入りました』
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggers.wantsInstant}
                  onChange={(e) => setTriggers({ ...triggers, wantsInstant: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {/* 企業からの問い合わせ */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 text-[10px] font-bold mb-0.5">
                      最重要
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      メーカー・製造企業からの商品化打診・ライセンス相談
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      商談チャンスを逃さないため、即座に連絡します（推奨）
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggers.b2bInquiry}
                  onChange={(e) => setTriggers({ ...triggers, b2bInquiry: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {/* 応援コメントや質問 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      読者からの応援コメント・使い心地の質問
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      作品ページに温かいメッセージや質問が投稿された時に通知
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggers.comments}
                  onChange={(e) => setTriggers({ ...triggers, comments: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {/* 週間レポート */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      週間サマリーレポート（毎週月曜日の朝）
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      先週の総アクセス数、ランキング順位の変動、累計投票数をおまとめ
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggers.weeklyReport}
                  onChange={(e) => setTriggers({ ...triggers, weeklyReport: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {/* メルマガ */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      発明ドットコム公式メールマガジン
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      今週の注目発明品、特許取得のノウハウ記事、商品化成功ストーリー
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggers.newsletter}
                  onChange={(e) => setTriggers({ ...triggers, newsletter: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {/* 夜間おやすみモード（シニア向け睡眠配慮） */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                    🌙
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      夜間おやすみモード（21:00〜翌朝8:00は通知音をミュート）
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      夜間に発生した「欲しい！」投票やメッセージは保留し、翌朝8:00にまとめてお届けします
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

            </div>
          </div>

          {/* 保存バー & テスト通知ボタン */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleSendTestNotification}
              className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-4 py-3 rounded-xl transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>「欲しい！」通知をテスト受信してみる</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>設定を保存しました</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>通知設定を更新する</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
