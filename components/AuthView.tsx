
import React, { useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { Button } from './Button';
import { Mail, Lock, Loader2, LogIn, UserPlus } from 'lucide-react';
import { ToastType } from './Toast';

interface AuthViewProps {
    onLoginSuccess: () => void;
    onShowToast?: (message: string, type: ToastType) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onShowToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'REGISTER') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                onShowToast?.('注册成功！请检查邮箱验证或直接登录', 'success');
                setMode('LOGIN');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message || '发生错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                {mode === 'LOGIN' ? <LogIn className="text-primary" /> : <UserPlus className="text-primary" />}
                {mode === 'LOGIN' ? '登录账号' : '注册账号'}
            </h3>

            <form onSubmit={handleAuth} className="w-full space-y-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">电子邮箱</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">密码</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : (mode === 'LOGIN' ? '登录' : '注册')}
                </Button>
            </form>

            <div className="mt-4 text-xs text-zinc-500">
                {mode === 'LOGIN' ? '还没有账号？' : '已有账号？'}
                <button
                    className="text-primary font-medium ml-1 hover:underline"
                    onClick={() => {
                        setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                        setError(null);
                    }}
                >
                    {mode === 'LOGIN' ? '去注册' : '去登录'}
                </button>
            </div>
        </div>
    );
};
