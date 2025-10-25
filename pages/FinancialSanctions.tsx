import React, { useState, useMemo, useRef } from 'react';
import type { HOSanction, HOSanctionStatus, HOSanctionType, User } from '../types';
import { mockHOSanctions, mockUsers } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { BanknotesIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusStyles: { [key in HOSanctionStatus]: string } = {
    'Pending Approval': 'bg-yellow-500/20 text-yellow-300',
    'Approved': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
    'Query Raised': 'bg-blue-500/20 text-blue-300',
};

const FinancialSanctions: React.FC = () => {
    const [sanctions, setSanctions] = useState<HOSanction[]>(mockHOSanctions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<HOSanctionStatus | 'All'>('All');
    const [filterType, setFilterType] = useState<HOSanctionType | 'All'>('All');
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const userMap = useMemo(() => new Map(mockUsers.map(u => [u.id, u.fullName])), []);

    const handleUpdateStatus = (sanctionId: string, newStatus: HOSanctionStatus) => {
        setSanctions(sanctions.map(s => 
            s.id === sanctionId 
            ? { 
                ...s, 
                status: newStatus, 
                reviewedById: 'USR005', // Assume current user is Admin
                updatedAt: new Date().toISOString() 
              } 
            : s
        ));
    };
    
    const filteredSanctions = useMemo(() => {
        return sanctions.filter(s => {
            const searchMatch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.relatedEntityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userMap.get(s.submittedById)?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const statusMatch = filterStatus === 'All' || s.status === filterStatus;
            const typeMatch = filterType === 'All' || s.sanctionType === filterType;

            return searchMatch && statusMatch && typeMatch;
        });
    }, [sanctions, searchTerm, filterStatus, filterType, userMap]);

    const handleToggleRow = (id: string) => {
        setExpandedRowId(prevId => (prevId === id ? null : id));
    };

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'financial_sanctions', 'Financial Sanctions');
        }
    };

    const getDataForExport = () => {
        return filteredSanctions.map(s => ({
            'Sanction ID': s.id,
            'Type': s.sanctionType,
            'Related Entity ID': s.relatedEntityId,
            'Amount (₹)': s.amount,
            'Status': s.status,
            'Submitted By': userMap.get(s.submittedById) || s.submittedById,
            'Reviewed By': s.reviewedById ? userMap.get(s.reviewedById) : 'N/A',
            'Notes': s.notes || '',
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Financial Sanctions', data: getDataForExport() }], 'financial_sanctions.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Financial Sanctions', data: getDataForExport() }], 'financial_sanctions');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Financial Sanctions" icon={<BanknotesIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="Search ID, Entity, Submitter..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-400 mr-2">Status:</label>
                        <select id="status-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All Statuses</option>
                           {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="type-filter" className="text-sm font-medium text-gray-400 mr-2">Type:</label>
                        <select id="type-filter" value={filterType} onChange={e => setFilterType(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All Types</option>
                           <option value="High Value Subsidy">High Value Subsidy</option>
                           <option value="Bulk Procurement Payment">Bulk Procurement</option>
                           <option value="Operational Expense">Operational Expense</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Sanction ID</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Related Entity</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount (₹)</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Submitted By</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSanctions.map((s) => (
                           <React.Fragment key={s.id}>
                                <tr className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{s.id}</td>
                                    <td className="px-6 py-4">{s.sanctionType}</td>
                                    <td className="px-6 py-4 font-mono">{s.relatedEntityId}</td>
                                    <td className="px-6 py-4 text-right font-mono text-white">{s.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[s.status]}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{userMap.get(s.submittedById) || s.submittedById}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggleRow(s.id)} className="font-medium text-teal-400 hover:text-teal-300">
                                                 {expandedRowId === s.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            </button>
                                            <button onClick={() => handleUpdateStatus(s.id, 'Approved')} title="Approve" className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={s.status === 'Approved'}>
                                                <CheckCircleIcon />
                                            </button>
                                            <button onClick={() => handleUpdateStatus(s.id, 'Rejected')} title="Reject" className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={s.status === 'Rejected'}>
                                                <XCircleIcon />
                                            </button>
                                             <button onClick={() => handleUpdateStatus(s.id, 'Query Raised')} title="Raise Query" className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={s.status === 'Query Raised'}>
                                                <QuestionMarkCircleIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRowId === s.id && (
                                     <tr className="bg-gray-900/50">
                                        <td colSpan={7} className="p-4">
                                            <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                                                <p><span className="font-semibold text-gray-400">Reviewed By:</span> <span className="text-white">{s.reviewedById ? userMap.get(s.reviewedById) : 'N/A'}</span></p>
                                                <p><span className="font-semibold text-gray-400">Submitted On:</span> <span className="text-white">{s.createdAt.split('T')[0]}</span></p>
                                                <p><span className="font-semibold text-gray-400">Last Updated:</span> <span className="text-white">{s.updatedAt.split('T')[0]}</span></p>
                                                <p className="font-semibold text-gray-400">Notes:</p>
                                                <p className="text-white italic bg-gray-900/40 p-2 rounded-md">{s.notes || 'No notes for this sanction.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default FinancialSanctions;