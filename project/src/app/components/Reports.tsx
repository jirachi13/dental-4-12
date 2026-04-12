import { useState } from 'react';
import { FileText, Download, Eye, Calendar, BarChart3, PieChart, TrendingUp, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell } from 'recharts';

export const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-04-10');
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    { value: 'monthly', label: 'Monthly Oral Health Report (DOH IPTR Format)' },
    { value: 'appointment', label: 'Appointment Summary Report' },
    { value: 'fluoride', label: 'Fluoride Coverage Report' },
    { value: 'procedure', label: 'Procedure Volume Report' },
    { value: 'risk', label: 'Risk Stratification Report' },
    { value: 'doh-compliance', label: 'DOH Compliance Report' },
    { value: 'bayanihan', label: 'Bayanihan Event Summary' },
  ];

  const schools = [
    { value: 'all', label: 'All Schools' },
    { value: 'bagong-tanyag', label: 'Bagong Tanyag Integrated School' },
    { value: 'bagong-annex', label: 'Bagong Tanyag Elementary School Annex A' },
    { value: 'south-daang', label: 'South Daang Hari Elementary School Main' },
  ];

  // Sample Data for Previews
  const procedureData = [
    { month: 'Jan', extractions: 12, fillings: 25, fluoride: 85, cleaning: 42 },
    { month: 'Feb', extractions: 15, fillings: 30, fluoride: 92, cleaning: 38 },
    { month: 'Mar', extractions: 18, fillings: 28, fluoride: 88, cleaning: 45 },
    { month: 'Apr', extractions: 10, fillings: 22, fluoride: 95, cleaning: 40 },
  ];

  const riskData = [
    { name: 'High Risk', value: 35, color: '#E31E24' },
    { name: 'Medium Risk', value: 48, color: '#FBBF24' },
    { name: 'Low Risk', value: 67, color: '#16A34A' },
  ];

  const fluorideCoverage = [
    { grade: 'Grade 1', target: 120, completed: 115, percentage: 96 },
    { grade: 'Grade 2', target: 110, completed: 105, percentage: 95 },
    { grade: 'Grade 3', target: 125, completed: 108, percentage: 86 },
    { grade: 'Grade 4', target: 118, completed: 112, percentage: 95 },
    { grade: 'Grade 5', target: 115, completed: 98, percentage: 85 },
    { grade: 'Grade 6', target: 108, completed: 102, percentage: 94 },
  ];

  const generateReport = (format: 'pdf' | 'excel') => {
    const reportName = reportTypes.find(r => r.value === reportType)?.label || 'Report';
    alert(`✓ Generating ${reportName}\nFormat: ${format.toUpperCase()}\nPeriod: ${startDate} to ${endDate}\nSchool: ${selectedSchool}\n\nReport will be downloaded shortly...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Generation</h1>
        <p className="text-gray-600 mt-1">Generate and export DOH-compliant dental health reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Reports Generated</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">127</p>
          <p className="text-xs text-gray-500 mt-1">This quarter</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Treatment Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">89%</p>
          <p className="text-xs text-gray-500 mt-1">Completion rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Total Procedures</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,248</p>
          <p className="text-xs text-gray-500 mt-1">Year to date</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <PieChart className="w-5 h-5" />
            <span className="text-sm font-medium">Fluoride Coverage</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">92%</p>
          <p className="text-xs text-gray-500 mt-1">Target: 90%</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              {schools.map(school => (
                <option key={school.value} value={school.value}>{school.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period *</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
              <option>Q1 2026 (Jan - Mar)</option>
              <option>Q2 2026 (Apr - Jun)</option>
              <option>Q3 2026 (Jul - Sep)</option>
              <option>Q4 2026 (Oct - Dec)</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview Report'}
          </button>
          <button
            onClick={() => generateReport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#C41E3A] transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => generateReport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891B2] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Email Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report Preview</h2>
          
          {/* Report Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {reportTypes.find(r => r.value === reportType)?.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Floral Dental Clinic Management System - Barangay Tanyag, Taguig City
                </p>
                <p className="text-sm text-gray-600">
                  Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">DOH IPTR Compliant</p>
              </div>
            </div>
          </div>

          {/* Report Content Based on Type */}
          {reportType === 'procedure' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Procedure Volume Trends</h4>
                <ResponsiveContainer width="100%" height={300} key="procedure-chart-container">
                  <BarChart data={procedureData} id="procedure-volume-chart">
                    <CartesianGrid strokeDasharray="3 3" key="procedure-grid" />
                    <XAxis dataKey="month" key="procedure-xaxis" />
                    <YAxis key="procedure-yaxis" />
                    <Tooltip key="procedure-tooltip" />
                    <Legend key="procedure-legend" />
                    <Bar dataKey="extractions" fill="#E31E24" name="Extractions" key="procedure-bar-extractions" />
                    <Bar dataKey="fillings" fill="#1E40AF" name="Fillings" key="procedure-bar-fillings" />
                    <Bar dataKey="fluoride" fill="#06B6D4" name="Fluoride" key="procedure-bar-fluoride" />
                    <Bar dataKey="cleaning" fill="#16A34A" name="Cleaning" key="procedure-bar-cleaning" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Total Extractions</div>
                  <div className="text-2xl font-bold text-red-900 mt-1">55</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Fillings</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">105</div>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="text-sm text-cyan-600 font-medium">Fluoride Applications</div>
                  <div className="text-2xl font-bold text-cyan-900 mt-1">360</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Cleanings</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">165</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'risk' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Risk Stratification Distribution</h4>
                <ResponsiveContainer width="100%" height={300} key="risk-chart-container">
                  <RPieChart id="risk-distribution-chart">
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      dataKey="value"
                      key="risk-pie"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`risk-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip key="risk-tooltip" />
                  </RPieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {riskData.map((item) => (
                  <div key={item.name} className="p-4 rounded-lg border-2" style={{ borderColor: item.color }}>
                    <div className="text-sm font-medium" style={{ color: item.color }}>{item.name}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {Math.round((item.value / riskData.reduce((sum, r) => sum + r.value, 0)) * 100)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'fluoride' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Fluoride Coverage by Grade Level</h4>
                <ResponsiveContainer width="100%" height={300} key="fluoride-chart-container">
                  <BarChart data={fluorideCoverage} id="fluoride-coverage-chart">
                    <CartesianGrid strokeDasharray="3 3" key="fluoride-grid" />
                    <XAxis dataKey="grade" key="fluoride-xaxis" />
                    <YAxis key="fluoride-yaxis" />
                    <Tooltip key="fluoride-tooltip" />
                    <Legend key="fluoride-legend" />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" key="fluoride-bar-target" />
                    <Bar dataKey="completed" fill="#06B6D4" name="Completed" key="fluoride-bar-completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coverage %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fluorideCoverage.map((item) => (
                      <tr key={item.grade} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.grade}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.target}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.completed}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.target - item.completed}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.percentage >= 90 ? 'bg-green-600' : item.percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(reportType === 'monthly' || reportType === 'doh-compliance') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Students</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">696</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Screened</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">652</div>
                  <div className="text-xs text-green-700 mt-1">94% coverage</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Needs Treatment</div>
                  <div className="text-2xl font-bold text-orange-900 mt-1">187</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Treatment Complete</div>
                  <div className="text-2xl font-bold text-purple-900 mt-1">142</div>
                  <div className="text-xs text-purple-700 mt-1">76% completion</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">DOH IPTR Compliance Checklist</h4>
                <div className="space-y-2">
                  {[
                    { item: 'Patient medical history forms completed', status: true },
                    { item: 'FDI notation system implemented', status: true },
                    { item: 'DOH treatment codes applied', status: true },
                    { item: 'Fluoride application records maintained', status: true },
                    { item: 'Risk stratification documented', status: true },
                    { item: 'Follow-up schedules tracked', status: true },
                  ].map((check, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded ${check.status ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                        {check.status && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm text-gray-700">{check.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-generated Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recently Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { name: 'Monthly Oral Health Report - March 2026', date: '2026-04-01', type: 'monthly', size: '2.4 MB' },
            { name: 'Fluoride Coverage Report - Q1 2026', date: '2026-04-01', type: 'fluoride', size: '1.8 MB' },
            { name: 'DOH Compliance Report - March 2026', date: '2026-03-31', type: 'doh-compliance', size: '3.2 MB' },
            { name: 'Procedure Volume Report - February 2026', date: '2026-03-01', type: 'procedure', size: '1.5 MB' },
          ].map((report, idx) => (
            <div key={idx} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">
                    Generated: {new Date(report.date).toLocaleDateString()} • {report.size}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};