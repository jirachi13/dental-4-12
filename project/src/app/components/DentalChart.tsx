import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Shield, Users, TrendingUp, FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';
import { useAuth } from '../context/AuthContext';
import { GradePill } from './GradePill';

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

type ChartEntry = { condition: string; treatment: string };
type MedicalHistory = {
  dateExamined: string;
  allergies: string;
  hypertension: boolean;
  diabetes: boolean;
  bloodDisorders: boolean;
  cardiovascular: boolean;
  thyroid: boolean;
  hepatitis: string;
  malignancy: string;
  hospitalization: string;
  bloodTransfusion: string;
  tattoo: boolean;
  others: string;
};
type DietHistory = {
  sugarSweetened: boolean;
  alcoholDrinker: boolean;
  tobaccoUser: boolean;
  betelNut: boolean;
  bodyPiercing: boolean;
  nailBiting: boolean;
  thumbsucking: boolean;
};
type OralCondition = {
  orallyFit: boolean;
  dentalCaries: boolean;
  gingivitis: boolean;
  periodontal: boolean;
  debris: boolean;
  calculus: boolean;
  abnormalGrowth: boolean;
  cleftLipPalate: boolean;
  edentulous: boolean;
  others: string;
};

const getTodayIsoDate = () => new Date().toISOString().split('T')[0];
const formatDateStamp = (dateString?: string) => {
  if (!dateString) return 'No date stamp';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const createEmptyMedicalHistory = (): MedicalHistory => ({
  dateExamined: getTodayIsoDate(),
  allergies: '',
  hypertension: false,
  diabetes: false,
  bloodDisorders: false,
  cardiovascular: false,
  thyroid: false,
  hepatitis: '',
  malignancy: '',
  hospitalization: '',
  bloodTransfusion: '',
  tattoo: false,
  others: '',
});
const createEmptyDietHistory = (): DietHistory => ({
  sugarSweetened: false,
  alcoholDrinker: false,
  tobaccoUser: false,
  betelNut: false,
  bodyPiercing: false,
  nailBiting: false,
  thumbsucking: false,
});
const createEmptyOralCondition = (): OralCondition => ({
  orallyFit: false,
  dentalCaries: false,
  gingivitis: false,
  periodontal: false,
  debris: false,
  calculus: false,
  abnormalGrowth: false,
  cleftLipPalate: false,
  edentulous: false,
  others: '',
});
const reindexYearRecords = <T,>(records: Record<number, T>, removedIndex: number): Record<number, T> =>
  Object.fromEntries(
    Object.entries(records)
      .filter(([key]) => Number(key) !== removedIndex)
      .map(([key, value]) => {
        const index = Number(key);
        return [index > removedIndex ? index - 1 : index, value];
      }),
  ) as Record<number, T>;

// ─── DMFT calculation ─────────────────────────────────────────────────────────
const computeDMFT = (chart: Record<number, ChartEntry>) => {
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
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const canEdit = user?.role === 'dentist';
  const canEditHistory = user?.role === 'dentist' || user?.role === 'dental_aide';
  const staffNameLabel = user?.role === 'dental_aide' ? 'Dental Aide' : 'Dentist';

  const navIndex = patientNavList.findIndex(p => p.id === id);
  const prevPatient = navIndex > 0 ? patientNavList[navIndex - 1] : null;
  const nextPatient = navIndex < patientNavList.length - 1 ? patientNavList[navIndex + 1] : null;

  const navEntry = patientNavList.find(p => p.id === id);
  const nameParts = navEntry ? navEntry.name.split(' ') : [mockPatient.firstName, mockPatient.lastName];
  const resolvedPatient = {
    ...mockPatient,
    id: id ?? mockPatient.id,
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
    name: navEntry?.name ?? mockPatient.name,
    grade: navEntry?.grade ?? mockPatient.grade,
    section: navEntry?.section ?? mockPatient.section,
  };

  type TabKey = 'history' | 'chart' | 'records' | 'treatments' | 'ai';
  type EntryMode = 'full' | 'charting' | 'risk';
  const modeParam = searchParams.get('mode');
  const entryMode: EntryMode = modeParam === 'charting' || modeParam === 'risk' ? modeParam : 'full';
  const visibleTabs: { key: TabKey; label: string }[] =
    entryMode === 'risk'
      ? [{ key: 'ai', label: 'Risk Classification' }]
      : entryMode === 'charting'
        ? [
            { key: 'history', label: 'History & Oral' },
            { key: 'chart', label: 'Dental Chart' },
          ]
        : [
            { key: 'history', label: 'History & Oral' },
            { key: 'chart', label: 'Dental Chart' },
            { key: 'treatments', label: 'Treatment History' },
            { key: 'records', label: 'DMFT History' },
            { key: 'ai', label: 'Risk Classification' },
          ];
  const requestedTab = searchParams.get('tab') as TabKey | null;
  const resolvedInitialTab = (requestedTab && visibleTabs.some(tab => tab.key === requestedTab))
    ? requestedTab
    : visibleTabs[0].key;
  const [activeTab, setActiveTab] = useState<TabKey>(resolvedInitialTab);
  const backHref = entryMode === 'risk' ? '/ai-analytics' : '/dental-charts';

  // ── Dental Records (DMFT by year) ────────────────────────────────────────
  const dmftByYear = [
    { year: '2023-2024', d:2, m:0, f:1, x:0, t:3, D:1, M:0, F:0, X:0, T:1, oralStatus:'Needs Treatment' },
    { year: '2024-2025', d:1, m:1, f:2, x:0, t:4, D:2, M:0, F:1, X:0, T:3, oralStatus:'Under Treatment' },
    { year: '2025-2026', d:1, m:0, f:2, x:1, t:4, D:3, M:0, F:1, X:1, T:5, oralStatus:'Needs Treatment' },
  ];

  // ── Treatment History ────────────────────────────────────────────────────
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const treatmentHistory: { date:string; complaint:string; diagnosis:string; treatment:string; dentist:string; remarks:string; type:'regular'|'rpc'; rpcVisit?:number }[] = [
    { date:'2026-03-20', complaint:'RPC Visit 2 — scheduled follow-up', diagnosis:'Post-prophylaxis check; gingivitis resolved', treatment:'Oral prophylaxis, scaling, fluoride varnish', dentist:'Dr. Maria Santos', remarks:'RPC cycle complete. Next regular visit in 6 months.', type:'rpc', rpcVisit:2 },
    { date:'2026-03-10', complaint:'Toothache on lower right molar', diagnosis:'Deep caries on tooth #36', treatment:'Temporary filling; scheduled for extraction', dentist:'Dr. Maria Santos', remarks:'Avoid hard foods. Follow-up in 1 week.', type:'regular' },
    { date:'2026-02-15', complaint:'Routine checkup', diagnosis:'Gingivitis, multiple caries', treatment:'Oral prophylaxis, fluoride varnish application', dentist:'Dr. Maria Santos', remarks:'Oral hygiene instruction given.', type:'regular' },
    { date:'2026-01-15', complaint:'RPC Visit 1 — initial pre-care', diagnosis:'Moderate gingivitis; calculus deposits', treatment:'Oral prophylaxis, scaling, oral hygiene instruction', dentist:'Dr. Maria Santos', remarks:'Patient tolerated procedure well. Schedule Visit 2 in 6 weeks.', type:'rpc', rpcVisit:1 },
    { date:'2025-11-20', complaint:'Bleeding gums', diagnosis:'Moderate gingivitis', treatment:'Scaling, oral hygiene instruction', dentist:'Dr. Ana Cruz', remarks:'Recommended twice-daily brushing.', type:'regular' },
    { date:'2025-08-05', complaint:'Routine screening', diagnosis:'Dental caries (primary) — teeth 84, 85', treatment:'Fluoride varnish, SDF application', dentist:'Dr. Maria Santos', remarks:'Consent obtained. No adverse reactions.', type:'regular' },
    { date:'2025-03-12', complaint:'Toothache', diagnosis:'Irreversible pulpitis — tooth #75', treatment:'Extraction of primary tooth #75', dentist:'Dr. Ana Cruz', remarks:'Post-extraction instruction given.', type:'regular' },
  ];
  const [activeYears, setActiveYears] = useState<string[]>(['2024-2025', '2025-2026']);
  const [selectedYear, setSelectedYear] = useState(0); // index into activeYears
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(resolvedPatient.consentStatus === 'complete');
  const [saved, setSaved] = useState(false);
  const [showModifyValidation, setShowModifyValidation] = useState(false);
  const [modificationNote, setModificationNote] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({ ...resolvedPatient });
  const [draftInfo, setDraftInfo] = useState({ ...resolvedPatient });
  const [editingInfo, setEditingInfo] = useState(false);
  const [isManagingYears, setIsManagingYears] = useState(false);
  const headerRowRef = useRef<HTMLDivElement | null>(null);
  const tabsRowRef = useRef<HTMLDivElement | null>(null);
  const [stickyOffsets, setStickyOffsets] = useState({ tabsTop: 0, yearTop: 0 });

  // Per-year dental chart data
  const [chartData, setChartData] = useState<Record<number, Record<number, ChartEntry>>>({
    0: { 36: { condition: 'D', treatment: 'PF' }, 46: { condition: 'M', treatment: '' }, 11: { condition: '✓', treatment: 'FV' }, 16: { condition: 'F', treatment: '' } },
    1: {},
  });

  // Per-year medical history
  const [medHistory, setMedHistory] = useState<Record<number, MedicalHistory>>({
    0: { dateExamined: '2025-03-10', allergies: '', hypertension: false, diabetes: false, bloodDisorders: false, cardiovascular: false, thyroid: false, hepatitis: '', malignancy: '', hospitalization: '', bloodTransfusion: '', tattoo: false, others: '' },
    1: { dateExamined: '2026-03-10', allergies: '', hypertension: false, diabetes: false, bloodDisorders: false, cardiovascular: false, thyroid: false, hepatitis: '', malignancy: '', hospitalization: '', bloodTransfusion: '', tattoo: false, others: '' },
  });

  const [dietHistory, setDietHistory] = useState<Record<number, DietHistory>>({
    0: { sugarSweetened: true, alcoholDrinker: false, tobaccoUser: false, betelNut: false, bodyPiercing: false, nailBiting: true, thumbsucking: false },
    1: { sugarSweetened: false, alcoholDrinker: false, tobaccoUser: false, betelNut: false, bodyPiercing: false, nailBiting: false, thumbsucking: false },
  });

  const [oralCondition, setOralCondition] = useState<Record<number, OralCondition>>({
    0: { orallyFit: false, dentalCaries: true, gingivitis: false, periodontal: false, debris: true, calculus: false, abnormalGrowth: false, cleftLipPalate: false, edentulous: false, others: '' },
    1: { orallyFit: false, dentalCaries: false, gingivitis: false, periodontal: false, debris: false, calculus: false, abnormalGrowth: false, cleftLipPalate: false, edentulous: false, others: '' },
  });

  const currentChart = chartData[selectedYear] || {};
  const dmft = computeDMFT(currentChart);
  const gc = getGradeColor(patientInfo.grade);
  const canEditInfo = user?.role === 'dentist' || user?.role === 'dental_aide';
  const computeAge = (birthday: string) => {
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

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

  useEffect(() => {
    const measureStickyOffsets = () => {
      const headerHeight = headerRowRef.current?.offsetHeight ?? 0;
      const tabsHeight = tabsRowRef.current?.offsetHeight ?? 0;
      setStickyOffsets({
        tabsTop: headerHeight,
        yearTop: headerHeight + tabsHeight,
      });
    };

    measureStickyOffsets();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureStickyOffsets);
      if (headerRowRef.current) resizeObserver.observe(headerRowRef.current);
      if (tabsRowRef.current) resizeObserver.observe(tabsRowRef.current);
    }

    window.addEventListener('resize', measureStickyOffsets);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureStickyOffsets);
    };
  }, [activeTab, activeYears.length, editingInfo, saved]);

  const getNextSchoolYear = () => {
    const lastYear = activeYears[activeYears.length - 1];
    const lastYearIndex = ALL_SCHOOL_YEARS.indexOf(lastYear);
    return lastYearIndex >= 0 ? ALL_SCHOOL_YEARS[lastYearIndex + 1] ?? null : null;
  };

  const handleAddYear = () => {
    const nextYear = getNextSchoolYear();
    if (!nextYear) return;

    const nextIndex = activeYears.length;
    setActiveYears(prev => [...prev, nextYear]);
    setChartData(prev => ({ ...prev, [nextIndex]: {} }));
    setMedHistory(prev => ({ ...prev, [nextIndex]: createEmptyMedicalHistory() }));
    setDietHistory(prev => ({ ...prev, [nextIndex]: createEmptyDietHistory() }));
    setOralCondition(prev => ({ ...prev, [nextIndex]: createEmptyOralCondition() }));
    setSelectedYear(nextIndex);
  };

  const handleDeleteYear = (yearIndex: number) => {
    if (!canEdit || activeYears.length <= 1) return;

    setActiveYears(prev => prev.filter((_, index) => index !== yearIndex));
    setChartData(prev => reindexYearRecords(prev, yearIndex));
    setMedHistory(prev => reindexYearRecords(prev, yearIndex));
    setDietHistory(prev => reindexYearRecords(prev, yearIndex));
    setOralCondition(prev => reindexYearRecords(prev, yearIndex));
    setSelectedYear(prev => {
      if (prev === yearIndex) return Math.max(0, yearIndex - 1);
      return prev > yearIndex ? prev - 1 : prev;
    });
  };

  useEffect(() => {
    if (!canEdit) {
      setIsManagingYears(false);
    }
  }, [canEdit]);

  useEffect(() => {
    setActiveTab(resolvedInitialTab);
  }, [resolvedInitialTab, id]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (entryMode === 'charting') {
      setTimeout(() => navigate('/ai-analytics'), 300);
    }
  };

  const buildChartPath = (patientId: string, tab: TabKey = activeTab) => {
    const modeQuery = entryMode === 'full' ? '' : `&mode=${entryMode}`;
    return `/dental-chart/${patientId}?tab=${tab}${modeQuery}`;
  };

  const ToothButton = ({ num }: { num: number }) => {
    const data = currentChart[num];
    const cond = data?.condition || '';
    const treat = data?.treatment || '';
    const colorClass = conditionColors[cond] || conditionColors[cond.toLowerCase()] || 'bg-white border-gray-300';
    const isSelected = canEdit && (selectedCondition || selectedTreatment);
    return (
      <button
        onClick={() => canEdit && handleToothClick(num)}
        className={`relative flex h-12 w-10 shrink-0 flex-col items-center justify-between rounded-md border-2 px-0.5 py-1 text-center transition-all md:h-[54px] md:w-[44px] ${colorClass} ${isSelected ? 'hover:border-teal-500 hover:ring-2 hover:ring-teal-300 hover:bg-teal-50 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="text-[8px] font-medium text-slate-500 leading-none">{num}</div>
        {cond && <div className="text-[11px] md:text-xs font-bold text-slate-700 leading-none">{cond}</div>}
        {treat && <div className="text-[8px] md:text-[9px] font-semibold text-teal-700 leading-none">{treat}</div>}
      </button>
    );
  };

  const CheckRow = ({ label, field, value, onChange }: { label: string; field: string; value: boolean; onChange: (f: string, v: boolean) => void }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-700">{label}</span>
      <div className="flex gap-3">
        {activeYears.map((yr, idx) => (
          <input key={idx} type="checkbox" checked={idx === selectedYear ? value : false}
            onChange={e => canEdit && idx === selectedYear && onChange(field, e.target.checked)}
            disabled={!canEdit}
            className="w-4 h-4 rounded accent-blue-600 disabled:opacity-60 disabled:cursor-not-allowed" />
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
  const showStickyYearBar = activeTab === 'history' || activeTab === 'chart';

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Sticky header row */}
      <div ref={headerRowRef} className="sticky top-0 z-40 bg-gray-50 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={backHref} className="p-2 hover:bg-gray-100 rounded-lg shrink-0">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900">Individual Patient Treatment Record</h1>
            <p className="text-xs text-gray-500">{patientInfo.lastName}, {patientInfo.firstName} · {patientInfo.grade} {patientInfo.section} · {patientInfo.sex} · {computeAge(patientInfo.birthday)} yrs</p>
          </div>
        </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Patient navigation */}
            {entryMode !== 'risk' && (
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => prevPatient && navigate(buildChartPath(prevPatient.id, activeTab))}
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
                onClick={() => nextPatient && navigate(buildChartPath(nextPatient.id, activeTab))}
                disabled={!nextPatient}
                title={nextPatient ? `${nextPatient.name} →` : undefined}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default border-l border-gray-200"
            >
              {nextPatient ? <span className="max-w-[80px] truncate">{nextPatient.name.split(' ')[0]}</span> : 'Last'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            )}
            {/* Year navigation */}
            {entryMode !== 'risk' && (
            <>
            <button onClick={() => setSelectedYear(Math.max(0, selectedYear - 1))} disabled={selectedYear === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
          <span className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg">{activeYears[selectedYear]}</span>
            <button onClick={() => setSelectedYear(Math.min(activeYears.length - 1, selectedYear + 1))} disabled={selectedYear === activeYears.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
            </>
            )}
            {canEdit && entryMode !== 'risk' && (
              <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-700'}`}>
                <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save'}
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {editingInfo ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Edit Student Info</span>
              <div className="flex gap-2">
                <button onClick={() => { setPatientInfo({ ...draftInfo }); setEditingInfo(false); }}
                  className="px-3 py-1.5 text-sm bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700">Save</button>
                <button onClick={() => { setDraftInfo({ ...patientInfo }); setEditingInfo(false); }}
                  className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Last Name',   field: 'lastName'   },
                { label: 'First Name',  field: 'firstName'  },
                { label: 'Middle Name', field: 'middleName' },
                { label: 'Contact',     field: 'contactNumber' },
                { label: 'Guardian',    field: 'guardianName' },
                { label: 'Guardian Contact', field: 'guardianContact' },
                { label: 'PhilHealth No.', field: 'philhealthNumber' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-gray-500 font-medium mb-0.5">{label}</label>
                  <input type="text" value={(draftInfo as any)[field]} onChange={e => setDraftInfo(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
                </div>
              ))}
              <div>
                <label className="block text-gray-500 font-medium mb-0.5">Birthday</label>
                <input type="date" value={draftInfo.birthday} onChange={e => setDraftInfo(p => ({ ...p, birthday: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-0.5">Sex</label>
                <select value={draftInfo.sex} onChange={e => setDraftInfo(p => ({ ...p, sex: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white">
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-0.5">Grade</label>
                <select value={draftInfo.grade} onChange={e => setDraftInfo(p => ({ ...p, grade: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white">
                  {['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-0.5">Section</label>
                <input type="text" value={draftInfo.section} onChange={e => setDraftInfo(p => ({ ...p, section: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-0.5">PhilHealth Status</label>
                <select value={draftInfo.philhealthStatus} onChange={e => setDraftInfo(p => ({ ...p, philhealthStatus: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white">
                  <option>Dependent</option><option>Member</option><option>None</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-500 font-medium mb-0.5">School</label>
                <select value={draftInfo.school} onChange={e => setDraftInfo(p => ({ ...p, school: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white">
                  {['Bagong Tanyag Integrated School','Bagong Tanyag Elementary School Annex A','South Daang Hari Elementary School Main'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-gray-500 font-medium mb-0.5">Address</label>
                <input type="text" value={draftInfo.address} onChange={e => setDraftInfo(p => ({ ...p, address: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="4ps" checked={draftInfo.is4Ps} onChange={e => setDraftInfo(p => ({ ...p, is4Ps: e.target.checked }))}
                  className="w-4 h-4 rounded accent-blue-600" />
                <label htmlFor="4ps" className="text-gray-700 font-medium">4Ps Member</label>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: gc.light, color: gc.solid }} className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
                  {patientInfo.firstName[0]}{patientInfo.lastName[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{patientInfo.lastName}, {patientInfo.firstName} {patientInfo.middleName}</div>
                  <div className="text-xs text-gray-500">{patientInfo.grade} • {patientInfo.section} • {patientInfo.sex} • Age {computeAge(patientInfo.birthday)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <GradePill grade={patientInfo.grade} />
                    <span style={{ color: gc.solid }} className="text-xs font-medium">{patientInfo.section}</span>
                    {patientInfo.is4Ps && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">4Ps</span>}
                  </div>
                </div>
              </div>
              {canEditInfo && (
                <button onClick={() => { setDraftInfo({ ...patientInfo }); setEditingInfo(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                ['Birthday', patientInfo.birthday],
                ['Age', `${computeAge(patientInfo.birthday)} years`],
                ['Sex', patientInfo.sex],
                ['Contact', patientInfo.contactNumber],
                ['Address', patientInfo.address],
                ['PhilHealth', `${patientInfo.philhealthNumber} (${patientInfo.philhealthStatus})`],
                ['Guardian', patientInfo.guardianName],
                ['Guardian Contact', patientInfo.guardianContact],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-gray-400 font-medium">{label}</div>
                  <div className="text-gray-900">{val}</div>
                </div>
              ))}
              <div>
                <div className="text-gray-400 font-medium">Consent</div>
                <div className={`font-semibold ${consentGiven ? 'text-green-600' : 'text-gray-400'}`}>{consentGiven ? 'Obtained' : 'Pending'}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky z-30 bg-gray-50 space-y-0" style={{ top: stickyOffsets.tabsTop }}>
        <div className="bg-white rounded-xl border border-gray-200">
          <div
            ref={tabsRowRef}
            className="rounded-t-xl border-b border-gray-200 bg-white"
          >
            <div className="overflow-x-auto">
            <div className="flex min-w-max">
            {visibleTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? 'border-b-2 border-blue-700 text-blue-700 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
            </div>
            </div>
          </div>
          {showStickyYearBar && (
            <div className="border-t border-gray-100 bg-white px-4 pt-3">
              <div className="overflow-x-auto">
              <div className="flex items-center gap-0 min-w-max">
              {activeYears.map((yr, idx) => {
                const yrDmft = computeDMFT(chartData[idx] || {});
                const isActive = selectedYear === idx;
                return (
                  <div
                    key={yr}
                    className={`mr-1 flex flex-shrink-0 items-stretch border-b-2 ${isActive ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedYear(idx)}
                      className="px-4 py-2.5 text-left text-xs font-medium transition-all"
                    >
                      <div>{yr}</div>
                      {activeTab === 'chart' && (
                        <div style={{ fontSize: '10px', marginTop: '2px' }} className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                          DMFT: {yrDmft.T + yrDmft.t}
                        </div>
                      )}
                      <div style={{ fontSize: '10px', marginTop: '2px' }} className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                        {formatDateStamp(medHistory[idx]?.dateExamined)}
                      </div>
                    </button>
                    {canEdit && isManagingYears && activeYears.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteYear(idx)}
                        className="border-l border-gray-200 px-2 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                        title={`Delete ${yr}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              {canEdit && (
                <div className="ml-2 flex flex-shrink-0 items-center gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => setIsManagingYears(prev => !prev)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${isManagingYears ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {isManagingYears ? 'Done' : 'Edit Years'}
                  </button>
                  {isManagingYears && !!getNextSchoolYear() && (
                    <button
                      type="button"
                      onClick={handleAddYear}
                      className="flex-shrink-0 px-3 py-2 text-xs text-gray-400 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-all"
                    >
                      + Add Year
                    </button>
                  )}
                </div>
              )}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200">

        {/* ── TAB 1: History ── */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-4 py-2.5 text-left font-semibold text-gray-600 border border-gray-200 min-w-[180px]">Field</th>
                  {activeYears.map((yr, idx) => (
                    <th
                      key={yr}
                      onClick={() => setSelectedYear(idx)}
                      className={`px-3 py-2.5 text-center font-semibold border border-gray-200 min-w-[110px] cursor-pointer select-none ${idx === selectedYear ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{yr}</span>
                        <span className={`text-[10px] font-medium ${idx === selectedYear ? 'text-blue-600' : 'text-gray-400'}`}>
                          {formatDateStamp(medHistory[idx]?.dateExamined)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* ── Medical History header ── */}
                <tr><td colSpan={activeYears.length + 1} className="px-4 py-2 font-bold text-gray-800 uppercase tracking-wide text-[10px] bg-gray-100 border border-gray-200">Medical History</td></tr>

                {([
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
                ] as [string,string,string][]).map(([label, field, type]) => (
                  <tr key={field} className={`hover:bg-gray-50/50 ${!canEditHistory ? 'opacity-60' : ''}`}>
                    <td className="sticky left-0 z-10 bg-white px-4 py-2 text-gray-700 border border-gray-200">{label}</td>
                    {activeYears.map((yr, idx) => (
                      <td key={yr} className={`px-2 py-2 text-center border border-gray-200 ${idx === selectedYear ? 'bg-blue-50/40' : ''}`}>
                        {type === 'check'
                          ? <input type="checkbox" disabled={!canEditHistory} checked={idx === selectedYear ? !!(med as any)[field] : false} onChange={e => idx === selectedYear && updateMedField(field, e.target.checked)} className="w-4 h-4 rounded accent-teal-600 disabled:cursor-not-allowed" />
                          : <input type="text" disabled={!canEditHistory} value={idx === selectedYear ? ((med as any)[field] || '') : ''} onChange={e => idx === selectedYear && updateMedField(field, e.target.value)} placeholder="—" className="w-full text-xs border border-gray-200 rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent disabled:cursor-not-allowed" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ── Dietary header ── */}
                <tr><td colSpan={activeYears.length + 1} className="px-4 py-2 font-bold text-gray-800 uppercase tracking-wide text-[10px] bg-gray-100 border border-gray-200">Dietary Habits and Social History</td></tr>

                {([
                  ['Sugar Sweetened Beverages/Food', 'sugarSweetened'],
                  ['Alcohol Drinker', 'alcoholDrinker'],
                  ['Tobacco User', 'tobaccoUser'],
                  ['Betel Nut Chewer', 'betelNut'],
                  ['Body Piercing', 'bodyPiercing'],
                  ['Nail Biting', 'nailBiting'],
                  ['Thumbsucking', 'thumbsucking'],
                ] as [string,string][]).map(([label, field]) => (
                  <tr key={field} className={`hover:bg-gray-50/50 ${!canEditHistory ? 'opacity-60' : ''}`}>
                    <td className="sticky left-0 z-10 bg-white px-4 py-2 text-gray-700 border border-gray-200">{label}</td>
                    {activeYears.map((yr, idx) => (
                      <td key={yr} className={`px-2 py-2 text-center border border-gray-200 ${idx === selectedYear ? 'bg-blue-50/40' : ''}`}>
                        <input type="checkbox" disabled={!canEditHistory} checked={idx === selectedYear ? !!(diet as any)[field] : false} onChange={e => idx === selectedYear && updateDietField(field, e.target.checked)} className="w-4 h-4 rounded accent-teal-600 disabled:cursor-not-allowed" />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ── Oral Health — dentist only ── */}
                <tr><td colSpan={activeYears.length + 1} className="px-4 py-2 font-bold text-gray-800 uppercase tracking-wide text-[10px] bg-gray-100 border border-gray-200">
                  Oral Health Condition{!canEdit && <span className="ml-2 normal-case font-normal text-gray-400">(dentist only)</span>}
                </td></tr>

                {([
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
                ] as [string,string,string][]).map(([label, field, type]) => (
                  <tr key={field} className={`hover:bg-gray-50/50 ${!canEdit ? 'opacity-60' : ''}`}>
                    <td className="sticky left-0 z-10 bg-white px-4 py-2 text-gray-700 border border-gray-200">{label}</td>
                    {activeYears.map((yr, idx) => (
                      <td key={yr} className={`px-2 py-2 text-center border border-gray-200 ${idx === selectedYear ? 'bg-blue-50/40' : ''}`}>
                        {type === 'check'
                          ? <input type="checkbox" disabled={!canEdit} checked={idx === selectedYear ? !!(oral as any)[field] : false} onChange={e => idx === selectedYear && updateOralField(field, e.target.checked)} className="w-4 h-4 rounded accent-teal-600 disabled:cursor-not-allowed" />
                          : <input type="text" disabled={!canEdit} value={idx === selectedYear ? ((oral as any)[field] || '') : ''} onChange={e => idx === selectedYear && updateOralField(field, e.target.value)} placeholder="—" className="w-full text-xs border border-gray-200 rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent disabled:cursor-not-allowed" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 2: Dental Chart ── */}
        {activeTab === 'chart' && (
          <div className="p-0 space-y-0">
            <div className="p-4 space-y-4">
            {/* Code selector — edit only */}
            <div className={`bg-blue-50 rounded-xl p-4 ${!canEdit ? 'opacity-50 pointer-events-none select-none' : ''}`}>
              {!canEdit && <p className="text-xs text-gray-500 mb-2 italic">View only — editing restricted to Dentist / Dental Aide</p>}
              <div className={`grid grid-cols-1 ${entryMode === 'charting' ? '' : 'lg:grid-cols-2'} gap-4`}>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Condition Codes</div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {conditionCodes.map(c => (
                      <button key={c.code} onClick={() => { setSelectedCondition(selectedCondition === c.code ? null : c.code); setSelectedTreatment(null); }}
                        className={`aspect-square min-h-[54px] rounded-lg border p-1.5 text-center transition-all flex flex-col items-center justify-center gap-1 ${selectedCondition === c.code ? 'bg-teal-600 text-white ring-2 ring-teal-300 border-teal-600' : 'bg-white border-gray-300 text-gray-700 hover:border-teal-400'}`}>
                        <div className="text-[13px] sm:text-[15px] font-bold font-mono leading-none">{c.perm}/{c.temp}</div>
                        <div className="text-[9px] sm:text-[10px] font-medium leading-tight">{c.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {entryMode !== 'charting' && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Treatment Codes</div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {treatmentCodes.map(t => (
                      <button key={t.code} onClick={() => { setSelectedTreatment(selectedTreatment === t.code ? null : t.code); setSelectedCondition(null); }}
                        className={`aspect-square min-h-[54px] rounded-lg border p-1.5 text-center transition-all flex flex-col items-center justify-center gap-1 ${selectedTreatment === t.code ? 'bg-blue-600 text-white ring-2 ring-blue-300 border-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                        <span className="text-[13px] sm:text-[15px] font-bold font-mono leading-none">{t.code}</span>
                        <span className="text-[9px] sm:text-[10px] font-medium leading-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                )}
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
              <div className="min-w-[680px] space-y-2.5">
                {/* Upper permanent */}
                <div className="flex justify-center gap-1">
                  {upperPermanent.map(n => <ToothButton key={n} num={n} />)}
                </div>
                {/* Upper temporary */}
                <div className="flex justify-center gap-1">
                  <div className="flex gap-1">{upperTemporary.slice(0, 5).map(n => <ToothButton key={n} num={n} />)}</div>
                  <div className="w-9" />
                  <div className="flex gap-1">{upperTemporary.slice(5).map(n => <ToothButton key={n} num={n} />)}</div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-gray-300 my-2" />

                {/* Lower temporary */}
                <div className="flex justify-center gap-1">
                  <div className="flex gap-1">{lowerTemporary.slice(0, 5).map(n => <ToothButton key={n} num={n} />)}</div>
                  <div className="w-9" />
                  <div className="flex gap-1">{lowerTemporary.slice(5).map(n => <ToothButton key={n} num={n} />)}</div>
                </div>
                {/* Lower permanent */}
                <div className="flex justify-center gap-1">
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
              {entryMode !== 'charting' && <div className="bg-gray-50 rounded-xl p-3">
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
              </div>}
            </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: Dental Records ── */}
        {activeTab === 'records' && (
          <div className="p-4 space-y-6">
            <h3 className="text-sm font-bold text-gray-900">DMFT Progression by School Year</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">School Year</th>
                    {['d','m','f','x','dmft','D','M','F','X','DMFT'].map(h => (
                      <th key={h} className={`px-2 py-2 text-center text-xs font-medium ${h==='dmft'||h==='DMFT' ? 'bg-gray-100 font-bold text-gray-800' : h===h.toLowerCase() ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{h}</th>
                    ))}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Oral Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dmftByYear.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-4 py-2 font-medium text-gray-900 text-xs">{row.year}</td>
                      <td className="px-2 py-2 text-center text-xs text-red-700">{row.d || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-slate-600">{row.m || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-blue-700">{row.f || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-orange-700">{row.x || ''}</td>
                      <td className="px-2 py-2 text-center text-xs font-bold text-gray-900 bg-gray-100">{row.t}</td>
                      <td className="px-2 py-2 text-center text-xs text-red-700">{row.D || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-slate-600">{row.M || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-blue-700">{row.F || ''}</td>
                      <td className="px-2 py-2 text-center text-xs text-orange-700">{row.X || ''}</td>
                      <td className="px-2 py-2 text-center text-xs font-bold text-gray-900 bg-gray-100">{row.T}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.oralStatus==='Orally Fit'?'bg-green-100 text-green-800':row.oralStatus==='Under Treatment'?'bg-blue-100 text-blue-800':'bg-yellow-100 text-yellow-800'}`}>{row.oralStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Latest dmft (primary)',    value: dmftByYear[dmftByYear.length-1].t, color:'text-red-700 bg-red-50' },
                { label:'Latest DMFT (permanent)',  value: dmftByYear[dmftByYear.length-1].T, color:'text-blue-700 bg-blue-50' },
                { label:'Years tracked',            value: dmftByYear.length,                color:'text-gray-700 bg-gray-100' },
                { label:'Trend', value: dmftByYear[dmftByYear.length-1].T > dmftByYear[0].T ? '↑ Worsening' : '↓ Improving',
                  color: dmftByYear[dmftByYear.length-1].T > dmftByYear[0].T ? 'text-red-700 bg-red-50' : 'text-green-700 bg-green-50' },
              ].map((kpi,i) => (
                <div key={i} className={`rounded-lg p-3 ${kpi.color}`}>
                  <div className="text-xl font-bold">{kpi.value}</div>
                  <div className="text-xs mt-0.5 opacity-80">{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: Treatment History ── */}
        {activeTab === 'treatments' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Treatment History</h3>
              {canEdit && (
                <button onClick={() => setShowAddTreatment(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add Entry
                </button>
              )}
            </div>
            {showAddTreatment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Visit Type</label>
                    <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="regular">Regular</option>
                      <option value="rpc1">RPC Visit 1</option>
                      <option value="rpc2">RPC Visit 2</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">{staffNameLabel}</label>
                    <input type="text" value={user?.name ?? ''} readOnly className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-default text-gray-700" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Chief Complaint</label>
                    <input type="text" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Diagnosis</label>
                    <textarea rows={2} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Treatment Done</label>
                    <textarea rows={2} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                    <input type="text" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddTreatment(false)} className="px-4 py-1.5 text-sm bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => setShowAddTreatment(false)} className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Date','Type','Chief Complaint','Diagnosis','Treatment Done','Dentist','Remarks'].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {treatmentHistory.map((t,i)=>(
                    <tr key={i} className={`hover:bg-gray-50 ${t.type==='rpc' ? 'bg-purple-50/30' : ''}`}>
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 text-xs">{new Date(t.date).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {t.type === 'rpc'
                          ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">RPC Visit {t.rpcVisit}</span>
                          : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Regular</span>
                        }
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900">{t.complaint}</td>
                      <td className="px-4 py-2 text-xs text-gray-900">{t.diagnosis}</td>
                      <td className="px-4 py-2 text-xs text-gray-900">{t.treatment}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{t.dentist}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{t.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {treatmentHistory.map((t,i)=>(
                <div key={i} className={`rounded-lg border p-3 space-y-1.5 ${t.type==='rpc' ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-xs">{new Date(t.date).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})}</span>
                    <div className="flex items-center gap-2">
                      {t.type === 'rpc'
                        ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">RPC Visit {t.rpcVisit}</span>
                        : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Regular</span>
                      }
                      <span className="text-xs text-gray-500">{t.dentist}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600"><span className="font-medium">CC:</span> {t.complaint}</p>
                  <p className="text-xs text-gray-600"><span className="font-medium">Dx:</span> {t.diagnosis}</p>
                  <p className="text-xs text-gray-600"><span className="font-medium">Tx:</span> {t.treatment}</p>
                  {t.remarks && <p className="text-xs text-gray-400 italic">{t.remarks}</p>}

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ── TAB 7: AI Risk ── */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">AI Decision-Support Disclaimer: </span>
                Predictions are generated by the FLORAL Oral Health Classifier and are intended to assist — not replace — clinical judgment. All risk assessments and treatment recommendations must be reviewed and validated by a licensed dentist before any clinical action is taken.
              </p>
            </div>

            {/* Risk Prediction */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-900">Risk Classification Summary</h3>
                <span className="ml-auto text-xs text-gray-400">Model v2.3.1 · Confidence: 94%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700 border border-red-200">High Risk</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: '94%' }} />
                </div>
                <span className="text-xs font-medium text-gray-700">94%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 font-medium mb-1.5">Detected Conditions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Severe Caries', 'Gingivitis', 'Poor Oral Hygiene'].map(c => (
                      <span key={c} className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 font-medium mb-1.5">Risk Factors</div>
                  <ul className="space-y-0.5 text-gray-700">
                    {['DMFT score: 8','Untreated decayed teeth ≥ 3','DMFT increased ≥ 2 over time','Sugar habit','No preventive treatment recorded'].map(f => (
                      <li key={f} className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Treatment Recommendation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">Recommended Treatment Plan</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { color: 'bg-red-50 border-red-200 text-red-700', tx: 'Priority scheduling — refer to City Health Office for comprehensive treatment' },
                  { color: 'bg-orange-50 border-orange-200 text-orange-700', tx: 'Extraction or restoration of severely decayed teeth (#36, #46)' },
                  { color: 'bg-yellow-50 border-yellow-200 text-yellow-700', tx: 'Oral prophylaxis and scaling for generalized gingivitis' },
                  { color: 'bg-blue-50 border-blue-200 text-blue-700', tx: 'Fluoride varnish application + pit and fissure sealant on sound molars' },
                  { color: 'bg-green-50 border-green-200 text-green-700', tx: 'Oral hygiene instruction; dietary counseling to reduce sugar intake' },
                ].map(r => (
                  <div key={r.tx} className={`rounded-lg border px-3 py-2 ${r.color}`}>
                    <span>{r.tx}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Dentist Validation</h3>
              <p className="text-xs text-gray-500">Review the AI prediction and treatment recommendation above, then record your clinical decision.</p>
              {canEdit ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setValidationMessage('Risk classification approved.'); setShowModifyValidation(false); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    ✓ Approve Prediction
                  </button>
                  <button
                    onClick={() => { setValidationMessage(null); setShowModifyValidation(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    ✎ Approve with Modifications
                  </button>
                  <button
                    onClick={() => { setValidationMessage('Risk classification rejected and marked for reassessment.'); setShowModifyValidation(false); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    ✕ Reject Prediction
                  </button>
                  </div>
                  {showModifyValidation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                      <label className="block text-xs font-medium text-gray-700">Modification Notes</label>
                      <textarea
                        rows={3}
                        value={modificationNote}
                        onChange={(e) => setModificationNote(e.target.value)}
                        placeholder="Enter updates to risk classification and treatment recommendation..."
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setValidationMessage('Risk classification approved with modifications.');
                            setShowModifyValidation(false);
                          }}
                          className="px-4 py-1.5 text-sm bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Modifications
                        </button>
                        <button
                          onClick={() => setShowModifyValidation(false)}
                          className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {validationMessage && (
                    <p className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{validationMessage}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Only the assigned dentist can validate AI predictions.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
