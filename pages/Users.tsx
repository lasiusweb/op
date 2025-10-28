import React, { useRef, useState, useMemo } from 'react';
import type { User, UserRole, FarmVisitRequest } from '../types';
import DashboardCard from '../components/DashboardCard';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { ArrowUpTrayIcon } from '../components/Icons';
import BulkImportModal from '../components/BulkImportModal';

interface UsersProps {
  currentUser: User;
  allUsers: User[];
  allVisitRequests: FarmVisitRequest[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onViewProfile: (userId: string) => void;
  onViewVisits: (userId: string) => void;
}

const userTemplateHeaders = [
    "fullName", "role", "email", "mobile", "region", "status", "reportingManagerId"
];
const validRoles: UserRole[] = ['Admin', 'Field Agent', 'Reviewer', 'Accountant', 'Mandal Coordinator', 'Procurement Center Manager', 'Factory Manager'];

const Users: React.FC<UsersProps> = ({ currentUser, allUsers, setAllUsers, onViewProfile, allVisitRequests, onViewVisits }) => {
  const isAdmin = currentUser.role === 'Admin';
  const contentRef = useRef<HTMLDivElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const visitCounts = useMemo(() => {
    const counts: { [userId: string]: number } = {};
    for (const user of allUsers) {
        counts[user.id] = 0;
    }
    for (const visit of allVisitRequests) {
        if (visit.assignedAgentId && (visit.status === 'Pending' || visit.status === 'Scheduled')) {
            if (counts[visit.assignedAgentId] !== undefined) {
                counts[visit.assignedAgentId]++;
            }
        }
    }
    return counts;
  }, [allUsers, allVisitRequests]);


  const handleExportPDF = () => {
    if (contentRef.current) {
        exportElementAsPDF(contentRef.current, 'users_list', 'User & Role Management');
    }
  };

  const getDataForExport = () => {
    return allUsers.map(user => ({
        'User ID': user.id,
        'Full Name': user.fullName,
        'Role': user.role,
        'Region': user.region,
        'Active Visits': visitCounts[user.id] || 0,
        'Status': user.status,
        'Email': user.email,
        'Mobile': user.mobile,
    }));
  };

  const handleExportCSV = () => {
      exportToCSV([{ title: 'Users', data: getDataForExport() }], 'users_list.csv');
  };

  const handleExportExcel = () => {
      exportToExcel([{ title: 'Users', data: getDataForExport() }], 'users_list');
  };

    const handleImport = (newUsersData: any[]) => {
        const now = new Date().toISOString();
        const processedUsers: User[] = newUsersData.map((item, index) => {
            const role = validRoles.includes(item.role) ? item.role : 'Field Agent';
            const status = ['Active', 'Inactive'].includes(item.status) ? item.status : 'Active';
            return {
                id: `USR-IMP-${Date.now() + index}`,
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
        setAllUsers(prev => [...prev, ...processedUsers]);
        alert(`${processedUsers.length} new users imported successfully!`);
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
        templateHeaders={userTemplateHeaders}
        entityName="Users"
    />
    <DashboardCard title="User & Role Management" exportOptions={exportOptions} contentRef={contentRef}>
       <div className="mb-4 flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Search users..." 
          className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {isAdmin && (
            <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    Import Users
                </button>
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  Add New User
                </button>
            </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">User ID</th>
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
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 text-white">
                    <button onClick={() => onViewProfile(user.id)} className="hover:underline text-teal-400 hover:text-teal-300 font-semibold">
                      {user.fullName}
                    </button>
                </td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.region}</td>
                <td className="px-6 py-4">
                  {user.role === 'Field Agent' && (
                    <button
                        onClick={() => onViewVisits(user.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                            visitCounts[user.id] > 0
                            ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/40'
                            : 'bg-gray-700/50 text-gray-400 cursor-default'
                        }`}
                        disabled={visitCounts[user.id] === 0}
                        aria-label={`View ${visitCounts[user.id]} visits for ${user.fullName}`}
                    >
                      {visitCounts[user.id]}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {user.status}
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

export default Users;