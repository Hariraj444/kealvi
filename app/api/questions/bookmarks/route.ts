import { getSupabase } from "@/lib/supabase";

export async function GET(
  req: Request
) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) {
    return Response.json({ bookmarkedQuestionIds: [] });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("question_id")
    .eq("user_id", userId);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    bookmarkedQuestionIds: (data ?? []).map((r) => r.question_id),
  });
}

