import { Persona } from "../types";

// List of personas that have specific high-quality avatars
const SPECIFIC_AVATARS = [
  "imam-hussain",
  "abbas-ibn-ali"
];

// Mapping of categories to their default generic avatar image
const CATEGORY_AVATARS: Record<string, string> = {
  catBaniHashem: "/images/avatars/categories/catBaniHashem.png",
  catAnsar: "/images/avatars/categories/catAnsar.png",
  catWomen: "/images/avatars/categories/catWomen.png",
  catCaptives: "/images/avatars/categories/catCaptives.png",
  catEnemies: "/images/avatars/categories/catEnemies.png"
};

export function getAvatarUrl(persona: Persona): string {
  // 1. Check if the persona has an explicit avatar image in the database
  if (persona.avatarImage) {
    return persona.avatarImage;
  }

  // 2. Check if we have a locally stored specific avatar for this ID
  if (SPECIFIC_AVATARS.includes(persona.id)) {
    return `/images/avatars/specific/${persona.id}.png`;
  }

  // 3. Check secondary categories first (e.g. if someone is both Women and Captives, show Captives)
  if (persona.categories && persona.categories.length > 0) {
    for (const cat of persona.categories) {
      if (CATEGORY_AVATARS[cat]) {
        return CATEGORY_AVATARS[cat];
      }
    }
  }

  // 4. Fallback to primary category avatar
  if (CATEGORY_AVATARS[persona.category]) {
    return CATEGORY_AVATARS[persona.category];
  }

  // 5. Ultimate fallback
  return "/images/avatars/categories/catAnsar.png";
}
