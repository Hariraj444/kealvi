import { getSupabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const supabase = getSupabase();
  const { userid, password } = await req.json();

  if (!userid?.trim() || !password) {
    return Response.json(
      { error: "User ID and password are required." },
      { status: 400 }
    );
  }

  const normalizedUserid = userid.trim().toLowerCase();

  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("id")
    .eq("userid", normalizedUserid)
    .maybeSingle();

  if (existingError) {
    return Response.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  if (existingUser) {
    return Response.json(
      { error: "A user with that ID already exists." },
      { status: 409 }
    );
  }

  const password_hash = hashPassword(password);

  const { data, error } = await supabase
    .from("users")
    .insert({ userid: normalizedUserid, password_hash })
    .select("id, userid")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
