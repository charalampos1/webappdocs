import React, { useState } from 'react';
import { Icons } from './Icons';

export const ToastContainer = ({ toasts, removeToast }) => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
            <div key={toast.id} className="animate-in pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-xl border border-gray-100 border-l-4 border-l-brand-accent">
                {toast.type === 'error' ? <Icons.AlertTriangle className="text-red-500" /> : <Icons.Check className="text-green-500" />}
                <span className="text-sm font-medium text-slate-700">{toast.message}</span>
                <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600"><Icons.X /></button>
            </div>
        ))}
    </div>
);

export const Modal = ({ isOpen, title, message, onConfirm, onDiscard, onCancel, confirmText, discardText, cancelText, type }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
                <div className="p-6">
                    <h3 className={`text-lg font-bold mb-2 ${type === 'danger' ? 'text-red-600' : 'text-slate-900'}`}>{title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
                </div>
                <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
                    <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-sm">{cancelText || 'Abbrechen'}</button>
                    {onDiscard && <button onClick={onDiscard} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm">{discardText || 'Verwerfen'}</button>}
                    <button onClick={onConfirm} className={`px-5 py-2 text-white rounded-lg font-medium text-sm ${type === 'danger' ? 'bg-red-600' : 'bg-brand-accent'}`}>{confirmText || 'Bestätigen'}</button>
                </div>
            </div>
        </div>
    );
};

export const InputField = ({ label, name, value, onChange, type = "text", placeholder, required, list }) => {
    const [showList, setShowList] = useState(false);
    const sortedList = list ? [...list].sort((a, b) => a.localeCompare(b)) : [];
    const filteredList = sortedList.filter(item => !value || item.toLowerCase().includes(value.toLowerCase()));

    return (
        <div className="mb-5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input 
                    type={type} name={name} value={value || ''} 
                    onChange={(e) => { onChange(e); setShowList(true); }}
                    onFocus={() => setShowList(true)}
                    onBlur={() => setTimeout(() => setShowList(false), 200)}
                    placeholder={placeholder} autoComplete="off" 
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-accent focus:ring-2 focus:ring-blue-100 shadow-sm"
                />
                {list && showList && filteredList.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                        {filteredList.map((item, idx) => (
                            <li key={idx} onMouseDown={() => onChange({ target: { name, value: item } })}
                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700">
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export const CheckboxField = ({ label, name, value, onChange }) => (
    <div className="mb-5 pt-7">
        <label className="inline-flex items-center cursor-pointer group">
            <input type="checkbox" name={name} checked={value === "Ja"} onChange={(e) => onChange({ target: { name, value: e.target.checked ? "Ja" : "Nein" } })} className="sr-only peer" />
            <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-brand-accent peer-checked:border-brand-accent transition-all flex items-center justify-center">
                {value === "Ja" && <Icons.Check className="text-white" />}
            </div>
            <span className="ml-3 text-sm font-medium text-slate-700">{label}</span>
        </label>
    </div>
);

export const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-200 rounded-xl mb-6 overflow-hidden bg-white shadow-sm">
            <div onClick={() => setIsOpen(!isOpen)} className="bg-slate-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">{title}</h3>
                {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </div>
            {isOpen && <div className="p-6">{children}</div>}
        </div>
    );
};
