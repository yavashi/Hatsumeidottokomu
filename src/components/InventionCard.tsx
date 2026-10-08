import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Invention } from "@/types";
import { Heart, Sparkles, Eye, ShoppingBag, Award } from "lucide-react";

interface InventionCardProps {
  invention: Invention;
}

export const InventionCard: React.FC<InventionCardProps> = ({ invention }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition duration-300 flex flex-col group">
      {/* 画像エリア */}
      <Link href={`/inventions/${invention.id}`} className="relative h-52 w-full overflow-hidden bg-stone-100 block">
        <img
          src={invention.primaryImageUrl}
          alt={invention.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {invention.category}
          </span>
          {invention.hasPatent && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              特許あり
            </span>
          )}
        </div>
      </Link>

      {/* コンテンツエリア */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/inventions/${invention.id}`}>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-1">
            {invention.title}
          </h3>
        </Link>
        <p className="text-xs text-amber-700 font-medium mt-1 line-clamp-1">
          {invention.catchphrase}
        </p>

        <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
          {invention.summary}
        </p>

        {/* タグ群 */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {invention.materials.map((m) => (
            <span key={m} className="bg-stone-100 text-stone-600 text-[11px] px-2 py-0.5 rounded-md">
              {m}
            </span>
          ))}
          {invention.processes.map((p) => (
            <span key={p} className="bg-amber-50 text-amber-800 text-[11px] px-2 py-0.5 rounded-md font-medium">
              {p}
            </span>
          ))}
        </div>

        {/* フッター・エンゲージメント */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              {invention.pageViews}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              {invention.likesCount}
            </span>
          </div>

          <div className="bg-amber-100/70 text-amber-900 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-amber-700" />
            <span>{invention.wantsCount}人が商品化希望</span>
          </div>
        </div>
      </div>
    </div>
  );
};
