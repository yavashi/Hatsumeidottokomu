import { supabase } from "@/lib/supabase";
import { mockInventions, mockInventors } from "@/data/mock";
import { Invention, Inventor } from "@/types";

// 発明品一覧の取得（Supabase or Mock）
export async function getInventions(): Promise<Invention[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("inventions")
        .select("*")
        .order("wants_count", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as unknown as Invention[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to mock:", e);
    }
  }

  return mockInventions;
}

// 発明品詳細の取得
export async function getInventionById(id: string): Promise<Invention | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("inventions")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as unknown as Invention;
      }
    } catch (e) {
      console.warn("Supabase single fetch failed, falling back to mock:", e);
    }
  }

  return mockInventions.find((i) => i.id === id) || null;
}

// 発明家一覧の取得
export async function getInventors(): Promise<Inventor[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_inventor", true);

      if (!error && data && data.length > 0) {
        return data as unknown as Inventor[];
      }
    } catch (e) {
      console.warn("Supabase inventors fetch failed, falling back to mock:", e);
    }
  }

  return mockInventors;
}

// 「欲しい！」投票の記録
export async function recordWantVote(inventionId: string, expectedPriceRange?: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from("want_votes").insert({
        invention_id: inventionId,
        user_id: "demo_user",
        expected_price_range: expectedPriceRange,
      });

      // カウント加算
      await supabase.rpc("increment_wants", { inv_id: inventionId });
      return true;
    } catch (e) {
      console.warn("Supabase vote record failed:", e);
    }
  }

  return true;
}
