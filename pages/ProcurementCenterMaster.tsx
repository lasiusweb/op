import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { ProcurementCenter, Employee, Mandal, District } from '../types';
import { mockProcurementCenters, mockEmployees, mockMandals, mockDistricts } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, HomeModernIcon } from '../components/Icons';
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

const ProcurementCenterModal: React.FC<{
    center: Partial<ProcurementCenter>;
    users: Employee[];
    mandals: Mandal[];
    districts: District[];
    onSave: (center: Partial<ProcurementCenter>) => void;
    onCancel: () => void;
}> = ({ center, users, mandals, districts, onSave, onCancel }) => {
    const [formData, setFormData] = useState(center);
    
    const mandalMap = useMemo(() => new Map(mandals.map(m => [m.id, m.districtId])), [mandals]);
    const districtMap = useMemo(() => new Map(districts.map(d => [d.id, d.name])), [districts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumberField = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumberField ? (value ? parseFloat(value) : undefined) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const districtName = formData.mandalId ? districtMap.get(mandalMap.get(formData.mandalId) || '') || '' : '';

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{center.id ? 'Edit Procurement Center' : 'Add New Procurement Center'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Center Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="mandalId" className="block text-sm font-medium text-gray-300">Mandal</label>
                            <select name="mandalId" id="mandalId" value={formData.mandalId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select a Mandal</option>
                                {mandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-300">District (auto-filled)</label>
                            <input type="text" name="district" id="district" value={districtName} readOnly className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="managerId" className="block text-sm font-medium text-gray-300">Manager</label>
                            <select name="managerId" id="managerId" value={formData.managerId || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select a Manager</option>
                                {users.filter(u => u.role.includes('Manager') || u.role.includes('Coordinator')).map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300">Contact Person</label>
                            <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="contactMobile" className="block text-sm font-medium text-gray-300">Contact Mobile</label>
                            <input type="tel" name="contactMobile" id="contactMobile" value={formData.contactMobile || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                            <select name="status" id="status" value={formData.status || 'Active'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Center</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProcurementCenterMaster: React.FC = () => {
    const [centers, setCenters] = useState<ProcurementCenter[]>(mockProcurementCenters);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCenter, setCurrentCenter] = useState<Partial<ProcurementCenter> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);
    const mandalMap = useMemo(() => new Map(mockMandals.map(m => [m.id, { name: m.name, districtId: m.districtId }])), []);
    const districtMap = useMemo(() => new Map(mockDistricts.map(d => [d.id, d.name])), []);

    const handleOpenModal = (center?: ProcurementCenter) => {
        setCurrentCenter(center || { name: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCenter(null);
    };

    const handleSaveCenter = (centerData: Partial<ProcurementCenter>) => {
        const now = new Date().toISOString();
        if (centerData.id) { // Edit
            // FIX: The `status` property from the form data is a generic string. Explicitly casting it to the required 'Active' | 'Inactive' type to ensure type safety.
            setCenters(centers.map(c => c.id === centerData.id ? { ...c, ...centerData, updatedAt: now, status: centerData.status as ProcurementCenter['status'] } : c));
        } else { // Add
            const newCenter: ProcurementCenter = {
                id: `PC${Date.now()}`,
                name: centerData.name || '',
                mandalId: centerData.mandalId || '',
                managerId: centerData.managerId,
                contactPerson: centerData.contactPerson || '',
                contactMobile: centerData.contactMobile || '',
                status: (centerData.status as 'Active' | 'Inactive') || 'Active',
                createdAt: now,
                updatedAt: now,
            };
            setCenters(prev => [...prev, newCenter]);
        }
        handleCloseModal();
    };
    
    const handleToggleStatus = (center: ProcurementCenter) => {
        const newStatus = center.status === 'Active' ? 'Inactive' : 'Active';
        const updatedCenter = { ...center, status: newStatus, updatedAt: new Date().toISOString() };
        setCenters(centers.map(c => c.id === center.id ? updatedCenter : c));
    };

    const filteredCenters = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return centers;
        }
        return centers.filter(c => {
            const mandal = mandalMap.get(c.mandalId);
            const district = mandal ? districtMap.get(mandal.districtId) : '';
            const searchableText = [
                c.name,
                c.contactPerson,
                c.contactMobile,
                mandal?.name,
                district
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [centers, searchTerm, mandalMap, districtMap]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'procurement_centers', 'Procurement Center Master');
        }
    };

    const getDataForExport = () => {
        return filteredCenters.map(center => {
            const mandal = mandalMap.get(center.mandalId);
            const districtName = mandal ? districtMap.get(mandal.districtId) : 'N/A';
            return {
                'Center ID': center.id,
                'Name': center.name,
                'Mandal': mandal?.name || 'N/A',
                'District': districtName,
                'Manager': center.managerId ? userMap.get(center.managerId) : 'N/A',
                'Contact Person': center.contactPerson,
                'Contact Mobile': center.contactMobile,
                'Status': center.status,
            };
        });
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Procurement Centers', data: getDataForExport() }], 'procurement_centers.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Procurement Centers', data: getDataForExport() }], 'procurement_centers');
    };

    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    return (
        <DashboardCard title="Procurement Center Master" icon={<HomeModernIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentCenter && (
                <ProcurementCenterModal center={currentCenter} users={mockEmployees} mandals={mockMandals} districts={mockDistricts} onSave={handleSaveCenter} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search by name, contact, location..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Center
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Center ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Mandal</th>
                            <th scope="col" className="px-6 py-3">District</th>
                            <th scope="col" className="px-6 py-3">Contact Person</th>
                            <th scope="col" className="px-6 py-3">Contact Mobile</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCenters.map((center) => {
                            const mandal = mandalMap.get(center.mandalId);
                            const districtName = mandal ? districtMap.get(mandal.districtId) : 'N/A';
                            return (
                            <tr key={center.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{center.id}</td>
                                <td className="px-6 py-4 text-white"><Highlight text={center.name} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={mandal?.name || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={districtName || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={center.contactPerson} highlight={searchTerm} /></td>
                                <td className="px-6 py-4"><Highlight text={center.contactMobile} highlight={searchTerm} /></td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        center.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {center.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(center)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${center.name}`}>
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleToggleStatus(center)} className={`font-medium ${center.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                            {center.status === 'Active' ? 'Deactivate' : 'Activate'}
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

export default ProcurementCenterMaster;