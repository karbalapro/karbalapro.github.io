import { createClient } from "@supabase/supabase-js";

export async function getMemories(language: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("language", language)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error);
    return [];
  }

  return data;
}
