import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { InventionCard } from "@/components/InventionCard";
import { mockInventions, mockInventors } from "@/data/mock";
import { 
  Sparkles, 
  Trophy, 
  Flame, 
  Eye, 
  ShoppingBag, 
  ArrowRight, 
  Lightbulb, 
  Compass, 
  Heart,
  TrendingUp,
  Award,
  Users
} from "lucide-react";

export default function Home() {
  // ランキング用ソート
  // 1. 商品化してほしいランキング（wantsCount順）
  const rankingByWants = [...mockInventions].sort((a, b) => b.wantsCount - a.wantsCount);
  
  // 2. 注目・急上昇（pageViews順）
  const rankingByViews = [...mockInventions].sort((a, b) => b.pageViews - a.pageViews);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      {/* ヒーローセクション：一般ユーザーを惹きつけるメディア的デザイン */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-amber-50/30 to-stone-50 py-12 md:py-16 border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* 左側：一般向けキャッチ */}
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 bg-amber-200/80 border border-amber-300 text-amber-950 text-xs font-extrabold px-3 py-1.5 rounded-full mb-4 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>世の中にはこんな発明があった！個人発明のオープンメディア</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight sm:leading-tight">
                「誰かの切実な悩み」から<br className="hidden sm:inline" />
                生まれた、
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">
                  世にも面白い発明たち。
                </span>
              </h1>

              <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                町工場の職人が妻のために作った道具、学校の先生が雨の日にひらめいた便利グッズ。<br className="hidden sm:inline" />
                あなたのお気に入りの発明を見つけて、「商品化されたら欲しい！」ボタンで応援してみませんか？
              </p>

              {/* 検索・閲覧クイックアクション */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/inventions"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-2xl shadow-sm hover:shadow transition flex items-center gap-2 text-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>すべての発明を見る</span>
                </Link>
                <Link
                  href="/inventors"
                  className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>個性豊かな発明家たち</span>
                </Link>
              </div>
            </div>

            {/* 右側：発明家募集バナー（控えめかつ自然に配置） */}
            <div className="w-full lg:w-80 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-amber-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>発明家の方へ（無料登録受付中）</span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                  あなたの発明をここに掲載しませんか？
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  ホームページがなくても大丈夫。写真とメモからAIが自動で紹介ページを作成。たくさんの人に見てもらえる喜びをお届けします。
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100">
                <Link
                  href="/signup"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <span>まずは無料で会員登録</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツエリア */}
      <main className="max-w-6xl mx-auto px-4 py-12 w-full space-y-16">
        
        {/* ランキングセクション：商品化されたら欲しいランキング */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>ユーザー人気投票</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-stone-900 flex items-center gap-2">
                「商品化されたら欲しい！」ランキング
              </h2>
              <p className="text-xs md:text-sm text-stone-500 mt-1">
                一般読者からの「お店で買いたい！」という応援リクエストが最も多く集まっている発明です。
              </p>
            </div>
            <Link
              href="/inventions"
              className="text-amber-700 hover:text-amber-800 font-bold text-xs md:text-sm flex items-center gap-1 shrink-0"
            >
              <span>もっと見る</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {rankingByWants.slice(0, 4).map((invention, idx) => (
              <div key={invention.id} className="relative flex flex-col">
                {/* 順位バッジ */}
                <div className="absolute -top-3 -left-2 z-10 w-9 h-9 rounded-xl font-black flex items-center justify-center text-sm shadow-md border-2 border-white bg-gradient-to-tr from-amber-600 to-amber-400 text-white">
                  {idx + 1}
                </div>
                <InventionCard invention={invention} />
              </div>
            ))}
          </div>
        </section>

        {/* 本日のピックアップ発明 */}
        <section className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 md:p-10 shadow-lg overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden h-64 md:h-80 border border-stone-700 shadow-md">
              <img
                src={mockInventions[0].primaryImageUrl}
                alt={mockInventions[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-amber-500 text-stone-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>今日のおすすめピックアップ</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
                {mockInventions[0].title}
              </h3>
              <p className="text-amber-300 font-bold text-sm">
                {mockInventions[0].catchphrase}
              </p>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed line-clamp-3">
                {mockInventions[0].summary}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={`/inventions/${mockInventions[0].id}`}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs md:text-sm shadow transition flex items-center gap-2"
                >
                  <span>この発明の詳細を見る</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-stone-400">
                  {mockInventions[0].wantsCount}人が商品化希望
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 注目の発明家たち */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>発明者の素顔</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                話題の個人発明家たち
              </h2>
              <p className="text-xs md:text-sm text-stone-500 mt-1">
                生涯でたったひとつの傑作にかける職人から、身近な不満を解決した主婦まで。
              </p>
            </div>
            <Link
              href="/inventors"
              className="text-amber-700 hover:text-amber-800 font-bold text-xs md:text-sm flex items-center gap-1"
            >
              <span>全員を見る</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockInventors.map((inv) => {
              const count = mockInventions.filter((i) => i.inventorId === inv.id).length;
              return (
                <Link
                  key={inv.id}
                  href={`/inventors/${inv.id}`}
                  className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-amber-300 hover:shadow-md transition text-center flex flex-col items-center group"
                >
                  <img
                    src={inv.avatarUrl}
                    alt={inv.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-200 group-hover:scale-105 transition"
                  />
                  <h3 className="font-bold text-stone-900 text-sm mt-3 group-hover:text-amber-800">
                    {inv.name}
                  </h3>
                  {inv.nickname && (
                    <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded mt-1">
                      {inv.nickname}
                    </span>
                  )}
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {inv.aiSummaryBio || inv.bio}
                  </p>
                  <span className="mt-3 text-[11px] font-bold text-stone-400">
                    作品: {count}点
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 下部CTA：発明家募集バナー */}
        <section className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-dashed border-amber-300 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-stone-900">
            あなたの発明も掲載してみませんか？
          </h2>
          <p className="text-xs md:text-sm text-stone-600 mt-3 max-w-lg mx-auto leading-relaxed">
            現在、オープン記念として<strong>【初期無料登録】</strong>を受付中です。<br />
            「1作品しかない」「試作品の段階」「特許を取ったけれど眠っている」という作品を、後世に残るアーカイブとしてぜひご登録ください。
          </p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition inline-flex items-center gap-2 text-sm"
            >
              <span>無料で会員登録する</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}