import { getSupabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.trim();

  if (q) {
    const questions = await searchQuestions(q, PAGE_SIZE);
    return Response.json({
      questions,
      hasMore: false,
    });
  }

  const offset = Number(searchParams.get("offset") ?? 0);

  const { questions, hasMore } =
    await getQuestionsPage(offset, PAGE_SIZE);

  return Response.json({
    questions,
    hasMore,
  });
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  const { title, content, options, author } = await req.json();

  if (!title?.trim() || !content?.trim()) {
    return Response.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const { data: duplicateByTitle, error: titleError } = await supabase
    .from("questions")
    .select("id")
    .eq("title", title)
    .limit(1);

  if (titleError) {
    return Response.json(
      { error: titleError.message },
      { status: 500 }
    );
  }

  if ((duplicateByTitle ?? []).length > 0) {
    return Response.json(
      { error: "A question with the same title already exists." },
      { status: 409 }
    );
  }

  const { data: duplicateByContent, error: contentError } = await supabase
    .from("questions")
    .select("id")
    .eq("content", content)
    .limit(1);

  if (contentError) {
    return Response.json(
      { error: contentError.message },
      { status: 500 }
    );
  }

  if ((duplicateByContent ?? []).length > 0) {
    return Response.json(
      { error: "A question with the same content already exists." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      title,
      content,
      author: author ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (Array.isArray(options) && options.length > 0) {
    const formattedOptions = options
      .filter((text: string) => typeof text === "string" && text.trim())
      .map((text: string) => ({
        question_id: data.id,
        text: text.trim(),
      }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(formattedOptions);

    if (optionsError) {
      return Response.json(
        { error: optionsError.message },
        { status: 500 }
      );
    }

    const { data: insertedOptions, error: fetchError } = await supabase
      .from("poll_options")
      .select("id, text")
      .eq("question_id", data.id);

    if (fetchError) {
      return Response.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    return Response.json({
      ...data,
      options: insertedOptions,
    });
  }

  return Response.json(data);
}