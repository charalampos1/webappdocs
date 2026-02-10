import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { ToastContainer, Modal } from './components/UI';
import { MachineDataForm, TechnicalDrawingForm, AggregateRequestForm } from './components/Forms';
import { NeuaufstellungPrintView } from './components/PrintViews';
import './styles/index.css';

export default function App() {
    const [view, setView] = useState('dashboard'); 
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({});
    const [formType, setFormType] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('machine_db_v3') || '[]');
        setRecords(saved);
    }, []);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    const handleSave = () => {
        if (formType === 'Neuaufstellung' && !formData.nummer_pumpe) return addToast('Pumpen-Nr. fehlt!', 'error');
        
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
        addToast('Erfolgreich gespeichert!');
        setView('dashboard');
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setModalConfig({
            isOpen: true, title: "Löschen?", message: "Datensatz unwiderruflich löschen?", 
            confirmText: "Löschen", type: "danger",
            onConfirm: () => {
                const newRecords = records.filter(r => r.id !== id);
                setRecords(newRecords);
                localStorage.setItem('machine_db_v3', JSON.stringify(newRecords));
                setModalConfig({ isOpen: false });
                addToast('Gelöscht');
            },
            onCancel: () => setModalConfig({ isOpen: false })
        });
    };

    const handleDuplicate = (record, e) => {
        e.stopPropagation();
        const copy = { ...record.data, id: null, nummer_pumpe: (record.data.nummer_pumpe || '') + ' (Kopie)' };
        setFormData(copy);
        setFormType(record.type);
        setView('editor');
        addToast('Kopie erstellt');
    };

    if (view === 'print') {
        return (
            <div className="h-screen overflow-y-auto bg-slate-100 p-8 print:p-0">
                <div className="max-w-[210mm] mx-auto mb-4 flex justify-between no-print">
                    <button onClick={() => setView('editor')} className="px-4 py-2 bg-white rounded shadow font-bold">Zurück</button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-brand-accent text-white rounded shadow font-bold">Drucken</button>
                </div>
                <NeuaufstellungPrintView record={{ id: 'PREVIEW', data: formData, createdAt: new Date().toISOString() }} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-brand-light overflow-hidden">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
            <Modal {...modalConfig} />
            
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-accent text-white p-2 rounded-lg"><Icons.Database /></div>
                    <span className="font-bold text-lg">Manager</span>
                </div>
                <nav className="space-y-2">
                    <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${view === 'dashboard' ? 'bg-blue-50 text-brand-accent' : 'hover:bg-slate-50'}`}><Icons.FileText /> Dashboard</button>
                    <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase">Erstellen</div>
                    <button onClick={() => { setFormType('Neuaufstellung'); setFormData({}); setView('editor'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Plus /> Neuaufstellung</button>
                    <button onClick={() => { setFormType('Zeichnung'); setFormData({}); setView('editor'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.Ruler /> Maßblatt</button>
                    <button onClick={() => { setFormType('Anforderung'); setFormData({}); setView('editor'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><Icons.ClipboardList /> Anforderung</button>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Suche..." className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 w-64 outline-none focus:ring-2 focus:ring-brand-accent" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {view === 'dashboard' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {records.filter(r => JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())).map(record => (
                                <div key={record.id} onClick={() => { setFormData(record.data); setFormType(record.type); setView('editor'); }}
                                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">{record.type}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => handleDuplicate(record, e)} className="p-1 hover:text-brand-accent"><Icons.Copy /></button>
                                            <button onClick={(e) => handleDelete(record.id, e)} className="p-1 hover:text-red-500"><Icons.Trash /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate">{record.data.nummer_pumpe || record.data.drawingTitle || record.data.project || 'Unbenannt'}</h3>
                                    <p className="text-xs text-slate-400 mt-4">{new Date(record.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500"><Icons.ArrowLeft /> Zurück</button>
                                <div className="flex gap-3">
                                    <button onClick={() => setView('print')} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors flex items-center gap-2"><Icons.Printer /> Vorschau</button>
                                    <button onClick={handleSave} className="bg-brand-accent text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2"><Icons.Save /> Speichern</button>
                                </div>
                            </div>
                            {formType === 'Neuaufstellung' && <MachineDataForm data={formData} onChange={setFormData} />}
                            {formType === 'Zeichnung' && <TechnicalDrawingForm data={formData} onChange={setFormData} />}
                            {formType === 'Anforderung' && <AggregateRequestForm data={formData} onChange={setFormData} />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
