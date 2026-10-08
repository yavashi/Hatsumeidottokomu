"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { mockInventors, mockInventions } from "@/data/mock";
import { Award, Lightbulb, MapPin, Sparkles, ArrowRight, Search, Users, X } from "lucide-react";

export default function InventorsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = [
    { id: "all", name: "全国" },
    { id: "関東", name: "関東 (東京・千葉)" },
    { id: "中部", name: "中部 (愛知・静岡・長野)" },
    { id: "近畿", name: "近畿 (京都)" },
  ];

  const filteredInventors = useMemo(() => {
    return mockInventors.filter((inv) => {
      // 検索クエリ
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = inv.name.toLowerCase().includes(q);
        const matchNick = (inv.nickname || "").toLowerCase().includes(q);
        const matchBio = inv.bio.toLowerCase().includes(q);
        const matchLoc = (inv.location || "").toLowerCase().includes(q);
        if (!matchName && !matchNick && !matchBio && !matchLoc) {
          return false;
        }
      }

      // 地域
      if (selectedRegion === "関東" && !inv.location?.includes("東京") && !inv.location?.includes("千葉")) {
        return false;
      }
      if (selectedRegion === "中部" && !inv.location?.includes("愛知") && !inv.location?.includes("静岡") && !inv.location?.includes("長野")) {
        return false;
      }
      if (selectedRegion === "近畿" && !inv.location?.includes("京都")) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10 w-full flex-1">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>情熱のクリエイター図鑑</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900">
            登録されている個人発明家
          </h1>
          <p className="text-stone-500 text-xs md:text-sm mt-2 leading-relaxed">
            職人、元先生、主婦、DIY愛好家など、日常の不便を自らの手で解決してきた個性豊かな発明家たち。<br />
            生涯で1作品の想いも、後世に残るデジタルアーカイブとして大切に記録しています。
          </p>
        </div>

        {/* 検索・絞り込みバー */}
        <div className="bg-white rounded-3xl border border-stone-200 p-4 md:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="発明家の名前、肩書き、活動地域、経歴で検索"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
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

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-stone-500 shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              地域:
            </span>
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                  selectedRegion === r.id
                    ? "bg-amber-600 text-white font-bold"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* 発明家カード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInventors.map((inv) => {
            const userInventions = mockInventions.filter((i) => i.inventorId === inv.id);
            const totalWants = userInventions.reduce((sum, item) => sum + item.wantsCount, 0);

            return (
              <div
                key={inv.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={inv.avatarUrl}
                      alt={inv.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/inventors/${inv.id}`} className="hover:underline">
                          <h2 className="text-lg md:text-xl font-bold text-stone-900 truncate">{inv.name}</h2>
                        </Link>
                        {inv.nickname && (
                          <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded-md border border-amber-200">
                            {inv.nickname}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{inv.location}</span>
                        <span>·</span>
                        <span>{inv.age}歳</span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                    {inv.aiSummaryBio || inv.bio}
                  </p>

                  {/* この発明家の登録作品 */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      登録作品 ({userInventions.length}件)
                    </span>
                    <div className="space-y-1.5">
                      {userInventions.map((item) => (
                        <Link
                          key={item.id}
                          href={`/inventions/${item.id}`}
                          className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg hover:bg-amber-50/70 transition group"
                        >
                          <span className="font-bold text-stone-800 group-hover:text-amber-800 truncate flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {item.title}
                          </span>
                          <span className="text-[11px] text-amber-700 font-bold shrink-0 ml-2">
                            {item.wantsCount}人欲しい
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    累計商品化希望: <strong className="text-amber-700">{totalWants}</strong> 票
                  </span>
                  <Link
                    href={`/inventors/${inv.id}`}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                  >
                    <span>プロフィールと想いを見る</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInventors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">条件に一致する発明家は見つかりませんでした</p>
            <p className="text-xs text-stone-400 mt-1">キーワードや地域設定を変更してみてください。</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}