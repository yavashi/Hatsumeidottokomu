import React from "react";
import { LayoutSection } from "@/types";
import { 
  CheckCircle2, 
  Users, 
  XCircle
} from "lucide-react";

interface SectionProps {
  section: LayoutSection;
}

export const DynamicSectionRenderer: React.FC<SectionProps> = ({ section }) => {
  switch (section.type) {
    // 1. 特長ハイライト
    case "highlight_points":
      return (
        <section className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
          {section.badge && (
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {section.content.items?.map((item, idx) => (
              <div key={idx} className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex flex-col">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm mb-3">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    // 2. Before / After 図解
    case "before_after":
      return (
        <section className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
          {section.badge && (
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-6">{section.title}</h2>
          <div className="space-y-4">
            {section.content.items?.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase mb-2">
                    <XCircle className="w-4 h-4" />
                    <span>これまでの不便・悩み（Before）</span>
                  </div>
                  <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
                    {item.before}
                  </p>
                </div>

                {/* After */}
                <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>この発明による変化（After）</span>
                  </div>
                  <p className="text-xs md:text-sm text-amber-950 leading-relaxed font-bold">
                    {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    // 3. メカニズム・技術解説
    case "how_it_works":
      return (
        <section className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 shadow-md">
          {section.badge && (
            <span className="bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-white mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {section.content.items?.map((item, idx) => (
              <div key={idx} className="bg-stone-800 border border-stone-700 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-amber-300 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    // 4. ターゲットユーザー・利用シーン
    case "target_users":
      return (
        <section className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
          {section.badge && (
            <span className="bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {section.content.items?.map((item, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-3">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-xs md:text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    // 5. 開発ストーリー・秘話
    case "development_story":
      return (
        <section className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-3xl border border-amber-200 p-6 md:p-8 shadow-xs">
          {section.badge && (
            <span className="bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-4">{section.title}</h2>
          <p className="text-xs md:text-sm text-stone-700 leading-relaxed whitespace-pre-line font-medium bg-white/80 p-5 rounded-2xl border border-amber-100">
            {section.content.text}
          </p>
        </section>
      );

    // 6. Q&A
    case "q_and_a":
      return (
        <section className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-xs">
          {section.badge && (
            <span className="bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              {section.badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-6">{section.title}</h2>
          <div className="space-y-4">
            {section.content.items?.map((item, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <div className="flex items-start gap-2 text-amber-800 font-bold text-sm mb-2">
                  <span className="text-amber-600">Q.</span>
                  <span>{item.question}</span>
                </div>
                <div className="flex items-start gap-2 text-stone-600 text-xs md:text-sm leading-relaxed pl-5 border-l-2 border-amber-400">
                  <span>{item.answer}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
};