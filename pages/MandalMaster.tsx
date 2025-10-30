import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { Mandal, District } from '../types';
import { mockMandals, mockDistricts } from '../data/mockData';
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

const MandalModal: React.FC<{
    mandal: Partial<Mandal>;
    districts: District[];
    onSave: (mandal: Partial<Mandal>) => void;
    onCancel: () => void;
}> = ({ mandal, districts, onSave, onCancel }) => {
    const [formData, setFormData] = useState(mandal);

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
                <h2 className="text-xl font-bold text-white mb-4">{mandal.id ? 'Edit Mandal' : 'Add New Mandal'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Mandal Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-300">Mandal Code</label>
                            <input type="text" name="code" id="code" value={formData.code || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="districtId" className="block text-sm font-medium text-gray-300">District</label>
                        <select name="districtId" id="districtId" value={formData.districtId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                            <option value="">Select a District</option>
                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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

const MandalMaster: React.FC = () => {
    const [mandals, setMandals] = useState<Mandal[]>(mockMandals);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMandal, setCurrentMandal] = useState<Partial<Mandal> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const districtMap = useMemo(() => new Map(mockDistricts.map(d => [d.id, d.name])), []);

    const handleOpenModal = (mandal?: Mandal) => {
        setCurrentMandal(mandal || { name: '', code: '', status: 'Active', districtId: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMandal(null);
    };

    const handleSaveMandal = (mandalData: Partial<Mandal>) => {
        const now = new Date().toISOString();
        if (mandalData.id) { // Edit
            // FIX: The `status` property from the form data is a generic string. Explicitly casting it to the required 'Active' | 'Inactive' type to ensure type safety.
            setMandals(mandals.map(m => m.id === mandalData.id ? { ...m, ...mandalData, updatedAt: now, status: mandalData.status as Mandal['status'] } : m));
        } else { // Add
            const newMandal: Mandal = {
                id: `MAND${Date.now()}`,
                name: mandalData.name || '',
                districtId: mandalData.districtId || '',
                code: mandalData.code || '',
                status: (mandalData.status as Mandal['status']) || 'Active',
                createdAt: now,
                updatedAt: now,
            };
            setMandals(prev => [...prev, newMandal]);
        }
        handleCloseModal();
    };
    
    const handleToggleStatus = (mandal: Mandal) => {
        const newStatus = mandal.status === 'Active' ? 'Inactive' : 'Active';
        const updatedMandal = { ...mandal, status: newStatus, updatedAt: new Date().toISOString() };
        setMandals(mandals.map(m => m.id === mandal.id ? updatedMandal : m));
    };

    const filteredMandals = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return mandals;
        }
        return mandals.filter(m => {
            const searchableText = [
                m.name,
                m.code,
                districtMap.get(m.districtId)
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [mandals, searchTerm, districtMap]);
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'mandal_master', 'Mandal Master');
        }
    };

    const getDataForExport = () => {
        return filteredMandals.map(mandal => ({
            'Mandal ID': mandal.id,
            'Name': mandal.name,
            'Mandal Code': mandal.code,
            'District': districtMap.get(mandal.districtId) || 'N/A',
            'Status': mandal.status,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Mandals', data: getDataForExport() }], 'mandal_master.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Mandals', data: getDataForExport() }], 'mandal_master');
    };

    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    return (
        <DashboardCard title="Mandal Master" exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentMandal && (
                <MandalModal mandal={currentMandal} districts={mockDistricts} onSave={handleSaveMandal} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search mandals, codes, or districts..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Mandal
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">District</th>
                            <th scope="col" className="px-6 py-3">Mandal</th>
                            <th scope="col" className="px-6 py-3">Mandal Code</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMandals.map((mandal) => (
                            <tr key={mandal.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4"><Highlight text={districtMap.get(mandal.districtId) || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4 text-white font-medium"><Highlight text={mandal.name} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={mandal.code} highlight={searchTerm} /></td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        mandal.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {mandal.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(mandal)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${mandal.name}`}>
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleToggleStatus(mandal)} className={`font-medium ${mandal.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                            {mandal.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default MandalMaster;