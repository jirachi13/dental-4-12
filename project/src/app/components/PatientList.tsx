import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Eye, FileText, X } from 'lucide-react';
import { getGradeColor } from '../utils/gradeColors';

const SCHOOLS = [
  'Bagong Tanyag Integrated School',
  'Bagong Tanyag Elementary School Annex A',
  'South Daang Hari Elementary School Main',
];

const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];

export const PatientList = () => {
  const navigate = useNavigate();

  // Flat filters — no drill-down
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '', lastName: '', middleName: '',
    birthdate: '', gender: '', grade: '', section: '',
    school: '', guardianName: '', guardianContact: '', address: '',
  });

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
    if (age <= 19) return '15-19';
    return 'Other';
  };


  const allStudents = [
    { id: '1', name: 'Juan Morales', birthdate: '2020-07-23', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-24', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '2', name: 'Isabella Villanueva', birthdate: '2020-08-07', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-25', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '3', name: 'Aldrin Villanueva', birthdate: '2020-11-22', gender: 'Male', grade: 'Grade 1', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-17', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '4', name: 'Elena Morales', birthdate: '2020-10-10', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-07', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '5', name: 'Trisha Santos', birthdate: '2020-01-27', gender: 'Female', grade: 'Grade 1', section: 'Sampaguita', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-25', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '6', name: 'Katrina Lopez', birthdate: '2020-12-23', gender: 'Female', grade: 'Grade 1', section: 'Rosal', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-04', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '7', name: 'Ana Morales', birthdate: '2020-11-11', gender: 'Female', grade: 'Grade 1', section: 'Rosal', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-21', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '8', name: 'Patricia Garcia', birthdate: '2020-01-03', gender: 'Female', grade: 'Grade 1', section: 'Rosal', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-11', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '9', name: 'Trisha Lopez', birthdate: '2020-02-13', gender: 'Female', grade: 'Grade 1', section: 'Rosal', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-01', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '10', name: 'Nico Castillo', birthdate: '2020-02-17', gender: 'Male', grade: 'Grade 1', section: 'Rosal', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-22', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '11', name: 'Marco Navarro', birthdate: '2019-07-07', gender: 'Male', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-03', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '12', name: 'Ivan Villanueva', birthdate: '2019-06-24', gender: 'Male', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-28', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '13', name: 'Jomar Diaz', birthdate: '2019-08-24', gender: 'Male', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-18', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '14', name: 'Patricia Castillo', birthdate: '2019-12-25', gender: 'Female', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-17', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '15', name: 'Patricia Magno', birthdate: '2019-07-26', gender: 'Female', grade: 'Grade 2', section: 'Rose', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-11', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '16', name: 'Bea Castillo', birthdate: '2019-01-25', gender: 'Female', grade: 'Grade 2', section: 'Dahlia', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-08', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '17', name: 'Alyssa Martinez', birthdate: '2019-02-07', gender: 'Female', grade: 'Grade 2', section: 'Dahlia', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-27', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '18', name: 'Angel Bautista', birthdate: '2019-04-24', gender: 'Female', grade: 'Grade 2', section: 'Dahlia', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-10', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '19', name: 'Celine Morales', birthdate: '2019-08-12', gender: 'Female', grade: 'Grade 2', section: 'Dahlia', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-06', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '20', name: 'Ivan Bautista', birthdate: '2019-01-08', gender: 'Male', grade: 'Grade 2', section: 'Dahlia', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-16', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '21', name: 'Rosa Reyes', birthdate: '2018-09-27', gender: 'Female', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-19', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '22', name: 'Ivan Dela Cruz', birthdate: '2018-01-11', gender: 'Male', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-28', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '23', name: 'Arnel Torres', birthdate: '2018-03-13', gender: 'Male', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-15', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '24', name: 'Renz Magno', birthdate: '2018-07-12', gender: 'Male', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-16', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '25', name: 'Danica Martinez', birthdate: '2018-04-10', gender: 'Female', grade: 'Grade 3', section: 'Jasmine', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-18', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '26', name: 'Jose Diaz', birthdate: '2018-04-12', gender: 'Male', grade: 'Grade 3', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-28', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '27', name: 'Ronnie Gomez', birthdate: '2018-12-14', gender: 'Male', grade: 'Grade 3', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-08', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '28', name: 'Danica Flores', birthdate: '2018-10-06', gender: 'Female', grade: 'Grade 3', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-13', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '29', name: 'Sofia Bautista', birthdate: '2018-02-17', gender: 'Female', grade: 'Grade 3', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-16', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '30', name: 'Trisha Flores', birthdate: '2018-09-25', gender: 'Female', grade: 'Grade 3', section: 'Orchid', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-11', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '31', name: 'Trisha Mendoza', birthdate: '2017-12-04', gender: 'Female', grade: 'Grade 4', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-05', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '32', name: 'Pedro Bautista', birthdate: '2017-01-13', gender: 'Male', grade: 'Grade 4', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-22', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '33', name: 'Danica Magno', birthdate: '2017-09-11', gender: 'Female', grade: 'Grade 4', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-07', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '34', name: 'Patricia Santos', birthdate: '2017-11-08', gender: 'Female', grade: 'Grade 4', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-25', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '35', name: 'Marco Magno', birthdate: '2017-05-07', gender: 'Male', grade: 'Grade 4', section: 'Tulip', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-23', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '36', name: 'Alyssa Flores', birthdate: '2017-10-20', gender: 'Female', grade: 'Grade 4', section: 'Lily', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-23', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '37', name: 'Roberto Navarro', birthdate: '2017-12-25', gender: 'Male', grade: 'Grade 4', section: 'Lily', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-24', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '38', name: 'Nico Castillo', birthdate: '2017-02-10', gender: 'Male', grade: 'Grade 4', section: 'Lily', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-27', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '39', name: 'Isabella Santos', birthdate: '2017-12-24', gender: 'Female', grade: 'Grade 4', section: 'Lily', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-26', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '40', name: 'Juan Martinez', birthdate: '2017-02-07', gender: 'Male', grade: 'Grade 4', section: 'Lily', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-04', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '41', name: 'Jose Cruz', birthdate: '2016-06-02', gender: 'Male', grade: 'Grade 5', section: 'Sunflower', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-09', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '42', name: 'Arnel Reyes', birthdate: '2016-09-15', gender: 'Male', grade: 'Grade 5', section: 'Sunflower', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-07', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '43', name: 'Nico Dela Cruz', birthdate: '2016-10-15', gender: 'Male', grade: 'Grade 5', section: 'Sunflower', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-09', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '44', name: 'Jasmine Lopez', birthdate: '2016-08-05', gender: 'Female', grade: 'Grade 5', section: 'Sunflower', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-01', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '45', name: 'Katrina Navarro', birthdate: '2016-06-16', gender: 'Female', grade: 'Grade 5', section: 'Sunflower', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-21', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '46', name: 'Aldrin Morales', birthdate: '2016-02-07', gender: 'Male', grade: 'Grade 5', section: 'Daisy', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-05', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '47', name: 'Celine Flores', birthdate: '2016-02-26', gender: 'Female', grade: 'Grade 5', section: 'Daisy', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-07', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '48', name: 'Mia Aquino', birthdate: '2016-05-15', gender: 'Female', grade: 'Grade 5', section: 'Daisy', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-22', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '49', name: 'Carmen Bautista', birthdate: '2016-02-03', gender: 'Female', grade: 'Grade 5', section: 'Daisy', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-11', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '50', name: 'Carlo Mendoza', birthdate: '2016-08-25', gender: 'Male', grade: 'Grade 5', section: 'Daisy', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-09', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '51', name: 'Isabella Villanueva', birthdate: '2015-02-17', gender: 'Female', grade: 'Grade 6', section: 'Carnation', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-05', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '52', name: 'Nicole Lopez', birthdate: '2015-05-08', gender: 'Female', grade: 'Grade 6', section: 'Carnation', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-16', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '53', name: 'Trisha Dela Cruz', birthdate: '2015-08-15', gender: 'Female', grade: 'Grade 6', section: 'Carnation', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-08', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '54', name: 'Valentina Castillo', birthdate: '2015-05-11', gender: 'Female', grade: 'Grade 6', section: 'Carnation', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-10', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '55', name: 'Alyssa Navarro', birthdate: '2015-10-21', gender: 'Female', grade: 'Grade 6', section: 'Carnation', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-12', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '56', name: 'Nico Magno', birthdate: '2015-07-07', gender: 'Male', grade: 'Grade 6', section: 'Ilang-Ilang', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-07', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '57', name: 'Nico Garcia', birthdate: '2015-11-27', gender: 'Male', grade: 'Grade 6', section: 'Ilang-Ilang', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-10', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '58', name: 'Carlos Ramos', birthdate: '2015-03-03', gender: 'Male', grade: 'Grade 6', section: 'Ilang-Ilang', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-03-03', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '59', name: 'Jose Aquino', birthdate: '2015-11-18', gender: 'Male', grade: 'Grade 6', section: 'Ilang-Ilang', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-02-28', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '60', name: 'Sofia Cruz', birthdate: '2015-07-27', gender: 'Female', grade: 'Grade 6', section: 'Ilang-Ilang', school: 'Bagong Tanyag Integrated School', lastVisit: '2026-01-04', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '61', name: 'Marco Navarro', birthdate: '2020-05-20', gender: 'Male', grade: 'Grade 1', section: 'Ruby', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-11', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '62', name: 'Alyssa Ramos', birthdate: '2020-07-24', gender: 'Female', grade: 'Grade 1', section: 'Ruby', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-23', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '63', name: 'Patricia Santos', birthdate: '2020-01-01', gender: 'Female', grade: 'Grade 1', section: 'Ruby', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-04', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '64', name: 'Jasmine Lopez', birthdate: '2020-08-25', gender: 'Female', grade: 'Grade 1', section: 'Ruby', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-03', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '65', name: 'Jose Diaz', birthdate: '2020-12-13', gender: 'Male', grade: 'Grade 1', section: 'Ruby', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-21', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '66', name: 'Nicole Torres', birthdate: '2020-01-01', gender: 'Female', grade: 'Grade 1', section: 'Sapphire', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-15', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '67', name: 'Jomar Dela Cruz', birthdate: '2020-05-01', gender: 'Male', grade: 'Grade 1', section: 'Sapphire', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-22', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '68', name: 'Angel Aquino', birthdate: '2020-12-21', gender: 'Female', grade: 'Grade 1', section: 'Sapphire', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-12', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '69', name: 'Aldrin Bautista', birthdate: '2020-05-02', gender: 'Male', grade: 'Grade 1', section: 'Sapphire', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-18', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '70', name: 'Arnel Morales', birthdate: '2020-08-10', gender: 'Male', grade: 'Grade 1', section: 'Sapphire', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-22', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '71', name: 'Aldrin Torres', birthdate: '2019-01-12', gender: 'Male', grade: 'Grade 2', section: 'Emerald', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-05', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '72', name: 'Ronnie Torres', birthdate: '2019-06-03', gender: 'Male', grade: 'Grade 2', section: 'Emerald', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-25', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '73', name: 'Patricia Torres', birthdate: '2019-08-04', gender: 'Female', grade: 'Grade 2', section: 'Emerald', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-09', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '74', name: 'Katrina Bautista', birthdate: '2019-03-13', gender: 'Female', grade: 'Grade 2', section: 'Emerald', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-03', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '75', name: 'Carlo Gomez', birthdate: '2019-09-06', gender: 'Male', grade: 'Grade 2', section: 'Emerald', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-20', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '76', name: 'Celine Mendoza', birthdate: '2019-11-25', gender: 'Female', grade: 'Grade 2', section: 'Diamond', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-11', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '77', name: 'Angel Martinez', birthdate: '2019-07-25', gender: 'Female', grade: 'Grade 2', section: 'Diamond', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-10', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '78', name: 'Bea Navarro', birthdate: '2019-09-16', gender: 'Female', grade: 'Grade 2', section: 'Diamond', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-10', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '79', name: 'Valentina Morales', birthdate: '2019-04-16', gender: 'Female', grade: 'Grade 2', section: 'Diamond', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-07', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '80', name: 'Sofia Martinez', birthdate: '2019-04-22', gender: 'Female', grade: 'Grade 2', section: 'Diamond', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-25', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '81', name: 'Jolo Gomez', birthdate: '2018-11-06', gender: 'Male', grade: 'Grade 3', section: 'Topaz', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-22', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '82', name: 'Carmen Lopez', birthdate: '2018-11-22', gender: 'Female', grade: 'Grade 3', section: 'Topaz', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-12', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '83', name: 'Maria Dela Cruz', birthdate: '2018-10-08', gender: 'Female', grade: 'Grade 3', section: 'Topaz', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-08', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '84', name: 'Diego Lopez', birthdate: '2018-11-20', gender: 'Male', grade: 'Grade 3', section: 'Topaz', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-11', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '85', name: 'Mia Bautista', birthdate: '2018-01-19', gender: 'Female', grade: 'Grade 3', section: 'Topaz', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-16', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '86', name: 'Angel Santos', birthdate: '2018-06-14', gender: 'Female', grade: 'Grade 3', section: 'Garnet', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-10', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '87', name: 'Ronnie Diaz', birthdate: '2018-05-21', gender: 'Male', grade: 'Grade 3', section: 'Garnet', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-21', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '88', name: 'Bea Lopez', birthdate: '2018-01-06', gender: 'Female', grade: 'Grade 3', section: 'Garnet', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-26', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '89', name: 'Carlos Morales', birthdate: '2018-02-09', gender: 'Male', grade: 'Grade 3', section: 'Garnet', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-22', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '90', name: 'Elena Gomez', birthdate: '2018-02-01', gender: 'Female', grade: 'Grade 3', section: 'Garnet', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-12', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '91', name: 'Liam Garcia', birthdate: '2017-09-01', gender: 'Male', grade: 'Grade 4', section: 'Opal', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-24', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '92', name: 'Elena Santos', birthdate: '2017-03-20', gender: 'Female', grade: 'Grade 4', section: 'Opal', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-05', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '93', name: 'Renz Mendoza', birthdate: '2017-01-09', gender: 'Male', grade: 'Grade 4', section: 'Opal', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-26', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '94', name: 'Arnel Torres', birthdate: '2017-03-23', gender: 'Male', grade: 'Grade 4', section: 'Opal', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-19', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '95', name: 'Juan Gomez', birthdate: '2017-01-15', gender: 'Male', grade: 'Grade 4', section: 'Opal', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-16', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '96', name: 'Jomar Garcia', birthdate: '2017-02-05', gender: 'Male', grade: 'Grade 4', section: 'Pearl', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-23', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '97', name: 'Ana Lopez', birthdate: '2017-06-07', gender: 'Female', grade: 'Grade 4', section: 'Pearl', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-26', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '98', name: 'Roberto Dela Cruz', birthdate: '2017-02-01', gender: 'Male', grade: 'Grade 4', section: 'Pearl', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-20', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '99', name: 'Carlo Torres', birthdate: '2017-12-25', gender: 'Male', grade: 'Grade 4', section: 'Pearl', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-08', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '100', name: 'Carlos Aquino', birthdate: '2017-03-15', gender: 'Male', grade: 'Grade 4', section: 'Pearl', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-09', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '101', name: 'Nico Torres', birthdate: '2016-07-03', gender: 'Male', grade: 'Grade 5', section: 'Jade', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-13', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '102', name: 'Pedro Cruz', birthdate: '2016-08-05', gender: 'Male', grade: 'Grade 5', section: 'Jade', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-22', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '103', name: 'Jolo Garcia', birthdate: '2016-11-26', gender: 'Male', grade: 'Grade 5', section: 'Jade', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-27', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '104', name: 'Juan Lopez', birthdate: '2016-05-03', gender: 'Male', grade: 'Grade 5', section: 'Jade', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-04', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '105', name: 'Jose Villanueva', birthdate: '2016-04-27', gender: 'Male', grade: 'Grade 5', section: 'Jade', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-02', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '106', name: 'Diego Dela Cruz', birthdate: '2016-09-04', gender: 'Male', grade: 'Grade 5', section: 'Amber', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-17', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '107', name: 'Danica Lopez', birthdate: '2016-02-21', gender: 'Female', grade: 'Grade 5', section: 'Amber', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-27', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '108', name: 'Mia Navarro', birthdate: '2016-12-19', gender: 'Female', grade: 'Grade 5', section: 'Amber', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-08', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '109', name: 'Renz Martinez', birthdate: '2016-07-18', gender: 'Male', grade: 'Grade 5', section: 'Amber', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-16', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '110', name: 'Liam Ramos', birthdate: '2016-09-27', gender: 'Male', grade: 'Grade 5', section: 'Amber', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-10', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '111', name: 'Juan Bautista', birthdate: '2015-04-26', gender: 'Male', grade: 'Grade 6', section: 'Coral', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-06', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '112', name: 'Marco Flores', birthdate: '2015-10-04', gender: 'Male', grade: 'Grade 6', section: 'Coral', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-21', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '113', name: 'Isabella Ramos', birthdate: '2015-01-23', gender: 'Female', grade: 'Grade 6', section: 'Coral', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-01', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '114', name: 'Rafael Villanueva', birthdate: '2015-06-01', gender: 'Male', grade: 'Grade 6', section: 'Coral', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-21', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '115', name: 'Ana Reyes', birthdate: '2015-05-11', gender: 'Female', grade: 'Grade 6', section: 'Coral', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-16', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '116', name: 'Juan Santos', birthdate: '2015-04-08', gender: 'Male', grade: 'Grade 6', section: 'Onyx', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-12', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '117', name: 'Jolo Santos', birthdate: '2015-02-05', gender: 'Male', grade: 'Grade 6', section: 'Onyx', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-02-17', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '118', name: 'Jose Diaz', birthdate: '2015-10-28', gender: 'Male', grade: 'Grade 6', section: 'Onyx', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-03', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '119', name: 'Lucia Garcia', birthdate: '2015-06-11', gender: 'Female', grade: 'Grade 6', section: 'Onyx', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-01-20', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '120', name: 'Angelo Diaz', birthdate: '2015-11-27', gender: 'Male', grade: 'Grade 6', section: 'Onyx', school: 'Bagong Tanyag Elementary School Annex A', lastVisit: '2026-03-08', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '121', name: 'Rosa Villanueva', birthdate: '2020-04-23', gender: 'Female', grade: 'Grade 1', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-12', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '122', name: 'Renz Gomez', birthdate: '2020-01-17', gender: 'Male', grade: 'Grade 1', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-13', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '123', name: 'Pedro Morales', birthdate: '2020-05-11', gender: 'Male', grade: 'Grade 1', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-09', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '124', name: 'Katrina Morales', birthdate: '2020-06-06', gender: 'Female', grade: 'Grade 1', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-25', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '125', name: 'Celine Navarro', birthdate: '2020-07-07', gender: 'Female', grade: 'Grade 1', section: 'Narra', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-15', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '126', name: 'Ana Garcia', birthdate: '2020-06-17', gender: 'Female', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-15', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '127', name: 'Aldrin Villanueva', birthdate: '2020-09-03', gender: 'Male', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-16', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '128', name: 'Alyssa Bautista', birthdate: '2020-05-25', gender: 'Female', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-04', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '129', name: 'Ronnie Gomez', birthdate: '2020-11-19', gender: 'Male', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-18', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '130', name: 'Celine Bautista', birthdate: '2020-04-14', gender: 'Female', grade: 'Grade 1', section: 'Molave', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-03', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '131', name: 'Sofia Villanueva', birthdate: '2019-12-21', gender: 'Female', grade: 'Grade 2', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-07', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '132', name: 'Rafael Reyes', birthdate: '2019-07-26', gender: 'Male', grade: 'Grade 2', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-04', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '133', name: 'Bea Santos', birthdate: '2019-05-22', gender: 'Female', grade: 'Grade 2', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-08', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '134', name: 'Celine Flores', birthdate: '2019-04-15', gender: 'Female', grade: 'Grade 2', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-19', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '135', name: 'Renz Martinez', birthdate: '2019-12-09', gender: 'Male', grade: 'Grade 2', section: 'Acacia', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-02', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '136', name: 'Rosa Martinez', birthdate: '2019-01-05', gender: 'Female', grade: 'Grade 2', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-21', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '137', name: 'Pedro Gomez', birthdate: '2019-12-03', gender: 'Male', grade: 'Grade 2', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-13', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '138', name: 'Angelo Bautista', birthdate: '2019-08-17', gender: 'Male', grade: 'Grade 2', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-01', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '139', name: 'Mia Flores', birthdate: '2019-11-07', gender: 'Female', grade: 'Grade 2', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-19', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '140', name: 'Valentina Flores', birthdate: '2019-07-21', gender: 'Female', grade: 'Grade 2', section: 'Mahogany', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-22', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '141', name: 'Rafael Flores', birthdate: '2018-08-25', gender: 'Male', grade: 'Grade 3', section: 'Bamboo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-18', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '142', name: 'Celine Ramos', birthdate: '2018-05-15', gender: 'Female', grade: 'Grade 3', section: 'Bamboo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-09', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '143', name: 'Juan Villanueva', birthdate: '2018-01-03', gender: 'Male', grade: 'Grade 3', section: 'Bamboo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-21', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '144', name: 'Angelo Diaz', birthdate: '2018-03-13', gender: 'Male', grade: 'Grade 3', section: 'Bamboo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-22', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '145', name: 'Jolo Morales', birthdate: '2018-02-04', gender: 'Male', grade: 'Grade 3', section: 'Bamboo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-01', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '146', name: 'Arnel Morales', birthdate: '2018-12-12', gender: 'Male', grade: 'Grade 3', section: 'Ipil', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-02', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '147', name: 'Elena Reyes', birthdate: '2018-07-10', gender: 'Female', grade: 'Grade 3', section: 'Ipil', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-09', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '148', name: 'Jomar Reyes', birthdate: '2018-07-12', gender: 'Male', grade: 'Grade 3', section: 'Ipil', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-27', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '149', name: 'Celine Gomez', birthdate: '2018-02-27', gender: 'Female', grade: 'Grade 3', section: 'Ipil', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-25', oralStatus: 'Needs Follow-up', riskLevel: 'Low' },
    { id: '150', name: 'Ana Diaz', birthdate: '2018-05-13', gender: 'Female', grade: 'Grade 3', section: 'Ipil', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-06', oralStatus: 'Orally Fit', riskLevel: 'Medium' },
    { id: '151', name: 'Valentina Reyes', birthdate: '2017-07-24', gender: 'Female', grade: 'Grade 4', section: 'Kamagong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-23', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '152', name: 'Pedro Lopez', birthdate: '2017-09-02', gender: 'Male', grade: 'Grade 4', section: 'Kamagong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-25', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '153', name: 'Jose Navarro', birthdate: '2017-06-12', gender: 'Male', grade: 'Grade 4', section: 'Kamagong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-27', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '154', name: 'Arnel Morales', birthdate: '2017-01-04', gender: 'Male', grade: 'Grade 4', section: 'Kamagong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-20', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '155', name: 'Elena Lopez', birthdate: '2017-08-04', gender: 'Female', grade: 'Grade 4', section: 'Kamagong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-16', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '156', name: 'Nicole Cruz', birthdate: '2017-06-17', gender: 'Female', grade: 'Grade 4', section: 'Tindalo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-25', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '157', name: 'Marco Reyes', birthdate: '2017-02-05', gender: 'Male', grade: 'Grade 4', section: 'Tindalo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-21', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '158', name: 'Juan Martinez', birthdate: '2017-07-26', gender: 'Male', grade: 'Grade 4', section: 'Tindalo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-26', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '159', name: 'Jasmine Bautista', birthdate: '2017-12-19', gender: 'Female', grade: 'Grade 4', section: 'Tindalo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-24', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '160', name: 'Roberto Garcia', birthdate: '2017-10-24', gender: 'Male', grade: 'Grade 4', section: 'Tindalo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-20', oralStatus: 'Under Treatment', riskLevel: 'Medium' },
    { id: '161', name: 'Arnel Villanueva', birthdate: '2016-02-17', gender: 'Male', grade: 'Grade 5', section: 'Yakal', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-20', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '162', name: 'Ivan Gomez', birthdate: '2016-07-25', gender: 'Male', grade: 'Grade 5', section: 'Yakal', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-05', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '163', name: 'Roberto Reyes', birthdate: '2016-04-01', gender: 'Male', grade: 'Grade 5', section: 'Yakal', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-24', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '164', name: 'Diego Mendoza', birthdate: '2016-11-09', gender: 'Male', grade: 'Grade 5', section: 'Yakal', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-15', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '165', name: 'Diego Navarro', birthdate: '2016-03-14', gender: 'Male', grade: 'Grade 5', section: 'Yakal', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-03', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '166', name: 'Marco Dela Cruz', birthdate: '2016-08-05', gender: 'Male', grade: 'Grade 5', section: 'Lauan', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-08', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '167', name: 'Alyssa Cruz', birthdate: '2016-04-09', gender: 'Female', grade: 'Grade 5', section: 'Lauan', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-07', oralStatus: 'Under Treatment', riskLevel: 'High' },
    { id: '168', name: 'Angel Flores', birthdate: '2016-04-01', gender: 'Female', grade: 'Grade 5', section: 'Lauan', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-23', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '169', name: 'Jose Garcia', birthdate: '2016-04-06', gender: 'Male', grade: 'Grade 5', section: 'Lauan', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-19', oralStatus: 'Needs Follow-up', riskLevel: 'High' },
    { id: '170', name: 'Isabella Navarro', birthdate: '2016-03-21', gender: 'Female', grade: 'Grade 5', section: 'Lauan', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-12', oralStatus: 'Needs Treatment', riskLevel: 'High' },
    { id: '171', name: 'Nicole Dela Cruz', birthdate: '2015-03-23', gender: 'Female', grade: 'Grade 6', section: 'Apitong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-04', oralStatus: 'Under Treatment', riskLevel: 'Low' },
    { id: '172', name: 'Mia Morales', birthdate: '2015-02-07', gender: 'Female', grade: 'Grade 6', section: 'Apitong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-26', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '173', name: 'Lucia Reyes', birthdate: '2015-03-25', gender: 'Female', grade: 'Grade 6', section: 'Apitong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-05', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '174', name: 'Trisha Martinez', birthdate: '2015-12-23', gender: 'Female', grade: 'Grade 6', section: 'Apitong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-20', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '175', name: 'Carlos Flores', birthdate: '2015-10-02', gender: 'Male', grade: 'Grade 6', section: 'Apitong', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-28', oralStatus: 'Orally Fit', riskLevel: 'Low' },
    { id: '176', name: 'Carmen Lopez', birthdate: '2015-09-07', gender: 'Female', grade: 'Grade 6', section: 'Guijo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-27', oralStatus: 'Orally Fit', riskLevel: 'High' },
    { id: '177', name: 'Arnel Mendoza', birthdate: '2015-12-01', gender: 'Male', grade: 'Grade 6', section: 'Guijo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-08', oralStatus: 'Needs Follow-up', riskLevel: 'Medium' },
    { id: '178', name: 'Ronnie Martinez', birthdate: '2015-02-06', gender: 'Male', grade: 'Grade 6', section: 'Guijo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-03-19', oralStatus: 'Needs Treatment', riskLevel: 'Medium' },
    { id: '179', name: 'Danica Mendoza', birthdate: '2015-09-03', gender: 'Female', grade: 'Grade 6', section: 'Guijo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-01-12', oralStatus: 'Needs Treatment', riskLevel: 'Low' },
    { id: '180', name: 'Maria Reyes', birthdate: '2015-11-17', gender: 'Female', grade: 'Grade 6', section: 'Guijo', school: 'South Daang Hari Elementary School Main', lastVisit: '2026-02-06', oralStatus: 'Orally Fit', riskLevel: 'High' },
  ];

  const allSections = useMemo(() => {
    const base = schoolFilter !== 'all'
      ? allStudents.filter(s => s.school === schoolFilter)
      : allStudents;
    const filtered = gradeFilter !== 'all'
      ? base.filter(s => s.grade === gradeFilter)
      : base;
    return [...new Set(filtered.map(s => s.section))].sort();
  }, [schoolFilter, gradeFilter]);

  const filtered = useMemo(() => {
    return allStudents.filter(s => {
      const age = calculateAge(s.birthdate);
      const ageGroup = getAgeGroup(age);
      if (schoolFilter !== 'all' && s.school !== schoolFilter) return false;
      if (gradeFilter !== 'all' && s.grade !== gradeFilter) return false;
      if (sectionFilter !== 'all' && s.section !== sectionFilter) return false;
      if (genderFilter !== 'all' && s.gender !== genderFilter) return false;
      if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false;
      if (statusFilter !== 'all' && s.oralStatus !== statusFilter) return false;
      if (ageGroupFilter !== 'all' && ageGroup !== ageGroupFilter) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [schoolFilter, gradeFilter, sectionFilter, genderFilter, riskFilter, statusFilter, ageGroupFilter, searchTerm]);

  const hasActiveFilters = schoolFilter !== 'all' || gradeFilter !== 'all' || sectionFilter !== 'all' ||
    genderFilter !== 'all' || ageGroupFilter !== 'all' || riskFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '';

  const clearFilters = () => {
    setSchoolFilter('all'); setGradeFilter('all'); setSectionFilter('all');
    setGenderFilter('all'); setAgeGroupFilter('all'); setRiskFilter('all');
    setStatusFilter('all'); setSearchTerm('');
  };

  const riskBadge = (level: string) => {
    const colors: Record<string, string> = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[level] || 'bg-gray-100 text-gray-700'}`}>{level}</span>;
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Orally Fit': 'bg-green-100 text-green-800',
      'Needs Treatment': 'bg-red-100 text-red-800',
      'Under Treatment': 'bg-blue-100 text-blue-800',
      'Needs Follow-up': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  const FilterSelect = ({ value, onChange, options, label }: {
    value: string; onChange: (v: string) => void;
    options: {value: string; label: string}[]; label: string;
  }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="all">{label}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            value={schoolFilter}
            onChange={v => { setSchoolFilter(v); setSectionFilter('all'); }}
            label="All Schools"
            options={SCHOOLS.map(s => ({ value: s, label: s.replace(' Elementary School', '').replace(' Integrated School', ' Integrated').replace(' Main', '') }))}
          />
          <FilterSelect
            value={gradeFilter}
            onChange={v => { setGradeFilter(v); setSectionFilter('all'); }}
            label="All Grades"
            options={GRADES.map(g => ({ value: g, label: g }))}
          />
          <FilterSelect
            value={sectionFilter}
            onChange={v => setSectionFilter(v)}
            label="All Sections"
            options={allSections.map(s => ({ value: s, label: s }))}
          />
          <FilterSelect
            value={genderFilter}
            onChange={setGenderFilter}
            label="All Genders"
            options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
          />
          <FilterSelect
            value={ageGroupFilter}
            onChange={setAgeGroupFilter}
            label="All Age Groups"
            options={[
              { value: 'Under 5', label: 'Under 5' },
              { value: '6-10', label: '6–10' },
              { value: '10-14', label: '10–14' },
              { value: '15-19', label: '15–19' },
            ]}
          />
          <FilterSelect
            value={riskFilter}
            onChange={setRiskFilter}
            label="All Risk Levels"
            options={[
              { value: 'High', label: 'High Risk' },
              { value: 'Medium', label: 'Medium Risk' },
              { value: 'Low', label: 'Low Risk' },
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            label="All Statuses"
            options={[
              { value: 'Orally Fit', label: 'Orally Fit' },
              { value: 'Needs Treatment', label: 'Needs Treatment' },
              { value: 'Under Treatment', label: 'Under Treatment' },
              { value: 'Needs Follow-up', label: 'Needs Follow-up' },
            ]}
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
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
                <th className="text-left px-4 py-3 font-semibold text-gray-700">School</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Grade / Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Gender</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Last Visit</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No students match the selected filters.
                  </td>
                </tr>
              ) : filtered.map(student => {
                const age = calculateAge(student.birthdate);
                const gc = getGradeColor(student.grade);
                const gcStyle = { backgroundColor: gc.light, color: gc.solid };
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                          {student.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{student.school}</td>
                    <td className="px-4 py-3">
                      <span style={gcStyle} className="inline-block px-2 py-0.5 rounded text-xs font-semibold">
                        {student.grade}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">{student.section}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{age}</td>
                    <td className="px-4 py-3">{riskBadge(student.riskLevel)}</td>
                    <td className="px-4 py-3">{statusBadge(student.oralStatus)}</td>
                    <td className="px-4 py-3 text-gray-500">{student.lastVisit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/patients/${student.id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/dental-chart/${student.id}`)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="View Dental Chart"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {allStudents.length} students
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">Add New Student</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input type="text" value={newPatient.middleName} onChange={e => setNewPatient({...newPatient, middleName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate *</label>
                  <input type="date" value={newPatient.birthdate} onChange={e => setNewPatient({...newPatient, birthdate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                <select value={newPatient.school} onChange={e => setNewPatient({...newPatient, school: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select School</option>
                  {SCHOOLS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                  <select value={newPatient.grade} onChange={e => setNewPatient({...newPatient, grade: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                  <input type="text" value={newPatient.section} onChange={e => setNewPatient({...newPatient, section: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sampaguita" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name *</label>
                <input type="text" value={newPatient.guardianName} onChange={e => setNewPatient({...newPatient, guardianName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact</label>
                <input type="text" value={newPatient.guardianContact} onChange={e => setNewPatient({...newPatient, guardianContact: e.target.value})}
                  placeholder="09XX-XXX-XXXX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newPatient.firstName || !newPatient.lastName || !newPatient.school || !newPatient.grade) {
                    alert('Please fill in all required fields.');
                    return;
                  }
                  alert(`Student ${newPatient.firstName} ${newPatient.lastName} added successfully!`);
                  setShowAddForm(false);
                  setNewPatient({ firstName:'',lastName:'',middleName:'',birthdate:'',gender:'',grade:'',section:'',school:'',guardianName:'',guardianContact:'',address:'' });
                }}
                className="flex-1 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
