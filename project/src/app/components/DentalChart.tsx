import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Save, FileDown, Check } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

export const DentalChart = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'conditions' | 'treatments'>('conditions');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [toothConditions, setToothConditions] = useState<Record<number, string>>({
    36: 'D',
    46: 'M',
    11: '√',
    16: 'F',
    26: 'D',
    27: 'D',
  });
  const [toothTreatments, setToothTreatments] = useState<Record<number, string>>({
    36: 'PF',
    11: 'FV',
  });

  const patient = {
    name: 'Juan Dela Cruz',
    grade: 'Grade 4',
    dateOfVisit: '2026-04-12',
    dentist: 'Dr. Maria Santos',
  };

  // DOH IPTR Condition Codes - 8 most common only
  const conditions = [
    { code: '√', label: 'Sound', color: 'bg-white', borderColor: 'border-gray-300' },
    { code: 'D', label: 'Decayed', color: 'bg-red-500', borderColor: 'border-red-500' },
    { code: 'M', label: 'Missing', color: 'bg-gray-600', borderColor: 'border-gray-600' },
    { code: 'F', label: 'Filled', color: 'bg-blue-600', borderColor: 'border-blue-600' },
    { code: 'DX', label: 'For Extraction', color: 'bg-orange-600', borderColor: 'border-orange-600' },
    { code: 'Un', label: 'Unerupted', color: 'bg-purple-600', borderColor: 'border-purple-600' },
    { code: 'JC', label: 'Jacket Crown', color: 'bg-yellow-600', borderColor: 'border-yellow-600' },
    { code: 'SDF', label: 'SDF Applied', color: 'bg-green-600', borderColor: 'border-green-600' },
  ];

  // Treatment Codes
  const treatments = [
    { code: 'FV', label: 'Fluoride Varnish' },
    { code: 'PFS', label: 'Pit & Fissure Sealant' },
    { code: 'PF', label: 'Permanent Filling' },
    { code: 'TF', label: 'Temporary Filling' },
    { code: 'X', label: 'Extraction' },
    { code: 'OHI', label: 'Oral Health Instruction' },
  ];

  // FDI Notation
  const upperPermanent = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerPermanent = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  const upperTemporary = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
  const lowerTemporary = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

  const getToothColor = (toothNumber: number) => {
    const condition = toothConditions[toothNumber];
    if (!condition) return 'bg-white';
    const conditionObj = conditions.find(c => c.code === condition);
    return conditionObj ? conditionObj.color : 'bg-white';
  };

  const getToothBorderColor = (toothNumber: number) => {
    const condition = toothConditions[toothNumber];
    if (!condition) return 'border-gray-400';
    const conditionObj = conditions.find(c => c.code === condition);
    return conditionObj ? conditionObj.borderColor : 'border-gray-400';
  };

  // NEW WORKFLOW: Select code first, then click teeth
  const handleConditionClick = (code: string) => {
    if (selectedCondition === code) {
      setSelectedCondition(null); // Deselect
    } else {
      setSelectedCondition(code);
      setSelectedTreatment(null); // Clear treatment selection
    }
  };

  const handleTreatmentClick = (code: string) => {
    if (selectedTreatment === code) {
      setSelectedTreatment(null); // Deselect
    } else {
      setSelectedTreatment(code);
      setSelectedCondition(null); // Clear condition selection
    }
  };

  const handleToothClick = (toothNumber: number) => {
    if (selectedCondition) {
      // If same condition already applied, remove it (toggle off)
      if (toothConditions[toothNumber] === selectedCondition) {
        setToothConditions(prev => {
          const newConditions = { ...prev };
          delete newConditions[toothNumber];
          return newConditions;
        });
      } else {
        // Otherwise replace with new condition
        setToothConditions(prev => ({
          ...prev,
          [toothNumber]: selectedCondition,
        }));
      }
    } else if (selectedTreatment) {
      // If same treatment already applied, remove it (toggle off)
      if (toothTreatments[toothNumber] === selectedTreatment) {
        setToothTreatments(prev => {
          const newTreatments = { ...prev };
          delete newTreatments[toothNumber];
          return newTreatments;
        });
      } else {
        // Otherwise replace with new treatment
        setToothTreatments(prev => ({
          ...prev,
          [toothNumber]: selectedTreatment,
        }));
      }
    }
  };

  const handleToothRightClick = (e: React.MouseEvent, toothNumber: number) => {
    e.preventDefault();
    // Right-click clears the tooth
    setToothConditions(prev => {
      const newConditions = { ...prev };
      delete newConditions[toothNumber];
      return newConditions;
    });
    setToothTreatments(prev => {
      const newTreatments = { ...prev };
      delete newTreatments[toothNumber];
      return newTreatments;
    });
  };

  // Calculate summary counts
  const getConditionCount = (code: string) => {
    return Object.values(toothConditions).filter(c => c === code).length;
  };

  const getTreatmentCount = (code: string) => {
    return Object.values(toothTreatments).filter(t => t === code).length;
  };

  const dmfIndex = getConditionCount('D') + getConditionCount('M') + getConditionCount('F');

  const Tooth = ({ number }: { number: number }) => {
    const colorClass = getToothColor(number);
    const borderColor = getToothBorderColor(number);
    const hasTreatment = toothTreatments[number];

    return (
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleToothClick(number)}
          onContextMenu={(e) => handleToothRightClick(e, number)}
          className={`relative w-10 h-12 ${colorClass} border-2 ${borderColor} rounded-sm hover:border-[#1E40AF] hover:ring-2 hover:ring-[#1E40AF] transition-all cursor-pointer shadow-sm`}
          title="Left-click to apply selected code • Right-click to clear"
        >
          {hasTreatment && (
            <span
              className="absolute inset-0 flex items-center justify-center font-bold text-white"
              style={{
                fontSize: '13px',
                textShadow: '0 0 3px #000, 0 0 3px #000, 0 0 3px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
              }}
            >
              {hasTreatment}
            </span>
          )}
        </button>
        <span className="text-[13px] font-bold text-gray-700">{number}</span>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dental-charts"
              className="inline-flex items-center gap-2 text-[#1E40AF] hover:text-[#1E3A8A]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="h-5 w-px bg-gray-300" />
            <h1 className="text-lg font-bold text-gray-900">Dental Chart</h1>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FileDown className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN - 60% */}
        <div className="w-[60%] bg-white border-r border-gray-200 p-6 overflow-y-auto">
          {/* Patient Info Header */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Patient:</span>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {patient.name}
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getGradeColor(patient.grade).light,
                      color: getGradeColor(patient.grade).solid
                    }}
                  >
                    {patient.grade}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <div className="font-semibold text-gray-900">{patient.dateOfVisit}</div>
              </div>
              <div>
                <span className="text-gray-600">Dentist:</span>
                <div className="font-semibold text-gray-900">{patient.dentist}</div>
              </div>
            </div>
          </div>

          {/* Full Odontogram */}
          <div className="space-y-6">
            {/* Permanent Dentition */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Permanent Dentition</h3>

              {/* Upper Permanent */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2 text-center">UPPER</div>
                <div className="flex justify-center gap-[4px]">
                  <div className="flex gap-[4px]">
                    {upperPermanent.slice(0, 8).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                  <div className="w-6" />
                  <div className="flex gap-[4px]">
                    {upperPermanent.slice(8).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-300 my-3" />

              {/* Lower Permanent */}
              <div>
                <div className="flex justify-center gap-[4px]">
                  <div className="flex gap-[4px]">
                    {lowerPermanent.slice(0, 8).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                  <div className="w-6" />
                  <div className="flex gap-[4px]">
                    {lowerPermanent.slice(8).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">LOWER</div>
              </div>
            </div>

            {/* Primary Dentition */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Primary Dentition</h3>

              {/* Upper Primary */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2 text-center">UPPER</div>
                <div className="flex justify-center gap-[4px]">
                  <div className="flex gap-[4px]">
                    {upperTemporary.slice(0, 5).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                  <div className="w-6" />
                  <div className="flex gap-[4px]">
                    {upperTemporary.slice(5).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-300 my-3" />

              {/* Lower Primary */}
              <div>
                <div className="flex justify-center gap-[4px]">
                  <div className="flex gap-[4px]">
                    {lowerTemporary.slice(0, 5).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                  <div className="w-6" />
                  <div className="flex gap-[4px]">
                    {lowerTemporary.slice(5).map((tooth) => (
                      <Tooth key={tooth} number={tooth} />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">LOWER</div>
              </div>
            </div>
          </div>

          {/* Summary Panel - Total Teeth Conditions */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Summary - Teeth Conditions</h3>

            {/* DMF Index */}
            <div className="mb-4 p-4 bg-white border-2 border-blue-600 rounded-lg text-center">
              <div className="text-sm text-gray-600 font-medium">DMF Index</div>
              <div className="text-[32px] font-bold text-[#1E40AF] leading-tight my-1">{dmfIndex}</div>
              <div className="text-xs text-gray-500">(D + M + F)</div>
            </div>

            {/* Condition Counts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {conditions.filter(c => getConditionCount(c.code) > 0).map((cond) => (
                <div key={cond.code} className={`px-3 py-2 rounded-full text-[13px] font-medium ${cond.color} ${cond.code === '√' ? 'text-gray-700 border border-gray-300' : 'text-white'}`}>
                  {cond.code} {cond.label}: {getConditionCount(cond.code)}
                </div>
              ))}
            </div>

            {/* Treatment Counts */}
            {Object.keys(toothTreatments).length > 0 && (
              <>
                <div className="text-sm text-gray-600 font-semibold mb-2 mt-3">Treatments Applied:</div>
                <div className="flex flex-wrap gap-2">
                  {treatments.filter(t => getTreatmentCount(t.code) > 0).map((tx) => (
                    <div key={tx.code} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-[13px] font-medium">
                      {tx.code}: {getTreatmentCount(tx.code)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - 40% */}
        <div className="w-[40%] bg-gray-50 p-6 overflow-y-auto">
          {/* Instruction Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-sm text-blue-900 font-medium">
              1. Click a condition or treatment button below to select it
            </div>
            <div className="text-sm text-blue-900 font-medium mt-1">
              2. Then click teeth on the left to apply (bulk marking)
            </div>
          </div>

          {/* Selected Code Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            {selectedCondition || selectedTreatment ? (
              <div>
                <div className="text-sm text-gray-600 font-medium">Active Selection</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-[#1E40AF]">
                      {selectedCondition || selectedTreatment}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCondition && conditions.find(c => c.code === selectedCondition)?.label}
                      {selectedTreatment && treatments.find(t => t.code === selectedTreatment)?.label}
                    </div>
                  </div>
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-3 text-sm">
                No code selected - click a button below
              </div>
            )}
          </div>

          {/* Toggle Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('conditions')}
                className={`py-2 text-sm font-medium transition-colors ${
                  activeTab === 'conditions'
                    ? 'bg-[#1E40AF] text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                CONDITIONS
              </button>
              <button
                onClick={() => setActiveTab('treatments')}
                className={`py-2 text-sm font-medium transition-colors ${
                  activeTab === 'treatments'
                    ? 'bg-[#1E40AF] text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                TREATMENTS
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'conditions' ? (
                <div className="grid grid-cols-4 gap-3">
                  {conditions.map((cond) => (
                    <button
                      key={cond.code}
                      onClick={() => handleConditionClick(cond.code)}
                      className={`relative flex items-center justify-center rounded-lg text-center transition-all w-16 h-16 ${
                        selectedCondition === cond.code
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-[22px] font-bold">
                        {cond.code}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {treatments.map((tx) => (
                    <button
                      key={tx.code}
                      onClick={() => handleTreatmentClick(tx.code)}
                      className={`relative p-2 rounded-lg text-center transition-all h-12 ${
                        selectedTreatment === tx.code
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-[18px] font-bold leading-tight">
                        {tx.code}
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5">
                        {tx.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600">Weight (kg)</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Temp (°C)</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">BP</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded mt-1"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
            <div>
              <label className="text-xs text-gray-600">Chief Complaint</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded mt-1"
                placeholder="Enter chief complaint..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Diagnosis</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded mt-1"
                placeholder="Enter diagnosis..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Treatment Done</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded mt-1"
                placeholder="Enter treatment done..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Remarks</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded mt-1"
                placeholder="Enter remarks..."
              />
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Patient Signed</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Guardian Signed</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button className="px-4 py-2 text-sm bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
