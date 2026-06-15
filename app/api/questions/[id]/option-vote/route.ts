import { getSupabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();

  try {
    const { id: questionId } = await params;
    const { voterId, optionId } = await req.json();

    if (optionId == null) {
      const { error: deleteError } = await supabase
        .from("poll_votes")
        .delete()
        .eq("question_id", questionId)
        .eq("voter_id", voterId);

      if (deleteError) {
        return Response.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }
    } else {
      const insertResult = await supabase.from("poll_votes").insert({
        question_id: questionId,
        option_id: optionId,
        voter_id: voterId,
      });

      if (insertResult.error) {
        if (insertResult.error.code === "23505") {
          const { error: updateError } = await supabase
            .from("poll_votes")
            .update({ option_id: optionId })
            .eq("question_id", questionId)
            .eq("voter_id", voterId);

          if (updateError) {
            return Response.json(
              { error: updateError.message },
              { status: 500 }
            );
          }
        } else {
          return Response.json(
            { error: insertResult.error.message },
            { status: 500 }
          );
        }
      }
    }

    const { data, error } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("question_id", questionId);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const optionCounts: Record<string, number> = {};
    (data ?? []).forEach((row) => {
      const id = row.option_id;
      if (!id) return;
      optionCounts[id] = (optionCounts[id] ?? 0) + 1;
    });

    return Response.json({ ok: true, optionCounts });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
