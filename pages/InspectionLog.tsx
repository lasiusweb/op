import React, { useState, useMemo, useRef } from 'react';
import type { Inspection, Farmer, SubsidyApplication, Employee, InspectionStatus, InspectionOutcome } from '../types';
import { mockInspections, mockFarmersData, mockSubsidyApplications, mockEmployees, mockLandParcels } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, MagnifyingGlassIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusStyles: { [key in InspectionStatus]: string } = {
    'Scheduled': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'Cancelled': 'bg-gray-500/20 text-gray-300',
};

const outcomeStyles: { [key in InspectionOutcome]: string } = {
    'Passed': 'bg-green-500/20 text-green-300',
    'Failed': 'bg-red-500/20 text-red-300',
    'Needs Follow-up': 'bg-yellow-500/20 text-yellow-300',
};

const InspectionLog: React.FC = () => {
    const [inspections, setInspections] = useState<Inspection[]>(mockInspections);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<InspectionStatus | 'All'>('All');
    const contentRef = useRef<HTMLDivElement>(null);
    
    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const applicationMap = useMemo(() => new Map(mockSubsidyApplications.map(app => [app.id, app])), []);
    const landParcelMap = useMemo(() => new Map(mockLandParcels.map(lp => [lp.id, lp])), []);
    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const getRelatedEntityInfo = (inspection: Inspection) => {
        if (inspection.relatedEntityType === 'SubsidyApplication') {
            const app = applicationMap.get(inspection.relatedEntityId);
            if (!app) return { name: 'Unknown Application', type: 'Subsidy' };
            const farmerName = farmerMap.get(app.farmerId);
            return { name: `${farmerName} (${app.id})`, type: 'Subsidy' };
        }
        if (inspection.relatedEntityType === 'LandParcel') {
            const parcel = landParcelMap.get(inspection.relatedEntityId);
            if (!parcel) return { name: 'Unknown Parcel', type: 'Land' };
            const farmerName = farmerMap.get(parcel.farmerId);
            return { name: `${farmerName} (${parcel.surveyNumber})`, type: 'Land' };
        }
        return { name: 'N/A', type: 'N/A' };
    };

    const filteredInspections = useMemo(() => {
        return inspections.filter(insp => {
            const inspectorName = userMap.get(insp.inspectorId)?.toLowerCase() || '';
            const relatedInfo = getRelatedEntityInfo(insp);
            const searchMatch = inspectorName.includes(searchTerm.toLowerCase()) || relatedInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = filterStatus === 'All' || insp.status === filterStatus;
            return searchMatch && statusMatch;
        });
    }, [inspections, searchTerm, filterStatus, userMap]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'inspection_log', 'Inspection Log');
        }
    };

    const getDataForExport = () => {
        return filteredInspections.map(insp => {
            const relatedInfo = getRelatedEntityInfo(insp);
            return {
                'Inspection ID': insp.id,
                'Related Entity': relatedInfo.name,
                'Entity Type': relatedInfo.type,
                'Inspector': userMap.get(insp.inspectorId) || 'N/A',
                'Date': insp.inspectionDate,
                'Status': insp.status,
                'Outcome': insp.outcome || 'N/A',
                'Notes': insp.notes || '',
            };
        });
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Inspection Log', data: getDataForExport() }], 'inspection_log.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Inspection Log', data: getDataForExport() }], 'inspection_log');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Inspection Log" icon={<MagnifyingGlassIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                 <div className="flex items-center gap-4 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="Search by Inspector, Farmer..." 
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
                    Schedule Inspection
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Inspection ID</th>
                            <th scope="col" className="px-6 py-3">Related To</th>
                            <th scope="col" className="px-6 py-3">Inspector</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Outcome</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInspections.map((insp) => {
                            const relatedInfo = getRelatedEntityInfo(insp);
                            return (
                            <tr key={insp.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{insp.id}</td>
                                <td className="px-6 py-4 text-white">
                                    <div>{relatedInfo.name}</div>
                                    <div className="text-xs text-gray-500">{relatedInfo.type} Inspection</div>
                                </td>
                                <td className="px-6 py-4">{userMap.get(insp.inspectorId) || 'N/A'}</td>
                                <td className="px-6 py-4">{insp.inspectionDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[insp.status]}`}>
                                        {insp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {insp.outcome ? (
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${outcomeStyles[insp.outcome]}`}>
                                            {insp.outcome}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-blue-400 hover:text-blue-300">
                                        <PencilIcon />
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default InspectionLog;
