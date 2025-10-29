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
const activityTypes: CultivationActivityType[] = ['Fertilizing', 'Pest Control', 'Weeding', 'Pruning', 'Soil Testing'];


// --- SUB-COMPONENTS ---
const PortalCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-teal-400">{icon}</div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="flex-grow text-gray-300">{children}</div>
    </div>
);

const FarmerLogin: React.FC<{ onLogin: (farmer: Farmer) => void; allFarmers: Farmer[] }> = ({ onLogin, allFarmers }) => {
    const [selectedFarmerId, setSelectedFarmerId] = useState<string>(allFarmers[0]?.id || '');
    const handleLogin = () => {
        const farmer = allFarmers.find(f => f.id === selectedFarmerId);
        if (farmer) onLogin(farmer);
    };
    return (
        <div className="flex items-center justify-center h-full -mt-16">
            <div className="w-full max-w-md text-center">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Farmer Self-Service Portal</h1>
                    <p className="text-gray-400 mb-6">Please select your name to access your dashboard.</p>
                    <select value={selectedFarmerId} onChange={(e) => setSelectedFarmerId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6">
                        {allFarmers.map(farmer => <option key={farmer.id} value={farmer.id}>{farmer.fullName} ({farmer.id})</option>)}
                    </select>
                    <button onClick={handleLogin} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors">Access My Portal</button>
                </div>
            </div>
        </div>
    );
};

const ProfileUpdateRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    farmer: Farmer;
    onAddRequest: (request: FarmerProfileChangeRequest) => void;
}> = ({ isOpen, onClose, farmer, onAddRequest }) => {
    const [changes, setChanges] = useState<Partial<Pick<Farmer, 'mobile' | 'bankName' | 'bankAccountNumber' | 'ifscCode'>>>({});
    const [message, setMessage] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(changes).length === 0) {
            setMessage('Please enter at least one change to submit.');
            return;
        }
        const newRequest: FarmerProfileChangeRequest = {
            id: `FPCR-${Date.now()}`,
            farmerId: farmer.id,
            requestDate: new Date().toISOString(),
            status: 'Pending',
            requestedChanges: changes,
        };
        onAddRequest(newRequest);
        setMessage('Your request has been submitted for review.');
        setTimeout(() => {
            onClose();
            setMessage('');
            setChanges({});
        }, 2000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only add to changes if it's different from original
        if (value !== (farmer as any)[name]) {
            setChanges(prev => ({ ...prev, [name]: value }));
        } else {
            // Remove from changes if it's reverted back to original
            setChanges(prev => {
                const newChanges = { ...prev };
                delete (newChanges as any)[name];
                return newChanges;
            });
        }
    };
    
    const fields: (keyof typeof changes)[] = ['mobile', 'bankName', 'bankAccountNumber', 'ifscCode'];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Request Profile Update</h2>
                <p className="text-sm text-gray-400 mb-4">Enter the new information for the fields you wish to change. Your request will be sent for administrative approval.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field}>
                            <label htmlFor={field} className="text-xs text-gray-400 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                id={field}
                                name={field}
                                type="text"
                                defaultValue={(farmer as any)[field]}
                                onChange={handleInputChange}
                                className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md">Submit Request</button>
                    </div>
                    {message && <p className="text-center text-sm text-green-400 pt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
};

// --- PORTAL CARDS (LOGIC-HEAVY) ---
const ProfileCard: React.FC<{ farmer: Farmer; landParcels: LandParcel[]; onUpdateRequest: () => void }> = ({ farmer, landParcels, onUpdateRequest }) => (
    <PortalCard icon={<IdentificationIcon />} title="My Profile & Land" className="md:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 text-sm">
                <p><strong className="text-gray-400 block">Farmer ID:</strong> {farmer.id}</p>
                <p><strong className="text-gray-400 block">Mobile:</strong> {farmer.mobile}</p>
                <p><strong className="text-gray-400 block">Location:</strong> {farmer.village}, {farmer.mandal}</p>
                <p><strong className="text-gray-400 block">Bank:</strong> {farmer.bankName} - ************{farmer.bankAccountNumber.slice(-4)}</p>
            </div>
             <div className="space-y-3 text-sm">
                <p className="font-semibold text-gray-300">Registered Land Parcels:</p>
                <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {landParcels.length > 0 ? landParcels.map(p => (
                        <li key={p.id} className="p-2 bg-gray-700/50 rounded-md">
                            <p className="font-semibold text-white">Survey No: {p.surveyNumber}</p>
                            <p className="text-gray-400 text-xs">{p.areaAcres} Acres - {p.irrigationSource}</p>
                        </li>
                    )) : <p className="text-gray-500">No land parcels found.</p>}
                </ul>
            </div>
        </div>
        <button onClick={onUpdateRequest} className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors text-sm">
            <PencilIcon className="h-4 w-4" /> Request Profile Update
        </button>
    </PortalCard>
);

const FinancialLedgerCard: React.FC<{ subsidies: SubsidyApplication[], procurements: ProcurementBatch[], payments: Payment[] }> = ({ subsidies, procurements, payments }) => {
    const { totalEarned, totalPaid, balance } = useMemo(() => {
        const earnedFromProcurement = procurements.reduce((sum, p) => sum + p.totalAmount, 0);
        const earnedFromSubsidies = subsidies.filter(s => s.status === 'Approved').reduce((sum, s) => sum + (s.approvedAmount || 0), 0);
        const totalEarned = earnedFromProcurement + earnedFromSubsidies;
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        return { totalEarned, totalPaid, balance: totalEarned - totalPaid };
    }, [procurements, subsidies, payments]);

    const transactions = useMemo(() => {
        const procurementCredits = procurements.map(p => ({
            id: p.id, date: p.procurementDate, description: `Procurement Batch (${p.weightKg.toFixed(2)} Kg)`, amount: p.totalAmount, type: 'credit' as const
        }));
        const paymentDebits = payments.map(p => ({
            id: p.id, date: p.paymentDate, description: `Payment Received (Txn: ${p.transactionId})`, amount: p.amount, type: 'debit' as const
        }));
        return [...procurementCredits, ...paymentDebits].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [procurements, payments]);

    return (
        <PortalCard icon={<BanknotesIcon />} title="Financial Ledger" className="md:col-span-2">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div><p className="text-xs text-gray-400">Total Earned</p><p className="font-semibold text-lg text-green-400">₹{totalEarned.toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-gray-400">Total Paid</p><p className="font-semibold text-lg text-white">₹{totalPaid.toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-gray-400">Outstanding</p><p className="font-semibold text-lg text-yellow-400">₹{balance.toLocaleString('en-IN')}</p></div>
            </div>
             <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-300">Transaction History:</p>
                <button onClick={() => alert("Coming soon: Downloadable PDF statements.")} className="text-xs text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download Statement
                </button>
            </div>
            <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                {transactions.length > 0 ? transactions.map(t => (
                    <li key={`${t.type}-${t.id}`} className="flex justify-between items-center p-2 bg-gray-700/50 rounded-md">
                        <div>
                            <p className="font-medium text-white">{t.description}</p>
                            <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-semibold ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                            {t.type === 'credit' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                        </p>
                    </li>
                )) : <p className="text-gray-500 text-center py-8">No recent transactions.</p>}
            </ul>
        </PortalCard>
    );
};

const DocumentManagerCard: React.FC<{ documents: Document[] }> = ({ documents }) => (
    <PortalCard icon={<FolderIcon />} title="Document Manager">
        <p className="text-xs text-gray-400 mb-2">Status of documents submitted for subsidies.</p>
        <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2 mb-3">
            {documents.length > 0 ? documents.map(doc => (
                <li key={doc.id} className="flex justify-between items-center p-2 bg-gray-700/50 rounded-md">
                    <span className="text-white">{doc.documentType}</span>
                    <span className={`font-semibold text-xs ${documentStatusStyles[doc.status]}`}>{doc.status}</span>
                </li>
            )) : <p className="text-gray-500 text-center py-8">No documents on file.</p>}
        </ul>
         <button onClick={() => alert("Coming soon: Document upload functionality.")} className="w-full text-sm bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1.5 rounded-md">Upload New Document</button>
    </PortalCard>
);

const CropInsuranceCard: React.FC<{ policy?: CropInsurancePolicy }> = ({ policy }) => (
    <PortalCard icon={<ShieldCheckIcon />} title="Crop Insurance">
        {policy ? (
            <div className="space-y-2 text-sm">
                <p><strong className="text-gray-400 block">Policy #:</strong> {policy.policyNumber}</p>
                <p><strong className="text-gray-400 block">Insurer:</strong> {policy.insurer}</p>
                <p><strong className="text-gray-400 block">Coverage:</strong> ₹{policy.sumInsured.toLocaleString('en-IN')}</p>
                <p><strong className="text-gray-400 block">Expires:</strong> {new Date(policy.endDate).toLocaleDateString()}</p>
                <button onClick={() => alert("Coming soon: Simplified claim initiation.")} className="mt-2 w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-md">Initiate Claim</button>
            </div>
        ) : <p className="text-gray-500 text-center mt-8">No active crop insurance policy found.</p>}
    </PortalCard>
);

const WeatherAdvisoryCard: React.FC = () => (
    <PortalCard icon={<SunIcon />} title="Weather & Advisory">
        <div className="text-center">
            <p className="text-4xl font-bold text-white">32°C</p>
            <p className="text-yellow-300">Sunny</p>
            <p className="text-xs text-gray-400">Warangal, Telangana</p>
        </div>
        <div className="mt-4 p-2 bg-blue-900/30 rounded-md text-xs text-blue-200 text-center">
            <strong>Advisory:</strong> Ensure adequate irrigation. Low chance of rain for the next 48 hours.
        </div>
    </PortalCard>
);

const MarketInfoCard: React.FC = () => (
     <PortalCard icon={<BanknotesIcon />} title="Market Information">
        <div className="text-center">
            <p className="text-sm text-gray-400">Current FFB Rate</p>
            <p className="text-3xl font-bold text-green-400 my-1">₹21,500</p>
            <p className="text-sm text-gray-400">per Tonne</p>
             <p className="text-xs text-gray-500 mt-4">Last updated: Today, 9:00 AM</p>
        </div>
    </PortalCard>
);

// --- MAIN PORTAL COMPONENT ---
const FarmerPortal: React.FC<FarmerPortalProps> = ({ 
    allFarmers, allLandParcels, allSubsidyApps, allProcurementBatches, allPayments, allDocuments, allCropInsurancePolicies,
    cultivationLogs, farmVisitRequests, onAddLog, onAddVisitRequest, onAddProfileChangeRequest, setCurrentPage 
}) => {
    const [loggedInFarmer, setLoggedInFarmer] = useState<Farmer | null>(null);
    const [isProfileUpdateModalOpen, setIsProfileUpdateModalOpen] = useState(false);

    if (!loggedInFarmer) {
        return <FarmerLogin onLogin={setLoggedInFarmer} allFarmers={allFarmers} />;
    }

    // Filter all data for the logged-in farmer once
    const farmerData = useMemo(() => ({
        parcels: allLandParcels.filter(p => p.farmerId === loggedInFarmer.id),
        subsidyApps: allSubsidyApps.filter(a => a.farmerId === loggedInFarmer.id),
        procurements: allProcurementBatches.filter(b => b.farmerId === loggedInFarmer.id),
        payments: allPayments.filter(p => p.farmerId === loggedInFarmer.id),
        documents: allDocuments.filter(d => allSubsidyApps.some(a => a.id === d.subsidyApplicationId && a.farmerId === loggedInFarmer.id)),
        insurancePolicy: allCropInsurancePolicies.find(p => p.farmerId === loggedInFarmer.id),
        visitRequests: farmVisitRequests.filter(r => r.farmerId === loggedInFarmer.id).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
        cultivationLogs: cultivationLogs.filter(l => l.farmerId === loggedInFarmer.id).sort((a,b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()),
    }), [loggedInFarmer.id, allLandParcels, allSubsidyApps, allProcurementBatches, allPayments, allDocuments, allCropInsurancePolicies, farmVisitRequests, cultivationLogs]);

    return (
        <div className="space-y-6">
            <ProfileUpdateRequestModal isOpen={isProfileUpdateModalOpen} onClose={() => setIsProfileUpdateModalOpen(false)} farmer={loggedInFarmer} onAddRequest={onAddProfileChangeRequest} />

            <header className="flex flex-wrap justify-between items-center gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <div>
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <h1 className="text-2xl font-bold text-white">{loggedInFarmer.fullName}</h1>
                </div>
                <button onClick={() => setLoggedInFarmer(null)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" /><span>Logout</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <ProfileCard farmer={loggedInFarmer} landParcels={farmerData.parcels} onUpdateRequest={() => setIsProfileUpdateModalOpen(true)} />
                <FinancialLedgerCard subsidies={farmerData.subsidyApps} procurements={farmerData.procurements} payments={farmerData.payments} />
                <WeatherAdvisoryCard />
                <MarketInfoCard />
                <CropInsuranceCard policy={farmerData.insurancePolicy} />
                <DocumentManagerCard documents={farmerData.documents} />

                <PortalCard icon={<ReceiptPercentIcon />} title="Subsidy Status" className="md:col-span-2">
                     <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                        {farmerData.subsidyApps.length > 0 ? farmerData.subsidyApps.map(app => (
                            <li key={app.id} className="p-3 bg-gray-700/50 rounded-md flex justify-between items-start">
                                <div><p className="font-semibold text-white">{app.subsidyType}</p><p className="text-xs text-gray-400">{app.id} on {app.applicationDate}</p></div>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${subsidyStatusStyles[app.status]}`}>{app.status}</span>
                            </li>
                        )) : <p className="text-gray-500 text-center mt-8">No subsidy applications found.</p>}
                    </ul>
                </PortalCard>
                
                <PortalCard icon={<CubeIcon />} title="Recent Procurement" className="md:col-span-2">
                    <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                        {farmerData.procurements.slice(0, 5).map(p => (
                            <li key={p.id} className="p-3 bg-gray-700/50 rounded-md grid grid-cols-3 gap-2 items-center">
                                <div><p className="font-semibold text-white">{p.procurementDate}</p><p className="text-xs text-gray-400">{p.id}</p></div>
                                <div className="text-center"><p className="text-gray-400">{p.weightKg.toFixed(2)} Kg</p><p className="font-semibold text-white">₹{p.totalAmount.toLocaleString('en-IN')}</p></div>
                                <div className="text-right"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${paymentStatusStyles[p.paymentStatus]}`}>{p.paymentStatus}</span></div>
                            </li>
                        )) }
                        {farmerData.procurements.length === 0 && <p className="text-gray-500 text-center py-8">No procurement history found.</p>}
                    </ul>
                </PortalCard>

                <PortalCard icon={<ClipboardDocumentListIcon />} title="Log Activity" className="md:col-span-2">
                    <LogActivityCard farmer={loggedInFarmer} landParcels={farmerData.parcels} onAddLog={onAddLog} />
                </PortalCard>
                
                <PortalCard icon={<PaperAirplaneIcon />} title="Request a Visit" className="md:col-span-2">
                    <RequestVisitCard farmer={loggedInFarmer} landParcels={farmerData.parcels} onAddVisitRequest={onAddVisitRequest} />
                </PortalCard>

                <PortalCard icon={<ClockIcon />} title="My Recent Activities">
                    <RecentActivitiesCard logs={farmerData.cultivationLogs} landParcels={farmerData.parcels} />
                </PortalCard>
                
                <PortalCard icon={<CalendarDaysIcon />} title="Recent Visit Requests">
                     <RecentRequestsCard requests={farmerData.visitRequests.slice(0,5)} />
                </PortalCard>
                
                <PortalCard icon={<BookOpenIcon />} title="Resources & Guides" className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-4">Access guides, best practices, and training materials to improve your yield.</p>
                     <button onClick={() => setCurrentPage('knowledgeBase')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Go to Knowledge Base</button>
                </PortalCard>
            </div>
        </div>
    );
};


// Helper sub-components that were part of the old structure, now integrated into the main component's logic or replaced by more specific cards.
// They are kept here but enhanced for reusability.
const LogActivityCard: React.FC<{ farmer: Farmer; landParcels: LandParcel[]; onAddLog: (log: CultivationLog) => void; }> = ({ farmer, landParcels, onAddLog }) => {
    const [activity, setActivity] = useState<Partial<CultivationLog>>({ activityDate: new Date().toISOString().split('T')[0], landParcelId: landParcels[0]?.id || '' });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activity.landParcelId || !activity.activityType) {
            setMessage('Please select a parcel and activity type.'); return;
        }
        const newLog: CultivationLog = {
            id: `PLOG-FARM${Date.now()}`, farmerId: farmer.id, landParcelId: activity.landParcelId, activityType: activity.activityType,
            activityDate: activity.activityDate!, performedById: farmer.id, // Logged by farmer
            notes: `Logged by farmer: ${activity.notes || ''}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        onAddLog(newLog);
        setMessage('Activity logged successfully!');
        setActivity({ activityDate: new Date().toISOString().split('T')[0], landParcelId: landParcels[0]?.id || '' });
        setTimeout(() => setMessage(''), 3000);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="landParcelId" value={activity.landParcelId} onChange={e => setActivity(a => ({...a, landParcelId: e.target.value}))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                    {landParcels.map(p => <option key={p.id} value={p.id}>Survey No: {p.surveyNumber}</option>)}
                </select>
                <select name="activityType" value={activity.activityType} onChange={e => setActivity(a => ({...a, activityType: e.target.value as CultivationActivityType}))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                     <option>Select Activity Type</option>
                     {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
             <input type="date" name="activityDate" value={activity.activityDate} onChange={e => setActivity(a => ({...a, activityDate: e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"/>
            <textarea name="notes" value={activity.notes || ''} onChange={e => setActivity(a => ({...a, notes: e.target.value}))} placeholder="Optional notes..." rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md">Log Activity</button>
            {message && <p className="text-center text-sm text-green-400">{message}</p>}
        </form>
    );
};

const RequestVisitCard: React.FC<{ farmer: Farmer; landParcels: LandParcel[]; onAddVisitRequest: (request: FarmVisitRequest) => void;}> = ({ farmer, landParcels, onAddVisitRequest }) => {
    const [request, setRequest] = useState({ requestType: 'Pest/Disease Issue', urgency: 'Normal' as FarmVisitUrgency, landParcelId: landParcels[0]?.id || '', description: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!request.landParcelId) { setMessage('Error: Must have a registered land parcel.'); return; }
        const newRequest: FarmVisitRequest = {
            id: `FVR${Date.now()}`, farmerId: farmer.id, requestDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'Pending', ...request
        };
        onAddVisitRequest(newRequest);
        setMessage('Request submitted!');
        setRequest({ requestType: 'Pest/Disease Issue', urgency: 'Normal' as FarmVisitUrgency, landParcelId: landParcels[0]?.id || '', description: '' });
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={request.requestType} onChange={e => setRequest(r => ({ ...r, requestType: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                    <option>Pest/Disease Issue</option><option>Soil Health Query</option><option>Irrigation Problem</option><option>Harvesting Advice</option><option>Other</option>
                </select>
                <select value={request.urgency} onChange={e => setRequest(r => ({ ...r, urgency: e.target.value as FarmVisitUrgency }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>
            <select value={request.landParcelId} onChange={e => setRequest(r => ({ ...r, landParcelId: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                {landParcels.length > 0 ? (landParcels.map(p => <option key={p.id} value={p.id}>Parcel: {p.surveyNumber}</option>)) : (<option value="">No parcels</option>)}
            </select>
            <textarea value={request.description} onChange={e => setRequest(r => ({...r, description: e.target.value}))} placeholder="Briefly describe your issue..." required rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md" disabled={landParcels.length === 0}>Submit Request</button>
            {message && <p className={`text-center text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
        </form>
    );
};

const RecentRequestsCard: React.FC<{ requests: FarmVisitRequest[] }> = ({ requests }) => (
    <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
        {requests.length > 0 ? requests.map(req => (
            <li key={req.id} className="p-3 bg-gray-700/50 rounded-md">
                <div className="flex justify-between items-start">
                    <div><p className="font-semibold text-white">{req.requestType}</p><p className="text-xs text-gray-400">Req: {new Date(req.requestDate).toLocaleDateString()}</p></div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${visitStatusStyles[req.status]}`}>{req.status}</span>
                </div>
            </li>
        )) : <p className="text-gray-500 text-center mt-8">No visit requests found.</p>}
    </ul>
);

const RecentActivitiesCard: React.FC<{ logs: CultivationLog[]; landParcels: LandParcel[] }> = ({ logs, landParcels }) => {
    const landParcelMap = useMemo(() => new Map(landParcels.map(p => [p.id, p.surveyNumber])), [landParcels]);
    return (
        <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
            {logs.length > 0 ? logs.slice(0,5).map(log => (
                <li key={log.id} className="p-3 bg-gray-700/50 rounded-md">
                    <div className="flex justify-between items-start">
                        <div><p className="font-semibold text-white">{log.activityType}</p><p className="text-xs text-gray-400">{new Date(log.activityDate).toLocaleDateString()} on Parcel: {landParcelMap.get(log.landParcelId) || 'N/A'}</p></div>
                    </div>
                </li>
            )) : <p className="text-gray-500 text-center mt-8">No recent activities logged.</p>}
        </ul>
    );
};


export default FarmerPortal;