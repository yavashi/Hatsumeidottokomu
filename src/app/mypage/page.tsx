"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { mockInventions } from "@/data/mock";
import { 
  getUserProfile, 
  saveUserProfile, 
  getSavedCustomInventions, 
  deleteCustomInvention, 
  saveCustomInvention, 
  getFavoriteIds, 
  getAllInventions, 
  getExpertInquiries,
  UserProfile,
  ExpertInquiry
} from "@/lib/storage";
import { Invention } from "@/types";
import { 
  User, 
  PlusCircle, 
  Heart, 
  Eye, 
  Sparkles, 
  ExternalLink, 
  Lightbulb, 
  ThumbsUp, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  Lock, 
  Globe, 
  Share2, 
  X,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function MyPage() {
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [activeTab, setActiveTab] = useState<"inventor" | "general">(() => {
    const p = getUserProfile();
    return p.role === "supporter" ? "general" : "inventor";
  });
  const [inventionFilter, setInventionFilter] = useState<"all" | "published" | "draft">("all");
  const [showVisitorPreviewModal, setShowVisitorPreviewModal] = useState(false);

  const [myInventions, setMyInventions] = useState<Invention[]>(() => {
    if (typeof window !== "undefined") {
      const custom = getSavedCustomInventions();
      const defaultMocks = mockInventions.filter((inv) => inv.inventorId === "inv-01");
      return [...custom, ...defaultMocks];
    }
    return mockInventions.filter((inv) => inv.inventorId === "inv-01");
  });
  const [favoriteInventions, setFavoriteInventions] = useState<Invention[]>(() => {
    if (typeof window !== "undefined") {
      const favIds = getFavoriteIds();
      return getAllInventions().filter((inv) => favIds.includes(inv.id));
    }
    return [];
  });
  const [expertInquiries, setExpertInquiries] = useState<ExpertInquiry[]>(() => {
    if (typeof window !== "undefined") {
      return getExpertInquiries();
    }
    return [];
  });

  // プロフィール編集モーダル
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(() => getUserProfile());

  const loadData = () => {
    const p = getUserProfile();
    setProfile(p);
    setEditForm(p);

    const custom = getSavedCustomInventions();
    const defaultMocks = mockInventions.filter((inv) => inv.inventorId === "inv-01");
    setMyInventions([...custom, ...defaultMocks]);

    const favIds = getFavoriteIds();
    const all = getAllInventions();
    const favs = all.filter((inv) => favIds.includes(inv.id));
    setFavoriteInventions(favs);

    setExpertInquiries(getExpertInquiries());
  };

  // プロフィール保存ハンドラー
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(editForm);
    setProfile(editForm);
    setShowEditProfileModal(false);
  };

  // プロフィール公開/非公開の直接切り替え
  const handleToggleProfilePublic = () => {
    const willBePublic = !profile.isProfilePublic;
    const msg = willBePublic
      ? "プロフィールを発明家図鑑（/inventors）に公開しますか？\nお名前・写真・自己紹介がサイト訪問者へ表示されるようになります。"
      : "プロフィールを非公開にしますか？\n外部の訪問者からは一切閲覧できなくなり、あなたのみ閲覧可能になります。";
    if (confirm(msg)) {
      const updated: UserProfile = {
        ...profile,
        isProfilePublic: willBePublic,
      };
      saveUserProfile(updated);
      setProfile(updated);
      setEditForm(updated);
    }
  };

  // 公開・非公開切り替え
  const handleTogglePrivacy = (inv: Invention) => {
    const isNowPrivate = !inv.isPrivate;
    const msg = isNowPrivate
      ? `「${inv.title}」を【非公開（特許保護下書き）】に変更しますか？\n外部訪問者からは閲覧できなくなり、安全に保護されます。`
      : `「${inv.title}」を【サイト全体に公開】しますか？\n※特許出願前の場合は新規性喪失にご注意ください。全国の読者や企業が閲覧可能になります。`;
    if (confirm(msg)) {
      const updated: Invention = {
        ...inv,
        isPrivate: isNowPrivate,
        status: isNowPrivate ? "draft" : "published",
      };
      saveCustomInvention(updated);
      loadData();
    }
  };

  // 発明品削除
  const handleDeleteInvention = (id: string, title: string) => {
    if (confirm(`「${title}」をアーカイブから削除しますか？\n（一度削除すると元に戻せません）`)) {
      deleteCustomInvention(id);
      loadData();
    }
  };

  const totalViews = myInventions.reduce((sum, inv) => sum + (inv.pageViews || 0), 1240);
  const totalWants = myInventions.reduce((sum, inv) => sum + (inv.wantsCount || 0), 328);

  const publishedInventions = myInventions.filter((inv) => !inv.isPrivate);
  const privateInventions = myInventions.filter((inv) => inv.isPrivate);
  const publicCount = publishedInventions.length;
  const privateCount = privateInventions.length;

  const filteredInventions = myInventions.filter((inv) => {
    if (inventionFilter === "published") return !inv.isPrivate;
    if (inventionFilter === "draft") return inv.isPrivate;
    return true;
  });

  const latestInquiry = expertInquiries[0];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* プロフィール・ヘッダーバナー */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xl md:text-2xl font-black text-stone-900">
                    {profile.name}
                  </span>
                  <span className="text-xs bg-stone-100 text-stone-800 font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                    {profile.role === "inventor" ? "発明家会員" : "一般会員"}
                  </span>
                  {profile.isProfilePublic ? (
                    <span className="text-xs bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
                      <Globe className="w-3 h-3 text-amber-700" />
                      <span>発明家図鑑に公開中</span>
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>プロフィール完全非公開</span>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditForm(profile);
                      setShowEditProfileModal(true);
                    }}
                    className="text-stone-400 hover:text-amber-700 p-1 rounded-lg transition"
                    title="プロフィールを編集"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {profile.nickname} ・ {profile.location}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  登録日: {profile.registeredDate}
                </p>
              </div>
            </div>

            {/* 表示モード切り替えスイッチ */}
            <div className="flex flex-col items-end gap-1.5 self-start md:self-center">
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
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
              <span className="text-[10px] text-stone-400 pr-1">
                ※画面の表示切替です（公開設定には影響しません）
              </span>
            </div>
          </div>
        </div>

        {/* 公開状況・プライバシー安心ダッシュボード */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs mb-8">
          {/* 上部ヘッダー */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                profile.isProfilePublic ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}>
                {profile.isProfilePublic ? <Globe className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900 flex items-center gap-2 flex-wrap">
                  公開・プライバシーステータス
                  <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                    一目でわかる公開インジケーター
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  外部の訪問者や他ユーザーにどの情報が見えているかを常時確認・管理できます
                </p>
              </div>
            </div>

            {/* 他者からの見え方プレビューボタン */}
            <button
              onClick={() => setShowVisitorPreviewModal(true)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800 hover:text-amber-800 bg-stone-100 hover:bg-amber-50 px-3.5 py-2 rounded-xl transition border border-stone-300 self-start sm:self-auto shadow-2xs"
            >
              <Eye className="w-4 h-4 text-stone-600" />
              <span>外部からの見え方を確認（プレビュー）</span>
            </button>
          </div>

          {/* アカウント全体の総合ステータス案内バナー */}
          <div className="mt-5">
            {profile.isProfilePublic ? (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-amber-950">
                        🌐 あなたの発明家プロフィールはサイト全体（発明家図鑑）に公開されています
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-[10px] font-bold">
                        外部公開中
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      全国の読者やものづくり企業があなたのお名前・写真・自己紹介を閲覧できます。
                      （※「非公開下書き」に設定された発明品は保護されており、外部訪問者には表示されません）
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleProfilePublic}
                  className="shrink-0 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-300 shadow-2xs transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>非公開に変更（あなたのみ閲覧）</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-emerald-950">
                        🔒 あなたのアカウント情報はサイト全体に一切公開されていません（完全非公開）
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                        プライベート保護中
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      お名前・写真・活動地域・お気に入り・登録データは、外部の一般訪問者や検索結果、発明家図鑑（/inventors）には一切表示されません。
                      個人情報が勝手に広まる心配はなく、安心してお気に入り登録や発明のアイデア保管にご利用いただけます。
                    </p>
                  </div>
                </div>

                {profile.role === "inventor" ? (
                  <button
                    onClick={handleToggleProfilePublic}
                    className="shrink-0 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl shadow-2xs transition flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>発明家図鑑に公開する</span>
                  </button>
                ) : (
                  <div className="shrink-0 text-xs text-emerald-800 bg-white px-3.5 py-2 rounded-xl border border-emerald-300 font-bold flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    一般会員のため外部非公開
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4項目公開状況クイックグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
            {/* 項目1: プロフィール */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    お名前・写真・地域
                  </span>
                  {profile.isProfilePublic ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-0.5">
                      <Globe className="w-3 h-3" /> 公開中
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> 非公開
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-stone-800">
                  {profile.isProfilePublic ? "発明家図鑑で紹介中" : "外部訪問者には非公開"}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {profile.isProfilePublic 
                    ? "誰でもあなたのプロフィールを閲覧できます"
                    : "あなた以外には一切表示されません"}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditForm(profile);
                  setShowEditProfileModal(true);
                }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 mt-3 flex items-center gap-1 self-start"
              >
                <span>公開設定を変更</span> →
              </button>
            </div>

            {/* 項目2: 発明品 */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    登録した発明品 ({myInventions.length}件)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                    {publicCount}公開 / {privateCount}非公開
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <span className="text-emerald-700">公開: {publicCount}件</span>
                  <span className="text-stone-400">|</span>
                  <span className="text-amber-800">非公開: {privateCount}件</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {privateCount > 0 
                    ? "非公開品は特許出願前でも安全に下書き保管中"
                    : "登録済みの発明品はすべて公開されています"}
                </p>
              </div>
              {activeTab === "inventor" ? (
                <a
                  href="#my-inventions-list"
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 mt-3 flex items-center gap-1 self-start"
                >
                  <span>一覧で状態を切り替え</span> ↓
                </a>
              ) : (
                <button
                  onClick={() => setActiveTab("inventor")}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 mt-3 flex items-center gap-1 self-start"
                >
                  <span>発明家ビューで管理</span> →
                </button>
              )}
            </div>

            {/* 項目3: お気に入り */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    お気に入り ({favoriteInventions.length}件)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> 完全非公開
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-800">
                  あなた専用のブックマーク
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  どの発明品をお気に入り登録したかは、他ユーザーには一切公開されません。
                </p>
              </div>
              <button
                onClick={() => setActiveTab("general")}
                className="text-[11px] font-bold text-rose-700 hover:text-rose-800 mt-3 flex items-center gap-1 self-start"
              >
                <span>お気に入りを確認</span> →
              </button>
            </div>

            {/* 項目4: 専門家相談 */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    専門家相談 ({expertInquiries.length}件)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> 完全非公開
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-800">
                  NDA（秘密保持）保護中
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  町工場・弁理士とのメッセージや添付スケッチは当事者間のみで秘密保持されます。
                </p>
              </div>
              <Link
                href="/experts"
                className="text-[11px] font-bold text-purple-700 hover:text-purple-800 mt-3 flex items-center gap-1 self-start"
              >
                <span>専門家一覧を見る</span> →
              </Link>
            </div>
          </div>
        </div>

        {/* --- 発明家ビュー --- */}
        {activeTab === "inventor" && (
          <div className="space-y-8">
            {/* クイックアクション & 閲覧実績 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-600" />
                  あなたの発明の総閲覧数
                </span>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  {totalViews.toLocaleString()} <span className="text-xs font-normal text-stone-500">回</span>
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
                  {totalWants.toLocaleString()} <span className="text-xs font-normal text-stone-500">人</span>
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
                    AI対話・手書き申込用紙から作成
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
            {latestInquiry && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                    工
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {latestInquiry.expertName} 様へ試作相談中
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {latestInquiry.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      「{latestInquiry.inventionTitle}」について相談中（秘密保持NDA保護中）
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
            )}

            {/* 登録した発明品一覧 */}
            <div id="my-inventions-list" className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    あなたの登録した発明品 ({myInventions.length}件)
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    生涯で1作品でも、大切なデジタルアーカイブとして保存されます。1作品ごとに公開・非公開を切り替え可能。
                  </p>
                </div>
                <Link
                  href="/mypage/inventions/new"
                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition self-start sm:self-auto shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>発明品を登録する</span>
                </Link>
              </div>

              {/* 公開状況フィルタータブ */}
              <div className="flex items-center gap-2 pb-4 border-b border-stone-200 mb-5 overflow-x-auto">
                <button
                  onClick={() => setInventionFilter("all")}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition whitespace-nowrap ${
                    inventionFilter === "all"
                      ? "bg-stone-900 text-white shadow-2xs"
                      : "bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                  }`}
                >
                  すべて ({myInventions.length})
                </button>
                <button
                  onClick={() => setInventionFilter("published")}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    inventionFilter === "published"
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>公開中のみ ({publicCount})</span>
                </button>
                <button
                  onClick={() => setInventionFilter("draft")}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    inventionFilter === "draft"
                      ? "bg-stone-700 text-white shadow-2xs"
                      : "bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-stone-600" />
                  <span>非公開・特許保護下書きのみ ({privateCount})</span>
                </button>
              </div>

              {filteredInventions.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  選択されたステータスの発明品はありません。
                  {inventionFilter !== "all" && (
                    <div className="mt-2">
                      <button
                        onClick={() => setInventionFilter("all")}
                        className="text-amber-700 font-bold hover:underline"
                      >
                        「すべて」を表示する →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInventions.map((inv) => {
                    const isCustom = inv.id.startsWith("inv-custom");
                    const imgUrl = inv.primaryImageUrl || inv.thumbnailUrl || "";
                    const catchText = inv.catchphrase || inv.tagline || "";

                    return (
                      <div
                        key={inv.id}
                        className={`border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                          inv.isPrivate
                            ? "border-stone-300 bg-stone-100/60 hover:border-stone-400"
                            : "border-emerald-200 bg-white hover:border-emerald-300 shadow-2xs"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={imgUrl}
                              alt={inv.title}
                              className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-xs ${
                              inv.isPrivate ? "bg-stone-600" : "bg-emerald-600"
                            }`}>
                              {inv.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {inv.isPrivate ? (
                                <span className="text-xs bg-stone-200 text-stone-800 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-stone-300">
                                  <Lock className="w-3 h-3 text-stone-600" />
                                  非公開下書き（特許保護中・外部非公開）
                                </span>
                              ) : (
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-emerald-300">
                                  <Globe className="w-3 h-3 text-emerald-700" />
                                  サイト全体に公開中
                                </span>
                              )}
                              <span className="text-xs text-stone-400">
                                {inv.category}
                              </span>
                              {isCustom && (
                                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.2 rounded">
                                  自作登録品
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-sm text-stone-900 mt-1">
                              {inv.title}
                            </h3>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {catchText}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-200 flex-wrap sm:flex-nowrap">
                          <div className="text-right text-xs mr-2">
                            <p className="font-bold text-stone-700">{inv.pageViews || 1} views</p>
                            <p className="text-[11px] text-amber-700 font-bold">{inv.wantsCount || 1} 欲しい</p>
                          </div>

                          {/* 公開/非公開切り替え */}
                          <button
                            onClick={() => handleTogglePrivacy(inv)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border shadow-2xs whitespace-nowrap ${
                              inv.isPrivate
                                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                                : "bg-white hover:bg-stone-50 text-stone-700 border-stone-300"
                            }`}
                            title={inv.isPrivate ? "サイト全体に一般公開する" : "外部から隠して非公開下書きにする"}
                          >
                            {inv.isPrivate ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            <span>{inv.isPrivate ? "公開する" : "非公開にする"}</span>
                          </button>

                          {/* 削除 */}
                          {isCustom && (
                            <button
                              onClick={() => handleDeleteInvention(inv.id, inv.title)}
                              className="text-xs text-rose-600 hover:text-rose-800 bg-white border border-stone-200 hover:border-rose-300 p-2 rounded-xl transition"
                              title="削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <Link
                            href={`/inventions/${inv.id}`}
                            className="text-xs font-bold text-stone-700 hover:text-amber-700 bg-white border border-stone-200 hover:border-amber-300 px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs whitespace-nowrap"
                          >
                            <span>{inv.isPrivate ? "下書き確認" : "ページを見る"}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 発明家向け実務支援ツールスイート */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
              <div className="mb-6">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  実務支援ツールスイート
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  チラシ印刷や町工場連携など、あなたの発明を世の中に広めるための支援機能です
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link
                  href="/mypage/tools/print-kit"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition">
                      AIチラシ・名刺印刷
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      A4チラシや名刺を自動生成。展示会や知人への配布に
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-1">
                    キットを開く →
                  </span>
                </Link>

                <Link
                  href="/mypage/tools/sns-automation"
                  className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-800 transition">
                      SNS自動ポスト
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
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    お気に入り・「欲しい」した発明品 ({favoriteInventions.length}件)
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    あなたが応援している発明品です。商品化の進捗などが通知されます。
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>他ユーザーには非公開（あなたのみ閲覧）</span>
                </span>
              </div>

              {favoriteInventions.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  まだお気に入りに登録された発明品がありません。
                  <div className="mt-3">
                    <Link href="/inventions" className="text-amber-700 font-bold hover:underline">
                      発明品一覧から気になる作品を探す →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteInventions.map((inv) => {
                    const imgUrl = inv.primaryImageUrl || inv.thumbnailUrl || "";
                    const catchText = inv.catchphrase || inv.tagline || "";

                    return (
                      <Link
                        key={inv.id}
                        href={`/inventions/${inv.id}`}
                        className="border border-stone-200 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-300 hover:shadow-xs transition bg-stone-50/50 group"
                      >
                        <img
                          src={imgUrl}
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
                            {catchText}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 text-center max-w-lg mx-auto">
              <Sparkles className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-amber-950">
                あなたも発明をお持ちですか？
              </h3>
              <p className="text-xs text-stone-600 mt-1 mb-4 leading-relaxed">
                ちょっとした日常の工夫や試作品があれば登録できます。AIとの対話、またはAIを使わない手入力申込用紙のどちらでも選べます。
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

      {/* プロフィール編集モーダル */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-stone-900">プロフィール・公開設定の編集</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* 会員種別の選択 */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">会員種別</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "inventor", isProfilePublic: editForm.isProfilePublic ?? true })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editForm.role === "inventor"
                        ? "bg-amber-50 border-amber-400 text-amber-900 shadow-2xs"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>発明家会員</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "supporter", isProfilePublic: false })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editForm.role === "supporter"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>一般会員（応援）</span>
                  </button>
                </div>
              </div>

              {/* プロフィール公開設定スイッチ */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="pr-3">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      {editForm.isProfilePublic ? (
                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      プロフィール全体公開
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                      {editForm.isProfilePublic
                        ? "発明家一覧（図鑑）に掲載され、全国の読者や企業が閲覧可能になります"
                        : "外部には一切非公開となり、あなたのみ閲覧できます（一般会員推奨）"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!editForm.isProfilePublic}
                      onChange={(e) => setEditForm({ ...editForm, isProfilePublic: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">お名前・屋号</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">愛称・肩書き</label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">工房・活動地域</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">自己紹介・ものづくりへの想い</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs text-stone-700 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 外部訪問者からの見え方プレビューモーダル */}
      {showVisitorPreviewModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* モーダルヘッダー */}
            <div className="p-5 md:p-6 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black">
                    外部の訪問者からの見え方プレビュー
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    一般の閲覧者や他ユーザーがアクセスした際に実際に表示される画面シミュレーションです
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVisitorPreviewModal(false)}
                className="text-stone-400 hover:text-white p-1.5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* モーダル本文（スクロール可能） */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {!profile.isProfilePublic ? (
                /* 非公開の場合 */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                      🔒 完全非公開（外部アクセス遮断中）
                    </span>
                    <h4 className="text-lg font-black text-stone-900">
                      外部の訪問者には、あなたの個人情報は一切表示されません
                    </h4>
                    <p className="text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                      一般会員または非公開設定のため、外部からあなたのプロフィールURLに直接アクセスされた場合でも「404 または非公開」となり、お名前・写真・活動地域・お気に入り品は1文字も表示されません。
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs text-stone-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      プライバシー保護の確認状況
                    </div>
                    <ul className="space-y-1.5 pl-6 list-disc text-[11px] text-stone-600">
                      <li>発明家図鑑（/inventors）への掲載：<strong>なし（非掲載）</strong></li>
                      <li>サイト内キーワード検索でのヒット：<strong>なし（完全除外）</strong></li>
                      <li>応援・「欲しい」投票履歴の他者閲覧：<strong>不可（あなたのみ閲覧）</strong></li>
                      <li>特許出願前のアイデア・下書き：<strong>本人以外閲覧不可（安全保護）</strong></li>
                    </ul>
                  </div>
                </div>
              ) : (
                /* 公開中の場合（発明家プロフィール） */
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
                    <Globe className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <p className="font-bold">🌐 発明家図鑑に公開中のプロフィールです</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        外部訪問者は、以下のお名前・写真・自己紹介および「公開中」の発明品のみを閲覧できます。
                      </p>
                    </div>
                  </div>

                  {/* 公開プロフィールのカードシミュレーション */}
                  <div className="border border-stone-200 rounded-2xl p-5 bg-white shadow-2xs">
                    <div className="flex items-start gap-4">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg text-stone-900">{profile.name}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            公認発明家
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          {profile.nickname} ・ {profile.location}
                        </p>
                        <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          {profile.bio || "ものづくりへの熱い想いを込めて発明に取り組んでいます。"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 外部から閲覧可能な発明品一覧 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        外部に公開されている発明品 ({publishedInventions.length}件)
                      </h5>
                      <span className="text-[11px] text-stone-500">
                        ※非公開品（{privateCount}件）は表示されません
                      </span>
                    </div>

                    {publishedInventions.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-500">
                        公開中の発明品はありません（すべて非公開下書きまたは未登録です）
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {publishedInventions.map((inv) => (
                          <div
                            key={inv.id}
                            className="border border-stone-200 rounded-xl p-3 flex items-center gap-3 bg-stone-50/50"
                          >
                            <img
                              src={inv.primaryImageUrl || inv.thumbnailUrl || ""}
                              alt={inv.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                公開中
                              </span>
                              <p className="text-xs font-bold text-stone-900 truncate mt-0.5">
                                {inv.title}
                              </p>
                              <p className="text-[11px] text-stone-500 truncate">
                                {inv.catchphrase || inv.tagline}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {privateCount > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center gap-2 text-xs text-stone-600">
                        <Lock className="w-4 h-4 text-stone-500 shrink-0" />
                        <span>
                          <strong>{privateCount}件の非公開発明品</strong>は外部から完全に隠されており、特許出願まで安全に保護されています。
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* モーダルフッター */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <p className="text-[11px] text-stone-500">
                公開設定の変更はマイページの「プロフィール編集」または各ステータスボタンから行えます
              </p>
              <button
                onClick={() => setShowVisitorPreviewModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
