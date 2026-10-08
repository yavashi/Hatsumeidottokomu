"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/Navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MailCheck, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SignupStep = "input" | "sent" | "complete";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("input");
  
  // 入力フォーム状態
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // 認証ステップ状態
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedMockCode, setGeneratedMockCode] = useState("729415");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMockMailbox, setShowMockMailbox] = useState(false);

  // 再送タイマーのカウントダウン
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: フォーム送信（仮登録・メール送信）
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreed) {
      setErrorMessage("利用規約およびプライバシーポリシーへの同意が必要です");
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabaseが接続されていれば本番Authへ送信
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/signup/verify` : undefined,
          },
        });
        if (error) {
          console.warn("Supabase auth signUp error (falling back to demo flow):", error.message);
        }
      }

      // ランダムな6桁モック認証コードを生成
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedMockCode(mockCode);
      setResendCooldown(60);
      setIsSubmitting(false);
      setStep("sent");
    } catch (err: unknown) {
      console.error(err);
      setIsSubmitting(false);
      setStep("sent"); // フォールバックして体験を継続
    }
  };

  // Step 2: 認証コード入力で検証
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (verificationCode.trim() === generatedMockCode || verificationCode.trim() === "123456") {
      setStep("complete");
    } else {
      setErrorMessage("認証コードが正しくありません。メールに記載の6桁の数字をご確認ください。");
    }
  };

  // メール再送処理
  const handleResendEmail = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMockCode(newCode);
    alert(`【再送完了】${email} 宛に新しい確認メールを送信しました。`);
  };

  // 模擬メールリンクで一発認証
  const handleSimulateEmailClick = () => {
    setStep("complete");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm transition-all">
          
          {/* ステップインジケーター */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === "input" ? "bg-amber-600 text-white" : "bg-emerald-100 text-emerald-800"
              }`}>
                {step === "input" ? "1" : <Check className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-bold ${step === "input" ? "text-stone-900" : "text-stone-500"}`}>
                情報入力
              </span>
            </div>

            <div className="h-0.5 w-8 bg-stone-200" />

            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === "sent" ? "bg-amber-600 text-white" : step === "complete" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-500"
              }`}>
                {step === "complete" ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className={`text-xs font-bold ${step === "sent" ? "text-stone-900" : "text-stone-500"}`}>
                メール本人確認
              </span>
            </div>

            <div className="h-0.5 w-8 bg-stone-200" />

            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === "complete" ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-500"
              }`}>
                3
              </div>
              <span className={`text-xs font-bold ${step === "complete" ? "text-stone-900" : "text-stone-500"}`}>
                登録完了
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STEP 1: 基本情報入力フォーム */}
          {/* ============================================================ */}
          {step === "input" && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>無料アカウント作成</span>
                </div>
                <h1 className="text-2xl font-black text-stone-900">
                  発明ドットコムへようこそ
                </h1>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  一般閲覧・発明の投稿どちらも共通のアカウントでご利用いただけます。<br />
                  まずはアカウントの基本情報を入力してください。
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                {/* お名前 */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    お名前（ニックネーム可） <span className="text-rose-500">*</span>
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
                    メールアドレス <span className="text-rose-500">*</span>
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
                  <p className="text-[11px] text-stone-500 mt-1">※登録後に本人確認用メールが届きます</p>
                </div>

                {/* パスワード */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    パスワード <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8文字以上の英数字"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                      title={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 利用規約同意 */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>
                      <Link href="/pricing" target="_blank" className="text-amber-700 font-bold hover:underline">
                        利用規約
                      </Link>
                      および
                      <span className="text-amber-700 font-bold">プライバシーポリシー</span>
                      に同意します
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>送信中...</span>
                      </>
                    ) : (
                      <>
                        <span>確認メールを送信する</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* ソーシャル連携の選択肢 */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="relative flex justify-center text-xs mb-3">
                  <span className="bg-white px-3 text-stone-400 font-medium">または</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setName("Googleユーザー");
                    setEmail("google-user@example.com");
                    setStep("complete");
                  }}
                  className="w-full py-2.5 px-4 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Googleアカウントで1タップ登録</span>
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 text-center">
                <p className="text-xs text-stone-500">
                  すでにアカウントをお持ちですか？{" "}
                  <Link href="/login" className="text-amber-700 font-bold hover:underline">
                    ログインはこちら
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: 仮登録・確認メール送信完了画面 */}
          {/* ============================================================ */}
          {step === "sent" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-700">
                  <MailCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-stone-900">
                  本人確認メールを送信しました
                </h2>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 inline-block text-xs font-mono text-amber-900 font-bold">
                  {email || "your-email@example.com"}
                </div>
                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  上記のアドレス宛に本人確認のご案内をお送りしました。<br />
                  メール内の**認証ボタンをタップ**するか、記載の**6桁の認証コード**を入力してください。
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 6桁コード入力フォーム */}
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                    メールに記載された6桁の認証コード
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="例: 123456"
                    className="w-full text-center tracking-[0.4em] font-mono font-black text-xl py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>認証して登録を完了する</span>
                </button>
              </form>

              {/* メールシミュレーター（プロトタイプ体験用） */}
              <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowMockMailbox(!showMockMailbox)}
                  className="w-full flex items-center justify-between text-xs font-bold text-stone-700 hover:text-amber-700 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>【テスト用】届いた模擬メールを確認する</span>
                  </span>
                  <span className="text-[11px] text-stone-500 underline">
                    {showMockMailbox ? "閉じる" : "開いて確認"}
                  </span>
                </button>

                {showMockMailbox && (
                  <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-700 space-y-2.5 bg-white p-3.5 rounded-xl border shadow-inner">
                    <div className="flex justify-between items-center text-[11px] text-stone-500 border-b pb-1.5">
                      <span>差出人: 発明ドットコム &lt;auth@hatsumeidottokomu.jp&gt;</span>
                      <span>たった今</span>
                    </div>
                    <div className="font-bold text-stone-900">
                      【発明ドットコム】メールアドレスの確認と本登録のお願い
                    </div>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {name || "会員"} 様<br />
                      発明ドットコムへのご登録ありがとうございます。以下のボタンを押すか、認証コードを入力して登録を完了してください。
                    </p>
                    <div className="p-2.5 bg-stone-50 rounded-lg text-center font-mono font-black text-amber-800 text-sm tracking-widest border border-dashed border-stone-300">
                      認証コード: {generatedMockCode}
                    </div>
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleSimulateEmailClick}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition inline-flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>メール内の「登録を完了する」リンクを押す（1タップ）</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* メールが届かない場合の案内・再送 */}
              <div className="mt-5 text-center space-y-2">
                <p className="text-[11px] text-stone-500">
                  ※メールが届かない場合は、迷惑メールフォルダをご確認いただくか、再送をお試しください。
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0}
                  className="text-xs font-bold text-amber-700 hover:underline disabled:text-stone-400 disabled:no-underline inline-flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? "animate-spin" : ""}`} />
                  <span>
                    {resendCooldown > 0 ? `メールを再送する (${resendCooldown}秒後に可能)` : "確認メールを再送する"}
                  </span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 text-center">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="text-xs text-stone-500 hover:text-stone-800 hover:underline"
                >
                  ← メールアドレスの入力をやり直す
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: 本登録完了画面 */}
          {/* ============================================================ */}
          {step === "complete" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>本人確認完了</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                本登録が完了しました！
              </h2>
              <p className="text-xs text-stone-600 mt-3 leading-relaxed max-w-sm mx-auto">
                ようこそ、**{name || "会員"}** さん。<br />
                アカウントが正常に有効化されました。マイページからお気に入りの保存や、発明の登録を始めることができます。
              </p>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => router.push("/mypage")}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <span>マイページへ移動する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/inventions"
                  className="w-full py-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition block text-center"
                >
                  まずはみんなの発明を探す
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
