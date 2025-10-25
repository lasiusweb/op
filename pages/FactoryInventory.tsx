import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { FactoryInventoryItem, FactoryItemType, Factory } from '../types';
import { mockFactoryInventory, mockFactories } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, BuildingOfficeIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const itemTypes: FactoryItemType[] = ['Raw FFB', 'Crude Palm Oil', 'Palm Kernel', 'Consumable'];

const FactoryInventoryModal: React.FC<{
    item: Partial<FactoryInventoryItem>;
    factories: Factory[];
    onSave: (item: Partial<FactoryInventoryItem>) => void;
    onCancel: () => void;
}> = ({ item, factories, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['quantity'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{item.id ? 'Edit Factory Stock' : 'Add New Factory Stock'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="factoryId" value={formData.factoryId || ''} onChange={handleChange} required className="md:col-span-2 bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option value="">Select Factory</option>
                            {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required placeholder="Item Name" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        <select name="type" value={formData.type || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option value="">Select Type</option>
                            {itemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="number" name="quantity" value={formData.quantity || ''} onChange={handleChange} required placeholder="Quantity" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        <select name="unit" value={formData.unit || 'Tonnes'} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option>Tonnes</option> <option>Litres</option> <option>Units</option>
                        </select>
                        <select name="qualityGrade" value={formData.qualityGrade || ''} onChange={handleChange} className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                            <option value="">N/A</option> <option>A</option> <option>B</option> <option>C</option>
                        </select>
                        <input type="text" name="storageLocation" value={formData.storageLocation || ''} onChange={handleChange} required placeholder="Storage Location (e.g., Tank A)" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                         <div className="md:col-span-2">
                            <label htmlFor="receivedDate" className="block text-sm font-medium text-gray-400">Received/Production Date</label>
                            <input type="date" name="receivedDate" id="receivedDate" value={formData.receivedDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
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

const FactoryInventory: React.FC = () => {
    const [inventory, setInventory] = useState<FactoryInventoryItem[]>(mockFactoryInventory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<FactoryInventoryItem> | null>(null);
    const [filterFactory, setFilterFactory] = useState<string>('All');
    const contentRef = useRef<HTMLDivElement>(null);

    const factoryMap = useMemo(() => new Map(mockFactories.map(f => [f.id, f.name])), []);

    const handleOpenModal = (item?: FactoryInventoryItem) => {
        setCurrentItem(item || { receivedDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveItem = (itemData: Partial<FactoryInventoryItem>) => {
        const now = new Date().toISOString();
        if (itemData.id) {
            setInventory(inventory.map(i => i.id === itemData.id ? { ...i, ...itemData, updatedAt: now } as FactoryInventoryItem : i));
        } else {
            const newItem: FactoryInventoryItem = {
                id: `FINV${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...itemData
            } as FactoryInventoryItem;
            setInventory(prev => [newItem, ...prev]);
        }
        handleCloseModal();
    };

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => filterFactory === 'All' || item.factoryId === filterFactory);
    }, [inventory, filterFactory]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'factory_inventory', 'Factory Inventory');
        }
    };

    const getDataForExport = () => {
        return filteredInventory.map(item => ({
            'Item': item.name,
            'Factory': factoryMap.get(item.factoryId),
            'Type': item.type,
            'Quantity': item.quantity,
            'Unit': item.unit,
            'Storage Location': item.storageLocation,
            'Received Date': item.receivedDate,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Factory Inventory', data: getDataForExport() }], 'factory_inventory.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Factory Inventory', data: getDataForExport() }], 'factory_inventory');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Factory Inventory" icon={<BuildingOfficeIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentItem && (
                <FactoryInventoryModal item={currentItem} factories={mockFactories} onSave={handleSaveItem} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <label htmlFor="factory-filter" className="text-sm font-medium text-gray-400 mr-2">Filter by Factory:</label>
                    <select id="factory-filter" value={filterFactory} onChange={e => setFilterFactory(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                       <option value="All">All Factories</option>
                       {mockFactories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add Stock
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Factory</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                            <th scope="col" className="px-6 py-3">Storage Location</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                <td className="px-6 py-4">{factoryMap.get(item.factoryId)}</td>
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4 text-right font-mono">{item.quantity.toLocaleString()} {item.unit}</td>
                                <td className="px-6 py-4">{item.storageLocation}</td>
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

export default FactoryInventory;