import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { HarvestLog, HarvestQualityGrade, Farmer, LandParcel, Employee } from '../types';
import { mockHarvestLogs, mockFarmersData, mockLandParcels, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { ReceiptPercentIcon, PencilIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const qualityGrades: HarvestQualityGrade[] = ['A', 'B', 'C', 'Ungraded'];

const HarvestLogModal: React.FC<{
    log: Partial<HarvestLog>;
    farmers: Farmer[];
    landParcels: LandParcel[];
    users: Employee[];
    onSave: (log: Partial<HarvestLog>) => void;
    onCancel: () => void;
}> = ({ log, farmers, landParcels, users, onSave, onCancel }) => {
    const [formData, setFormData] = useState(log);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['quantityTonnes'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const filteredParcels = useMemo(() => {
        return landParcels.filter(p => p.farmerId === formData.farmerId);
    }, [formData.farmerId, landParcels]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{log.id ? 'Edit Harvest Log' : 'Add New Harvest Log'}</h2>
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
                            <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-300">Harvest Date</label>
                            <input type="date" name="harvestDate" id="harvestDate" value={formData.harvestDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="quantityTonnes" className="block text-sm font-medium text-gray-300">Quantity (Tonnes)</label>
                            <input type="number" step="0.01" name="quantityTonnes" id="quantityTonnes" value={formData.quantityTonnes || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="qualityGrade" className="block text-sm font-medium text-gray-300">Quality Grade</label>
                            <select name="qualityGrade" id="qualityGrade" value={formData.qualityGrade || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="">Select Grade</option>
                                {qualityGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="harvestedById" className="block text-sm font-medium text-gray-300">Harvested By</label>
                            <select name="harvestedById" id="harvestedById" value={formData.harvestedById || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
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


const HarvestLog: React.FC = () => {
    const [logs, setLogs] = useState<HarvestLog[]>(mockHarvestLogs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLog, setCurrentLog] = useState<Partial<HarvestLog> | null>(null);
    const [filterFarmer, setFilterFarmer] = useState<string>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const landParcelMap = useMemo(() => new Map(mockLandParcels.map(p => [p.id, p.surveyNumber])), []);
    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const handleOpenModal = (log?: HarvestLog) => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentLog(log || { harvestDate: today, qualityGrade: 'A' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLog(null);
    };

    const handleSaveLog = (logData: Partial<HarvestLog>) => {
        const now = new Date().toISOString();
        if (logData.id) { // Edit
            setLogs(logs.map(l => l.id === logData.id ? { ...l, ...logData, updatedAt: now } as HarvestLog : l));
        } else { // Add
            const newLog: HarvestLog = {
                id: `HARV${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...logData
            } as HarvestLog;
            setLogs(prev => [newLog, ...prev]);
        }
        handleCloseModal();
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            return filterFarmer === 'All' || log.farmerId === filterFarmer;
        });
    }, [logs, filterFarmer]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'harvest_log', 'Harvest Log');
        }
    };

    const getDataForExport = () => {
        return filteredLogs.map(log => ({
            'Harvest ID': log.id,
            'Farmer': farmerMap.get(log.farmerId) || 'N/A',
            'Survey #': landParcelMap.get(log.landParcelId) || 'N/A',
            'Date': log.harvestDate,
            'Quantity (Tonnes)': log.quantityTonnes,
            'Quality Grade': log.qualityGrade,
            'Harvested By': userMap.get(log.harvestedById) || 'N/A',
            'Notes': log.notes || '',
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Harvest Log', data: getDataForExport() }], 'harvest_log.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Harvest Log', data: getDataForExport() }], 'harvest_log');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Harvest Log" icon={<ReceiptPercentIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentLog && (
                <HarvestLogModal 
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
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Harvest
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Harvest ID</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Survey #</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Quantity (Tonnes)</th>
                            <th scope="col" className="px-6 py-3 text-center">Grade</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{log.id}</td>
                                <td className="px-6 py-4 text-white">{farmerMap.get(log.farmerId) || 'N/A'}</td>
                                <td className="px-6 py-4">{landParcelMap.get(log.landParcelId) || 'N/A'}</td>
                                <td className="px-6 py-4">{log.harvestDate}</td>
                                <td className="px-6 py-4 text-right font-mono">{log.quantityTonnes.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center font-semibold">{log.qualityGrade}</td>
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

export default HarvestLog;
