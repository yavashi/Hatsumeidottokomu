"use client";

import { useState } from "react";
import Link from "next/link";
import { mockInventions } from "@/data/mock";
import { 
  Printer, 
  FileText, 
  CreditCard, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Send, 
  ArrowLeft,
  Settings2
} from "lucide-react";

export default function PrintKitPage() {
  const [selectedInventionId, setSelectedInventionId] = useState<string>(mockInventions[0].id);
  const [templateType, setTemplateType] = useState<"flyer" | "business_card">("flyer");
  const [accentColor, setAccentColor] = useState<string>("amber");
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [customHeadline, setCustomHeadline] = useState<string>("");

  const invention = mockInventions.find((i) => i.id === selectedInventionId) || mockInventions[0];

  const headline = customHeadline || invention.catchphrase;

  const handleOrderPrint = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(false);
    setOrderComplete(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* パンくず & 戻る */}
        <div className="flex items-center justify-between">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>マイページへ戻る</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI販促キット生成スタジオ</span>
          </div>
        </div>

        {/* タイトルヘッダー */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              チラシ・名刺 自動生成＆印刷連携
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              登録した発明品のデータから、展示会や店頭、シニアクラブで配れる「A4販促チラシ」や「商談用名刺」をAIが自動レイアウト。
              PDFの即時保存はもちろん、提携ネット印刷業者（ラクスル等）へのワンストップ入稿も可能です。
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>家庭用プリンターで印刷</span>
            </button>
            <button
              onClick={() => alert("高解像度PDF（トンボ・塗り足し付きCMYK）を書き出しました。")}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>PDFダウンロード</span>
            </button>
          </div>
        </div>

        {/* コントロールパネル ＆ リアルタイムプレビュー */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* 左カラム: 設定パネル (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm pb-3 border-b border-stone-100">
              <Settings2 className="w-4 h-4 text-amber-700" />
              <span>デザイン・作成設定</span>
            </div>

            {/* 対象発明品の選択 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">対象の発明品</label>
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
            </div>

            {/* テンプレート種別 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">生成フォーマット</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateType("flyer")}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    templateType === "flyer"
                      ? "border-amber-600 bg-amber-50/70 text-amber-900"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-700" />
                  <span>A4 販促チラシ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateType("business_card")}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    templateType === "business_card"
                      ? "border-amber-600 bg-amber-50/70 text-amber-900"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-700" />
                  <span>発明家名刺</span>
                </button>
              </div>
            </div>

            {/* テーマカラー選択 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">アクセントカラー</label>
              <div className="flex gap-2">
                {[
                  { id: "amber", name: "暖色・クラフト", bg: "bg-amber-600" },
                  { id: "emerald", name: "自然・安心", bg: "bg-emerald-600" },
                  { id: "indigo", name: "誠実・知財", bg: "bg-indigo-600" },
                  { id: "stone", name: "シック・墨", bg: "bg-stone-800" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAccentColor(c.id)}
                    className={`flex-1 py-1.5 px-1 rounded-lg text-[11px] font-bold border transition ${
                      accentColor === c.id
                        ? "border-stone-800 ring-2 ring-stone-400 font-extrabold"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${c.bg} mx-auto mb-1`} />
                    <span className="block text-center truncate">{c.name.split("・")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 見出しキャッチコピーの微調整 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                メインキャッチコピーの調整
              </label>
              <textarea
                rows={3}
                value={customHeadline || invention.catchphrase}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-stone-500">※プレビューに即座に反映されます</p>
            </div>

            {/* 提携印刷会社への発注ボタン */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <button
                onClick={() => setIsOrdering(true)}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>提携ネット印刷へデータ入稿・注文</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                ラクスル・グラフィック等と連携し、100枚 980円〜 ご自宅にお届け可能
              </p>
            </div>
          </div>

          {/* 右カラム: リアルタイム紙面プレビュー (8 cols) */}
          {/* 右カラム: リアルタイム紙面プレビュー (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-2 print:hidden">
              <span className="font-semibold">仕上がりプレビュー ({templateType === "flyer" ? "A4タテ" : "標準名刺サイズ 91×55mm"})</span>
              <span>100% 縮小プレビュー表示</span>
            </div>

            {/* 印刷専用スタイル定義 */}
            <style jsx global>{`
              @media print {
                body {
                  background: white !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                header, footer, nav, .print\\:hidden {
                  display: none !important;
                }
                .print-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                }
                .print-sheet {
                  border: none !important;
                  box-shadow: none !important;
                  width: 100% !important;
                  height: 100% !important;
                  max-width: none !important;
                  padding: 24mm !important;
                  page-break-after: always;
                }
              }
            `}</style>

            {/* プレビュー本体 */}
            {templateType === "flyer" ? (
              /* A4チラシ プレビュー */
              <div 
                id="print-sheet"
                className="print-sheet bg-white rounded-2xl shadow-xl border border-stone-300 p-8 sm:p-12 aspect-[1/1.414] max-w-2xl mx-auto flex flex-col justify-between overflow-hidden relative text-stone-800"
              >
                
                {/* チラシ上部ヘッダー */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-800">
                      <Sparkles className="w-4 h-4" />
                      <span>発明ドットコム 認定登録発明（デジタルアーカイブ公認）</span>
                    </div>
                    {invention.hasPatent ? (
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        特許取得済 / 第{invention.patentNumber || "2026-78901"}号
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        出願準備中 / 意匠権登録
                      </span>
                    )}
                  </div>

                  {/* 大見出し */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                      {headline}
                    </h2>
                    <p className="text-base sm:text-lg font-bold text-amber-900">
                      製品名：{invention.title}
                    </p>
                  </div>
                </div>

                {/* チラシ中央部: 画像と特長 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-center">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                    <img
                      src={invention.primaryImageUrl}
                      alt={invention.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold tracking-wider text-stone-600 uppercase border-b pb-1">
                      ここがスゴい！3つの解決ポイント
                    </h3>
                    <ul className="text-xs space-y-2 text-stone-700">
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                        <span>{invention.summary}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                        <span>【主要素材】{invention.materials.join("、") || "特殊樹脂・金属加工"}を採用し、日常の使い勝手を徹底追求</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                        <span>【関連分野】{invention.tags.slice(0, 3).join(" / ")}。誰でも直感的に使える安心設計</span>
                      </li>
                    </ul>
                    
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                      <span className="font-bold text-stone-800">希望小売価格: </span>
                      <span className="text-amber-900 font-extrabold">¥{invention.hopePrice?.toLocaleString() || "未定"}</span>
                    </div>
                  </div>
                </div>

                {/* チラシ下部: 発明家紹介 ＆ QRコード */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] text-stone-500 font-bold">開発・考案者</div>
                    <div className="text-sm font-extrabold text-stone-900">田中 義男（下町の旋盤職人）</div>
                    <div className="text-xs text-stone-600">東京都大田区 / 旋盤職人歴45年</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-stone-500">スマホで応援・詳細</div>
                      <div className="text-[11px] font-bold text-amber-900">hatsumei.com?src=flyer</div>
                    </div>
                    <div className="w-16 h-16 bg-white p-1 rounded-xl border border-stone-300 shadow-sm flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-stone-800" />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* 発明家名刺 プレビュー */
              <div className="bg-white rounded-2xl shadow-xl border border-stone-300 p-8 aspect-[1.7/1] max-w-xl mx-auto flex flex-col justify-between overflow-hidden relative text-stone-800">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-800 uppercase">
                      INVENTOR & MAKER
                    </span>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">田中 義男</h3>
                    <p className="text-xs text-stone-600">下町の旋盤職人 / 生活アイデア発明家</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={invention.primaryImageUrl}
                      alt={invention.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-amber-800 block">代表発明品</span>
                  <span className="text-xs font-extrabold text-stone-800">{invention.title}</span>
                  <span className="text-[10px] text-stone-500 block truncate">{invention.catchphrase}</span>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-stone-200 text-xs">
                  <div className="space-y-0.5 text-stone-600 text-[11px]">
                    <div>Web: https://hatsumei.com/inventions/{invention.id}</div>
                    <div>Email: tanaka-craft@hatsumei.example.jp</div>
                  </div>
                  <div className="w-10 h-10 bg-white p-0.5 rounded border border-stone-300 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-stone-800" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ネット印刷発注モーダル */}
      {isOrdering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <h3 className="text-xl font-bold text-stone-900">
              提携ネット印刷へのデータ入稿＆発注
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              現在プレビュー中のデザインデータを、ネット印刷会社の印刷規格（トンボ付き高精細PDF/CMYKカラー）に変換して自動送信します。
            </p>

            <form onSubmit={handleOrderPrint} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">印刷部数</label>
                <select className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-800">
                  <option>100部（お試し）- ¥980 (税込)</option>
                  <option>300部（イベント・見本市用）- ¥2,180 (税込)</option>
                  <option>500部（店頭設置・配布用）- ¥3,200 (税込)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">用紙の選択</label>
                <select className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-800">
                  <option>光沢紙（コート紙 110kg・写真が鮮やか）</option>
                  <option>マットコート紙（反射が少なく文字が読みやすい・おすすめ）</option>
                  <option>クラフト紙（温かみ・手作り感を強調）</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">お届け先住所</label>
                <input
                  type="text"
                  required
                  defaultValue="東京都大田区南蒲田1-2-3"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800"
                />
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-stone-700 space-y-1">
                <span className="font-bold text-amber-900">お届け予定:</span>
                <p>入稿確定後、約3営業日でお手元のポストまたは宅配便にて到着します。</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrdering(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>入稿して印刷を申し込む</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 印刷発注完了トースト/モーダル */}
      {orderComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">印刷の手配を受け付けました！</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              印刷データが提携工場へ送られました。出来上がり次第、ご指定の住所へお届けいたします。
            </p>
            <button
              onClick={() => setOrderComplete(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
