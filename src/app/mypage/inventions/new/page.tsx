"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Navigation";
import { 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  RefreshCw, 
  LayoutTemplate, 
  Upload, 
  Image as ImageIcon, 
  Mic, 
  Edit3, 
  ShieldAlert, 
  Share2, 
  Printer, 
  Camera,
  ChevronRight,
  FileText,
  Trash2
} from "lucide-react";
import { saveCustomInvention } from "@/lib/storage";
import { Invention } from "@/types";

interface ChatMessage {
  id: string;
  sender: "ai" | "inventor";
  text: string;
  suggestedAnswers?: string[];
  requiresImageUpload?: boolean;
}

let messageSeq = 0;
function createMessageId(prefix: string): string {
  messageSeq += 1;
  return `${prefix}-${messageSeq}`;
}

export default function RegisterInventionPage() {
  const [step, setStep] = useState<"interview" | "analyzing" | "preview" | "complete">("interview");
  const [createdInventionId, setCreatedInventionId] = useState<string>("inno-01");

  // 登録モード：「AI対話」または「手入力（AIなし）」
  const [registrationMode, setRegistrationMode] = useState<"ai" | "manual">("ai");

  // 法的保護：未出願時の警告モーダル
  const [showPatentWarningModal, setShowPatentWarningModal] = useState(false);
  const [patentAgreed, setPatentAgreed] = useState(false);
  const [isPrivateArchiveMode, setIsPrivateArchiveMode] = useState(false);

  // 手入力フォームデータ（AIを使わないモード用）
  const [manualForm, setManualForm] = useState({
    title: "",
    catchphrase: "",
    category: "日用品・生活雑貨",
    motivation: "",
    uniqueness: "",
    story: "",
    status: "手作り試作あり",
    patentStatus: "未出願（特許なし）",
    materials: "天然木、アルミ、手作り部材",
    uploadedPhotoUrl: "",
  });

  // 発明家が話した生の入力データ（AI対話用）
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

  // 音声入力ステート & Web Speech API
  const [isRecording, setIsRecording] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const handleToggleVoiceInput = (targetField?: string) => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("お使いのブラウザは音声認識に対応していません。キーボードまたはスマホの音声入力機能をお試しください。");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setActiveVoiceField(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setActiveVoiceField(targetField || "chat");
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          if (!targetField || targetField === "chat") {
            setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
          } else {
            // 手入力フォームの特定フィールドに反映
            setManualForm((prev) => {
              const currentVal = (prev as Record<string, string>)[targetField] || "";
              return {
                ...prev,
                [targetField]: currentVal ? `${currentVal} ${transcript}` : transcript,
              };
            });
          }
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setActiveVoiceField(null);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setActiveVoiceField(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
      setActiveVoiceField(null);
    }
  };

  // 手入力モード：写真選択処理（Base64 Data URL変換）
  const handleManualPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setManualForm((prev) => ({ ...prev, uploadedPhotoUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 手入力モード：プレビュー確認への遷移（AI不使用）
  const handleManualPreview = () => {
    if (!manualForm.title.trim()) {
      alert("「発明品のお名前」をご入力ください。");
      return;
    }
    if (!manualForm.motivation.trim() && !manualForm.uniqueness.trim()) {
      alert("「どんなことで困っていましたか？」または「工夫した点・仕組み」のいずれかをご入力ください。");
      return;
    }

    // 特許未出願かつ一般公開の場合の警告チェック
    if (manualForm.patentStatus.includes("未出願") && !patentAgreed && !isPrivateArchiveMode) {
      setShowPatentWarningModal(true);
    }

    const defaultCp = manualForm.catchphrase.trim() || `日々の困りごとを解決する、${manualForm.title}`;
    const defaultSm = manualForm.motivation.trim() 
      ? `${manualForm.motivation}という悩みを解決するために工夫した発明。${manualForm.uniqueness}` 
      : manualForm.uniqueness || "使いやすさと温もりを追求した手作りの発明品です。";

    setEditableCatchphrase(defaultCp);
    setEditableSummary(defaultSm);

    const manualSections = [
      {
        type: "開発のきっかけ・お困りごと",
        title: "なぜこれを作ろうと思ったのか",
        reason: "ご自身が体験された困りごとや、誰かのために解決したかった想いを伝えます",
        previewSnippet: manualForm.motivation || "（未記入）",
      },
      {
        type: "独自の工夫・解決の仕組み",
        title: "使いやすさのための工夫とこだわり",
        reason: "従来品と何が違うのか、どのような仕組みで便利になるのかを伝えます",
        previewSnippet: manualForm.uniqueness || "（未記入）",
      },
      ...(manualForm.story.trim() ? [{
        type: "誕生秘話・試行錯誤のエピソード",
        title: "完成までの道のりと苦労",
        reason: "試作を重ねてたどり着いたエピソードをご自身の言葉のまま掲載します",
        previewSnippet: manualForm.story,
      }] : []),
      {
        type: "材料・使用技術",
        title: "使っている材質・構造",
        reason: "手作り部品や素材の情報をわかりやすく整理します",
        previewSnippet: manualForm.materials || "手作り試作パーツ",
      }
    ];

    setAiResult({
      catchphrase: defaultCp,
      summary: defaultSm,
      category: manualForm.category,
      extractedInsights: [
        { label: "原点となるお困りごと", value: manualForm.motivation || "（ご自身で記述）" },
        { label: "独自の技術的アプローチ", value: manualForm.uniqueness || "（ご自身で記述）" },
        { label: "権利・商品化の状況", value: `${manualForm.status} / ${manualForm.patentStatus}` },
        { label: "手入力による安心掲載", value: "AIによる自動変更を行わず、ご本人の言葉のまま丁寧に保管・掲載されます。" }
      ],
      plannedSections: manualSections,
      materials: manualForm.materials ? manualForm.materials.split(/[、,\s]+/).filter(Boolean) : ["手作り部品"],
      processes: ["手作業加工", "試作検証"]
    });

    setStep("preview");
  };

  // 写真選択の処理（リロード後も消えないBase64 Data URLへ変換）
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImagePreview(dataUrl);
        setInventorAnswers((prev) => ({ ...prev, uploadedPhotoUrl: dataUrl }));

        // 写真アップロードのチャットを自動送信
        const photoMessage: ChatMessage = {
          id: createMessageId("user-photo"),
          sender: "inventor",
          text: `📸 写真（${file.name}）をアップロードしました`
        };
        setMessages((prev) => [...prev, photoMessage]);

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const reply: ChatMessage = {
            id: createMessageId("ai"),
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
      };
      reader.readAsDataURL(file);
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
      { id: createMessageId("user"), sender: "inventor", text }
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
        const requiresImage = nextStage === 3;

        if (nextStage >= 5) {
          aiReplyText = `たくさんのお話を丁寧に聞かせていただき、本当にありがとうございました！\n\nお話しいただいた内容から、一般読者が「欲しい！」と応援したくなり、企業が「これは新商品になる！」と検討しやすい**最適なページ構成とキャッチコピー**をAIが自動組み立てします。少々お待ちください...`;
          setTimeout(() => {
            triggerAIAssembly();
          }, 1200);
        }

        const aiReply: ChatMessage = {
          id: createMessageId("ai"),
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
          id: createMessageId("ai"),
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
        {/* 登録方式の選択タブ（シニア・AI非利用ユーザー向け安心切り替え） */}
        {step === "interview" && (
          <div className="mb-6 bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setRegistrationMode("ai")}
              className={`flex-1 p-3.5 rounded-xl text-left transition flex items-center gap-3 cursor-pointer ${
                registrationMode === "ai"
                  ? "bg-amber-600 text-white shadow-xs font-bold"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                registrationMode === "ai" ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-700"
              }`}>
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>AIとおしゃべりして登録</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    registrationMode === "ai" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900"
                  }`}>
                    おすすめ
                  </span>
                </div>
                <div className={`text-xs mt-0.5 truncate ${
                  registrationMode === "ai" ? "text-amber-100" : "text-stone-500"
                }`}>
                  質問に答えるだけ。AIが文章をまとめます
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRegistrationMode("manual")}
              className={`flex-1 p-3.5 rounded-xl text-left transition flex items-center gap-3 cursor-pointer ${
                registrationMode === "manual"
                  ? "bg-stone-800 text-white shadow-xs font-bold"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                registrationMode === "manual" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-700"
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>自分でじっくり手入力（AIを使わない）</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    registrationMode === "manual" ? "bg-stone-700 text-stone-200" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    シニア安心
                  </span>
                </div>
                <div className={`text-xs mt-0.5 truncate ${
                  registrationMode === "manual" ? "text-stone-300" : "text-stone-500"
                }`}>
                  申込み用紙のようにご自身の言葉のまま入力
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ステップバー */}
        <div className="flex items-center justify-between mb-6 px-4 text-xs md:text-sm font-bold text-stone-500">
          <div className={`flex items-center gap-1.5 ${step === "interview" ? "text-amber-800 font-black" : "text-stone-700"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "interview" ? "bg-amber-600 text-white font-bold" : "bg-amber-100 text-amber-950"}`}>1</span>
            <span>{registrationMode === "ai" ? "AI聞き取り対話" : "申込項目の手入力"}</span>
          </div>
          <div className="h-0.5 w-12 bg-stone-200" />
          <div className={`flex items-center gap-1.5 ${step === "preview" ? "text-amber-800 font-black" : ""}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "preview" ? "bg-amber-600 text-white font-bold" : "bg-stone-200 text-stone-700"}`}>2</span>
            <span>{registrationMode === "ai" ? "AIページ構成プランの確認" : "掲載内容の確認"}</span>
          </div>
          <div className="h-0.5 w-12 bg-stone-200" />
          <div className={`flex items-center gap-1.5 ${step === "complete" ? "text-amber-800 font-black" : ""}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === "complete" ? "bg-amber-600 text-white font-bold" : "bg-stone-200 text-stone-700"}`}>3</span>
            <span>公開完了</span>
          </div>
        </div>

        {/* STEP 1 (AIモード): 対話型AIインタビュー */}
        {step === "interview" && registrationMode === "ai" && (
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
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition shadow-2xs">
                            <Upload className="w-4 h-4" />
                            <span>写真アルバムから選ぶ</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoSelect}
                              className="hidden"
                            />
                          </label>
                          <label className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition shadow-2xs">
                            <Camera className="w-4 h-4" />
                            <span>スマホで今すぐ撮影</span>
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={handlePhotoSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
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
                  placeholder={isRecording ? "🎤 お話しください（聞いています...）" : "ご自身の言葉で自由に入力（マイクで音声入力もOK）"}
                  className={`flex-1 px-4 py-3 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/40 ${
                    isRecording ? "border-rose-400 bg-rose-50/30 text-rose-900" : "border-stone-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput()}
                  title={isRecording ? "音声入力を終了" : "音声で入力"}
                  className={`p-3 rounded-2xl border transition flex items-center gap-1 cursor-pointer ${
                    isRecording
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <Mic className={`w-5 h-5 ${isRecording ? "text-rose-600" : "text-amber-600"}`} />
                  {isRecording && <span className="text-xs text-rose-600 hidden sm:inline">録音中</span>}
                </button>
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-4 py-3 rounded-2xl shadow-sm transition shrink-0 flex items-center gap-1.5 font-bold text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>送信</span>
                </button>
              </form>
              <p className="text-xs text-stone-400 mt-2 text-center">
                ※ 音声入力や箇条書き、誤字脱字があってもAIが意図を汲み取りますのでご安心ください。
              </p>
            </div>
          </div>
        )}

        {/* STEP 1 (手入力モード): 自分でじっくり書く安心フォーム（AI不使用・シニア特化） */}
        {step === "interview" && registrationMode === "manual" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-8">
            {/* ヘッダー & 安心バナー */}
            <div className="border-b border-stone-200 pb-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-stone-800 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-stone-900 flex items-center gap-2">
                    発明品 登録申込書（手入力モード）
                    <span className="text-xs bg-stone-100 text-stone-700 font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                      AI不使用
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    ご自身の言葉のまま丁寧に保管・掲載されます
                  </p>
                </div>
              </div>

              {/* シニア安心宣言バナー */}
              <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-emerald-950 leading-relaxed">
                  <strong className="font-bold block text-emerald-900 mb-0.5">
                    安心のお約束：AIによる文章の書き換えや自動解析は一切行いません
                  </strong>
                  役所や展示会の申請書類と同じように、ご自身のペースで入力できます。各項目には「声で入力」ボタンもついていますので、キーボードが苦手な方も安心です。
                </div>
              </div>
            </div>

            {/* 項目①：発明品のお名前 */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm md:text-base font-black text-stone-900">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>発明品のお名前（作品名）</span>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">必須</span>
                </span>
              </label>
              <p className="text-xs text-stone-500">
                普段呼んでいる名前や仮の名前で結構です。（例：ペットボトルのキャップ開け、雨の日用傘カバー）
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualForm.title}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="例：手を汚さないぬか床かき混ぜ器"
                  className="flex-1 p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput("title")}
                  className={`px-3.5 rounded-2xl border transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    isRecording && activeVoiceField === "title"
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700 bg-white"
                  }`}
                  title="声で入力"
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold hidden sm:inline">声で入力</span>
                </button>
              </div>
            </div>

            {/* 項目②：一言キャッチコピー */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm md:text-base font-black text-stone-900">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>一言アピール（キャッチコピー）</span>
                  <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">任意</span>
                </span>
              </label>
              <p className="text-xs text-stone-500">
                この発明の一番の自慢や特徴を一言で教えてください。（例：握力が弱い方でも片手で軽々オープン！）
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualForm.catchphrase}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, catchphrase: e.target.value }))}
                  placeholder="例：握力が弱い方でも片手で軽々オープン！"
                  className="flex-1 p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput("catchphrase")}
                  className={`px-3.5 rounded-2xl border transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    isRecording && activeVoiceField === "catchphrase"
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700 bg-white"
                  }`}
                  title="声で入力"
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold hidden sm:inline">声で入力</span>
                </button>
              </div>
            </div>

            {/* 項目③：カテゴリ */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>カテゴリの分類</span>
              </label>
              <select
                value={manualForm.category}
                onChange={(e) => setManualForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="日用品・生活雑貨">日用品・生活雑貨</option>
                <option value="キッチン・調理器具">キッチン・調理器具</option>
                <option value="シニア・健康・介護">シニア・健康・介護</option>
                <option value="DIY・工具・作業">DIY・工具・作業</option>
                <option value="文房具・事務用品">文房具・事務用品</option>
                <option value="趣味・園芸・ペット">趣味・園芸・ペット</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* 項目④：どんなことで困っていましたか？ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                  <span>開発のきっかけ（どんなことで困っていましたか？）</span>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">必須</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput("motivation")}
                  className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                    isRecording && activeVoiceField === "motivation"
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700 bg-white"
                  }`}
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">マイクで話して入力</span>
                </button>
              </div>
              <p className="text-xs text-stone-500">
                ご自身やご家族、身近な人がどんな不便を感じていたかを教えてください。
              </p>
              <textarea
                rows={3}
                value={manualForm.motivation}
                onChange={(e) => setManualForm((prev) => ({ ...prev, motivation: e.target.value }))}
                placeholder="例：妻が手首の関節痛でペットボトルのフタが開けられず、毎回人に頼まなければならないのが辛そうだったため、握力がない人でも1人で開けられる道具を作りたいと思いました。"
                className="w-full p-4 bg-stone-50/50 rounded-2xl border border-stone-300 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* 項目⑤：どうやって解決しましたか？（工夫した点・仕組み） */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                  <span>工夫した点・仕組み（どうやって解決しましたか？）</span>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">必須</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput("uniqueness")}
                  className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                    isRecording && activeVoiceField === "uniqueness"
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700 bg-white"
                  }`}
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">マイクで話して入力</span>
                </button>
              </div>
              <p className="text-xs text-stone-500">
                市販のものとどこが違うか、工夫した独自の形や仕組みを教えてください。
              </p>
              <textarea
                rows={3}
                value={manualForm.uniqueness}
                onChange={(e) => setManualForm((prev) => ({ ...prev, uniqueness: e.target.value }))}
                placeholder="例：市販のゴム製オープナーは滑って力が必要ですが、テコの原理と内側に設けた独自の爪でキャップをしっかり噛み、指先一本の力で軽く回せるように工夫しました。"
                className="w-full p-4 bg-stone-50/50 rounded-2xl border border-stone-300 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* 項目⑥：苦労したエピソード・誕生ストーリー */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                  <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold">6</span>
                  <span>完成までの苦労・誕生ストーリー</span>
                  <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">任意</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleToggleVoiceInput("story")}
                  className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                    isRecording && activeVoiceField === "story"
                      ? "bg-rose-100 border-rose-400 text-rose-700 animate-pulse font-bold"
                      : "border-stone-300 hover:bg-stone-100 text-stone-700 bg-white"
                  }`}
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">マイクで話して入力</span>
                </button>
              </div>
              <p className="text-xs text-stone-500">
                何回くらい試作を作り直したか、完成したときの周りの反応などをご自由にお書きください。
              </p>
              <textarea
                rows={3}
                value={manualForm.story}
                onChange={(e) => setManualForm((prev) => ({ ...prev, story: e.target.value }))}
                placeholder="例：最初は木を削って作りましたが強度が足りず、金属加工の知人に頼んで試作を重ねました。妻が『これなら1人で開けられる！』と喜んでくれたときが一番嬉しかったです。"
                className="w-full p-4 bg-stone-50/50 rounded-2xl border border-stone-300 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* 項目⑦：使っている材質・部品 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold">7</span>
                <span>使っている材質・部品</span>
                <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">任意</span>
              </label>
              <p className="text-xs text-stone-500">
                使われている主な素材（木、ステンレス、アルミ、プラスチック等）
              </p>
              <input
                type="text"
                value={manualForm.materials}
                onChange={(e) => setManualForm((prev) => ({ ...prev, materials: e.target.value }))}
                placeholder="例：アルミニウム合金、天然木、手作りネジ"
                className="w-full p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 項目⑧：試作品の写真 */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm md:text-base font-black text-stone-900">
                <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold">8</span>
                <span>試作品の写真（スマホ撮影またはファイル選択）</span>
                <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">任意</span>
              </label>
              <p className="text-xs text-stone-500">
                手作りの試作品や図面の写真を載せると、見る人にとても伝わりやすくなります。
              </p>

              {manualForm.uploadedPhotoUrl ? (
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-amber-500 bg-stone-100 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={manualForm.uploadedPhotoUrl}
                    alt="アップロードされた試作品写真"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setManualForm((prev) => ({ ...prev, uploadedPhotoUrl: "" }))}
                    className="mt-2 w-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>写真を削除する</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <label className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 text-amber-900 font-bold py-4 px-4 rounded-2xl cursor-pointer transition text-sm">
                    <Camera className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>スマホのカメラで今すぐ撮影</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleManualPhotoSelect}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-300 text-stone-700 font-bold py-4 px-4 rounded-2xl cursor-pointer transition text-sm">
                    <Upload className="w-5 h-5 text-stone-600 shrink-0" />
                    <span>写真ファイルを選ぶ</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleManualPhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 項目⑨：開発状況と特許の状況 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-black text-stone-900 block">
                  開発の進み具合
                </label>
                <select
                  value={manualForm.status}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="手作り試作あり">手作りの試作品あり</option>
                  <option value="アイデア段階（図面や構想のみ）">アイデア段階（図面や構想のみ）</option>
                  <option value="量産・商品化を検討中">量産・商品化を検討中</option>
                  <option value="すでに小ロット生産・販売中">すでに小ロット生産・販売中</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-stone-900 block">
                  特許・実用新案の状況
                </label>
                <select
                  value={manualForm.patentStatus}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, patentStatus: e.target.value }))}
                  className="w-full p-3.5 bg-stone-50/50 rounded-2xl border border-stone-300 text-base font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="未出願（特許なし）">未出願（特許なし・これから相談したい）</option>
                  <option value="出願準備中（弁理士等に相談中）">出願準備中（弁理士等に相談中）</option>
                  <option value="特許出願中">特許出願中</option>
                  <option value="特許取得済み">特許取得済み（特許権あり）</option>
                  <option value="実用新案登録済み">実用新案登録済み</option>
                </select>
              </div>
            </div>

            {/* 項目⑩：知財保護（非公開保管モードの選択） */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                🔒 知的財産の保護について
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">
                特許出願前の発明品を一般公開すると新規性を失う恐れがあります。出願前の方は「非公開アーカイブ」としての保存をおすすめしています。
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPrivateArchiveMode}
                  onChange={(e) => setIsPrivateArchiveMode(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs md:text-sm font-bold text-stone-800">
                  出願準備ができるまで一般公開せず「非公開アーカイブ（自分用保管庫）」として保存する
                </span>
              </label>
            </div>

            {/* 確認ボタン */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleManualPreview}
                className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>入力内容を確認する（掲載プレビューへ）</span>
                <ChevronRight className="w-5 h-5" />
              </button>
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

        {/* STEP 2: ページ構成と掲載内容の確認（インライン編集機能付き） */}
        {step === "preview" && aiResult && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs md:text-sm uppercase tracking-wider">
                {registrationMode === "ai" ? <Bot className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                <span>{registrationMode === "ai" ? "STEP 2 / AIの聞き取り・ページ構成結果" : "STEP 2 / 掲載内容のご確認（手入力）"}</span>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                無料掲載プラン
              </span>
            </div>

            {registrationMode === "ai" ? (
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs md:text-sm text-amber-950 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>「あなたのお話から、以下の魅力と構成を引き出しました！」</strong><br />
                  AIが提案したキャッチコピーや文章は、下の入力欄でご自身で手直しすることも可能です。
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs md:text-sm text-emerald-950 leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>「ご入力いただいた内容をそのまま掲載プレビューに反映しました」</strong><br />
                  AIによる自動変更は行われていません。修正したい項目があれば「入力画面に戻る」を押すか、下の欄から直接編集できます。
                </div>
              </div>
            )}

            {/* アップロードされた写真プレビュー */}
            {(manualForm.uploadedPhotoUrl || uploadedImagePreview) && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={manualForm.uploadedPhotoUrl || uploadedImagePreview || ""}
                  alt="preview"
                  className="w-20 h-20 rounded-xl object-cover border border-stone-300"
                />
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

            {/* ページ構成セクション一覧 */}
            <div>
              <span className="text-xs md:text-sm font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                <LayoutTemplate className="w-4 h-4 text-amber-600" />
                <span>{registrationMode === "ai" ? "AIが決定したページの構成・提示フォーマット" : "登録されるページの構成と内容"}</span>
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
                        💡 <strong>{registrationMode === "ai" ? "AIの構成意図:" : "構成の目的:"}</strong> {sec.reason}
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
                className="w-1/3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold py-3.5 rounded-2xl transition text-xs md:text-sm cursor-pointer"
              >
                {registrationMode === "ai" ? "チャットに戻る" : "入力画面に戻る"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const isManual = registrationMode === "manual";
                  const effectiveTopic = isManual ? (manualForm.title || "手作りアイデア便利ツール") : (inventorAnswers.titleOrTopic || "手作りアイデア便利ツール");
                  const effectiveMotivation = isManual ? (manualForm.motivation || "身近な人の日常生活の不便を解消したいという思い") : (inventorAnswers.motivation || "身近な人の日常生活の不便を解消したいという思い");
                  const effectiveUniqueness = isManual ? (manualForm.uniqueness || "独自の工夫による使いやすさ") : (inventorAnswers.uniqueness || "独自の工夫による使いやすさ");
                  const effectiveStatusWish = isManual ? `${manualForm.status}（${manualForm.patentStatus}）` : (inventorAnswers.statusAndWish || "特許出願検討中・商品化希望");
                  const effectivePhoto = isManual ? manualForm.uploadedPhotoUrl : inventorAnswers.uploadedPhotoUrl;

                  // 未出願かつ非公開保管モードでない場合で、かつ未確認の場合は警告モーダルを表示
                  const textToCheck = isManual
                    ? `${manualForm.patentStatus} ${manualForm.status}`
                    : `${inventorAnswers.statusAndWish} ${inventorAnswers.uniqueness}`;
                  const seemsUnpatented = textToCheck.includes("未出願") || textToCheck.includes("特許なし") || textToCheck.includes("出願前") || textToCheck.includes("試作段階");

                  if (seemsUnpatented && !patentAgreed && !isPrivateArchiveMode) {
                    setShowPatentWarningModal(true);
                    return;
                  }

                  const newId = `inv-custom-${Date.now()}`;
                  // 正しい特許ステータス判定（patentAgreedは「未出願リスク承諾」なので特許なし扱い）
                  const isActuallyPatented = 
                    !patentAgreed && 
                    !seemsUnpatented &&
                    (textToCheck.includes("特許取得") || 
                     textToCheck.includes("出願中") ||
                     textToCheck.includes("実用新案"));

                  const customInv: Invention = {
                    id: newId,
                    inventorId: "inv-01",
                    title: effectiveTopic,
                    catchphrase: editableCatchphrase || aiResult?.catchphrase || "日常のひと工夫から生まれた愛情の発明品",
                    summary: editableSummary || aiResult?.summary || "手作りの工夫と温もりによって、誰でも安全・手軽に使える機構を設計。",
                    description: `【開発の背景】\n${effectiveMotivation}\n\n【工夫した点・こだわり】\n${effectiveUniqueness}\n\n【今後の展望】\n${effectiveStatusWish}`,
                    primaryImageUrl: effectivePhoto || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
                    additionalImages: effectivePhoto ? [effectivePhoto] : [],
                    hasPatent: isActuallyPatented,
                    isCommercialized: false,
                    materials: isManual && manualForm.materials ? manualForm.materials.split(/[、,\s]+/).filter(Boolean) : (aiResult?.materials || ["手作り加工部品", "試作パーツ"]),
                    processes: aiResult?.processes || ["手作業仕上げ", "試作検証"],
                    category: isManual ? manualForm.category : (aiResult?.category || "日用品"),
                    tags: isManual ? ["手入力登録", "シニアアイデア", manualForm.category] : ["新着発明", "手作り試作", "シニアアイデア"],
                    pageViews: 1,
                    likesCount: 1,
                    wantsCount: 1,
                    status: isPrivateArchiveMode ? "draft" : "published",
                    createdAt: new Date().toISOString().split("T")[0],
                    isPrivate: isPrivateArchiveMode,
                    tagline: editableCatchphrase || aiResult?.catchphrase || "日常のひと工夫から生まれた愛情の発明品",
                    thumbnailUrl: effectivePhoto || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
                  };

                  saveCustomInvention(customInv);
                  setCreatedInventionId(newId);
                  setStep("complete");
                }}
                className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isPrivateArchiveMode ? "非公開アーカイブとして保存する" : "この内容で公開する（無料）"}</span>
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
              {isPrivateArchiveMode ? "非公開アーカイブに保存されました！" : "発明の掲載が完了しました！"}
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
              {isPrivateArchiveMode
                ? "特許法第29条に基づく新規性喪失を防ぐため、第三者からは見えない安全な下書き保管庫にタイムスタンプ付きで保存されました。"
                : "AIとの対話から生まれた魅力的な構成で、あなたの生涯の発明が永久アーカイブに保存されました。"}
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
                      navigator.clipboard?.writeText(`${window.location.origin}/inventions/${createdInventionId}`);
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
                href={`/inventions/${createdInventionId}`}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow transition text-xs md:text-sm"
              >
                完成したページを見る
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