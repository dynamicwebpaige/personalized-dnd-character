
import { GoogleGenAI, Type } from "@google/genai";
import type { Character, CharacterStats } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHARACTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The character's full name." },
    race: { type: Type.STRING, description: "The character's fantasy race (e.g., Elf, Dwarf, Human)." },
    class: { type: Type.STRING, description: "The character's class (e.g., Fighter, Wizard, Rogue)." },
    backstory: { type: Type.STRING, description: "A brief, compelling backstory of 2-3 sentences." },
    stats: {
      type: Type.OBJECT,
      properties: {
        strength: { type: Type.INTEGER },
        dexterity: { type: Type.INTEGER },
        constitution: { type: Type.INTEGER },
        intelligence: { type: Type.INTEGER },
        wisdom: { type: Type.INTEGER },
        charisma: { type: Type.INTEGER },
      },
      required: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
    },
    imagePrompt: { 
      type: Type.STRING, 
      description: "A detailed visual description for an image generation AI. Focus on fantasy elements, style, clothing, and mood. Example: 'Digital fantasy art portrait of a stoic male half-elf ranger in weathered leather armor and a dark green cloak. Short dark hair, determined expression. Misty forest at dusk background. Epic, detailed, cinematic lighting.'" 
    }
  },
  required: ['name', 'race', 'class', 'backstory', 'stats', 'imagePrompt']
};

interface CharacterDataFromGemini {
    name: string;
    race: string;
    class: string;
    backstory: string;
    stats: CharacterStats;
    imagePrompt: string;
}

async function generateCharacterDetails(imageBase64: string): Promise<CharacterDataFromGemini> {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1],
        },
    };

    const textPart = {
        text: "Analyze the person in this image. Based on their appearance and expression, create a Dungeons & Dragons 5th Edition character inspired by them. Transform them into a fantasy hero. Generate standard D&D stats by simulating a roll of 4d6 and dropping the lowest die for each stat (resulting in numbers between 3 and 18)."
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            systemInstruction: "You are a creative Dungeons & Dragons Dungeon Master creating a unique character concept.",
            responseMimeType: "application/json",
            responseSchema: CHARACTER_SCHEMA,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CharacterDataFromGemini;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", response.text);
        throw new Error("The AI returned an invalid character format. Please try again.");
    }
}

async function generateCharacterImage(prompt: string): Promise<string> {
    const fullPrompt = `${prompt}, fantasy art, d&d character portrait, highly detailed, cinematic lighting, epic, character concept art`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '3:4',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("The AI failed to generate an image. Please try again.");
    }
}

export async function generateFullCharacter(imageBase64: string): Promise<Character> {
    const details = await generateCharacterDetails(imageBase64);
    const characterImage = await generateCharacterImage(details.imagePrompt);

    return {
        ...details,
        characterImage,
    };
}
