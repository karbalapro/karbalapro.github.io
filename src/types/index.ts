export type PersonaCategory = 
  | "catBaniHashem" 
  | "catAnsar" 
  | "catWomen" 
  | "catPioneers" 
  | "catSurvivors"
  | "catCaptives"
  | "catEnemies";

export interface Persona {
  id: string;
  category: PersonaCategory; // Primary category for color/display
  categories?: PersonaCategory[]; // Array of categories for filtering
  avatarImage?: string; // Path to the generated avatar
  symbolicImageId?: string; // We'll use this for the generated glow/symbol image
  colorAccent?: string; // Hex color for their specific card glow
}
