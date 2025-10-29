import React, { useState, useMemo } from 'react';
import type { ProfileChangeRequest, Employee } from '../types';
import DashboardCard from '../components/DashboardCard';
import { UserCircleIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

interface ProfileChangeRequestsProps {
    requests: ProfileChangeRequest[];
    employees: Employee[];
    onUpdateRequest: (updatedRequest: ProfileChangeRequest, changes: Partial<Employee>) => void;
}

const statusStyles = {
    'Pending': 'bg-yellow-500/20 text-yellow-300',
    'Approved': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
};

const ProfileChangeRequests: React.FC<ProfileChangeRequestsProps> = ({ requests, employees, onUpdateRequest }) => {
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
    
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const handleUpdate = (request: ProfileChangeRequest, newStatus: 'Approved' | 'Rejected') => {
        const changes = newStatus === 'Approved' ? request.requestedChanges : {};
        const updatedRequest = {
            ...request,
            status: newStatus,
            reviewedById: 'EMP005', // Assume admin is reviewing
            reviewedAt: new Date().toISOString()
        };
        onUpdateRequest(updatedRequest, changes);
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => filterStatus === 'All' || req.status === filterStatus);
    }, [requests, filterStatus]);

    return (
        <DashboardCard title="Profile Change Requests" icon={<UserCircleIcon />}>
            <div className="mb-4">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-400 mr-2">Filter by Status:</label>
                <select 
                    id="status-filter" 
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            
             <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee</th>
                            <th scope="col" className="px-6 py-3">Requested Changes</th>
                            <th scope="col" className="px-6 py-3">Requested By</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => {
                            const employee = employeeMap.get(req.employeeId);
                            const requester = employeeMap.get(req.requestedById);
                            if (!employee) return null;

                            return (
                                <tr key={req.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{employee.fullName}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1 text-xs">
                                        {Object.entries(req.requestedChanges).map(([key, value]) => (
                                            <div key={key}>
                                                <span className="font-semibold capitalize text-gray-300">{key}: </span>
                                                <span className="text-gray-400 line-through">{(employee as any)[key]}</span> → <span className="text-teal-400">{value}</span>
                                            </div>
                                        ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{requester?.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(req.requestDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'Pending' && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleUpdate(req, 'Approved')} title="Approve" className="p-1 rounded-full text-green-400 hover:bg-green-500/20"><CheckCircleIcon className="h-5 w-5"/></button>
                                                <button onClick={() => handleUpdate(req, 'Rejected')} title="Reject" className="p-1 rounded-full text-red-400 hover:bg-red-500/20"><XCircleIcon className="h-5 w-5"/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                         {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-gray-500">
                                    No requests match the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </DashboardCard>
    );
};

export default ProfileChangeRequests;