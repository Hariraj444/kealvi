import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("questions")
    .select("id", { count: "exact" });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ total: count ?? 0 });
}

