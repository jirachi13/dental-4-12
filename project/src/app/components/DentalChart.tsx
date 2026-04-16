import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Shield, Users } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

// ─── Ordered patient nav list (matches DentalChartNav mockCharts order) ────────
const patientNavList = [
  { id: '1',  name: 'Juan Morales',        grade: 'Grade 4', section: 'Sampaguita' },
  { id: '2',  name: 'Isabella Villanueva', grade: 'Grade 3', section: 'Jasmine'    },
  { id: '3',  name: 'Aldrin Villanueva',   grade: 'Grade 2', section: 'Rose'       },
  { id: '7',  name: 'Jose Martinez',       grade: 'Grade 6', section: 'Coral'      },
  { id: '9',  name: 'Miguel Torres',       grade: 'Grade 4', section: 'Opal'       },
  { id: '11', name: 'Pedro Reyes',         grade: 'Grade 5', section: 'Yakal'      },
  { id: '13', name: 'Lucia Diaz',          grade: 'Grade 5', section: 'Lauan'      },
  { id: '15', name: 'Valentina Cruz',      grade: 'Grade 3', section: 'Bamboo'     },
  { id: '4',  name: 'Elena Morales',       grade: 'Grade 2', section: 'Dahlia'     },
  { id: '8',  name: 'Carmen Flores',       grade: 'Grade 2', section: 'Diamond'    },
];

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
  '✓': 'bg-green-50 border-green-400',
  '√': 'bg-green-50 border-green-400',   // fallback alias
  'D': 'bg-red-100 border-red-400',
  'd': 'bg-red-100 border-red-300',
  'M': 'bg-slate-200 border-slate-400',
  'm': 'bg-slate-200 border-slate-300',
  'F': 'bg-blue-100 border-blue-400',
  'f': 'bg-blue-100 border-blue-300',
  'DX': 'bg-orange-100 border-orange-400',
  'dx': 'bg-orange-100 border-orange-300',
  'Un': 'bg-purple-50 border-purple-300',
  'un': 'bg-purple-50 border-purple-200',
  'S': 'bg-yellow-50 border-yellow-400',
  's': 'bg-yellow-50 border-yellow-300',
  'JC': 'bg-pink-50 border-pink-400',
  'jc': 'bg-pink-50 border-pink-300',
  'P': 'bg-indigo-50 border-indigo-400',
  'p': 'bg-indigo-50 border-indigo-300',
};

const ALL_SCHOOL_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030'];

// ─── DMFT calculation ─────────────────────────────────────────────────────────
const computeDMFT = (chart: Record<number, { condition: string; treatment: string }>) => {
  let d = 0, m = 0, f = 0, x = 0, D = 0, M = 0, F = 0, X = 0;
  Object.entries(chart).forEach(([tooth, data]) => {
    const n = parseInt(tooth);
    const c = data.condition;
    if (temporaryTeeth.has(n)) {
      if (c === 'd') d++;
      else if (c === 'm') m++;
      else if (c === 'f') f++;
      else if (c === 'dx') x++;
    } else {
      if (c === 'D') D++;
      else if (c === 'M') M++;
      else if (c === 'F') F++;
      else if (c === 'DX') X++;
    }
  });
  return { d, m, f, x, t: d+m+f+x, D, M, F, X, T: D+M+F+X };
};

// ─── Main component ───────────────────────────────────────────────────────────
export const DentalChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const navIndex = patientNavList.findIndex(p => p.id === id);
  const prevPatient = navIndex > 0 ? patientNavList[navIndex - 1] : null;
  const nextPatient = navIndex < patientNavList.length - 1 ? patientNavList[navIndex + 1] : null;
  const [activeTab, setActiveTab] = useState<'history' | 'chart' | 'appointments'>('history');
  const [activeYears, setActiveYears] = useState<string[]>(['2024-2025', '2025-2026']);
  const [selectedYear, setSelectedYear] = useState(0); // index into activeYears
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(mockPatient.consentStatus === 'complete');
  const [dataPrivacyAck, setDataPrivacyAck] = useState(false);
  const [saved, setSaved] = useState(false);

  // Per-year dental chart data
  const [chartData, setChartData] = useState<Record<number, Record<number, { condition: string; treatment: string }>>>({
    0: { 36: { condition: 'D', treatment: 'PF' }, 46: { condition: 'M', treatment: '' }, 11: { condition: '✓', treatment: 'FV' }, 16: { condition: 'F', treatment: '' } },
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
      // Find the correct perm/temp variant from conditionCodes
      const codeObj = conditionCodes.find(c => c.code === selectedCondition);
      const code = codeObj ? (isTemp ? codeObj.temp : codeObj.perm) : selectedCondition;
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
    const colorClass = conditionColors[cond] || conditionColors[cond.toLowerCase()] || 'bg-white border-gray-300';
    const isSelected = selectedCondition || selectedTreatment;
    return (
      <button
        onClick={() => handleToothClick(num)}
        className={`relative w-9 h-10 border-2 rounded-sm text-center transition-all ${colorClass} ${isSelected ? 'hover:border-teal-500 hover:ring-2 hover:ring-teal-300 hover:bg-teal-50 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="text-[7px] text-slate-400 leading-none mt-0.5">{num}</div>
        {cond && <div className="text-[9px] font-bold text-slate-700 leading-none">{cond}</div>}
        {treat && <div className="text-[7px] text-teal-600 leading-none">{treat}</div>}
      </button>
    );
  };

  const CheckRow = ({ label, field, value, onChange }: { label: string; field: string; value: boolean; onChange: (f: string, v: boolean) => void }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-700">{label}</span>
      <div className="flex gap-3">
        {activeYears.map((yr, idx) => (
          <input key={idx} type="checkbox" checked={idx === selectedYear ? value : false}
            onChange={e => idx === selectedYear && onChange(field, e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600" />
        ))}
      </div>
    </div>
  );

  // Base44-exact condition codes: uppercase=permanent, lowercase=temporary (auto-applied)
  const conditionCodes = [
    { code: '✓', label: 'Sound/Sealed',           perm: '✓',  temp: '✓'  },
    { code: 'D',  label: 'Decayed',                perm: 'D',  temp: 'd'  },
    { code: 'M',  label: 'Missing',                perm: 'M',  temp: 'm'  },
    { code: 'F',  label: 'Filled',                 perm: 'F',  temp: 'f'  },
    { code: 'DX', label: 'Indicated for Extr.',    perm: 'DX', temp: 'dx' },
    { code: 'Un', label: 'Unerupted',              perm: 'Un', temp: 'un' },
    { code: 'S',  label: 'Supernumerary Tooth',    perm: 'S',  temp: 's'  },
    { code: 'JC', label: 'Jacket Crown',           perm: 'JC', temp: 'jc' },
    { code: 'P',  label: 'Pontic',                 perm: 'P',  temp: 'p'  },
  ];

  // Base44-exact treatment codes
  const treatmentCodes = [
    { code: 'FV',  label: 'Fluoride Varnish'        },
    { code: 'PFS', label: 'Pit and Fissure Sealant'  },
    { code: 'PF',  label: 'Permanent Filling'        },
    { code: 'TF',  label: 'Temporary Filling'        },
    { code: 'X',   label: 'Extraction'               },
    { code: 'SDF', label: 'Silver Diamine Fluoride'  },
  ];

  const med = medHistory[selectedYear] || {};
  const diet = dietHistory[selectedYear] || {};
  const oral = oralCondition[selectedYear] || {};

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dental-charts" className="p-2 hover:bg-gray-100 rounded-lg shrink-0">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900">Individual Patient Treatment Record</h1>
            <p className="text-xs text-gray-500">{mockPatient.lastName}, {mockPatient.firstName} · {mockPatient.school} · {mockPatient.grade}-{mockPatient.section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Patient navigation */}
          <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => prevPatient && navigate(`/dental-chart/${prevPatient.id}`)}
              disabled={!prevPatient}
              title={prevPatient ? `← ${prevPatient.name}` : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default border-r border-gray-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {prevPatient ? <span className="max-w-[80px] truncate">{prevPatient.name.split(' ')[0]}</span> : 'First'}
            </button>
            <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              {navIndex >= 0 ? `${navIndex + 1}/${patientNavList.length}` : '—'}
            </span>
            <button
              onClick={() => nextPatient && navigate(`/dental-chart/${nextPatient.id}`)}
              disabled={!nextPatient}
              title={nextPatient ? `${nextPatient.name} →` : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default border-l border-gray-200"
            >
              {nextPatient ? <span className="max-w-[80px] truncate">{nextPatient.name.split(' ')[0]}</span> : 'Last'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Year navigation */}
          <button onClick={() => setSelectedYear(Math.max(0, selectedYear - 1))} disabled={selectedYear === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg">{activeYears[selectedYear]}</span>
          <button onClick={() => setSelectedYear(Math.min(activeYears.length - 1, selectedYear + 1))} disabled={selectedYear === activeYears.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-700'}`}>
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
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? 'border-b-2 border-blue-700 text-blue-700 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: History ── */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-5">
            {/* Year columns header */}
            <div className="flex items-center justify-end gap-8 text-xs font-semibold text-gray-500 mb-1">
              {activeYears.map(yr => <span key={yr} className={`w-16 text-center ${activeYears.indexOf(yr) === selectedYear ? 'text-blue-700' : ''}`}>{yr}</span>)}
            </div>

            {/* Date Examined */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-700">Date Examined</span>
              <div className="flex gap-8">
                {activeYears.map((yr, idx) => (
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
                      {activeYears.map((yr, idx) => (
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
                    {activeYears.map((yr, idx) => (
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
                    {activeYears.map((yr, idx) => (
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
          <div className="p-0 space-y-0">
            {/* Year tabs */}
            <div className="flex items-center gap-0 border-b border-gray-200 px-4 pt-3 overflow-x-auto">
              {activeYears.map((yr, idx) => {
                const yrDmft = computeDMFT(chartData[idx] || {});
                return (
                  <button key={yr} onClick={() => setSelectedYear(idx)}
                    className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium transition-all border-b-2 mr-1 ${selectedYear === idx ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                    <div>{yr}</div>
                    <div style={{ fontSize: '10px', marginTop: '2px' }} className={selectedYear === idx ? 'text-blue-600' : 'text-gray-400'}>
                      DMFT: {yrDmft.T + yrDmft.t}
                    </div>
                  </button>
                );
              })}
              {/* Add year button */}
              {activeYears.length < ALL_SCHOOL_YEARS.length && (
                <button
                  onClick={() => {
                    const next = ALL_SCHOOL_YEARS.find(y => !activeYears.includes(y));
                    if (next) {
                      setActiveYears(prev => [...prev, next]);
                      setSelectedYear(activeYears.length);
                    }
                  }}
                  className="flex-shrink-0 px-3 py-2 text-xs text-gray-400 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-all">
                  + Add Year
                </button>
              )}
            </div>
            <div className="p-4 space-y-4">
            {/* Code selector */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Condition Codes</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {conditionCodes.map(c => (
                      <button key={c.code} onClick={() => { setSelectedCondition(selectedCondition === c.code ? null : c.code); setSelectedTreatment(null); }}
                        className={`px-2 py-2 rounded-lg text-xs transition-all text-left ${selectedCondition === c.code ? 'bg-teal-600 text-white ring-2 ring-teal-300' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}>
                        <div className="font-bold font-mono">{c.perm}/{c.temp}</div>
                        <div className="text-[9px] font-normal leading-tight mt-0.5 truncate">{c.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Treatment Codes</div>
                  <div className="flex flex-col gap-1.5">
                    {treatmentCodes.map(t => (
                      <button key={t.code} onClick={() => { setSelectedTreatment(selectedTreatment === t.code ? null : t.code); setSelectedCondition(null); }}
                        className={`px-3 py-2 rounded-lg text-xs transition-all text-left flex items-center gap-2 ${selectedTreatment === t.code ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                        <span className="font-bold font-mono w-8 flex-shrink-0">{t.code}</span>
                        <span className="text-[10px] leading-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(selectedCondition || selectedTreatment) && (
                <div className="mt-3 flex items-center gap-2">
                  {selectedCondition && (() => {
                    const c = conditionCodes.find(x => x.code === selectedCondition);
                    return (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                        Applying: {c?.perm}/{c?.temp} — {c?.label} · Click teeth to apply
                      </span>
                    );
                  })()}
                  {selectedTreatment && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      Applying treatment: {selectedTreatment} · Click teeth to apply
                    </span>
                  )}
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
                  <div className="text-xs text-gray-500 mb-2">Primary teeth (dmft+x)</div>
                  <div className="flex gap-2">
                    {[['d', dmft.d], ['m', dmft.m], ['f', dmft.f], ['x', dmft.x], ['t', dmft.t]].map(([label, val]) => (
                      <div key={label as string} className={`flex-1 border rounded text-center py-1.5 ${label === 't' ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}>
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-bold font-mono text-gray-900">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Permanent teeth (DMFT+X)</div>
                  <div className="flex gap-2">
                    {[['D', dmft.D], ['M', dmft.M], ['F', dmft.F], ['X', dmft.X], ['T', dmft.T]].map(([label, val]) => (
                      <div key={label as string} className={`flex-1 border rounded text-center py-1.5 ${label === 'T' ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-bold font-mono text-gray-900">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DMFT Progression Across Years */}
            {activeYears.length > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">DMFT Progression — All Years</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 pr-4 text-gray-500 font-medium">School Year</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">d</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">m</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">f</th>
                        <th className="text-center py-2 px-2 text-blue-600 font-bold">dmft</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">D</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">M</th>
                        <th className="text-center py-2 px-2 text-gray-500 font-medium">F</th>
                        <th className="text-center py-2 px-2 text-red-600 font-bold">DMFT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeYears.map((yr, idx) => {
                        const sc = computeDMFT(chartData[idx] || {});
                        const isActive = idx === selectedYear;
                        return (
                          <tr key={yr} onClick={() => setSelectedYear(idx)} className={`cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                            <td className={`py-2 pr-4 font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>{yr}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.d}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.m}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.f}</td>
                            <td className="text-center py-2 px-2 font-mono font-bold text-blue-700">{sc.t}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.D}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.M}</td>
                            <td className="text-center py-2 px-2 font-mono">{sc.F}</td>
                            <td className="text-center py-2 px-2 font-mono font-bold text-red-700">{sc.T}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-[10px] text-gray-400">Click any row to switch to that year's chart</div>
              </div>
            )}

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="font-semibold text-gray-600 mb-2 uppercase tracking-wide text-[10px]">Condition Codes</div>
                <div className="space-y-1">
                  {[
                    { codes:'✓/✓',   label:'Sound/Sealed',            bg:'bg-green-50'   },
                    { codes:'D/d',   label:'Decayed',                  bg:'bg-red-100'    },
                    { codes:'M/m',   label:'Missing',                  bg:'bg-slate-200'  },
                    { codes:'F/f',   label:'Filled',                   bg:'bg-blue-100'   },
                    { codes:'DX/dx', label:'Indicated for Extraction', bg:'bg-orange-100' },
                    { codes:'Un/un', label:'Unerupted',                bg:'bg-purple-50'  },
                    { codes:'S/s',   label:'Supernumerary Tooth',      bg:'bg-yellow-50'  },
                    { codes:'JC/jc', label:'Jacket Crown',             bg:'bg-pink-50'    },
                    { codes:'P/p',   label:'Pontic',                   bg:'bg-indigo-50'  },
                  ].map(({ codes, label, bg }) => (
                    <div key={codes} className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-gray-700 text-[10px] px-1.5 py-0.5 rounded border border-gray-300 w-14 text-center ${bg}`}>{codes}</span>
                      <span className="text-gray-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="font-semibold text-gray-600 mb-2 uppercase tracking-wide text-[10px]">Treatment Codes</div>
                <div className="space-y-1">
                  {[
                    ['FV',  'Fluoride Varnish'],
                    ['PFS', 'Pit and Fissure Sealant'],
                    ['PF',  'Permanent Filling'],
                    ['TF',  'Temporary Filling'],
                    ['X',   'Extraction'],
                    ['SDF', 'Silver Diamine Fluoride'],
                  ].map(([code, label]) => (
                    <div key={code} className="flex gap-2"><span className="font-mono font-bold text-blue-700 w-10">{code}</span><span className="text-gray-500">{label}</span></div>
                  ))}
                </div>
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
                <div className={mockPatient.riskLevel === 'high' ? 'text-sm font-bold uppercase text-red-600' : mockPatient.riskLevel === 'medium' ? 'text-sm font-bold uppercase text-yellow-600' : 'text-sm font-bold uppercase text-green-600'}>
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
