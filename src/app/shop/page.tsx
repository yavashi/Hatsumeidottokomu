"use client";

import { useState } from "react";
import Link from "next/link";
import { mockShopProducts } from "@/data/mock";
import { ShoppingBag, CheckCircle2, Truck, ShieldCheck, Heart, Sparkles, Filter, ChevronRight, X } from "lucide-react";

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof mockShopProducts[0] | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<"detail" | "shipping" | "complete">("detail");
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    postalCode: "",
    address: "",
    paymentMethod: "credit_card",
    cheerMessage: "素晴らしい発明品ですね！応援しています。",
  });
  const [filterCondition, setFilterCondition] = useState<string>("all");

  const filteredProducts = mockShopProducts.filter((product) => {
    if (filterCondition === "all") return true;
    return product.condition === filterCondition;
  });

  const handleOpenPurchase = (product: typeof mockShopProducts[0]) => {
    setSelectedProduct(product);
    setPurchaseStep("detail");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setPurchaseStep("detail");
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "shop_item",
          title: selectedProduct.title,
          price: selectedProduct.price,
          shippingFee: selectedProduct.shippingFee,
          metadata: {
            productId: selectedProduct.id,
            inventorName: selectedProduct.inventorName,
            buyerName: buyerInfo.name,
            address: buyerInfo.address,
            paymentMethod: buyerInfo.paymentMethod,
          },
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPurchaseStep("complete");
      }
    } catch {
      setPurchaseStep("complete");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ヘッダーバナー */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/60 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-100 border border-amber-400/30">
              <ShoppingBag className="w-4 h-4" />
              <span>発明家から直接届く・公式マーケット</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              職人と発明家のこだわり直販ショップ
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              量産品にはない、温もりと工夫が詰まった手作り品・少量限定生産のプロトタイプをお手元へ。
              作品を購入することで、発明家のさらなる挑戦や試作活動を直接支えることができます。
            </p>
          </div>
          
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <ShoppingBag className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* こだわりポイント案内バー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">全て本人の手仕事・限定数</h4>
              <p className="text-xs text-stone-500 mt-0.5">一つひとつ丁寧に試作・手仕上げされた唯一無二の品</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">工房・自宅から直送</h4>
              <p className="text-xs text-stone-500 mt-0.5">発明家から手書きのメッセージや説明書が同封されます</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800 text-sm">安心のエスクロー決済</h4>
              <p className="text-xs text-stone-500 mt-0.5">事務局がお金を一時預かりし、発送確認後に売上をお渡し</p>
            </div>
          </div>
        </div>

        {/* フィルター＆商品一覧 */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2 text-stone-700 font-bold">
              <Filter className="w-5 h-5 text-stone-500" />
              <span>商品一覧 ({filteredProducts.length}点)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">絞り込み:</span>
              <button
                onClick={() => setFilterCondition("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterCondition === "all"
                    ? "bg-stone-800 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilterCondition("handmade")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterCondition === "handmade"
                    ? "bg-amber-700 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                手作り・一点物
              </button>
              <button
                onClick={() => setFilterCondition("small_lot")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterCondition === "small_lot"
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                小ロット限定生産
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                        product.condition === "handmade"
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {product.condition === "handmade" ? "手作り一点物" : "小ロット生産"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                    残り {product.stock} 点
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-stone-500 flex items-center justify-between">
                      <span>{product.inventorLocation}</span>
                      <span className="text-stone-400">発送目途: {product.leadTimeDays}日</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-amber-800 transition">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {product.catchphrase}
                    </p>
                    <div className="text-xs font-medium text-amber-900/80 pt-1">
                      作り手: {product.inventorName}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-stone-500">販売価格 (税込)</span>
                      <span className="text-xl font-extrabold text-stone-900">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/inventions/${product.inventionId}`}
                        className="py-2 text-center text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                      >
                        発明詳細
                      </Link>
                      <button
                        onClick={() => handleOpenPurchase(product)}
                        className="py-2 text-center text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>購入する</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 発明家向け 出品案内バナー */}
        <div className="bg-stone-100 border border-dashed border-stone-300 rounded-3xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm text-amber-700">
            <Heart className="w-6 h-6" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-stone-800">
              ご自身の手作り品や試作品を販売してみませんか？
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              登録した発明品から、わずか3ステップで直販出品できます。
              梱包・発送の相談や、適正価格の決定もAIとアドバイザーがサポートします。
            </p>
          </div>
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-sm font-bold shadow-sm transition"
          >
            <span>マイページから出品設定を行う</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 購入手続きモーダル */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {purchaseStep === "detail" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <span>ステップ 1 / 2</span>
                  <span>・</span>
                  <span>注文内容の確認</span>
                </div>

                <div className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-sm">{selectedProduct.title}</h3>
                    <p className="text-xs text-stone-500">作り手: {selectedProduct.inventorName}</p>
                    <p className="text-sm font-extrabold text-amber-800">
                      ¥{selectedProduct.price.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-stone-500">+ 送料 ¥{selectedProduct.shippingFee}</span>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-600 bg-amber-50/60 p-4 rounded-xl border border-amber-200/50 space-y-1">
                  <p className="font-bold text-amber-900">【手作り品・小ロット品のご留意事項】</p>
                  <p>職人による手作業のため、若干の個体差や天然素材の風合いの違いがございます。あらかじめご了承ください。</p>
                </div>

                <button
                  onClick={() => setPurchaseStep("shipping")}
                  className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2"
                >
                  <span>配送先・お支払い情報の入力へ進む</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {purchaseStep === "shipping" && (
              <form onSubmit={handleCompleteOrder} className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <span>ステップ 2 / 2</span>
                  <span>・</span>
                  <span>配送先と応援メッセージ</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">お名前 *</label>
                    <input
                      required
                      type="text"
                      placeholder="例: 発明 太郎"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-stone-700">郵便番号 *</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (buyerInfo.postalCode.startsWith("100")) {
                              setBuyerInfo({ ...buyerInfo, address: "東京都千代田区千代田1-1-1" });
                            } else if (buyerInfo.postalCode.startsWith("144")) {
                              setBuyerInfo({ ...buyerInfo, address: "東京都大田区蒲田5-13-14" });
                            } else {
                              setBuyerInfo({ ...buyerInfo, address: "東京都大田区南蒲田2-4-5" });
                            }
                          }}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline"
                        >
                          住所を自動補完
                        </button>
                      </div>
                      <input
                        required
                        type="text"
                        placeholder="例: 144-0052"
                        value={buyerInfo.postalCode}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">お届け先ご住所 *</label>
                      <input
                        required
                        type="text"
                        placeholder="例: 東京都大田区南蒲田2-4-5 発明ビル301"
                        value={buyerInfo.address}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    {/* お支払い方法の選択 */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        お支払い方法の選択 *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "credit_card", label: "クレジットカード", sub: "即時決済・手数料無料" },
                          { id: "convenience", label: "コンビニ前払い", sub: "全国主要コンビニ対応" },
                          { id: "bank_transfer", label: "銀行振込", sub: "安心の窓口・ATM対応" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setBuyerInfo({ ...buyerInfo, paymentMethod: m.id })}
                            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                              buyerInfo.paymentMethod === m.id
                                ? "border-amber-600 bg-amber-50/60 ring-1 ring-amber-600"
                                : "border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            <span className="text-xs font-bold text-stone-900">{m.label}</span>
                            <span className="text-[10px] text-stone-500 mt-0.5">{m.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        発明家へ届ける応援メッセージ（任意）
                      </label>
                      <textarea
                        rows={2}
                        value={buyerInfo.cheerMessage}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, cheerMessage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-stone-700"
                      />
                      <p className="text-[11px] text-stone-500 mt-0.5">※このメッセージは発送伝票や通知で発明家に届きます。</p>
                    </div>

                    {/* 安全利用・PL法に関する免責事項＆特商法代行表記 */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          defaultChecked
                          className="mt-0.5 rounded text-amber-700 focus:ring-amber-500"
                        />
                        <span className="text-[11px] text-stone-700 leading-tight">
                          【手作り試作品の安全同意】本品は工房・個人による手作り試作品です。量産工業規格の耐久試験とは異なり、天然素材等の個体差が生じます。本来の用途・用法を守って安全にご使用いただくことに同意します。
                        </span>
                      </label>

                      <div className="pt-2 border-t border-stone-200/80 text-[10px] text-stone-500 leading-relaxed">
                        ※特定商取引法に基づく表記: 高齢発明家のプライバシー保護のため、販売事業者の連絡先はプラットフォーム運営会社（発明ドットコム事務局）が代行明記しております。
                      </div>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl space-y-2 border border-stone-200">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>商品合計</span>
                        <span>¥{selectedProduct.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>送料</span>
                        <span>¥{selectedProduct.shippingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                        <span>お支払い合計</span>
                        <span>¥{(selectedProduct.price + selectedProduct.shippingFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPurchaseStep("detail")}
                      className="flex-1 py-3 text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold rounded-xl transition text-xs"
                  >
                    戻る
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>注文を確定する</span>
                  </button>
                </div>
              </form>
            )}

            {purchaseStep === "complete" && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-stone-900">ご注文ありがとうございます！</h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
                    発明家の <span className="font-bold text-stone-800">{selectedProduct.inventorName}</span> さんへ注文とお手紙が送信されました。
                    工房から大切に梱包してお届けします。
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 text-left space-y-1">
                  <p className="font-semibold text-stone-800">発送予定時期:</p>
                  <p>約 {selectedProduct.leadTimeDays} 日前後で発送通知メールをお送りします。</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-sm transition"
                >
                  ショップ一覧へ戻る
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
