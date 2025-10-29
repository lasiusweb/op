import React, { useRef, useState, useMemo, useEffect } from 'react';
import type { Employee, EmployeeRole, FarmVisitRequest } from '../types';
import DashboardCard from '../components/DashboardCard';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { ArrowUpTrayIcon, UserMinusIcon } from '../components/Icons';
import BulkImportModal from '../components/BulkImportModal';

interface EmployeesProps {
  currentEmployee: Employee;
  allEmployees: Employee[];
  allVisitRequests: FarmVisitRequest[];
  setAllEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onViewProfile: (employeeId: string) => void;
  onViewVisits: (employeeId: string) => void;
  onAddNewEmployee: () => void;
}

const employeeTemplateHeaders = [
    "fullName", "role", "email", "mobile", "region", "status", "reportingManagerId"
];
const validRoles: EmployeeRole[] = ['Admin', 'Field Agent', 'Reviewer', 'Accountant', 'Mandal Coordinator', 'Procurement Center Manager', 'Factory Manager'];

const ConfirmationModal: React.FC<{
    onConfirm: () => void;
    onCancel: () => void;
    count: number;
    actionText: string;
}> = ({ onConfirm, onCancel, count, actionText }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Confirm Action</h2>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to {actionText} for <span className="font-bold text-teal-400">{count}</span> selected employee(s)?
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


const Employees: React.FC<EmployeesProps> = ({ currentEmployee, allEmployees, setAllEmployees, onViewProfile, allVisitRequests, onViewVisits, onAddNewEmployee }) => {
  const isAdmin = currentEmployee.role === 'Admin';
  const contentRef = useRef<HTMLDivElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  
  const visitCounts = useMemo(() => {
    const counts: { [employeeId: string]: number } = {};
    for (const employee of allEmployees) {
        counts[employee.id] = 0;
    }
    for (const visit of allVisitRequests) {
        if (visit.assignedAgentId && (visit.status === 'Pending' || visit.status === 'Scheduled')) {
            if (counts[visit.assignedAgentId] !== undefined) {
                counts[visit.assignedAgentId]++;
            }
        }
    }
    return counts;
  }, [allEmployees, allVisitRequests]);
  
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return allEmployees;
    const lowercasedTerm = searchTerm.toLowerCase();
    return allEmployees.filter(employee =>
        employee.fullName.toLowerCase().includes(lowercasedTerm) ||
        employee.id.toLowerCase().includes(lowercasedTerm) ||
        employee.role.toLowerCase().includes(lowercasedTerm) ||
        employee.region.toLowerCase().includes(lowercasedTerm)
    );
  }, [allEmployees, searchTerm]);

  const visibleIds = useMemo(() => filteredEmployees.map(e => e.id), [filteredEmployees]);
  const isAllSelected = useMemo(() => visibleIds.length > 0 && visibleIds.every(id => selectedEmployeeIds.includes(id)), [visibleIds, selectedEmployeeIds]);
  const isSomeSelected = useMemo(() => selectedEmployeeIds.some(id => visibleIds.includes(id)) && !isAllSelected, [selectedEmployeeIds, visibleIds, isAllSelected]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
        selectAllCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectOne = (employeeId: string) => {
    setSelectedEmployeeIds(prev =>
        prev.includes(employeeId)
            ? prev.filter(id => id !== employeeId)
            : [...prev, employeeId]
    );
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setSelectedEmployeeIds(prev => [...new Set([...prev, ...visibleIds])]);
    } else {
        setSelectedEmployeeIds(prev => prev.filter(id => !visibleIds.includes(id)));
    }
  };

  const handleBulkUpdate = (updates: Partial<Employee>) => {
    setAllEmployees(prev =>
        prev.map(emp =>
            selectedEmployeeIds.includes(emp.id)
                ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
                : emp
        )
    );
    setSelectedEmployeeIds([]);
  };

  const handleConfirmDeactivate = () => {
    handleBulkUpdate({ status: 'Inactive' });
    setShowDeactivateConfirm(false);
  };

  const handleExportSelected = (format: 'csv' | 'excel') => {
    const selectedData = allEmployees
        .filter(emp => selectedEmployeeIds.includes(emp.id))
        .map(employee => ({
            'Employee ID': employee.id,
            'Full Name': employee.fullName,
            'Role': employee.role,
            'Region': employee.region,
            'Active Visits': visitCounts[employee.id] || 0,
            'Status': employee.status,
            'Email': employee.email,
            'Mobile': employee.mobile,
        }));
    
    if (format === 'csv') {
        exportToCSV([{ title: 'Selected Employees', data: selectedData }], 'selected_employees.csv');
    } else {
        exportToExcel([{ title: 'Selected Employees', data: selectedData }], 'selected_employees');
    }
    setSelectedEmployeeIds([]);
  };


  const handleExportPDF = () => {
    if (contentRef.current) {
        exportElementAsPDF(contentRef.current, 'employees_list', 'Employee & Role Management');
    }
  };

  const getDataForExport = () => {
    return allEmployees.map(employee => ({
        'Employee ID': employee.id,
        'Full Name': employee.fullName,
        'Role': employee.role,
        'Region': employee.region,
        'Active Visits': visitCounts[employee.id] || 0,
        'Status': employee.status,
        'Email': employee.email,
        'Mobile': employee.mobile,
    }));
  };

  const handleExportCSV = () => {
      exportToCSV([{ title: 'Employees', data: getDataForExport() }], 'employees_list.csv');
  };

  const handleExportExcel = () => {
      exportToExcel([{ title: 'Employees', data: getDataForExport() }], 'employees_list');
  };

    const handleImport = (newEmployeesData: any[]) => {
        const now = new Date().toISOString();
        const processedEmployees: Employee[] = newEmployeesData.map((item, index) => {
            const role = validRoles.includes(item.role) ? item.role : 'Field Agent';
            const status = ['Active', 'Inactive'].includes(item.status) ? item.status : 'Active';
            return {
                id: `EMP-IMP-${Date.now() + index}`,
                firstName: item.fullName?.split(' ')[0] || 'Unnamed',
                lastName: item.fullName?.split(' ').slice(1).join(' ') || '',
                fullName: item.fullName || 'Unnamed',
                role: role,
                email: item.email || '',
                mobile: item.mobile || '',
                region: item.region || 'Unassigned',
                status: status,
                reportingManagerId: item.reportingManagerId || undefined,
                createdAt: now,
                updatedAt: now,
                joiningDate: now,
                dob: '1990-01-01', // A sensible default.
                gender: 'Male',
            };
        });
        setAllEmployees(prev => [...prev, ...processedEmployees]);
        alert(`${processedEmployees.length} new employees imported successfully!`);
        setIsImportModalOpen(false);
    };

  const exportOptions = {
    csv: handleExportCSV,
    excel: handleExportExcel,
    pdf: handleExportPDF,
  };

  const BulkActionsBar: React.FC = () => {
    const [managerId, setManagerId] = useState('');
    const managers = allEmployees.filter(e => e.role.includes('Manager') || e.role.includes('Coordinator') || e.role === 'Admin');

    const handleAssign = () => {
        if (!managerId) {
            alert('Please select a manager to assign.');
            return;
        }
        handleBulkUpdate({ reportingManagerId: managerId });
    };

    if (selectedEmployeeIds.length === 0) return null;
    
    return (
        <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 my-4 flex items-center justify-between flex-wrap gap-4">
            <p className="font-semibold text-white">{selectedEmployeeIds.length} selected</p>
            <div className="flex items-center gap-4 flex-wrap">
                <button onClick={() => setShowDeactivateConfirm(true)} className="flex items-center gap-2 text-sm bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 px-3 py-1 rounded-md transition-colors">
                    <UserMinusIcon className="h-4 w-4" /> Deactivate
                </button>
                <div className="flex items-center gap-2">
                     <select
                        value={managerId}
                        onChange={e => setManagerId(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="">Reassign to...</option>
                        {managers.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                    </select>
                    <button onClick={handleAssign} disabled={!managerId} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-3 rounded-md transition-colors text-sm disabled:bg-gray-500">Assign</button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleExportSelected('csv')} className="text-sm text-gray-300 hover:text-white">Export CSV</button>
                    <span className="text-gray-500">|</span>
                    <button onClick={() => handleExportSelected('excel')} className="text-sm text-gray-300 hover:text-white">Export Excel</button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <>
    {showDeactivateConfirm && <ConfirmationModal onConfirm={handleConfirmDeactivate} onCancel={() => setShowDeactivateConfirm(false)} count={selectedEmployeeIds.length} actionText="deactivate" />}
    <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        templateHeaders={employeeTemplateHeaders}
        entityName="Employees"
    />
    <DashboardCard title="Employee & Role Management" exportOptions={exportOptions} contentRef={contentRef}>
       <div className="mb-4 flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Search employees by name, ID, role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {isAdmin && (
            <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    Import Employees
                </button>
                <button onClick={onAddNewEmployee} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  Add New Employee
                </button>
            </div>
        )}
      </div>
      <BulkActionsBar />
      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-800">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                    <input ref={selectAllCheckboxRef} id="checkbox-all" type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500" />
                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">Employee ID</th>
              <th scope="col" className="px-6 py-3">Full Name</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Region</th>
              <th scope="col" className="px-6 py-3">Active Visits</th>
              <th scope="col" className="px-6 py-3">Status</th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className={`border-b border-gray-700 bg-gray-800/50 ${selectedEmployeeIds.includes(employee.id) ? 'bg-teal-900/30' : 'hover:bg-gray-700/50'}`}>
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id={`checkbox-${employee.id}`} type="checkbox" checked={selectedEmployeeIds.includes(employee.id)} onChange={() => handleSelectOne(employee.id)} className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500" />
                        <label htmlFor={`checkbox-${employee.id}`} className="sr-only">checkbox</label>
                    </div>
                </td>
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{employee.id}</td>
                <td className="px-6 py-4 text-white">
                    <button onClick={() => onViewProfile(employee.id)} className="hover:underline text-teal-400 hover:text-teal-300 font-semibold">
                      {employee.fullName}
                    </button>
                </td>
                <td className="px-6 py-4">{employee.role}</td>
                <td className="px-6 py-4">{employee.region}</td>
                <td className="px-6 py-4">
                  {employee.role === 'Field Agent' && (
                    <button
                        onClick={() => onViewVisits(employee.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                            visitCounts[employee.id] > 0
                            ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/40'
                            : 'bg-gray-700/50 text-gray-400 cursor-default'
                        }`}
                        disabled={visitCounts[employee.id] === 0}
                        aria-label={`View ${visitCounts[employee.id]} visits for ${employee.fullName}`}
                    >
                      {visitCounts[employee.id]}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-teal-400 hover:underline">Edit</a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
    </>
  );
};

export default Employees;