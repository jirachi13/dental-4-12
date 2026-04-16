import { useState } from 'react';
import { FileSpreadsheet, FileText, Printer, AlertTriangle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getSchoolShortName } from '../utils/schoolColors';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Age brackets per grade — exact DOH format
const GRADE_BRACKETS: Record<string, {label:string; ages:string[]}> = {
  'Kinder':  { label:'KINDER',   ages:['4 yrs & below','5-9 yrs'] },
  'Grade 1': { label:'GRADE 1',  ages:['4 yrs & below','5-9 yrs','10-14 yrs','15-19 yrs'] },
  'Grade 2': { label:'GRADE 2',  ages:['5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'] },
  'Grade 3': { label:'GRADE 3',  ages:['5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'] },
  'Grade 4': { label:'GRADE 4',  ages:['5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'] },
  'Grade 5': { label:'GRADE 5',  ages:['5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'] },
  'Grade 6': { label:'GRADE 6',  ages:['5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'] },
};

const GRADES = ['Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];

// Summary age brackets (rightmost columns)
const SUMMARY_BRACKETS = ['4 yrs & below','5-9 yrs','10-14 yrs','15-19 yrs','20 yrs & above'];

// Mock value — returns 0 for most, a few non-zero for realism. Show blank if 0.
const V = (grade: string, age: string, sex: 'M'|'F', field: string): number => {
  // Only return non-zero for specific combinations to match real sparseness
  const key = `${grade}|${age}|${sex}|${field}`;
  const sparse: Record<string,number> = {
    'Grade 4|5-9 yrs|M|examined': 1,
    'Grade 4|5-9 yrs|F|examined': 1,
    'Grade 4|5-9 yrs|M|attended': 1,
    'Grade 4|5-9 yrs|F|attended': 1,
    'Grade 4|5-9 yrs|M|dentalCaries': 1,
    'Grade 4|5-9 yrs|M|ofc_exam': 1,
    'Grade 2|10-14 yrs|F|examined': 1,
    'Grade 2|10-14 yrs|F|attended': 1,
  };
  return sparse[key] || 0;
};

// Cell display — blank if zero
const cell = (v: number) => v === 0 ? '' : String(v);

// Total across all grades/ages for a field+sex
const sumAll = (field: string, sex: 'M'|'F') =>
  GRADES.reduce((s, g) => s + GRADE_BRACKETS[g].ages.reduce((s2, a) => s2 + V(g, a, sex, field), 0), 0);

const sumSummaryBracket = (field: string, sex: 'M'|'F', bracket: string) =>
  GRADES.reduce((s, g) => {
    const ages = GRADE_BRACKETS[g].ages;
    if (ages.includes(bracket)) return s + V(g, bracket, sex, field);
    return s;
  }, 0);

type RowDef =
  | { type: 'header'; label: string }
  | { type: 'data';   label: string; field: string; indent?: boolean }
  | { type: 'sub';    label: string; field: string };

const DOH_ROWS: RowDef[] = [
  { type:'data', label:'No. of Person Attended',   field:'attended'  },
  { type:'data', label:'No. Orally Examined',       field:'examined'  },

  { type:'header', label:'Medical History Status' },
  { type:'data', label:'Total No. with Allergies',                                  field:'allergies',      indent:true },
  { type:'data', label:'Total No. with Hypertension/ CVA',                          field:'hypertension',   indent:true },
  { type:'data', label:'Total No. with Diabetes Mellitus',                          field:'diabetes',       indent:true },
  { type:'data', label:'Total No. with Blood Disorders',                             field:'bloodDisorders', indent:true },
  { type:'data', label:'Total No. with Cardiovascular/ Heart Diseases',             field:'cardiovascular', indent:true },
  { type:'data', label:'Total No. with Thyroid Disorders',                          field:'thyroid',        indent:true },
  { type:'data', label:'Total No. with Hepatitis',                                  field:'hepatitis',      indent:true },
  { type:'data', label:'Total No. with Malignancy',                                 field:'malignancy',     indent:true },
  { type:'data', label:'Total No. with History of Previous Hospitalization',        field:'hospitalization',indent:true },
  { type:'data', label:'Total No. with Blood Transfussion',                         field:'bloodTransfusion',indent:true},
  { type:'data', label:'Total No. with Tattoo',                                     field:'tattoo',         indent:true },

  { type:'header', label:'Dietary/ Social History Status' },
  { type:'data', label:'Total No of Sugar Sweetened Beverages / Food Drinker/ Eater', field:'sugarSweetened', indent:true },
  { type:'data', label:'Total No of Alcoholic Drinker',                             field:'alcoholDrinker', indent:true },
  { type:'data', label:'Total No of Tobacco User',                                  field:'tobaccoUser',    indent:true },
  { type:'data', label:'Total No of Betel Nut Chewer',                              field:'betelNut',       indent:true },

  { type:'header', label:'Oral Health Status' },
  { type:'data', label:'Total No. with Dental Caries',                              field:'dentalCaries',   indent:true },
  { type:'data', label:'Total No. of Edentulous/ No Dentition',                     field:'edentulous',     indent:true },
  { type:'data', label:'Total No. with Gingivitis/Perio Disease',                   field:'gingivitis',     indent:true },
  { type:'data', label:'Total No. with Oral Debris',                                field:'debris',         indent:true },
  { type:'data', label:'Total No. with Calcular Deposit',                           field:'calculus',       indent:true },
  { type:'data', label:'Total No. with Dento-Facial Anomaly',                       field:'anomaly',        indent:true },
  { type:'data', label:'Total df',                                                   field:'dmf_df',         indent:true },
  { type:'data', label:'Total decayed (d)',                                          field:'dmf_d',          indent:true },
  { type:'data', label:'Total filled (f)',                                           field:'dmf_f',          indent:true },
  { type:'data', label:'Total DMF',                                                  field:'DMF_total',      indent:true },
  { type:'data', label:'Total Decayed (D)',                                          field:'DMF_D',          indent:true },
  { type:'data', label:'Total Missing (M)',                                          field:'DMF_M',          indent:true },
  { type:'data', label:'Total Filled (F)',                                           field:'DMF_F',          indent:true },

  { type:'header', label:'Services Rendered' },
  { type:'data', label:'No. Provided BOHC',                                          field:'bohc',           indent:true },
  { type:'sub',  label:'Health Center',                                              field:'bohc_hc'         },
  { type:'sub',  label:'Outreach',                                                   field:'bohc_out'        },
  { type:'sub',  label:'Schools',                                                    field:'bohc_sch'        },
  { type:'data', label:'No. Given OP/Scalling',                                      field:'oph_scaling',    indent:true },
  { type:'data', label:'No. Given Permanent Fillings',                               field:'fill_perm',      indent:true },
  { type:'sub',  label:'Head count',                                                 field:'fill_perm_head'  },
  { type:'sub',  label:'Tooth count',                                                field:'fill_perm_tooth' },
  { type:'data', label:'No. Given Temporary Fillings',                               field:'fill_temp',      indent:true },
  { type:'sub',  label:'Head count',                                                 field:'fill_temp_head'  },
  { type:'sub',  label:'Tooth count',                                                field:'fill_temp_tooth' },
  { type:'data', label:'No. Given Gum Treatment',                                    field:'gum_treatment',  indent:true },
  { type:'data', label:'No. Given Extraction',                                       field:'extraction',     indent:true },
  { type:'sub',  label:'Head count',                                                 field:'ext_head'        },
  { type:'sub',  label:'Tooth count',                                                field:'ext_tooth'       },
  { type:'data', label:'No. Given Sealant',                                          field:'sealant',        indent:true },
  { type:'sub',  label:'Head count',                                                 field:'sealant_head'    },
  { type:'sub',  label:'Tooth count',                                                field:'sealant_tooth'   },
  { type:'data', label:'No. Given Flouride Therapy',                                 field:'fluoride',       indent:true },
  { type:'sub',  label:'1st Dose',                                                   field:'fluor1'          },
  { type:'sub',  label:'2nd Dose',                                                   field:'fluor2'          },
  { type:'sub',  label:'No. Given Post Operative Treatment',                         field:'post_op'         },
  { type:'sub',  label:'No. of Patient with Oral Abscess Drained',                  field:'abscess'         },
  { type:'data', label:'No. Given Other Services',                                   field:'other',          indent:true },
  { type:'sub',  label:'No. Referred',                                               field:'referred'        },
  { type:'data', label:'No Given Counselling/ Education on Tobacco, Oral Health, Diet, Etc.', field:'counseling', indent:true },
  { type:'sub',  label:'No of Under 6 Children Completed Toothbrush Drill',         field:'toothbrush_drill'},

  { type:'header', label:'No. of Orally Fit Children (OFC)' },
  { type:'data', label:'OFC Upon Oral Examination',             field:'ofc_exam',   indent:true },
  { type:'data', label:'OFC Upon Complete Oral Rehabilitation', field:'ofc_rehab',  indent:true },
];

// Mock referral data
const mockReferrals = [
  { student:'Juan Dela Cruz',  date:'2026-03-15', facility:'Taguig City Health Office',  reason:'Severe caries, abscess',          outcome:'pending'   },
  { student:'Maria Santos',    date:'2026-03-02', facility:'Taguig City Health Office',  reason:'Deep caries, emergency extraction',outcome:'completed' },
  { student:'Pedro Reyes',     date:'2026-02-20', facility:'Taguig District Hospital',   reason:'Multiple extractions needed',      outcome:'completed' },
  { student:'Ana Garcia',      date:'2026-03-10', facility:'Taguig City Health Office',  reason:'Recurring gingivitis',             outcome:'ongoing'   },
];

const treatmentChartData = [
  { name:'Extraction', value:38 }, { name:'Fluoride', value:142 },
  { name:'Cleaning',   value:67 }, { name:'Perm Fill', value:51  },
  { name:'Temp Fill',  value:28 }, { name:'Sealant',   value:44  },
  { name:'Counseling', value:95 }, { name:'Other',     value:33  },
];

export const Reports = () => {
  const { selectedSchool } = useAuth();
  const [activeReportTab, setActiveReportTab] = useState<'doh'|'internal'>('doh');
  const [reportMonth, setReportMonth] = useState(4);
  const [reportYear,  setReportYear]  = useState(2026);

  const outcomeBadge = (o: string) => ({
    completed:'bg-green-100 text-green-700',
    pending:  'bg-yellow-100 text-yellow-700',
    ongoing:  'bg-blue-100 text-blue-700',
    no_show:  'bg-red-100 text-red-700',
  } as Record<string,string>)[o] || 'bg-gray-100 text-gray-500';

  // Build column definitions: for each grade, each age bracket, M and F
  const cols: { grade:string; age:string; sex:'M'|'F' }[] = [];
  GRADES.forEach(g => {
    GRADE_BRACKETS[g].ages.forEach(a => {
      cols.push({ grade:g, age:a, sex:'M' });
      cols.push({ grade:g, age:a, sex:'F' });
    });
  });

  // Summary cols: per age bracket, M and F
  const sumCols: { bracket:string; sex:'M'|'F' }[] = [];
  SUMMARY_BRACKETS.forEach(b => {
    sumCols.push({ bracket:b, sex:'M' });
    sumCols.push({ bracket:b, sex:'F' });
  });

  const thBase = "text-center px-1 py-1 text-[9px] font-semibold border-r border-gray-200";
  const tdBase = "text-center px-1 py-1 font-mono border-r border-gray-100 text-[10px]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {selectedSchool ? getSchoolShortName(selectedSchool) : 'All Schools'} · DOH-compliant dental health reports
          </p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveReportTab('doh')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeReportTab==='doh' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FileSpreadsheet className="w-4 h-4" /> DOH Consolidated
        </button>
        <button onClick={() => setActiveReportTab('internal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeReportTab==='internal' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FileText className="w-4 h-4" /> Internal Reports
        </button>
      </div>

      {/* ── DOH CONSOLIDATED ── */}
      {activeReportTab === 'doh' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Month</label>
              <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {MONTHS.map((m,i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Year</label>
              <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="ml-auto text-xs text-gray-400 italic">Mock data · connect backend for live values</div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table style={{borderCollapse:'collapse', fontSize:'10px', whiteSpace:'nowrap'}}>
                {/* ── TITLE ── */}
                <thead>
                  <tr>
                    <th colSpan={1 + cols.length*2 + sumCols.length*2 + 2}
                      className="text-center py-2 px-3 bg-gray-50 border-b border-gray-300 text-[11px] font-bold text-gray-900 uppercase tracking-wide">
                      DENTAL SECTION — CONSOLIDATED ORAL HEALTH STATUS AND SERVICE REPORT
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={1 + cols.length*2 + sumCols.length*2 + 2}
                      className="text-center py-1 px-3 bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500">
                      SCHOOL: {selectedSchool ? getSchoolShortName(selectedSchool) : 'All Schools'} &nbsp;·&nbsp;
                      MONTH: {MONTHS[reportMonth-1]} {reportYear}
                    </th>
                  </tr>

                  {/* ── ROW 1: GRADE HEADERS ── */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th rowSpan={3} className="sticky left-0 bg-gray-50 z-20 text-left px-2 py-1 border-r border-gray-300 text-[10px] font-semibold text-gray-600 min-w-[240px]">
                      Indicator
                    </th>
                    {GRADES.map(g => {
                      const bracketCount = GRADE_BRACKETS[g].ages.length;
                      // Each bracket has 2 sex cols + 2 total cols
                      const colSpanCount = bracketCount * 2 + 2;
                      return (
                        <th key={g} colSpan={colSpanCount}
                          className={`${thBase} bg-blue-50 text-blue-800 border-r-2 border-blue-200`}>
                          {GRADE_BRACKETS[g].label}
                        </th>
                      );
                    })}
                    <th colSpan={sumCols.length}
                      className={`${thBase} bg-purple-50 text-purple-800`}>
                      SUMMARY
                    </th>
                  </tr>

                  {/* ── ROW 2: AGE BRACKET HEADERS ── */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {GRADES.map(g =>
                      [...GRADE_BRACKETS[g].ages.map(a => (
                        <th key={g+a} colSpan={2}
                          className={`${thBase} text-gray-600 text-[8px]`}>
                          {a}
                        </th>
                      )),
                      <th key={g+'total'} colSpan={2}
                        className={`${thBase} text-blue-700 font-bold border-r-2 border-blue-200`}>
                        Total
                      </th>]
                    )}
                    {SUMMARY_BRACKETS.map(b => (
                      <th key={'sum'+b} colSpan={2}
                        className={`${thBase} text-purple-700 text-[8px]`}>
                        {b}
                      </th>
                    ))}
                  </tr>

                  {/* ── ROW 3: M/F HEADERS ── */}
                  <tr className="bg-gray-50 border-b-2 border-gray-300">
                    {GRADES.map(g =>
                      [...GRADE_BRACKETS[g].ages.flatMap(a => [
                        <th key={g+a+'M'} className={`${thBase} text-blue-600 w-6`}>M</th>,
                        <th key={g+a+'F'} className={`${thBase} text-pink-600 w-6`}>F</th>,
                      ]),
                      <th key={g+'totM'} className={`${thBase} text-blue-700 font-bold w-6`}>M</th>,
                      <th key={g+'totF'} className={`${thBase} text-pink-700 font-bold border-r-2 border-blue-200 w-6`}>F</th>]
                    )}
                    {SUMMARY_BRACKETS.flatMap(b => [
                      <th key={'sum'+b+'M'} className={`${thBase} text-blue-600 w-6`}>M</th>,
                      <th key={'sum'+b+'F'} className={`${thBase} text-pink-600 w-6`}>F</th>,
                    ])}
                  </tr>
                </thead>

                {/* ── BODY ── */}
                <tbody>
                  {DOH_ROWS.map((row, idx) => {
                    if (row.type === 'header') {
                      const totalCols = 1 + cols.length*2 + GRADES.length*2 + sumCols.length;
                      return (
                        <tr key={idx} className="bg-blue-50 border-t border-b border-blue-200">
                          <td colSpan={totalCols + 10}
                            className="px-3 py-1 font-bold text-blue-900 text-[10px] uppercase tracking-wide sticky left-0 bg-blue-50">
                            {row.label}
                          </td>
                        </tr>
                      );
                    }

                    const isSub   = row.type === 'sub';
                    const field   = row.field;
                    const labelPadding = isSub ? 'pl-8 italic text-gray-400' : (row as any).indent ? 'pl-5 text-gray-700' : 'font-medium text-gray-800';

                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                        {/* Label */}
                        <td className={`sticky left-0 bg-white border-r border-gray-200 px-2 py-0.5 text-[10px] ${labelPadding} min-w-[240px]`}>
                          {isSub && <span className="mr-1 text-gray-300">↳</span>}
                          {row.label}
                        </td>

                        {/* Per grade per age bracket M/F + grade total M/F */}
                        {GRADES.map(g => {
                          const ages = GRADE_BRACKETS[g].ages;
                          const ageCells = ages.flatMap(a => {
                            const mv = V(g, a, 'M', field);
                            const fv = V(g, a, 'F', field);
                            return [
                              <td key={g+a+'M'} className={`${tdBase} text-gray-700 w-6`}>{cell(mv)}</td>,
                              <td key={g+a+'F'} className={`${tdBase} text-gray-700 w-6`}>{cell(fv)}</td>,
                            ];
                          });
                          const totM = ages.reduce((s,a) => s+V(g,a,'M',field),0);
                          const totF = ages.reduce((s,a) => s+V(g,a,'F',field),0);
                          return [
                            ...ageCells,
                            <td key={g+'totM'} className={`${tdBase} font-bold text-blue-700 w-6`}>{cell(totM)}</td>,
                            <td key={g+'totF'} className={`${tdBase} font-bold text-pink-700 border-r-2 border-blue-200 w-6`}>{cell(totF)}</td>,
                          ];
                        })}

                        {/* Summary columns */}
                        {SUMMARY_BRACKETS.flatMap(b => {
                          const mv = sumSummaryBracket(field,'M',b);
                          const fv = sumSummaryBracket(field,'F',b);
                          return [
                            <td key={'sum'+b+'M'} className={`${tdBase} text-purple-700 w-6`}>{cell(mv)}</td>,
                            <td key={'sum'+b+'F'} className={`${tdBase} text-purple-700 w-6`}>{cell(fv)}</td>,
                          ];
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <span>Prepared by: Dr. Maria Santos, Dentist · Barangay Tanyag Dental Clinic</span>
              <span>{MONTHS[reportMonth-1]} {reportYear}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── INTERNAL REPORTS ── */}
      {activeReportTab === 'internal' && (
        <div className="space-y-5">
          {/* Monthly Treatment Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Monthly Treatment Summary</h3>
            <div style={{height:220}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treatmentChartData} margin={{top:4,right:8,bottom:24,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize:11}} angle={-20} textAnchor="end" interval={0} />
                  <YAxis tick={{fontSize:11}} />
                  <Tooltip />
                  <Bar dataKey="value" name="Procedures" fill="#1E40AF" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Consent + Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Consent Compliance by School</h3>
              <div className="space-y-4">
                {[
                  { school:'Bagong Tanyag Integrated School',          complete:48, total:60, color:'#1E40AF' },
                  { school:'Bagong Tanyag Elementary School Annex A',  complete:52, total:60, color:'#0D9488' },
                  { school:'South Daang Hari Elementary School Main',  complete:41, total:60, color:'#EA580C' },
                ].map(s => {
                  const pct = Math.round((s.complete/s.total)*100);
                  return (
                    <div key={s.school}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{getSchoolShortName(s.school)}</span>
                        <span className="text-xs font-bold" style={{color:s.color}}>{s.complete}/{s.total} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:s.color}} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div><div className="text-base font-bold text-green-600">141</div><div className="text-gray-400">Complete</div></div>
                <div><div className="text-base font-bold text-yellow-600">29</div><div className="text-gray-400">Pending</div></div>
                <div><div className="text-base font-bold text-red-600">10</div><div className="text-gray-400">Missing</div></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'High Risk Students',    value:3, color:'red',   Icon:AlertTriangle },
                  { label:'Medium Risk Students',  value:2, color:'amber', Icon:AlertCircle   },
                  { label:'Pending Referrals',     value:1, color:'blue',  Icon:TrendingUp    },
                  { label:'Completed Referrals',   value:2, color:'green', Icon:CheckCircle   },
                ].map(s => (
                  <div key={s.label} className={`bg-${s.color}-50 rounded-xl p-4`}>
                    <s.Icon className={`w-5 h-5 text-${s.color}-600 mb-2`} />
                    <div className={`text-2xl font-bold text-${s.color}-700`}>{s.value}</div>
                    <div className={`text-xs text-${s.color}-600 mt-0.5`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Tracking */}
          {mockReferrals.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Referral Tracking</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Student','Date','Facility','Reason','Outcome'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReferrals.map((r,i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{r.student}</td>
                        <td className="px-4 py-2.5 text-gray-500">{r.date}</td>
                        <td className="px-4 py-2.5 text-gray-600">{r.facility}</td>
                        <td className="px-4 py-2.5 text-gray-600 max-w-[200px] truncate">{r.reason}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${outcomeBadge(r.outcome)}`}>
                            {r.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
