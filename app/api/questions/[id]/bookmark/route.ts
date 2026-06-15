import { getSupabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();

  try {
    const { id: questionId } = await params;
    const { userId } = await req.json();

    if (!userId?.trim()) {
      return Response.json({ error: "userId is required." }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from("bookmarks")
      .select("question_id")
      .eq("question_id", questionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) {
      return Response.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      const { error: delError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("question_id", questionId)
        .eq("user_id", userId);

      if (delError) {
        return Response.json({ error: delError.message }, { status: 500 });
      }

      return Response.json({ bookmarked: false });
    }

    const { error: insError } = await supabase
      .from("bookmarks")
      .insert({ question_id: questionId, user_id: userId });

    if (insError) {
      return Response.json({ error: insError.message }, { status: 500 });
    }

    return Response.json({ bookmarked: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

