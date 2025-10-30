import React, { useState, useMemo, FormEvent, useRef } from 'react';
// FIX: Replaced User with Employee and mockUsers with mockEmployees
import type { Location, Employee, Mandal, District } from '../types';
import { mockLocations, mockEmployees, mockMandals, mockDistricts } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
// FIX: Revert placeholder icon and use the newly added `BuildingOfficeIcon`.
import { PencilIcon, BuildingOfficeIcon, MapIcon, TableCellsIcon } from '../components/Icons';
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

const LocationModal: React.FC<{
    location: Partial<Location>;
    users: Employee[];
    mandals: Mandal[];
    districts: District[];
    onSave: (location: Partial<Location>) => void;
    onCancel: () => void;
}> = ({ location, users, mandals, districts, onSave, onCancel }) => {
    const [formData, setFormData] = useState(location);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const mandalMap = useMemo(() => new Map(mockMandals.map(m => [m.id, m])), []);
    const districtMap = useMemo(() => new Map(mockDistricts.map(d => [d.id, d])), []);

    const handleMandalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mandalId = e.target.value;
        const mandal = mandalMap.get(mandalId);
        const district = mandal ? districtMap.get(mandal.districtId) : undefined;
        setFormData(prev => ({ 
            ...prev, 
            mandal: mandal ? mandal.name : '', 
            district: district ? district.name : ''
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{location.id ? 'Edit Location' : 'Add New Location'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Location Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Location Type</label>
                            <select name="type" id="type" value={formData.type || 'Procurement Center'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="Procurement Center">Procurement Center</option>
                                <option value="Factory">Factory</option>
                                <option value="Warehouse">Warehouse</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="mandal" className="block text-sm font-medium text-gray-300">Mandal</label>
                            <select name="mandal" id="mandal" value={formData.mandal} onChange={handleMandalChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select a Mandal</option>
                                {mandals.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-300">District (auto-filled)</label>
                            <input type="text" name="district" id="district" value={formData.district || ''} readOnly className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="managerId" className="block text-sm font-medium text-gray-300">Manager</label>
                            <select name="managerId" id="managerId" value={formData.managerId || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select a Manager</option>
                                {users.filter(u => u.role.includes('Manager') || u.role.includes('Coordinator')).map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                            </select>
                        </div>
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

const LocationMaster: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>(mockLocations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Partial<Location> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<Location['type'] | 'All'>('All');
    const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const userMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);

    const handleOpenModal = (location?: Location) => {
        setCurrentLocation(location || { type: 'Procurement Center' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLocation(null);
    };

    const handleSaveLocation = (locationData: Partial<Location>) => {
        const now = new Date().toISOString();
        if (locationData.id) { // Edit
            setLocations(locations.map(l => l.id === locationData.id ? { ...l, ...locationData, updatedAt: now } as Location : l));
        } else { // Add
            const newLocation: Location = {
                id: `LOC${Date.now()}`,
                name: locationData.name || '',
                type: locationData.type || 'Procurement Center',
                mandal: locationData.mandal || '',
                district: locationData.district || '',
                latitude: locationData.latitude || 0,
                longitude: locationData.longitude || 0,
                managerId: locationData.managerId,
                createdAt: now,
                updatedAt: now,
            };
            setLocations(prev => [...prev, newLocation]);
        }
        handleCloseModal();
    };

    const filteredLocations = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        
        return locations.filter(l => {
            const typeMatch = filterType === 'All' || l.type === filterType;
            if (searchWords.length === 0) {
                return typeMatch;
            }

            const searchableText = [
                l.name,
                l.mandal,
                l.district,
                l.managerId ? userMap.get(l.managerId) : ''
            ].filter(Boolean).join(' ').toLowerCase();

            const searchMatch = searchWords.every(word => searchableText.includes(word));

            return typeMatch && searchMatch;
        });
    }, [locations, searchTerm, filterType, userMap]);
    
    const selectedLocation = useMemo(() => {
        return locations.find(l => l.id === selectedLocationId);
    }, [locations, selectedLocationId]);
    
    const getDataForExport = () => {
        return filteredLocations.map(location => ({
            'Location ID': location.id,
            'Name': location.name,
            'Type': location.type,
            'Mandal': location.mandal,
            'District': location.district,
            'Manager': location.managerId ? userMap.get(location.managerId) : 'N/A',
        }));
    };

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'location_master', 'Location Master');
        }
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Locations', data: getDataForExport() }], 'location_master.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Locations', data: getDataForExport() }], 'location_master');
    };

    // FIX: exportOptions was an object, but DashboardCard expects an array of ExportAction objects.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    const TableView = () => (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Mandal</th>
                        <th scope="col" className="px-6 py-3">District</th>
                        <th scope="col" className="px-6 py-3">Manager</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLocations.map((location) => (
                        <tr key={location.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap"><Highlight text={location.name} highlight={searchTerm} /></td>
                            <td className="px-6 py-4">{location.type}</td>
                            <td className="px-6 py-4"><Highlight text={location.mandal} highlight={searchTerm} /></td>
                            <td className="px-6 py-4"><Highlight text={location.district} highlight={searchTerm} /></td>
                            <td className="px-6 py-4">{location.managerId ? <Highlight text={userMap.get(location.managerId) || ''} highlight={searchTerm} /> : <span className="text-gray-500">N/A</span>}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleOpenModal(location)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${location.name}`}>
                                    <PencilIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

     const MapView = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{minHeight: '600px'}}>
            <div className="md:col-span-1 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-y-auto max-h-[70vh]">
                 <ul className="divide-y divide-gray-700/50">
                    {filteredLocations.map(loc => (
                        <li key={loc.id}>
                            <button 
                                onClick={() => setSelectedLocationId(loc.id)}
                                className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors ${selectedLocationId === loc.id ? 'bg-teal-500/20' : ''}`}
                            >
                                <p className="font-semibold text-white">{loc.name}</p>
                                <p className="text-sm text-gray-400">{loc.mandal}, {loc.district}</p>
                                <p className={`text-xs mt-1 font-bold ${loc.type === 'Factory' ? 'text-rose-400' : loc.type === 'Warehouse' ? 'text-amber-400' : 'text-sky-400'}`}>{loc.type}</p>
                                {(!loc.latitude || !loc.longitude) && <p className="text-xs text-yellow-500 mt-1">GPS data not available</p>}
                            </button>
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="md:col-span-2 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
                {selectedLocation && selectedLocation.latitude && selectedLocation.longitude ? (
                    <iframe
                        key={selectedLocation.id}
                        width="100%"
                        height="100%"
                        className="rounded-lg"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&hl=en&z=14&output=embed`}>
                    </iframe>
                ) : (
                    <div className="text-center text-gray-500 p-8">
                        <MapIcon className="h-16 w-16 mx-auto mb-4 text-gray-600"/>
                        <p className="font-semibold">Select a location to view it on the map</p>
                        <p className="text-sm mt-1">If a location is selected, it may not have GPS coordinates assigned.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <DashboardCard title="Location Master (Procurement Centers, Factories, etc.)" icon={<BuildingOfficeIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentLocation && (
                <LocationModal location={currentLocation} users={mockEmployees} mandals={mockMandals} districts={mockDistricts} onSave={handleSaveLocation} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="Search locations..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                     <div>
                        <label htmlFor="type-filter" className="text-sm font-medium text-gray-400 mr-2">Type:</label>
                        <select 
                            id="type-filter" 
                            value={filterType} 
                            onChange={e => setFilterType(e.target.value as any)}
                            className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                           <option value="All">All Types</option>
                           <option value="Procurement Center">Procurement Center</option>
                           <option value="Factory">Factory</option>
                           <option value="Warehouse">Warehouse</option>
                        </select>
                    </div>
                </div>
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
                        Add New Location
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? <TableView /> : <MapView />}
            
        </DashboardCard>
    );
};

export default LocationMaster;