import { getSupabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/auth";

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

  const { data, error } = await supabase
    .from("users")
    .select("id, userid, password_hash")
    .eq("userid", normalizedUserid)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!data || !verifyPassword(password, data.password_hash)) {
    return Response.json(
      { error: "Invalid user ID or password." },
      { status: 401 }
    );
  }

  return Response.json({ id: data.id, userid: data.userid });
}
