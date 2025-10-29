import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { CultivationLog, CultivationActivityType, Farmer, LandParcel, Employee } from '../types';
import { mockCultivationLogs, mockFarmersData, mockLandParcels, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { DocumentChartBarIcon, PencilIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const activityTypes: CultivationActivityType[] = ['Planting', 'Fertilizing', 'Pest Control', 'Weeding', 'Pruning', 'Harvesting', 'Soil Testing'];

const CultivationLogModal: React.FC<{
    log: Partial<CultivationLog>;
    farmers: Farmer[];
    landParcels: LandParcel[];
    users: Employee[];
    onSave: (log: Partial<CultivationLog>) => void;
    onCancel: () => void;
}> = ({ log, farmers, landParcels, users, onSave, onCancel }) => {
    const [formData, setFormData] = useState(log);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['quantity', 'cost', 'laborCount'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const filteredParcels = useMemo(() => {
        if (!formData.farmerId) return [];
        return landParcels.filter(p => p.farmerId === formData.farmerId);
    }, [formData.farmerId, landParcels]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{log.id ? 'Edit Cultivation Log' : 'Add New Cultivation Log'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="farmerId" className="block text-sm font-medium text-gray-300">Farmer</label>
                            <select name="farmerId" id="farmerId" value={formData.farmerId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="">Select Farmer</option>
                                {farmers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="landParcelId" className="block text-sm font-medium text-gray-300">Land Parcel (Survey No.)</label>
                            <select name="landParcelId" id="landParcelId" value={formData.landParcelId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" disabled={!formData.farmerId}>
                                <option value="">Select Parcel</option>
                                {filteredParcels.map(p => <option key={p.id} value={p.id}>{p.surveyNumber}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="activityType" className="block text-sm font-medium text-gray-300">Activity Type</label>
                            <select name="activityType" id="activityType" value={formData.activityType || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="">Select Activity</option>
                                {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="activityDate" className="block text-sm font-medium text-gray-300">Activity Date</label>
                            <input type="date" name="activityDate" id="activityDate" value={formData.activityDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="materialsUsed" className="block text-sm font-medium text-gray-300">Materials Used (e.g., Fertilizer Name, Pesticide)</label>
                            <input type="text" name="materialsUsed" id="materialsUsed" value={formData.materialsUsed || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                             <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
                            <input type="number" step="any" name="quantity" id="quantity" value={formData.quantity || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                             <label htmlFor="unit" className="block text-sm font-medium text-gray-300">Unit (e.g., kg, liters)</label>
                            <input type="text" name="unit" id="unit" value={formData.unit || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                         <div>
                             <label htmlFor="cost" className="block text-sm font-medium text-gray-300">Cost (₹)</label>
                            <input type="number" step="any" name="cost" id="cost" value={formData.cost || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                             <label htmlFor="laborCount" className="block text-sm font-medium text-gray-300">Labor Count</label>
                            <input type="number" name="laborCount" id="laborCount" value={formData.laborCount || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="performedById" className="block text-sm font-medium text-gray-300">Performed By</label>
                            <select name="performedById" id="performedById" value={formData.performedById || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="">Select User</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                             <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Log</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CultivationLog: React.FC = () => {
    const [logs, setLogs] = useState<CultivationLog[]>(mockCultivationLogs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLog, setCurrentLog] = useState<Partial<CultivationLog> | null>(null);
    const [filterFarmer, setFilterFarmer] = useState<string>('All');
    const [filterActivity, setFilterActivity] = useState<CultivationActivityType | 'All'>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const landParcelMap = useMemo(() => new Map(mockLandParcels.map(p => [p.id, p.surveyNumber])), []);
    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const handleOpenModal = (log?: CultivationLog) => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentLog(log || { activityDate: today });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLog(null);
    };

    const handleSaveLog = (logData: Partial<CultivationLog>) => {
        const now = new Date().toISOString();
        if (logData.id) { // Edit
            setLogs(logs.map(l => l.id === logData.id ? { ...l, ...logData, updatedAt: now } as CultivationLog : l));
        } else { // Add
            const newLog: CultivationLog = {
                id: `CLOG${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...logData
            } as CultivationLog;
            setLogs(prev => [newLog, ...prev]);
        }
        handleCloseModal();
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const farmerMatch = filterFarmer === 'All' || log.farmerId === filterFarmer;
            const activityMatch = filterActivity === 'All' || log.activityType === filterActivity;
            return farmerMatch && activityMatch;
        });
    }, [logs, filterFarmer, filterActivity]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'cultivation_log', 'Cultivation Activity Log');
        }
    };

    const getDataForExport = () => {
        return filteredLogs.map(log => ({
            'Log ID': log.id,
            'Farmer': farmerMap.get(log.farmerId) || 'N/A',
            'Survey #': landParcelMap.get(log.landParcelId) || 'N/A',
            'Activity': log.activityType,
            'Date': log.activityDate,
            'Materials Used': log.materialsUsed || '',
            'Quantity': log.quantity || '',
            'Unit': log.unit || '',
            'Cost (₹)': log.cost || '',
            'Labor Count': log.laborCount || '',
            'Performed By': userMap.get(log.performedById) || 'N/A',
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Cultivation Log', data: getDataForExport() }], 'cultivation_log.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Cultivation Log', data: getDataForExport() }], 'cultivation_log');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Cultivation Activity Log" icon={<DocumentChartBarIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentLog && (
                <CultivationLogModal 
                    log={currentLog} 
                    farmers={mockFarmersData} 
                    landParcels={mockLandParcels}
                    users={mockEmployees}
                    onSave={handleSaveLog} 
                    onCancel={handleCloseModal} 
                />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div>
                        <label htmlFor="farmer-filter" className="text-sm font-medium text-gray-400 mr-2">Farmer:</label>
                        <select id="farmer-filter" value={filterFarmer} onChange={e => setFilterFarmer(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All Farmers</option>
                           {mockFarmersData.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="activity-filter" className="text-sm font-medium text-gray-400 mr-2">Activity:</label>
                        <select id="activity-filter" value={filterActivity} onChange={e => setFilterActivity(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All Activities</option>
                           {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Log
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Log ID</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Survey #</th>
                            <th scope="col" className="px-6 py-3">Activity</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Performed By</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{log.id}</td>
                                <td className="px-6 py-4 text-white">{farmerMap.get(log.farmerId) || 'N/A'}</td>
                                <td className="px-6 py-4">{landParcelMap.get(log.landParcelId) || 'N/A'}</td>
                                <td className="px-6 py-4">{log.activityType}</td>
                                <td className="px-6 py-4">{log.activityDate}</td>
                                <td className="px-6 py-4">{userMap.get(log.performedById) || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenModal(log)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${log.id}`}>
                                        <PencilIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default CultivationLog;