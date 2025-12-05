import React, { useState, useEffect } from 'react';
import { AiSettings, AiProvider } from '../types';
import { Button } from './Button';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsViewProps {
    onSaveSettings: (settings: AiSettings) => void;
    initialSettings: AiSettings;
    currentTheme?: string;
    onThemeChange?: (theme: string) => void;
}

const PROVIDERS: { id: AiProvider; name: string; defaultBaseUrl?: string; defaultModel?: string }[] = [
    { id: 'GEMINI', name: 'Google Gemini', defaultModel: 'gemini-2.0-flash-exp' },
    { id: 'DEEPSEEK', name: 'DeepSeek', defaultBaseUrl: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat' },
    { id: 'SILICONFLOW', name: '硅基流动 (SiliconFlow)', defaultBaseUrl: 'https://api.siliconflow.cn/v1', defaultModel: 'deepseek-ai/DeepSeek-V2.5' },
    { id: 'CUSTOM', name: '自定义 (OpenAI Compatible)', defaultBaseUrl: '', defaultModel: '' },
];

const THEMES = [
    { id: 'default', name: '经典紫 (Indigo)', color: '#6366f1' },
    { id: 'emerald', name: '翡翠绿 (Emerald)', color: '#10b981' },
    { id: 'rose', name: '玫瑰红 (Rose)', color: '#f43f5e' },
    { id: 'amber', name: '琥珀金 (Amber)', color: '#f59e0b' },
    { id: 'sky', name: '天空蓝 (Sky)', color: '#0ea5e9' },
    { id: 'violet', name: '罗兰紫 (Violet)', color: '#8b5cf6' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ onSaveSettings, initialSettings, currentTheme = 'default', onThemeChange }) => {
    const [provider, setProvider] = useState<AiProvider>(initialSettings.provider || 'GEMINI');
    const [apiKey, setApiKey] = useState(initialSettings.apiKey || '');
    const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl || '');
    const [modelName, setModelName] = useState(initialSettings.modelName || '');
    const [showSuccess, setShowSuccess] = useState(false);

    // Auto-fill defaults when provider changes, if fields are empty or match previous defaults
    useEffect(() => {
        const selectedProvider = PROVIDERS.find(p => p.id === provider);
        if (selectedProvider) {
            if (selectedProvider.defaultBaseUrl && (!baseUrl || baseUrl === PROVIDERS.find(p => p.id !== provider)?.defaultBaseUrl)) {
                setBaseUrl(selectedProvider.defaultBaseUrl);
            }
            if (selectedProvider.defaultModel && (!modelName || modelName === PROVIDERS.find(p => p.id !== provider)?.defaultModel)) {
                setModelName(selectedProvider.defaultModel);
            }
        }
    }, [provider]);

    const handleSave = () => {
        onSaveSettings({
            provider,
            apiKey,
            baseUrl,
            modelName
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto p-4 space-y-6 no-scrollbar pb-24">
            <div className="flex items-center gap-2 mb-2">
                <Settings className="text-zinc-900" size={28} />
                <h2 className="text-2xl font-bold text-zinc-900">设置</h2>
            </div>

            {/* Theme Settings */}
            {onThemeChange && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        外观主题
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => onThemeChange(theme.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${currentTheme === theme.id
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                    : 'border-zinc-200 hover:bg-zinc-50'
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full shadow-sm"
                                    style={{ backgroundColor: theme.color }}
                                />
                                <span className={`text-sm font-medium ${currentTheme === theme.id ? 'text-primary' : 'text-zinc-700'}`}>
                                    {theme.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    AI 模型配置
                </h3>

                {/* Provider Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">AI 提供商</label>
                    <div className="grid grid-cols-1 gap-2">
                        {PROVIDERS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setProvider(p.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${provider === p.id
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                                    }`}
                            >
                                <div className="font-medium">{p.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Key */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">API Key</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm"
                    />
                    <p className="text-xs text-zinc-400">您的 Key 仅存储在本地浏览器中，不会上传到服务器。</p>
                </div>

                {/* Base URL (Hidden for Gemini) */}
                {provider !== 'GEMINI' && (
                    <div className="space-y-2 animate-fade-in">
                        <label className="text-sm font-medium text-zinc-700">Base URL (API 地址)</label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://api.example.com/v1"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm"
                        />
                    </div>
                )}

                {/* Model Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">模型名称 (Model Name)</label>
                    <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="例如: gpt-4o, gemini-pro"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm"
                    />
                </div>

                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full" icon={showSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}>
                        {showSuccess ? '保存成功' : '保存设置'}
                    </Button>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex gap-3 items-start">
                <AlertCircle className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-indigo-700">
                    <p className="font-bold mb-1">关于 AI 功能</p>
                    <p className="opacity-90">
                        配置正确的 API Key 后，您可以使用 AI 自动生成训练计划、获取动作建议等高级功能。
                    </p>
                </div>
            </div>
        </div>
    );
};
