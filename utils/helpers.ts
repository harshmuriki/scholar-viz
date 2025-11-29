export const cleanJsonString = (str: string): string => {
  // Remove markdown code blocks if present
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '');
  // Trim whitespace
  cleaned = cleaned.trim();
  return cleaned;
};

export const parseGeminiResponse = <T>(text: string): T | null => {
  try {
    const cleaned = cleanJsonString(text);
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response:", e);
    return null;
  }
};