import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';

const GRADES = ['Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'];

const mockPatients = [
  { id: '1', name: 'Juan Morales', birthdate: '2020-07-23', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '2', name: 'Isabella Villanueva', birthdate: '2020-08-07', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '3', name: 'Aldrin Villanueva', birthdate: '2020-11-22', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '4', name: 'Elena Morales', birthdate: '2020-10-10', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '5', name: 'Trisha Santos', birthdate: '2020-01-27', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '6', name: 'Katrina Lopez', birthdate: '2020-12-23', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '7', name: 'Ana Morales', birthdate: '2020-11-11', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '8', name: 'Patricia Garcia', birthdate: '2020-01-03', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '9', name: 'Trisha Lopez', birthdate: '2020-02-13', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '10', name: 'Nico Castillo', birthdate: '2020-02-17', gender: 'Male', grade: 'Grade 1', section: 'Rosal' },
];

const calculateAge = (birthdate: string) => {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const getAgeGroup = (age: number) => {
  if (age <= 4) return '4 & below';
  if (age <= 9) return '5-9';
  if (age <= 14) return '10-14';
  if (age <= 19) return '15-19';
  return '20 & above';
};

export const TreatmentRecords = () => {
  const navigate = useNavigate();
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');

  const filtered = useMemo(() => mockPatients.filter(t => {
    const age = calculateAge(t.birthdate);
    if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
    if (sectionFilter !== 'all' && t.section !== sectionFilter) return false;
    if (genderFilter !== 'all' && t.gender !== genderFilter) return false;
    if (ageGroupFilter !== 'all' && getAgeGroup(age) !== ageGroupFilter) return false;
    return true;
  }), [gradeFilter, sectionFilter, genderFilter, ageGroupFilter]);

  const hasActiveFilters = [gradeFilter, sectionFilter, genderFilter, ageGroupFilter].some(f => f !== 'all');
  const clearFilters = () => { setGradeFilter('all'); setSectionFilter('all'); setGenderFilter('all'); setAgeGroupFilter('all'); };

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
        <div className="flex flex-wrap gap-2">
          <FS value={gradeFilter} onChange={g => { setGradeFilter(g); setSectionFilter('all'); }} label="All Grades" opts={GRADES.map(g => ({ v: g, l: g }))} />
          <FS value={sectionFilter} onChange={setSectionFilter} label="All Sections" opts={[...new Set((gradeFilter !== 'all' ? mockPatients.filter((r:any) => r.grade === gradeFilter) : mockPatients).map((r:any) => r.section))].sort().map((s:any) => ({ v: s, l: s }))} />
          <FS value={genderFilter} onChange={setGenderFilter} label="All Genders" opts={[{ v:'Male', l:'Male' }, { v:'Female', l:'Female' }]} />
          <FS value={ageGroupFilter} onChange={setAgeGroupFilter} label="All Age Groups"
            opts={[{ v:'4 & below', l:'4 & below' }, { v:'5-9', l:'5-9' }, { v:'10-14', l:'10-14' }, { v:'15-19', l:'15-19' }, { v:'20 & above', l:'20 & above' }]} />
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
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Gender</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No treatment records match the selected filters.</td></tr>
              ) : filtered.map(t => {
                const age = calculateAge(t.birthdate);
                return (
                  <tr key={t.id} onClick={() => navigate(`/dental-chart/${t.id}?tab=treatments`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.grade}</td>
                    <td className="px-4 py-3 text-gray-600">{t.section}</td>
                    <td className="px-4 py-3 text-gray-600">{t.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{age}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {mockPatients.length} records</div>}
      </div>
    </div>
  );
};
