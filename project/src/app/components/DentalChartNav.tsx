import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Eye, School as SchoolIcon, List } from 'lucide-react';

import { getGradeColor } from '../utils/gradeColors';

const SCHOOLS = [
  'Bagong Tanyag Integrated School',
  'Bagong Tanyag Elementary School Annex A',
  'South Daang Hari Elementary School Main',
];
const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];

const mockCharts = [
  { id:'1', studentId:'1', studentName:'Juan Morales',        gender:'Male',   grade:'Grade 4', section:'Sampaguita', school:'Bagong Tanyag Integrated School',         yearNumber:2026, dateCharted:'2026-03-10', dmfIndex:4, status:'Complete' },
  { id:'2', studentId:'2', studentName:'Isabella Villanueva', gender:'Female', grade:'Grade 3', section:'Jasmine',    school:'Bagong Tanyag Integrated School',         yearNumber:2026, dateCharted:'2026-03-08', dmfIndex:2, status:'Complete' },
  { id:'3', studentId:'3', studentName:'Aldrin Villanueva',   gender:'Male',   grade:'Grade 2', section:'Rose',       school:'Bagong Tanyag Integrated School',         yearNumber:2026, dateCharted:'2026-03-05', dmfIndex:1, status:'Incomplete' },
  { id:'4', studentId:'7', studentName:'Jose Martinez',       gender:'Male',   grade:'Grade 6', section:'Coral',      school:'Bagong Tanyag Elementary School Annex A', yearNumber:2026, dateCharted:'2026-03-12', dmfIndex:6, status:'Complete' },
  { id:'5', studentId:'9', studentName:'Miguel Torres',       gender:'Male',   grade:'Grade 4', section:'Opal',       school:'Bagong Tanyag Elementary School Annex A', yearNumber:2026, dateCharted:'2026-03-09', dmfIndex:3, status:'Pending Review' },
  { id:'6', studentId:'11', studentName:'Pedro Reyes',        gender:'Male',   grade:'Grade 5', section:'Yakal',      school:'South Daang Hari Elementary School Main', yearNumber:2026, dateCharted:'2026-03-01', dmfIndex:2, status:'Complete' },
  { id:'7', studentId:'13', studentName:'Lucia Diaz',         gender:'Female', grade:'Grade 5', section:'Lauan',      school:'South Daang Hari Elementary School Main', yearNumber:2026, dateCharted:'2026-02-28', dmfIndex:0, status:'Complete' },
  { id:'8', studentId:'15', studentName:'Valentina Cruz',     gender:'Female', grade:'Grade 3', section:'Bamboo',     school:'South Daang Hari Elementary School Main', yearNumber:2026, dateCharted:'2026-02-25', dmfIndex:1, status:'Incomplete' },
  { id:'9', studentId:'4',  studentName:'Elena Morales',      gender:'Female', grade:'Grade 2', section:'Dahlia',     school:'Bagong Tanyag Integrated School',         yearNumber:2026, dateCharted:'2026-02-20', dmfIndex:0, status:'Complete' },
  { id:'10', studentId:'8', studentName:'Carmen Flores',      gender:'Female', grade:'Grade 2', section:'Diamond',    school:'Bagong Tanyag Elementary School Annex A', yearNumber:2026, dateCharted:'2026-02-18', dmfIndex:3, status:'Pending Review' },
];

export const DentalChartNav = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'school' | 'list'>('school');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => mockCharts.filter(c => {
    if (gradeFilter !== 'all' && c.grade !== gradeFilter) return false;
    if (genderFilter !== 'all' && c.gender !== genderFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm && !c.studentName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }), [gradeFilter, genderFilter, statusFilter, searchTerm]);

  const hasActiveFilters = [gradeFilter, genderFilter, statusFilter].some(f => f !== 'all') || searchTerm !== '';
  const clearFilters = () => { setGradeFilter('all'); setGenderFilter('all'); setStatusFilter('all'); setSearchTerm(''); };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Complete': 'bg-green-100 text-green-800',
      'Incomplete': 'bg-yellow-100 text-yellow-800',
      'Pending Review': 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Dental Charts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} chart{filtered.length !== 1 ? 's' : ''} found</p>
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
          <FS value={sectionFilter} onChange={setSectionFilter} label="All Sections" opts={[...new Set((gradeFilter !== 'all' ? mockCharts.filter((r:any) => r.grade === gradeFilter) : mockCharts).map((r:any) => r.section))].sort().map((s:any) => ({ v: s, l: s }))} />
          <FS value={genderFilter} onChange={setGenderFilter} label="All Genders" opts={[{ v:'Male', l:'Male' }, { v:'Female', l:'Female' }]} />
          <FS value={statusFilter} onChange={setStatusFilter} label="All Statuses"
            opts={[{ v:'Complete', l:'Complete' }, { v:'Incomplete', l:'Incomplete' }, { v:'Pending Review', l:'Pending Review' }]} />
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
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Date Charted</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">DMF Index</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No dental charts match the selected filters.</td></tr>
              ) : filtered.map(c => {
                const gc = getGradeColor(c.grade);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                          {c.studentName.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{c.studentName}</div>
                          <div className="text-xs text-gray-500">{c.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">{c.school}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: gc.light, color: gc.solid }}>{c.grade}</span>
                      <span className="text-gray-500 text-xs ml-1">{c.section}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.yearNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{c.dateCharted}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-lg ${c.dmfIndex >= 5 ? 'text-red-600' : c.dmfIndex >= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {c.dmfIndex}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/dental-chart/${c.studentId}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Open Chart">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {mockCharts.length} charts</div>}
      </div>
    </div>
  );
};
