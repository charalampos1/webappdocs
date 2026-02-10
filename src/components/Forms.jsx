import React, { useEffect } from 'react';
import { InputField, CheckboxField, CollapsibleSection } from './UI';
import { calculateNut } from '../utils/helpers';

export const MachineDataForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...data, [name]: value };
        if(name === 'durchmesser_pumpe') newData.nut = calculateNut(value);
        if(name === 'durchmesser_motor') newData.nut_motor = calculateNut(value);
        onChange(newData);
    };

    return (
        <div className="animate-in pb-24">
            <CollapsibleSection title="Pumpendaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Pumpen-Nr." name="nummer_pumpe" value={data.nummer_pumpe} onChange={handleFieldChange} required />
                    <InputField label="Hersteller" name="hersteller" value={data.hersteller} onChange={handleFieldChange} list={["RICHTER", "KSB", "Klaus Union"]} />
                    <InputField label="Wellendurchmesser [mm]" name="durchmesser_pumpe" value={data.durchmesser_pumpe} onChange={handleFieldChange} />
                    <InputField label="Nut [mm]" name="nut" value={data.nut} onChange={handleFieldChange} placeholder="Auto" />
                </div>
            </CollapsibleSection>
            {/* Hier können die weiteren Sektionen aus deinem Original-Code analog eingefügt werden */}
        </div>
    );
};

export const TechnicalDrawingForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => onChange({ ...data, [e.target.name]: e.target.value });
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
             <InputField label="Bezeichnung" name="drawingTitle" value={data.drawingTitle} onChange={handleFieldChange} required />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <InputField label="L Gesamt" name="l_total" value={data.l_total} onChange={handleFieldChange} />
                <InputField label="H Gesamt" name="h_total" value={data.h_total} onChange={handleFieldChange} />
                <InputField label="Breite" name="w_base" value={data.w_base} onChange={handleFieldChange} />
             </div>
        </div>
    );
};
