"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  RefreshCw, 
  LayoutTemplate, 
  ChevronRight,
  Lightbulb,
  FileText,
  Wrench,
  ThumbsUp,
  Layers,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Mic,
  Edit3,
  ShieldAlert,
  Share2,
  Printer,
  Check,
  X
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "ai" | "inventor";
  text: string;
  suggestedAnswers?: string[];
  requiresImageUpload?: boolean;
}

export default function RegisterInventionPage() {
  const [step, setStep] = useState<"interview" | "analyzing" | "preview" | "complete">("interview");

  // 法的保護：未出願時の警告モーダル
  const [showPatentWarningModal, setShowPatentWarningModal] = useState(false);
  const [patentAgreed, setPatentAgreed] = useState(false);
  const [isPrivateArchiveMode, setIsPrivateArchiveMode] = useState(false);

  // 発明家が話した生の入力データ
  const [inventorAnswers, setInventorAnswers] = useState<{
    titleOrTopic: string;
    motivation: string;
    uniqueness: string;
    statusAndWish: string;
    uploadedPhotoUrl?: string;
  }>({
    titleOrTopic: "",
    motivation: "",
    uniqueness: "",
    statusAndWish: "",
    uploadedPhotoUrl: ""
  });
  
  // チャットメッセージ履歴
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "初めまして！発明ドットコムの専任AIアシスタントです。\n文章を書くのが苦手でも全く問題ありません。お茶を飲みながら話すような気軽な感覚でお答えくださいね。\n\nまず最初に、今回ご紹介いただける**発明品のお名前（仮の名前でもOK）**や、普段なんて呼んでいるか教えていただけますか？",
      suggestedAnswers: [
        "ペットボトルのキャップオープナー", 
        "雨の日の傘キャップ", 
        "手を汚さないぬか床かき混ぜ器",
        "まだ名前は決まっていません"
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [interviewStage, setInterviewStage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // インライン編集ステート（プレビュー画面）
  const [editableCatchphrase, setEditableCatchphrase] = useState("");
  const [editableSummary, setEditableSummary] = useState("");

  // 自動スクロール
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AIが対話から動的に生成した結果
  const [aiResult, setAiResult] = useState<{
    catchphrase: string;
    summary: string;
    category: string;
    extractedInsights: {
      label: string;
      value: string;
    }[];
    plannedSections: {
      type: string;
      title: string;
      reason: string;
      previewSnippet: string;
    }[];
    materials: string[];
    processes: string[];
  } | null>(null);

  // 写真選択のモック処理
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setUploadedImagePreview(fakeUrl);
      setInventorAnswers((prev) => ({ ...prev, uploadedPhotoUrl: fakeUrl }));

      // 写真アップロードのチャットを自動送信
      const photoMessage: ChatMessage = {
        id: `user-photo-${Date.now()}`,
        sender: "inventor",
        text: `📸 写真（${file.name}）をアップロードしました`
      };
      setMessages((prev) => [...prev, photoMessage]);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `写真を確認しました！実物の試作品があると説得力が全く違いますね。素晴らしいです！\n\n続いて、**使っている材質（木・樹脂・金属など）**や、**特許・実用新案の状況**について教えてください。`,
          suggestedAnswers: [
            "アルミと木製。特許取得済み。メーカーに量産してほしい",
            "シリコン素材。特許出願中。日用品メーカーと組みたい",
            "ステンレス製。実用新案あり。キッチン器具メーカー希望",
            "試作段階。特許なし（未出願）。作り方から相談したい"
          ]
        };
        setMessages((prev) => [...prev, reply]);
        setInterviewStage(4);
      }, 1000);
    }
  };

  // 送信処理（ユーザーの発言に応じて動的に深掘り）
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    // 特許未出願の文言が含まれている場合、法的警告をトリガー
    if (text.includes("未出願") || text.includes("特許なし") || text.includes("出願前")) {
      setShowPatentWarningModal(true);
    }

    // 発明家の返答を追加
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: `user-${Date.now()}`, sender: "inventor", text }
    ];
    setMessages(newMessages);
    setInputVal("");

    const currentStage = interviewStage;
    const nextStage = currentStage + 1;
    setInterviewStage(nextStage);

    // 蓄積
    if (currentStage === 0) setInventorAnswers((prev) => ({ ...prev, titleOrTopic: text }));
    if (currentStage === 1) setInventorAnswers((prev) => ({ ...prev, motivation: text }));
    if (currentStage === 2) setInventorAnswers((prev) => ({ ...prev, uniqueness: text }));
    if (currentStage >= 3) setInventorAnswers((prev) => ({ ...prev, statusAndWish: text }));

    // AI思考中
    setIsTyping(true);

    // /api/gemini/interview を呼び出し
    fetch("/api/gemini/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        step: nextStage,
        history: newMessages,
        inventionDraft: inventorAnswers,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsTyping(false);
        let aiReplyText = data.reply;
        let requiresImage = nextStage === 3;

        if (nextStage >= 5) {
          aiReplyText = `たくさんのお話を丁寧に聞かせていただき、本当にありがとうございました！\n\nお話しいただいた内容から、一般読者が「欲しい！」と応援したくなり、企業が「これは新商品になる！」と検討しやすい**最適なページ構成とキャッチコピー**をAIが自動組み立てします。少々お待ちください...`;
          setTimeout(() => {
            triggerAIAssembly();
          }, 1200);
        }

        const aiReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiReplyText,
          requiresImageUpload: requiresImage,
          suggestedAnswers: nextStage === 1 ? [
            "妻が手首の関節痛でフタを開けられなくて困っていた",
            "雨の日に床が濡れて生徒が滑って転んだのを見て",
            "自分自身が毎日の作業で不便を感じていたから",
            "冬場の冷たい水仕事で手荒れがひどかったため"
          ] : nextStage === 2 ? [
            "市販のゴム製は滑るが、テコの原理と独自の爪で軽く回るようにした",
            "シリコンの柔軟性を活かして、どんな太さの傘にも合うようにした",
            "何十回も削り直して、手のひらに馴染む形にたどり着いた",
            "平型スクリュー形状で、手を汚さず奥から空気を送れるようにした"
          ] : nextStage === 3 ? [
            "写真は後で登録する（次へ進む）",
            "手元に写真がないのでスキップ"
          ] : [
            "アルミと木製。特許取得済み。メーカーに量産してほしい",
            "シリコン素材。特許出願中。日用品メーカーと組みたい",
            "ステンレス製。実用新案あり。キッチン器具メーカー希望",
            "手作り試作段階。特許なし。作り方から相談したい"
          ],
        };

        setMessages((prev) => [...prev, aiReply]);
      })
      .catch(() => {
        setIsTyping(false);
        const fallbackReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "お聞かせいただきありがとうございます！そのこだわりが一番の魅力ですね。続いて使っている材質や特許の状況を教えてください。",
        };
        setMessages((prev) => [...prev, fallbackReply]);
      });
  };

  // ページ構成の自動組み立て処理
  const triggerAIAssembly = () => {
    setStep("analyzing");

    setTimeout(() => {
      const topic = inventorAnswers.titleOrTopic || "新しいアイデア発明";
      const motivation = inventorAnswers.motivation || "身近な人の日常生活の不便を解消したいという思い";
      const uniqueness = inventorAnswers.uniqueness || "独自のテコ・カム機構による軽快な操作性";
      const statusWish = inventorAnswers.statusAndWish || "特許出願検討中・メーカー様との共同商品化希望";

      let guessedCategory = "日用品・生活雑貨";
      let guessedMaterials = ["アルミニウム", "天然木", "シリコン"];
      let guessedProcesses = ["CNC切削", "射出成形", "金型"];

      if (topic.includes("傘") || motivation.includes("傘") || motivation.includes("雨")) {
        guessedCategory = "日用品・雨具";
        guessedMaterials = ["シリコン", "エラストマー"];
        guessedProcesses = ["射出成形", "金型成形"];
      } else if (topic.includes("ぬか") || motivation.includes("料理") || motivation.includes("キッチン")) {
        guessedCategory = "キッチン・調理";
        guessedMaterials = ["ステンレス", "ポリプロピレン"];
        guessedProcesses = ["板金加工", "射出成形"];
      } else if (topic.includes("オープナー") || topic.includes("キャップ") || motivation.includes("関節")) {
        guessedCategory = "シニア・介護";
        guessedMaterials = ["アルミニウム合金", "天然木"];
        guessedProcesses = ["CNC切削", "旋盤加工", "木工加工"];
      }

      const cp = `「${motivation.slice(0, 25)}…」から生まれた、${topic}の決定版`;
      const sm = `${motivation}という切実な日常の課題を解決するために考案された発明。${uniqueness}を取り入れることで、従来品にはない使いやすさと安全性を実現しています。`;

      setEditableCatchphrase(cp);
      setEditableSummary(sm);

      setAiResult({
        catchphrase: cp,
        summary: sm,
        category: guessedCategory,
        extractedInsights: [
          { label: "原点となるお困りごと", value: motivation },
          { label: "独自の技術的アプローチ", value: uniqueness },
          { label: "権利・商品化の希望", value: statusWish },
          { label: "AIが評価した強み", value: "ニッチながら切実な需要があり、クラウドファンディングやTVメディアでの反響が期待できます。" }
        ],
        plannedSections: [
          {
            type: "Before / After 解決図解",
            title: `これまでの悩みと『${topic}』での劇的変化`,
            reason: "「開けられない・痛い」という日常の痛みを一般読者に共感してもらい、解決の価値を即座に伝えるため",
            previewSnippet: `従来の困りごと（${motivation.slice(0, 18)}…）に対し、独自の工夫（${uniqueness.slice(0, 18)}…）でワンタッチ解決`
          },
          {
            type: "技術メカニズム解説",
            title: "なぜ誰でも簡単に使えるのか？ 考案した独自構造",
            reason: "技術的な説得力を持たせ、製造会社や量産メーカーが新商品として採算性を計算しやすくするため",
            previewSnippet: `力学の原理と素材の弾性を組み合わせ、最小限の力で最大の効果を生む機構設計`
          },
          {
            type: "開発秘話・人間ドラマ",
            title: "試作を重ねてたどり着いた — 開発の舞台裏ストーリー",
            reason: "単なるスペック紹介ではなく「発明家の想い」を伝えることで、一般ユーザーからの「欲しい！応援したい！」投票を爆発的に増やすため",
            previewSnippet: `何度も失敗を重ねながら、使う人の笑顔を思い浮かべて削り直した情熱の記録`
          },
          {
            type: "想定利用シーン",
            title: "こんな方・こんな現場で喜ばれています",
            reason: "一般家庭だけでなく、学校・介護施設・オフィスなど市場の広がりを企業にアピールするため",
            previewSnippet: `シニア世代の自立支援から、忙しい現役世代のプチストレス解消まで幅広いシーンに対応`
          }
        ],
        materials: guessedMaterials,
        processes: guessedProcesses
      });

      setStep("preview");
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
        {/* ステップバー */}
        <div className="flex items-center justify-between mb-6 px-4 text-xs md:text-sm font-bold text-stone-500">
          <div className={`flex items-center gap-1.5 ${step === "interview" ? "text-amber-800 font-black" : "text-stone-700"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "interview" ? "bg-amber-600 text-white font-bold" : "bg-amber-100 text-amber-950"}`}>1</span>
            <span>AI聞き取り対話</span>
          </div>
          <div className="h-0.5 w-12 bg-stone-200" />
          <div className={`flex items-center gap-1.5 ${step === "preview" ? "text-amber-800 font-black" : ""}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "preview" ? "bg-amber-600 text-white font-bold" : "bg-stone-200 text-stone-700"}`}>2</span>
            <span>AIページ構成プランの確認</span>
          </div>
          <div className="h-0.5 w-12 bg-stone-200" />
          <div className={`flex items-center gap-1.5 ${step === "complete" ? "text-amber-800 font-black" : ""}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "complete" ? "bg-amber-600 text-white font-bold" : "bg-stone-200 text-stone-700"}`}>3</span>
            <span>公開完了</span>
          </div>
        </div>

        {/* STEP 1: 対話型AIインタビュー */}
        {step === "interview" && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
            {/* チャットヘッダー */}
            <div className="p-4 md:p-5 border-b border-stone-200 bg-amber-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-stone-900 text-sm md:text-base flex items-center gap-2">
                    発明聞き取りAIアシスタント
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      無料サポート中
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    質問に答えるだけで、AIが魅力を整理し最適なページ構成を自動デザインします
                  </p>
                </div>
              </div>

              {/* 手動スキップ・分析ボタン */}
              {messages.length >= 3 && (
                <button
                  onClick={triggerAIAssembly}
                  className="text-xs md:text-sm bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 shadow-2xs"
                >
                  <span>ここまでの内容で構成を作る</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* メッセージ表示エリア */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-stone-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === "inventor" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl space-y-2 ${m.sender === "inventor" ? "text-right" : "text-left"}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                        m.sender === "inventor"
                          ? "bg-amber-600 text-white font-medium rounded-tr-none shadow-xs text-left"
                          : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-none shadow-xs"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* 写真アップロードボタン（チャット内） */}
                    {m.requiresImageUpload && (
                      <div className="pt-2 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-left">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                          <ImageIcon className="w-4 h-4 text-amber-600" />
                          試作品やスケッチの写真を送る（任意）
                        </span>
                        <label className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition shadow-2xs">
                          <Upload className="w-4 h-4" />
                          <span>スマホやパソコンから写真を選択</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* AIからの回答候補ボタン */}
                    {m.suggestedAnswers && m.suggestedAnswers.length > 0 && m.id === messages[messages.length - 1].id && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        <span className="text-xs text-stone-500 font-bold w-full block text-left">
                          💡 タップしてかんたん回答：
                        </span>
                        {m.suggestedAnswers.map((ans, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(ans)}
                            className="text-left text-xs md:text-sm bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200 py-1.5 px-3 rounded-xl transition font-medium"
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center text-stone-500 text-xs md:text-sm py-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-stone-200 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                    <span>AIが言葉を整理しています...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* メッセージ入力欄 */}
            <div className="p-3 md:p-4 bg-white border-t border-stone-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="ご自身の言葉で自由に入力してください（音声入力もOK）"
                  className="flex-1 px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs md:text-sm bg-stone-50/40"
                />
                <button
                  type="button"
                  onClick={() => alert("マイクに向かってお話しください（Web Speech API連携）")}
                  title="音声で入力"
                  className="p-3 rounded-2xl border border-stone-300 hover:bg-stone-100 text-stone-600 transition"
                >
                  <Mic className="w-5 h-5 text-amber-600" />
                </button>
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white p-3 rounded-2xl shadow-sm transition shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-xs text-stone-400 mt-2 text-center">
                ※ 音声入力や箇条書き、誤字脱字があってもAIが意図を汲み取りますのでご安心ください。
              </p>
            </div>
          </div>
        )}

        {/* AI分析・構成中のアニメーション */}
        {step === "analyzing" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-xs my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-2">
              お話しいただいた内容をAIが整理・分析しています...
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              散らばった想いやエピソードから本質を抽出し、「どういう見せ方をすれば一番伝わるか」のページ構成とキャッチコピーをデザインしています。
            </p>
          </div>
        )}

        {/* STEP 2: AIによる分析結果とページ構成の確認（インライン編集機能付き） */}
        {step === "preview" && aiResult && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs md:text-sm uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>STEP 2 / AIの聞き取り・ページ構成結果</span>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                無料掲載プラン
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs md:text-sm text-amber-950 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>「あなたのお話から、以下の魅力と構成を引き出しました！」</strong><br />
                AIが提案したキャッチコピーや文章は、下の入力欄でご自身で手直しすることも可能です。
              </div>
            </div>

            {/* アップロードされた写真プレビュー */}
            {uploadedImagePreview && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-4">
                <img src={uploadedImagePreview} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-stone-300" />
                <div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    写真が登録されました
                  </span>
                  <p className="text-xs text-stone-500 mt-1">メイン画像としてページ最上部に掲載されます</p>
                </div>
              </div>
            )}

            {/* キャッチコピー（インライン編集可能） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs md:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  キャッチコピー（編集できます）
                </span>
              </div>
              <input
                type="text"
                value={editableCatchphrase}
                onChange={(e) => setEditableCatchphrase(e.target.value)}
                className="w-full p-3.5 bg-amber-50/50 rounded-xl border border-amber-300 font-black text-stone-900 text-sm md:text-base focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 概要要約（インライン編集可能） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs md:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  概要ストーリー（編集できます）
                </span>
              </div>
              <textarea
                rows={3}
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                className="w-full p-3.5 bg-white rounded-xl border border-stone-300 text-xs md:text-sm text-stone-800 leading-relaxed focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* AIが自動設計したページ構成セクション一覧 */}
            <div>
              <span className="text-xs md:text-sm font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                <LayoutTemplate className="w-4 h-4 text-amber-600" />
                <span>AIが決定したページの構成・提示フォーマット</span>
              </span>
              <div className="space-y-3">
                {aiResult.plannedSections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs md:text-sm font-bold text-stone-900">{sec.title}</span>
                        <span className="text-[11px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-semibold">
                          {sec.type}
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 mt-1 font-medium">
                        💡 <strong>AIの構成意図:</strong> {sec.reason}
                      </p>
                      <p className="text-xs text-stone-600 mt-1.5 bg-white p-2.5 rounded-xl border border-stone-200">
                        📄 <strong>掲載プレビュー抜粋:</strong> {sec.previewSnippet}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep("interview")}
                className="w-1/3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold py-3.5 rounded-2xl transition text-xs md:text-sm"
              >
                チャットに戻る
              </button>
              <button
                type="button"
                onClick={() => setStep("complete")}
                className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>この構成で公開する（無料）</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 完了画面（家族共有・印刷機能付き） */}
        {step === "complete" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 md:p-12 text-center shadow-xs my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">
              発明の掲載が完了しました！
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
              AIとの対話から生まれた魅力的な構成で、あなたの生涯の発明が永久アーカイブに保存されました。
            </p>

            {/* 家族や近所への共有ボタン */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-md mx-auto mb-6 text-left">
              <span className="font-bold text-xs text-amber-950 block mb-2">
                🎉 ご家族やお友達に知らせてみましょう
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard?.writeText(window.location.origin + "/inventions/inno-01");
                      alert("ページのURLをコピーしました！LINEやメールに貼り付けてご家族に送れます。");
                    }
                  }}
                  className="flex-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>LINE・メール用URLをコピー</span>
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") window.print();
                  }}
                  className="bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>印刷する</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/inventions/inno-01"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow transition text-xs md:text-sm"
              >
                完成した公開ページを見る
              </Link>
              <Link
                href="/mypage"
                className="border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold px-6 py-3.5 rounded-2xl transition text-xs md:text-sm"
              >
                マイページへ戻る
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* 法的ガードレール：特許未出願・新規性喪失警告モーダル */}
      {showPatentWarningModal && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-2 border-amber-500 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-amber-700" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  特許法第29条に基づく重要確認
                </span>
                <h3 className="text-base md:text-lg font-black text-stone-900">
                  特許未出願のアイデアに関するご注意
                </h3>
              </div>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs md:text-sm text-stone-800 space-y-2 leading-relaxed">
              <p>
                日本の特許法では、特許を出願する前にインターネット上で仕組みを一般公開してしまうと、<strong>「公然知られた発明（新規性の喪失）」</strong>となり、<strong>後から特許や実用新案が取得できなくなります</strong>。
              </p>
              <p className="text-amber-900 font-bold">
                ※ 他社にアイデアを模倣されても権利を主張できなくなる恐れがあります。
              </p>
            </div>

            <div className="my-5 space-y-3 text-xs md:text-sm">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patentAgreed}
                  onChange={(e) => setPatentAgreed(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 mt-0.5"
                />
                <span className="text-stone-700 leading-snug">
                  新規性喪失のリスクを理解した上で、発明の紹介ページを公開します。
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivateArchiveMode}
                  onChange={(e) => setIsPrivateArchiveMode(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 mt-0.5"
                />
                <span className="text-stone-700 leading-snug">
                  （推奨）特許出願の準備ができるまで、一般公開せず<strong>「非公開下書き（タイムスタンプ付き自分用アーカイブ）」</strong>として保管する。
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                disabled={!patentAgreed && !isPrivateArchiveMode}
                onClick={() => setShowPatentWarningModal(false)}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold py-3 rounded-2xl text-xs md:text-sm transition"
              >
                理解して対話を続ける
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}