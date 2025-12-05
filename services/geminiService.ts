import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Exercise, ExerciseCategory, AiSettings } from '../types';

// Helper to get settings
const getAiSettings = (): AiSettings | null => {
  const saved = localStorage.getItem('fitflow_ai_settings');
  return saved ? JSON.parse(saved) : null;
};

const exerciseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING, enum: Object.values(ExerciseCategory) },
    muscleGroup: { type: Type.STRING },
    suggestedSets: { type: Type.INTEGER },
    suggestedReps: { type: Type.INTEGER },
  },
  required: ['name', 'category', 'muscleGroup', 'suggestedSets', 'suggestedReps'],
};

const planSchema: Schema = {
  type: Type.ARRAY,
  items: exerciseSchema,
};

// Generic OpenAI-compatible fetcher
const fetchOpenAICompatible = async (settings: AiSettings, systemPrompt: string, userPrompt: string, jsonMode: boolean = false) => {
  if (!settings.apiKey || !settings.baseUrl) throw new Error("Missing API Key or Base URL");

  const response = await fetch(`${settings.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.modelName || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: jsonMode ? { type: "json_object" } : undefined,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateSmartWorkout = async (
  prompt: string,
  existingExercises: Exercise[]
): Promise<any[]> => {
  const settings = getAiSettings();
  if (!settings || !settings.apiKey) {
    throw new Error("请先在设置中配置 AI API Key");
  }

  const systemInstruction = `
    你是一位专业的健身教练。
    请根据用户的请求生成一份中文健身计划。
    返回一个动作列表，包含建议的组数(sets)和次数(reps)。
    请尽量从未给出的现有动作库中选择动作名称：${existingExercises.map(e => e.name).join(', ')}。
    如果需要新动作，请创建一个合适的中文名称。
    所有返回内容必须是中文。
    
    IMPORTANT: Return ONLY valid JSON array. No markdown formatting.
    Example format:
    [
      { "name": "Pushups", "category": "俯卧撑", "muscleGroup": "Chest", "suggestedSets": 3, "suggestedReps": 10 }
    ]
  `;

  try {
    if (settings.provider === 'GEMINI') {
      const ai = new GoogleGenAI({ apiKey: settings.apiKey });
      const model = settings.modelName || "gemini-2.5-flash";

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: planSchema,
        },
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);

    } else {
      // OpenAI Compatible (DeepSeek, SiliconFlow, Custom)
      // Note: For JSON mode to work reliably with some providers, we might need to be explicit in the prompt
      const jsonPrompt = `${prompt}\n\n请直接返回 JSON 数组格式，不要包含 Markdown 代码块标记。`;
      const content = await fetchOpenAICompatible(settings, systemInstruction, jsonPrompt, true);

      // Clean up potential markdown code blocks if the provider ignores instructions
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedContent);
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};


