import { getSupabase } from "@/lib/supabase";

export async function getPoll(questionId: number) {
  const supabase = getSupabase();
  console.log("questionId =", questionId);

  const { data, error } = await supabase
    .from("polls")
    .select("*");

  console.log("polls table =", data);
  console.log("error =", error);

  return { poll: data, options: [] };
}