import React from 'react';
import { InputField, CheckboxField, CollapsibleSection } from './UI';
import { calculateNut } from '../utils/helpers';
import { Icons } from './Icons';

// Konstanten für Pumpenklassen
export const PUMP_CLASSES = {
    1: { label: "Klasse 1: Chemienormpumpe (ISO 2858)", fields: ["impellerType", "sealType"] },
    2: { label: "Klasse 2: Magnetkupplungspumpe", fields: ["magnetPower", "containmentShell"] },
    3: { label: "Klasse 3: Hochdruckpumpe", fields: ["stages", "maxPressure"] },
    4: { label: "Klasse 4: Tauchmotorpumpe", fields: ["cableLength", "immersionDepth"] },
    5: { label: "Klasse 5: Schlauchpumpe", fields: ["hoseMaterial", "hoseDiameter"] },
    6: { label: "Klasse 6: Exzenterschneckenpumpe", fields: ["statorMaterial", "rotorMaterial"] },
    7: { label: "Klasse 7: Dosierpumpe", fields: ["diaphragmMaterial", "dosingRate"] }
};

const TechnicalSVG = ({ data }) => {
    const dim = (val) => val ? `${val}` : "[   ]";
    const txtStyle = { fontSize: "14px", fill: "#000", fontFamily: "Arial, sans-serif", textAnchor: "middle" };
    const lineStyle = { stroke: "#000", strokeWidth: "1" };

    return (
        <svg viewBox="0 0 800 500" className="w-full h-full select-none bg-white" style={{minHeight: '400px'}}>
            <g transform="translate(50, 50)">
                <rect x="0" y="250" width="400" height="15" fill="none" stroke="black" strokeWidth="2" />
                <line x1="50" y1="265" x2="50" y2="280" stroke="black" strokeWidth="3" /><line x1="350" y1="265" x2="350" y2="280" stroke="black" strokeWidth="3" />
                <path d="M 40 250 L 40 150 L 80 150 L 80 250 Z" fill="none" stroke="black" strokeWidth="1.5" /><rect x="20" y="160" width="20" height="40" fill="none" stroke="black" /><rect x="50" y="110" width="40" height="40" fill="none" stroke="black" />
                <rect x="200" y="130" width="120" height="100" fill="none" stroke="black" strokeWidth="1.5" /><rect x="210" y="230" width="100" height="20" fill="none" stroke="black" /><line x1="80" y1="180" x2="200" y2="180" stroke="black" strokeWidth="2" /><rect x="120" y="170" width="40" height="20" fill="none" stroke="black" />
                <line x1="0" y1="80" x2="400" y2="80" {...lineStyle} /><text x="200" y="75" {...txtStyle}>{dim(data.l_total)}</text>
                <line x1="0" y1="300" x2="400" y2="300" {...lineStyle} /><text x="200" y="315" {...txtStyle}>{dim(data.l_base)}</text>
                <line x1="50" y1="330" x2="350" y2="330" {...lineStyle} /><text x="200" y="345" {...txtStyle}>{dim(data.l_mount)}</text>
                <text x="-20" y="180" {...txtStyle} textAnchor="end">{dim(data.dn_suc)}</text><text x="70" y="100" {...txtStyle}>{dim(data.dn_dis)}</text>
                <text x="-40" y="220" {...txtStyle} transform="rotate(-90, -40, 220)">{dim(data.h_center)}</text>
            </g>
            <g transform="translate(550, 50)">
                <rect x="-80" y="250" width="160" height="15" fill="none" stroke="black" strokeWidth="2" />
                <line x1="-60" y1="265" x2="-60" y2="280" stroke="black" strokeWidth="3" /><line x1="60" y1="265" x2="60" y2="280" stroke="black" strokeWidth="3" />
                <circle cx="0" cy="180" r="50" fill="none" stroke="black" strokeWidth="1.5" /><rect x="-20" y="110" width="40" height="40" fill="none" stroke="black" />
                <line x1="-80" y1="300" x2="80" y2="300" {...lineStyle} /><text x="0" y="315" {...txtStyle}>{dim(data.w_base)}</text>
                <text x="115" y="200" {...txtStyle} transform="rotate(-90, 115, 200)">{dim(data.h_total)}</text>
                <text x="85" y="145" {...txtStyle} transform="rotate(-90, 85, 145)">{dim(data.h_flange)}</text>
                <line x1="70" y1="180" x2="70" y2="250" {...lineStyle} /><text x="85" y="215" {...txtStyle} transform="rotate(-90, 85, 215)">{dim(data.h_center2 || data.h_center)}</text>
            </g>
        </svg>
    );
};

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
            <CollapsibleSection title="Allgemeine Informationen">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Werk" name="werk" value={data.werk} onChange={handleFieldChange} />
                    <InputField label="Anlage" name="anlage" value={data.anlage} onChange={handleFieldChange} />
                    <InputField label="Position" name="position" value={data.position} onChange={handleFieldChange} />
                    <InputField label="Technischer Platz" name="tech_platz" value={data.tech_platz} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Pumpendaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Pumpen-Nr." name="nummer_pumpe" value={data.nummer_pumpe} onChange={handleFieldChange} required />
                    <InputField label="Hersteller" name="hersteller" value={data.hersteller} onChange={handleFieldChange} list={["RICHTER", "KSB", "Klaus Union"]} />
                    <InputField label="Wellendurchmesser [mm]" name="durchmesser_pumpe" value={data.durchmesser_pumpe} onChange={handleFieldChange} />
                    <InputField label="Nut [mm]" name="nut" value={data.nut} onChange={handleFieldChange} placeholder="Auto" />
                    <InputField label="Wellenabdichtung" name="dichtung_pumpe" value={data.dichtung_pumpe} onChange={handleFieldChange} list={["Packung", "Gleitringdichtung", "hermetisch"]} />
                </div>
                <div className="md:col-span-3 mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3 text-xs font-bold text-slate-400 uppercase">ATEX - Pumpe</div>
                    <InputField label="Zone" name="zone" value={data.zone} onChange={handleFieldChange} list={["II1G", "II2G"]} />
                    <InputField label="Temperaturklasse" name="temp_klasse" value={data.temp_klasse} onChange={handleFieldChange} list={["T1", "T2", "T3", "T4"]} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Motordaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Motoren-Nr." name="nummer_motor" value={data.nummer_motor} onChange={handleFieldChange} />
                    <InputField label="Leistung [kW]" name="leistung" value={data.leistung} onChange={handleFieldChange} />
                    <InputField label="Wellendurchmesser [mm]" name="durchmesser_motor" value={data.durchmesser_motor} onChange={handleFieldChange} />
                    <InputField label="Nut [mm]" name="nut_motor" value={data.nut_motor} onChange={handleFieldChange} placeholder="Auto" />
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Peripherie & Abschluss">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CheckboxField label="Schwingschienen" name="schwingschienen" value={data.schwingschienen} onChange={handleFieldChange} />
                    <CheckboxField label="Überstand erlaubt" name="ueberstand" value={data.ueberstand} onChange={handleFieldChange} />
                    <CheckboxField label="mit Stützen" name="stuetzen" value={data.stuetzen} onChange={handleFieldChange} />
                    <CheckboxField label="verschraubt" name="verschraubt" value={data.verschraubt} onChange={handleFieldChange} />
                </div>
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                    <Icons.AlertTriangle className="text-orange-600 mt-1" />
                    <p className="text-sm text-orange-700 leading-snug">Hinweis: Eine Änderung der Förderhöhe kann Auswirkungen auf den Absicherungsdruck von Druckbehältern und Rohrleitungen haben.</p>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export const TechnicalDrawingForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => onChange({ ...data, [e.target.name]: e.target.value });
    return (
        <div className="animate-in pb-24">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="border-2 border-slate-100 rounded bg-white mb-8 overflow-hidden"><TechnicalSVG data={data} /></div>
                <h3 className="font-bold text-lg mb-4">Maße eingeben</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Bezeichnung" name="drawingTitle" value={data.drawingTitle} onChange={handleFieldChange} required />
                    <div className="md:col-span-3 border-b border-slate-100"></div>
                    <InputField label="L Gesamt" name="l_total" value={data.l_total} onChange={handleFieldChange} placeholder="842" />
                    <InputField label="L Grundplatte" name="l_base" value={data.l_base} onChange={handleFieldChange} placeholder="800" />
                    <InputField label="L Bohrung" name="l_mount" value={data.l_mount} onChange={handleFieldChange} placeholder="540" />
                    <InputField label="H Gesamt" name="h_total" value={data.h_total} onChange={handleFieldChange} placeholder="320" />
                    <InputField label="DN Saug" name="dn_suc" value={data.dn_suc} onChange={handleFieldChange} placeholder="50" />
                    <InputField label="DN Druck" name="dn_dis" value={data.dn_dis} onChange={handleFieldChange} placeholder="32" />
                    <InputField label="Breite" name="w_base" value={data.w_base} onChange={handleFieldChange} placeholder="320" />
                    <InputField label="H Achse" name="h_center" value={data.h_center} onChange={handleFieldChange} placeholder="180" />
                </div>
            </div>
        </div>
    );
};

// Am Ende von src/components/Forms.jsx hinzufügen, falls noch nicht vorhanden:

export const AggregateRequestForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => onChange({ ...data, [e.target.name]: e.target.value });

    return (
        <div className="animate-in pb-24">
            <CollapsibleSection title="Projektdaten">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Projektname" name="project" value={data.project} onChange={handleFieldChange} />
                    <InputField label="Anforderer" name="requester" value={data.requester} onChange={handleFieldChange} />
                    <InputField label="Datum" name="date" type="date" value={data.date} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>
            <CollapsibleSection title="Betriebsdaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Medium" name="medium" value={data.medium} onChange={handleFieldChange} />
                    <InputField label="Förderstrom (m³/h)" name="flow" value={data.flow} onChange={handleFieldChange} />
                    <InputField label="Förderhöhe (m)" name="head" value={data.head} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>
        </div>
    );
};
