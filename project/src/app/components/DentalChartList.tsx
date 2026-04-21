import { Link } from 'react-router';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// Mock patient data with all fields
const allPatients = [
  { id: '1', name: 'Juan Morales', birthdate: '2015-07-23', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '2', name: 'Isabella Villanueva', birthdate: '2015-08-07', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '3', name: 'Aldrin Villanueva', birthdate: '2015-11-22', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '4', name: 'Elena Morales', birthdate: '2015-10-10', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '5', name: 'Trisha Santos', birthdate: '2015-01-27', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita' },
  { id: '6', name: 'Katrina Lopez', birthdate: '2014-12-23', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '7', name: 'Ana Morales', birthdate: '2014-11-11', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '8', name: 'Patricia Garcia', birthdate: '2015-01-03', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '9', name: 'Trisha Lopez', birthdate: '2015-02-13', gender: 'Female', grade: 'Grade 1', section: 'Rosal' },
  { id: '10', name: 'Nico Castillo', birthdate: '2015-02-17', gender: 'Male', grade: 'Grade 1', section: 'Rosal' },
];

const GRADES = ['Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'];

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

export const DentalChartList = () => {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');

  const allSections = useMemo(() => {
    let base = gradeFilter !== 'all' ? allPatients.filter(p => p.grade === gradeFilter) : allPatients;
    return [...new Set(base.map(p => p.section))].sort();
  }, [gradeFilter]);

  const filtered = useMemo(() => allPatients.filter(p => {
    const age = calculateAge(p.birthdate);
    const ag = getAgeGroup(age);
    if (gradeFilter !== 'all' && p.grade !== gradeFilter) return false;
    if (sectionFilter !== 'all' && p.section !== sectionFilter) return false;
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (ageGroupFilter !== 'all' && ag !== ageGroupFilter) return false;
    return true;
  }), [gradeFilter, sectionFilter, genderFilter, ageGroupFilter]);

  const hasActiveFilters = gradeFilter !== 'all' || sectionFilter !== 'all' || genderFilter !== 'all' || ageGroupFilter !== 'all';
  const clearFilters = () => { setGradeFilter('all'); setSectionFilter('all'); setGenderFilter('all'); setAgeGroupFilter('all'); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dental Charts</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setSectionFilter('all'); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Grades</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Sections</option>
            {allSections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select value={ageGroupFilter} onChange={e => setAgeGroupFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Age Groups</option>
            <option value="4 & below">4 & below</option>
            <option value="5-9">5-9</option>
            <option value="10-14">10-14</option>
            <option value="15-19">15-19</option>
            <option value="20 & above">20 & above</option>
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
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
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No dental charts match the selected filters.</td></tr>
              ) : filtered.map(patient => {
                const age = calculateAge(patient.birthdate);
                return (
                  <tr key={patient.id} onClick={() => window.location.href = `/dental-chart/${patient.id}`} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.grade}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.section}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{age}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {allPatients.length} records
          </div>
        )}
      </div>
    </div>
  );
};
