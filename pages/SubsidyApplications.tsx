import React, { useState, useMemo, useRef } from 'react';
import type { SubsidyApplication, Farmer, SubsidyApplicationStatus, Document, Employee } from '../types';
import { mockSubsidyApplications, mockFarmersData, mockDocuments, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusStyles: { [key in SubsidyApplicationStatus]: string } = {
    'Submitted': 'bg-blue-500/20 text-blue-300',
    'Documents Pending': 'bg-yellow-500/20 text-yellow-300',
    'Under Review': 'bg-purple-500/20 text-purple-300',
    'Approved': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
};

const documentStatusStyles = {
    'Pending': 'text-yellow-400',
    'Verified': 'text-green-400',
    'Rejected': 'text-red-400',
};

const SubsidyApplications: React.FC = () => {
    const [applications, setApplications] = useState<SubsidyApplication[]>(mockSubsidyApplications);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<SubsidyApplicationStatus | 'All'>('All');
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f])), []);
    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);
    const documentsByAppId = useMemo(() => {
        return mockDocuments.reduce((acc, doc) => {
            (acc[doc.subsidyApplicationId] = acc[doc.subsidyApplicationId] || []).push(doc);
            return acc;
        }, {} as Record<string, Document[]>);
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const farmer = farmerMap.get(app.farmerId);
            const searchMatch = farmer && (
                farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const statusMatch = filterStatus === 'All' || app.status === filterStatus;
            return searchMatch && statusMatch;
        });
    }, [applications, searchTerm, filterStatus, farmerMap]);

    const handleToggleRow = (appId: string) => {
        setExpandedRowId(prevId => (prevId === appId ? null : appId));
    };
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'subsidy_applications', 'Subsidy Applications Management');
        }
    };

    const getDataForExport = () => {
        return filteredApplications.map(app => ({
            'Application ID': app.id,
            'Farmer': farmerMap.get(app.farmerId)?.fullName || 'N/A',
            'Subsidy Type': app.subsidyType,
            'Application Date': app.applicationDate,
            'Requested Amount (₹)': app.requestedAmount,
            'Approved Amount (₹)': app.approvedAmount || 'N/A',
            'Status': app.status,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Subsidy Applications', data: getDataForExport() }], 'subsidy_applications.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Subsidy Applications', data: getDataForExport() }], 'subsidy_applications');
    };

    // FIX: Changed exportOptions from an object to an array of objects to match the DashboardCard's expected prop type.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    return (
        <DashboardCard title="Subsidy Applications Management" icon={<DocumentTextIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                 <div className="flex items-center gap-4 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="Search by App ID or Farmer..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                     <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-400 mr-2">Status:</label>
                        <select 
                            id="status-filter" 
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value as any)}
                            className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                           <option value="All">All Statuses</option>
                           {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    New Application
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Application ID</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Subsidy Type</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount (₹)</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((app) => (
                            <React.Fragment key={app.id}>
                                <tr className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{app.id}</td>
                                    <td className="px-6 py-4 text-white">{farmerMap.get(app.farmerId)?.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4">{app.subsidyType}</td>
                                    <td className="px-6 py-4">{app.applicationDate}</td>
                                    <td className="px-6 py-4 text-right font-mono">{app.requestedAmount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[app.status]}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleToggleRow(app.id)} className="font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1">
                                                <span>Details</span>
                                                {expandedRowId === app.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            </button>
                                            <button className="font-medium text-blue-400 hover:text-blue-300">
                                                <PencilIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRowId === app.id && (
                                    <tr className="bg-gray-900/50">
                                        <td colSpan={7} className="p-4">
                                            <div className="bg-gray-800/50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-teal-400 mb-2 border-b border-gray-700 pb-2">Application Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <p><span className="text-gray-400">Approved Amount: </span><span className="text-white font-medium">{app.approvedAmount ? `₹${app.approvedAmount.toLocaleString('en-IN')}` : 'N/A'}</span></p>
                                                        <p className="text-gray-400">Notes:</p>
                                                        <p className="text-white italic bg-gray-900/40 p-2 rounded-md">{app.notes || 'No notes for this application.'}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-teal-400 mb-2 border-b border-gray-700 pb-2">Required Documents</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        {(documentsByAppId[app.id] || []).map(doc => (
                                                            <li key={doc.id} className="flex justify-between items-center">
                                                                <span className="text-white">{doc.documentType}</span>
                                                                <span className={`font-semibold ${documentStatusStyles[doc.status]}`}>{doc.status}</span>
                                                            </li>
                                                        ))}
                                                        {(!documentsByAppId[app.id] || documentsByAppId[app.id].length === 0) && <li className="text-gray-500">No documents associated.</li>}
                                                    </ul>
                                                </div>
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

export default SubsidyApplications;