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
  X 
} from "lucide-react";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"inventor" | "general">("inventor");
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
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

  // 公開・非公開切り替え
  const handleTogglePrivacy = (inv: Invention) => {
    const isNowPrivate = !inv.isPrivate;
    const updated: Invention = {
      ...inv,
      isPrivate: isNowPrivate,
      status: isNowPrivate ? "draft" : "published",
    };
    saveCustomInvention(updated);
    loadData();
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl md:text-2xl font-black text-stone-900">
                    {profile.name}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    {activeTab === "inventor" ? "発明家会員" : "一般会員"}
                  </span>
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
                {myInventions.map((inv) => {
                  const isCustom = inv.id.startsWith("inv-custom");
                  const imgUrl = inv.primaryImageUrl || inv.thumbnailUrl || "";
                  const catchText = inv.catchphrase || inv.tagline || "";

                  return (
                    <div
                      key={inv.id}
                      className="border border-stone-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-amber-300 transition bg-stone-50/50"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <img
                          src={imgUrl}
                          alt={inv.title}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            {inv.isPrivate ? (
                              <span className="text-[11px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                非公開下書き（特許保護）
                              </span>
                            ) : (
                              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                公開中
                              </span>
                            )}
                            <span className="text-xs text-stone-400">
                              {inv.category}
                            </span>
                            {isCustom && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.2 rounded">
                                新規登録
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

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-200">
                        <div className="text-right text-xs mr-2">
                          <p className="font-bold text-stone-700">{inv.pageViews || 1} views</p>
                          <p className="text-[11px] text-amber-700 font-bold">{inv.wantsCount || 1} 欲しい</p>
                        </div>

                        {/* 公開/非公開切り替え */}
                        {isCustom && (
                          <button
                            onClick={() => handleTogglePrivacy(inv)}
                            className="text-xs text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                            title={inv.isPrivate ? "一般公開に変更" : "非公開下書きに変更"}
                          >
                            {inv.isPrivate ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            <span className="hidden lg:inline">{inv.isPrivate ? "公開する" : "非公開にする"}</span>
                          </button>
                        )}

                        {/* 削除 */}
                        {isCustom && (
                          <button
                            onClick={() => handleDeleteInvention(inv.id, inv.title)}
                            className="text-xs text-rose-600 hover:text-rose-800 bg-white border border-stone-200 hover:border-rose-300 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <Link
                          href={`/inventions/${inv.id}`}
                          className="text-xs font-bold text-stone-700 hover:text-amber-700 bg-white border border-stone-200 hover:border-amber-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs whitespace-nowrap"
                        >
                          <span>ページを見る</span>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <div className="mb-6">
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  お気に入り・「欲しい」した発明品 ({favoriteInventions.length}件)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  あなたが応援している発明品です。商品化の進捗などが通知されます。
                </p>
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

      {/* プロフィール編集モーダル */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-stone-900">プロフィール編集</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
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

      <Footer />
    </div>
  );
}
