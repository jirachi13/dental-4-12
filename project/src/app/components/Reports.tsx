import { useState } from 'react';
import { FileText, Download, Eye, Calendar, BarChart3, PieChart, TrendingUp, FileDown, Printer, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell } from 'recharts';

export const Reports = () => {
  const [activeReportTab, setActiveReportTab] = useState<'doh' | 'internal'>('doh');
  const [reportMonth, setReportMonth] = useState(4);
  const [reportYear, setReportYear] = useState(2026);
  const [reportType, setReportType] = useState('monthly');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-04-10');
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    { value: 'monthly', label: 'Monthly Oral Health Report (DOH IPTR Format)' },
    { value: 'appointment', label: 'Appointment Summary Report' },
    { value: 'fluoride', label: 'Fluoride Coverage Report' },
    { value: 'procedure', label: 'Procedure Volume Report' },
    { value: 'risk', label: 'Risk Stratification Report' },
    { value: 'doh-compliance', label: 'DOH Compliance Report' },
    { value: 'bayanihan', label: 'Bayanihan Event Summary' },
  ];

  const schools = [
    { value: 'all', label: 'All Schools' },
    { value: 'bagong-tanyag', label: 'Bagong Tanyag Integrated School' },
    { value: 'bagong-annex', label: 'Bagong Tanyag Elementary School Annex A' },
    { value: 'south-daang', label: 'South Daang Hari Elementary School Main' },
  ];

  // Sample Data for Previews
  const procedureData = [
    { month: 'Jan', extractions: 12, fillings: 25, fluoride: 85, cleaning: 42 },
    { month: 'Feb', extractions: 15, fillings: 30, fluoride: 92, cleaning: 38 },
    { month: 'Mar', extractions: 18, fillings: 28, fluoride: 88, cleaning: 45 },
    { month: 'Apr', extractions: 10, fillings: 22, fluoride: 95, cleaning: 40 },
  ];

  const riskData = [
    { name: 'High Risk', value: 35, color: '#E31E24' },
    { name: 'Medium Risk', value: 48, color: '#FBBF24' },
    { name: 'Low Risk', value: 67, color: '#16A34A' },
  ];

  const fluorideCoverage = [
    { grade: 'Grade 1', target: 120, completed: 115, percentage: 96 },
    { grade: 'Grade 2', target: 110, completed: 105, percentage: 95 },
    { grade: 'Grade 3', target: 125, completed: 108, percentage: 86 },
    { grade: 'Grade 4', target: 118, completed: 112, percentage: 95 },
    { grade: 'Grade 5', target: 115, completed: 98, percentage: 85 },
    { grade: 'Grade 6', target: 108, completed: 102, percentage: 94 },
  ];

  const generateReport = (format: 'pdf' | 'excel') => {
    const reportName = reportTypes.find(r => r.value === reportType)?.label || 'Report';
    alert(`✓ Generating ${reportName}\nFormat: ${format.toUpperCase()}\nPeriod: ${startDate} to ${endDate}\nSchool: ${selectedSchool}\n\nReport will be downloaded shortly...`);
  };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const GRADES = ['Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];

  // Mock DOH data per grade per sex
  const getMockVal = (grade: string, sex: 'M'|'F', field: string): number => {
    const base: Record<string, number> = {
      attended: sex === 'M' ? 28 : 30, examined: sex === 'M' ? 25 : 27,
      allergies: 2, hypertension: 0, diabetes: 0, bloodDisorders: 0, cardiovascular: 0,
      thyroid: 0, hepatitis: 0, malignancy: 0, hospitalization: 1, bloodTransfusion: 0, tattoo: 0,
      sugarSweetened: sex === 'M' ? 15 : 14, alcoholDrinker: 0, tobaccoUser: 0, betelNut: 0,
      dentalCaries: sex === 'M' ? 12 : 10, edentulous: 0, gingivitis: 4, debris: 8, calculus: 3, anomaly: 1,
      dmf_d: 3, dmf_f: 2, DMF_D: 4, DMF_M: 1, DMF_F: 3,
      extraction: sex === 'M' ? 5 : 4, fluoride1: 18, fluoride2: 15,
      filling_perm: 6, filling_temp: 3, cleaning: 8, sealant: 5, counseling: 12,
      ofc_exam: sex === 'M' ? 8 : 10, ofc_rehab: sex === 'M' ? 4 : 5,
    };
    const gradeMultiplier: Record<string, number> = { Kinder:0.8, 'Grade 1':0.9, 'Grade 2':1.0, 'Grade 3':1.0, 'Grade 4':1.1, 'Grade 5':1.1, 'Grade 6':1.2 };
    return Math.round((base[field] || 0) * (gradeMultiplier[grade] || 1));
  };

  const getTotalVal = (field: string, sex?: 'M'|'F') => {
    return GRADES.reduce((sum, g) => {
      if (sex) return sum + getMockVal(g, sex, field);
      return sum + getMockVal(g, 'M', field) + getMockVal(g, 'F', field);
    }, 0);
  };

  const DOH_ROWS: { label: string; field?: string; isHeader?: boolean; indent?: boolean }[] = [
    { label: 'No. of Person Attended', field: 'attended' },
    { label: 'No. Orally Examined', field: 'examined' },
    { label: 'MEDICAL HISTORY STATUS', isHeader: true },
    { label: 'Total No. with Allergies', field: 'allergies', indent: true },
    { label: 'Total No. with Hypertension/CVA', field: 'hypertension', indent: true },
    { label: 'Total No. with Diabetes Mellitus', field: 'diabetes', indent: true },
    { label: 'Total No. with Blood Disorders', field: 'bloodDisorders', indent: true },
    { label: 'Total No. with Cardiovascular/Heart Diseases', field: 'cardiovascular', indent: true },
    { label: 'Total No. with Thyroid Disorders', field: 'thyroid', indent: true },
    { label: 'Total No. with Hepatitis', field: 'hepatitis', indent: true },
    { label: 'Total No. with Malignancy', field: 'malignancy', indent: true },
    { label: 'Total No. with History of Hospitalization', field: 'hospitalization', indent: true },
    { label: 'Total No. with Blood Transfusion', field: 'bloodTransfusion', indent: true },
    { label: 'Total No. with Tattoo', field: 'tattoo', indent: true },
    { label: 'DIETARY / SOCIAL HISTORY STATUS', isHeader: true },
    { label: 'Total No. of Sugar Sweetened Beverages/Food', field: 'sugarSweetened', indent: true },
    { label: 'Total No. of Alcohol Drinkers', field: 'alcoholDrinker', indent: true },
    { label: 'Total No. of Tobacco Users', field: 'tobaccoUser', indent: true },
    { label: 'Total No. of Betel Nut Chewers', field: 'betelNut', indent: true },
    { label: 'ORAL HEALTH STATUS', isHeader: true },
    { label: 'Total No. with Dental Caries', field: 'dentalCaries', indent: true },
    { label: 'Total No. of Edentulous/No Dentition', field: 'edentulous', indent: true },
    { label: 'Total No. with Gingivitis/Periodontal Disease', field: 'gingivitis', indent: true },
    { label: 'Total No. with Oral Debris', field: 'debris', indent: true },
    { label: 'Total No. with Calcular Deposit', field: 'calculus', indent: true },
    { label: 'Total No. with Dento-Facial Anomaly', field: 'anomaly', indent: true },
    { label: 'Total df', field: 'dmf_d', indent: true },
    { label: 'Total Decayed (d)', field: 'dmf_d', indent: true },
    { label: 'Total Filled (f)', field: 'dmf_f', indent: true },
    { label: 'Total DMF', field: 'DMF_D', indent: true },
    { label: 'Total Decayed (D)', field: 'DMF_D', indent: true },
    { label: 'Total Missing (M)', field: 'DMF_M', indent: true },
    { label: 'Total Filled (F)', field: 'DMF_F', indent: true },
    { label: 'SERVICES RENDERED', isHeader: true },
    { label: 'No. Given Extraction', field: 'extraction', indent: true },
    { label: 'No. Given Permanent Fillings', field: 'filling_perm', indent: true },
    { label: 'No. Given Temporary Fillings', field: 'filling_temp', indent: true },
    { label: 'No. Given Teeth Cleaning/Oral Prophylaxis', field: 'cleaning', indent: true },
    { label: 'No. Given Pit & Fissure Sealant', field: 'sealant', indent: true },
    { label: 'No. Given Fluoride Therapy — 1st Dose', field: 'fluoride1', indent: true },
    { label: 'No. Given Fluoride Therapy — 2nd Dose', field: 'fluoride2', indent: true },
    { label: 'No. Given Counselling/Oral Health Education', field: 'counseling', indent: true },
    { label: 'NO. OF ORALLY FIT CHILDREN (OFC)', isHeader: true },
    { label: 'OFC Upon Oral Examination', field: 'ofc_exam', indent: true },
    { label: 'OFC Upon Complete Oral Rehabilitation', field: 'ofc_rehab', indent: true },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Generate and export DOH-compliant dental health reports</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveReportTab('doh')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeReportTab === 'doh' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FileSpreadsheet className="w-4 h-4" /> DOH Consolidated
        </button>
        <button onClick={() => setActiveReportTab('internal')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeReportTab === 'internal' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FileText className="w-4 h-4" /> Internal Reports
        </button>
      </div>

      {/* ── DOH CONSOLIDATED REPORT ── */}
      {activeReportTab === 'doh' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Month</label>
              <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Year</label>
              <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="ml-auto text-xs text-gray-400">
              Data shown is mock. Connect backend for real values.
            </div>
          </div>

          {/* DOH Report Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="text-xs" style={{ minWidth: '1100px', width: '100%', borderCollapse: 'collapse' }}>
                {/* ── Report Header ── */}
                <thead>
                  <tr>
                    <td colSpan={2 + GRADES.length * 2 + 2} className="text-center py-3 px-4 border-b border-gray-200 bg-gray-50">
                      <div className="font-bold text-sm text-gray-900">DENTAL SECTION — CONSOLIDATED ORAL HEALTH STATUS AND SERVICE REPORT</div>
                      <div className="text-gray-600 text-xs mt-0.5">City of Taguig · Department of Health · {MONTHS[reportMonth - 1]} {reportYear}</div>
                    </td>
                  </tr>
                  {/* Grade headers */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-r border-gray-200 sticky left-0 bg-gray-50 z-10" style={{ minWidth: '220px' }}>Indicator</th>
                    {GRADES.map(g => (
                      <th key={g} colSpan={2} className="text-center px-2 py-2 font-semibold text-gray-700 border-r border-gray-200 text-[10px]">{g}</th>
                    ))}
                    <th colSpan={2} className="text-center px-2 py-2 font-bold text-[#1E40AF] border-r border-gray-200 text-[10px]">TOTAL</th>
                    <th className="text-center px-2 py-2 font-bold text-[#1E40AF] text-[10px]">GRAND TOTAL</th>
                  </tr>
                  {/* M/F headers */}
                  <tr className="bg-gray-50 border-b-2 border-gray-300">
                    <th className="sticky left-0 bg-gray-50 z-10 border-r border-gray-200" />
                    {GRADES.map(g => (
                      <>
                        <th key={g + 'M'} className="text-center px-1 py-1.5 font-semibold text-blue-600 border-r border-gray-100 text-[10px] w-10">M</th>
                        <th key={g + 'F'} className="text-center px-1 py-1.5 font-semibold text-pink-600 border-r border-gray-200 text-[10px] w-10">F</th>
                      </>
                    ))}
                    <th className="text-center px-1 py-1.5 font-semibold text-blue-600 border-r border-gray-100 text-[10px] w-10">M</th>
                    <th className="text-center px-1 py-1.5 font-semibold text-pink-600 border-r border-gray-200 text-[10px] w-10">F</th>
                    <th className="text-center px-1 py-1.5 font-bold text-gray-700 text-[10px] w-14" />
                  </tr>
                </thead>
                <tbody>
                  {DOH_ROWS.map((row, idx) => {
                    if (row.isHeader) {
                      return (
                        <tr key={idx} className="bg-blue-50 border-t border-b border-blue-200">
                          <td colSpan={2 + GRADES.length * 2 + 2} className="px-3 py-1.5 font-bold text-blue-800 text-[10px] uppercase tracking-wide sticky left-0 bg-blue-50">
                            {row.label}
                          </td>
                        </tr>
                      );
                    }
                    const field = row.field || '';
                    const grandTotal = getTotalVal(field);
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className={`px-3 py-1.5 text-gray-700 sticky left-0 bg-white border-r border-gray-200 ${row.indent ? 'pl-6' : 'font-medium'}`} style={{ minWidth: '220px' }}>
                          {row.label}
                        </td>
                        {GRADES.map(g => (
                          <>
                            <td key={g + 'M'} className="text-center px-1 py-1.5 font-mono text-gray-700 border-r border-gray-100 text-[11px]">
                              {getMockVal(g, 'M', field)}
                            </td>
                            <td key={g + 'F'} className="text-center px-1 py-1.5 font-mono text-gray-700 border-r border-gray-200 text-[11px]">
                              {getMockVal(g, 'F', field)}
                            </td>
                          </>
                        ))}
                        <td className="text-center px-1 py-1.5 font-mono font-bold text-blue-700 border-r border-gray-100 text-[11px]">
                          {getTotalVal(field, 'M')}
                        </td>
                        <td className="text-center px-1 py-1.5 font-mono font-bold text-pink-700 border-r border-gray-200 text-[11px]">
                          {getTotalVal(field, 'F')}
                        </td>
                        <td className="text-center px-1 py-1.5 font-mono font-bold text-gray-900 text-[11px] bg-blue-50">
                          {grandTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Prepared by: Dr. Maria Santos, Dentist · Barangay Tanyag Dental Clinic</span>
              <span>Date: {MONTHS[reportMonth - 1]} {reportYear}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── INTERNAL REPORTS ── */}
      {activeReportTab === 'internal' && (

        <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Generation</h1>
        <p className="text-gray-600 mt-1">Generate and export DOH-compliant dental health reports</p>
      </div>

      {/* Consent Compliance */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Consent Compliance by School</h3>
        <div className="space-y-4">
          {[
            { school: 'Bagong Tanyag Integrated School', complete: 48, total: 60, color: '#1E40AF' },
            { school: 'Bagong Tanyag Elementary School Annex A', complete: 52, total: 60, color: '#0D9488' },
            { school: 'South Daang Hari Elementary School Main', complete: 41, total: 60, color: '#EA580C' },
          ].map(s => {
            const pct = Math.round((s.complete / s.total) * 100);
            return (
              <div key={s.school}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700">{s.school.replace(' Elementary School','').replace(' Integrated School',' Integrated').replace(' Main','')}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.complete}/{s.total} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">141</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">29</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">10</div>
            <div className="text-xs text-gray-500">Missing</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Reports Generated</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">127</p>
          <p className="text-xs text-gray-500 mt-1">This quarter</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Treatment Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">89%</p>
          <p className="text-xs text-gray-500 mt-1">Completion rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Total Procedures</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,248</p>
          <p className="text-xs text-gray-500 mt-1">Year to date</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <PieChart className="w-5 h-5" />
            <span className="text-sm font-medium">Fluoride Coverage</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">92%</p>
          <p className="text-xs text-gray-500 mt-1">Target: 90%</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              {schools.map(school => (
                <option key={school.value} value={school.value}>{school.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period *</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
              <option>Q1 2026 (Jan - Mar)</option>
              <option>Q2 2026 (Apr - Jun)</option>
              <option>Q3 2026 (Jul - Sep)</option>
              <option>Q4 2026 (Oct - Dec)</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview Report'}
          </button>
          <button
            onClick={() => generateReport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#C41E3A] transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => generateReport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891B2] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Email Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report Preview</h2>
          
          {/* Report Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {reportTypes.find(r => r.value === reportType)?.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Floral Dental Clinic Management System - Barangay Tanyag, Taguig City
                </p>
                <p className="text-sm text-gray-600">
                  Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">DOH IPTR Compliant</p>
              </div>
            </div>
          </div>

          {/* Report Content Based on Type */}
          {reportType === 'procedure' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Procedure Volume Trends</h4>
                <ResponsiveContainer width="100%" height={300} key="procedure-chart-container">
                  <BarChart data={procedureData} id="procedure-volume-chart">
                    <CartesianGrid strokeDasharray="3 3" key="procedure-grid" />
                    <XAxis dataKey="month" key="procedure-xaxis" />
                    <YAxis key="procedure-yaxis" />
                    <Tooltip key="procedure-tooltip" />
                    <Legend key="procedure-legend" />
                    <Bar dataKey="extractions" fill="#E31E24" name="Extractions" key="procedure-bar-extractions" />
                    <Bar dataKey="fillings" fill="#1E40AF" name="Fillings" key="procedure-bar-fillings" />
                    <Bar dataKey="fluoride" fill="#06B6D4" name="Fluoride" key="procedure-bar-fluoride" />
                    <Bar dataKey="cleaning" fill="#16A34A" name="Cleaning" key="procedure-bar-cleaning" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Total Extractions</div>
                  <div className="text-2xl font-bold text-red-900 mt-1">55</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Fillings</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">105</div>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="text-sm text-cyan-600 font-medium">Fluoride Applications</div>
                  <div className="text-2xl font-bold text-cyan-900 mt-1">360</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Cleanings</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">165</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'risk' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Risk Stratification Distribution</h4>
                <ResponsiveContainer width="100%" height={300} key="risk-chart-container">
                  <RPieChart id="risk-distribution-chart">
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      dataKey="value"
                      key="risk-pie"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`risk-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip key="risk-tooltip" />
                  </RPieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {riskData.map((item) => (
                  <div key={item.name} className="p-4 rounded-lg border-2" style={{ borderColor: item.color }}>
                    <div className="text-sm font-medium" style={{ color: item.color }}>{item.name}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {Math.round((item.value / riskData.reduce((sum, r) => sum + r.value, 0)) * 100)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'fluoride' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Fluoride Coverage by Grade Level</h4>
                <ResponsiveContainer width="100%" height={300} key="fluoride-chart-container">
                  <BarChart data={fluorideCoverage} id="fluoride-coverage-chart">
                    <CartesianGrid strokeDasharray="3 3" key="fluoride-grid" />
                    <XAxis dataKey="grade" key="fluoride-xaxis" />
                    <YAxis key="fluoride-yaxis" />
                    <Tooltip key="fluoride-tooltip" />
                    <Legend key="fluoride-legend" />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" key="fluoride-bar-target" />
                    <Bar dataKey="completed" fill="#06B6D4" name="Completed" key="fluoride-bar-completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coverage %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fluorideCoverage.map((item) => (
                      <tr key={item.grade} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.grade}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.target}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.completed}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.target - item.completed}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.percentage >= 90 ? 'bg-green-600' : item.percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(reportType === 'monthly' || reportType === 'doh-compliance') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Students</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">696</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Screened</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">652</div>
                  <div className="text-xs text-green-700 mt-1">94% coverage</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Needs Treatment</div>
                  <div className="text-2xl font-bold text-orange-900 mt-1">187</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Treatment Complete</div>
                  <div className="text-2xl font-bold text-purple-900 mt-1">142</div>
                  <div className="text-xs text-purple-700 mt-1">76% completion</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">DOH IPTR Compliance Checklist</h4>
                <div className="space-y-2">
                  {[
                    { item: 'Patient medical history forms completed', status: true },
                    { item: 'FDI notation system implemented', status: true },
                    { item: 'DOH treatment codes applied', status: true },
                    { item: 'Fluoride application records maintained', status: true },
                    { item: 'Risk stratification documented', status: true },
                    { item: 'Follow-up schedules tracked', status: true },
                  ].map((check, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded ${check.status ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                        {check.status && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm text-gray-700">{check.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-generated Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recently Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { name: 'Monthly Oral Health Report - March 2026', date: '2026-04-01', type: 'monthly', size: '2.4 MB' },
            { name: 'Fluoride Coverage Report - Q1 2026', date: '2026-04-01', type: 'fluoride', size: '1.8 MB' },
            { name: 'DOH Compliance Report - March 2026', date: '2026-03-31', type: 'doh-compliance', size: '3.2 MB' },
            { name: 'Procedure Volume Report - February 2026', date: '2026-03-01', type: 'procedure', size: '1.5 MB' },
          ].map((report, idx) => (
            <div key={idx} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">
                    Generated: {new Date(report.date).toLocaleDateString()} • {report.size}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      )}
    </div>
  );
};
