import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, TrendingUp, CheckCircle, Filter, Eye, ThumbsUp, ThumbsDown, Brain, Activity, BarChart3, Info, School as SchoolIcon, List } from 'lucide-react';
import { getSchoolColor, getSchoolShortName } from '../utils/schoolColors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SCHOOLS = [
  'Bagong Tanyag Integrated School',
  'Bagong Tanyag Elementary School Annex A',
  'South Daang Hari Elementary School Main',
];

const ViewToggle = ({ mode, onChange }: { mode: 'school' | 'list'; onChange: (m: 'school' | 'list') => void }) => (
  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
    <button onClick={() => onChange('school')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'school' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
      <SchoolIcon className="w-4 h-4" /> School View
    </button>
    <button onClick={() => onChange('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'list' ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
      <List className="w-4 h-4" /> List View
    </button>
  </div>
);

export const AIAnalytics = () => {
  const { selectedSchool } = useAuth();

  const [schoolFilter, setSchoolFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [validationFilter, setValidationFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

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

  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Juan Dela Cruz',
      birthdate: '2016-03-15',
      gender: 'Male',
      grade: 'Grade 4',
      school: 'Bagong Tanyag Integrated School',
      oralCondition: 'Severe Caries (Tooth #36, #46), Gingivitis (Generalized)',
      aiRecommendation: 'Immediate extraction tooth #36, Fluoride varnish application, Oral hygiene instruction',
      riskLevel: 'High',
      confidenceScore: 94,
      lastVisit: '2026-02-15',
      validated: false,
      validatedBy: null,
      validationDate: null,
      validationStatus: null,
      aiDetectedConditions: ['Severe Caries', 'Gingivitis', 'Poor Oral Hygiene'],
      modelVersion: 'v2.3.1',
    },
    {
      id: '2',
      name: 'Maria Santos',
      birthdate: '2017-07-22',
      gender: 'Female',
      grade: 'Grade 3',
      school: 'Bagong Tanyag Elementary School Annex A',
      oralCondition: 'Deep caries (Tooth #16), Abscess present',
      aiRecommendation: 'Emergency extraction, Antibiotic prescription (Amoxicillin), Pain management',
      riskLevel: 'High',
      confidenceScore: 98,
      lastVisit: '2026-03-01',
      validated: true,
      validatedBy: 'Dr. Maria Santos',
      validationDate: '2026-03-02',
      validationStatus: 'approved',
      aiDetectedConditions: ['Deep Caries', 'Abscess', 'Infection'],
      modelVersion: 'v2.3.1',
    },
    {
      id: '3',
      name: 'Pedro Reyes',
      birthdate: '2014-11-08',
      gender: 'Male',
      grade: 'Grade 5',
      school: 'South Daang Hari Elementary School Main',
      oralCondition: 'Multiple caries (Teeth #14, #24, #36), Calculus build-up',
      aiRecommendation: 'Scaling and prophylaxis, Multiple permanent fillings (GIC), Fluoride treatment',
      riskLevel: 'High',
      confidenceScore: 91,
      lastVisit: '2026-01-20',
      validated: false,
      validatedBy: null,
      validationDate: null,
      validationStatus: null,
      aiDetectedConditions: ['Multiple Caries', 'Calculus', 'Plaque'],
      modelVersion: 'v2.3.1',
    },
    {
      id: '4',
      name: 'Ana Garcia',
      birthdate: '2018-05-12',
      gender: 'Female',
      grade: 'Grade 2',
      school: 'Bagong Tanyag Integrated School',
      oralCondition: 'Moderate gingivitis',
      aiRecommendation: 'Oral prophylaxis, Oral hygiene instruction, Follow-up in 3 months',
      riskLevel: 'Medium',
      confidenceScore: 87,
      lastVisit: '2026-03-10',
      validated: true,
      validatedBy: 'Dr. Maria Santos',
      validationDate: '2026-03-10',
      validationStatus: 'approved',
      aiDetectedConditions: ['Gingivitis'],
      modelVersion: 'v2.3.1',
    },
    {
      id: '5',
      name: 'Jose Martinez',
      birthdate: '2013-09-30',
      gender: 'Male',
      grade: 'Grade 6',
      school: 'Bagong Tanyag Elementary School Annex A',
      oralCondition: 'Mild calculus build-up, Early caries (Tooth #26)',
      aiRecommendation: 'Routine cleaning, Pit and fissure sealant, Fluoride varnish',
      riskLevel: 'Medium',
      confidenceScore: 85,
      lastVisit: '2026-02-28',
      validated: true,
      validatedBy: 'Dr. Elena Reyes',
      validationDate: '2026-03-01',
      validationStatus: 'modified',
      aiDetectedConditions: ['Calculus', 'Early Caries'],
      modelVersion: 'v2.3.1',
    },
    {
      id: '6',
      name: 'Rosa Fernandez',
      birthdate: '2019-01-25',
      gender: 'Female',
      grade: 'Grade 1',
      school: 'Bagong Tanyag Integrated School',
      oralCondition: 'Orally fit - No caries detected',
      aiRecommendation: 'Continue good oral hygiene, Regular 6-month checkup, Fluoride varnish application',
      riskLevel: 'Low',
      confidenceScore: 96,
      lastVisit: '2026-03-05',
      validated: true,
      validatedBy: 'Dr. Maria Santos',
      validationDate: '2026-03-05',
      validationStatus: 'approved',
      aiDetectedConditions: [],
      modelVersion: 'v2.3.1',
    },
  ]);

  const filteredStudents = students
    .filter(student => {
      const age = calculateAge(student.birthdate);
      const ageGroup = getAgeGroup(age);

      const matchesSchool = schoolFilter === 'all' || student.school === schoolFilter;
      const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
      const matchesAgeGroup = ageGroupFilter === 'all' || ageGroup === ageGroupFilter;
      const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
      const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
      const matchesValidation = validationFilter === 'all' ||
        (validationFilter === 'validated' && student.validated) ||
        (validationFilter === 'pending' && !student.validated);

      return matchesSchool && matchesGrade && matchesAgeGroup && matchesGender && matchesRisk && matchesValidation;
    })
    .sort((a, b) => {
      // Sort by risk level: High first, then Medium, then Low
      const riskOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder];
    });

  const highRiskCount = students.filter(s => s.riskLevel === 'High').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'Medium').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'Low').length;
  const pendingValidation = students.filter(s => !s.validated).length;
  const avgConfidence = Math.round(students.reduce((sum, s) => sum + s.confidenceScore, 0) / students.length);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <AlertCircle className="w-4 h-4" />;
      case 'Medium': return <TrendingUp className="w-4 h-4" />;
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleValidation = (studentId: string, status: 'approved' | 'rejected' | 'modified') => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          validated: true,
          validatedBy: 'Dr. Maria Santos',
          validationDate: new Date().toISOString().split('T')[0],
          validationStatus: status,
        };
      }
      return student;
    }));
    setSelectedPatient(null);
    alert(`Validation ${status} for patient successfully!`);
  };

  // Model Performance Data
  const modelPerformanceData = [
    { metric: 'Accuracy', value: 94, id: 'accuracy' },
    { metric: 'Precision', value: 92, id: 'precision' },
    { metric: 'Recall', value: 89, id: 'recall' },
    { metric: 'F1-Score', value: 90, id: 'f1-score' },
  ];

  const validationStatsData = [
    { name: 'Approved', value: students.filter(s => s.validationStatus === 'approved').length, color: '#16A34A', id: 'approved' },
    { name: 'Modified', value: students.filter(s => s.validationStatus === 'modified').length, color: '#FBBF24', id: 'modified' },
    { name: 'Pending', value: students.filter(s => !s.validated).length, color: '#E31E24', id: 'pending' },
  ];

  const contextStudents = selectedSchool
    ? students.filter(s => s.school === selectedSchool)
    : students;

  // School view data
  const schoolRiskSummary = (selectedSchool ? [selectedSchool] : SCHOOLS).map(school => {
    const schoolStudents = contextStudents.filter(s => s.school === school);
    const high = schoolStudents.filter(s => s.riskLevel === 'High').length;
    const medium = schoolStudents.filter(s => s.riskLevel === 'Medium').length;
    const low = schoolStudents.filter(s => s.riskLevel === 'Low').length;
    const pending = schoolStudents.filter(s => !s.validated).length;
    return { name: school, total: schoolStudents.length, high, medium, low, pending };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Risk Analytics</h1>
          <p className="text-gray-600 mt-1">Machine learning-based oral health risk assessment with dentist validation workflow</p>
        </div>
      </div>

      {false && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Select a school to view detailed risk analytics, or switch to List View to see all students.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schoolRiskSummary.map(s => {
              const sc = getSchoolColor(s.name);
              return (
                <div key={s.name} style={{ borderColor: sc.border }} className="bg-white rounded-xl border-2 p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => { setSchoolFilter(s.name); setViewMode('list'); }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ backgroundColor: sc.light }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Brain style={{ color: sc.solid }} className="w-5 h-5" />
                    </div>
                    <div>
                      <div style={{ color: sc.text }} className="font-bold text-sm">{getSchoolShortName(s.name)}</div>
                      <div className="text-xs text-gray-500">{s.total} students assessed</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-red-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-red-600">{s.high}</div>
                      <div className="text-xs text-gray-500">High</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-yellow-600">{s.medium}</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">{s.low}</div>
                      <div className="text-xs text-gray-500">Low</div>
                    </div>
                  </div>
                  {s.pending > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-yellow-700">
                      ⚠ {s.pending} predictions pending validation
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {true && <div className="space-y-6">

      {/* AI Model Info Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-1">AI Model: Floral Oral Health Classifier v2.3.1</h3>
            <p className="text-sm text-purple-800">
              Deep learning model trained on 50,000+ dental images with 94% accuracy. Confidence threshold: 75%. 
              All AI predictions require dentist validation for clinical decision-making.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">High Risk</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{highRiskCount}</p>
          <p className="text-xs text-gray-500 mt-1">Immediate attention needed</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Medium Risk</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{mediumRiskCount}</p>
          <p className="text-xs text-gray-500 mt-1">Requires monitoring</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Low Risk</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{lowRiskCount}</p>
          <p className="text-xs text-gray-500 mt-1">Healthy oral status</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Avg Confidence</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgConfidence}%</p>
          <p className="text-xs text-gray-500 mt-1">Model certainty</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Pending Review</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingValidation}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting validation</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <div key="chart-container-1" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Model Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={250} key="bar-chart-container">
            <BarChart data={modelPerformanceData} id="model-performance-chart">
              <CartesianGrid strokeDasharray="3 3" key="bar-grid" />
              <XAxis dataKey="metric" key="bar-xaxis" />
              <YAxis domain={[0, 100]} key="bar-yaxis" />
              <Tooltip key="bar-tooltip" />
              <Bar dataKey="value" fill="#1E40AF" key="bar-element" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Validation Statistics */}
        <div key="chart-container-2" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Validation Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250} key="pie-chart-container">
            <PieChart id="validation-stats-chart">
              <Pie
                data={validationStatsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label
                key="pie-element"
              >
                {validationStatsData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="pie-tooltip" />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {validationStatsData.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Filter AI Predictions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">School</label>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
            >
              <option value="all">All Schools</option>
              <option value="Bagong Tanyag Integrated School">Bagong Tanyag Integrated</option>
              <option value="Bagong Tanyag Elementary School Annex A">Bagong Tanyag Annex A</option>
              <option value="South Daang Hari Elementary School Main">South Daang Hari Main</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Grade Level</label>
            <select
              value={gradeFilter}
              onChange={(e) => { setGradeFilter(e.target.value); setSectionFilter('all'); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
            >
              <option value="all">All Grades</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
            >
              <option value="all">All Sections</option>
              {[...new Set((gradeFilter !== 'all' ? contextStudents.filter(s => s.grade === gradeFilter) : contextStudents).map(s => s.section))].sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

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
            <label className="block text-xs text-gray-600 mb-1">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Validation</label>
            <select
              value={validationFilter}
              onChange={(e) => setValidationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] appearance-none bg-white text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Validation</option>
              <option value="validated">Validated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List with AI Predictions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">AI Risk Predictions ({filteredStudents.length} students)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Conditions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.grade} • {student.school}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(student.riskLevel)}`}>
                      {getRiskIcon(student.riskLevel)}
                      {student.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.confidenceScore >= 90 ? 'bg-green-600' :
                            student.confidenceScore >= 75 ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${student.confidenceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {student.aiDetectedConditions.length > 0 ? student.aiDetectedConditions.join(', ') : 'No conditions'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.validated ? (
                      <div className="flex items-center gap-2">
                        {student.validationStatus === 'approved' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✓ Approved
                          </span>
                        )}
                        {student.validationStatus === 'modified' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            ✎ Modified
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedPatient(student)}
                      className="text-[#1E40AF] hover:text-[#1E3A8A] font-medium text-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {student.validated ? 'View' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">AI Prediction Review</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedPatient.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedPatient.grade}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">School:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedPatient.school}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedPatient.lastVisit}</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Analysis Results</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-purple-900">Risk Classification:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(selectedPatient.riskLevel)}`}>
                      {selectedPatient.riskLevel} Risk
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-900">Confidence Score:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedPatient.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-900">Model Version:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedPatient.modelVersion}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-900">Detected Conditions:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedPatient.aiDetectedConditions.map((cond: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Findings */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Oral Condition (AI Assessment)</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedPatient.oralCondition}</p>
              </div>

              {/* AI Recommendations */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Treatment Recommendations</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedPatient.aiRecommendation}</p>
              </div>

              {/* Validation Status */}
              {selectedPatient.validated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Validation Record</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-green-800">Validated By:</span>
                      <span className="ml-2 font-medium">{selectedPatient.validatedBy}</span>
                    </div>
                    <div>
                      <span className="text-green-800">Date:</span>
                      <span className="ml-2 font-medium">{selectedPatient.validationDate}</span>
                    </div>
                    <div>
                      <span className="text-green-800">Status:</span>
                      <span className="ml-2 font-medium capitalize">{selectedPatient.validationStatus}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Actions */}
              {!selectedPatient.validated && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Dentist Validation</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleValidation(selectedPatient.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Approve AI Prediction
                    </button>
                    <button
                      onClick={() => handleValidation(selectedPatient.id, 'modified')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      Approve with Modifications
                    </button>
                    <button
                      onClick={() => handleValidation(selectedPatient.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Reject Prediction
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Note: Validation decisions help improve the AI model accuracy over time.
                  </p>
                </div>
              )}

              {selectedPatient.validated && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>}
    </div>
  );
};