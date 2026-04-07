"use client";

export default function InsightBox({ text }: { text: string }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
      <div className="flex gap-2">
        <span className="text-blue-500 shrink-0 mt-0.5">💡</span>
        <p className="text-xs text-blue-800 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
