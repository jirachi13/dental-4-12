import { useState } from 'react';
import { FileSpreadsheet, FileText, Printer, AlertTriangle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getSchoolShortName } from '../utils/schoolColors';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Age brackets per grade (exactly as in the official DOH form)
const GRADE_BRACKETS: Record<string, string[]> = {
  'Kinder':  ['4 and below', '5-9'],
  'Grade 1': ['4 and below', '5-9', '10-14', '15-19'],
  'Grade 2': ['5-9', '10-14', '15-19', '20+'],
  'Grade 3': ['5-9', '10-14', '15-19', '20+'],
  'Grade 4': ['5-9', '10-14', '15-19', '20+'],
  'Grade 5': ['5-9', '10-14', '15-19', '20+'],
  'Grade 6': ['5-9', '10-14', '15-19', '20+'],
};

const GRADES = ['Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
const SUMMARY_BRACKETS = ['4 and below', '5-9', '10-14', '15-19', '20+'];

// Mock data — returns a value per grade/bracket/sex/field
// Returns 0 for most — only non-zero for a few to demo the "blank if zero" behavior
const V = (grade: string, bracket: string, sex: 'M'|'F', field: string): number => {
  // Only seed a few non-zero values to show realistic sparse data
  const key = `${grade}|${bracket}|${sex}|${field}`;
  const seeds: Record<string, number> = {
    'Grade 4|5-9|M|examined': 1,
    'Grade 4|5-9|F|examined': 0,
    'Grade 4|5-9|M|attended': 1,
    'Grade 3|5-9|M|examined': 1,
    'Grade 3|5-9|M|attended': 1,
    'Grade 5|5-9|F|examined': 1,
    'Grade 5|5-9|F|attended': 1,
    'Grade 4|5-9|M|dentalCaries': 1,
    'Grade 4|5-9|M|DMF_D': 1,
    'Grade 4|5-9|M|ext_head': 1,
    'Grade 4|5-9|M|ext_tooth': 1,
    'Grade 3|5-9|M|fluor1': 1,
    'Grade 5|5-9|F|fluor1': 1,
    'Grade 4|5-9|M|ofc_exam': 0,
    'Grade 3|5-9|M|ofc_exam': 1,
  };
  return seeds[key] || 0;
};

// Sum across all grades+brackets for a field
const sumAll = (field: string, sex?: 'M'|'F') => {
  let total = 0;
  GRADES.forEach(g => {
    GRADE_BRACKETS[g].forEach(b => {
      if (sex) {
        total += V(g, b, sex, field);
      } else {
        total += V(g, b, 'M', field) + V(g, b, 'F', field);
      }
    });
  });
  return total;
};

// Sum for summary bracket column
const sumSummaryBracket = (bracket: string, field: string, sex: 'M'|'F') => {
  let total = 0;
  GRADES.forEach(g => {
    if (GRADE_BRACKETS[g].includes(bracket)) {
      total += V(g, bracket, sex, field);
    }
  });
  return total;
};

// Display — blank if 0
const D = (n: number) => n === 0 ? '' : String(n);

type RowDef =
  | { type: 'header'; label: string }
  | { type: 'data';   label: string; field: string; indent?: boolean }
  | { type: 'sub';    label: string; field: string };

const DOH_ROWS: RowDef[] = [
  { type:'data', label:'No. of Person Attended',                               field:'attended' },
  { type:'data', label:'No. Orally Examined',                                  field:'examined' },
  { type:'header', label:'Medical History Status' },
  { type:'data', label:'Total No. with Allergies',                             field:'allergies',      indent:true },
  { type:'data', label:'Total No. with Hypertension/ CVA',                     field:'hypertension',   indent:true },
  { type:'data', label:'Total No. with Diabetes Mellitus',                     field:'diabetes',       indent:true },
  { type:'data', label:'Total No. with Blood Disorders',                       field:'bloodDisorders', indent:true },
  { type:'data', label:'Total No. with Cardiovascular/ Heart Diseases',        field:'cardiovascular', indent:true },
  { type:'data', label:'Total No. with Thyroid Disorders',                     field:'thyroid',        indent:true },
  { type:'data', label:'Total No. with Hepatitis',                             field:'hepatitis',      indent:true },
  { type:'data', label:'Total No. with Malignancy',                            field:'malignancy',     indent:true },
  { type:'data', label:'Total No. with History of Previous Hospitalization',   field:'hospitalization',indent:true },
  { type:'data', label:'Total No. with Blood Transfussion',                    field:'bloodTransfusion',indent:true },
  { type:'data', label:'Total No. with Tattoo',                                field:'tattoo',         indent:true },
  { type:'header', label:'Dietary/ Social History Status' },
  { type:'data', label:'Total No of Sugar Sweetened Beverages / Food Drinker/ Eater', field:'sugarSweetened', indent:true },
  { type:'data', label:'Total No of Alcoholic Drinker',                        field:'alcoholDrinker', indent:true },
  { type:'data', label:'Total No of Tobacco User',                             field:'tobaccoUser',    indent:true },
  { type:'data', label:'Total No of Betel Nut Chewer',                         field:'betelNut',       indent:true },
  { type:'header', label:'Oral Health Status' },
  { type:'data', label:'Total No. with Dental Caries',                         field:'dentalCaries',   indent:true },
  { type:'data', label:'Total No. of Edentulous/ No Dentition',                field:'edentulous',     indent:true },
  { type:'data', label:'Total No. with Gingivitis/Perio Disease',              field:'gingivitis',     indent:true },
  { type:'data', label:'Total No. with Oral Debris',                           field:'debris',         indent:true },
  { type:'data', label:'Total No. with Calcular Deposit',                      field:'calculus',       indent:true },
  { type:'data', label:'Total No. with Dento-Facial Anomaly',                  field:'anomaly',        indent:true },
  { type:'data', label:'Total df',                                              field:'dmf_total',      indent:true },
  { type:'data', label:'Total decayed (d)',                                     field:'dmf_d',          indent:true },
  { type:'data', label:'Total filled (f)',                                      field:'dmf_f',          indent:true },
  { type:'data', label:'Total DMF',                                             field:'DMF_total',      indent:true },
  { type:'data', label:'Total Decayed (D)',                                     field:'DMF_D',          indent:true },
  { type:'data', label:'Total Missing (M)',                                     field:'DMF_M',          indent:true },
  { type:'data', label:'Total Filled (F)',                                      field:'DMF_F',          indent:true },
  { type:'header', label:'Services Rendered' },
  { type:'data', label:'No. Provided BOHC',                                     field:'bohc',           indent:true },
  { type:'sub',  label:'Health Center',                                         field:'bohc_hc' },
  { type:'sub',  label:'Outreach',                                              field:'bohc_out' },
  { type:'sub',  label:'Schools',                                               field:'bohc_sch' },
  { type:'data', label:'No. Given OP/Scalling',                                 field:'oph_scaling',    indent:true },
  { type:'data', label:'No. Given Permanent Fillings',                          field:'fill_perm_head', indent:true },
  { type:'sub',  label:'Head count',                                            field:'fill_perm_head' },
  { type:'sub',  label:'Tooth count',                                           field:'fill_perm_tooth' },
  { type:'data', label:'No. Given Temporary Fillings',                          field:'fill_temp_head', indent:true },
  { type:'sub',  label:'Head count',                                            field:'fill_temp_head' },
  { type:'sub',  label:'Tooth count',                                           field:'fill_temp_tooth' },
  { type:'data', label:'No. Given Gum Treatment',                               field:'gum_treatment',  indent:true },
  { type:'data', label:'No. Given Extraction',                                  field:'ext_head',       indent:true },
  { type:'sub',  label:'Head count',                                            field:'ext_head' },
  { type:'sub',  label:'Tooth count',                                           field:'ext_tooth' },
  { type:'data', label:'No. Given Sealant',                                     field:'sealant_head',   indent:true },
  { type:'sub',  label:'Head count',                                            field:'sealant_head' },
  { type:'sub',  label:'Tooth count',                                           field:'sealant_tooth' },
  { type:'data', label:'No. Given Flouride Therapy',                            field:'fluor1',         indent:true },
  { type:'sub',  label:'1st Dose',                                              field:'fluor1' },
  { type:'sub',  label:'2nd Dose',                                              field:'fluor2' },
  { type:'sub',  label:'No. Given Post Operative Treatment',                    field:'post_op' },
  { type:'sub',  label:'No. of Patient with Oral Abscess Drained',              field:'abscess' },
  { type:'data', label:'No. Given Other Services',                              field:'other',          indent:true },
  { type:'sub',  label:'No. Referred',                                          field:'referred' },
  { type:'data', label:'No Given Counselling/ Education on Tobacco, Oral Health, Diet, Etc.', field:'counseling', indent:true },
  { type:'sub',  label:'No of Under 6 Children Completed Toothbrush Drill',    field:'toothbrush_drill' },
  { type:'header', label:'No. of Orally Fit Children (OFC)' },
  { type:'data', label:'OFC Upon Oral Examination',                             field:'ofc_exam',       indent:true },
  { type:'data', label:'OFC Upon Complete Oral Rehabilitation',                 field:'ofc_rehab',      indent:true },
];

const mockReferrals = [
  { student:'Juan Dela Cruz',  date:'2026-03-15', facility:'Taguig City Health Office', reason:'Severe caries, abscess',         outcome:'pending'   },
  { student:'Maria Santos',    date:'2026-03-02', facility:'Taguig City Health Office', reason:'Deep caries, emergency extraction', outcome:'completed' },
  { student:'Pedro Reyes',     date:'2026-02-20', facility:'Taguig District Hospital',  reason:'Multiple extractions needed',    outcome:'completed' },
  { student:'Ana Garcia',      date:'2026-03-10', facility:'Taguig City Health Office', reason:'Recurring gingivitis',           outcome:'ongoing'   },
];

const treatmentChartData = [
  { name:'Extraction', value:38 }, { name:'Fluoride', value:142 }, { name:'Cleaning', value:67 },
  { name:'Perm Fill', value:51 },  { name:'Temp Fill', value:28 },  { name:'Sealant', value:44 },
  { name:'Counseling', value:95 }, { name:'Other', value:33 },
];

export const Reports = () => {
  const { selectedSchool } = useAuth();
  const [activeReportTab, setActiveReportTab] = useState<'doh'|'internal'>('doh');
  const [reportMonth, setReportMonth] = useState(4);
  const [reportYear,  setReportYear]  = useState(2026);

  const outcomeBadge = (o: string) => ({
    completed:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700',
    ongoing:'bg-blue-100 text-blue-700',     no_show:'bg-red-100 text-red-700',
  }[o] || 'bg-gray-100 text-gray-500');

  // Build column list: for each grade × each bracket × M/F, plus summary × each bracket × M/F
  // We need to render 3 header rows:
  //   Row 1: Grade colspan + Summary colspan
  //   Row 2: Bracket colspan per grade (2 per bracket × M/F = 2 cols per bracket)
  //   Row 3: M | F for each bracket

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

      {/* Tab toggle */}
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
            <div className="ml-auto text-xs text-gray-400 italic">Cells are blank when zero · Connect backend for real data</div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table style={{borderCollapse:'collapse', fontSize:'10px', whiteSpace:'nowrap'}}>
                <thead>
                  {/* Title */}
                  <tr>
                    <td colSpan={999} style={{textAlign:'center', padding:'8px 12px', borderBottom:'1px solid #e5e7eb', background:'#f9fafb', fontWeight:700, fontSize:'11px'}}>
                      DENTAL SECTION - CONSOLIDATED ORAL HEALTH STATUS AND SERVICE REPORT
                      <div style={{fontWeight:400, fontSize:'10px', color:'#6b7280', marginTop:2}}>
                        SCHOOL: {selectedSchool ? getSchoolShortName(selectedSchool) : 'All Schools'} &nbsp;·&nbsp; MONTH: {MONTHS[reportMonth-1]} {reportYear}
                      </div>
                    </td>
                  </tr>
                  {/* Row 1 — Grade headers */}
                  <tr style={{background:'#f9fafb'}}>
                    <th rowSpan={3} style={{minWidth:220, maxWidth:220, textAlign:'left', padding:'4px 8px', borderRight:'1px solid #d1d5db', borderBottom:'2px solid #9ca3af', position:'sticky', left:0, background:'#f9fafb', zIndex:10, fontWeight:600}}></th>
                    {GRADES.map(g => {
                      const brackets = GRADE_BRACKETS[g];
                      const colCount = brackets.length * 2 + 2; // brackets × M/F + total M + total F
                      return (
                        <th key={g} colSpan={colCount} style={{textAlign:'center', padding:'4px 6px', borderRight:'1px solid #d1d5db', borderBottom:'1px solid #e5e7eb', fontWeight:600, color:'#1e40af'}}>
                          {g}
                        </th>
                      );
                    })}
                    {/* Summary header */}
                    <th colSpan={SUMMARY_BRACKETS.length * 2} style={{textAlign:'center', padding:'4px 6px', borderBottom:'1px solid #e5e7eb', fontWeight:700, color:'#1e40af'}}>
                      Summary
                    </th>
                  </tr>
                  {/* Row 2 — Age bracket headers */}
                  <tr style={{background:'#f9fafb'}}>
                    {GRADES.map(g => {
                      const brackets = GRADE_BRACKETS[g];
                      return (
                        <>
                          {brackets.map(b => (
                            <th key={b} colSpan={2} style={{textAlign:'center', padding:'3px 4px', borderRight:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', fontWeight:500, color:'#374151', fontSize:'9px'}}>
                              {b === '4 and below' ? '4 years old\nand below' : b === '20+' ? '20 years\nand above' : `${b} years old`}
                            </th>
                          ))}
                          {/* Total columns for this grade */}
                          <th colSpan={2} style={{textAlign:'center', padding:'3px 4px', borderRight:'1px solid #d1d5db', borderBottom:'1px solid #e5e7eb', fontWeight:700, color:'#1e40af', fontSize:'9px'}}>Total</th>
                        </>
                      );
                    })}
                    {/* Summary bracket headers */}
                    {SUMMARY_BRACKETS.map(b => (
                      <th key={b} colSpan={2} style={{textAlign:'center', padding:'3px 4px', borderRight:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', fontWeight:500, color:'#374151', fontSize:'9px'}}>
                        {b === '4 and below' ? '4 years old\nand below' : b === '20+' ? '20 years\nand above' : `${b} years old`}
                      </th>
                    ))}
                  </tr>
                  {/* Row 3 — M/F */}
                  <tr style={{background:'#f9fafb', borderBottom:'2px solid #9ca3af'}}>
                    {GRADES.map(g => {
                      const brackets = GRADE_BRACKETS[g];
                      return (
                        <>
                          {brackets.map(b => (
                            <>
                              <th key={b+'M'} style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #f3f4f6', fontWeight:600, color:'#2563eb', width:20}}>M</th>
                              <th key={b+'F'} style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #e5e7eb', fontWeight:600, color:'#db2777', width:20}}>F</th>
                            </>
                          ))}
                          <th style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #f3f4f6', fontWeight:700, color:'#2563eb', width:22}}>M</th>
                          <th style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #d1d5db', fontWeight:700, color:'#db2777', width:22}}>F</th>
                        </>
                      );
                    })}
                    {SUMMARY_BRACKETS.map(b => (
                      <>
                        <th key={b+'M'} style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #f3f4f6', fontWeight:600, color:'#2563eb', width:20}}>M</th>
                        <th key={b+'F'} style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #e5e7eb', fontWeight:600, color:'#db2777', width:20}}>F</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOH_ROWS.map((row, idx) => {
                    if (row.type === 'header') {
                      return (
                        <tr key={idx} style={{background:'#eff6ff', borderTop:'1px solid #bfdbfe', borderBottom:'1px solid #bfdbfe'}}>
                          <td colSpan={999} style={{padding:'4px 8px', fontWeight:700, color:'#1e40af', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', position:'sticky', left:0, background:'#eff6ff'}}>
                            {row.label}
                          </td>
                        </tr>
                      );
                    }
                    const field = row.field;
                    const isSub = row.type === 'sub';
                    const labelStyle: React.CSSProperties = {
                      padding: '2px 8px',
                      paddingLeft: isSub ? 28 : (row as any).indent ? 16 : 8,
                      color: isSub ? '#6b7280' : '#374151',
                      fontStyle: isSub ? 'italic' : 'normal',
                      borderRight: '1px solid #d1d5db',
                      minWidth: 220,
                      maxWidth: 220,
                      position: 'sticky' as const,
                      left: 0,
                      background: '#ffffff',
                      zIndex: 5,
                      borderBottom: '1px solid #f3f4f6',
                    };
                    return (
                      <tr key={idx} style={{borderBottom:'1px solid #f3f4f6'}}>
                        <td style={labelStyle}>
                          {isSub && <span style={{color:'#9ca3af', marginRight:4}}>↳</span>}
                          {row.label}
                        </td>
                        {/* Grade data cells */}
                        {GRADES.map(g => {
                          const brackets = GRADE_BRACKETS[g];
                          const totalM = brackets.reduce((s,b) => s + V(g,b,'M',field), 0);
                          const totalF = brackets.reduce((s,b) => s + V(g,b,'F',field), 0);
                          return (
                            <>
                              {brackets.map(b => (
                                <>
                                  <td key={b+'M'} style={{textAlign:'center', padding:'2px 3px', borderRight:'1px solid #f9fafb', fontFamily:'monospace', color:'#111827', background: V(g,b,'M',field) > 0 ? '#fff' : '#fafafa'}}>
                                    {D(V(g,b,'M',field))}
                                  </td>
                                  <td key={b+'F'} style={{textAlign:'center', padding:'2px 3px', borderRight:'1px solid #e5e7eb', fontFamily:'monospace', color:'#111827', background: V(g,b,'F',field) > 0 ? '#fff' : '#fafafa'}}>
                                    {D(V(g,b,'F',field))}
                                  </td>
                                </>
                              ))}
                              {/* Grade total */}
                              <td style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #d1fbe1', fontFamily:'monospace', fontWeight:600, color:'#1d4ed8', background: totalM > 0 ? '#eff6ff' : '#f9fafb'}}>
                                {D(totalM)}
                              </td>
                              <td style={{textAlign:'center', padding:'2px 4px', borderRight:'1px solid #d1d5db', fontFamily:'monospace', fontWeight:600, color:'#be185d', background: totalF > 0 ? '#fdf2f8' : '#f9fafb'}}>
                                {D(totalF)}
                              </td>
                            </>
                          );
                        })}
                        {/* Summary columns */}
                        {SUMMARY_BRACKETS.map(b => {
                          const sumM = sumSummaryBracket(b, field, 'M');
                          const sumF = sumSummaryBracket(b, field, 'F');
                          return (
                            <>
                              <td key={b+'M'} style={{textAlign:'center', padding:'2px 3px', borderRight:'1px solid #f9fafb', fontFamily:'monospace', color:'#374151', background: sumM > 0 ? '#f0fdf4' : '#fafafa'}}>
                                {D(sumM)}
                              </td>
                              <td key={b+'F'} style={{textAlign:'center', padding:'2px 3px', borderRight:'1px solid #e5e7eb', fontFamily:'monospace', color:'#374151', background: sumF > 0 ? '#fdf2f8' : '#fafafa'}}>
                                {D(sumF)}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{padding:'8px 16px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#9ca3af'}}>
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
                <BarChart data={treatmentChartData} margin={{top:4, right:8, bottom:24, left:0}}>
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
                        <div className="h-full rounded-full" style={{width:`${pct}%`, backgroundColor:s.color}} />
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
                  { label:'High Risk Students',   value:3, color:'red',   Icon:AlertTriangle },
                  { label:'Medium Risk Students', value:2, color:'amber', Icon:AlertCircle   },
                  { label:'Pending Referrals',    value:1, color:'blue',  Icon:TrendingUp    },
                  { label:'Completed Referrals',  value:2, color:'green', Icon:CheckCircle   },
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
                        <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${outcomeBadge(r.outcome)}`}>{r.outcome}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
