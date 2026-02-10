import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { ToastContainer, Modal } from './components/UI';
import { MachineDataForm, TechnicalDrawingForm } from './components/Forms';
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
        <div className="flex h-screen bg-brand-light">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
            
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-accent text-white p-2 rounded-lg"><Icons.Database /></div>
                    <span className="font-bold text-lg">Manager</span>
                </div>
                <nav className="space-y-2">
                    <button onClick={() => setView('dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.FileText /> Dashboard</button>
                    <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase">Erstellen</div>
                    <button onClick={() => startNew('Neuaufstellung')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Plus /> Neuaufstellung</button>
                    <button onClick={() => startNew('Zeichnung')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Ruler /> Maßblatt</button>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                    <input 
                        type="text" placeholder="Suche..." 
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-brand-accent"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {view === 'dashboard' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {records.filter(r => JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())).map(record => (
                                <div key={record.id} onClick={() => { setFormData(record.data); setFormType(record.type); setView('editor'); }}
                                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all">
                                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">{record.type}</span>
                                    <h3 className="font-bold mt-2">{record.data.nummer_pumpe || record.data.drawingTitle || 'Unbenannt'}</h3>
                                    <p className="text-xs text-slate-400 mt-4">{new Date(record.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500"><Icons.ArrowLeft /> Zurück</button>
                                <button onClick={handleSave} className="bg-brand-accent text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200">Speichern</button>
                            </div>
                            {formType === 'Neuaufstellung' ? <MachineDataForm data={formData} onChange={setFormData} /> : <TechnicalDrawingForm data={formData} onChange={setFormData} />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
