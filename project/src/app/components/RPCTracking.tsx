import { useState } from 'react';
import { Search, Filter, Plus, Eye, Calendar, CheckCircle, AlertCircle, X, School as SchoolIcon, Home, ChevronRight, GraduationCap, Users as UsersIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';
import { getGradeColor } from '../utils/gradeColors';

type NavigationLevel = 'schools' | 'grades' | 'sections' | 'students';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

export const RPCTracking = () => {
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('schools');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Filter and search state (only for Level 4: students)
  const [searchTerm, setSearchTerm] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [visitNumber, setVisitNumber] = useState<1 | 2>(1);

  // Helper functions
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeGroup = (age: number) => {
    if (age >= 0 && age <= 5) return '0-5 years';
    if (age >= 6 && age <= 14) return '6-14 years';
    if (age >= 15 && age <= 19) return '15-19 years';
    return 'Other';
  };

  // Mock RPC data
  const rpcRecords = [
    {
      id: '1',
      studentName: 'Juan Dela Cruz',
      birthdate: '2016-03-15',
      gender: 'Male',
      school: 'Bagong Tanyag Integrated School',
      grade: 'Grade 4',
      visit1Date: '2026-01-15',
      visit1Status: 'Completed',
      visit2Date: '2026-03-20',
      visit2Status: 'Completed',
      daysUntilDue: 0,
      status: 'complete',
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      birthdate: '2017-07-22',
      gender: 'Female',
      school: 'Bagong Tanyag Elementary School Annex A',
      grade: 'Grade 3',
      visit1Date: '2026-02-10',
      visit1Status: 'Completed',
      visit2Date: null,
      visit2Status: 'Pending',
      daysUntilDue: 45,
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'Pedro Reyes',
      birthdate: '2014-11-08',
      gender: 'Male',
      school: 'South Daang Hari Elementary School Main',
      grade: 'Grade 5',
      visit1Date: '2025-08-15',
      visit1Status: 'Completed',
      visit2Date: null,
      visit2Status: 'Pending',
      daysUntilDue: -30,
      status: 'overdue',
    },
    {
      id: '4',
      studentName: 'Ana Garcia',
      birthdate: '2018-05-12',
      gender: 'Female',
      school: 'Bagong Tanyag Integrated School',
      grade: 'Grade 2',
      visit1Date: null,
      visit1Status: 'Pending',
      visit2Date: null,
      visit2Status: 'Pending',
      daysUntilDue: 0,
      status: 'not-started',
    },
    {
      id: '5',
      studentName: 'Carlos Mendoza',
      birthdate: '2013-09-30',
      gender: 'Male',
      school: 'Bagong Tanyag Elementary School Annex A',
      grade: 'Grade 6',
      visit1Date: '2026-03-01',
      visit1Status: 'Completed',
      visit2Date: null,
      visit2Status: 'Pending',
      daysUntilDue: 90,
      status: 'pending',
    },
  ];

  // Calculate KPI metrics
  const totalEnrolled = 120;
  const visit1Completed = rpcRecords.filter(r => r.visit1Status === 'Completed').length;
  const visit2Completed = rpcRecords.filter(r => r.visit2Status === 'Completed').length;
  const fluorideDueThisMonth = rpcRecords.filter(r => r.daysUntilDue > 0 && r.daysUntilDue <= 30).length;

  // Chart data - RPC completion by school
  const chartData = [
    {
      school: 'Bagong Tanyag Integrated',
      visit1: 35,
      bothVisits: 28,
      overdue: 5,
    },
    {
      school: 'Annex A',
      visit1: 30,
      bothVisits: 22,
      overdue: 8,
    },
    {
      school: 'South Daang Hari',
      visit1: 25,
      bothVisits: 18,
      overdue: 3,
    },
  ];

  const getRowColorClass = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'overdue':
        return 'bg-red-50 hover:bg-red-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>;
      case 'Pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Missed':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Missed</span>;
      default:
        return null;
    }
  };

  const handleRecordVisit = (student: any, visit: 1 | 2) => {
    setSelectedStudent(student);
    setVisitNumber(visit);
    setShowRecordModal(true);
  };

  const handleSubmitVisit = () => {
    alert(`RPC Visit ${visitNumber} for ${selectedStudent?.studentName} has been recorded successfully!`);
    setShowRecordModal(false);
    setSelectedStudent(null);
  };

  // Navigation functions
  const navigateToSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSelectedGrade(null);
    setSelectedSection(null);
    setCurrentLevel('grades');
    setSearchTerm('');
    setAgeGroupFilter('all');
    setGenderFilter('all');
    setStatusFilter('all');
  };

  const navigateToGrade = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedSection(null);
    setCurrentLevel('sections');
  };

  const navigateToSection = (section: string) => {
    setSelectedSection(section);
    setCurrentLevel('students');
  };

  const navigateToSchools = () => {
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedSection(null);
    setCurrentLevel('schools');
    setSearchTerm('');
    setAgeGroupFilter('all');
    setGenderFilter('all');
    setStatusFilter('all');
  };

  // Build breadcrumb trail
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Schools', onClick: navigateToSchools }
    ];

    if (selectedSchool) {
      breadcrumbs.push({
        label: selectedSchool.replace('Bagong Tanyag Elementary School ', 'Bagong Tanyag '),
        onClick: () => {
          setSelectedSchool(selectedSchool);
          setSelectedGrade(null);
          setSelectedSection(null);
          setCurrentLevel('grades');
        }
      });
    }

    if (selectedGrade) {
      breadcrumbs.push({
        label: selectedGrade,
        onClick: () => {
          setSelectedGrade(selectedGrade);
          setSelectedSection(null);
          setCurrentLevel('sections');
        }
      });
    }

    if (selectedSection) {
      breadcrumbs.push({
        label: `Section ${selectedSection}`,
        onClick: () => {}
      });
    }

    return breadcrumbs;
  };

  // Get students for current section
  const getStudentsForSection = () => {
    if (!selectedSchool || !selectedGrade || !selectedSection) return [];

    return rpcRecords.filter(s =>
      s.school === selectedSchool &&
      s.grade === selectedGrade &&
      s.grade.includes(selectedSection) // Simplified - in real app would have section field
    );
  };

  // Filter students at Level 4
  const filteredRecords = currentLevel === 'students'
    ? getStudentsForSection().filter(record => {
        const age = calculateAge(record.birthdate);
        const ageGroup = getAgeGroup(age);

        const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAgeGroup = ageGroupFilter === 'all' || ageGroup === ageGroupFilter;
        const matchesGender = genderFilter === 'all' || record.gender === genderFilter;
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

        return matchesSearch && matchesAgeGroup && matchesGender && matchesStatus;
      })
    : rpcRecords;

  // Calculate school RPC stats
  const getSchoolRPCStats = () => {
    const schoolData = [
      { name: 'Bagong Tanyag Integrated School', shortName: 'Bagong Tanyag Integrated' },
      { name: 'Bagong Tanyag Elementary School Annex A', shortName: 'Bagong Tanyag Annex A' },
      { name: 'South Daang Hari Elementary School Main', shortName: 'South Daang Hari Main' },
    ];

    return schoolData.map(school => {
      const schoolRecords = rpcRecords.filter(r => r.school === school.name);
      const visit1Complete = schoolRecords.filter(r => r.visit1Status === 'Completed').length;
      const visit2Complete = schoolRecords.filter(r => r.visit2Status === 'Completed').length;
      const overdue = schoolRecords.filter(r => r.status === 'overdue').length;
      const total = schoolRecords.length;

      return {
        ...school,
        visit1Percent: total > 0 ? Math.round((visit1Complete / total) * 100) : 0,
        visit2Percent: total > 0 ? Math.round((visit2Complete / total) * 100) : 0,
        overdueCount: overdue,
        totalStudents: total,
      };
    });
  };

  // Get grades for selected school
  const getGradesForSchool = (schoolName: string) => {
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    return grades.map(grade => {
      const studentCount = rpcRecords.filter(s => s.school === schoolName && s.grade === grade).length;
      return { grade, studentCount };
    }).filter(g => g.studentCount > 0);
  };

  // Get sections for selected school and grade (simplified)
  const getSectionsForGrade = (schoolName: string, grade: string) => {
    const sections = ['Sampaguita', 'Rose', 'Jasmine'];
    return sections.map((section, idx) => ({
      section,
      studentCount: Math.floor(Math.random() * 20) + 10 // Mock count
    }));
  };

  const breadcrumbs = getBreadcrumbs();
  const schoolStats = getSchoolRPCStats();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {breadcrumbs.length > 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          {breadcrumbs.map((crumb, index) => {
            const isGrade = crumb.label.startsWith('Grade') || crumb.label === 'Kinder';
            const gradeColor = isGrade ? getGradeColor(crumb.label) : null;

            return (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className="font-medium"
                    style={gradeColor ? { color: gradeColor.solid } : { color: '#111827' }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={crumb.onClick}
                    className="hover:underline"
                    style={gradeColor ? { color: gradeColor.solid } : {}}
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">RPC Records</h1>
        <p className="text-gray-600 mt-1">Routine Preventive Care - Fluoride application tracking</p>
      </div>

      {/* LEVEL 1: SCHOOL CARDS */}
      {currentLevel === 'schools' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schoolStats.map((school) => (
            <button
              key={school.name}
              onClick={() => navigateToSchool(school.name)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#1E40AF] transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#06B6D4] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-20 transition-colors">
                  <SchoolIcon className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{school.shortName}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visit 1 Complete</span>
                      <span className="text-lg font-bold text-green-600">{school.visit1Percent}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visit 2 Complete</span>
                      <span className="text-lg font-bold text-blue-600">{school.visit2Percent}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overdue</span>
                      <span className="text-lg font-bold text-red-600">{school.overdueCount}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{school.totalStudents} students tracked</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* LEVEL 2: GRADE LIST */}
      {currentLevel === 'grades' && selectedSchool && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Select Grade Level</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {getGradesForSchool(selectedSchool).map(({ grade, studentCount }) => {
              const gradeColor = getGradeColor(grade);
              return (
                <button
                  key={grade}
                  onClick={() => navigateToGrade(grade)}
                  className="w-full flex items-center justify-between px-6 py-4 transition-colors group border-l-4"
                  style={{
                    borderLeftColor: gradeColor.solid,
                    backgroundColor: gradeColor.light
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: gradeColor.solid + '20' }}
                    >
                      <GraduationCap className="w-5 h-5" style={{ color: gradeColor.solid }} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium" style={{ color: gradeColor.solid }}>{grade}</h3>
                      <p className="text-sm text-gray-700">{studentCount} students</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: gradeColor.solid }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LEVEL 3: SECTION LIST */}
      {currentLevel === 'sections' && selectedSchool && selectedGrade && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Select Section</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {getSectionsForGrade(selectedSchool, selectedGrade).map(({ section, studentCount }) => {
              const gradeColor = getGradeColor(selectedGrade || '');
              return (
                <button
                  key={section}
                  onClick={() => navigateToSection(section)}
                  className="w-full flex items-center justify-between px-6 py-4 transition-colors group border-l-4"
                  style={{
                    borderLeftColor: gradeColor.solid,
                    backgroundColor: gradeColor.light + '80'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: gradeColor.solid + '20' }}
                    >
                      <UsersIcon className="w-5 h-5" style={{ color: gradeColor.solid }} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Section {section}</h3>
                      <p className="text-sm text-gray-700">{studentCount} students</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: gradeColor.solid }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LEVEL 4: STUDENT LIST - Keep existing KPI cards and table */}
      {currentLevel === 'students' && selectedSchool && selectedGrade && selectedSection && (
        <>
          {/* KPI Cards - showing only for selected section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Students</span>
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{filteredRecords.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Visit 1 Complete</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.visit1Status === 'Completed').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Visit 2 Complete</span>
                <CheckCircle className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.visit2Status === 'Completed').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overdue</span>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.status === 'overdue').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Age Group</label>
                <select
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
                >
                  <option value="all">All Ages</option>
                  <option value="0-5 years">0-5 years</option>
                  <option value="6-14 years">6-14 years</option>
                  <option value="15-19 years">15-19 years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Gender</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
                >
                  <option value="all">Both</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">RPC Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name..."
                    className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RPC Status Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit 1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit 2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Until Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => {
                    const age = calculateAge(record.birthdate);
                    const ageGroup = getAgeGroup(age);
                    const gradeColor = getGradeColor(record.grade);
                    return (
                      <tr key={record.id} className={getRowColorClass(record.status)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{record.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: gradeColor.light,
                              color: gradeColor.solid
                            }}
                          >
                            {record.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {age} ({ageGroup})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {record.visit1Date && <div className="text-gray-900">{record.visit1Date}</div>}
                            {getStatusBadge(record.visit1Status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {record.visit2Date && <div className="text-gray-900">{record.visit2Date}</div>}
                            {getStatusBadge(record.visit2Status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.daysUntilDue > 0 ? (
                            <span className="text-sm text-yellow-600">{record.daysUntilDue} days</span>
                          ) : record.daysUntilDue < 0 ? (
                            <span className="text-sm text-red-600 font-medium">Overdue by {Math.abs(record.daysUntilDue)} days</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {record.visit1Status === 'Pending' && (
                              <button
                                onClick={() => handleRecordVisit(record, 1)}
                                className="text-[#06B6D4] hover:text-[#0891B2] font-medium"
                              >
                                Record Visit 1
                              </button>
                            )}
                            {record.visit1Status === 'Completed' && record.visit2Status === 'Pending' && (
                              <button
                                onClick={() => handleRecordVisit(record, 2)}
                                className="text-[#06B6D4] hover:text-[#0891B2] font-medium"
                              >
                                Record Visit 2
                              </button>
                            )}
                            <Link to={`/patients/${record.id}`} className="text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      {/* Record Visit Modal */}
      {showRecordModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Record RPC Visit {visitNumber}</h2>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <input
                  type="text"
                  value={selectedStudent.studentName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visit Number</label>
                <input
                  type="text"
                  value={`Visit ${visitNumber}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Type *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
                  <option value="">Select treatment</option>
                  <option value="Oral Prophylaxis">Oral Prophylaxis</option>
                  <option value="Fluoride Varnish">Fluoride Varnish</option>
                  <option value="OHI">Oral Health Instruction (OHI)</option>
                  <option value="Screening">Screening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Status *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Schedule Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 4-6 months after Visit 1</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleSubmitVisit}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Record Visit
              </button>
              <button
                onClick={() => setShowRecordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};