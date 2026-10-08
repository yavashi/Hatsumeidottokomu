"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Lightbulb, 
  PlusCircle, 
  Search, 
  User, 
  Trophy, 
  ShoppingBag, 
  Wrench, 
  Mail, 
  CheckCircle2
} from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-amber-200/60 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-200 transition group-hover:scale-105">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-stone-900 flex items-center gap-1.5">
              発明ドットコム
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                公式ポータル
              </span>
            </span>
            <p className="text-[10px] text-stone-500 font-medium leading-none">世の中のユニークな発明と出会える場所</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/inventions"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-amber-50"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">発明を探す</span>
          </Link>

          <Link
            href="/rankings"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-amber-50"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>ランキング</span>
          </Link>

          <Link
            href="/shop"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-amber-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
            <span>ショップ</span>
          </Link>

          <Link
            href="/experts"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-amber-50"
          >
            <Wrench className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden lg:inline">専門家・試作</span>
          </Link>

          <Link
            href="/pricing"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition hidden sm:flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-amber-50"
          >
            <span>料金プラン</span>
          </Link>

          {/* マイページ */}
          <Link
            href="/mypage"
            className="text-stone-700 hover:text-amber-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-amber-50 border border-stone-200"
          >
            <User className="w-4 h-4 text-amber-600" />
            <span>マイページ</span>
          </Link>

          {/* 会員登録 */}
          <Link
            href="/signup"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">会員登録</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="border-t border-stone-200 bg-stone-900 py-12 text-stone-300 text-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        
        {/* メールマガジン登録セクション */}
        <div className="bg-stone-800/90 border border-stone-700/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>公式メールマガジン（週1回・無料）</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              注目の新着発明＆商品化レポートをお届け
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              今週の「欲しい！」急上昇ランキングや、全国の町工場による試作開発秘話、特許取得のノウハウを毎週月曜日に配信しています。
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 px-5 py-3 rounded-2xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>メルマガ登録が完了しました！次号よりお届けします。</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="メールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition whitespace-nowrap"
                >
                  登録する
                </button>
              </form>
            )}
          </div>
        </div>

        {/* リンク集とクレジット */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                発
              </div>
              <span className="font-extrabold text-white text-base">発明ドットコム</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              知恵と情熱を注いだ作品が集まる公開ポータル。一般の方の「欲しい！」を可視化し、商品化を目指す企業とつなぎます。
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white mb-2">サービスを探す</div>
            <div><Link href="/inventions" className="hover:text-amber-400 transition">発明品を探す</Link></div>
            <div><Link href="/rankings" className="hover:text-amber-400 transition">ランキング・アワード</Link></div>
            <div><Link href="/shop" className="hover:text-amber-400 transition">直販ショップ（手作り・試作）</Link></div>
            <div><Link href="/inventors" className="hover:text-amber-400 transition">注目の発明家たち</Link></div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white mb-2">発明家向けツール</div>
            <div><Link href="/mypage/tools/print-kit" className="hover:text-amber-400 transition">チラシ・名刺AI印刷キット</Link></div>
            <div><Link href="/mypage/tools/sns-automation" className="hover:text-amber-400 transition">SNS簡単・自動ポスト設定</Link></div>
            <div><Link href="/experts" className="hover:text-amber-400 transition">試作屋・弁理士パートナー</Link></div>
            <div><Link href="/mypage/settings/notifications" className="hover:text-amber-400 transition">通知設定（欲しい通知）</Link></div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white mb-2">アカウント・法務</div>
            <div><Link href="/pricing" className="hover:text-amber-400 transition">料金プラン・永久アーカイブ</Link></div>
            <div><Link href="/signup" className="hover:text-amber-400 text-amber-400 font-bold transition">無料会員登録</Link></div>
            <div><Link href="/mypage" className="hover:text-amber-400 transition">マイページ</Link></div>
            <div><Link href="/terms" className="hover:text-amber-400 transition">利用規約</Link></div>
            <div><Link href="/privacy" className="hover:text-amber-400 transition">プライバシーポリシー</Link></div>
            <div><Link href="/tokushoho" className="hover:text-amber-400 transition">特定商取引法に基づく表記</Link></div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} 発明ドットコム All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-stone-300 transition">利用規約</Link>
            <Link href="/privacy" className="hover:text-stone-300 transition">プライバシーポリシー</Link>
            <Link href="/tokushoho" className="hover:text-stone-300 transition">特定商取引法に基づく表記</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};