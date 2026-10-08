"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/Navigation";
import { DynamicSectionRenderer } from "@/components/DynamicSectionRenderer";
import { mockInventions, mockInventors } from "@/data/mock";
import { 
  findInventionById, 
  toggleFavorite, 
  getFavoriteIds, 
  getCommentsForInvention, 
  addCommentForInvention,
  CustomComment
} from "@/lib/storage";
import { Invention } from "@/types";
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Award, 
  Sparkles, 
  User, 
  Layers, 
  Wrench, 
  Building2, 
  ArrowLeft,
  Clock,
  LayoutGrid,
  CheckCircle2,
  MessageCircle,
  Send,
  Share2,
  FileText,
  Calendar,
  ThumbsUp,
  Mail,
  Printer,
  X
} from "lucide-react";

interface CommentItem {
  id: string;
  author: string;
  isInventor?: boolean;
  text: string;
  presetBadge?: string;
  createdAt: string;
  likes: number;
}

export default function InventionDetailPage() {
  const params = useParams();
  const inventionId = params.id as string;

  const [currentInvention, setCurrentInvention] = useState<Invention>(() => {
    return mockInventions.find((i) => i.id === inventionId) || mockInventions[0];
  });

  const invention = currentInvention;
  const inventor = mockInventors.find((inv) => inv.id === invention.inventorId) || mockInventors[0];

  // ステート管理
  const [likes, setLikes] = useState(invention.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [wants, setWants] = useState(invention.wantsCount);
  const [hasWanted, setHasWanted] = useState(false);
  
  // モーダルステート
  const [showWantModal, setShowWantModal] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [enterpriseSent, setEnterpriseSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 投票アンケート（企業向け需要の精緻化）
  const [selectedPriceRange, setSelectedPriceRange] = useState("1,000円〜2,000円");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // 企業問い合わせフォームステート
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("ライセンス（特許実施許諾）について");
  const [inquiryMessage, setInquiryMessage] = useState("");

  // 応援コメント一覧
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "c-1",
      author: "介護スタッフ ゆき",
      text: "デイサービスでペットボトルの開栓に困っている利用者様がたくさんいます。市販品は滑り止めばかりで握力がないと使えなかったので、このテコ機構は本当に素晴らしいです！",
      presetBadge: "商品化されたら買いたい",
      createdAt: "3日前",
      likes: 14
    },
    {
      id: "c-2",
      author: "下町の金型職人",
      text: "アルミ削り出しのカムの曲線が非常に美しいですね。45年の職人技と奥様への愛情がひしひしと伝わってきます。応援しています！",
      presetBadge: "技術に感動",
      createdAt: "1週間前",
      likes: 22
    }
  ]);

  // 新規コメント投稿ステート
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("ぜひ商品化してほしい！");

  const presetTags = [
    "ぜひ商品化してほしい！",
    "アイデアに感動しました！",
    "家族に使わせたい",
    "応援しています！",
    "デザインが温かい"
  ];

  // クライアント側での動的データ読み込み（カスタム発明品・お気に入り・コメント）
  useEffect(() => {
    const loaded = findInventionById(inventionId);
    if (loaded) {
      setCurrentInvention(loaded);
      setLikes(loaded.likesCount);
      setWants(loaded.wantsCount);
    }
    const favs = getFavoriteIds();
    setHasLiked(favs.includes(inventionId));

    const savedComments = getCommentsForInvention(inventionId);
    if (savedComments.length > 0) {
      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newOnes = savedComments.filter((c) => !existingIds.has(c.id));
        return [...newOnes, ...prev];
      });
    }
  }, [inventionId]);

  const handleLike = () => {
    const isNow = toggleFavorite(invention.id);
    setHasLiked(isNow);
    setLikes((prev) => (isNow ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleWant = () => {
    if (!hasWanted) {
      setWants((prev) => prev + 1);
      setHasWanted(true);
      setShowWantModal(true);
    } else {
      setWants((prev) => Math.max(0, prev - 1));
      setHasWanted(false);
    }
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySubmitted(true);
    setTimeout(() => {
      setShowWantModal(false);
      setSurveySubmitted(false);
    }, 1500);
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseSent(true);
    setTimeout(() => {
      setShowEnterpriseModal(false);
      setEnterpriseSent(false);
      setCompanyName("");
      setCompanyEmail("");
      setInquiryMessage("");
    }, 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: commentAuthor.trim() || "匿名の応援者",
      text: commentText.trim(),
      presetBadge: selectedPreset,
      createdAt: "たった今",
      likes: 0
    };

    // ローカルストレージに永続化
    addCommentForInvention({
      id: newComment.id,
      inventionId: invention.id,
      author: newComment.author,
      text: newComment.text,
      presetBadge: newComment.presetBadge,
      createdAt: newComment.createdAt,
      likes: 0,
    });

    setComments([newComment, ...comments]);
    setCommentText("");
    setCommentAuthor("");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        {/* パンくずナビ & シェア・印刷ボタン */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-amber-700 transition flex items-center gap-1 font-bold">
              <ArrowLeft className="w-4 h-4" />
              トップ
            </Link>
            <span>/</span>
            <Link href="/inventions" className="hover:text-amber-700 transition">
              {invention.category}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-bold truncate max-w-xs">{invention.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold transition text-xs shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>印刷用レイアウト</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold transition text-xs shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>{copiedLink ? "URLコピー完了！" : "シェアする"}</span>
            </button>
          </div>
        </div>

        {/* メインヒーロー領域（全作品共通の基本情報ヘッダー） */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-amber-100 text-amber-950 text-xs md:text-sm font-bold px-3 py-1 rounded-full border border-amber-200">
              {invention.category}
            </span>
            {invention.hasPatent && (
              <span className="bg-amber-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <Award className="w-4 h-4" />
                {invention.patentNumber || "特許取得済み"}
              </span>
            )}
            <div className="ml-auto flex items-center gap-4 text-xs md:text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-stone-400" />
                {invention.pageViews} 閲覧
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-stone-400" />
                {invention.createdAt} 掲載
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-stone-900 tracking-tight leading-snug">
            {invention.title}
          </h1>

          <p className="mt-3 text-base md:text-lg text-amber-900 font-semibold leading-relaxed">
            {invention.catchphrase}
          </p>

          {/* 写真＆アクションエリア */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* 左側：画像ギャラリー */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 h-80 md:h-96 relative">
                <img
                  src={invention.primaryImageUrl}
                  alt={invention.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* サブ写真 */}
              {invention.additionalImages && invention.additionalImages.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500 shrink-0">
                    <img src={invention.primaryImageUrl} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                  {invention.additionalImages.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shrink-0 opacity-80 hover:opacity-100 transition">
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右側：応援＆需要ボタンスコアカード */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* 「商品化されたら欲しい」投票カード */}
              <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-2 text-amber-100 text-xs md:text-sm font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" />
                  <span>製品化リクエスト投票</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black">{wants}</span>
                  <span className="text-sm md:text-base text-amber-100 font-bold">人が商品化を希望！</span>
                </div>
                <p className="mt-2 text-xs md:text-sm text-amber-100 leading-relaxed">
                  「この発明がお店で買えるなら欲しい！」という一般の皆様の声が、企業やメーカーの量産決断を動かします。
                </p>

                <button
                  onClick={handleWant}
                  className={`mt-5 w-full py-4 px-4 rounded-2xl font-black text-sm md:text-base shadow-md transition flex items-center justify-center gap-2 ${
                    hasWanted 
                      ? "bg-white text-amber-950 ring-4 ring-amber-300/40" 
                      : "bg-stone-950 hover:bg-stone-900 text-white hover:scale-[1.02]"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span>{hasWanted ? "✓ 商品化リクエスト送信済み" : "商品化されたら欲しい！ (+1)"}</span>
                </button>
              </div>

              {/* いいね応援ボタン */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs md:text-sm text-stone-600 font-bold block">発明家を応援する</span>
                  <span className="text-lg md:text-xl font-black text-stone-900">{likes} いいね</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs md:text-sm transition ${
                    hasLiked
                      ? "bg-rose-500 text-white shadow-xs"
                      : "bg-white border border-stone-300 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? "fill-white" : "text-rose-500"}`} />
                  <span>{hasLiked ? "応援しました" : "いいね！で応援"}</span>
                </button>
              </div>

              {/* 発明家ミニプロフィール */}
              {inventor && (
                <Link
                  href={`/inventors/${inventor.id}`}
                  className="bg-white border border-stone-200 rounded-3xl p-5 hover:border-amber-300 transition group block"
                >
                  <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block mb-3">
                    INVENTOR
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={inventor.avatarUrl}
                      alt={inventor.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm md:text-base group-hover:text-amber-800 transition">
                        {inventor.name}
                      </h4>
                      <p className="text-xs md:text-sm text-stone-500">{inventor.location} · {inventor.age}歳</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs md:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {inventor.aiSummaryBio || inventor.bio}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* デジタルアーカイブ認定バナー（特許・生涯の記録） */}
        <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                DIGITAL ARCHIVE CERTIFICATE
              </span>
              <h3 className="font-bold text-stone-900 text-base md:text-lg">
                発明ドットコム公式 デジタル永久アーカイブ保存作品
              </h3>
              <p className="text-xs md:text-sm text-stone-600 mt-0.5">
                特許庁情報・試作資料・開発年表をもとに、個人発明家の生涯の記録として後世に保存されています。
              </p>
            </div>
          </div>
          {invention.patentNumber && (
            <div className="bg-white px-4 py-2 rounded-xl border border-amber-300 text-xs md:text-sm text-amber-950 font-bold shrink-0">
              {invention.patentNumber}
            </div>
          )}
        </div>

        {/* AIが発明品に合わせて動的に構成したセクション群 */}
        <div className="space-y-8 mb-8">
          <div className="flex items-center gap-2 text-stone-500 text-xs md:text-sm font-bold uppercase tracking-wider px-2">
            <LayoutGrid className="w-4 h-4 text-amber-600" />
            <span>AI GENERATED PRESENTATION / 発明に最適化された構成</span>
          </div>

          {invention.aiSections && invention.aiSections.length > 0 ? (
            invention.aiSections.map((sec) => (
              <DynamicSectionRenderer key={sec.id} section={sec} />
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-4">発明の概要</h2>
              <p className="text-sm md:text-base text-stone-700 leading-relaxed">{invention.summary}</p>
            </div>
          )}
        </div>

        {/* 温かい応援メッセージ・コメント掲示板 */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl md:text-2xl font-black text-stone-900">
                  発明家への応援メッセージ ({comments.length}件)
                </h2>
              </div>
              <p className="text-xs md:text-sm text-stone-600 mt-1">
                発明家が作品を誇りに思えるのは皆様の温かい声のおかげです。
              </p>
            </div>
          </div>

          {/* コメント投稿フォーム */}
          <form onSubmit={handleAddComment} className="bg-stone-50 rounded-2xl p-4 md:p-5 border border-stone-200 mb-6 space-y-4">
            <span className="text-xs md:text-sm font-bold text-stone-700 block">
              一言応援メッセージを送る
            </span>

            {/* 定型メッセージバッジ選択 */}
            <div className="flex flex-wrap gap-2">
              {presetTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedPreset(tag)}
                  className={`text-xs px-3 py-1.5 rounded-xl transition font-medium ${
                    selectedPreset === tag
                      ? "bg-amber-600 text-white font-bold"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="お名前（ニックネーム可）"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="sm:col-span-2 relative">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="温かい応援の言葉や使ってみたい感想をどうぞ…"
                  className="w-full pl-4 pr-20 py-2.5 rounded-xl border border-stone-300 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>送信</span>
                </button>
              </div>
            </div>
          </form>

          {/* コメント一覧 */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-stone-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs md:text-sm text-stone-900">{c.author}</span>
                    {c.presetBadge && (
                      <span className="bg-amber-100 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        {c.presetBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400">{c.createdAt}</span>
                </div>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed mt-1">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 企業・製造会社向け 技術＆商品化スペックシート */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>SPECIFICATION FOR MANUFACTURERS & ENTERPRISES</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-6">
            製造技術・商品化スペックシート
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
            <div className="bg-stone-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-stone-300 font-semibold">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>使用素材・材質</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {invention.materials.map((m) => (
                  <span key={m} className="bg-stone-700 text-stone-100 px-3 py-1 rounded-lg">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-stone-300 font-semibold">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>想定される加工・成形技術</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {invention.processes.map((p) => (
                  <span key={p} className="bg-amber-950/80 border border-amber-700 text-amber-200 px-3 py-1 rounded-lg font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl space-y-2">
              <span className="text-stone-300 font-semibold block">希望販売価格（参考）</span>
              <p className="text-base font-bold text-amber-300">
                {invention.hopePrice ? `${invention.hopePrice.toLocaleString()} 円（税込）` : "未定・企業と相談"}
              </p>
              {invention.pastSalesRecord && (
                <p className="text-xs text-stone-400">{invention.pastSalesRecord}</p>
              )}
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl space-y-2">
              <span className="text-stone-300 font-semibold block">発明家の希望条件</span>
              <p className="text-xs md:text-sm text-stone-200 leading-relaxed">
                {invention.termsWish || "商品化に向けた企業様からのご提案をお待ちしております。"}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-stone-400">
              ※ 本発明について商品化・ライセンス許諾・試作などのご相談は、発明ドットコム運営事務局が中立的に仲介いたします。
            </p>
            <button
              onClick={() => setShowEnterpriseModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow transition text-xs md:text-sm shrink-0"
            >
              この発明について問い合わせる（企業様向け）
            </button>
          </div>
        </div>
      </main>

      {/* 画面下部フローティングCTAバー（スクロール時も押しやすい） */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-xs text-stone-500 block">閲覧中の作品</span>
            <span className="font-bold text-sm text-stone-900 truncate max-w-sm block">{invention.title}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                hasLiked
                  ? "bg-rose-500 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-white" : "text-rose-500"}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleWant}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-md transition ${
                hasWanted
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{hasWanted ? "リクエスト済" : `商品化されたら欲しい！ (${wants}人)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ① 商品化希望モーダル（価格帯アンケート・メール登録で需要データ精緻化） */}
      {showWantModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center border border-amber-200">
            <div className="flex justify-end mb-1">
              <button onClick={() => setShowWantModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              リクエストを受け付けました！
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              あなたの1票が、{inventor?.name || "発明者"}さんの大きな励みになります。
            </p>

            {/* アンケートフォーム */}
            {!surveySubmitted ? (
              <form onSubmit={handleSurveySubmit} className="mt-5 text-left bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-800 block">
                  💡 より確かな声を企業に届けるための任意アンケート
                </span>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    もし発売されたら、いくらなら購入したいですか？
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="〜1,000円">〜1,000円（ワンコイン〜手頃）</option>
                    <option value="1,000円〜2,000円">1,000円〜2,000円</option>
                    <option value="2,000円〜3,500円">2,000円〜3,500円（本格実用）</option>
                    <option value="3,500円以上">3,500円以上（高品質・記念品なら）</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    商品化決定時にお知らせメールを受け取る（任意）
                  </label>
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  回答して閉じる
                </button>
              </form>
            ) : (
              <div className="py-6 text-emerald-600 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>貴重なご意見ありがとうございました！</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ② 企業・メーカー向け お問い合わせモーダル */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-stone-900">
                  企業様向け お問い合わせ・ライセンス相談
                </h3>
              </div>
              <button onClick={() => setShowEnterpriseModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              発明品<strong>「{invention.title}」</strong>に関するライセンス契約、金型試作、共同商品化について事務局が仲介いたします。
            </p>

            {!enterpriseSent ? (
              <form onSubmit={handleEnterpriseSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">貴社名 *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="例: 株式会社〇〇製作所"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">ご担当者様名 *</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="山田 太郎"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">メールアドレス *</label>
                    <input
                      type="email"
                      required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="info@company.co.jp"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">ご相談種別 *</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="ライセンス（特許実施許諾）について">特許・意匠のライセンス実施許諾について</option>
                    <option value="共同商品化・製造受託の打診">共同商品化・量産に向けた協業の打診</option>
                    <option value="試作品の現物確認・サンプル提供">試作品の現物確認・サンプルの閲覧希望</option>
                    <option value="その他">その他・取材など</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">ご相談内容・メッセージ</label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="ご希望の提携条件や量産規模などをご記入ください"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    事務局へ送信する（仲介守秘義務遵守）
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                <span>お問い合わせを送信しました。事務局より2営業日以内にご連絡いたします。</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}