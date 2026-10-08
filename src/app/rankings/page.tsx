"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { mockInventions } from "@/data/mock";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  ShoppingBag, 
  Heart, 
  Eye, 
  Clock, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";

type RankingTab = "overall" | "trending" | "senior" | "kitchen";

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>("overall");

  // ランキングデータ生成
  const getRankedInventions = () => {
    const list = [...mockInventions];
    if (activeTab === "overall") {
      return list.sort((a, b) => b.wantsCount - a.wantsCount);
    } else if (activeTab === "trending") {
      // 閲覧数といいね数の急上昇モック
      return list.sort((a, b) => b.pageViews - a.pageViews);
    } else if (activeTab === "senior") {
      return list.filter((i) => i.category.includes("シニア") || i.category.includes("介護") || i.tags.includes("シニア向け"));
    } else if (activeTab === "kitchen") {
      return list.filter((i) => i.category.includes("キッチン") || i.category.includes("日用品"));
    }
    return list;
  };

  const rankedItems = getRankedInventions();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
        {/* ヘッダー */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 text-xs md:text-sm font-bold px-3.5 py-1 rounded-full mb-3 border border-amber-200">
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>月間・年間 発明アワード開催中</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
            発明ドットコム ランキング
          </h1>
          <p className="text-stone-600 text-xs md:text-sm mt-3 leading-relaxed">
            一般読者の「商品化されたら欲しい！」票や閲覧数をもとに、今もっとも注目されている発明品を表彰しています。
          </p>
        </div>

        {/* タブセレクター */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab("overall")}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "overall"
                ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>総合 商品化希望ランキング</span>
          </button>

          <button
            onClick={() => setActiveTab("trending")}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "trending"
                ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>週間アクセス急上昇</span>
          </button>

          <button
            onClick={() => setActiveTab("senior")}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "senior"
                ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-700" />
            <span>シニア・介護部門アワード</span>
          </button>

          <button
            onClick={() => setActiveTab("kitchen")}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "kitchen"
                ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>日用品・主婦のアイデア賞</span>
          </button>
        </div>

        {/* ランキングリスト */}
        <div className="space-y-4">
          {rankedItems.map((inv, index) => {
            const rank = index + 1;
            let rankBadge = (
              <span className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-black text-base shrink-0">
                {rank}
              </span>
            );

            if (rank === 1) {
              rankBadge = (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-amber-200 border-2 border-white">
                  👑 1
                </div>
              );
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-stone-300 to-stone-100 text-stone-800 flex items-center justify-center font-black text-lg shrink-0 border-2 border-white shadow-xs">
                  🥈 2
                </div>
              );
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-black text-base shrink-0 border-2 border-white shadow-xs">
                  🥉 3
                </div>
              );
            }

            return (
              <div
                key={inv.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 shadow-xs hover:border-amber-300 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start md:items-center gap-4 flex-1">
                  {rankBadge}

                  <img
                    src={inv.primaryImageUrl}
                    alt={inv.title}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-md">
                        {inv.category}
                      </span>
                      {inv.hasPatent && (
                        <span className="text-[11px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          特許あり
                        </span>
                      )}
                    </div>

                    <Link href={`/inventions/${inv.id}`}>
                      <h3 className="font-black text-base md:text-lg text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
                        {inv.title}
                      </h3>
                    </Link>
                    <p className="text-xs md:text-sm text-stone-500 line-clamp-1 mt-0.5">
                      {inv.catchphrase}
                    </p>
                  </div>
                </div>

                {/* スコア ＆ リンク */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">商品化リクエスト</span>
                    <span className="text-xl md:text-2xl font-black text-amber-800">
                      {inv.wantsCount} <span className="text-xs font-bold text-stone-600">票</span>
                    </span>
                  </div>

                  <Link
                    href={`/inventions/${inv.id}`}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition flex items-center gap-1 shadow-2xs shrink-0"
                  >
                    <span>作品を見る</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
