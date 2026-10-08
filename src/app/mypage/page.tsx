"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { mockInventions, mockInventors } from "@/data/mock";
import { 
  User, 
  PlusCircle, 
  Heart, 
  Eye, 
  Sparkles, 
  Settings, 
  ExternalLink, 
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Clock
} from "lucide-react";

export default function MyPage() {
  // モックのアカウントタイプ切り替え（体験用）
  const [activeTab, setActiveTab] = useState<"inventor" | "general">("inventor");

  // 田中義男さん（発明家）のデータを仮のアカウントデータとする
  const currentInventor = mockInventors[0];
  const myInventions = mockInventions.filter((inv) => inv.inventorId === currentInventor.id);

  // お気に入りとして仮に登録した発明品（一般人目線）
  const favoriteInventions = mockInventions.slice(1, 3);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* プロフィール・ヘッダーバナー */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentInventor.avatarUrl}
                alt={currentInventor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl md:text-2xl font-black text-stone-900">
                    {currentInventor.name}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    {activeTab === "inventor" ? "発明家会員" : "一般会員"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {currentInventor.nickname} ・ {currentInventor.location}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  登録日: 2026年1月15日
                </p>
              </div>
            </div>

            {/* 表示モード切り替えスイッチ（プロトタイプ体験用） */}
            <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl self-start md:self-center border border-stone-200">
              <button
                onClick={() => setActiveTab("inventor")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                  activeTab === "inventor"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                💡 発明家ビュー
              </button>
              <button
                onClick={() => setActiveTab("general")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                  activeTab === "general"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                👀 一般人・応援ビュー
              </button>
            </div>
          </div>
        </div>

        {/* --- 発明家ビュー --- */}
        {activeTab === "inventor" && (
          <div className="space-y-8">
            {/* クイックアクション & 閲覧実績（フィードバック） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-600" />
                  あなたの発明の総閲覧数
                </span>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  1,240 <span className="text-xs font-normal text-stone-500">回</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  今週 +48回 閲覧されました
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-amber-600" />
                  獲得した「商品化希望」
                </span>
                <p className="text-2xl font-black text-amber-600 mt-2">
                  328 <span className="text-xs font-normal text-stone-500">人</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  企業向け推薦スコア：高
                </p>
              </div>

              {/* O2OチラシQRコード流入実績 */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  配布チラシQRからの来訪
                </span>
                <p className="text-2xl font-black text-blue-700 mt-2">
                  18 <span className="text-xs font-normal text-stone-500">人</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  紙面からWebへ順調に流入中
                </p>
              </div>

              {/* 新規登録ボタン */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    新しい発明を世の中に
                  </span>
                  <p className="text-xs font-black mt-1 leading-snug">
                    AIと対話してWebページ作成
                  </p>
                </div>
                <Link
                  href="/mypage/inventions/new"
                  className="mt-2 bg-white hover:bg-stone-50 text-amber-900 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>発明品を登録する</span>
                </Link>
              </div>
            </div>

            {/* 進行中の専門家相談ステータスバナー */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                  工
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      高橋精機試作工房（大田区）様へ試作相談中
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      返信待ち
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    「らくらく開栓テコオープナー」の真鍮切削について相談メッセージを送信済み（NDA保護中）
                  </p>
                </div>
              </div>
              <Link
                href="/experts"
                className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs whitespace-nowrap"
              >
                専門家一覧を見る →
              </Link>
            </div>

            {/* 登録した発明品一覧 */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    あなたの登録した発明品 ({myInventions.length}件)
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    生涯で1作品でも、大切なデジタルアーカイブとして保存されます
                  </p>
                </div>
                <Link
                  href="/mypage/inventions/new"
                  className="hidden sm:flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>追加する</span>
                </Link>
              </div>

              <div className="space-y-4">
                {myInventions.map((inv) => (
                  <div
                    key={inv.id}
                    className="border border-stone-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-amber-300 transition bg-stone-50/50"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={inv.primaryImageUrl}
                        alt={inv.title}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                            公開中
                          </span>
                          <span className="text-xs text-stone-400">
                            {inv.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-stone-900 mt-1">
                          {inv.title}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-1">
                          {inv.catchphrase}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-200">
                      <div className="text-right text-xs">
                        <p className="font-bold text-stone-700">{inv.pageViews} views</p>
                        <p className="text-[11px] text-amber-700 font-bold">{inv.wantsCount} 欲しい</p>
                      </div>
                      <Link
                        href={`/inventions/${inv.id}`}
                        className="text-xs font-bold text-stone-700 hover:text-amber-700 bg-white border border-stone-200 hover:border-amber-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs"
                      >
                        <span>公開ページを見る</span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 発明家向け支援ツール・設定 */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-4 border-stone-100">
                <div>
                  <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    発明家の活動・販促支援ツール
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    展示会やシニアクラブでの配布、SNSでの拡散、通知の受取設定
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link
                  href="/mypage/tools/print-kit"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition">
                      チラシ・名刺AI印刷
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      A4カラーチラシや名刺を自動作成＆印刷所へデータ入稿
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-1">
                    ツールを開く →
                  </span>
                </Link>

                <Link
                  href="/mypage/tools/sns-automation"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-800 transition">
                      SNS簡単・自動ポスト
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      XやLINEへワンタップ投稿。定期配信でファン獲得
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1 pt-1">
                    ツールを開く →
                  </span>
                </Link>

                <Link
                  href="/experts"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-purple-800 transition">
                      試作屋・弁理士相談
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      町工場や弁理士へ秘密保持（NDA）付きで無料相談
                    </p>
                  </div>
                  <span className="text-xs font-bold text-purple-700 flex items-center gap-1 pt-1">
                    専門家を見る →
                  </span>
                </Link>

                <Link
                  href="/mypage/settings/notifications"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-105 transition">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-800 transition">
                      「欲しい」通知設定
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      欲しいボタン投票や企業打診の受取方法
                    </p>
                  </div>
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1 pt-1">
                    設定を変更 →
                  </span>
                </Link>

                <Link
                  href="/shop"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition">
                      直販ショップ出品
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      手作り品・試作品を読者へ直接販売
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
                    ショップを見る →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}


        {/* --- 一般人・応援ビュー --- */}
        {activeTab === "general" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
              <div className="mb-6">
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  お気に入り・「欲しい」した発明品 ({favoriteInventions.length}件)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  あなたが応援している発明品です。商品化の進捗などが通知されます。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteInventions.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/inventions/${inv.id}`}
                    className="border border-stone-200 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-300 hover:shadow-xs transition bg-stone-50/50 group"
                  >
                    <img
                      src={inv.primaryImageUrl}
                      alt={inv.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                        {inv.category}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900 truncate mt-1 group-hover:text-amber-800 transition">
                        {inv.title}
                      </h3>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {inv.catchphrase}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 text-center max-w-lg mx-auto">
              <Sparkles className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-amber-950">
                あなたも発明をお持ちですか？
              </h3>
              <p className="text-xs text-stone-600 mt-1 mb-4 leading-relaxed">
                ちょっとした日常の工夫や試作品があれば、AIと簡単に対話するだけでページが作れます。
              </p>
              <Link
                href="/mypage/inventions/new"
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>発明家として発明を登録してみる</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
