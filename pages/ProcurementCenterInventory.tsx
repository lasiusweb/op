import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { ProcurementCenterInventory, PCInventoryStatus, ProcurementCenter } from '../types';
import { mockProcurementCenterInventory, mockProcurementCenters } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, BuildingStorefrontIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusTypes: PCInventoryStatus[] = ['Awaiting Transport', 'In Transit', 'Received at Factory'];

const PCInventoryModal: React.FC<{
    item: Partial<ProcurementCenterInventory>;
    centers: ProcurementCenter[];
    onSave: (item: Partial<ProcurementCenterInventory>) => void;
    onCancel: () => void;
}> = ({ item, centers, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['quantityTonnes'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-white mb-4">{item.id ? 'Edit PC Inventory' : 'Add New PC Inventory'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="procurementCenterId" className="block text-sm font-medium text-gray-300">Procurement Center</label>
                        <select name="procurementCenterId" id="procurementCenterId" value={formData.procurementCenterId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option value="">Select Center</option>
                            {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantityTonnes" className="block text-sm font-medium text-gray-300">Quantity (Tonnes)</label>
                        <input type="number" step="0.01" name="quantityTonnes" id="quantityTonnes" value={formData.quantityTonnes || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="averageQualityGrade" className="block text-sm font-medium text-gray-300">Average Quality</label>
                        <select name="averageQualityGrade" id="averageQualityGrade" value={formData.averageQualityGrade || 'B'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                        <select name="status" id="status" value={formData.status || 'Awaiting Transport'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            {statusTypes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProcurementCenterInventory: React.FC = () => {
    const [inventory, setInventory] = useState<ProcurementCenterInventory[]>(mockProcurementCenterInventory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<ProcurementCenterInventory> | null>(null);
    const [filterCenter, setFilterCenter] = useState<string>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const centerMap = useMemo(() => new Map(mockProcurementCenters.map(c => [c.id, c.name])), []);

    const handleOpenModal = (item?: ProcurementCenterInventory) => {
        setCurrentItem(item || { status: 'Awaiting Transport', averageQualityGrade: 'B' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveItem = (itemData: Partial<ProcurementCenterInventory>) => {
        const now = new Date().toISOString();
        if (itemData.id) { // Edit
            setInventory(inventory.map(i => i.id === itemData.id ? { ...i, ...itemData, lastUpdated: now, updatedAt: now } as ProcurementCenterInventory : i));
        } else { // Add
            const newItem: ProcurementCenterInventory = {
                id: `PCINV${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                lastUpdated: now,
                ...itemData
            } as ProcurementCenterInventory;
            setInventory(prev => [newItem, ...prev]);
        }
        handleCloseModal();
    };

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => filterCenter === 'All' || item.procurementCenterId === filterCenter);
    }, [inventory, filterCenter]);
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'pc_inventory', 'Procurement Center Inventory');
        }
    };

    const getDataForExport = () => {
        return filteredInventory.map(item => ({
          'Center Name': centerMap.get(item.procurementCenterId),
          'Quantity (Tonnes)': item.quantityTonnes,
          'Average Quality': item.averageQualityGrade,
          'Status': item.status,
          'Last Updated': new Date(item.lastUpdated).toLocaleString(),
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Procurement Center Inventory', data: getDataForExport() }], 'pc_inventory.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Procurement Center Inventory', data: getDataForExport() }], 'pc_inventory');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Procurement Center Inventory" icon={<BuildingStorefrontIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentItem && (
                <PCInventoryModal item={currentItem} centers={mockProcurementCenters} onSave={handleSaveItem} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <label htmlFor="center-filter" className="text-sm font-medium text-gray-400 mr-2">Filter by Center:</label>
                    <select id="center-filter" value={filterCenter} onChange={e => setFilterCenter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                       <option value="All">All Centers</option>
                       {mockProcurementCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add Inventory Record
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Center Name</th>
                            <th scope="col" className="px-6 py-3 text-right">Quantity (Tonnes)</th>
                            <th scope="col" className="px-6 py-3 text-center">Avg. Quality</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Last Updated</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white">{centerMap.get(item.procurementCenterId)}</td>
                                <td className="px-6 py-4 text-right font-mono">{item.quantityTonnes.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center font-semibold">{item.averageQualityGrade}</td>
                                <td className="px-6 py-4">{item.status}</td>
                                <td className="px-6 py-4">{new Date(item.lastUpdated).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenModal(item)} className="font-medium text-blue-400 hover:text-blue-300">
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

export default ProcurementCenterInventory;