import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "発明ドットコム - 全国の個人発明が集まるデジタルアーカイブ・博物館",
  description: "日常の切実な困りごとから生まれた町工場の職人や主婦、シニアの熱い発明を掲載。AIが魅力を引き出しページを自動生成。一般の皆様の「商品化されたら欲しい！」の声を企業に届け、後世に残る永久アーカイブとして保存します。",
  openGraph: {
    title: "発明ドットコム - 全国の個人発明が集まるデジタルアーカイブ",
    description: "世の中にはこんな発明があった！町工場の職人や主婦が作ったユニークな発明図鑑・オープンメディア。",
    siteName: "発明ドットコム",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">{children}</body>
    </html>
  );
}
