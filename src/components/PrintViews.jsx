import React from 'react';
import { formatDate } from '../utils/helpers';
import { PUMP_CLASSES } from './Forms';

// Gemeinsamer Header für alle Druckansichten
const PrintHeader = ({ title, subtitle, record }) => (
    <div className="h-24 flex justify-between items-end border-b-4 border-black pb-2 mb-6">
        <div className="text-left">
            <h1 className="text-3xl font-black uppercase tracking-widest text-black">{title}</h1>
            <p className="text-lg font-light text-gray-600">{subtitle}</p>
        </div>
        <div className="text-right text-xs text-black">
            <p className="font-bold">ID: {record.id}</p>
            <p>Datum: {formatDate(record.createdAt)}</p>
        </div>
    </div>
);

// Hilfskomponente für Daten-Tabellen
const DataGrid = ({ title, fields }) => (
    <div className="mb-6 break-inside-avoid">
        <h2 className="text-base font-bold text-black border-b-2 border-black pb-1 mb-3 uppercase bg-gray-100 pl-2">{title}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1"> 
            {fields.map(([label, val]) => (
                <div key={label} className="flex justify-between border-b border-gray-200 py-1 px-2 items-baseline">
                    <span className="text-[9pt] text-gray-600">{label}</span>
                    <span className="text-[9pt] font-bold text-black text-right">{val || '-'}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- 1. DRUCKANSICHT: NEUAUFSTELLUNG ---
export const NeuaufstellungPrintView = ({ record }) => {
    const { data } = record;
    return (
        <div className="bg-white text-black w-full max-w-[210mm] mx-auto p-4">
            <PrintHeader title="Datenblatt" subtitle="Neuaufstellung" record={record} />
            <DataGrid title="Allgemeine Informationen" fields={[['Werk', data.werk], ['Anlage', data.anlage], ['Position', data.position], ['Technischer Platz', data.tech_platz]]} />
            <DataGrid title="Pumpendaten" fields={[['Pumpen-Nr.', data.nummer_pumpe], ['Hersteller', data.hersteller], ['Typ', data.typ], ['Wellen-Ø', data.durchmesser_pumpe], ['Nut', data.nut], ['Dichtung', data.dichtung_pumpe]]} />
            <DataGrid title="Motordaten" fields={[['Motoren-Nr.', data.nummer_motor], ['Leistung', data.leistung + ' kW'], ['Drehzahl', data.drehzahl + ' 1/min'], ['Wellen-Ø', data.durchmesser_motor]]} />
            
            <div className="mt-12 pt-6 border-t-2 border-black break-inside-avoid">
                <p className="font-bold text-[10pt] mb-10 uppercase">Aggregat komplett und einsatzbereit erhalten:</p>
                <div className="flex gap-16">
                    <div className="w-1/3 border-b border-black text-[7pt] uppercase text-gray-500">Datum</div>
                    <div className="flex-1 border-b border-black text-[7pt] uppercase text-gray-500">Unterschrift</div>
                </div>
            </div>
        </div>
    );
};

// --- 2. DRUCKANSICHT: MASSBLATT ---
export const DrawingPrintView = ({ record }) => {
    const { data } = record;
    return (
        <div className="bg-white text-black w-full max-w-[210mm] mx-auto p-4">
            <PrintHeader title="Maßblatt" subtitle={data.drawingTitle || 'Technische Zeichnung'} record={record} />
            
            {/* Das Bild in der Druckansicht (ebenfalls gedreht) */}
            <div className="border-2 border-black mb-8 flex justify-center p-12">
                <img src="/zeichnung_aufstellung.svg" alt="Zeichnung" className="max-h-[350px] w-auto transform rotate-90" />
            </div>

            <DataGrid title="Abmessungen" fields={[
                ['Länge Gesamt', data.l_total + ' mm'],
                ['Länge Grundplatte', data.l_base + ' mm'],
                ['Bohrungsabstand', data.l_mount + ' mm'],
                ['Höhe Gesamt', data.h_total + ' mm'],
                ['Höhe Achse', data.h_center + ' mm'],
                ['Breite', data.w_base + ' mm'],
                ['DN Saug / Druck', (data.dn_suc || '-') + ' / ' + (data.dn_dis || '-')]
            ]} />
        </div>
    );
};

// --- 3. DRUCKANSICHT: ANFORDERUNG ---
export const RequestPrintView = ({ record }) => {
    const { data } = record;
    const currentClass = PUMP_CLASSES[data.pumpClass || '1'];

    return (
        <div className="bg-white text-black w-full max-w-[210mm] mx-auto p-4">
            <PrintHeader title="Anforderung" subtitle={currentClass.label} record={record} />
            
            <DataGrid title="Projektdaten" fields={[['Projekt', data.project], ['Anforderer', data.requester], ['Abteilung', data.department], ['Datum', data.date]]} />
            
            <DataGrid title="Betriebsdaten" fields={[
                ['Medium', data.medium],
                ['Förderstrom', data.flow + ' m³/h'],
                ['Förderhöhe', data.head + ' m'],
                ['Temperatur', data.temp + ' °C'],
                ['Dichte', data.density + ' kg/dm³']
            ]} />

            <DataGrid title="Spezifische Anforderungen" fields={
                currentClass.fields.map(f => [f.replace(/([A-Z])/g, ' $1').trim(), data[f]])
            } />
        </div>
    );
};
