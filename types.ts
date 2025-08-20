
export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  name: string;
  race: string;
  class: string;
  backstory: string;
  stats: CharacterStats;
  characterImage: string; // From Imagen, base64 string
}

export type GameState = 'CAMERA' | 'GENERATING' | 'DISPLAY' | 'ERROR';
