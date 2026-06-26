import { createClient } from "@/utils/supabase/server";

export async function getMemories(language: string) {
  const supabase = await createClient();
  
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
