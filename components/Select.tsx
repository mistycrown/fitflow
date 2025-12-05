import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = '请选择',
    className = '',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-between px-4 py-2.5 
          bg-zinc-50 border rounded-xl text-left transition-all duration-200
          ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 hover:border-zinc-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
                disabled={disabled}
            >
                <span className={`block truncate ${selectedOption ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-100 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                  ${option.value === value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-zinc-700 hover:bg-zinc-50'}
                `}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && <Check size={14} />}
                            </div>
                        ))}
                        {options.length === 0 && (
                            <div className="px-3 py-2 text-sm text-zinc-400 text-center">
                                无选项
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
