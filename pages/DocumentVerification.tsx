import React, { useState, useMemo, useRef } from 'react';
import type { Document, Farmer, SubsidyApplication, DocumentStatus, Employee } from '../types';
import { mockDocuments, mockFarmersData, mockSubsidyApplications, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { ClipboardDocumentCheckIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const documentStatusStyles: { [key in DocumentStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Verified': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Rejected': 'bg-red-500/20 text-red-300 border-red-500/30',
};

const DocumentVerification: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(mockDocuments);
    const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'All'>('Pending');
    const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const applicationMap = useMemo(() => new Map(mockSubsidyApplications.map(app => [app.id, app])), []);
    const employeeMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const groupedDocuments = useMemo(() => {
        const filteredDocs = documents.filter(doc => filterStatus === 'All' || doc.status === filterStatus);
        
        return filteredDocs.reduce((acc, doc) => {
            const app = applicationMap.get(doc.subsidyApplicationId);
            if (!app) return acc;

            if (!acc[app.id]) {
                acc[app.id] = {
                    application: app,
                    documents: []
                };
            }
            acc[app.id].documents.push(doc);
            return acc;
        }, {} as Record<string, { application: SubsidyApplication; documents: Document[] }>);
    }, [documents, filterStatus, applicationMap]);

    const handleUpdateStatus = (docId: string, newStatus: DocumentStatus) => {
        setDocuments(documents.map(doc => 
            doc.id === docId 
            ? { 
                ...doc, 
                status: newStatus, 
                verifiedById: 'EMP008', // Assume current employee is the reviewer
                verifiedAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString() 
              } 
            : doc
        ));
    };
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'document_verification', 'Document Verification Queue');
        }
    };

    const getDataForExport = () => {
        return Object.values(groupedDocuments).flatMap(({ application, documents: docs }) => 
            docs.map(doc => ({
                'Application ID': application.id,
                'Farmer': farmerMap.get(application.farmerId) || 'N/A',
                'Subsidy Type': application.subsidyType,
                'Document Type': doc.documentType,
                'Status': doc.status,
                'Verified By': doc.verifiedById ? employeeMap.get(doc.verifiedById) : 'N/A',
                'Verified At': doc.verifiedAt || 'N/A',
            }))
        );
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Document Verification', data: getDataForExport() }], 'document_verification.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Document Verification', data: getDataForExport() }], 'document_verification');
    };

    // FIX: Changed exportOptions from an object to an array of objects to match the DashboardCard's expected prop type.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    return (
        <DashboardCard title="Document Verification Queue" icon={<ClipboardDocumentCheckIcon />} exportOptions={exportOptions} contentRef={contentRef}>
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
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div className="space-y-4">
                {Object.values(groupedDocuments).map(({ application, documents: docs }) => (
                    <div key={application.id} className="bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <button 
                            className="w-full p-4 flex justify-between items-center text-left"
                            onClick={() => setExpandedAppId(expandedAppId === application.id ? null : application.id)}
                        >
                            <div>
                                <p className="font-semibold text-white">{farmerMap.get(application.farmerId)} - <span className="text-teal-400">{application.id}</span></p>
                                <p className="text-sm text-gray-400">{application.subsidyType} Application</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-sm font-medium text-gray-300">{docs.length} Document(s)</span>
                               {expandedAppId === application.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </div>
                        </button>

                        {expandedAppId === application.id && (
                            <div className="border-t border-gray-700/50 p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-400">
                                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                            <tr>
                                                <th className="px-4 py-2">Document Type</th>
                                                <th className="px-4 py-2">Status</th>
                                                <th className="px-4 py-2">Last Updated</th>
                                                <th className="px-4 py-2 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {docs.map(doc => (
                                                <tr key={doc.id} className="border-b border-gray-700/50 last:border-b-0">
                                                    <td className="px-4 py-3 font-medium text-white">{doc.documentType}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${documentStatusStyles[doc.status]}`}>
                                                            {doc.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{doc.updatedAt.split('T')[0]}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button onClick={() => handleUpdateStatus(doc.id, 'Verified')} className="font-semibold text-xs text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={doc.status === 'Verified'}>
                                                                Verify
                                                            </button>
                                                            <button onClick={() => handleUpdateStatus(doc.id, 'Rejected')} className="font-semibold text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={doc.status === 'Rejected'}>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {Object.keys(groupedDocuments).length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <p>No documents match the current filter.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};

export default DocumentVerification;