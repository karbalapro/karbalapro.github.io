import { createClient } from "@/utils/supabase/client";

const badWordsList = [
  "احمق", "بی‌شعور", "آشغال", "کثافت", "خر", "گاو", "نفهم", "کودن",
  "fuck", "shit", "bitch", "asshole", "cunt", "dick", "pussy"
];

function containsProfanity(text: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
  return badWordsList.some(word => normalizedText.includes(word.toLowerCase()));
}

export async function submitMemory(formData: FormData) {
  const supabase = createClient();
  
  const name = formData.get("name")?.toString().trim() || "ناشناس";
  const content = formData.get("content")?.toString().trim() || "";
  const language = formData.get("language")?.toString().trim() || "fa";
  const audioFile = formData.get("audio") as File | null;

  if (!content && (!audioFile || audioFile.size === 0)) {
    return { error: "ERROR_EMPTY_CONTENT" };
  }

  if (content.length > 2000) {
    return { error: "ERROR_TOO_LONG" };
  }

  if (containsProfanity(name) || containsProfanity(content)) {
    return { error: "ERROR_PROFANITY" };
  }

  let audioUrl = null;

  if (audioFile && audioFile.size > 0) {
    if (audioFile.size > 1024 * 1024 * 1.5) {
      return { error: "ERROR_FILE_TOO_LARGE" };
    }

    const fileName = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}.webm`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, audioFile);

    if (uploadError) {
      console.error("Error uploading audio:", uploadError);
      return { error: "ERROR_UPLOAD_FAILED" };
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
        is_approved: false
      }
    ]);

  if (error) {
    console.error("Error inserting memory:", error);
    return { error: "ERROR_INSERT_FAILED" };
  }

  return { success: true, trackingCode };
}
