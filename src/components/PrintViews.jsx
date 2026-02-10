import React from 'react';
import { formatDate } from '../utils/helpers';

const PrintHeader = ({ title, subtitle, record }) => (
    <div className="h-24 flex justify-between items-end border-b-4 border-black pb-2 mb-6">
        <div className="text-left"><h1 className="text-3xl font-black uppercase tracking-widest text-black">{title}</h1><p className="text-lg font-light text-gray-600">{subtitle}</p></div>
        <div className="text-right text-xs text-black">
            <p className="font-bold">ID: {record.id}</p>
            <p>Datum: {formatDate(record.createdAt)}</p>
        </div>
    </div>
);

export const NeuaufstellungPrintView = ({ record }) => {
    const { data } = record;
    const renderSection = (title, fields) => (
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

    return (
        <div className="bg-white text-black w-full max-w-[210mm] mx-auto p-4">
            <PrintHeader title="Datenblatt" subtitle="Neuaufstellung" record={record} />
            {renderSection('Allgemeine Informationen', [['Werk', data.werk], ['Anlage', data.anlage], ['Technischer Platz', data.tech_platz]])}
            {renderSection('Pumpendaten', [['Pumpen-Nr.', data.nummer_pumpe], ['Hersteller', data.hersteller], ['Wellen-Ø', data.durchmesser_pumpe], ['Nut', data.nut]])}
            <div className="mt-12 pt-6 border-t-2 border-black">
                <p className="font-bold text-[10pt] mb-10 uppercase">Aggregat komplett und einsatzbereit erhalten:</p>
                <div className="flex gap-16">
                    <div className="w-1/3 border-b border-black text-[7pt] uppercase text-gray-500">Datum</div>
                    <div className="flex-1 border-b border-black text-[7pt] uppercase text-gray-500">Unterschrift</div>
                </div>
            </div>
        </div>
    );
};
