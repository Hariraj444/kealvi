import { getSupabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();

  try {
    const { id: questionId } = await params;
    const { voterId, vote } = await req.json();

    if (vote === 0) {
      const { error: deleteError } = await supabase
        .from("votes")
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
      const value = vote === -1 ? -1 : 1;

      const insertResult = await supabase.from("votes").insert({
        question_id: questionId,
        voter_id: voterId,
        value,
      });

      if (insertResult.error) {
        if (insertResult.error.code === "23505") {
          const { error: updateError } = await supabase
            .from("votes")
            .update({ value })
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

    const { data, error: countError } = await supabase
      .from("votes")
      .select("value")
      .eq("question_id", questionId);

    if (countError) {
      return Response.json(
        { error: countError.message },
        { status: 500 }
      );
    }

    const votes = (data ?? []).reduce(
      (sum, voteRow) => sum + (voteRow.value ?? 0),
      0
    );

    return Response.json({ ok: true, votes });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}