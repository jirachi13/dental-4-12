import { Link } from 'react-router';
import { Search, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export const DentalChartList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Mock data
  const patients = [
    { id: '1', name: 'Juan Dela Cruz', age: 9, grade: 'Grade 4', school: 'Tanyag Elementary', lastUpdated: '2026-03-13', status: 'complete' },
    { id: '2', name: 'Maria Santos', age: 8, grade: 'Grade 3', school: 'Tanyag Elementary', lastUpdated: '2026-03-12', status: 'incomplete' },
    { id: '3', name: 'Pedro Reyes', age: 10, grade: 'Grade 5', school: 'Western Bicutan Elementary', lastUpdated: '2026-03-11', status: 'complete' },
    { id: '4', name: 'Ana Garcia', age: 7, grade: 'Grade 2', school: 'Tanyag Elementary', lastUpdated: '2026-03-10', status: 'complete' },
    { id: '5', name: 'Jose Martinez', age: 11, grade: 'Grade 6', school: 'Upper Bicutan Elementary', lastUpdated: '2026-03-09', status: 'incomplete' },
    { id: '6', name: 'Sofia Lopez', age: 8, grade: 'Grade 3', school: 'Tanyag Elementary', lastUpdated: '2026-03-08', status: 'complete' },
    { id: '7', name: 'Miguel Torres', age: 9, grade: 'Grade 4', school: 'Western Bicutan Elementary', lastUpdated: '2026-03-07', status: 'complete' },
    { id: '8', name: 'Carmen Flores', age: 10, grade: 'Grade 5', school: 'Tanyag Elementary', lastUpdated: '2026-03-06', status: 'incomplete' },
  ];

  const schools = ['Tanyag Elementary', 'Western Bicutan Elementary', 'Upper Bicutan Elementary'];
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = selectedSchool === 'all' || patient.school === selectedSchool;
    const matchesGrade = selectedGrade === 'all' || patient.grade === selectedGrade;
    return matchesSearch && matchesSchool && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dental Charts</h1>
        <p className="text-gray-600 mt-1">View and manage student dental charts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
            />
          </div>

          {/* School Filter */}
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
          >
            <option value="all">All Schools</option>
            {schools.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Charts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredPatients.length}</p>
            </div>
            <FileText className="w-8 h-8 text-[#1E40AF]" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Complete</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {filteredPatients.filter(p => p.status === 'complete').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Incomplete</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {filteredPatients.filter(p => p.status === 'incomplete').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No dental charts found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#06B6D4] flex items-center justify-center text-white font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.age} years old</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.school}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.status === 'complete' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3" />
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/dental-chart/${patient.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white text-sm rounded-lg hover:bg-[#1E3A8A] transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Chart
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
