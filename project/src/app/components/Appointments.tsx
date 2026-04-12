import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Check, Users, School as SchoolIcon, Home, ChevronRight as ChevronRightIcon, GraduationCap } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

type NavigationLevel = 'schools' | 'calendar' | 'grades' | 'sections';

export const Appointments = () => {
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('schools');
  const [activeSchool, setActiveSchool] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Create appointment form state
  const [formSchool, setFormSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');

  const schools = [
    'Bagong Tanyag Integrated School',
    'Bagong Tanyag Elementary School Annex A',
    'South Daang Hari Elementary School Main',
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const sections = ['Sampaguita', 'Rosal', 'Gumamela', 'Santan'];

  // Mock students for selected section
  const studentsInSection = selectedSection ? [
    { id: '1', name: 'Juan Dela Cruz', gender: 'Male', age: 10 },
    { id: '2', name: 'Maria Santos', gender: 'Female', age: 9 },
    { id: '3', name: 'Pedro Reyes', gender: 'Male', age: 10 },
    { id: '4', name: 'Ana Garcia', gender: 'Female', age: 9 },
    { id: '5', name: 'Jose Martinez', gender: 'Male', age: 10 },
  ] : [];

  // Mock appointments - School/Grade/Section based
  const appointments = [
    {
      id: '1',
      date: '2026-04-15',
      time: '09:00',
      school: 'Bagong Tanyag Integrated School',
      grade: 'Grade 4',
      section: 'Sampaguita',
      studentCount: 32,
      type: 'Regular Checkup',
      status: 'Scheduled',
      dentist: 'Dr. Maria Santos',
      students: [
        { id: 's1', name: 'Juan Dela Cruz', gender: 'Male', age: 10, riskLevel: 'High' },
        { id: 's2', name: 'Maria Garcia', gender: 'Female', age: 9, riskLevel: 'Low' },
        { id: 's3', name: 'Pedro Reyes', gender: 'Male', age: 10, riskLevel: 'Medium' },
        { id: 's4', name: 'Ana Santos', gender: 'Female', age: 9, riskLevel: 'Low' },
        { id: 's5', name: 'Jose Martinez', gender: 'Male', age: 10, riskLevel: 'High' },
      ],
    },
    {
      id: '2',
      date: '2026-04-15',
      time: '13:00',
      school: 'Bagong Tanyag Elementary School Annex A',
      grade: 'Grade 3',
      section: 'Rosal',
      studentCount: 28,
      type: 'Fluoride Application',
      status: 'In Progress',
      dentist: 'Dr. Carlos Mendoza',
      students: [
        { id: 's6', name: 'Sofia Cruz', gender: 'Female', age: 8, riskLevel: 'Low' },
        { id: 's7', name: 'Miguel Torres', gender: 'Male', age: 9, riskLevel: 'Medium' },
        { id: 's8', name: 'Isabella Lopez', gender: 'Female', age: 8, riskLevel: 'Low' },
      ],
    },
    {
      id: '3',
      date: '2026-04-20',
      time: '08:00',
      school: 'South Daang Hari Elementary School Main',
      grade: 'Grade 5',
      section: 'Gumamela',
      studentCount: 35,
      type: 'Bayanihan Mission',
      status: 'Scheduled',
      dentist: 'Dr. Maria Santos',
      students: [
        { id: 's9', name: 'Rafael Gomez', gender: 'Male', age: 11, riskLevel: 'Medium' },
        { id: 's10', name: 'Lucia Diaz', gender: 'Female', age: 10, riskLevel: 'Low' },
      ],
    },
    {
      id: '4',
      date: '2026-04-15',
      time: '15:00',
      school: 'Bagong Tanyag Integrated School',
      grade: 'Grade 2',
      section: 'Jasmine',
      studentCount: 26,
      type: 'Screening',
      status: 'Scheduled',
      dentist: 'Dr. Maria Santos',
      students: [],
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getAppointmentsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    const schoolFiltered = activeSchool
      ? appointments.filter(apt => apt.school === activeSchool)
      : appointments;
    return schoolFiltered.filter(apt => apt.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  const handleCreateAppointment = () => {
    alert(`Appointment created for ${formSchool} - ${selectedGrade} ${selectedSection} with ${selectedStudents.length} students on ${appointmentDate} at ${appointmentTime}`);
    setShowCreateModal(false);
    // Reset form
    setFormSchool('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedStudents([]);
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentType('');
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(studentsInSection.map(s => s.id));
  };

  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  // Navigation functions
  const navigateToSchool = (schoolName: string) => {
    setActiveSchool(schoolName);
    setCurrentLevel('calendar');
  };

  const navigateToSchools = () => {
    setActiveSchool(null);
    setCurrentLevel('schools');
  };

  // Calculate appointment counts per school
  const getSchoolAppointmentCounts = () => {
    const schoolData = [
      { name: 'Bagong Tanyag Integrated School', shortName: 'Bagong Tanyag Integrated' },
      { name: 'Bagong Tanyag Elementary School Annex A', shortName: 'Bagong Tanyag Annex A' },
      { name: 'South Daang Hari Elementary School Main', shortName: 'South Daang Hari Main' },
    ];

    return schoolData.map(school => {
      const schoolAppointments = appointments.filter(apt => apt.school === school.name);
      const upcomingCount = schoolAppointments.filter(apt => new Date(apt.date) >= new Date()).length;
      const totalStudents = schoolAppointments.reduce((sum, apt) => sum + apt.studentCount, 0);

      return {
        ...school,
        appointmentCount: schoolAppointments.length,
        upcomingCount,
        totalStudents,
      };
    });
  };

  // Filter appointments by active school
  const filteredAppointments = activeSchool
    ? appointments.filter(apt => apt.school === activeSchool)
    : appointments;

  const schoolStats = getSchoolAppointmentCounts();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {currentLevel === 'calendar' && activeSchool && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <button
            onClick={navigateToSchools}
            className="hover:text-[#1E40AF] hover:underline"
          >
            Schools
          </button>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {schoolStats.find(s => s.name === activeSchool)?.shortName || activeSchool}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          {currentLevel === 'schools' && (
            <p className="text-gray-600 mt-1">
              {schoolStats.reduce((sum, s) => sum + s.appointmentCount, 0)} total appointments across 3 schools
            </p>
          )}
          {currentLevel === 'calendar' && activeSchool && (
            <p className="text-gray-600 mt-1">
              {filteredAppointments.length} appointments for this school
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
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
                <div className="w-12 h-12 bg-[#1E40AF] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-20 transition-colors">
                  <SchoolIcon className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{school.shortName}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Appointments</span>
                      <span className="text-2xl font-bold text-[#1E40AF]">{school.appointmentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Upcoming</span>
                      <span className="text-lg font-semibold text-green-600">{school.upcomingCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Students</span>
                      <span className="text-lg font-semibold text-gray-700">{school.totalStudents}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* LEVEL 2: CALENDAR VIEW FOR SELECTED SCHOOL */}
      {currentLevel === 'calendar' && activeSchool && (
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Calendar Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

      {/* Calendar Grid - Fits on screen without scrolling */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full flex flex-col">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {days.map((day, index) => {
              const dayAppointments = day ? getAppointmentsForDay(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg p-2 transition-all overflow-hidden min-h-[100px] ${
                    !day ? 'bg-gray-50' : 'bg-white hover:bg-blue-50'
                  } ${isToday ? 'ring-2 ring-[#1E40AF]' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-[#1E40AF]' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </div>
                      {/* Appointment pills */}
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => {
                          const gradeColor = getGradeColor(apt.grade);
                          return (
                            <button
                              key={apt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(apt);
                                setShowAppointmentModal(true);
                                setAttendanceMap({});
                                setStudentSearchTerm('');
                              }}
                              className="w-full px-2 py-1 rounded text-left truncate transition-all hover:shadow-md"
                              style={{
                                backgroundColor: gradeColor.light,
                                color: gradeColor.solid,
                                minHeight: '22px'
                              }}
                              title={`${apt.section} · ${apt.studentCount} students`}
                            >
                              <span className="text-xs font-bold flex items-center gap-1">
                                <span className="text-base leading-none">●</span>
                                <span>{apt.section} · {apt.studentCount}</span>
                              </span>
                            </button>
                          );
                        })}
                        {dayAppointments.length > 2 && (
                          <div className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded" style={{ minHeight: '22px' }}>
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

        </div>
      )}

      {/* Appointment Detail Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAppointmentModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* TOP SECTION - Appointment Info */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">{selectedAppointment.school}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: getGradeColor(selectedAppointment.grade).light,
                      color: getGradeColor(selectedAppointment.grade).solid
                    }}
                  >
                    {selectedAppointment.grade}
                  </span>
                  <span className="text-gray-700 font-medium">Section {selectedAppointment.section}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAppointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    selectedAppointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date & Time:</span>
                    <div className="font-semibold text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedAppointment.time}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Dentist:</span>
                    <div className="font-semibold text-gray-900">{selectedAppointment.dentist}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Students Scheduled:</span>
                    <div className="font-semibold text-gray-900">{selectedAppointment.studentCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-semibold text-gray-900">{selectedAppointment.type}</div>
                  </div>
                </div>
              </div>

              {/* MIDDLE SECTION - Student Checklist */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Student Attendance</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newMap: Record<string, boolean> = {};
                        selectedAppointment.students.forEach((s: any) => {
                          newMap[s.id] = true;
                        });
                        setAttendanceMap(newMap);
                      }}
                      className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                    >
                      Mark All Present
                    </button>
                  </div>
                </div>

                {/* Search bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search student by name..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Student list */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedAppointment.students
                    .filter((student: any) =>
                      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
                    )
                    .map((student: any) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!!attendanceMap[student.id]}
                        onChange={(e) => {
                          setAttendanceMap(prev => ({
                            ...prev,
                            [student.id]: e.target.checked
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.gender}</div>
                        <div className="text-sm text-gray-600">{student.age} years</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
                          student.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                          student.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {student.riskLevel}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* BOTTOM SECTION - Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedAppointment.status === 'Scheduled' && (
                    <button
                      onClick={() => {
                        setShowAppointmentModal(false);
                        setToastMessage('Session started successfully');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Session
                    </button>
                  )}
                  {selectedAppointment.status === 'In Progress' && (
                    <button
                      onClick={() => {
                        const presentCount = Object.values(attendanceMap).filter(Boolean).length;
                        const totalCount = selectedAppointment.students.length;
                        setShowAppointmentModal(false);
                        setToastMessage(`Session completed — ${presentCount} of ${totalCount} students attended`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 4000);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Complete Session
                    </button>
                  )}
                  <button
                    onClick={() => {
                      alert('Reschedule functionality coming soon');
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this appointment?')) {
                        setShowAppointmentModal(false);
                        setToastMessage('Appointment cancelled');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Appointment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Step 1: Select School */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Select School *
                </label>
                <select
                  value={formSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedGrade('');
                    setSelectedSection('');
                    setSelectedStudents([]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                >
                  <option value="">Choose a school...</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Grade */}
              {formSchool && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Select Grade *
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      setSelectedGrade(e.target.value);
                      setSelectedSection('');
                      setSelectedStudents([]);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  >
                    <option value="">Choose a grade...</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Select Section */}
              {selectedGrade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. Select Section *
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      setSelectedStudents([]);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  >
                    <option value="">Choose a section...</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 4: Select Students */}
              {selectedSection && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      4. Select Students * ({selectedStudents.length} selected)
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllStudents}
                        className="text-xs text-[#1E40AF] hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllStudents}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {studentsInSection.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500">
                            {student.gender} • {student.age} years old
                          </div>
                        </div>
                        {selectedStudents.includes(student.id) && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              {selectedStudents.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option value="">Choose type...</option>
                      <option value="Regular Checkup">Regular Checkup</option>
                      <option value="Fluoride Application">Fluoride Application</option>
                      <option value="Tooth Extraction">Tooth Extraction</option>
                      <option value="Dental Cleaning">Dental Cleaning</option>
                      <option value="Bayanihan Mission">Bayanihan Mission</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleCreateAppointment}
                disabled={!formSchool || !selectedGrade || !selectedSection || selectedStudents.length === 0 || !appointmentDate || !appointmentTime || !appointmentType}
                className="flex-1 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Appointment
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
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
