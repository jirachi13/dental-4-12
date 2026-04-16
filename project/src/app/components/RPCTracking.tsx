import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, X, CheckCircle, AlertCircle, Clock, Shield, School as SchoolIcon, List, ChevronRight, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getGradeColor } from '../utils/gradeColors';
import { getSchoolColor, getSchoolShortName } from '../utils/schoolColors';

const SCHOOLS = [
  'Bagong Tanyag Integrated School',
  'Bagong Tanyag Elementary School Annex A',
  'South Daang Hari Elementary School Main',
];
const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];

const rpcRecords = [
  { id:'1', studentName:'Juan Morales', birthdate:'2016-03-15', gender:'Male', school:'Bagong Tanyag Integrated School', grade:'Grade 4', section:'Sampaguita', visit1Date:'2026-01-15', visit1Status:'Completed', visit2Date:'2026-03-20', visit2Status:'Completed', daysUntilDue:0, status:'complete' },
  { id:'2', studentName:'Maria Santos', birthdate:'2017-07-22', gender:'Female', school:'Bagong Tanyag Integrated School', grade:'Grade 3', section:'Jasmine', visit1Date:'2026-02-10', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:45, status:'pending' },
  { id:'3', studentName:'Pedro Reyes', birthdate:'2014-11-08', gender:'Male', school:'South Daang Hari Elementary School Main', grade:'Grade 5', section:'Yakal', visit1Date:'2025-08-15', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:-30, status:'overdue' },
  { id:'4', studentName:'Ana Garcia', birthdate:'2018-05-12', gender:'Female', school:'Bagong Tanyag Integrated School', grade:'Grade 2', section:'Rose', visit1Date:null, visit1Status:'Pending', visit2Date:null, visit2Status:'Pending', daysUntilDue:0, status:'not-started' },
  { id:'5', studentName:'Carlos Mendoza', birthdate:'2013-09-30', gender:'Male', school:'Bagong Tanyag Elementary School Annex A', grade:'Grade 6', section:'Coral', visit1Date:'2026-03-01', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:90, status:'pending' },
  { id:'6', studentName:'Sofia Reyes', birthdate:'2015-11-08', gender:'Female', school:'Bagong Tanyag Integrated School', grade:'Grade 5', section:'Sunflower', visit1Date:'2026-01-20', visit1Status:'Completed', visit2Date:'2026-03-25', visit2Status:'Completed', daysUntilDue:0, status:'complete' },
  { id:'7', studentName:'Diego Lopez', birthdate:'2019-03-15', gender:'Male', school:'Bagong Tanyag Integrated School', grade:'Grade 1', section:'Sampaguita', visit1Date:null, visit1Status:'Pending', visit2Date:null, visit2Status:'Pending', daysUntilDue:0, status:'not-started' },
  { id:'8', studentName:'Isabella Gomez', birthdate:'2017-04-18', gender:'Female', school:'Bagong Tanyag Elementary School Annex A', grade:'Grade 3', section:'Topaz', visit1Date:'2025-09-10', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:-15, status:'overdue' },
  { id:'9', studentName:'Miguel Torres', birthdate:'2016-12-05', gender:'Male', school:'Bagong Tanyag Elementary School Annex A', grade:'Grade 4', section:'Opal', visit1Date:'2026-02-28', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:60, status:'pending' },
  { id:'10', studentName:'Carmen Flores', birthdate:'2018-08-22', gender:'Female', school:'South Daang Hari Elementary School Main', grade:'Grade 2', section:'Acacia', visit1Date:'2026-01-10', visit1Status:'Completed', visit2Date:'2026-03-15', visit2Status:'Completed', daysUntilDue:0, status:'complete' },
  { id:'11', studentName:'Lucia Diaz', birthdate:'2015-06-14', gender:'Female', school:'South Daang Hari Elementary School Main', grade:'Grade 5', section:'Lauan', visit1Date:null, visit1Status:'Pending', visit2Date:null, visit2Status:'Pending', daysUntilDue:0, status:'not-started' },
  { id:'12', studentName:'Rafael Santos', birthdate:'2016-09-03', gender:'Male', school:'South Daang Hari Elementary School Main', grade:'Grade 4', section:'Kamagong', visit1Date:'2025-10-05', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:-45, status:'overdue' },
  { id:'13', studentName:'Valentina Cruz', birthdate:'2017-02-28', gender:'Female', school:'South Daang Hari Elementary School Main', grade:'Grade 3', section:'Bamboo', visit1Date:'2026-03-05', visit1Status:'Completed', visit2Date:null, visit2Status:'Pending', daysUntilDue:120, status:'pending' },
  { id:'14', studentName:'Jose Martinez', birthdate:'2013-09-30', gender:'Male', school:'Bagong Tanyag Elementary School Annex A', grade:'Grade 6', section:'Onyx', visit1Date:'2026-02-15', visit1Status:'Completed', visit2Date:'2026-04-10', visit2Status:'Completed', daysUntilDue:0, status:'complete' },
  { id:'15', studentName:'Bea Aquino', birthdate:'2018-01-15', gender:'Female', school:'Bagong Tanyag Integrated School', grade:'Grade 2', section:'Dahlia', visit1Date:null, visit1Status:'Pending', visit2Date:null, visit2Status:'Pending', daysUntilDue:0, status:'not-started' },
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

export const RPCTracking = () => {
  const { selectedSchool } = useAuth();

  const [drillSchool, setDrillSchool] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [visitNumber, setVisitNumber] = useState<1|2>(1);

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getAgeGroup = (age: number) => {
    if (age <= 5) return 'Under 5';
    if (age <= 10) return '6-10';
    if (age <= 14) return '10-14';
    return '15-19';
  };

  const schoolRecords = selectedSchool
    ? rpcRecords.filter(r => r.school === selectedSchool)
    : rpcRecords;

  const filtered = useMemo(() => schoolRecords.filter(r => {
    const age = calculateAge(r.birthdate);
    if (schoolFilter !== 'all' && r.school !== schoolFilter) return false;
    if (gradeFilter !== 'all' && r.grade !== gradeFilter) return false;
    if (sectionFilter !== 'all' && r.section !== sectionFilter) return false;
    if (genderFilter !== 'all' && r.gender !== genderFilter) return false;
    if (ageGroupFilter !== 'all' && getAgeGroup(age) !== ageGroupFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm && !r.studentName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }), [schoolFilter, gradeFilter, genderFilter, ageGroupFilter, statusFilter, searchTerm]);

  const hasActiveFilters = [schoolFilter, gradeFilter, genderFilter, ageGroupFilter, statusFilter].some(f => f !== 'all') || searchTerm !== '';
  const clearFilters = () => { setSchoolFilter('all'); setGradeFilter('all'); setGenderFilter('all'); setAgeGroupFilter('all'); setStatusFilter('all'); setSearchTerm(''); };

  const visit1Completed = schoolRecords.filter(r => r.visit1Status === 'Completed').length;
  const visit2Completed = schoolRecords.filter(r => r.visit2Status === 'Completed').length;
  const overdue = schoolRecords.filter(r => r.status === 'overdue').length;

  const chartData = SCHOOLS.map(s => {
    const recs = rpcRecords.filter(r => r.school === s);
    const name = s.includes('Integrated') ? 'Integrated' : s.includes('Annex') ? 'Annex A' : 'S. Daang Hari';
    return { name, complete: recs.filter(r=>r.status==='complete').length, pending: recs.filter(r=>r.status==='pending').length, overdue: recs.filter(r=>r.status==='overdue').length, notStarted: recs.filter(r=>r.status==='not-started').length };
  });

  const statusConfig: Record<string,{label:string;color:string;bg:string}> = {
    complete:     { label:'Complete',     color:'text-green-700', bg:'bg-green-100' },
    pending:      { label:'Visit 1 Only', color:'text-blue-700',  bg:'bg-blue-100'  },
    overdue:      { label:'Overdue',      color:'text-red-700',   bg:'bg-red-100'   },
    'not-started':{ label:'Not Started',  color:'text-gray-600',  bg:'bg-gray-100'  },
  };

  const FS = ({ value, onChange, opts, label }: any) => (
    <select value={value} onChange={e=>onChange(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="all">{label}</option>
      {opts.map((o:any) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  // School view computed data
  const schoolSummary = (selectedSchool ? [selectedSchool] : SCHOOLS).map(school => {
    const records = schoolRecords.filter(r => r.school === school);
    const complete = records.filter(r => r.status === 'complete').length;
    const overdueCount = records.filter(r => r.status === 'overdue').length;
    return { name: school, total: records.length, complete, overdue: overdueCount };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RPC Records</h1>
          <p className="text-sm text-gray-500">Routine Preventive Care — Fluoride application tracking (4–6 month interval)</p>
        </div>
      </div>

      {false && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schoolSummary.map(s => {
            const sc = getSchoolColor(s.name);
            return (
            <div key={s.name} style={{ borderColor: sc.border }} className="bg-white rounded-xl border-2 p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => (() => {})()}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ backgroundColor: sc.light }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <SchoolIcon style={{ color: sc.solid }} className="w-5 h-5" />
                </div>
                <div style={{ color: sc.text }} className="font-bold text-sm leading-tight">{getSchoolShortName(s.name)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-gray-900">{s.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">{s.complete}</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-red-600">{s.overdue}</div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
              </div>
            </div>
          );})}
        </div>
      )}

      {true && <div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Enrolled',         value: schoolRecords.length,    color:'text-blue-600',  bg:'bg-blue-50',  border:'border-blue-200'  },
          { label:'Visit 1 Completed',      value: `${visit1Completed} (${Math.round(visit1Completed/rpcRecords.length*100)}%)`, color:'text-cyan-600', bg:'bg-cyan-50', border:'border-cyan-200' },
          { label:'Both Visits Complete',   value: `${visit2Completed} (${Math.round(visit2Completed/rpcRecords.length*100)}%)`, color:'text-green-600', bg:'bg-green-50', border:'border-green-200' },
          { label:'Overdue',                value: overdue,               color:'text-red-600',   bg:'bg-red-50',   border:'border-red-200'   },
        ].map((c,i) => (
          <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color} mt-1`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">RPC Completion by School</h2>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={chartData} margin={{top:0,right:10,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} />
            <Tooltip />
            <Legend wrapperStyle={{fontSize:11}} />
            <Bar dataKey="complete"   name="Complete"     fill="#16A34A" stackId="a" />
            <Bar dataKey="pending"    name="Visit 1 Only" fill="#2563EB" stackId="a" />
            <Bar dataKey="overdue"    name="Overdue"      fill="#E31E24" stackId="a" />
            <Bar dataKey="notStarted" name="Not Started"  fill="#9CA3AF" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search student..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <FS value={schoolFilter} onChange={setSchoolFilter} label="All Schools" opts={SCHOOLS.map(s=>({v:s,l:s.replace(' Elementary School','').replace(' Integrated School',' Integrated').replace(' Main','')}))} />
          <FS value={gradeFilter} onChange={g => { setGradeFilter(g); setSectionFilter('all'); }} label="All Grades" opts={GRADES.map(g=>({v:g,l:g}))} />
          <FS value={sectionFilter} onChange={setSectionFilter} label="All Sections" opts={[...new Set((gradeFilter !== 'all' ? schoolRecords.filter(r => r.grade === gradeFilter) : schoolRecords).map(r => r.section))].sort().map(s => ({v:s,l:s}))} />
          <FS value={genderFilter} onChange={setGenderFilter} label="All Genders" opts={[{v:'Male',l:'Male'},{v:'Female',l:'Female'}]} />
          <FS value={ageGroupFilter} onChange={setAgeGroupFilter} label="All Age Groups" opts={[{v:'Under 5',l:'Under 5'},{v:'6-10',l:'6–10'},{v:'10-14',l:'10–14'},{v:'15-19',l:'15–19'}]} />
          <FS value={statusFilter} onChange={setStatusFilter} label="All Statuses" opts={[{v:'complete',l:'Both Complete'},{v:'pending',l:'Visit 1 Only'},{v:'overdue',l:'Overdue'},{v:'not-started',l:'Not Started'}]} />
          {hasActiveFilters && <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"><X className="w-3 h-3"/>Clear All</button>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Student','School','Grade / Section','Visit 1','Visit 2','Status','Days Until Due','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No records match the selected filters.</td></tr>
              ) : filtered.map(r => {
                const sc = statusConfig[r.status] || statusConfig['not-started'];
                const gc = getGradeColor(r.grade);
                return (
                  <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${r.status==='overdue'?'bg-red-50':''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{r.studentName.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                        <span className="font-medium text-gray-900">{r.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[130px] truncate">{r.school}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold" style={{backgroundColor:gc.light,color:gc.solid}}>{r.grade}</span>
                      <span className="text-gray-500 text-xs ml-1">{r.section}</span>
                    </td>
                    <td className="px-4 py-3">{r.visit1Date ? <span className="text-green-700 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/>{r.visit1Date}</span> : <span className="text-gray-400 text-xs">Not done</span>}</td>
                    <td className="px-4 py-3">{r.visit2Date ? <span className="text-green-700 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/>{r.visit2Date}</span> : <span className="text-gray-400 text-xs">Not done</span>}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                    <td className="px-4 py-3 text-sm">{r.status==='overdue'?<span className="text-red-600 font-semibold">{Math.abs(r.daysUntilDue)}d overdue</span>:r.daysUntilDue>0?<span className="text-blue-600">{r.daysUntilDue}d</span>:<span className="text-gray-400">—</span>}</td>
                    <td className="px-4 py-3"><button onClick={()=>{setSelectedStudent(r);setVisitNumber(r.visit1Status==='Completed'?2:1);setShowRecordModal(true);}} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Record Visit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {rpcRecords.length} records</div>
      </div>

      {showRecordModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">Record RPC Visit</h2>
              <button onClick={()=>setShowRecordModal(false)}><X className="w-5 h-5 text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-900">{selectedStudent.studentName}</p>
                <p className="text-sm text-blue-700">{selectedStudent.grade} — {selectedStudent.section}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visit Number</label>
                <div className="flex gap-3">
                  {([1,2] as (1|2)[]).map(n => (
                    <button key={n} onClick={()=>setVisitNumber(n)}
                      disabled={n===2 && selectedStudent.visit1Status!=='Completed'}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium ${visitNumber===n?'bg-blue-600 text-white border-blue-600':n===2&&selectedStudent.visit1Status!=='Completed'?'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200':'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      Visit {n}
                    </button>
                  ))}
                </div>
                {visitNumber===2 && <p className="text-xs text-gray-500 mt-1">Must be 4–6 months after Visit 1</p>}
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label><input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Fluoride Varnish Application</option><option>Oral Prophylaxis</option><option>Oral Health Instructions</option><option>Oral Screening</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={()=>setShowRecordModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={()=>{alert(`Visit ${visitNumber} recorded for ${selectedStudent.studentName}`);setShowRecordModal(false);}} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Visit</button>
            </div>
          </div>
        </div>
      )}
    </div>}
    </div>
  );
};
