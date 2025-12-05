
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 size={18} className="text-green-500" />;
            case 'error': return <AlertCircle size={18} className="text-red-500" />;
            default: return <AlertCircle size={18} className="text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success': return 'bg-white border-green-100 text-green-800';
            case 'error': return 'bg-white border-red-100 text-red-800';
            default: return 'bg-white border-blue-100 text-blue-800';
        }
    };

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-black/5 animate-fade-in ${getStyles()}`}>
            {getIcon()}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <X size={14} className="opacity-50" />
            </button>
        </div>
    );
};
