import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { MicroIrrigationInstallation, IrrigationInstallationStatus, Farmer, LandParcel, Employee, SubsidyApplication } from '../types';
import { mockMicroIrrigationInstallations, mockFarmersData, mockLandParcels, mockEmployees, mockSubsidyApplications } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { WrenchScrewdriverIcon, PencilIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusStyles: { [key in IrrigationInstallationStatus]: string } = {
    'Pending Installation': 'bg-yellow-500/20 text-yellow-300',
    'Installation in Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-purple-500/20 text-purple-300',
    'Pending Inspection': 'bg-orange-500/20 text-orange-300',
    'Verified': 'bg-green-500/20 text-green-300',
};

const MicroIrrigationModal: React.FC<{
    installation: Partial<MicroIrrigationInstallation>;
    farmers: Farmer[];
    landParcels: LandParcel[];
    users: Employee[];
    applications: SubsidyApplication[];
    onSave: (data: Partial<MicroIrrigationInstallation>) => void;
    onCancel: () => void;
}> = ({ installation, farmers, landParcels, users, applications, onSave, onCancel }) => {
    const [formData, setFormData] = useState(installation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['totalCost', 'subsidyAmount'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const filteredParcels = useMemo(() => landParcels.filter(p => p.farmerId === formData.farmerId), [formData.farmerId, landParcels]);
    const filteredApps = useMemo(() => applications.filter(a => a.farmerId === formData.farmerId && a.subsidyType === 'Drip Irrigation'), [formData.farmerId, applications]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl">
                <h2 className="text-xl font-bold text-white mb-4">{installation.id ? 'Edit Installation Record' : 'Add New Installation Record'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-2">Farmer & Location</h3>
                        </div>
                        <select name="farmerId" value={formData.farmerId || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            <option value="">Select Farmer</option>
                            {farmers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                        </select>
                        <select name="landParcelId" value={formData.landParcelId || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" disabled={!formData.farmerId}>
                            <option value="">Select Parcel</option>
                            {filteredParcels.map(p => <option key={p.id} value={p.id}>{p.surveyNumber}</option>)}
                        </select>
                        <select name="subsidyApplicationId" value={formData.subsidyApplicationId || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" disabled={!formData.farmerId}>
                            <option value="">Select Subsidy App ID</option>
                            {filteredApps.map(a => <option key={a.id} value={a.id}>{a.id}</option>)}
                        </select>

                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-2 mt-2">Installation Details</h3>
                        </div>
                        <select name="installationType" value={formData.installationType || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            <option value="Drip">Drip</option>
                            <option value="Sprinkler">Sprinkler</option>
                        </select>
                        <input type="text" name="vendorName" value={formData.vendorName || ''} onChange={handleChange} required placeholder="Vendor Name" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        <input type="date" name="installationDate" value={formData.installationDate || ''} onChange={handleChange} title="Installation Date" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        <input type="number" name="totalCost" value={formData.totalCost || ''} onChange={handleChange} required placeholder="Total Cost (₹)" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        <input type="number" name="subsidyAmount" value={formData.subsidyAmount || ''} onChange={handleChange} required placeholder="Subsidy Amount (₹)" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        
                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-2 mt-2">Verification & Status</h3>
                        </div>
                        <select name="status" value={formData.status || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="inspectedById" value={formData.inspectedById || ''} onChange={handleChange} className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            <option value="">Select Inspector</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                        </select>
                         <input type="date" name="inspectionDate" value={formData.inspectionDate || ''} onChange={handleChange} title="Inspection Date" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        
                        <div className="lg:col-span-3">
                            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} placeholder="Notes..." className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Record</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MicroIrrigationTracker: React.FC = () => {
    const [installations, setInstallations] = useState<MicroIrrigationInstallation[]>(mockMicroIrrigationInstallations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<MicroIrrigationInstallation> | null>(null);
    const [filterStatus, setFilterStatus] = useState<IrrigationInstallationStatus | 'All'>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const handleOpenModal = (item?: MicroIrrigationInstallation) => {
        setCurrent(item || { status: 'Pending Installation' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = (data: Partial<MicroIrrigationInstallation>) => {
        const now = new Date().toISOString();
        if (data.id) { // Edit
            setInstallations(installations.map(i => i.id === data.id ? { ...i, ...data, updatedAt: now } as MicroIrrigationInstallation : i));
        } else { // Add
            const newItem: MicroIrrigationInstallation = {
                id: `MI${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...data
            } as MicroIrrigationInstallation;
            setInstallations(prev => [newItem, ...prev]);
        }
        handleCloseModal();
    };

    const filteredInstallations = useMemo(() => {
        return installations.filter(i => filterStatus === 'All' || i.status === i.status);
    }, [installations, filterStatus]);
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'micro_irrigation_tracker', 'Micro-Irrigation Installation Tracker');
        }
    };

    const getDataForExport = () => {
        return filteredInstallations.map(item => ({
            'ID': item.id,
            'Farmer': farmerMap.get(item.farmerId) || 'N/A',
            'Subsidy App #': item.subsidyApplicationId,
            'Survey #': mockLandParcels.find(p => p.id === item.landParcelId)?.surveyNumber || 'N/A',
            'Type': item.installationType,
            'Vendor': item.vendorName,
            'Installation Date': item.installationDate || 'N/A',
            'Total Cost (₹)': item.totalCost,
            'Subsidy Amount (₹)': item.subsidyAmount,
            'Status': item.status,
            'Inspected By': item.inspectedById ? userMap.get(item.inspectedById) : 'N/A',
            'Inspection Date': item.inspectionDate || 'N/A',
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Micro-Irrigation Installations', data: getDataForExport() }], 'micro_irrigation_installations.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Micro-Irrigation Installations', data: getDataForExport() }], 'micro_irrigation_installations');
    };

    // FIX: Changed exportOptions from an object to an array of objects to match the DashboardCard's expected prop type.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];


    return (
        <DashboardCard title="Micro-Irrigation Installation Tracker" icon={<WrenchScrewdriverIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && current && (
                <MicroIrrigationModal 
                    installation={current}
                    farmers={mockFarmersData}
                    landParcels={mockLandParcels}
                    users={mockEmployees}
                    applications={mockSubsidyApplications}
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-400">Status:</label>
                    <select id="status-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                       <option value="All">All Statuses</option>
                       {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Record
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Subsidy App#</th>
                            <th scope="col" className="px-6 py-3">Vendor</th>
                            <th scope="col" className="px-6 py-3 text-right">Cost (₹)</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstallations.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white">{item.id}</td>
                                <td className="px-6 py-4 text-white">{farmerMap.get(item.farmerId) || 'N/A'}</td>
                                <td className="px-6 py-4 font-mono">{item.subsidyApplicationId}</td>
                                <td className="px-6 py-4">{item.vendorName}</td>
                                <td className="px-6 py-4 text-right font-mono">{item.totalCost.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[item.status]}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenModal(item)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${item.id}`}>
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

export default MicroIrrigationTracker;