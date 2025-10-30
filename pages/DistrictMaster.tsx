import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { District } from '../types';
import { mockDistricts } from '../data/mockData';
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

const DistrictModal: React.FC<{
    district: Partial<District>;
    onSave: (district: Partial<District>) => void;
    onCancel: () => void;
}> = ({ district, onSave, onCancel }) => {
    const [formData, setFormData] = useState(district);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumberField = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumberField ? (value ? parseInt(value, 10) : undefined) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-white mb-4">{district.id ? 'Edit District' : 'Add New District'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">District Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-300">District Code</label>
                            <input type="number" name="code" id="code" value={formData.code ?? ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
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

const DistrictMaster: React.FC = () => {
    const [districts, setDistricts] = useState<District[]>(mockDistricts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState<Partial<District> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const handleOpenModal = (district?: District) => {
        setCurrentDistrict(district || { name: '', status: 'Active', code: undefined });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDistrict(null);
    };

    const handleSaveDistrict = (districtData: Partial<District>) => {
        const now = new Date().toISOString();
        if (districtData.id) { // Edit
            // FIX: The `status` property was being inferred as a generic `string` from the form, causing a type mismatch. It's now explicitly cast to the correct `'Active' | 'Inactive'` type.
            setDistricts(districts.map(d => d.id === districtData.id ? ({ ...d, ...districtData, status: districtData.status as 'Active' | 'Inactive', updatedAt: now }) : d));
        } else { // Add
            const newDistrict: District = {
                id: `DIST${Date.now()}`,
                name: districtData.name || '',
                code: districtData.code!,
                status: (districtData.status as District['status']) || 'Active',
                createdAt: now,
                updatedAt: now,
            };
            setDistricts(prev => [...prev, newDistrict]);
        }
        handleCloseModal();
    };
    
    const handleToggleStatus = (district: District) => {
        const newStatus = district.status === 'Active' ? 'Inactive' : 'Active';
        const updatedDistrict = { ...district, status: newStatus, updatedAt: new Date().toISOString() };
        setDistricts(districts.map(d => d.id === district.id ? updatedDistrict : d));
    };

    const filteredDistricts = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return districts;
        }
        return districts.filter(d => {
            const searchableText = `${d.name.toLowerCase()} ${d.code}`;
            return searchWords.every(word => searchableText.includes(word));
        });
    }, [districts, searchTerm]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'district_master', 'District Master');
        }
    };

    const getDataForExport = () => {
        return filteredDistricts.map(d => ({
            'District ID': d.id,
            'Name': d.name,
            'District Code': d.code,
            'Status': d.status,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Districts', data: getDataForExport() }], 'district_master.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Districts', data: getDataForExport() }], 'district_master');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    return (
        <DashboardCard title="District Master" exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentDistrict && (
                <DistrictModal district={currentDistrict} onSave={handleSaveDistrict} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search districts by name or code..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New District
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">District ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Dist Code</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDistricts.map((district) => (
                            <tr key={district.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{district.id}</td>
                                <td className="px-6 py-4 text-white"><Highlight text={district.name} highlight={searchTerm} /></td>
                                <td className="px-6 py-4">{district.code}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        district.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {district.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(district)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${district.name}`}>
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleToggleStatus(district)} className={`font-medium ${district.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                            {district.status === 'Active' ? 'Deactivate' : 'Activate'}
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

export default DistrictMaster;