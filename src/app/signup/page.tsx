"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/Navigation";
import { User, Mail, Lock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // モック登録処理：マイページへ遷移
    router.push("/mypage");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>無料アカウント作成</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">
              発明ドットコムへようこそ
            </h1>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              まずはアカウントを作成して、お気に入りの保存や発明の応援をはじめましょう。<br />
              発明品の登録や出品は、あとからマイページでいつでも行えます。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* お名前 */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                お名前（ニックネーム可）
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：山田 太郎 / 発明パパ"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                />
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                パスワード
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8文字以上の英数字"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <span>アカウントを作成してマイページへ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              すでにアカウントをお持ちですか？{" "}
              <Link href="/login" className="text-amber-700 font-bold hover:underline">
                ログインはこちら
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
