import React, { useState, useMemo, FormEvent, useRef } from 'react';
// FIX: Replaced User with Employee and mockUsers with mockEmployees
import type { ProcurementCenter, Employee, Mandal, District } from '../types';
import { mockProcurementCenters, mockEmployees, mockMandals, mockDistricts } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
// FIX: Replace missing `BuildingStorefrontIcon` with `HomeModernIcon`.
import { PencilIcon, HomeModernIcon, MapIcon, TableCellsIcon, UserIcon, PhoneIcon } from '../components/Icons';
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
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl">
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
                        <div>
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-300">Latitude</label>
                            <input type="number" step="any" name="latitude" id="latitude" value={formData.latitude ?? ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-300">Longitude</label>
                            <input type="number" step="any" name="longitude" id="longitude" value={formData.longitude ?? ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
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
    const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
    const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
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
            // FIX: Cast the updated center object to the `ProcurementCenter` type to resolve TypeScript error.
            setCenters(centers.map(c => c.id === centerData.id ? { ...c, ...centerData, updatedAt: now } as ProcurementCenter : c));
        } else { // Add
            const newCenter: ProcurementCenter = {
                id: `PC${Date.now()}`,
                name: centerData.name || '',
                mandalId: centerData.mandalId || '',
                managerId: centerData.managerId,
                contactPerson: centerData.contactPerson || '',
                contactMobile: centerData.contactMobile || '',
                status: (centerData.status as 'Active' | 'Inactive') || 'Active',
                latitude: centerData.latitude,
                longitude: centerData.longitude,
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
                mandal?.name,
                district,
                c.managerId ? userMap.get(c.managerId) : ''
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [centers, searchTerm, mandalMap, districtMap, userMap]);

    const selectedCenter = useMemo(() => {
        return centers.find(c => c.id === selectedCenterId);
    }, [centers, selectedCenterId]);
    
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

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'procurement_centers', 'Procurement Center Master');
        }
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Procurement Centers', data: getDataForExport() }], 'procurement_centers.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Procurement Centers', data: getDataForExport() }], 'procurement_centers');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    const TableView = () => (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">Center Name</th>
                        <th scope="col" className="px-6 py-3">Mandal</th>
                        <th scope="col" className="px-6 py-3">District</th>
                        <th scope="col" className="px-6 py-3">Manager</th>
                        <th scope="col" className="px-6 py-3">Contact</th>
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
                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap"><Highlight text={center.name} highlight={searchTerm} /></td>
                            <td className="px-6 py-4"><Highlight text={mandal?.name || 'N/A'} highlight={searchTerm} /></td>
                            <td className="px-6 py-4"><Highlight text={districtName || 'N/A'} highlight={searchTerm} /></td>
                            <td className="px-6 py-4">{center.managerId ? <Highlight text={userMap.get(center.managerId) || ''} highlight={searchTerm} /> : <span className="text-gray-500">N/A</span>}</td>
                            <td className="px-6 py-4">
                                <div><Highlight text={center.contactPerson} highlight={searchTerm} /></div>
                                <div className="text-gray-500">{center.contactMobile}</div>
                            </td>
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
    );

    const MapView = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{minHeight: '600px'}}>
            <div className="md:col-span-1 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-y-auto max-h-[70vh]">
                 <ul className="divide-y divide-gray-700/50">
                    {filteredCenters.map(center => (
                        <li key={center.id}>
                            <button 
                                onClick={() => setSelectedCenterId(center.id)}
                                className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors ${selectedCenterId === center.id ? 'bg-teal-500/20' : ''}`}
                            >
                                <p className="font-semibold text-white">{center.name}</p>
                                <p className="text-sm text-gray-400">{mandalMap.get(center.mandalId)?.name}, {districtMap.get(mandalMap.get(center.mandalId)?.districtId || '')}</p>
                                {(!center.latitude || !center.longitude) && <p className="text-xs text-yellow-500 mt-1">GPS data not available</p>}
                            </button>
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="md:col-span-2 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-center relative">
                {selectedCenter && selectedCenter.latitude && selectedCenter.longitude ? (
                    <iframe
                        key={selectedCenter.id}
                        width="100%"
                        height="100%"
                        className="rounded-lg"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${selectedCenter.latitude},${selectedCenter.longitude}&hl=en&z=14&output=embed`}>
                    </iframe>
                ) : (
                    <div className="text-center text-gray-500 p-8">
                        <MapIcon className="h-16 w-16 mx-auto mb-4 text-gray-600"/>
                        <p className="font-semibold">Select a center to view its location</p>
                        <p className="text-sm mt-1">If a location is selected, it may not have GPS coordinates assigned.</p>
                    </div>
                )}
                {selectedCenter && (
                    <div 
                        className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50 shadow-lg w-full max-w-xs transition-opacity duration-300 ease-in-out"
                        style={{ opacity: selectedCenter ? 1 : 0 }}
                    >
                        <h3 className="font-bold text-lg text-white mb-3 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <HomeModernIcon className="h-5 w-5"/> 
                            {selectedCenter.name}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-gray-400">Manager</p>
                                    <p className="font-semibold text-gray-200">{selectedCenter.managerId ? userMap.get(selectedCenter.managerId) : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-gray-400">Contact Person</p>
                                    <p className="font-semibold text-gray-200">{selectedCenter.contactPerson}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-gray-400">Contact Mobile</p>
                                    <p className="font-semibold text-gray-200">{selectedCenter.contactMobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <DashboardCard title="Procurement Center Master" icon={<HomeModernIcon />} exportOptions={exportOptions}>
            {isModalOpen && currentCenter && (
                <ProcurementCenterModal center={currentCenter} users={mockEmployees} mandals={mockMandals} districts={mockDistricts} onSave={handleSaveCenter} onCancel={handleCloseModal} />
            )}
            <div ref={contentRef}>
                <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                    <input 
                        type="text" 
                        placeholder="Search by name, contact, location..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-md bg-gray-800 border border-gray-700 p-1">
                            <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                               <TableCellsIcon /> Table
                            </button>
                            <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                               <MapIcon /> Map
                            </button>
                        </div>
                        <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Add New Center
                        </button>
                    </div>
                </div>

                {viewMode === 'table' ? <TableView /> : <MapView />}
            </div>
        </DashboardCard>
    );
};

export default ProcurementCenterMaster;
