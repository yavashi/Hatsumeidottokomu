import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message, history = [], step = 1, inventionDraft = {} } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Gemini APIキーが設定されている場合は本物の Gemini 2.5 Flash を呼び出し
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `あなたは日本一温かく、下町の職人やシニア個人発明家の想いを引き出す専任の『発明インタビュアーAI』です。
相手は高齢者や初めて発明品を作った個人の方が多いです。
専門用語を避け、敬意を払い、温かい相槌（「素晴らしい工夫ですね！」「奥様のためにそこまで…」など）を打ちながら、以下の項目を自然に対話で引き出してください。
1. 日常で何に困っていたのか（開発のきっかけ・Before）
2. どのように解決したのか（工夫した仕組み・After）
3. 誰に使ってほしいか、一番のこだわりポイント

回答は必ず以下のJSONフォーマットで返してください:
{
  "reply": "発明家への温かい返答と、次の深掘り質問メッセージ（2〜3文）",
  "nextStep": 2, // 1:きっかけ, 2:仕組み・こだわり, 3:完成・プレビュー生成
  "extractedData": {
    "title": "抽出・推測された発明品名（まだ無ければ空文字）",
    "catchphrase": "魅力的な一言キャッチコピー（例: 手首に力を入れずにスッと開く！）",
    "summary": "100文字前後の概要要約",
    "materials": ["推奨素材1", "推奨素材2"],
    "category": "キッチン・日用品など",
    "highlights": ["特長1", "特長2", "特長3"]
  }
}`;

      const contents = [
        ...history.map((h: any) => ({
          role: h.sender === "ai" ? "model" : "user",
          parts: [{ text: h.text }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      return NextResponse.json({
        success: true,
        reply: parsed.reply || "お話しいただきありがとうございます！さらに詳しく教えていただけますか？",
        nextStep: parsed.nextStep || step + 1,
        extractedData: parsed.extractedData || {},
        isLiveAI: true,
      });
    }

    // 2. Gemini APIキー未設定時のスマートシナリオ（フォールバック）
    let reply = "素晴らしい工夫ですね！その仕組みについて、もう少し詳しく（どんな素材やテコの原理を使っているかなど）教えていただけますか？";
    let nextStep = step + 1;
    let extractedData = { ...inventionDraft };

    if (step === 1) {
      reply = "「妻のために3年かけて作った」という熱い想い、本当に胸を打たれます！\n握力のない方でも簡単に回せるよう、内部の爪やテコにどんな加工の工夫を施されたのですか？";
      extractedData.title = "らくらく開栓テコオープナー";
      extractedData.catchphrase = "手首に力を入れずにテコの力でスッと開く！町工場職人の愛が詰まった一生モノ";
    } else if (step === 2) {
      reply = "真鍮の削り出しとウォルナットの組み合わせですね！耐久性と温かみが両立されていて見事です。\nこの作品を一番届けたい方や、想定している希望価格（もしあれば）はございますか？";
      extractedData.materials = ["真鍮（削り出し）", "ウォルナット材", "高耐久スプリング"];
      extractedData.category = "キッチン・日用品";
    } else {
      reply = "お聞かせいただきありがとうございました！あなたの想いと技術のこだわりを、AIがWebページと動的セクションにまとめました。右側のプレビューをご確認ください！";
      nextStep = 3;
      extractedData.summary = "握力の弱くなったシニアや関節リウマチの方でも、ペットボトルのフタをわずか半回転のテコ動作で安全に開栓できる生活補助具。";
    }

    return NextResponse.json({
      success: true,
      reply,
      nextStep,
      extractedData,
      isLiveAI: false,
    });

  } catch (error: any) {
    console.error("Gemini Interview API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        reply: "お話しいただきありがとうございます。あなたの熱い思いがよく伝わりました！次のこだわりについてもぜひお聞かせください。",
        nextStep: 2,
        extractedData: {},
        isLiveAI: false,
      },
      { status: 200 }
    );
  }
}
