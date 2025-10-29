import React, { useRef, useState, useMemo } from 'react';
import type { Employee, EmployeeRole, FarmVisitRequest } from '../types';
import DashboardCard from '../components/DashboardCard';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { ArrowUpTrayIcon } from '../components/Icons';
import BulkImportModal from '../components/BulkImportModal';

interface EmployeesProps {
  currentEmployee: Employee;
  allEmployees: Employee[];
  allVisitRequests: FarmVisitRequest[];
  setAllEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onViewProfile: (employeeId: string) => void;
  onViewVisits: (employeeId: string) => void;
}

const employeeTemplateHeaders = [
    "fullName", "role", "email", "mobile", "region", "status", "reportingManagerId"
];
const validRoles: EmployeeRole[] = ['Admin', 'Field Agent', 'Reviewer', 'Accountant', 'Mandal Coordinator', 'Procurement Center Manager', 'Factory Manager'];

const Employees: React.FC<EmployeesProps> = ({ currentEmployee, allEmployees, setAllEmployees, onViewProfile, allVisitRequests, onViewVisits }) => {
  const isAdmin = currentEmployee.role === 'Admin';
  const contentRef = useRef<HTMLDivElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
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
                fullName: item.fullName || 'Unnamed',
                role: role,
                email: item.email || '',
                mobile: item.mobile || '',
                region: item.region || 'Unassigned',
                status: status,
                reportingManagerId: item.reportingManagerId || undefined,
                createdAt: now,
                updatedAt: now,
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

  return (
    <>
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
          placeholder="Search employees..." 
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
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  Add New Employee
                </button>
            </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-800">
            <tr>
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
            {allEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
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