import React from 'react';
import { InputField, CheckboxField, CollapsibleSection } from './UI';
import { calculateNut } from '../utils/helpers';
import { Icons } from './Icons';

// --- KONSTANTEN FÜR AUSWAHLLISTEN ---
export const PUMP_CLASSES = {
    1: { label: "Klasse 1: Chemienormpumpe (ISO 2858)", fields: ["impellerType", "sealType"] },
    2: { label: "Klasse 2: Magnetkupplungspumpe", fields: ["magnetPower", "containmentShell"] },
    3: { label: "Klasse 3: Hochdruckpumpe", fields: ["stages", "maxPressure"] },
    4: { label: "Klasse 4: Tauchmotorpumpe", fields: ["cableLength", "immersionDepth"] },
    5: { label: "Klasse 5: Schlauchpumpe", fields: ["hoseMaterial", "hoseDiameter"] },
    6: { label: "Klasse 6: Exzenterschneckenpumpe", fields: ["statorMaterial", "rotorMaterial"] },
    7: { label: "Klasse 7: Dosierpumpe", fields: ["diaphragmMaterial", "dosingRate"] }
};

const HERSTELLER_LIST = ["RICHTER", "KSB", "Klaus Union", "Flowserve", "Allweiler", "Netzsch"];
const DICHTUNG_LIST = ["Gleitringdichtung", "Packung", "Magnetkupplung", "Spalttopfmotor"];
const ZONE_LIST = ["II 1G", "II 2G", "II 3G", "Keine"];

// --- FORMULAR 1: NEUAUFSTELLUNG ---
export const MachineDataForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...data, [name]: value };
        // Automatische Nut-Berechnung bei Wellenänderung
        if(name === 'durchmesser_pumpe') newData.nut = calculateNut(value);
        if(name === 'durchmesser_motor') newData.nut_motor = calculateNut(value);
        onChange(newData);
    };

    return (
        <div className="animate-in pb-24">
            <CollapsibleSection title="Allgemeine Informationen">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Werk" name="werk" value={data.werk} onChange={handleFieldChange} placeholder="z.B. Clariant" />
                    <InputField label="Anlage" name="anlage" value={data.anlage} onChange={handleFieldChange} />
                    <InputField label="Position" name="position" value={data.position} onChange={handleFieldChange} />
                    <InputField label="Technischer Platz" name="tech_platz" value={data.tech_platz} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Ansprechpartner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Betriebsingenieur" name="betriebsingenieur" value={data.betriebsingenieur} onChange={handleFieldChange} />
                    <InputField label="Sachbearbeiter (Ync)" name="ync_bearbeiter" value={data.ync_bearbeiter} onChange={handleFieldChange} />
                    <InputField label="E-Mail" name="mail" value={data.mail} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Pumpendaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Pumpen-Nr." name="nummer_pumpe" value={data.nummer_pumpe} onChange={handleFieldChange} required />
                    <InputField label="Hersteller" name="hersteller" value={data.hersteller} onChange={handleFieldChange} list={HERSTELLER_LIST} />
                    <InputField label="Pumpentyp" name="typ" value={data.typ} onChange={handleFieldChange} />
                    <InputField label="Wellendurchmesser [mm]" name="durchmesser_pumpe" value={data.durchmesser_pumpe} onChange={handleFieldChange} />
                    <InputField label="Nut [mm]" name="nut" value={data.nut} onChange={handleFieldChange} placeholder="Auto" />
                    <InputField label="Wellenabdichtung" name="dichtung_pumpe" value={data.dichtung_pumpe} onChange={handleFieldChange} list={DICHTUNG_LIST} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                    <div className="md:col-span-3 text-xs font-bold text-slate-400 uppercase">ATEX - Pumpe</div>
                    <InputField label="Zone" name="zone" value={data.zone} onChange={handleFieldChange} list={ZONE_LIST} />
                    <InputField label="Temperaturklasse" name="temp_klasse" value={data.temp_klasse} onChange={handleFieldChange} list={["T1", "T2", "T3", "T4"]} />
                    <InputField label="Gruppe" name="gruppe" value={data.gruppe} onChange={handleFieldChange} list={["IIA", "IIB", "IIC"]} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Motordaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Motoren-Nr." name="nummer_motor" value={data.nummer_motor} onChange={handleFieldChange} />
                    <InputField label="Leistung [kW]" name="leistung" value={data.leistung} onChange={handleFieldChange} />
                    <InputField label="Drehzahl [1/min]" name="drehzahl" value={data.drehzahl} onChange={handleFieldChange} />
                    <InputField label="Wellendurchmesser [mm]" name="durchmesser_motor" value={data.durchmesser_motor} onChange={handleFieldChange} />
                    <InputField label="Nut [mm]" name="nut_motor" value={data.nut_motor} onChange={handleFieldChange} placeholder="Auto" />
                    <InputField label="Bauform" name="bauform" value={data.bauform} onChange={handleFieldChange} list={["B3", "B5", "B35", "V1"]} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Peripherie & Abschluss">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CheckboxField label="Schwingschienen" name="schwingschienen" value={data.schwingschienen} onChange={handleFieldChange} />
                    <CheckboxField label="Überstand erlaubt" name="ueberstand" value={data.ueberstand} onChange={handleFieldChange} />
                    <CheckboxField label="mit Stützen" name="stuetzen" value={data.stuetzen} onChange={handleFieldChange} />
                    <CheckboxField label="verschraubt" name="verschraubt" value={data.verschraubt} onChange={handleFieldChange} />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bemerkungen</label>
                    <textarea name="bemerkung_bestellung" value={data.bemerkung_bestellung || ''} onChange={handleFieldChange} rows="3" className="w-full p-2.5 border border-slate-300 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                    <Icons.AlertTriangle className="text-orange-600 mt-1" />
                    <p className="text-sm text-orange-700 leading-snug">
                        Hinweis: Eine Änderung der Förderhöhe kann Auswirkungen auf den Absicherungsdruck von Druckbehältern und Rohrleitungen haben.
                    </p>
                </div>
            </CollapsibleSection>
        </div>
    );
};

// --- FORMULAR 2: MASSBLATT (TECHNISCHE ZEICHNUNG) ---
export const TechnicalDrawingForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => onChange({ ...data, [e.target.name]: e.target.value });
    
    return (
        <div className="animate-in pb-24">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                {/* Anzeige der hochgeladenen SVG-Datei aus dem public-Ordner */}
                <div className="border-2 border-slate-100 rounded bg-white mb-8 overflow-hidden flex justify-center p-4">
                    <img 
                        src="/zeichnung_aufstellung.svg" 
                        alt="Technische Zeichnung" 
                        className="max-h-[400px] w-auto object-contain transform rotate-90"
                        onError={(e) => { e.target.style.display = 'none'; console.error("Bilddatei nicht gefunden"); }}
                    />
                </div>

                <h3 className="font-bold text-lg mb-4">Maße eingeben</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Bezeichnung" name="drawingTitle" value={data.drawingTitle} onChange={handleFieldChange} required />
                    <div className="md:col-span-3 border-b border-slate-100 mt-4"></div>
                    
                    <InputField label="L Gesamt (mm)" name="l_total" value={data.l_total} onChange={handleFieldChange} placeholder="z.B. 842" />
                    <InputField label="L Grundplatte (mm)" name="l_base" value={data.l_base} onChange={handleFieldChange} placeholder="z.B. 800" />
                    <InputField label="L Bohrung (mm)" name="l_mount" value={data.l_mount} onChange={handleFieldChange} />
                    <InputField label="H Gesamt (mm)" name="h_total" value={data.h_total} onChange={handleFieldChange} />
                    <InputField label="H Achse (mm)" name="h_center" value={data.h_center} onChange={handleFieldChange} />
                    <InputField label="Breite (mm)" name="w_base" value={data.w_base} onChange={handleFieldChange} />
                    <InputField label="DN Saug" name="dn_suc" value={data.dn_suc} onChange={handleFieldChange} />
                    <InputField label="DN Druck" name="dn_dis" value={data.dn_dis} onChange={handleFieldChange} />
                </div>
            </div>
        </div>
    );
};

// --- FORMULAR 3: AGGREGAT-ANFORDERUNG ---
export const AggregateRequestForm = ({ data, onChange }) => {
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };
    
    const pumpClass = data.pumpClass || '1';
    const currentClassConfig = PUMP_CLASSES[pumpClass];

    return (
        <div className="animate-in pb-24">
            <CollapsibleSection title="Pumpen-Klassifizierung">
                <div className="mb-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Klasse wählen</label>
                    <select 
                        name="pumpClass" 
                        value={pumpClass} 
                        onChange={handleFieldChange} 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {Object.entries(PUMP_CLASSES).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Projektdaten">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Projekt" name="project" value={data.project} onChange={handleFieldChange} />
                    <InputField label="Datum" name="date" type="date" value={data.date} onChange={handleFieldChange} />
                    <InputField label="Anforderer" name="requester" value={data.requester} onChange={handleFieldChange} />
                    <InputField label="Abteilung" name="department" value={data.department} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Betriebsdaten">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Medium" name="medium" value={data.medium} onChange={handleFieldChange} />
                    <InputField label="Temperatur [°C]" name="temp" value={data.temp} onChange={handleFieldChange} />
                    <InputField label="Förderstrom [m³/h]" name="flow" value={data.flow} onChange={handleFieldChange} />
                    <InputField label="Förderhöhe [m]" name="head" value={data.head} onChange={handleFieldChange} />
                    <InputField label="Dichte [kg/dm³]" name="density" value={data.density} onChange={handleFieldChange} />
                    <InputField label="Viskosität [mPas]" name="viscosity" value={data.viscosity} onChange={handleFieldChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={`Spezifische Daten (${currentClassConfig.label})`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentClassConfig.fields.map(fieldKey => (
                        <InputField 
                            key={fieldKey} 
                            label={fieldKey.replace(/([A-Z])/g, ' $1').trim()} 
                            name={fieldKey} 
                            value={data[fieldKey]} 
                            onChange={handleFieldChange} 
                        />
                    ))}
                </div>
            </CollapsibleSection>
        </div>
    );
};
