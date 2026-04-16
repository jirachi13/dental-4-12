import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, FileText, Eye, School as SchoolIcon, List } from 'lucide-react';

import { getGradeColor } from '../utils/gradeColors';

const SCHOOLS = [
  'Bagong Tanyag Integrated School',
  'Bagong Tanyag Elementary School Annex A',
  'South Daang Hari Elementary School Main',
];
const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
const TREATMENT_TYPES = ['Oral Prophylaxis','Fluoride Varnish','Tooth Extraction','Permanent Filling','Temporary Filling','Pit & Fissure Sealant','Silver Diamine Fluoride','Oral Health Instruction','Screening'];

const mockTreatments = [
  { id:'1',  studentId:'1',  studentName:'Juan Morales',       gender:'Male',   age:10, grade:'Grade 4', section:'Sampaguita', school:'Bagong Tanyag Integrated School',               visitDate:'2026-03-10', treatmentType:'Tooth Extraction',         diagnosis:'Dental Caries',                 treatmentDone:'Extraction tooth 16' },
  { id:'2',  studentId:'2',  studentName:'Isabella Villanueva',gender:'Female', age:9,  grade:'Grade 3', section:'Jasmine',    school:'Bagong Tanyag Integrated School',               visitDate:'2026-03-08', treatmentType:'Fluoride Varnish',          diagnosis:'Caries risk — high',            treatmentDone:'Fluoride varnish application' },
  { id:'3',  studentId:'3',  studentName:'Aldrin Villanueva',  gender:'Male',   age:8,  grade:'Grade 2', section:'Rose',       school:'Bagong Tanyag Integrated School',               visitDate:'2026-03-05', treatmentType:'Oral Prophylaxis',          diagnosis:'Gingivitis',                    treatmentDone:'Oral prophylaxis' },
  { id:'4',  studentId:'7',  studentName:'Jose Martinez',      gender:'Male',   age:11, grade:'Grade 6', section:'Coral',      school:'Bagong Tanyag Elementary School Annex A',       visitDate:'2026-03-12', treatmentType:'Permanent Filling',        diagnosis:'Caries tooth 36',               treatmentDone:'Composite filling' },
  { id:'5',  studentId:'9',  studentName:'Miguel Torres',      gender:'Male',   age:9,  grade:'Grade 4', section:'Opal',       school:'Bagong Tanyag Elementary School Annex A',       visitDate:'2026-03-09', treatmentType:'Tooth Extraction',         diagnosis:'Non-restorable caries',         treatmentDone:'Extraction tooth 74' },
  { id:'6',  studentId:'11', studentName:'Pedro Reyes',        gender:'Male',   age:11, grade:'Grade 5', section:'Yakal',      school:'South Daang Hari Elementary School Main',       visitDate:'2026-03-01', treatmentType:'Fluoride Varnish',          diagnosis:'Preventive care visit 1',       treatmentDone:'Fluoride varnish + OHI' },
  { id:'7',  studentId:'13', studentName:'Lucia Diaz',         gender:'Female', age:10, grade:'Grade 5', section:'Lauan',      school:'South Daang Hari Elementary School Main',       visitDate:'2026-02-28', treatmentType:'Oral Prophylaxis',          diagnosis:'Plaque accumulation',           treatmentDone:'Scaling and polishing' },
  { id:'8',  studentId:'15', studentName:'Valentina Cruz',     gender:'Female', age:9,  grade:'Grade 3', section:'Bamboo',     school:'South Daang Hari Elementary School Main',       visitDate:'2026-02-25', treatmentType:'Pit & Fissure Sealant',    diagnosis:'Deep fissures',                 treatmentDone:'PFS teeth 16,26,36,46' },
  { id:'9',  studentId:'4',  studentName:'Elena Morales',      gender:'Female', age:8,  grade:'Grade 2', section:'Dahlia',     school:'Bagong Tanyag Integrated School',               visitDate:'2026-02-20', treatmentType:'Screening',                diagnosis:'Annual oral health screening',  treatmentDone:'Oral examination — orally fit' },
  { id:'10', studentId:'8',  studentName:'Carmen Flores',      gender:'Female', age:8,  grade:'Grade 2', section:'Diamond',    school:'Bagong Tanyag Elementary School Annex A',       visitDate:'2026-02-18', treatmentType:'Silver Diamine Fluoride',  diagnosis:'Early childhood caries',        treatmentDone:'SDF application' },
  { id:'11', studentId:'14', studentName:'Rafael Santos',      gender:'Male',   age:9,  grade:'Grade 4', section:'Kamagong',   school:'South Daang Hari Elementary School Main',       visitDate:'2026-02-15', treatmentType:'Temporary Filling',        diagnosis:'Caries tooth 85',               treatmentDone:'IRM temporary filling' },
  { id:'12', studentId:'5',  studentName:'Sofia Reyes',        gender:'Female', age:10, grade:'Grade 5', section:'Sunflower',  school:'Bagong Tanyag Integrated School',               visitDate:'2026-02-10', treatmentType:'Oral Health Instruction',  diagnosis:'Poor oral hygiene',             treatmentDone:'Brushing and flossing demo' },
];

export const TreatmentRecords = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'school' | 'list'>('school');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [treatmentFilter, setTreatmentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const getAgeGroup = (age: number) => {
    if (age <= 5) return 'Under 5';
    if (age <= 10) return '6-10';
    if (age <= 14) return '10-14';
    return '15-19';
  };

  const filtered = useMemo(() => mockTreatments.filter(t => {
    if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
    if (genderFilter !== 'all' && t.gender !== genderFilter) return false;
    if (ageGroupFilter !== 'all' && getAgeGroup(t.age) !== ageGroupFilter) return false;
    if (treatmentFilter !== 'all' && t.treatmentType !== treatmentFilter) return false;
    if (dateFrom && t.visitDate < dateFrom) return false;
    if (dateTo && t.visitDate > dateTo) return false;
    if (searchTerm && !t.studentName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }), [gradeFilter, genderFilter, ageGroupFilter, treatmentFilter, dateFrom, dateTo, searchTerm]);

  const hasActiveFilters = [gradeFilter, genderFilter, ageGroupFilter, treatmentFilter].some(f => f !== 'all') || searchTerm !== '' || dateFrom !== '' || dateTo !== '';
  const clearFilters = () => { setGradeFilter('all'); setGenderFilter('all'); setAgeGroupFilter('all'); setTreatmentFilter('all'); setDateFrom(''); setDateTo(''); setSearchTerm(''); };

  const FS = ({ value, onChange, opts, label }: { value: string; onChange: (v: string) => void; opts: {v:string;l:string}[]; label: string }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="all">{label}</option>
      {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <FS value={gradeFilter} onChange={g => { setGradeFilter(g); setSectionFilter('all'); }} label="All Grades" opts={GRADES.map(g => ({ v: g, l: g }))} />
          <FS value={sectionFilter} onChange={setSectionFilter} label="All Sections" opts={[...new Set((gradeFilter !== 'all' ? mockTreatments.filter((r:any) => r.grade === gradeFilter) : mockTreatments).map((r:any) => r.section))].sort().map((s:any) => ({ v: s, l: s }))} />
          <FS value={genderFilter} onChange={setGenderFilter} label="All Genders" opts={[{ v:'Male', l:'Male' }, { v:'Female', l:'Female' }]} />
          <FS value={ageGroupFilter} onChange={setAgeGroupFilter} label="All Age Groups"
            opts={[{ v:'Under 5', l:'Under 5' }, { v:'6-10', l:'6–10' }, { v:'10-14', l:'10–14' }, { v:'15-19', l:'15–19' }]} />
          <FS value={treatmentFilter} onChange={setTreatmentFilter} label="All Treatment Types" opts={TREATMENT_TYPES.map(t => ({ v: t, l: t }))} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-sm text-gray-500">To</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">School</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Grade / Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Visit Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Treatment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Diagnosis</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Treatment Done</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No treatment records match the selected filters.</td></tr>
              ) : filtered.map(t => {
                const gc = getGradeColor(t.grade);
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                          {t.studentName.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t.studentName}</div>
                          <div className="text-xs text-gray-500">{t.gender} · Age {t.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">{t.school}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: gc.light, color: gc.solid }}>{t.grade}</span>
                      <span className="text-gray-500 text-xs ml-1">{t.section}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.visitDate}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{t.treatmentType}</span></td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{t.diagnosis}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{t.treatmentDone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/dental-chart/${t.studentId}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Patient"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/dental-chart/${t.studentId}?tab=treatments`)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="View Treatment Log"><FileText className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {mockTreatments.length} records</div>}
      </div>
    </div>
  );
};
