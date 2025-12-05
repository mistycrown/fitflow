
import React, { useState, useEffect } from 'react';
import { AiSettings, AiProvider, Exercise, WorkoutTemplate, DailyWorkout } from '../types';
import { Button } from './Button';
import { Settings, Save, CheckCircle2, AlertCircle, Cloud, LogOut, RefreshCw, Loader2, UploadCloud, DownloadCloud } from 'lucide-react';
import { AuthView } from './AuthView';
import { getUser, pushExercises, pullExercises, pushTemplates, pullTemplates, pushWorkouts, pullWorkouts } from '../services/syncService';
import { supabase } from '../src/supabaseClient';
import { ToastType } from './Toast';


interface SettingsViewProps {
    onSaveSettings: (settings: AiSettings) => void;
    initialSettings: AiSettings;
    currentTheme?: string;
    onThemeChange?: (theme: string) => void;
    // Data Sync Props
    exercises?: Exercise[];
    templates?: WorkoutTemplate[];
    workouts?: DailyWorkout[];
    onDataSync?: (exercises: Exercise[], templates: WorkoutTemplate[], workouts: DailyWorkout[]) => void;
    onShowToast?: (message: string, type: ToastType) => void;
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

export const SettingsView: React.FC<SettingsViewProps> = ({
    onSaveSettings,
    initialSettings,
    currentTheme = 'default',
    onThemeChange,
    exercises,
    templates,
    workouts,
    onDataSync,
    onShowToast
}) => {
    const [provider, setProvider] = useState<AiProvider>(initialSettings.provider || 'GEMINI');
    const [apiKey, setApiKey] = useState(initialSettings.apiKey || '');
    const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl || '');
    const [modelName, setModelName] = useState(initialSettings.modelName || '');
    const [showSuccess, setShowSuccess] = useState(false);

    // Auth & Sync State
    const [user, setUser] = useState<any>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        const u = await getUser();
        setUser(u);
    };

    const handlePush = async () => {
        if (!user || !exercises || !templates || !workouts) return;
        setIsSyncing(true);
        try {
            await pushExercises(exercises);
            await pushTemplates(templates);
            await pushWorkouts(workouts);
            onShowToast?.('上传成功！本地数据已覆盖云端。', 'success');
        } catch (err: any) {
            onShowToast?.('上传失败: ' + err.message, 'error');
            console.error(err);
        } finally {
            setIsSyncing(false);
        }
    };

    const handlePull = async () => {
        if (!user || !onDataSync) return;
        setIsSyncing(true);
        try {
            const remoteExercises = await pullExercises();
            const remoteTemplates = await pullTemplates();
            const remoteWorkouts = await pullWorkouts();

            onDataSync(remoteExercises, remoteTemplates, remoteWorkouts);
            onShowToast?.('下载成功！云端数据已覆盖本地。', 'success');
        } catch (err: any) {
            onShowToast?.('下载失败: ' + err.message, 'error');
            console.error(err);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

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

            {/* Cloud Sync Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <Cloud className="text-primary" size={20} />
                    云端同步
                </h3>

                {!user ? (
                    <AuthView onLoginSuccess={() => checkUser()} onShowToast={onShowToast} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                            <div className="text-sm text-zinc-600">
                                当前登录: <span className="font-bold text-zinc-900">{user.email}</span>
                            </div>
                            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                <LogOut size={12} /> 退出
                            </button>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl text-sm text-zinc-600 mb-2">
                            请选择同步方向。上传将把本地最新数据推送到云端，下载将用云端数据覆盖本地。
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handlePush}
                                disabled={isSyncing}
                                className="w-full"
                                variant="outline"
                                icon={isSyncing ? <Loader2 className="animate-spin" /> : <UploadCloud size={18} />}
                            >
                                上传
                            </Button>

                            <Button
                                onClick={handlePull}
                                disabled={isSyncing}
                                className="w-full"
                                icon={isSyncing ? <Loader2 className="animate-spin" /> : <DownloadCloud size={18} />}
                            >
                                下载
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Theme Settings */}
            {onThemeChange && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        外观主题
                    </h3>
                    <div className="grid grid-cols-6 gap-2 md:gap-3 py-2">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => onThemeChange(theme.id)}
                                className={`w-full aspect-square rounded-full shadow-sm transition-all focus:outline-none ${currentTheme === theme.id
                                    ? 'ring-4 ring-offset-2 ring-primary/30 scale-105'
                                    : 'hover:scale-105 ring-1 ring-zinc-200'
                                    }`}
                                style={{ backgroundColor: theme.color }}
                                title={theme.name}
                                aria-label={theme.name}
                            />
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
