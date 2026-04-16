import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

// ─── Mock patient data ────────────────────────────────────────────────────────
const mockPatient = {
  id: '1',
  name: 'Juan Dela Cruz',
  lastName: 'Dela Cruz',
  firstName: 'Juan',
  middleName: 'Santos',
  birthday: '2016-03-15',
  age: 10,
  sex: 'Male',
  address: 'Blk 12 Lot 5 Bagong Tanyag, Taguig City',
  grade: 'Grade 4',
  section: 'Sampaguita',
  school: 'Bagong Tanyag Integrated School',
  contactNumber: '09171234567',
  philhealthNumber: '12-345678901-2',
  philhealthStatus: 'Dependent',
  is4Ps: false,
  guardianName: 'Maria Dela Cruz',
  guardianContact: '09171234567',
  consentStatus: 'complete',
  riskLevel: 'high',
};

// ─── FDI tooth layout ─────────────────────────────────────────────────────────
const upperPermanent = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerPermanent = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const upperTemporary = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const lowerTemporary = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];
const temporaryTeeth = new Set([...upperTemporary, ...lowerTemporary]);

const conditionColors: Record<string, string> = {
  '√': 'bg-green-50 border-green-400',
  'D': 'bg-red-100 border-red-500',
  'd': 'bg-red-100 border-red-400',
  'M': 'bg-slate-200 border-slate-500',
  'm': 'bg-slate-200 border-slate-400',
  'F': 'bg-blue-100 border-blue-500',
  'f': 'bg-blue-100 border-blue-400',
  'DX': 'bg-orange-100 border-orange-500',
  'dx': 'bg-orange-100 border-orange-400',
  'Un': 'bg-purple-100 border-purple-400',
};

const SCHOOL_YEARS = ['2024-2025', '2025-2026'];

// ─── DMFT calculation ─────────────────────────────────────────────────────────
const computeDMFT = (chart: Record<number, { condition: string; treatment: string }>) => {
  let d = 0, m = 0, f = 0, D = 0, M = 0, F = 0;
  Object.entries(chart).forEach(([tooth, data]) => {
    const n = parseInt(tooth);
    const c = data.condition;
    if (temporaryTeeth.has(n)) {
      if (c === 'd') d++;
      if (c === 'm') m++;
      if (c === 'f') f++;
    } else {
      if (c === 'D') D++;
      if (c === 'M') M++;
      if (c === 'F') F++;
    }
  });
  return { d, m, f, t: d + m + f, D, M, F, T: D + M + F };
};

// ─── Main component ───────────────────────────────────────────────────────────
export const DentalChart = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'history' | 'chart' | 'appointments'>('history');
  const [selectedYear, setSelectedYear] = useState(0); // index into SCHOOL_YEARS
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(mockPatient.consentStatus === 'complete');
  const [dataPrivacyAck, setDataPrivacyAck] = useState(false);
  const [saved, setSaved] = useState(false);

  // Per-year dental chart data
  const [chartData, setChartData] = useState<Record<number, Record<number, { condition: string; treatment: string }>>>({
    0: { 36: { condition: 'D', treatment: 'PF' }, 46: { condition: 'M', treatment: '' }, 11: { condition: '√', treatment: 'FV' }, 16: { condition: 'F', treatment: '' } },
    1: {},
  });

  // Per-year medical history
  const [medHistory, setMedHistory] = useState<Record<number, Record<string, any>>>({
    0: { dateExamined: '2025-03-10', allergies: '', hypertension: false, diabetes: false, bloodDisorders: false, cardiovascular: false, thyroid: false, hepatitis: '', malignancy: '', hospitalization: '', bloodTransfusion: '', tattoo: false, others: '' },
    1: { dateExamined: '2026-03-10', allergies: '', hypertension: false, diabetes: false, bloodDisorders: false, cardiovascular: false, thyroid: false, hepatitis: '', malignancy: '', hospitalization: '', bloodTransfusion: '', tattoo: false, others: '' },
  });

  const [dietHistory, setDietHistory] = useState<Record<number, Record<string, boolean>>>({
    0: { sugarSweetened: true, alcoholDrinker: false, tobaccoUser: false, betelNut: false, bodyPiercing: false, nailBiting: true, thumbsucking: false },
    1: { sugarSweetened: false, alcoholDrinker: false, tobaccoUser: false, betelNut: false, bodyPiercing: false, nailBiting: false, thumbsucking: false },
  });

  const [oralCondition, setOralCondition] = useState<Record<number, Record<string, any>>>({
    0: { orallyFit: false, dentalCaries: true, gingivitis: false, periodontal: false, debris: true, calculus: false, abnormalGrowth: false, cleftLipPalate: false, edentulous: false, others: '' },
    1: { orallyFit: false, dentalCaries: false, gingivitis: false, periodontal: false, debris: false, calculus: false, abnormalGrowth: false, cleftLipPalate: false, edentulous: false, others: '' },
  });

  const currentChart = chartData[selectedYear] || {};
  const dmft = computeDMFT(currentChart);
  const gc = getGradeColor(mockPatient.grade);

  const handleToothClick = (toothNumber: number) => {
    const isTemp = temporaryTeeth.has(toothNumber);
    if (selectedCondition) {
      const code = isTemp ? selectedCondition.toLowerCase() : selectedCondition.toUpperCase();
      const current = currentChart[toothNumber]?.condition;
      setChartData(prev => ({
        ...prev,
        [selectedYear]: {
          ...prev[selectedYear],
          [toothNumber]: {
            ...prev[selectedYear]?.[toothNumber],
            condition: current === code ? '' : code,
            treatment: prev[selectedYear]?.[toothNumber]?.treatment || '',
          },
        },
      }));
    } else if (selectedTreatment) {
      const current = currentChart[toothNumber]?.treatment;
      setChartData(prev => ({
        ...prev,
        [selectedYear]: {
          ...prev[selectedYear],
          [toothNumber]: {
            ...prev[selectedYear]?.[toothNumber],
            condition: prev[selectedYear]?.[toothNumber]?.condition || '',
            treatment: current === selectedTreatment ? '' : selectedTreatment,
          },
        },
      }));
    }
  };

  const updateMedField = (field: string, value: any) => {
    setMedHistory(prev => ({ ...prev, [selectedYear]: { ...prev[selectedYear], [field]: value } }));
  };
  const updateDietField = (field: string, value: boolean) => {
    setDietHistory(prev => ({ ...prev, [selectedYear]: { ...prev[selectedYear], [field]: value } }));
  };
  const updateOralField = (field: string, value: any) => {
    setOralCondition(prev => ({ ...prev, [selectedYear]: { ...prev[selectedYear], [field]: value } }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToothButton = ({ num }: { num: number }) => {
    const data = currentChart[num];
    const cond = data?.condition || '';
    const treat = data?.treatment || '';
    const colorClass = conditionColors[cond] || 'bg-white border-gray-300';
    const isSelected = selectedCondition || selectedTreatment;
    return (
      <button
        onClick={() => handleToothClick(num)}
        className={`relative w-9 h-10 border-2 rounded-sm text-center transition-all ${colorClass} ${isSelected ? 'hover:border-[#1E40AF] hover:ring-2 hover:ring-blue-300 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="text-[7px] text-slate-400 leading-none mt-0.5">{num}</div>
        {cond && <div className="text-[9px] font-bold text-slate-700 leading-none">{cond}</div>}
        {treat && <div className="text-[7px] text-blue-600 leading-none">{treat}</div>}
      </button>
    );
  };

  const CheckRow = ({ label, field, value, onChange }: { label: string; field: string; value: boolean; onChange: (f: string, v: boolean) => void }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-700">{label}</span>
      <div className="flex gap-3">
        {SCHOOL_YEARS.map((yr, idx) => (
          <input key={idx} type="checkbox" checked={idx === selectedYear ? value : false}
            onChange={e => idx === selectedYear && onChange(field, e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600" />
        ))}
      </div>
    </div>
  );

  const conditionCodes = [
    { code: '√', label: 'Sound/Sealed' },
    { code: 'D', label: 'Decayed' },
    { code: 'M', label: 'Missing' },
    { code: 'F', label: 'Filled' },
    { code: 'DX', label: 'For Extraction' },
    { code: 'Un', label: 'Unerupted' },
    { code: 'S', label: 'Supernumerary' },
    { code: 'JC', label: 'Jacket Crown' },
    { code: 'P', label: 'Pontic' },
  ];

  const treatmentCodes = [
    { code: 'FV', label: 'Fluoride Varnish' },
    { code: 'PFS', label: 'Pit & Fissure Sealant' },
    { code: 'PF', label: 'Permanent Filling' },
    { code: 'TF', label: 'Temporary Filling' },
    { code: 'X', label: 'Extraction' },
    { code: 'SDF', label: 'Silver Diamine Fluoride' },
  ];

  const med = medHistory[selectedYear] || {};
  const diet = dietHistory[selectedYear] || {};
  const oral = oralCondition[selectedYear] || {};

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dental-charts" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Individual Patient Treatment Record</h1>
            <p className="text-xs text-gray-500">{mockPatient.lastName}, {mockPatient.firstName} · {mockPatient.school} · {mockPatient.grade}-{mockPatient.section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedYear(Math.max(0, selectedYear - 1))} disabled={selectedYear === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg">{SCHOOL_YEARS[selectedYear]}</span>
          <button onClick={() => setSelectedYear(Math.min(SCHOOL_YEARS.length - 1, selectedYear + 1))} disabled={selectedYear === SCHOOL_YEARS.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#1E40AF] text-white hover:bg-blue-700'}`}>
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: gc.light, color: gc.solid }} className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
              {mockPatient.firstName[0]}{mockPatient.lastName[0]}
            </div>
            <div>
              <div className="font-bold text-gray-900">{mockPatient.lastName}, {mockPatient.firstName} {mockPatient.middleName}</div>
              <div className="text-xs text-gray-500">{mockPatient.school}</div>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ backgroundColor: gc.light, color: gc.solid }} className="text-xs font-semibold px-2 py-0.5 rounded-full">{mockPatient.grade} — {mockPatient.section}</span>
                {mockPatient.riskLevel === 'high' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">High Risk</span>}
                {mockPatient.consentStatus === 'complete' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Consent Complete</span>}
                {mockPatient.is4Ps && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">4Ps</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            ['Birthday', mockPatient.birthday],
            ['Age', `${mockPatient.age} years`],
            ['Sex', mockPatient.sex],
            ['Contact', mockPatient.contactNumber],
            ['Address', mockPatient.address],
            ['PhilHealth', `${mockPatient.philhealthNumber} (${mockPatient.philhealthStatus})`],
            ['Guardian', mockPatient.guardianName],
            ['Guardian Contact', mockPatient.guardianContact],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="text-gray-400 font-medium">{label}</div>
              <div className="text-gray-900">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'history', label: 'Page 1 — History & Oral Condition' },
            { key: 'chart', label: 'Page 2 — Dental Charting' },
            { key: 'appointments', label: 'Page 3 — Consent & Appointments' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? 'border-b-2 border-[#1E40AF] text-[#1E40AF] bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: History ── */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-5">
            {/* Year columns header */}
            <div className="flex items-center justify-end gap-8 text-xs font-semibold text-gray-500 mb-1">
              {SCHOOL_YEARS.map(yr => <span key={yr} className={`w-16 text-center ${SCHOOL_YEARS.indexOf(yr) === selectedYear ? 'text-[#1E40AF]' : ''}`}>{yr}</span>)}
            </div>

            {/* Date Examined */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-700">Date Examined</span>
              <div className="flex gap-8">
                {SCHOOL_YEARS.map((yr, idx) => (
                  <input key={idx} type="date" value={idx === selectedYear ? (med.dateExamined || '') : ''}
                    onChange={e => idx === selectedYear && updateMedField('dateExamined', e.target.value)}
                    className="w-36 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1 border-b-2 border-gray-200">Medical History</div>
              <div className="space-y-0">
                {[
                  ['Allergies', 'allergies', 'text'],
                  ['Hypertension / CVA', 'hypertension', 'check'],
                  ['Diabetes Mellitus', 'diabetes', 'check'],
                  ['Blood Disorders', 'bloodDisorders', 'check'],
                  ['Cardiovascular / Heart Diseases', 'cardiovascular', 'check'],
                  ['Thyroid Disorders', 'thyroid', 'check'],
                  ['Hepatitis', 'hepatitis', 'text'],
                  ['Malignancy', 'malignancy', 'text'],
                  ['History of Hospitalization', 'hospitalization', 'text'],
                  ['Blood Transfusion', 'bloodTransfusion', 'text'],
                  ['Tattoo', 'tattoo', 'check'],
                  ['Others', 'others', 'text'],
                ].map(([label, field, type]) => (
                  <div key={field} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-700">{label}</span>
                    <div className="flex gap-8">
                      {SCHOOL_YEARS.map((yr, idx) => (
                        <div key={idx} className="w-16 flex justify-center">
                          {type === 'check' ? (
                            <input type="checkbox" checked={idx === selectedYear ? !!(med as any)[field] : false}
                              onChange={e => idx === selectedYear && updateMedField(field as string, e.target.checked)}
                              className="w-4 h-4 rounded accent-blue-600" />
                          ) : (
                            <input type="text" value={idx === selectedYear ? ((med as any)[field] || '') : ''}
                              onChange={e => idx === selectedYear && updateMedField(field as string, e.target.value)}
                              placeholder="—" className="w-16 text-xs border border-gray-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary / Social History */}
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1 border-b-2 border-gray-200">Dietary Habits and Social History</div>
              {[
                ['Sugar Sweetened Beverages/Food', 'sugarSweetened'],
                ['Alcohol Drinker', 'alcoholDrinker'],
                ['Tobacco User', 'tobaccoUser'],
                ['Betel Nut Chewer', 'betelNut'],
                ['Body Piercing', 'bodyPiercing'],
                ['Nail Biting', 'nailBiting'],
                ['Thumbsucking', 'thumbsucking'],
              ].map(([label, field]) => (
                <div key={field} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-xs text-gray-700">{label}</span>
                  <div className="flex gap-8">
                    {SCHOOL_YEARS.map((yr, idx) => (
                      <div key={idx} className="w-16 flex justify-center">
                        <input type="checkbox" checked={idx === selectedYear ? !!(diet as any)[field] : false}
                          onChange={e => idx === selectedYear && updateDietField(field as string, e.target.checked)}
                          className="w-4 h-4 rounded accent-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Oral Health Condition */}
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1 border-b-2 border-gray-200">Oral Health Condition</div>
              {[
                ['Orally Fit', 'orallyFit', 'check'],
                ['Dental Caries', 'dentalCaries', 'check'],
                ['Gingivitis', 'gingivitis', 'check'],
                ['Periodontal Disease', 'periodontal', 'check'],
                ['Debris', 'debris', 'check'],
                ['Calculus', 'calculus', 'check'],
                ['Abnormal Growth', 'abnormalGrowth', 'check'],
                ['Cleft Lip / Palate', 'cleftLipPalate', 'check'],
                ['Completely Edentulous', 'edentulous', 'check'],
                ['Others', 'others', 'text'],
              ].map(([label, field, type]) => (
                <div key={field} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-xs text-gray-700">{label}</span>
                  <div className="flex gap-8">
                    {SCHOOL_YEARS.map((yr, idx) => (
                      <div key={idx} className="w-16 flex justify-center">
                        {type === 'check' ? (
                          <input type="checkbox" checked={idx === selectedYear ? !!(oral as any)[field] : false}
                            onChange={e => idx === selectedYear && updateOralField(field as string, e.target.checked)}
                            className="w-4 h-4 rounded accent-blue-600" />
                        ) : (
                          <input type="text" value={idx === selectedYear ? ((oral as any)[field] || '') : ''}
                            onChange={e => idx === selectedYear && updateOralField(field as string, e.target.value)}
                            placeholder="—" className="w-16 text-xs border border-gray-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: Dental Chart ── */}
        {activeTab === 'chart' && (
          <div className="p-4 space-y-4">
            {/* Code selector */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Condition Codes</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {conditionCodes.map(c => (
                      <button key={c.code} onClick={() => { setSelectedCondition(selectedCondition === c.code ? null : c.code); setSelectedTreatment(null); }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCondition === c.code ? 'bg-[#1E40AF] text-white ring-2 ring-blue-300' : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                        {c.code}
                        <div className="text-[9px] font-normal truncate">{c.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Treatment Codes</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {treatmentCodes.map(t => (
                      <button key={t.code} onClick={() => { setSelectedTreatment(selectedTreatment === t.code ? null : t.code); setSelectedCondition(null); }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTreatment === t.code ? 'bg-green-600 text-white ring-2 ring-green-300' : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'}`}>
                        {t.code}
                        <div className="text-[9px] font-normal truncate">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(selectedCondition || selectedTreatment) && (
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selectedCondition ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {selectedCondition ? `Applying condition: ${selectedCondition}` : `Applying treatment: ${selectedTreatment}`}
                  </span>
                  <button onClick={() => { setSelectedCondition(null); setSelectedTreatment(null); }} className="text-xs text-gray-500 hover:text-gray-700 underline">Clear</button>
                </div>
              )}
            </div>

            {/* Odontogram */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto">
              <div className="min-w-[600px] space-y-2">
                {/* Upper permanent */}
                <div className="flex justify-center gap-0.5">
                  {upperPermanent.map(n => <ToothButton key={n} num={n} />)}
                </div>
                {/* Upper temporary */}
                <div className="flex justify-center gap-0.5">
                  <div className="flex gap-0.5">{upperTemporary.slice(0, 5).map(n => <ToothButton key={n} num={n} />)}</div>
                  <div className="w-8" />
                  <div className="flex gap-0.5">{upperTemporary.slice(5).map(n => <ToothButton key={n} num={n} />)}</div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-gray-300 my-2" />

                {/* Lower temporary */}
                <div className="flex justify-center gap-0.5">
                  <div className="flex gap-0.5">{lowerTemporary.slice(0, 5).map(n => <ToothButton key={n} num={n} />)}</div>
                  <div className="w-8" />
                  <div className="flex gap-0.5">{lowerTemporary.slice(5).map(n => <ToothButton key={n} num={n} />)}</div>
                </div>
                {/* Lower permanent */}
                <div className="flex justify-center gap-0.5">
                  {lowerPermanent.map(n => <ToothButton key={n} num={n} />)}
                </div>
              </div>
            </div>

            {/* DMFT Scores */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">DMFT / dmft Scores (Auto-computed)</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Primary teeth (dmft)</div>
                  <div className="flex gap-2">
                    {[['d', dmft.d], ['m', dmft.m], ['f', dmft.f], ['t', dmft.t]].map(([label, val]) => (
                      <div key={label} className="flex-1 border border-gray-300 rounded text-center py-1.5">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-bold font-mono text-gray-900">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Permanent teeth (DMFT)</div>
                  <div className="flex gap-2">
                    {[['D', dmft.D], ['M', dmft.M], ['F', dmft.F], ['T', dmft.T]].map(([label, val]) => (
                      <div key={label} className="flex-1 border border-gray-300 rounded text-center py-1.5">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-bold font-mono text-gray-900">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="font-semibold text-gray-600 mb-2 uppercase tracking-wide text-[10px]">Condition Codes</div>
                <div className="space-y-1">
                  {[['√/√', 'Sound/Sealed'], ['D/d', 'Decayed'], ['M/m', 'Missing'], ['F/f', 'Filled'], ['DX/dx', 'For Extraction'], ['Un/un', 'Unerupted'], ['S/s', 'Supernumerary'], ['JC/jc', 'Jacket Crown'], ['P/p', 'Pontic']].map(([code, label]) => (
                    <div key={code} className="flex gap-2"><span className="font-mono font-bold text-gray-700 w-12">{code}</span><span className="text-gray-500">{label}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="font-semibold text-gray-600 mb-2 uppercase tracking-wide text-[10px]">Treatment Codes</div>
                <div className="space-y-1">
                  {[['FV', 'Fluoride Varnish'], ['PFS', 'Pit and Fissure Sealant'], ['PF', 'Permanent Filling'], ['TF', 'Temporary Filling'], ['X', 'Extraction'], ['SDF', 'Silver Diamine Fluoride']].map(([code, label]) => (
                    <div key={code} className="flex gap-2"><span className="font-mono font-bold text-blue-700 w-10">{code}</span><span className="text-gray-500">{label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Consent & Appointments ── */}
        {activeTab === 'appointments' && (
          <div className="p-4 space-y-4">
            {/* Risk & Consent Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                <div className={`text-sm font-bold uppercase ${mockPatient.riskLevel === 'high' ? 'text-red-600' : mockPatient.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {mockPatient.riskLevel}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Consent Status</div>
                <div className={`text-sm font-bold ${consentGiven ? 'text-green-600' : 'text-gray-400'}`}>
                  {consentGiven ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Filipino Consent */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-700 mb-2">Pahintulot ng Pasyente / Magulang o Guardian</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pinahihintulutan ko ang Dentista na gawin ang mga kinakailangang Dental Procedure/Treatment sa aking ngipin at bibig o ngipin ng aking anak/kapatid/apo/pamangkin gaya ng ipinaliwanag sa akin at ng aking pagpayag dito. Nauunawaan ko rin na ang anumang impormasyong nakolekta ay gagamitin para sa mga layuning pangkalusugan lamang.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Lagda ng Pasyente</div>
                  <div className="border-b-2 border-gray-400 h-10 mb-1" />
                  <div className="text-xs text-gray-400">Pirma sa itaas ng pangalan</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Lagda ng Magulang o Guardian</div>
                  <div className="border-b-2 border-gray-400 h-10 mb-1" />
                  <div className="text-xs text-gray-400">Pirma sa itaas ng pangalan</div>
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-xs text-gray-700">Nakumpleto na ang pahintulot / Consent has been obtained</span>
              </label>
            </div>

            {/* Data Privacy Act */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-blue-900 mb-1">Republic Act No. 10173 — Data Privacy Act of 2012</div>
                  <p className="text-xs text-blue-700 leading-relaxed mb-3">
                    Ang impormasyong nakolekta sa form na ito ay gagamitin lamang para sa mga layuning pangkalusugan ng Dental Health Program ng Barangay Tanyag, Lungsod ng Taguig. Ang inyong personal na impormasyon ay protektado ng Batas Republika Blg. 10173 o ang Data Privacy Act ng 2012. Ang inyong datos ay hindi ibabahagi sa anumang partido na walang pahintulot maliban kung kinakailangan ng batas.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={dataPrivacyAck} onChange={e => setDataPrivacyAck(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                    <span className="text-xs text-blue-800 font-medium">Kinikilala at sinasang-ayunan ko ang Data Privacy Act of 2012</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-900">Appointments</div>
                <Link to="/appointments" className="text-xs text-blue-600 hover:underline">View all →</Link>
              </div>
              <div className="space-y-2">
                {[
                  { date: '2026-04-20', time: '9:00 AM', type: 'Fluoride Application', status: 'Scheduled' },
                  { date: '2026-05-15', time: '10:00 AM', type: 'Follow-up Checkup', status: 'Scheduled' },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-xs font-medium text-gray-900">{apt.type}</div>
                      <div className="text-xs text-gray-500">{apt.date} at {apt.time}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{apt.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
