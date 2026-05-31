import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") ?? "";
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "5"), 10);

    if (query.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const db = getAdminClient();
    const { data: faqs } = await db.from("faqs").select("*").eq("is_active", true);
    if (!faqs?.length) return NextResponse.json({ success: true, results: [] });

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const scored = faqs
      .map((faq) => {
        const q = faq.question.toLowerCase();
        const a = faq.answer.toLowerCase();
        const kw = (faq.keywords as string[]).map((k) => k.toLowerCase());
        let score = 0;
        for (const t of terms) {
          if (q.includes(t)) score += 3;
          if (kw.some((k) => k.includes(t))) score += 2;
          if (a.includes(t)) score += 1;
        }
        return { ...faq, relevanceScore: parseFloat((score / (terms.length * 6)).toFixed(2)) };
      })
      .filter((f) => f.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return NextResponse.json({ success: true, results: scored });
  } catch (err) {
    console.error("[faqs/search]", err);
    return NextResponse.json({ success: false, message: "Search failed." }, { status: 500 });
  }
}
