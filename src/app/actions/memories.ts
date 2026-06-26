"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// A basic blocklist for Persian/English profanity (placeholder)
// In a real production app, you might want to use a more robust library or API.
const badWordsList = [
  "احمق", "بی‌شعور", "آشغال", "کثافت", "خر", "گاو", "نفهم", "کودن",
  "fuck", "shit", "bitch", "asshole", "cunt", "dick", "pussy"
];

function containsProfanity(text: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
  return badWordsList.some(word => normalizedText.includes(word.toLowerCase()));
}

export async function submitMemory(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name")?.toString().trim() || "ناشناس";
  const content = formData.get("content")?.toString().trim() || "";
  const language = formData.get("language")?.toString().trim() || "fa";
  const audioFile = formData.get("audio") as File | null;

  if (!content && (!audioFile || audioFile.size === 0)) {
    return { error: "متن یا صدای خاطره نمی‌تواند خالی باشد." };
  }

  if (content.length > 2000) {
    return { error: "متن خاطره بسیار طولانی است." };
  }

  if (containsProfanity(name) || containsProfanity(content)) {
    return { error: "متن شما حاوی کلمات نامناسب است و قابل ثبت نمی‌باشد." };
  }

  let audioUrl = null;

  if (audioFile && audioFile.size > 0) {
    // 1 MB limit (just to be safe)
    if (audioFile.size > 1024 * 1024 * 1.5) {
      return { error: "حجم فایل صوتی نباید بیشتر از ۱.۵ مگابایت باشد." };
    }

    const fileName = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}.webm`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, audioFile);

    if (uploadError) {
      console.error("Error uploading audio:", uploadError);
      return { error: "خطا در آپلود فایل صوتی." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("audio")
      .getPublicUrl(fileName);

    audioUrl = publicUrlData.publicUrl;
  }

  const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
  const trackingCode = `${language.toUpperCase()}-${randomNum}`;

  const { error } = await supabase
    .from("memories")
    .insert([
      {
        name,
        content,
        language,
        audio_url: audioUrl,
        tracking_code: trackingCode,
        is_approved: false // Requires admin approval in Supabase Dashboard
      }
    ]);

  if (error) {
    console.error("Error inserting memory:", error);
    return { error: "خطایی در ثبت خاطره رخ داد. لطفا دوباره تلاش کنید." };
  }

  return { success: true, trackingCode };
}

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
