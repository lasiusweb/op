import React, { useState, useMemo } from 'react';
import type { Farmer, LandParcel, SubsidyApplication, SubsidyApplicationStatus, ProcurementBatch, PlantationLog, PlantationActivityType, FarmVisitRequest, FarmVisitRequestStatus, FarmVisitUrgency } from '../types';
import { IdentificationIcon, CubeIcon, ReceiptPercentIcon, BookOpenIcon, ArrowLeftOnRectangleIcon, ClipboardDocumentListIcon, MapIcon as LandIcon, CalendarDaysIcon, PaperAirplaneIcon, ClockIcon } from '../components/Icons';

// --- PROPS ---
interface FarmerPortalProps {
    allFarmers: Farmer[];
    allLandParcels: LandParcel[];
    allSubsidyApps: SubsidyApplication[];
    allProcurementBatches: ProcurementBatch[];
    plantationLogs: PlantationLog[];
    farmVisitRequests: FarmVisitRequest[];
    onAddLog: (newLog: PlantationLog) => void;
    onAddVisitRequest: (newRequest: FarmVisitRequest) => void;
    setCurrentPage: (page: string) => void;
}

// --- STYLES ---
const subsidyStatusStyles: { [key in SubsidyApplicationStatus]: string } = {
    'Submitted': 'bg-blue-500/20 text-blue-300', 'Documents Pending': 'bg-yellow-500/20 text-yellow-300',
    'Under Review': 'bg-purple-500/20 text-purple-300', 'Approved': 'bg-green-500/20 text-green-300', 'Rejected': 'bg-red-500/20 text-red-300',
};
const paymentStatusStyles: { [key: string]: string } = {
    'Paid': 'bg-green-500/20 text-green-300', 'Pending': 'bg-yellow-500/20 text-yellow-300', 'Partial': 'bg-blue-500/20 text-blue-300',
};
const visitStatusStyles: { [key in FarmVisitRequestStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300',
    'Scheduled': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'Cancelled': 'bg-gray-500/20 text-gray-400',
};


// --- SUB-COMPONENTS ---
const PortalCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-teal-400">{icon}</div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex-grow text-gray-300">{children}</div>
    </div>
);

const FarmerLogin: React.FC<{ onLogin: (farmer: Farmer) => void; allFarmers: Farmer[] }> = ({ onLogin, allFarmers }) => {
    const [selectedFarmerId, setSelectedFarmerId] = useState<string>(allFarmers[0]?.id || '');

    const handleLogin = () => {
        const farmer = allFarmers.find(f => f.id === selectedFarmerId);
        if (farmer) {
            onLogin(farmer);
        }
    };

    return (
        <div className="flex items-center justify-center h-full -mt-16">
            <div className="w-full max-w-md text-center">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Farmer Self-Service Portal</h1>
                    <p className="text-gray-400 mb-6">Please select your name to access your dashboard.</p>
                    <select
                        value={selectedFarmerId}
                        onChange={(e) => setSelectedFarmerId(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6"
                    >
                        {allFarmers.map(farmer => (
                            <option key={farmer.id} value={farmer.id}>{farmer.fullName} ({farmer.id})</option>
                        ))}
                    </select>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                        Access My Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

const activityTypes: PlantationActivityType[] = ['Fertilizing', 'Pest Control', 'Weeding', 'Pruning', 'Soil Testing'];
const LogActivityCard: React.FC<{ farmer: Farmer; landParcels: LandParcel[]; onAddLog: (log: PlantationLog) => void; }> = ({ farmer, landParcels, onAddLog }) => {
    const [activity, setActivity] = useState<Partial<PlantationLog>>({ activityDate: new Date().toISOString().split('T')[0], landParcelId: landParcels[0]?.id || '' });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activity.landParcelId || !activity.activityType) {
            setMessage('Please select a parcel and activity type.');
            return;
        }
        const newLog: PlantationLog = {
            id: `PLOG-FARM${Date.now()}`,
            farmerId: farmer.id,
            landParcelId: activity.landParcelId,
            activityType: activity.activityType,
            activityDate: activity.activityDate!,
            performedById: farmer.assignedAgentId, // Logged by farmer, but agent is responsible.
            notes: `Logged by farmer: ${activity.notes || ''}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onAddLog(newLog);
        setMessage('Activity logged successfully!');
        setActivity({ activityDate: new Date().toISOString().split('T')[0], landParcelId: landParcels[0]?.id || '' });
        setTimeout(() => setMessage(''), 3000);
    };
    
    return (
        <PortalCard icon={<ClipboardDocumentListIcon />} title="Log a New Activity">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="landParcelId" value={activity.landParcelId} onChange={e => setActivity(a => ({...a, landParcelId: e.target.value}))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                        {landParcels.map(p => <option key={p.id} value={p.id}>Survey No: {p.surveyNumber}</option>)}
                    </select>
                    <select name="activityType" value={activity.activityType} onChange={e => setActivity(a => ({...a, activityType: e.target.value as PlantationActivityType}))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                         <option>Select Activity Type</option>
                         {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <input type="date" name="activityDate" value={activity.activityDate} onChange={e => setActivity(a => ({...a, activityDate: e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"/>
                <textarea name="notes" value={activity.notes || ''} onChange={e => setActivity(a => ({...a, notes: e.target.value}))} placeholder="Optional notes..." rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md">Log Activity</button>
                {message && <p className="text-center text-sm text-green-400">{message}</p>}
            </form>
        </PortalCard>
    );
};

const RequestVisitCard: React.FC<{
    farmer: Farmer;
    landParcels: LandParcel[];
    onAddVisitRequest: (request: FarmVisitRequest) => void;
}> = ({ farmer, landParcels, onAddVisitRequest }) => {
    const [request, setRequest] = useState({
        requestType: 'Pest/Disease Issue',
        urgency: 'Normal' as FarmVisitUrgency,
        landParcelId: landParcels[0]?.id || '',
        description: '',
    });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!request.landParcelId) {
            setMessage('Error: You must have a registered land parcel to make a request.');
            return;
        }
        const newRequest: FarmVisitRequest = {
            id: `FVR${Date.now()}`,
            farmerId: farmer.id,
            requestDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Pending',
            ...request
        };
        onAddVisitRequest(newRequest);
        setMessage('Request submitted successfully!');
        setRequest({
            requestType: 'Pest/Disease Issue',
            urgency: 'Normal' as FarmVisitUrgency,
            landParcelId: landParcels[0]?.id || '',
            description: '',
        });
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <PortalCard icon={<PaperAirplaneIcon />} title="Request a Field Visit">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={request.requestType} onChange={e => setRequest(r => ({ ...r, requestType: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                        <option>Pest/Disease Issue</option>
                        <option>Soil Health Query</option>
                        <option>Irrigation Problem</option>
                        <option>Harvesting Advice</option>
                        <option>General Consultation</option>
                        <option>Other</option>
                    </select>
                    <select value={request.urgency} onChange={e => setRequest(r => ({ ...r, urgency: e.target.value as FarmVisitUrgency }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                        <option value="Normal">Normal Urgency</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <select value={request.landParcelId} onChange={e => setRequest(r => ({ ...r, landParcelId: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                    {landParcels.length > 0 ? (
                        landParcels.map(p => <option key={p.id} value={p.id}>For Parcel: {p.surveyNumber}</option>)
                    ) : (
                        <option value="">No land parcels available</option>
                    )}
                </select>
                <textarea value={request.description} onChange={e => setRequest(r => ({...r, description: e.target.value}))} placeholder="Briefly describe your issue..." required rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition-colors" disabled={landParcels.length === 0}>Submit Request</button>
                {message && <p className={`text-center text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </form>
        </PortalCard>
    );
};

const RecentRequestsCard: React.FC<{ requests: FarmVisitRequest[] }> = ({ requests }) => (
    <PortalCard icon={<CalendarDaysIcon />} title="Recent Visit Requests">
        <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
            {requests.length > 0 ? requests.map(req => (
                <li key={req.id} className="p-3 bg-gray-700/50 rounded-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-white">{req.requestType}</p>
                            <p className="text-xs text-gray-400">Req: {new Date(req.requestDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${visitStatusStyles[req.status]}`}>{req.status}</span>
                    </div>
                </li>
            )) : <p className="text-gray-500 text-center mt-8">No visit requests found.</p>}
        </ul>
    </PortalCard>
);

const RecentActivitiesCard: React.FC<{ logs: PlantationLog[]; landParcels: LandParcel[] }> = ({ logs, landParcels }) => {
    const landParcelMap = useMemo(() => new Map(landParcels.map(p => [p.id, p.surveyNumber])), [landParcels]);
    
    return (
        <PortalCard icon={<ClockIcon />} title="My Recent Activities">
            <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                {logs.length > 0 ? logs.slice(0,5).map(log => (
                    <li key={log.id} className="p-3 bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-white">{log.activityType}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(log.activityDate).toLocaleDateString()} on Parcel: {landParcelMap.get(log.landParcelId) || 'N/A'}
                                </p>
                            </div>
                        </div>
                        {log.notes && log.notes !== 'Logged by farmer: ' && <p className="text-xs italic text-gray-300 mt-1">{log.notes.replace('Logged by farmer: ', '')}</p>}
                    </li>
                )) : <p className="text-gray-500 text-center mt-8">No recent activities logged.</p>}
            </ul>
        </PortalCard>
    );
};

const RequestVisitModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    farmer: Farmer;
    landParcels: LandParcel[];
    onAddVisitRequest: (request: FarmVisitRequest) => void;
}> = ({ isOpen, onClose, farmer, landParcels, onAddVisitRequest }) => {
    const [request, setRequest] = useState({
        requestType: 'Pest/Disease Issue',
        urgency: 'Normal' as FarmVisitUrgency,
        landParcelId: landParcels[0]?.id || '',
        description: '',
    });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!request.landParcelId) {
            setMessage('Error: You must have a registered land parcel to make a request.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        const newRequest: FarmVisitRequest = {
            id: `FVR${Date.now()}`,
            farmerId: farmer.id,
            requestDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Pending',
            ...request
        };
        onAddVisitRequest(newRequest);
        setMessage('Request submitted successfully!');
        
        // Reset form and close modal after a short delay
        setTimeout(() => {
            onClose();
            setRequest({
                requestType: 'Pest/Disease Issue',
                urgency: 'Normal' as FarmVisitUrgency,
                landParcelId: landParcels[0]?.id || '',
                description: '',
            });
            setMessage('');
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-white flex items-center gap-2"><PaperAirplaneIcon className="h-6 w-6 text-teal-400"/> Request a New Field Visit</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={request.requestType} onChange={e => setRequest(r => ({ ...r, requestType: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                            <option>Pest/Disease Issue</option>
                            <option>Soil Health Query</option>
                            <option>Irrigation Problem</option>
                            <option>Harvesting Advice</option>
                            <option>General Consultation</option>
                            <option>Other</option>
                        </select>
                        <select value={request.urgency} onChange={e => setRequest(r => ({ ...r, urgency: e.target.value as FarmVisitUrgency }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                            <option value="Normal">Normal Urgency</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <select value={request.landParcelId} onChange={e => setRequest(r => ({ ...r, landParcelId: e.target.value }))} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white w-full">
                        {landParcels.length > 0 ? (
                            landParcels.map(p => <option key={p.id} value={p.id}>For Parcel: {p.surveyNumber}</option>)
                        ) : (
                            <option value="">No land parcels available</option>
                        )}
                    </select>
                    <textarea value={request.description} onChange={e => setRequest(r => ({...r, description: e.target.value}))} placeholder="Briefly describe your issue..." required rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors" disabled={landParcels.length === 0}>Submit Request</button>
                    </div>
                     {message && <p className={`text-center text-sm pt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
                </form>
            </div>
        </div>
    );
};


// --- MAIN PORTAL COMPONENT ---
const FarmerPortal: React.FC<FarmerPortalProps> = ({ allFarmers, allLandParcels, allSubsidyApps, allProcurementBatches, plantationLogs, farmVisitRequests, onAddLog, onAddVisitRequest, setCurrentPage }) => {
    const [loggedInFarmer, setLoggedInFarmer] = useState<Farmer | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    if (!loggedInFarmer) {
        return <FarmerLogin onLogin={setLoggedInFarmer} allFarmers={allFarmers} />;
    }

    const farmerParcels = allLandParcels.filter(p => p.farmerId === loggedInFarmer.id);
    const farmerSubsidyApps = allSubsidyApps.filter(a => a.farmerId === loggedInFarmer.id);
    const farmerProcurements = allProcurementBatches.filter(b => b.farmerId === loggedInFarmer.id).sort((a,b) => new Date(b.procurementDate).getTime() - new Date(a.procurementDate).getTime()).slice(0, 5); // show recent 5
    const farmerVisitRequests = useMemo(() => 
        farmVisitRequests
            .filter(r => r.farmerId === loggedInFarmer.id)
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
            .slice(0, 3), 
    [farmVisitRequests, loggedInFarmer.id]);
    const farmerPlantationLogs = useMemo(() => 
        plantationLogs
            .filter(log => log.farmerId === loggedInFarmer.id)
            .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()),
    [plantationLogs, loggedInFarmer.id]);

    return (
        <div className="space-y-6">
            <RequestVisitModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                farmer={loggedInFarmer}
                landParcels={farmerParcels}
                onAddVisitRequest={onAddVisitRequest}
            />
            <header className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <div>
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <h1 className="text-2xl font-bold text-white">{loggedInFarmer.fullName}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span>Request Visit</span>
                    </button>
                    <button 
                        onClick={() => setLoggedInFarmer(null)}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PortalCard icon={<IdentificationIcon />} title="My Profile">
                    <div className="space-y-3 text-sm">
                        <div><p className="text-xs text-gray-500">Farmer ID</p><p>{loggedInFarmer.id}</p></div>
                        <div><p className="text-xs text-gray-500">Father's Name</p><p>{loggedInFarmer.fatherName}</p></div>
                        <div><p className="text-xs text-gray-500">Mobile</p><p>{loggedInFarmer.mobile}</p></div>
                        <div><p className="text-xs text-gray-500">Location</p><p>{loggedInFarmer.village}, {loggedInFarmer.mandal}</p></div>
                    </div>
                </PortalCard>

                <PortalCard icon={<LandIcon />} title="My Land Parcels">
                    <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                        {farmerParcels.length > 0 ? farmerParcels.map(p => (
                            <li key={p.id} className="p-3 bg-gray-700/50 rounded-md">
                                <p className="font-semibold text-white">Survey No: {p.surveyNumber}</p>
                                <p className="text-gray-400">{p.areaAcres} Acres - {p.irrigationSource}</p>
                            </li>
                        )) : <p className="text-gray-500 text-center mt-8">No land parcels found.</p>}
                    </ul>
                </PortalCard>

                <PortalCard icon={<ReceiptPercentIcon />} title="Subsidy Status">
                     <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                        {farmerSubsidyApps.length > 0 ? farmerSubsidyApps.map(app => (
                            <li key={app.id} className="p-3 bg-gray-700/50 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-white">{app.subsidyType}</p>
                                        <p className="text-xs text-gray-400">{app.id} on {app.applicationDate}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${subsidyStatusStyles[app.status]}`}>{app.status}</span>
                                </div>
                            </li>
                        )) : <p className="text-gray-500 text-center mt-8">No subsidy applications found.</p>}
                    </ul>
                </PortalCard>
                
                <div className="lg:col-span-3">
                    <PortalCard icon={<CubeIcon />} title="Recent Procurement History">
                        <ul className="space-y-2 text-sm pr-2">
                            {farmerProcurements.length > 0 ? farmerProcurements.map(p => (
                                <li key={p.id} className="p-3 bg-gray-700/50 rounded-md grid grid-cols-3 gap-2 items-center">
                                    <div>
                                        <p className="font-semibold text-white">{p.procurementDate}</p>
                                        <p className="text-xs text-gray-400">{p.id}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-400">{p.weightKg.toFixed(2)} Kg</p>
                                        <p className="font-semibold text-white">₹{p.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${paymentStatusStyles[p.paymentStatus]}`}>{p.paymentStatus}</span>
                                    </div>
                                </li>
                            )) : <p className="text-gray-500 text-center py-8">No procurement history found.</p>}
                        </ul>
                    </PortalCard>
                </div>
                
                <div className="lg:col-span-2">
                    <RequestVisitCard farmer={loggedInFarmer} landParcels={farmerParcels} onAddVisitRequest={onAddVisitRequest} />
                </div>

                <RecentRequestsCard requests={farmerVisitRequests} />

                <LogActivityCard farmer={loggedInFarmer} landParcels={farmerParcels} onAddLog={onAddLog} />

                <RecentActivitiesCard logs={farmerPlantationLogs} landParcels={farmerParcels} />
                
                <PortalCard icon={<BookOpenIcon />} title="Resources & Guides">
                    <p className="text-sm text-gray-400 mb-4">Access guides, best practices, and training materials to improve your yield.</p>
                     <button
                        onClick={() => setCurrentPage('knowledgeBase')}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        Go to Knowledge Base
                    </button>
                </PortalCard>
            </div>
        </div>
    );
};

export default FarmerPortal;