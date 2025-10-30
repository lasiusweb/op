import React, { useState, useMemo, FormEvent, useRef } from 'react';
import type { LandParcel, Farmer } from '../types';
import { mockLandParcels, mockFarmersData } from '../data/mockData';
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

const LandParcelModal: React.FC<{
    parcel: Partial<LandParcel>;
    farmers: Farmer[];
    onSave: (parcel: Partial<LandParcel>) => void;
    onCancel: () => void;
}> = ({ parcel, farmers, onSave, onCancel }) => {
    const [formData, setFormData] = useState(parcel);

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
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{parcel.id ? 'Edit Land Parcel' : 'Add New Land Parcel'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="farmerId" className="block text-sm font-medium text-gray-300">Farmer</label>
                            <select name="farmerId" id="farmerId" value={formData.farmerId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select a Farmer</option>
                                {farmers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="surveyNumber" className="block text-sm font-medium text-gray-300">Survey Number</label>
                            <input type="text" name="surveyNumber" id="surveyNumber" value={formData.surveyNumber || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="areaAcres" className="block text-sm font-medium text-gray-300">Area (Acres)</label>
                            <input type="number" name="areaAcres" id="areaAcres" value={formData.areaAcres || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="soilType" className="block text-sm font-medium text-gray-300">Soil Type</label>
                            <input type="text" name="soilType" id="soilType" value={formData.soilType || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="irrigationSource" className="block text-sm font-medium text-gray-300">Irrigation Source</label>
                            <select name="irrigationSource" id="irrigationSource" value={formData.irrigationSource || 'Rainfed'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="Borewell">Borewell</option>
                                <option value="Canal">Canal</option>
                                <option value="Rainfed">Rainfed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                            <select name="status" id="status" value={formData.status || 'Active'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="Active">Active</option>
                                <option value="Sold">Sold</option>
                                <option value="Fallow">Fallow</option>
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

const LandParcelMaster: React.FC = () => {
    const [parcels, setParcels] = useState<LandParcel[]>(mockLandParcels);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentParcel, setCurrentParcel] = useState<Partial<LandParcel> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);

    const handleOpenModal = (parcel?: LandParcel) => {
        setCurrentParcel(parcel || { status: 'Active' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentParcel(null);
    };

    const handleSaveParcel = (parcelData: Partial<LandParcel>) => {
        const now = new Date().toISOString();
        if (parcelData.id) { // Edit
            setParcels(parcels.map(p => p.id === parcelData.id ? { ...p, ...parcelData, updatedAt: now } as LandParcel : p));
        } else { // Add
            const newParcel: LandParcel = {
                id: `LP${Date.now()}`,
                farmerId: parcelData.farmerId || '',
                surveyNumber: parcelData.surveyNumber || '',
                areaAcres: parcelData.areaAcres || 0,
                soilType: parcelData.soilType || '',
                irrigationSource: parcelData.irrigationSource || 'Rainfed',
                latitude: parcelData.latitude || 0,
                longitude: parcelData.longitude || 0,
                status: parcelData.status || 'Active',
                createdAt: now,
                updatedAt: now,
            };
            setParcels(prev => [...prev, newParcel]);
        }
        handleCloseModal();
    };
    
    const filteredParcels = useMemo(() => {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (searchWords.length === 0) {
            return parcels;
        }
        return parcels.filter(p => {
            const searchableText = [
                p.surveyNumber,
                farmerMap.get(p.farmerId)
            ].filter(Boolean).join(' ').toLowerCase();

            return searchWords.every(word => searchableText.includes(word));
        });
    }, [parcels, searchTerm, farmerMap]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'land_parcel_master', 'Land Parcel Master');
        }
    };

    const getDataForExport = () => {
        return filteredParcels.map(p => ({
            'Parcel ID': p.id,
            'Farmer': farmerMap.get(p.farmerId) || 'N/A',
            'Survey #': p.surveyNumber,
            'Area (Acres)': p.areaAcres,
            'Soil Type': p.soilType,
            'Irrigation': p.irrigationSource,
            'Status': p.status,
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Land Parcels', data: getDataForExport() }], 'land_parcel_master.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Land Parcels', data: getDataForExport() }], 'land_parcel_master');
    };

    // FIX: exportOptions was an object, but DashboardCard expects an array of ExportAction objects.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];


    return (
        <DashboardCard title="Land Parcel Master" exportOptions={exportOptions} contentRef={contentRef}>
            {isModalOpen && currentParcel && (
                <LandParcelModal parcel={currentParcel} farmers={mockFarmersData} onSave={handleSaveParcel} onCancel={handleCloseModal} />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Search by survey number or farmer..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Parcel
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Survey #</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Area (Acres)</th>
                            <th scope="col" className="px-6 py-3">Irrigation</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParcels.map((parcel) => (
                            <tr key={parcel.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap"><Highlight text={parcel.surveyNumber} highlight={searchTerm} /></td>
                                <td className="px-6 py-4 text-white"><Highlight text={farmerMap.get(parcel.farmerId) || 'N/A'} highlight={searchTerm} /></td>
                                <td className="px-6 py-4">{parcel.areaAcres}</td>
                                <td className="px-6 py-4">{parcel.irrigationSource}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        parcel.status === 'Active' ? 'bg-green-500/20 text-green-300' 
                                        : parcel.status === 'Fallow' ? 'bg-yellow-500/20 text-yellow-300'
                                        : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {parcel.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenModal(parcel)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${parcel.surveyNumber}`}>
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

export default LandParcelMaster;