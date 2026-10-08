"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { InventionCard } from "@/components/InventionCard";
import { mockInventions } from "@/data/mock";
import { 
  Search, 
  Layers, 
  Wrench, 
  Flame, 
  Clock, 
  Sparkles, 
  SlidersHorizontal, 
  Award,
  ArrowUpDown,
  X
} from "lucide-react";

type SortOption = "wants" | "newest" | "views" | "likes";

export default function InventionsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProcess, setSelectedProcess] = useState<string>("all");
  const [onlyPatent, setOnlyPatent] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("wants");

  const categories = [
    { id: "all", name: "すべて" },
    { id: "シニア・介護", name: "シニア・介護" },
    { id: "日用品・雨具", name: "日用品・雨具" },
    { id: "キッチン", name: "キッチン・調理" },
    { id: "防災", name: "防災・防犯" },
    { id: "DIY・工具", name: "DIY・園芸" },
    { id: "ペット・インテリア", name: "ペット・家具" },
  ];

  const processes = [
    { id: "all", name: "すべて" },
    { id: "射出成形", name: "プラスチック成形" },
    { id: "CNC切削", name: "金属切削・旋盤" },
    { id: "木工加工", name: "木工加工" },
    { id: "3Dプリント", name: "3Dプリント" },
    { id: "板金加工", name: "板金・プレス" },
  ];

  // フィルタリング & ソート
  const filteredAndSortedInventions = useMemo(() => {
    let result = mockInventions.filter((inv) => {
      // 検索キーワード
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = inv.title.toLowerCase().includes(query);
        const matchCatch = inv.catchphrase.toLowerCase().includes(query);
        const matchSummary = inv.summary.toLowerCase().includes(query);
        const matchTag = inv.tags.some((t) => t.toLowerCase().includes(query));
        const matchMaterial = inv.materials.some((m) => m.toLowerCase().includes(query));
        if (!matchTitle && !matchCatch && !matchSummary && !matchTag && !matchMaterial) {
          return false;
        }
      }

      // カテゴリ
      if (selectedCategory !== "all" && inv.category !== selectedCategory) {
        return false;
      }

      // 加工・技術
      if (selectedProcess !== "all" && !inv.processes.includes(selectedProcess)) {
        return false;
      }

      // 特許ありのみ
      if (onlyPatent && !inv.hasPatent) {
        return false;
      }

      return true;
    });

    // ソート順
    result.sort((a, b) => {
      if (sortBy === "wants") {
        return b.wantsCount - a.wantsCount; // 商品化希望数順（人気順）
      } else if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 新着順
      } else if (sortBy === "views") {
        return b.pageViews - a.pageViews; // 閲覧数順
      } else if (sortBy === "likes") {
        return b.likesCount - a.likesCount; // いいね数順
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedProcess, onlyPatent, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedProcess("all");
    setOnlyPatent(false);
    setSortBy("wants");
  };

  const isFiltered = searchQuery !== "" || selectedCategory !== "all" || selectedProcess !== "all" || onlyPatent || sortBy !== "wants";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10 w-full flex-1">
        {/* ヘッダーエリア */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>個人発明の図鑑・アーカイブ</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-stone-900">
              世の中の発明を探す
            </h1>
            <p className="text-stone-500 text-xs md:text-sm mt-1">
              町工場の職人から主婦まで、身近な不便から生まれた熱いアイデアを検索できます
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">該当件数:</span>
            <span className="text-lg font-black text-amber-700">{filteredAndSortedInventions.length}</span>
            <span className="text-xs text-stone-500">件</span>
          </div>
        </div>

        {/* 検索コントロールボックス */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 mb-8 shadow-xs space-y-5">
          {/* キーワード検索入力 ＆ ソートドロップダウン */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワード、お悩み、素材、タグで探す（例: ペットボトル、傘、防災）"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ソートセレクター */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 self-start sm:self-auto shrink-0">
              <ArrowUpDown className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-600">並び順:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="wants">🔥 商品化希望が多い順</option>
                <option value="newest">✨ 新着順</option>
                <option value="views">👀 閲覧数が多い順</option>
                <option value="likes">❤️ 応援（いいね）順</option>
              </select>
            </div>
          </div>

          {/* カテゴリフィルター */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                分野・カテゴリ
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    selectedCategory === c.id
                      ? "bg-amber-600 text-white font-bold shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* 製造・加工技術 & 特許フィルター */}
          <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5 mr-1">
                <Wrench className="w-3.5 h-3.5 text-stone-500" />
                加工・素材:
              </span>
              {processes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProcess(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    selectedProcess === p.id
                      ? "bg-stone-900 text-white font-bold"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyPatent}
                  onChange={(e) => setOnlyPatent(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  特許・実用新案ありのみ
                </span>
              </label>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 ml-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  条件をクリア
                </button>
              )}
            </div>
          </div>
        </div>

        {/* リスト表示グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedInventions.map((inv) => (
            <InventionCard key={inv.id} invention={inv} />
          ))}
        </div>

        {/* 検索結果がゼロの場合 */}
        {filteredAndSortedInventions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">
              条件に一致する発明品は見つかりませんでした
            </h3>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              キーワードを変えるか、カテゴリや加工条件のフィルターを解除してみてください。
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              フィルターをリセットする
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}