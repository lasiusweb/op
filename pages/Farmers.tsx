import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Farmer, Employee } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, UserCircleIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ChevronUpDownIcon, SparklesIcon, LightBulbIcon, ArrowUpTrayIcon } from '../components/Icons';
import { mockLandParcels, mockEmployees } from '../data/mockData';
import { getGeminiInsights } from '../services/geminiService';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import BulkImportModal from '../components/BulkImportModal';
import { TableSkeleton } from '../components/Skeletons';

const DetailItem: React.FC<{ label: string; value: string | number | boolean }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-medium text-white">{String(value)}</p>
    </div>
);

const EditableInput: React.FC<{ label: string; name: keyof Farmer; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; type?: string; options?: { value: string; label: string }[] }> = ({ label, name, value, onChange, type = 'text', options }) => (
    <div>
        <label htmlFor={name} className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
        {type === 'select' ? (
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
                {options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
        )}
    </div>
);

type SortableFarmerKeys = keyof Farmer | 'location' | 'landParcelCount' | 'assignedAgent';

const DeleteConfirmationModal: React.FC<{
    farmer: Farmer | null;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ farmer, onConfirm, onCancel }) => {
    if (!farmer) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete farmer <span className="font-bold text-teal-400">{farmer.fullName}</span>?
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


interface FarmersProps {
    onAddNewFarmer: () => void;
    allFarmers: Farmer[];
    setAllFarmers: React.Dispatch<React.SetStateAction<Farmer[]>>;
    loading: boolean;
}

const farmerTemplateHeaders = [
    "fullName", "fatherName", "mobile", "aadhaar", "village", "mandal", 
    "district", "gender", "dob", "bankName", "bankAccountNumber", "ifscCode", 
    "assignedAgentId"
];


export const Farmers: React.FC<FarmersProps> = ({ onAddNewFarmer, allFarmers, setAllFarmers, loading }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [editingFarmerId, setEditingFarmerId] = useState<string | null>(null);
    const [editableFarmerData, setEditableFarmerData] = useState<Farmer | null>(null);
    const [saveConfirmation, setSaveConfirmation] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDistrict, setFilterDistrict] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortableFarmerKeys; direction: 'ascending' | 'descending' }>({ key: 'fullName', direction: 'ascending' });
    const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null);

    const [suggestions, setSuggestions] = useState<string>('');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
    
    const [selectedFarmerIds, setSelectedFarmerIds] = useState<string[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);


    const checkboxRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const employeeMap = useMemo(() => new Map(mockEmployees.map(u => [u.id, u.fullName])), []);
    const fieldAgents: Employee[] = useMemo(() => mockEmployees.filter(u => u.role === 'Field Agent'), []);

    const landParcelCounts = useMemo(() => {
        const counts: { [farmerId: string]: number } = {};
        allFarmers.forEach(farmer => {
            counts[farmer.id] = mockLandParcels.filter(lp => lp.farmerId === farmer.id).length;
        });
        return counts;
    }, [allFarmers]);

    const uniqueDistricts = useMemo(() => {
        const districts = new Set(allFarmers.map(f => f.district));
        return ['All', ...Array.from(districts).sort()];
    }, [allFarmers]);

    const sortedAndFilteredFarmers = useMemo(() => {
        let filterableItems = [...allFarmers];
        
        // Apply filters
        if (filterDistrict !== 'All') {
            filterableItems = filterableItems.filter(f => f.district === filterDistrict);
        }
        if (filterStatus !== 'All') {
            filterableItems = filterableItems.filter(f => f.status === filterStatus);
        }

        const searchWords = searchTerm.toLowerCase().split(' ').filter(Boolean);
        if (searchWords.length > 0) {
            filterableItems = filterableItems.filter(f => {
                const searchableText = [
                    f.id, 
                    f.fullName, 
                    f.mobile, 
                    f.village, 
                    f.mandal, 
                    f.district,
                    employeeMap.get(f.assignedAgentId) || ''
                ].join(' ').toLowerCase();
                return searchWords.every(word => searchableText.includes(word));
            });
        }
        
        // Apply sorting
        if (sortConfig.key) {
            filterableItems.sort((a, b) => {
                const key = sortConfig.key;
                let valA: any;
                let valB: any;

                switch (key) {
                    case 'landParcelCount':
                        valA = landParcelCounts[a.id] || 0;
                        valB = landParcelCounts[b.id] || 0;
                        break;
                    case 'location':
                        valA = `${a.village}, ${a.district}`;
                        valB = `${b.village}, ${b.district}`;
                        break;
                    case 'assignedAgent':
                        valA = employeeMap.get(a.assignedAgentId);
                        valB = employeeMap.get(b.assignedAgentId);
                        break;
                    default:
                        valA = a[key as keyof Farmer];
                        valB = b[key as keyof Farmer];
                }

                const direction = sortConfig.direction === 'ascending' ? 1 : -1;

                // Push null/undefined to the end, regardless of sort direction
                if (valA == null && valB == null) return 0;
                if (valA == null) return 1;
                if (valB == null) return -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB, undefined, { sensitivity: 'base' }) * direction;
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * direction;
                }
                if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                    return (Number(valA) - Number(valB)) * direction;
                }

                // Fallback for other comparable types
                if (valA < valB) return -1 * direction;
                if (valA > valB) return 1 * direction;
                
                return 0;
            });
        }

        return filterableItems;
    }, [allFarmers, filterDistrict, filterStatus, searchTerm, sortConfig, landParcelCounts, employeeMap]);
    
    const requestSort = (key: SortableFarmerKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const visibleIds = useMemo(() => sortedAndFilteredFarmers.map(f => f.id), [sortedAndFilteredFarmers]);
    const selectedVisibleIds = useMemo(() => visibleIds.filter(id => selectedFarmerIds.includes(id)), [visibleIds, selectedFarmerIds]);

    const isAllSelected = visibleIds.length > 0 && selectedVisibleIds.length === visibleIds.length;
    const isSomeSelected = selectedVisibleIds.length > 0 && selectedVisibleIds.length < visibleIds.length;
    
    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = isSomeSelected;
        }
    }, [isSomeSelected]);

    const handleSelectOne = (farmerId: string) => {
        setSelectedFarmerIds(prev =>
            prev.includes(farmerId)
                ? prev.filter(id => id !== farmerId)
                : [...prev, farmerId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedFarmerIds(prev => [...new Set([...prev, ...visibleIds])]);
        } else {
            setSelectedFarmerIds(prev => prev.filter(id => !visibleIds.includes(id)));
        }
    };
    
    const handleBulkStatusChange = (status: 'Active' | 'Inactive') => {
        if (window.confirm(`Are you sure you want to set ${selectedFarmerIds.length} farmer(s) to '${status}'?`)) {
            setAllFarmers(prev =>
                prev.map(f =>
                    selectedFarmerIds.includes(f.id)
                        ? { ...f, status, updatedAt: new Date().toISOString() }
                        : f
                )
            );
            setSaveConfirmation(`${selectedFarmerIds.length} farmer(s) updated to '${status}'.`);
            setSelectedFarmerIds([]);
        }
    };

    const handleBulkReassign = (agentId: string) => {
        if (!agentId) return;
        const agentName = employeeMap.get(agentId) || 'the selected agent';
        if (window.confirm(`Are you sure you want to reassign ${selectedFarmerIds.length} farmer(s) to ${agentName}?`)) {
            setAllFarmers(prev =>
                prev.map(f =>
                    selectedFarmerIds.includes(f.id)
                        ? { ...f, assignedAgentId: agentId, updatedAt: new Date().toISOString() }
                        : f
                )
            );
            setSaveConfirmation(`${selectedFarmerIds.length} farmer(s) reassigned to ${agentName}.`);
            setSelectedFarmerIds([]);
        }
    };

    const handleImport = (newFarmersData: any[]) => {
        const now = new Date().toISOString();
        const processedFarmers: Farmer[] = newFarmersData.map((item, index) => {
            return {
                id: `FARM-IMP-${Date.now() + index}`,
                fullName: item.fullName || 'Unnamed',
                fatherName: item.fatherName || '',
                mobile: item.mobile || '',
                aadhaar: item.aadhaar || '',
                village: item.village || '',
                mandal: item.mandal || '',
                district: item.district || '',
                status: 'Active',
                gender: item.gender || 'Male',
                dob: item.dob || new Date().toISOString().split('T')[0],
                bankName: item.bankName || '',
                bankAccountNumber: item.bankAccountNumber || '',
                ifscCode: item.ifscCode || '',
                cropType: 'Oil Palm',
                accountVerified: false,
                photoUploaded: false,
                remarks: 'Imported via bulk upload.',
                assignedAgentId: item.assignedAgentId || '',
                createdAt: now,
                updatedAt: now,
            };
        });
        setAllFarmers(prev => [...prev, ...processedFarmers]);
        setSaveConfirmation(`${processedFarmers.length} new farmers imported successfully!`);
        setIsImportModalOpen(false);
    };

    const SortableHeader: React.FC<{ label: string; sortKey: SortableFarmerKeys }> = ({ label, sortKey }) => (
        <th scope="col" className="px-6 py-3">
             <button
                onClick={() => requestSort(sortKey)}
                className="group flex items-center gap-1.5 uppercase font-semibold tracking-wider text-gray-300 hover:text-white transition-colors"
                aria-label={`Sort by ${label}`}
             >
                <span>{label}</span>
                {sortConfig.key === sortKey ? (
                    sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4"/> : <ArrowDownIcon className="w-4 h-4"/>
                ) : (
                    <ChevronUpDownIcon className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </th>
    );

    useEffect(() => {
        if (saveConfirmation) {
            setShowConfirmation(true);
            const timer = setTimeout(() => {
                setShowConfirmation(false);
                setSaveConfirmation(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [saveConfirmation]);

    const handleGetSuggestions = useCallback(async () => {
        setIsLoadingSuggestions(true);
        setSuggestions('');

        const dataForAnalysis = sortedAndFilteredFarmers.slice(0, 50).map(f => ({
            id: f.id,
            fullName: f.fullName,
            status: f.status,
            accountVerified: f.accountVerified,
            photoUploaded: f.photoUploaded,
            landParcelCount: landParcelCounts[f.id] || 0,
            assignedAgent: employeeMap.get(f.assignedAgentId) || 'Unassigned'
        }));

        const prompt = `
            As an agricultural operations manager, analyze the following list of farmers from our database.
            Provide 3-4 actionable suggestions to improve data quality, farmer engagement, or agent efficiency.
            Focus on identifying farmers who are inactive, have unverified bank accounts, are missing profile photos, have no land parcels registered, or are not assigned to a field agent.
            Please provide specific farmer IDs or names where applicable to make the suggestions more actionable.
            Format the response as concise bullet points.

            Farmer Data Sample:
            ${JSON.stringify(dataForAnalysis, null, 2)}
        `;

        const result = await getGeminiInsights(prompt);
        setSuggestions(result);
        setIsLoadingSuggestions(false);
    }, [sortedAndFilteredFarmers, landParcelCounts, employeeMap]);


    const handleToggleRow = (farmerId: string) => {
      setExpandedRow(expandedRow === farmerId ? null : farmerId);
      if (expandedRow === farmerId && editingFarmerId === farmerId) {
          handleCancelClick();
      }
    };

    const handleEditClick = (farmer: Farmer) => {
        setEditingFarmerId(farmer.id);
        setEditableFarmerData({ ...farmer });
        setExpandedRow(farmer.id);
    };

    const handleCancelClick = () => {
        setEditingFarmerId(null);
        setEditableFarmerData(null);
    };

    const handleSaveClick = () => {
        if (!editableFarmerData) return;
        
        const updatedFarmer = { ...editableFarmerData, updatedAt: new Date().toISOString() };
        setAllFarmers(prev => prev.map(f => f.id === updatedFarmer.id ? updatedFarmer : f));

        setEditingFarmerId(null);
        setEditableFarmerData(null);
        setSaveConfirmation(`Farmer ${editableFarmerData.fullName} updated successfully!`);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editableFarmerData) return;
        const { name, value, type } = e.target;
        
        let processedValue: any = value;
        if (type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        }

        setEditableFarmerData({
            ...editableFarmerData,
            [name]: processedValue,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editableFarmerData) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableFarmerData({
                    ...editableFarmerData,
                    photoUrl: reader.result as string,
                    photoUploaded: true,
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDeleteClick = (farmer: Farmer) => {
        setFarmerToDelete(farmer);
    };
    
    const handleConfirmDelete = () => {
        if (!farmerToDelete) return;
        setAllFarmers(prev => prev.filter(f => f.id !== farmerToDelete.id));
        setSaveConfirmation(`Farmer ${farmerToDelete.fullName} deleted successfully.`);
        setFarmerToDelete(null);
    };
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'farmers_list', 'Farmer Master Database');
        }
    };

    const getDataForExport = () => {
        return sortedAndFilteredFarmers.map(f => ({
            'Farmer ID': f.id,
            'Full Name': f.fullName,
            'Mobile': f.mobile,
            'Village': f.village,
            'Mandal': f.mandal,
            'District': f.district,
            'Assigned Agent': employeeMap.get(f.assignedAgentId) || 'Unassigned',
            'Land Parcels': landParcelCounts[f.id] || 0,
            'Status': f.status,
            'Account Verified': f.accountVerified,
            'Photo Uploaded': f.photoUploaded,
        }));
    }

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Farmers', data: getDataForExport() }], 'farmers_list.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Farmers', data: getDataForExport() }], 'farmers_list');
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

    const BulkActionsBar = () => {
        const [targetAgentId, setTargetAgentId] = useState('');

        if (selectedFarmerIds.length === 0) return null;

        return (
            <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 my-4 flex items-center justify-between flex-wrap gap-4">
                <p className="font-semibold text-white">{selectedFarmerIds.length} farmer(s) selected</p>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">Set status:</span>
                        <button onClick={() => handleBulkStatusChange('Active')} className="text-xs bg-green-500/20 text-green-300 hover:bg-green-500/40 px-3 py-1 rounded-md transition-colors">Active</button>
                        <button onClick={() => handleBulkStatusChange('Inactive')} className="text-xs bg-red-500/20 text-red-300 hover:bg-red-500/40 px-3 py-1 rounded-md transition-colors">Inactive</button>
                    </div>

                    <div className="flex items-center gap-2">
                         <select
                            value={targetAgentId}
                            onChange={e => setTargetAgentId(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            <option value="">Reassign agent...</option>
                            {fieldAgents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleBulkReassign(targetAgentId)}
                            disabled={!targetAgentId}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-3 rounded-md transition-colors text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Assign
                        </button>
                    </div>
                     <button onClick={() => setSelectedFarmerIds([])} className="text-sm text-gray-400 hover:text-white underline">Deselect All</button>
                </div>
            </div>
        );
    }


  return (
    <>
    <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        templateHeaders={farmerTemplateHeaders}
        entityName="Farmers"
    />
    <DashboardCard title="Farmer Master Database" exportOptions={exportOptions} contentRef={contentRef}>
       {showConfirmation && (
            <div className={`fixed top-24 right-8 text-white py-2 px-4 rounded-lg shadow-lg z-50 transition-transform transform translate-x-0 ${saveConfirmation?.includes('deleted') ? 'bg-red-600' : 'bg-green-600'}`}
                 style={{ transition: 'transform 0.5s ease-in-out', transform: showConfirmation ? 'translateX(0)' : 'translateX(100%)' }}>
                {saveConfirmation}
            </div>
       )}
       <DeleteConfirmationModal 
            farmer={farmerToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={() => setFarmerToDelete(null)}
       />
       <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                 <input 
                  type="text" 
                  placeholder="Search farmer ID, name, mobile, location..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-72"
                />
                <div>
                    <label htmlFor="district-filter" className="text-sm font-medium text-gray-400 mr-2">District:</label>
                    <select 
                        id="district-filter" 
                        value={filterDistrict} 
                        onChange={e => setFilterDistrict(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                       {uniqueDistricts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-400 mr-2">Status:</label>
                    <select 
                        id="status-filter" 
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                        className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    Import Farmers
                </button>
                <button onClick={onAddNewFarmer} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Farmer
                </button>
            </div>
      </div>
      {(isLoadingSuggestions || suggestions) && (
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
            <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center