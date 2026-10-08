export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isInventor?: boolean; // 発明品または発明家プロフィールの登録があるか
  favoriteInventionIds: string[]; // お気に入り（商品化されたら欲しい）の発明品ID
  createdAt: string;
}

export interface Inventor {
  id: string;
  name: string; // 氏名
  nickname?: string; // ニックネーム
  age?: number; // 年齢
  gender?: string; // 性別
  avatarUrl?: string; // プロフィール写真
  location?: string; // 地域（都道府県等）
  bio: string; // 発明家本人の思い・自己紹介
  aiSummaryBio?: string; // AIによる発明家ダイジェスト
  isProfilePublic: boolean; // プロフィール公開設定
  createdAt: string;
}

// AIが発明の性格に合わせて動的に決定・構成するセクションブロックの型
export type LayoutSectionType = 
  | 'highlight_points'  // 3つの推しポイント・特長
  | 'before_after'       // Before / After のお悩み解決図解
  | 'development_story'  // 開発の苦労・きっかけ（ストーリー形式）
  | 'how_it_works'       // 仕組み・メカニズム解説
  | 'target_users'       // こんな人・こんなシーンにおすすめ
  | 'q_and_a'            // よくある疑問（Q&A）
  | 'commercial_spec';   // 企業向け製造・商品化スペック

export interface LayoutSectionItem {
  title?: string;
  description?: string;
  iconName?: string;
  before?: string;
  after?: string;
  question?: string;
  answer?: string;
}

export interface LayoutSection {
  id: string;
  type: LayoutSectionType;
  title: string;
  badge?: string;
  content: {
    text?: string;
    items?: LayoutSectionItem[];
  };
}

export interface Invention {
  id: string;
  inventorId: string;
  title: string; // 発明品名
  catchphrase: string; // 一言キャッチコピー
  summary: string; // 概要要約
  description: string; // 発明者本人の熱い文章（原文）
  primaryImageUrl: string;
  additionalImages?: string[];
  youtubeVideoId?: string;
  
  // 権利・商品化情報
  hasPatent: boolean;
  patentNumber?: string;
  isCommercialized: boolean;
  hopePrice?: number;
  pastSalesRecord?: string;
  termsWish?: string;
  
  // 製造・企業向けスペック情報
  materials: string[];
  processes: string[];
  category: string;
  tags: string[];
  
  // AIが発明の性格に合わせて動的に組み立てたページ構成セクション群
  aiSections?: LayoutSection[];

  // エンゲージメント・需要統計
  pageViews: number;
  likesCount: number;
  wantsCount: number;
  
  // 直販ショップ情報（任意）
  shopItem?: {
    isForSale: boolean;
    price: number;
    stock: number;
    condition: 'handmade' | 'small_lot' | 'prototype';
    leadTimeDays: number;
  };
  
  status: 'draft' | 'ai_generated' | 'published' | string;
  createdAt: string;
  updatedAt?: string;

  // 互換性およびカスタム登録用オプショナルフィールド
  tagline?: string;
  solutionSummary?: string;
  problemStatement?: string;
  story?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  process?: string[];
  viewsCount?: number;
  isFeatured?: boolean;
  isPrivate?: boolean;
  sections?: any[];
}

// ネットショップ直販商品
export interface ShopProduct {
  id: string;
  inventionId: string;
  title: string;
  catchphrase: string;
  price: number;
  stock: number;
  condition: 'handmade' | 'small_lot' | 'prototype';
  leadTimeDays: number;
  imageUrl: string;
  inventorName: string;
  inventorLocation: string;
  description: string;
  shippingFee: number;
}

// 試作屋・町工場・弁理士・専門家
export interface ExpertPartner {
  id: string;
  name: string;
  companyName: string;
  role: 'prototype' | 'patent_attorney' | 'cad_design' | 'craftsman';
  roleLabel: string;
  avatarUrl: string;
  location: string;
  shortBio: string;
  skills: string[];
  samplePrice: string;
  consultationCount: number;
  rating: number;
  acceptingRequests: boolean;
}

// ユーザーの通知設定
export interface UserNotificationSettings {
  channelEmail: boolean;
  channelLine: boolean;
  channelBrowserPush: boolean;
  notifyOnWantVote: boolean; // 「欲しい」ボタンが押された時
  notifyOnComment: boolean;  // 応援コメント・質問がついた時
  notifyOnB2BInquiry: boolean; // 企業からの商品化打診・相談
  notifyWeeklyReport: boolean; // 週間レポート（閲覧数・ランキング変動）
  notifyNewsletter: boolean;   // メールマガジン受け取り
}
