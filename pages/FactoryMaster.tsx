import React, { useState, useMemo, FormEvent } from 'react';
import type { Factory, User, Mandal, District } from '../types';
import { mockFactories, mockUsers, mockMandals, mockDistricts } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, BuildingOfficeIcon } from '../components/Icons';

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

const FactoryModal: React.FC<{
    factory: Partial<Factory>;
    users: User[];
    mandals: Mandal[];
    districts: District[];
    onSave: (factory: Partial<Factory>) => void;
    onCancel: () => void;
}> = ({ factory, users, mandals, districts, onSave, onCancel }) => {
    const [formData, setFormData] = useState(factory);
    
    const mandalMap = useMemo(() => new Map(mandals.map(m => [m.id, m.districtId])), [mandals]);
    const districtMap = useMemo(() => new Map(districts.map(d => [d.id, d.name])), [districts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['latitude', 'longitude', 'capacityTonsPerDay'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const districtName = formData.mandalId ? districtMap.get(mandalMap.get(formData.mandalId) || '') || '' : '';

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl">
                <h2 className="text-xl font-bold text-white mb-4">{factory.id ? 'Edit Factory' : 'Add New Factory'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Factory Name</label>
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
                                {users.filter(u => u.role.includes('Manager')).map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="capacityTonsPerDay" className="block text-sm font-medium text-gray-300">Capacity (Tons/Day)</label>
                            <input type="number" name="capacityTonsPerDay" id="capacityTonsPerDay" value={formData.capacityTonsPerDay || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="contactMobile" className="block text-sm font-medium text-gray-300">Contact Mobile</label>
                            <input type="tel" name="contactMobile" id="contactMobile" value={formData.contactMobile || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-300">Latitude</label>
                            <input type="number" step="any" name="latitude" id="latitude" value={formData.latitude || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-300">Longitude</label>
                            <input type="number" step="any" name="longitude" id="longitude" value={formData.longitude || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
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
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Factory</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FactoryMaster: React.FC = () => {
    const [factories, setFactories] = useState<Factory[]>(mockFactories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFactory, setCurrentFactory] = useState<Partial<Factory> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const userMap = useMemo(() => new Map(mockUsers.map(u => [u.id, u.fullName])), []);
    const mandalMap = useMemo(() => new Map(mockMandals.map(m => [m.id, { name: m.name, districtId: m.districtId }])), []);
    const districtMap = useMemo(() => new Map(mockDistricts.map(d => [d.id, d.name])), []);

    const handleOpenModal = (factory?: Factory) => {
        setCurrentFactory(factory || { name: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentFactory(null);
    };

    const handleSaveFactory = (factoryData: Partial<Factory>) => {
        const now = new Date().toISOString();
        if (factoryData.id) { // Edit
            setFactories(factories.map(c => c.id === factoryData.id ? { ...c, ...factoryData, status: factoryData.status as 'Active' | 'Inactive', updatedAt: now } : c));
        } else { // Add
            const newFactory: Factory = {
                id: `FACT${Date.now()}`,
                name: factoryData.name || '',
                mandalId: factoryData.mandalId || '',
                managerId: factoryData.managerId,
                capacityTonsPerDay: factoryData.capacityTonsPerDay || 0,
                contactMobile: factoryData.contactMobile || '',
                status: (factoryData.status as 'Active' | 'Inactive') || 'Active',
                latitude: factoryData.latitude,
                longitude: factoryData.longitude,
                createdAt: now,
                updatedAt: now,
            };
            setFactories(prev => [...prev, newFactory]);
        }
        handleCloseModal();
    };
    
    const handleToggleStatus = (factory: Factory) => {
        const newStatus = factory.status === 'Active' ? 'Inactive' : 'Active';
        const updatedFactory = { ...factory, status: newStatus, updatedAt: new Date().toISOString() };
        setFactories(factories.map(c => c.id === factory.id ? updatedFactory : c));
    };

    const filteredFactories = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return factories;
        }
        return factories.filter(c => {
            const mandal = mandalMap.get(c.mandalId);
            const district = mandal ? districtMap.get(mandal.districtId) : '';
            const searchableText = [
                c.name,
                mandal?.name,
                district,
                c.managerId ? userMap.get(c.managerId) : ''
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [factories, searchTerm, mandalMap, districtMap, userMap]);


    return (
        <DashboardCard title="Factory Master" icon={<BuildingOfficeIcon />}>
            {isModalOpen && currentFactory && (
                <FactoryModal factory={currentFactory} users={mockUsers} mandals={mockMandals} districts={mockDistricts} onSave={handleSaveFactory} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search by name, location..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Factory
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">Factory Name</th>
                        <th scope="col" className="px-6 py-3">Mandal</th>
                        <th scope="col" className="px-6 py-3">District</th>
                        <th scope="col" className="px-6 py-3">Manager</th>
                        <th scope="col" className="px-6 py-3 text-right">Capacity (Tons/Day)</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFactories.map((factory) => {
                        const mandal = mandalMap.get(factory.mandalId);
                        const districtName = mandal ? districtMap.get(mandal.districtId) : 'N/A';
                        return (
                        <tr key={factory.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap"><Highlight text={factory.name} highlight={searchTerm} /></td>
                            <td className="px-6 py-4"><Highlight text={mandal?.name || 'N/A'} highlight={searchTerm} /></td>
                            <td className="px-6 py-4"><Highlight text={districtName || 'N/A'} highlight={searchTerm} /></td>
                            <td className="px-6 py-4">{factory.managerId ? <Highlight text={userMap.get(factory.managerId) || ''} highlight={searchTerm} /> : <span className="text-gray-500">N/A</span>}</td>
                            <td className="px-6 py-4 text-right font-mono">{factory.capacityTonsPerDay.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    factory.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}>
                                    {factory.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleOpenModal(factory)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${factory.name}`}>
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => handleToggleStatus(factory)} className={`font-medium ${factory.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                        {factory.status === 'Active' ? 'Deactivate' : 'Activate'}
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

export default FactoryMaster;
