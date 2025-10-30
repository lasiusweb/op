import React, { useState, useMemo, FormEvent } from 'react';
import type { 
    Farmer, 
    LandParcel, 
    SubsidyApplication, 
    SubsidyApplicationStatus, 
    ProcurementBatch, 
    CultivationLog, 
    CultivationActivityType, 
    FarmVisitRequest, 
    FarmVisitRequestStatus, 
    FarmVisitUrgency,
    Payment,
    Document,
    DocumentStatus,
    CropInsurancePolicy,
    FarmerProfileChangeRequest
} from '../types';
import { 
    IdentificationIcon, 
    CubeIcon, 
    ReceiptPercentIcon, 
    BookOpenIcon, 
    ArrowLeftOnRectangleIcon, 
    ClipboardDocumentListIcon, 
    MapIcon as LandIcon, 
    CalendarDaysIcon, 
    PaperAirplaneIcon, 
    ClockIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    SunIcon,
    PencilIcon,
    FolderIcon,
    XMarkIcon,
    ArrowDownTrayIcon
} from '../components/Icons';
import FarmerProfileUpdateRequestModal from '../components/modals/FarmerProfileUpdateRequestModal';

// --- PROPS INTERFACE ---
interface FarmerPortalProps {
    allFarmers: Farmer[];
    allLandParcels: LandParcel[];
    allSubsidyApps: SubsidyApplication[];
    allProcurementBatches: ProcurementBatch[];
    allPayments: Payment[];
    allDocuments: Document[];
    allCropInsurancePolicies: CropInsurancePolicy[];
    cultivationLogs: CultivationLog[];
    farmVisitRequests: FarmVisitRequest[];
    onAddLog: (newLog: CultivationLog) => void;
    onAddVisitRequest: (newRequest: FarmVisitRequest) => void;
    onAddProfileChangeRequest: (newRequest: FarmerProfileChangeRequest) => void;
    setCurrentPage: (page: string) => void;
}

// --- STYLES & CONFIG ---
const subsidyStatusStyles: { [key in SubsidyApplicationStatus]: string } = {
    'Submitted': 'bg-blue-500/20 text-blue-300', 'Documents Pending': 'bg-yellow-500/20 text-yellow-300',
    'Under Review': 'bg-purple-500/20 text-purple-300', 'Approved': 'bg-green-500/20 text-green-300', 'Rejected': 'bg-red-500/20 text-red-300',
};
const paymentStatusStyles: { [key: string]: string } = {
    'Paid': 'bg-green-500/20 text-green-300', 'Pending': 'bg-yellow-500/20 text-yellow-300', 'Partial': 'bg-blue-500/20 text-blue-300',
};
const visitStatusStyles: { [key in FarmVisitRequestStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300', 'Scheduled': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300', 'Cancelled': 'bg-gray-500/20 text-gray-400',
};
const documentStatusStyles: { [key in DocumentStatus]: string } = {
    'Pending': 'text-yellow-400', 'Verified': 'text-green-400', 'Rejected': 'text-red-400',
};
const activityTypes: CultivationActivityType[] = ['Planting', 'Fertilizing', 'Pest Control', 'Weeding', 'Pruning', 'Harvesting', 'Soil Testing'];

// --- SUB-COMPONENTS ---
const TabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors w-full text-left ${active ? 'bg-teal-500/10 text-teal-300' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}>
        {icon} {label}
    </button>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={className}>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="font-medium text-white">{value}</div>
    </div>
);

// --- MAIN COMPONENT ---
const FarmerPortal: React.FC<FarmerPortalProps> = (props) => {
    const { allFarmers, allLandParcels, allSubsidyApps, allProcurementBatches, cultivationLogs, farmVisitRequests, allPayments, allDocuments, allCropInsurancePolicies, onAddLog, onAddVisitRequest, onAddProfileChangeRequest, setCurrentPage } = props;

    const [selectedFarmerId, setSelectedFarmerId] = useState<string>(allFarmers[0]?.id || '');
    const [activeTab, setActiveTab] = useState('profile');
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [isVisitModalOpen, setVisitModalOpen] = useState(false);
    const [isProfileUpdateModalOpen, setProfileUpdateModalOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState('');

    const selectedFarmer = useMemo(() => allFarmers.find(f => f.id === selectedFarmerId), [selectedFarmerId, allFarmers]);
    const farmerLandParcels = useMemo(() => allLandParcels.filter(p => p.farmerId === selectedFarmerId), [selectedFarmerId, allLandParcels]);
    const farmerSubsidyApps = useMemo(() => allSubsidyApps.filter(a => a.farmerId === selectedFarmerId), [selectedFarmerId, allSubsidyApps]);
    const farmerBatches = useMemo(() => allProcurementBatches.filter(b => b.farmerId === selectedFarmerId), [selectedFarmerId, allProcurementBatches]);
    const farmerLogs = useMemo(() => cultivationLogs.filter(l => l.farmerId === selectedFarmerId), [selectedFarmerId, cultivationLogs]);
    const farmerVisits = useMemo(() => farmVisitRequests.filter(v => v.farmerId === selectedFarmerId), [selectedFarmerId, farmVisitRequests]);
    const farmerPayments = useMemo(() => allPayments.filter(p => p.farmerId === selectedFarmerId), [selectedFarmerId, allPayments]);
    const farmerDocuments = useMemo(() => {
        const appIds = farmerSubsidyApps.map(app => app.id);
        return allDocuments.filter(doc => appIds.includes(doc.subsidyApplicationId));
    }, [farmerSubsidyApps, allDocuments]);
    const farmerPolicies = useMemo(() => allCropInsurancePolicies.filter(p => p.farmerId === selectedFarmerId), [selectedFarmerId, allCropInsurancePolicies]);


    const handleFormSubmit = (e: FormEvent, type: 'log' | 'visit') => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        if (type === 'log') {
            const newLog: CultivationLog = {
                id: `CLOG${Date.now()}`,
                farmerId: selectedFarmerId,
                landParcelId: data.landParcelId as string,
                activityType: data.activityType as CultivationActivityType,
                activityDate: data.activityDate as string,
                materialsUsed: data.materialsUsed as string,
                cost: Number(data.cost),
                notes: data.notes as string,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                performedById: selectedFarmerId // Assume farmer performs it
            };
            onAddLog(newLog);
            setShowConfirmation('New cultivation log added successfully!');
            setLogModalOpen(false);
        } else if (type === 'visit') {
            const newRequest: FarmVisitRequest = {
                id: `FVR${Date.now()}`,
                farmerId: selectedFarmerId,
                landParcelId: data.landParcelId as string,
                requestType: data.requestType as string,
                urgency: data.urgency as FarmVisitUrgency,
                description: data.description as string,
                requestDate: new Date().toISOString(),
                status: 'Pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            onAddVisitRequest(newRequest);
            setShowConfirmation('Farm visit requested successfully!');
            setVisitModalOpen(false);
        }

        setTimeout(() => setShowConfirmation(''), 3000);
    };

    const handleProfileUpdateRequestSubmit = (request: FarmerProfileChangeRequest) => {
        onAddProfileChangeRequest(request);
        setProfileUpdateModalOpen(false);
        setShowConfirmation('Profile update request submitted successfully!');
        setTimeout(() => setShowConfirmation(''), 3000);
    };

    const renderTabContent = () => {
        if (!selectedFarmer) return <div className="p-8 text-center text-gray-500">Please select a farmer to view their portal.</div>;
        switch (activeTab) {
            case 'profile': return (
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Farmer Profile</h3>
                            <p className="text-gray-400">Personal and banking information.</p>
                        </div>
                        <button onClick={() => setProfileUpdateModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300">
                            <PencilIcon className="h-4 w-4" /> Request Profile Update
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-900/50 rounded-lg">
                        <DetailItem label="Full Name" value={selectedFarmer.fullName} />
                        <DetailItem label="Father's Name" value={selectedFarmer.fatherName} />
                        <DetailItem label="Mobile" value={selectedFarmer.mobile} />
                        <DetailItem label="Aadhaar" value={selectedFarmer.aadhaar} />
                        <DetailItem label="Location" value={`${selectedFarmer.village}, ${selectedFarmer.mandal}`} />
                        <DetailItem label="Bank Name" value={selectedFarmer.bankName} />
                        <DetailItem label="Account No." value={selectedFarmer.bankAccountNumber} />
                        <DetailItem label="IFSC Code" value={selectedFarmer.ifscCode} />
                    </div>
                </div>
            );
            case 'land': return (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Land Parcels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {farmerLandParcels.map(p => (
                            <div key={p.id} className="p-4 bg-gray-900/50 rounded-lg">
                                <p className="font-semibold text-white">Survey No: {p.surveyNumber}</p>
                                <p className="text-sm text-gray-400">{p.areaAcres} Acres, {p.soilType} Soil</p>
                                <p className="text-sm text-gray-400">Irrigation: {p.irrigationSource}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'subsidy': return (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Subsidy Applications</h3>
                    <div className="space-y-4">
                        {farmerSubsidyApps.map(app => (
                            <div key={app.id} className={`p-4 bg-gray-900/50 rounded-lg border-l-4 ${subsidyStatusStyles[app.status].replace(/bg-\S+\s*/, 'border-current')}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-white">{app.subsidyType} - <span className="font-mono text-xs">{app.id}</span></p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${subsidyStatusStyles[app.status]}`}>{app.status}</span>
                                </div>
                                <p className="text-sm text-gray-400">Requested: ₹{app.requestedAmount.toLocaleString()}, Applied: {app.applicationDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'procurement': return (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Procurement Batches</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-400 uppercase"><tr><th className="py-2 px-4 text-left">Batch ID</th><th className="py-2 px-4 text-left">Date</th><th className="py-2 px-4 text-right">Weight (Kg)</th><th className="py-2 px-4 text-right">Amount (₹)</th><th className="py-2 px-4 text-center">Payment</th></tr></thead>
                            <tbody>
                                {farmerBatches.map(b => (
                                    <tr key={b.id} className="border-b border-gray-700/50">
                                        <td className="py-3 px-4 font-mono text-white">{b.id}</td>
                                        <td className="py-3 px-4">{b.procurementDate}</td>
                                        <td className="py-3 px-4 text-right font-mono">{b.weightKg.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-right font-mono">{b.totalAmount.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${paymentStatusStyles[b.paymentStatus]}`}>{b.paymentStatus}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            case 'payments': return (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Payment History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-400 uppercase"><tr><th className="py-2 px-4 text-left">Transaction ID</th><th className="py-2 px-4 text-left">Date</th><th className="py-2 px-4 text-left">Batch ID</th><th className="py-2 px-4 text-right">Amount (₹)</th><th className="py-2 px-4 text-center">Status</th></tr></thead>
                            <tbody>
                                {farmerPayments.map(p => (
                                    <tr key={p.id} className="border-b border-gray-700/50">
                                        <td className="py-3 px-4 font-mono text-white">{p.transactionId}</td>
                                        <td className="py-3 px-4">{p.paymentDate}</td>
                                        <td className="py-3 px-4 font-mono">{p.procurementBatchId}</td>
                                        <td className="py-3 px-4 text-right font-mono">{p.amount.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{p.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            case 'documents': return (
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4">My Documents</h3>
                     <div className="space-y-4">
                        {farmerDocuments.map(doc => (
                            <div key={doc.id} className={`p-4 bg-gray-900/50 rounded-lg flex justify-between items-center`}>
                                <div>
                                    <p className="font-semibold text-white">{doc.documentType} <span className="text-gray-400 text-xs font-mono">for {doc.subsidyApplicationId}</span></p>
                                    <p className={`text-sm font-bold ${documentStatusStyles[doc.status]}`}>{doc.status}</p>
                                </div>
                                <button className="text-gray-400 hover:text-white" title="Download Document"><ArrowDownTrayIcon/></button>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'insurance': return (
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4">Crop Insurance</h3>
                    <div className="space-y-4">
                        {farmerPolicies.map(p => (
                            <div key={p.id} className="p-4 bg-gray-900/50 rounded-lg">
                               <div className="flex justify-between items-center">
                                    <p className="font-semibold text-white">{p.insurer} - <span className="font-mono text-xs">{p.policyNumber}</span></p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{p.status}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                    <DetailItem label="Sum Insured" value={`₹${p.sumInsured.toLocaleString('en-IN')}`} />
                                    <DetailItem label="Premium" value={`₹${p.premium.toLocaleString('en-IN')}`} />
                                    <DetailItem label="Start Date" value={p.startDate} />
                                    <DetailItem label="End Date" value={p.endDate} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'cultivation': return (
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Cultivation Log</h3>
                        <button onClick={() => setLogModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md text-sm">Add New Log</button>
                    </div>
                     <div className="space-y-3">
                        {farmerLogs.map(l => (
                            <div key={l.id} className="p-3 bg-gray-900/50 rounded-lg flex items-center gap-4">
                               <div className="p-2 bg-gray-700/50 rounded-full"><CalendarDaysIcon className="h-5 w-5 text-teal-400" /></div>
                               <div>
                                    <p className="font-semibold text-white">{l.activityType} on {l.activityDate}</p>
                                    <p className="text-sm text-gray-400">{l.notes || "No notes."}</p>
                               </div>
                            </div>
                        ))}
                     </div>
                </div>
            );
            case 'visits': return (
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Farm Visit Requests</h3>
                        <button onClick={() => setVisitModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md text-sm">New Request</button>
                    </div>
                    <div className="space-y-3">
                        {farmerVisits.map(v => (
                            <div key={v.id} className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-white">{v.requestType}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${visitStatusStyles[v.status]}`}>{v.status}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{v.description}</p>
                                {v.visitDate && <p className="text-xs text-blue-300 mt-1 flex items-center gap-1"><ClockIcon className="h-4 w-4"/>Scheduled for: {v.visitDate}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    if (!selectedFarmer) {
        return <div className="p-8 text-center text-gray-500">No farmers found. Please add a farmer first.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {showConfirmation && (
                <div className="fixed top-24 right-8 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
                    {showConfirmation}
                </div>
            )}
            
            {selectedFarmer && (
                <FarmerProfileUpdateRequestModal
                    farmer={selectedFarmer}
                    isOpen={isProfileUpdateModalOpen}
                    onClose={() => setProfileUpdateModalOpen(false)}
                    onSubmit={handleProfileUpdateRequestSubmit}
                />
            )}

            {isLogModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Add Cultivation Log</h2>
                        <form onSubmit={(e) => handleFormSubmit(e, 'log')} className="space-y-4">
                           {/* Log form fields */}
                           <select name="landParcelId" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"><option value="">Select Parcel</option>{farmerLandParcels.map(p => <option key={p.id} value={p.id}>{p.surveyNumber}</option>)}</select>
                           <select name="activityType" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"><option value="">Select Activity</option>{activityTypes.map(t=><option key={t} value={t}>{t}</option>)}</select>
                           <input name="activityDate" type="date" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                           <input name="materialsUsed" placeholder="Materials Used" className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                           <input name="cost" type="number" placeholder="Cost (₹)" className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                           <textarea name="notes" placeholder="Notes..." rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"></textarea>
                           <div className="flex justify-end gap-4"><button type="button" onClick={()=>setLogModalOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md">Cancel</button><button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-md">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
            
            {isVisitModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Request Farm Visit</h2>
                        <form onSubmit={(e) => handleFormSubmit(e, 'visit')} className="space-y-4">
                            {/* Visit request form fields */}
                           <select name="landParcelId" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"><option value="">Select Parcel</option>{farmerLandParcels.map(p => <option key={p.id} value={p.id}>{p.surveyNumber}</option>)}</select>
                           <input name="requestType" placeholder="Purpose of visit" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                           <select name="urgency" required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"><option value="Normal">Normal</option><option value="Urgent">Urgent</option></select>
                           <textarea name="description" placeholder="Describe the issue..." rows={4} required className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"></textarea>
                           <div className="flex justify-end gap-4"><button type="button" onClick={()=>setVisitModalOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md">Cancel</button><button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-md">Submit</button></div>
                        </form>
                    </div>
                </div>
            )}


            <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Farmer Portal</h2>
                        <button onClick={() => setCurrentPage('farmers')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                            <ArrowLeftOnRectangleIcon className="h-5 w-5"/> Exit Portal
                        </button>
                    </div>
                    <select value={selectedFarmerId} onChange={e => setSelectedFarmerId(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        {allFarmers.map(f => <option key={f.id} value={f.id}>{f.fullName} ({f.id})</option>)}
                    </select>
                    <nav className="space-y-1">
                        <TabButton icon={<IdentificationIcon className="h-5 w-5"/>} label="Profile" active={activeTab==='profile'} onClick={()=>setActiveTab('profile')} />
                        <TabButton icon={<LandIcon className="h-5 w-5"/>} label="Land Parcels" active={activeTab==='land'} onClick={()=>setActiveTab('land')} />
                        <TabButton icon={<ReceiptPercentIcon className="h-5 w-5"/>} label="Subsidy Apps" active={activeTab==='subsidy'} onClick={()=>setActiveTab('subsidy')} />
                        <TabButton icon={<CubeIcon className="h-5 w-5"/>} label="Procurement" active={activeTab==='procurement'} onClick={()=>setActiveTab('procurement')} />
                        <TabButton icon={<BanknotesIcon className="h-5 w-5"/>} label="Payments" active={activeTab==='payments'} onClick={()=>setActiveTab('payments')} />
                        <TabButton icon={<FolderIcon className="h-5 w-5"/>} label="Documents" active={activeTab==='documents'} onClick={()=>setActiveTab('documents')} />
                        <TabButton icon={<ShieldCheckIcon className="h-5 w-5"/>} label="Crop Insurance" active={activeTab==='insurance'} onClick={()=>setActiveTab('insurance')} />
                        <TabButton icon={<BookOpenIcon className="h-5 w-5"/>} label="Cultivation Log" active={activeTab==='cultivation'} onClick={()=>setActiveTab('cultivation')} />
                        <TabButton icon={<PaperAirplaneIcon className="h-5 w-5"/>} label="Farm Visits" active={activeTab==='visits'} onClick={()=>setActiveTab('visits')} />
                    </nav>
                </div>
            </div>

            <div className="lg:col-span-3">
                 <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 min-h-[500px]">
                    {renderTabContent()}
                 </div>
            </div>
        </div>
    );
};

export default FarmerPortal;
