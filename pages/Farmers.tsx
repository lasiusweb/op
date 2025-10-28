import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Farmer, User } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, UserCircleIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ChevronUpDownIcon, SparklesIcon, LightBulbIcon, ArrowUpTrayIcon } from '../components/Icons';
import { mockLandParcels, mockUsers } from '../data/mockData';
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


const Farmers: React.FC<FarmersProps> = ({ onAddNewFarmer, allFarmers, setAllFarmers, loading }) => {
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

    const userMap = useMemo(() => new Map(mockUsers.map(u => [u.id, u.fullName])), []);
    const fieldAgents: User[] = useMemo(() => mockUsers.filter(u => u.role === 'Field Agent'), []);

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
                    userMap.get(f.assignedAgentId) || ''
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
                        valA = userMap.get(a.assignedAgentId);
                        valB = userMap.get(b.assignedAgentId);
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
    }, [allFarmers, filterDistrict, filterStatus, searchTerm, sortConfig, landParcelCounts, userMap]);
    
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
        const agentName = userMap.get(agentId) || 'the selected agent';
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
            assignedAgent: userMap.get(f.assignedAgentId) || 'Unassigned'
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
    }, [sortedAndFilteredFarmers, landParcelCounts, userMap]);


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
            'Assigned Agent': userMap.get(f.assignedAgentId) || 'Unassigned',
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
            <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5" />
                Actionable Suggestions
            </h3>
            {isLoadingSuggestions && (
                <div className="flex justify-center items-center space-x-2 py-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            )}
            {suggestions && (
                <div className="text-gray-300 text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: suggestions.replace(/\*/g, '•') }} />
            )}
        </div>
        )}
      
      <BulkActionsBar />

      {loading ? (
        <TableSkeleton rows={10} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                <tr>
                <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input 
                                id="checkbox-all" 
                                type="checkbox" 
                                className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                                checked={isAllSelected}
                                ref={checkboxRef}
                                onChange={handleSelectAll}
                            />
                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                        </div>
                    </th>
                <SortableHeader label="Farmer ID" sortKey="id" />
                <SortableHeader label="Full Name" sortKey="fullName" />
                <SortableHeader label="Mobile" sortKey="mobile" />
                <SortableHeader label="Location" sortKey="location" />
                <SortableHeader label="Assigned Agent" sortKey="assignedAgent" />
                <SortableHeader label="Parcels" sortKey="landParcelCount" />
                <SortableHeader label="Status" sortKey="status" />
                <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedAndFilteredFarmers.map((farmer) => (
                <React.Fragment key={farmer.id}>
                    <tr className={`border-b border-gray-700 ${selectedFarmerIds.includes(farmer.id) ? 'bg-teal-900/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input 
                                    id={`checkbox-${farmer.id}`}
                                    type="checkbox" 
                                    className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                                    checked={selectedFarmerIds.includes(farmer.id)}
                                    onChange={() => handleSelectOne(farmer.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <label htmlFor={`checkbox-${farmer.id}`} className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{farmer.id}</td>
                        <td className="px-6 py-4 text-white">{farmer.fullName}</td>
                        <td className="px-6 py-4">{farmer.mobile}</td>
                        <td className="px-6 py-4">{`${farmer.village}, ${farmer.district}`}</td>
                        <td className="px-6 py-4">{userMap.get(farmer.assignedAgentId) || <span className="text-gray-500">Unassigned</span>}</td>
                        <td className="px-6 py-4 text-center">{landParcelCounts[farmer.id] || 0}</td>
                        <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            farmer.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                            {farmer.status}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleToggleRow(farmer.id)}
                                    className="font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1"
                                    aria-label={expandedRow === farmer.id ? 'Hide Details' : 'Show Details'}
                                >
                                    <span>Details</span>
                                    {expandedRow === farmer.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </button>
                                <button
                                    onClick={() => handleEditClick(farmer)}
                                    className="font-medium text-blue-400 hover:text-blue-300"
                                    aria-label={`Edit farmer ${farmer.fullName}`}
                                >
                                    <PencilIcon />
                                </button>
                                 <button
                                    onClick={() => handleDeleteClick(farmer)}
                                    className="font-medium text-red-400 hover:text-red-300"
                                    aria-label={`Delete farmer ${farmer.fullName}`}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </td>
                    </tr>
                    {expandedRow === farmer.id && (
                        <tr className="bg-gray-900/50">
                            <td colSpan={9} className="p-4 transition-all duration-300 ease-in-out">
                               <div className="bg-gray-800/50 p-6 rounded-lg space-y-6">
                                {editingFarmerId === farmer.id && editableFarmerData ? (
                                    <>
                                     <div className="flex items-start gap-6">
                                         <div className="flex-shrink-0">
                                              <h3 className="text-sm font-semibold text-teal-400 mb-3">Profile Photo</h3>
                                             {editableFarmerData.photoUrl ? (
                                                <img src={editableFarmerData.photoUrl} alt="Farmer" className="h-24 w-24 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
                                                    <UserCircleIcon className="h-16 w-16 text-gray-500" />
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                            <button onClick={() => fileInputRef.current?.click()} className="mt-2 w-full text-center text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded-md transition-colors">
                                                Upload Photo
                                            </button>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-sm font-semibold text-teal-400 mb-3">Edit Personal & Location Information</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                 <EditableInput label="Full Name" name="fullName" value={editableFarmerData.fullName} onChange={handleInputChange} />
                                                 <EditableInput label="Father's Name" name="fatherName" value={editableFarmerData.fatherName} onChange={handleInputChange} />
                                                 <EditableInput label="Date of Birth" name="dob" type="date" value={editableFarmerData.dob} onChange={handleInputChange} />
                                                 <EditableInput label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other'].map(o => ({ value: o, label: o }))} value={editableFarmerData.gender} onChange={handleInputChange} />
                                                 <EditableInput label="Mobile" name="mobile" value={editableFarmerData.mobile} onChange={handleInputChange} />
                                                 <EditableInput label="Village" name="village" value={editableFarmerData.village} onChange={handleInputChange} />
                                                 <EditableInput label="Mandal" name="mandal" value={editableFarmerData.mandal} onChange={handleInputChange} />
                                                 <EditableInput label="District" name="district" value={editableFarmerData.district} onChange={handleInputChange} />
                                                 <EditableInput label="Assigned Agent" name="assignedAgentId" type="select" options={fieldAgents.map(a => ({ value: a.id, label: a.fullName }))} value={editableFarmerData.assignedAgentId} onChange={handleInputChange} />
                                             </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-semibold text-teal-400 mb-3">Edit Bank & Farming Details</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <EditableInput label="Bank Name" name="bankName" value={editableFarmerData.bankName} onChange={handleInputChange} />
                                            <EditableInput label="Account Number" name="bankAccountNumber" value={editableFarmerData.bankAccountNumber} onChange={handleInputChange} />
                                            <EditableInput label="IFSC Code" name="ifscCode" value={editableFarmerData.ifscCode} onChange={handleInputChange} />
                                            <EditableInput label="Crop Type" name="cropType" value={editableFarmerData.cropType} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-teal-400 mb-3">Edit Status & Verification</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                            <EditableInput label="Status" name="status" type="select" options={['Active', 'Inactive'].map(o => ({ value: o, label: o }))} value={editableFarmerData.status} onChange={handleInputChange} />
                                            <div className="flex items-center pt-5">
                                                <input id="accountVerified" name="accountVerified" type="checkbox" checked={editableFarmerData.accountVerified} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-teal-600 focus:ring-teal-500" />
                                                <label htmlFor="accountVerified" className="ml-2 block text-sm text-gray-300">Account Verified</label>
                                            </div>
                                            <div className="flex items-center pt-5">
                                                <input id="photoUploaded" name="photoUploaded" type="checkbox" checked={editableFarmerData.photoUploaded} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-teal-600 focus:ring-teal-500" />
                                                <label htmlFor="photoUploaded" className="ml-2 block text-sm text-gray-300">Photo Uploaded</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-teal-400 mb-3">Edit Remarks</h3>
                                        <textarea id="remarks" name="remarks" value={editableFarmerData.remarks || ''} onChange={handleInputChange} rows={3} className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Enter remarks here..." />
                                    </div>
                                    <div className="flex justify-end gap-4 mt-4">
                                        <button onClick={handleCancelClick} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                                        <button onClick={handleSaveClick} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Changes</button>
                                    </div>
                                </>
                            ) : (
                               <div className="flex flex-col gap-8">
                                    <div className="flex gap-8">
                                        <div className="flex-shrink-0">
                                            {farmer.photoUrl ? (
                                                <img src={farmer.photoUrl} alt={farmer.fullName} className="h-32 w-32 rounded-full object-cover border-4 border-gray-700" />
                                            ) : (
                                                 <div className="h-32 w-32 rounded-full bg-gray-700/50 flex items-center justify-center border-4 border-gray-700">
                                                    <UserCircleIcon className="h-24 w-24 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">Personal Information</h3>
                                                <DetailItem label="Full Name" value={farmer.fullName} />
                                                <DetailItem label="Father's Name" value={farmer.fatherName} />
                                                <DetailItem label="Date of Birth" value={farmer.dob} />
                                                <DetailItem label="Gender" value={farmer.gender} />
                                                <DetailItem label="Aadhaar" value={farmer.aadhaar} />
                                                <DetailItem label="Mobile" value={farmer.mobile} />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">Location & Farming</h3>
                                                <DetailItem label="Village" value={farmer.village} />
                                                <DetailItem label="Mandal" value={farmer.mandal} />
                                                <DetailItem label="District" value={farmer.district} />
                                                <DetailItem label="Crop Type" value={farmer.cropType} />
                                                <DetailItem label="Assigned Agent" value={userMap.get(farmer.assignedAgentId) || 'Unassigned'} />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">Bank & Verification</h3>
                                                <DetailItem label="Bank Name" value={farmer.bankName} />
                                                <DetailItem label="Account Number" value={farmer.bankAccountNumber} />
                                                <DetailItem label="IFSC Code" value={farmer.ifscCode} />
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Active Status</p>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ farmer.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300' }`}>{farmer.status}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Account Verified</p>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ farmer.accountVerified ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300' }`}>{farmer.accountVerified ? 'Verified' : 'Pending'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Photo Uploaded</p>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ farmer.photoUploaded ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300' }`}>{farmer.photoUploaded ? 'Yes' : 'No'}</span>
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                                   <div>
                                        <div className="md:col-span-2 lg:col-span-3">
                                           <h3 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-3">Land Parcels ({landParcelCounts[farmer.id] || 0})</h3>
                                           <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {mockLandParcels.filter(lp => lp.farmerId === farmer.id).map(parcel => (
                                                    <div key={parcel.id} className="p-3 bg-gray-700/30 rounded-md grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div><span className="text-gray-400">Survey No:</span> <span className="text-white font-medium">{parcel.surveyNumber}</span></div>
                                                         <div><span className="text-gray-400">Area:</span> <span className="text-white font-medium">{parcel.areaAcres} Acres</span></div>
                                                         <div><span className="text-gray-400">Irrigation:</span> <span className="text-white font-medium">{parcel.irrigationSource}</span></div>
                                                          <div><span className="text-gray-400">Status:</span> <span className="text-white font-medium">{parcel.status}</span></div>
                                                    </div>
                                                ))}
                                                {(landParcelCounts[farmer.id] || 0) === 0 && <p className="text-gray-400 text-center">No land parcels on record.</p>}
                                           </div>
                                       </div>

                                       {farmer.remarks && (
                                           <div className="mt-4">
                                               <h3 className="text-sm font-semibold text-teal-400 mb-2">Remarks</h3>
                                               <p className="font-medium text-gray-300 italic bg-gray-900/40 p-3 rounded-md">{farmer.remarks}</p>
                                           </div>
                                       )}
                                   </div>
                               </div>
                               )}
                               </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </DashboardCard>
    </>
  );
};

export default Farmers;