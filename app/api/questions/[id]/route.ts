import { getSupabase } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();

  try {
    const { id: questionId } = await params;
    const { title, content, requesterUserid } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return Response.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    if (!requesterUserid?.trim()) {
      return Response.json(
        { error: "requesterUserid is required." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("questions")
      .select("author")
      .eq("id", questionId)
      .single();

    if (existingError) {
      return Response.json({ error: existingError.message }, { status: 500 });
    }

    if (existing?.author !== requesterUserid.trim()) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("questions")
      .update({ title: title.trim(), content: content.trim() })
      .eq("id", questionId)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data?.[0] ?? { id: questionId });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();

  try {
    const { id: questionId } = await params;
    const { requesterUserid } = await req.json();

    if (!requesterUserid?.trim()) {
      return Response.json(
        { error: "requesterUserid is required." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("questions")
      .select("author")
      .eq("id", questionId)
      .single();

    if (existingError) {
      return Response.json({ error: existingError.message }, { status: 500 });
    }

    if (existing?.author !== requesterUserid.trim()) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

