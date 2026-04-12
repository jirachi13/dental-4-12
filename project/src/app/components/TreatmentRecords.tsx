import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { School as SchoolIcon, Home, ChevronRight, GraduationCap, Users as UsersIcon, Eye, FileText } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

type NavigationLevel = 'schools' | 'grades' | 'sections' | 'students';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

// Mock student data
const mockStudents = [
  { id: '1', name: 'Juan Dela Cruz', gender: 'Male', age: 10, grade: 'Grade 4', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', treatmentCount: 5, lastTreatment: '2026-03-10' },
  { id: '2', name: 'Maria Santos', gender: 'Female', age: 9, grade: 'Grade 3', section: 'Rose', school: 'Bagong Tanyag Integrated School', treatmentCount: 3, lastTreatment: '2026-02-15' },
  { id: '3', name: 'Pedro Reyes', gender: 'Male', age: 11, grade: 'Grade 5', section: 'Narra', school: 'South Daang Hari Elementary School Main', treatmentCount: 7, lastTreatment: '2026-01-20' },
];

export const TreatmentRecords = () => {
  const navigate = useNavigate();

  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('schools');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const navigateToSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSelectedGrade(null);
    setSelectedSection(null);
    setCurrentLevel('grades');
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
  };

  const openTreatmentLog = (studentId: string) => {
    navigate(`/treatment-log/${studentId}`);
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Schools', onClick: navigateToSchools }
    ];

    if (selectedSchool) {
      breadcrumbs.push({
        label: selectedSchool.replace('Bagong Tanyag Elementary School ', 'Bagong Tanyag ').replace(' School', ''),
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

  const schoolStats = [
    { name: 'Bagong Tanyag Integrated School', shortName: 'Bagong Tanyag Integrated', totalTreatments: 1245, thisMonth: 87 },
    { name: 'Bagong Tanyag Elementary School Annex A', shortName: 'Bagong Tanyag Annex A', totalTreatments: 980, thisMonth: 65 },
    { name: 'South Daang Hari Elementary School Main', shortName: 'South Daang Hari Main', totalTreatments: 1105, thisMonth: 72 },
  ];

  const getGradesForSchool = (schoolName: string) => {
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    return grades.map(grade => ({
      grade,
      studentCount: Math.floor(Math.random() * 30) + 20
    }));
  };

  const getSectionsForGrade = (schoolName: string, grade: string) => {
    const sections = ['Sampaguita', 'Rose', 'Jasmine', 'Narra'];
    return sections.map(section => ({
      section,
      studentCount: Math.floor(Math.random() * 20) + 15
    }));
  };

  const getStudentsForSection = () => {
    if (!selectedSchool || !selectedGrade || !selectedSection) return [];
    return mockStudents.filter(s =>
      s.school === selectedSchool &&
      s.grade === selectedGrade &&
      s.section === selectedSection
    );
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="space-y-6">
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
                  <span className="font-medium" style={gradeColor ? { color: gradeColor.solid } : { color: '#111827' }}>{crumb.label}</span>
                ) : (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-[#1E40AF] hover:underline"
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

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Treatment Records</h1>
        <p className="text-gray-600 mt-1">Comprehensive treatment history and logs</p>
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
                <div className="w-12 h-12 bg-[#FBBF24] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-20 transition-colors">
                  <SchoolIcon className="w-6 h-6 text-[#FBBF24]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{school.shortName}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Treatments</span>
                      <span className="text-2xl font-bold text-[#FBBF24]">{school.totalTreatments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="text-lg font-semibold text-green-600">{school.thisMonth}</span>
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

      {/* LEVEL 4: STUDENT LIST */}
      {currentLevel === 'students' && selectedSchool && selectedGrade && selectedSection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Select Student</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Treatments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Treatment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getStudentsForSection().map((student) => {
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.age} years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.treatmentCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.lastTreatment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openTreatmentLog(student.id)}
                          className="text-[#FBBF24] hover:text-[#D97706] font-medium flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          View Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
