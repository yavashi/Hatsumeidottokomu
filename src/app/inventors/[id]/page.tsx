import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Navigation";
import { InventionCard } from "@/components/InventionCard";
import { mockInventors, mockInventions } from "@/data/mock";
import { MapPin, User, ArrowLeft, Lightbulb, Heart } from "lucide-react";

export default async function InventorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inventor = mockInventors.find((i) => i.id === id);

  if (!inventor) {
    notFound();
  }

  const userInventions = mockInventions.filter((i) => i.inventorId === inventor.id);
  const totalLikes = userInventions.reduce((sum, item) => sum + item.likesCount, 0);
  const totalViews = userInventions.reduce((sum, item) => sum + item.pageViews, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* ナビゲーション */}
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-500">
          <Link href="/inventors" className="hover:text-amber-700 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            発明家一覧へ戻る
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{inventor.name}</span>
        </div>

        {/* 発明家プロフィールカード */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <img
              src={inventor.avatarUrl}
              alt={inventor.name}
              className="w-24 h-24 md:w-28 md:d-28 rounded-full object-cover border-4 border-amber-100 shadow-sm shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-stone-900">{inventor.name}</h1>
                {inventor.nickname && (
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md border border-amber-300">
                    {inventor.nickname}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-2 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{inventor.location}</span>
                <span>·</span>
                <span>{inventor.age}歳</span>
                <span>·</span>
                <span>登録日: {inventor.createdAt}</span>
              </p>

              <div className="mt-4 flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-stone-600 bg-stone-50 p-3 rounded-2xl w-fit mx-auto md:mx-0">
                <span>掲載作品: {userInventions.length}点</span>
                <span>·</span>
                <span>総閲覧数: {totalViews.toLocaleString()}回</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-rose-600">
                  <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  {totalLikes.toLocaleString()}応援
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>自己紹介・ものづくりへの想い</span>
            </h3>
            <p className="text-xs md:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
              {inventor.bio}
            </p>
          </div>
        </div>

        {/* 発明品一覧 */}
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>INVENTIONS BY THIS CREATOR</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-6">
            {inventor.name} さんの発明品
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInventions.map((inv) => (
              <InventionCard key={inv.id} invention={inv} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}