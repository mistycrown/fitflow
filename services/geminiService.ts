import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Exercise, ExerciseCategory } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

export const generateSmartWorkout = async (
  prompt: string,
  existingExercises: Exercise[]
): Promise<any[]> => {
  if (!ai) {
    throw new Error("请先配置 API Key");
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    你是一位专业的健身教练。
    请根据用户的请求生成一份中文健身计划。
    返回一个动作列表，包含建议的组数(sets)和次数(reps)。
    请尽量从未给出的现有动作库中选择动作名称：${existingExercises.map(e => e.name).join(', ')}。
    如果需要新动作，请创建一个合适的中文名称。
    所有返回内容必须是中文。
  `;

  try {
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
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};

export const getExerciseAdvice = async (exerciseName: string): Promise<string> => {
    if (!ai) return "AI 服务暂不可用";
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `请用中文给出关于这个动作的3个简短的动作要领或注意事项：${exerciseName}。总字数控制在50字以内。`,
        });
        return response.text || "暂无建议。";
    } catch (e) {
        return "无法获取建议。";
    }
}