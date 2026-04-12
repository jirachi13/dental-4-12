import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Filter, Plus, Eye, ChevronDown, X, ChevronRight, Home, School as SchoolIcon, GraduationCap, Users as UsersIcon } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

type NavigationLevel = 'schools' | 'grades' | 'sections' | 'students';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

export const PatientList = () => {
  const navigate = useNavigate();

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('schools');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Filter and search state (only for Level 4: students)
  const [searchTerm, setSearchTerm] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);

  // Helper function to calculate age from birthdate
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

  // Helper function to determine age group
  const getAgeGroup = (age: number) => {
    if (age >= 0 && age <= 5) return '0-5 years';
    if (age >= 6 && age <= 14) return '6-14 years';
    if (age >= 15 && age <= 19) return '15-19 years';
    return 'Other';
  };

  // Form state
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthdate: '',
    gender: '',
    grade: '',
    section: '',
    school: '',
    guardianName: '',
    guardianContact: '',
    address: '',
  });

  // Mock data - comprehensive student list
  const allStudents = [
    // Bagong Tanyag Integrated School
    { id: '1', name: 'Juan Dela Cruz', birthdate: '2016-03-15', gender: 'Male', grade: 'Grade 4', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-15', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '2', name: 'Maria Santos', birthdate: '2016-07-22', gender: 'Female', grade: 'Grade 4', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-01', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '3', name: 'Ana Garcia', birthdate: '2018-05-12', gender: 'Female', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-10', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '4', name: 'Roberto Cruz', birthdate: '2017-01-20', gender: 'Male', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-25', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '5', name: 'Sofia Reyes', birthdate: '2015-11-08', gender: 'Female', grade: 'Grade 5', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-20', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '6', name: 'Diego Lopez', birthdate: '2019-03-15', gender: 'Male', grade: 'Grade 1', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-05', oralStatus: 'Under Treatment', riskLevel: 'Medium' },

    // Bagong Tanyag Elementary School Annex A
    { id: '7', name: 'Jose Martinez', birthdate: '2013-09-30', gender: 'Male', grade: 'Grade 6', section: 'Lily', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-28', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '8', name: 'Isabella Gomez', birthdate: '2017-04-18', gender: 'Female', grade: 'Grade 3', section: 'Sunflower', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-12', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '9', name: 'Miguel Torres', birthdate: '2016-12-05', gender: 'Male', grade: 'Grade 4', section: 'Dahlia', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-15', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '10', name: 'Carmen Flores', birthdate: '2018-08-22', gender: 'Female', grade: 'Grade 2', section: 'Daisy', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-10', oralStatus: 'Under Treatment', riskLevel: 'Medium' },

    // South Daang Hari Elementary School Main
    { id: '11', name: 'Pedro Reyes', birthdate: '2014-11-08', gender: 'Male', grade: 'Grade 5', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-20', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '12', name: 'Carlos Mendoza', birthdate: '2019-01-25', gender: 'Male', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-15', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '13', name: 'Lucia Diaz', birthdate: '2015-06-14', gender: 'Female', grade: 'Grade 5', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-18', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '14', name: 'Rafael Santos', birthdate: '2016-09-03', gender: 'Male', grade: 'Grade 4', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-08', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '15', name: 'Valentina Cruz', birthdate: '2017-02-28', gender: 'Female', grade: 'Grade 3', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-30', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
  ];

  // Calculate school data with student counts
  const schools = [
    { name: 'Bagong Tanyag Integrated School', shortName: 'Bagong Tanyag Integrated' },
    { name: 'Bagong Tanyag Elementary School Annex A', shortName: 'Bagong Tanyag Annex A' },
    { name: 'South Daang Hari Elementary School Main', shortName: 'South Daang Hari Main' },
  ].map(school => {
    const studentCount = allStudents.filter(s => s.school === school.name).length;
    return { ...school, studentCount };
  });

  // Get grades for selected school
  const getGradesForSchool = (schoolName: string) => {
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    return grades.map(grade => {
      const studentCount = allStudents.filter(s => s.school === schoolName && s.grade === grade).length;
      return { grade, studentCount };
    }).filter(g => g.studentCount > 0);
  };

  // Get sections for selected school and grade
  const getSectionsForGrade = (schoolName: string, grade: string) => {
    const sections = [...new Set(allStudents
      .filter(s => s.school === schoolName && s.grade === grade)
      .map(s => s.section))];

    return sections.map(section => {
      const studentCount = allStudents.filter(s =>
        s.school === schoolName && s.grade === grade && s.section === section
      ).length;
      return { section, studentCount };
    });
  };

  // Get students for current selection (Level 4 only)
  const getStudentsForSection = () => {
    if (!selectedSchool || !selectedGrade || !selectedSection) return [];

    return allStudents.filter(s =>
      s.school === selectedSchool &&
      s.grade === selectedGrade &&
      s.section === selectedSection
    );
  };

  // Filter students at Level 4
  const filteredStudents = getStudentsForSection().filter(student => {
    const age = calculateAge(student.birthdate);
    const ageGroup = getAgeGroup(age);

    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = ageGroupFilter === 'all' || ageGroup === ageGroupFilter;
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'all' || student.oralStatus === statusFilter;

    return matchesSearch && matchesAgeGroup && matchesGender && matchesRisk && matchesStatus;
  });

  // Navigation helpers
  const navigateToSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSelectedGrade(null);
    setSelectedSection(null);
    setCurrentLevel('grades');
    // Clear filters when navigating
    setSearchTerm('');
    setAgeGroupFilter('all');
    setGenderFilter('all');
    setRiskFilter('all');
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

  const navigateBack = () => {
    if (currentLevel === 'students') {
      setSelectedSection(null);
      setCurrentLevel('sections');
      setSearchTerm('');
      setAgeGroupFilter('all');
      setGenderFilter('all');
      setRiskFilter('all');
      setStatusFilter('all');
    } else if (currentLevel === 'sections') {
      setSelectedGrade(null);
      setCurrentLevel('grades');
    } else if (currentLevel === 'grades') {
      setSelectedSchool(null);
      setCurrentLevel('schools');
    }
  };

  const navigateToSchools = () => {
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedSection(null);
    setCurrentLevel('schools');
    setSearchTerm('');
    setAgeGroupFilter('all');
    setGenderFilter('all');
    setRiskFilter('all');
    setStatusFilter('all');
  };

  // Build breadcrumb trail
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Schools', onClick: navigateToSchools }
    ];

    if (selectedSchool) {
      const school = schools.find(s => s.name === selectedSchool);
      breadcrumbs.push({
        label: school?.shortName || selectedSchool,
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

  // Handle global search (available at all levels)
  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;

    // Search for student by name across all records
    const foundStudent = allStudents.find(s =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundStudent) {
      // Jump directly to student profile
      navigate(`/patients/${foundStudent.id}`);
    } else {
      alert('No student found with that name');
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Orally Fit': return 'bg-green-100 text-green-700';
      case 'Under Treatment': return 'bg-blue-100 text-blue-700';
      case 'Needs Treatment': return 'bg-red-100 text-red-700';
      case 'Needs Follow-up': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb and Search */}
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
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

        {/* Header and Global Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
            {currentLevel === 'schools' && (
              <p className="text-gray-600 mt-1">{schools.length} schools · {allStudents.length} total students</p>
            )}
            {currentLevel === 'grades' && selectedSchool && (
              <p className="text-gray-600 mt-1">{getGradesForSchool(selectedSchool).length} grades · {allStudents.filter(s => s.school === selectedSchool).length} students</p>
            )}
            {currentLevel === 'sections' && selectedSchool && selectedGrade && (
              <p className="text-gray-600 mt-1">{getSectionsForGrade(selectedSchool, selectedGrade).length} sections · {allStudents.filter(s => s.school === selectedSchool && s.grade === selectedGrade).length} students</p>
            )}
            {currentLevel === 'students' && (
              <p className="text-gray-600 mt-1">{filteredStudents.length} students</p>
            )}
          </div>

          {/* Global Search Bar */}
          <div className="w-full sm:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student by name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGlobalSearch(e.currentTarget.value);
                  }
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter to jump to student profile</p>
          </div>
        </div>
      </div>

      {/* LEVEL 1: SCHOOL LIST */}
      {currentLevel === 'schools' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schools.map((school) => (
            <button
              key={school.name}
              onClick={() => navigateToSchool(school.name)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#1E40AF] transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1E40AF] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-20 transition-colors">
                  <SchoolIcon className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{school.shortName}</h3>
                  <p className="text-3xl font-bold text-[#1E40AF] mb-2">{school.studentCount}</p>
                  <p className="text-sm text-gray-600">students enrolled</p>
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

      {/* LEVEL 4: STUDENT LIST WITH FILTERS */}
      {currentLevel === 'students' && selectedSchool && selectedGrade && selectedSection && (
        <>
          {/* Filters Row */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Age Group Filter */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Age Group</label>
                <select
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">All Ages</option>
                  <option value="0-5 years">0-5 years</option>
                  <option value="6-14 years">6-14 years</option>
                  <option value="15-19 years">15-19 years</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Gender</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">Both</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Risk Level</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

              {/* Oral Status Filter */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Oral Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Orally Fit">Orally Fit</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Needs Treatment">Needs Treatment</option>
                  <option value="Needs Follow-up">Needs Follow-up</option>
                </select>
              </div>

              {/* Search within section */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oral Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const age = calculateAge(student.birthdate);
                    const gradeColor = getGradeColor(student.grade);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: gradeColor.light,
                              color: gradeColor.solid
                            }}
                          >
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{age} years</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(student.riskLevel)}`}>
                            {student.riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(student.oralStatus)}`}>
                            {student.oralStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.lastVisit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/patients/${student.id}`}
                            className="text-[#1E40AF] hover:text-[#1E3A8A] font-medium flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
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

      {/* Add Patient Modal */}
      {showAddPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
              <button
                onClick={() => setShowAddPatientForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    placeholder="Juan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    placeholder="Dela Cruz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={newPatient.middleName}
                    onChange={(e) => setNewPatient({ ...newPatient, middleName: e.target.value })}
                    placeholder="Santos"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate *</label>
                  <input
                    type="date"
                    value={newPatient.birthdate}
                    onChange={(e) => setNewPatient({ ...newPatient, birthdate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade *</label>
                  <select
                    value={newPatient.grade}
                    onChange={(e) => setNewPatient({ ...newPatient, grade: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                  <input
                    type="text"
                    value={newPatient.section}
                    onChange={(e) => setNewPatient({ ...newPatient, section: e.target.value })}
                    placeholder="A, B, C, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
                  <select
                    value={newPatient.school}
                    onChange={(e) => setNewPatient({ ...newPatient, school: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select School</option>
                    <option value="Bagong Tanyag Integrated School">Bagong Tanyag Integrated</option>
                    <option value="Bagong Tanyag Elementary School Annex A">Bagong Tanyag Annex A</option>
                    <option value="South Daang Hari Elementary School Main">South Daang Hari Main</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name *</label>
                  <input
                    type="text"
                    value={newPatient.guardianName}
                    onChange={(e) => setNewPatient({ ...newPatient, guardianName: e.target.value })}
                    placeholder="Full name of parent/guardian"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Contact *</label>
                  <input
                    type="tel"
                    value={newPatient.guardianContact}
                    onChange={(e) => setNewPatient({ ...newPatient, guardianContact: e.target.value })}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="Street, Barangay, City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    // Validate form
                    if (!newPatient.firstName || !newPatient.lastName || !newPatient.birthdate || 
                        !newPatient.gender || !newPatient.grade || !newPatient.section || 
                        !newPatient.school || !newPatient.guardianName || !newPatient.guardianContact || 
                        !newPatient.address) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    
                    // Success
                    alert(`Patient ${newPatient.firstName} ${newPatient.lastName} added successfully!`);
                    setShowAddPatientForm(false);
                    // Reset form
                    setNewPatient({
                      firstName: '',
                      lastName: '',
                      middleName: '',
                      birthdate: '',
                      gender: '',
                      grade: '',
                      section: '',
                      school: '',
                      guardianName: '',
                      guardianContact: '',
                      address: '',
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPatientForm(false);
                    setNewPatient({
                      firstName: '',
                      lastName: '',
                      middleName: '',
                      birthdate: '',
                      gender: '',
                      grade: '',
                      section: '',
                      school: '',
                      guardianName: '',
                      guardianContact: '',
                      address: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};