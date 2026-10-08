"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/Navigation";
import { mockExperts, mockInventions } from "@/data/mock";
import { saveExpertInquiry, getAllInventions } from "@/lib/storage";
import { Invention } from "@/types";
import { 
  Wrench, 
  Scale, 
  Box, 
  Hammer, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Send, 
  X, 
  Sparkles
} from "lucide-react";

export default function ExpertsPage() {
  const [inventionsList] = useState<Invention[]>(() => {
    if (typeof window !== "undefined") {
      return getAllInventions();
    }
    return mockInventions;
  });
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedExpert, setSelectedExpert] = useState<typeof mockExperts[0] | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);
  const [selectedInvention, setSelectedInvention] = useState<string>(mockInventions[0].title);
  const [inquiryText, setInquiryText] = useState<string>("");
  const [hasNdaAgreed, setHasNdaAgreed] = useState<boolean>(true);

  const filteredExperts = mockExperts.filter((expert) => {
    if (selectedRole === "all") return true;
    return expert.role === selectedRole;
  });

  const handleOpenInquiry = (expert: typeof mockExperts[0]) => {
    setSelectedExpert(expert);
    setInquirySubmitted(false);
    setInquiryText(`はじめまして。考案中の発明品「${selectedInvention}」について、試作または特許・権利化のご相談をさせていただけますでしょうか。`);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExpert) {
      saveExpertInquiry({
        id: `inq-${Date.now()}`,
        expertId: selectedExpert.id,
        expertName: selectedExpert.companyName,
        expertRole: selectedExpert.roleLabel,
        inventionTitle: selectedInvention,
        topic: inquiryText.slice(0, 30) + "...",
        budget: selectedExpert.samplePrice,
        message: inquiryText,
        status: "専門家確認中",
        createdAt: "たった今",
      });
    }
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">

        {/* ヒーローヘッダー */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
              <span>発明を形にするプロフェッショナル</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              試作屋・町工場・弁理士パートナー
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              「手描きのポンチ絵しかない」「特許の出願方法がわからない」「樹脂や金属で試作したい」。
              個人発明家の熱い想いに寄り添い、確かな技術でサポートしてくれる専門家ネットワークです。
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
            <Wrench className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* 発明家への安心約束バナー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">秘密保持（NDA）の標準適用</h4>
              <p className="text-xs text-stone-500 mt-0.5">アイデア盗用を防ぐ規約に全専門家が合意済み</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">初回相談は無料・低額対応</h4>
              <p className="text-xs text-stone-500 mt-0.5">ポンチ絵の持ち込みや可能性の診断から気軽に相談</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">個人発明家に優しい職人厳選</h4>
              <p className="text-xs text-stone-500 mt-0.5">専門用語を使わず、丁寧に対話してくれる提携先</p>
            </div>
          </div>
        </div>

        {/* カテゴリ切り替えタブ */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-stone-200">
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedRole === "all"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <span>すべての専門家 ({mockExperts.length})</span>
            </button>

            <button
              onClick={() => setSelectedRole("prototype")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === "prototype"
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>町工場・試作切削</span>
            </button>

            <button
              onClick={() => setSelectedRole("patent_attorney")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === "patent_attorney"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>弁理士・特許出願</span>
            </button>

            <button
              onClick={() => setSelectedRole("cad_design")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === "cad_design"
                  ? "bg-indigo-700 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D CAD・デザイン</span>
            </button>

            <button
              onClick={() => setSelectedRole("craftsman")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === "craftsman"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>木工・板金職人</span>
            </button>
          </div>

          {/* 専門家一覧グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={expert.avatarUrl}
                        alt={expert.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                      />
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 mb-1">
                          {expert.roleLabel}
                        </span>
                        <h3 className="font-extrabold text-stone-900 text-base">
                          {expert.companyName}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium">代表: {expert.name}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold justify-end">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{expert.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        相談実績 {expert.consultationCount}件
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
                    {expert.shortBio}
                  </p>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-stone-500">得意分野・保有設備</div>
                    <div className="flex flex-wrap gap-1.5">
                      {expert.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{expert.location}</span>
                    </div>
                    <div className="text-xs font-bold text-amber-900">
                      費用目安: {expert.samplePrice}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenInquiry(expert)}
                    className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>相談・見積もりを依頼</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 専門家・町工場の登録募集バナー */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
              専門家パートナー募集中
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              あなたの技術と設備で、情熱ある発明家を支えませんか？
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              町工場の稼働率向上、弁理士事務所の新規クライアント獲得、若手デザイナーの実績作りに。
              個人発明家からの試作・相談案件を仲介手数料なしで直接受託できます。
            </p>
          </div>

          <button
            onClick={() => alert("専門家・町工場の登録申請フォームを開きます。")}
            className="shrink-0 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            専門家として登録申請する（無料）
          </button>
        </div>

      </main>

      <Footer />

      {/* 相談・見積もり依頼モーダル */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedExpert(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!inquirySubmitted ? (
              <form onSubmit={handleSubmitInquiry} className="space-y-5">
                <div>
                  <div className="text-xs font-bold text-amber-800 mb-1">専門家への相談フォーム</div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {selectedExpert.companyName}（{selectedExpert.name} さん）へ問い合わせ
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      対象の発明品を選択
                    </label>
                    <select
                      value={selectedInvention}
                      onChange={(e) => setSelectedInvention(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-800 bg-stone-50 text-base"
                    >
                      {inventionsList.map((inv) => (
                        <option key={inv.id} value={inv.title}>
                          {inv.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      相談したい内容・現状のお困りごと *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      図面・スケッチ・写真の添付（任意）
                    </label>
                    <label className="border border-dashed border-stone-300 p-4 rounded-xl text-center text-stone-500 bg-stone-50 hover:bg-stone-100 cursor-pointer transition flex flex-col items-center justify-center gap-1 block">
                      <span className="text-xs text-stone-700 font-semibold">
                        📷 スマホの写真やポンチ絵を選択
                      </span>
                      <span className="text-[11px] text-stone-400">
                        クリックしてファイルを選択（JPG, PNG, PDF）
                      </span>
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={() => alert("試作スケッチを選択しました。")} />
                    </label>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasNdaAgreed}
                        onChange={(e) => setHasNdaAgreed(e.target.checked)}
                        className="mt-0.5 rounded text-amber-700"
                      />
                      <span className="text-[11px] text-stone-700 leading-tight">
                        プラットフォーム標準秘密保持規約（NDA）に基づき、発明のアイデアと開示情報が保護されることに同意します。
                      </span>
                    </label>
                    <p className="text-[10px] text-stone-500 leading-relaxed pt-1 border-t border-amber-200/60">
                      ※弁理士法第75条遵守: 本サービスは公認パートナー制度による情報提供であり、紹介料や成約マージン等は一切発生いたしません。
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedExpert(null)}
                    className="flex-1 py-3 text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold rounded-xl transition text-xs"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={!hasNdaAgreed}
                    className="flex-[2] py-3 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>相談メッセージを送信する</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">相談依頼を送信しました！</h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                  {selectedExpert.companyName} へ通知されました。通常1〜2営業日以内にマイページのメッセージ受信トレイへ返信が届きます。
                </p>
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
