import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { NurseryInventoryItem, NurseryItemType } from '../types';
import { mockNurseryInventory } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, WrenchScrewdriverIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const itemTypes: NurseryItemType[] = ['Seedling', 'Fertilizer', 'Pesticide', 'Tool'];

const NurseryInventoryModal: React.FC<{
    item: Partial<NurseryInventoryItem>;
    onSave: (item: Partial<NurseryInventoryItem>) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['quantity', 'costPerUnit'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{item.id ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Item Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Item Type</label>
                            <select name="type" id="type" value={formData.type || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="">Select Type</option>
                                {itemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
                            <input type="number" name="quantity" id="quantity" value={formData.quantity || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-300">Unit (e.g., units, kg, liters)</label>
                            <input type="text" name="unit" id="unit" value={formData.unit || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-300">Supplier</label>
                            <input type="text" name="supplier" id="supplier" value={formData.supplier || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-300">Cost per Unit (₹)</label>
                            <input type="number" step="0.01" name="costPerUnit" id="costPerUnit" value={formData.costPerUnit || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-300">Purchase Date</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" value={formData.purchaseDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NurseryInventory: React.FC = () => {
    const [inventory, setInventory] = useState<NurseryInventoryItem[]>(mockNurseryInventory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<NurseryInventoryItem> | null>(null);
    const [filterType, setFilterType] = useState<NurseryItemType | 'All'>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const handleOpenModal = (item?: NurseryInventoryItem) => {
        setCurrentItem(item || { type: 'Seedling', purchaseDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveItem = (itemData: Partial<NurseryInventoryItem>) => {
        const now = new Date().toISOString();
        if (itemData.id) { // Edit
            setInventory(inventory.map(i => i.id === itemData.id ? { ...i, ...itemData, updatedAt: now } as NurseryInventoryItem : i));
        } else { // Add
            const newItem: NurseryInventoryItem = {
                id: `NINV${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...itemData
            } as NurseryInventoryItem;
            setInventory(prev => [newItem, ...prev]);
        }
        handleCloseModal();
    };

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => filterType === 'All' || item.type === filterType);
    }, [inventory, filterType]);
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'nursery_inventory', 'Nursery Inventory');
        }
    };

    const getDataForExport = () => {
        return filteredInventory.map(item => ({
            'Item Name': item.name,
            'Type': item.type,
            'Quantity': item.quantity,
            'Unit': item.unit,
            'Supplier': item.supplier,
            'Cost per Unit (₹)': item.costPerUnit,
            'Total Cost (₹)': item.quantity * item.costPerUnit,
            'Purchase Date': item.purchaseDate,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Nursery Inventory', data: getDataForExport() }], 'nursery_inventory.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Nursery Inventory', data: getDataForExport() }], 'nursery_inventory');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Nursery Inventory" icon={<WrenchScrewdriverIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentItem && (
                <NurseryInventoryModal item={currentItem} onSave={handleSaveItem} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <label htmlFor="type-filter" className="text-sm font-medium text-gray-400 mr-2">Filter by Type:</label>
                    <select id="type-filter" value={filterType} onChange={e => setFilterType(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                       <option value="All">All Types</option>
                       {itemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Item
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item Name</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                            <th scope="col" className="px-6 py-3">Supplier</th>
                            <th scope="col" className="px-6 py-3 text-right">Total Cost (₹)</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4 text-right font-mono">{item.quantity.toLocaleString()} {item.unit}</td>
                                <td className="px-6 py-4">{item.supplier}</td>
                                <td className="px-6 py-4 text-right font-mono">{(item.quantity * item.costPerUnit).toLocaleString('en-IN')}</td>
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

export default NurseryInventory;