import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { Village, Mandal } from '../types';
import { mockVillages, mockMandals, mockDistricts } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const Highlight: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const terms = highlight.trim().split(/\s+/).filter(Boolean).map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  if (terms.length === 0) {
      return <>{text}</>;
  }
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.filter(part => part).map((part, i) =>
        terms.some(term => new RegExp(term, 'i').test(part)) ? (
          <mark key={i} className="bg-teal-500/30 text-white rounded px-1">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const VillageModal: React.FC<{
    village: Partial<Village>;
    mandals: Mandal[];
    onSave: (village: Partial<Village>) => void;
    onCancel: () => void;
}> = ({ village, mandals, onSave, onCancel }) => {
    const [formData, setFormData] = useState(village);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-white mb-4">{village.id ? 'Edit Village' : 'Add New Village'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Village Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-300">Village Code</label>
                            <input type="text" name="code" id="code" value={formData.code || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="mandalId" className="block text-sm font-medium text-gray-300">Mandal</label>
                        <select name="mandalId" id="mandalId" value={formData.mandalId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                            <option value="">Select a Mandal</option>
                            {mandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                        <select name="status" id="status" value={formData.status || 'Active'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
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

const VillageMaster: React.FC = () => {
    const [villages, setVillages] = useState<Village[]>(mockVillages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVillage, setCurrentVillage] = useState<Partial<Village> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const mandalMap = useMemo(() => new Map(mockMandals.map(m => [m.id, { name: m.name, districtId: m.districtId }])), []);
    const districtMap = useMemo(() => new Map(mockDistricts.map(d => [d.id, d.name])), []);

    const handleOpenModal = (village?: Village) => {
        setCurrentVillage(village || { name: '', code: '', status: 'Active', mandalId: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVillage(null);
    };

    const handleSaveVillage = (villageData: Partial<Village>) => {
        const now = new Date().toISOString();
        if (villageData.id) { // Edit
            // FIX: The `status` property from the form data is a generic string. Explicitly casting it to the required 'Active' | 'Inactive' type to ensure type safety.
            setVillages(villages.map(v => v.id === villageData.id ? ({ ...v, ...villageData, updatedAt: now, status: villageData.status as Village['status'] }) : v));
        } else { // Add
            const newVillage: Village = {
                id: `VILL${Date.now()}`,
                name: villageData.name || '',
                mandalId: villageData.mandalId || '',
                code: villageData.code || '',
                status: (villageData.status as Village['status']) || 'Active',
                createdAt: now,
                updatedAt: now,
            };
            setVillages(prev => [...prev, newVillage]);
        }
        handleCloseModal();
    };
    
    const handleToggleStatus = (village: Village) => {
        const newStatus = village.status === 'Active' ? 'Inactive' : 'Active';
        const updatedVillage = { ...village, status: newStatus, updatedAt: new Date().toISOString() };
        setVillages(villages.map(v => v.id === village.id ? updatedVillage : v));
    };

    const filteredVillages = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return villages;
        }
        return villages.filter(v => {
            const mandal = mandalMap.get(v.mandalId);
            const district = mandal ? districtMap.get(mandal.districtId) : '';
            const searchableText = [
                v.name,
                v.code,
                mandal?.name,
                district
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [villages, searchTerm, mandalMap, districtMap]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'village_master', 'Village Master');
        }
    };

    const getDataForExport = () => {
        return filteredVillages.map(village => {
            const mandal = mandalMap.get(village.mandalId);
            const districtName = mandal ? districtMap.get(mandal.districtId) : 'N/A';
            return {
                'Village ID': village.id,
                'Name': village.name,
                'Village Code': village.code,
                'Mandal': mandal?.name || 'N/A',
                'District': districtName,
                'Status': village.status,
            };
        });
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Villages', data: getDataForExport() }], 'village_master.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Villages', data: getDataForExport() }], 'village_master');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="Village Master" exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentVillage && (
                <VillageModal village={currentVillage} mandals={mockMandals} onSave={handleSaveVillage} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search villages, codes, mandals..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Village
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">District</th>
                            <th scope="col" className="px-6 py-3">Mandal</th>
                            <th scope="col" className="px-6 py-3">Village</th>
                            <th scope="col" className="px-6 py-3">Village Code</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVillages.map((village) => {
                            const mandal = mandalMap.get(village.mandalId);
                            const districtName = mandal ? districtMap.get(mandal.districtId) : 'N/A';
                            return (
                            <tr key={village.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4"><Highlight text={districtName || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={mandal?.name || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4 text-white font-medium"><Highlight text={village.name} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={village.code} highlight={searchTerm} /></td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        village.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {village.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(village)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${village.name}`}>
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleToggleStatus(village)} className={`font-medium ${village.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                            {village.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default VillageMaster;