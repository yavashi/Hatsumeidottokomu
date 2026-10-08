import { Invention } from "@/types";
import { mockInventions } from "@/data/mock";

const STORAGE_KEYS = {
  CUSTOM_INVENTIONS: "hatsumei_custom_inventions",
  USER_PROFILE: "hatsumei_user_profile",
  FAVORITES: "hatsumei_favorites",
  COMMENTS: "hatsumei_comments",
  EXPERT_INQUIRIES: "hatsumei_expert_inquiries",
};

export interface CustomComment {
  id: string;
  inventionId: string;
  author: string;
  isInventor?: boolean;
  text: string;
  presetBadge?: string;
  createdAt: string;
  likes: number;
}

export interface UserProfile {
  name: string;
  nickname: string;
  role: "inventor" | "supporter";
  location: string;
  bio: string;
  avatarUrl: string;
  contactEmail: string;
  registeredDate?: string;
}

export interface ExpertInquiry {
  id: string;
  expertId: string;
  expertName: string;
  expertRole: string;
  inventionTitle: string;
  topic: string;
  budget: string;
  message: string;
  status: "専門家確認中" | "面談調整中" | "完了";
  createdAt: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "田中 義男",
  nickname: "義さん（下町の旋盤職人）",
  role: "inventor",
  location: "東京都 大田区",
  bio: "町工場の旋盤職人を45年務めました。妻が関節痛でペットボトルのフタを開けるのに困っていたのをきっかけに、テコ式オープナーを開発しました。",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  contactEmail: "tanaka.yoshio@example.com",
  registeredDate: "2026年1月15日",
};

// --- 発明品の保存・取得 ---
export function getSavedCustomInventions(): Invention[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_INVENTIONS);
    if (!raw) return [];
    return JSON.parse(raw) as Invention[];
  } catch (err) {
    console.error("Failed to load custom inventions:", err);
    return [];
  }
}

export function saveCustomInvention(invention: Invention): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedCustomInventions();
    const filtered = current.filter((i) => i.id !== invention.id);
    const updated = [invention, ...filtered];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_INVENTIONS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save custom invention:", err);
  }
}

export function deleteCustomInvention(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedCustomInventions();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_INVENTIONS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete custom invention:", err);
  }
}

export function getAllInventions(): Invention[] {
  const custom = getSavedCustomInventions();
  // カスタム発明品（公開設定のみ）+ 初期モック一覧
  const publicCustom = custom.filter((inv) => !inv.isPrivate);
  return [...publicCustom, ...mockInventions];
}

export function findInventionById(id: string): Invention | null {
  const custom = getSavedCustomInventions();
  const foundInCustom = custom.find((i) => i.id === id);
  if (foundInCustom) return foundInCustom;
  return mockInventions.find((i) => i.id === id) || null;
}

export function updateInventionStats(id: string, delta: { likesDelta?: number; wantsDelta?: number }): void {
  if (typeof window === "undefined") return;
  try {
    const list = getSavedCustomInventions();
    const updated = list.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          likesCount: Math.max(0, (inv.likesCount || 0) + (delta.likesDelta || 0)),
          wantsCount: Math.max(0, (inv.wantsCount || 0) + (delta.wantsDelta || 0)),
        };
      }
      return inv;
    });
    localStorage.setItem(STORAGE_KEYS.CUSTOM_INVENTIONS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update invention stats:", err);
  }
}

// --- プロフィールの保存・取得 ---
export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save user profile:", err);
  }
}

// --- お気に入りの保存・取得 ---
export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return ["inno-02", "inno-03"];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return ["inno-02", "inno-03"];
    return JSON.parse(raw) as string[];
  } catch {
    return ["inno-02", "inno-03"];
  }
}

export function toggleFavorite(inventionId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getFavoriteIds();
    let updated: string[];
    let isNowFavorited = false;
    if (current.includes(inventionId)) {
      updated = current.filter((id) => id !== inventionId);
      isNowFavorited = false;
    } else {
      updated = [...current, inventionId];
      isNowFavorited = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return isNowFavorited;
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
    return false;
  }
}

// --- 応援コメントの保存・取得 ---
export function getCommentsForInvention(inventionId: string): CustomComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) return [];
    const all = JSON.parse(raw) as CustomComment[];
    return all.filter((c) => c.inventionId === inventionId);
  } catch {
    return [];
  }
}

export function addCommentForInvention(comment: CustomComment): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: CustomComment[] = raw ? JSON.parse(raw) : [];
    const updated = [comment, ...all];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to add comment:", err);
  }
}

// --- 専門家相談依頼履歴 ---
export function getExpertInquiries(): ExpertInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERT_INQUIRIES);
    if (!raw) {
      return [
        {
          id: "inq-default",
          expertId: "exp-01",
          expertName: "城南精密工業株式会社",
          expertRole: "金型・NC旋盤試作",
          inventionTitle: "テコ式・簡単ペットボトルオープナー",
          topic: "アルミ削り出し試作の見積もり",
          budget: "10万円〜30万円",
          message: "図面を持参して相談したいです。",
          status: "専門家確認中",
          createdAt: "昨日 14:20",
        },
      ];
    }
    return JSON.parse(raw) as ExpertInquiry[];
  } catch {
    return [];
  }
}

export function saveExpertInquiry(inquiry: ExpertInquiry): void {
  if (typeof window === "undefined") return;
  try {
    const current = getExpertInquiries();
    const updated = [inquiry, ...current];
    localStorage.setItem(STORAGE_KEYS.EXPERT_INQUIRIES, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save expert inquiry:", err);
  }
}
