import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { ToastContainer, Modal } from './components/UI';
import { MachineDataForm, TechnicalDrawingForm, AggregateRequestForm } from './components/Forms';
import './styles/index.css';

export default function App() {
    const [view, setView] = useState('dashboard'); 
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({});
    const [formType, setFormType] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('machine_db_v3') || '[]');
        setRecords(saved);
    }, []);

    const addToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    const handleSave = () => {
        const newRecord = {
            id: formData.id || Date.now(),
            type: formType,
            data: formData,
            createdAt: formData.createdAt || new Date().toISOString()
        };
        const newRecords = formData.id 
            ? records.map(r => r.id === formData.id ? newRecord : r)
            : [newRecord, ...records];
        
        setRecords(newRecords);
        localStorage.setItem('machine_db_v3', JSON.stringify(newRecords));
        addToast('Gespeichert!');
        setView('dashboard');
    };

    const startNew = (type) => {
        setFormType(type);
        setFormData({});
        setView('editor');
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-brand-light overflow-hidden">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
            
            {/* Sidebar - Nur Desktop */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-accent text-white p-2 rounded-lg"><Icons.Database /></div>
                    <span className="font-bold text-lg">Manager</span>
                </div>
                <nav className="space-y-2">
                    <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${view === 'dashboard' ? 'bg-blue-50 text-brand-accent' : ''}`}><Icons.FileText /> Dashboard</button>
                    <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase">Erstellen</div>
                    <button onClick={() => startNew('Neuaufstellung')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Plus /> Neuaufstellung</button>
                    <button onClick={() => startNew('Zeichnung')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Ruler /> Maßblatt</button>
                </nav>
            </aside>

            {/* Mobile Navigation - Unten fixiert */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
                <button onClick={() => setView('dashboard')} className="flex flex-col items-center gap-1 text-slate-500"><Icons.FileText /> <span className="text-[10px]">Dashboard</span></button>
                <button onClick={() => startNew('Neuaufstellung')} className="flex flex-col items-center gap-1 text-slate-500"><Icons.Plus /> <span className="text-[10px]">Pumpe</span></button>
                <button onClick={() => startNew('Zeichnung')} className="flex flex-col items-center gap-1 text-slate-500"><Icons.Ruler /> <span className="text-[10px]">Maße</span></button>
            </nav>

            <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 md:hidden">
                        <div className="bg-brand-accent text-white p-1 rounded-md"><Icons.Database size={16} /></div>
                        <span className="font-bold text-sm">Manager</span>
                    </div>
                    <input 
                        type="text" placeholder="Suche..." 
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 w-40 md:w-64 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {view === 'dashboard' ? (
                        records.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <div className="p-6 bg-slate-100 rounded-full mb-4"><Icons.FileText size={48} className="text-slate-400" /></div>
                                <h3 className="text-xl font-bold mb-2">Keine Dokumente</h3>
                                <p className="text-sm text-slate-500 max-w-xs">Tippe unten auf das Plus-Symbol, um dein erstes Formular zu erstellen.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {records.filter(r => JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())).map(record => (
                                    <div key={record.id} onClick={() => { setFormData(record.data); setFormType(record.type); setView('editor'); }}
                                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm active:scale-95 transition-all">
                                        <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{record.type}</span>
                                        <h3 className="font-bold mt-2 text-slate-800">{record.data.nummer_pumpe || record.data.drawingTitle || 'Unbenannt'}</h3>
                                        <p className="text-[10px] text-slate-400 mt-4">{new Date(record.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={() => setView('dashboard')} className="flex items-center gap-1 text-sm text-slate-500"><Icons.ArrowLeft /> Zurück</button>
                                <button onClick={handleSave} className="bg-brand-accent text-white px-5 py-2 rounded-lg font-bold shadow-lg text-sm">Speichern</button>
                            </div>
                            {formType === 'Neuaufstellung' ? <MachineDataForm data={formData} onChange={setFormData} /> : <TechnicalDrawingForm data={formData} onChange={setFormData} />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
