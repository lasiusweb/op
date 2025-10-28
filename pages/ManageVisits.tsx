import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import type { FarmVisitRequest, Farmer, LandParcel, User, FarmVisitRequestStatus, FarmVisitUrgency } from '../types';
import { mockUsers, mockFarmersData, mockLandParcels } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, ClipboardDocumentListIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';

interface ManageVisitsProps {
    allVisitRequests: FarmVisitRequest[];
    onAddRequest: (request: FarmVisitRequest) => void;
    onUpdateRequest: (request: FarmVisitRequest) => void;
    filterAgentId?: string | null;
}

const visitStatusStyles: { [key in FarmVisitRequestStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300', 'Scheduled': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300', 'Cancelled': 'bg-gray-500/20 text-gray-400',
};

const visitUrgencyStyles: { [key in FarmVisitUrgency]: string } = {
    'Normal': 'text-gray-300', 'Urgent': 'text-red-400 font-semibold',
};

const VisitModal: React.FC<{
    visit: Partial<FarmVisitRequest>;
    onSave: (visit: Partial<FarmVisitRequest>) => void;
    onCancel: () => void;
}> = ({ visit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(visit);
    
    const farmers = mockFarmersData;
    const landParcels = useMemo(() => mockLandParcels.filter(lp => lp.farmerId === formData.farmerId), [formData.farmerId]);
    const fieldAgents = useMemo(() => mockUsers.filter(u => u.role === 'Field Agent'), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                <h2 className="text-xl font-bold text-white mb-4">{visit.id ? 'Edit Visit Request' : 'Add New Visit Request'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="farmerId" value={formData.farmerId || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            <option value="">Select Farmer</option>
                            {farmers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                        </select>
                        <select name="landParcelId" value={formData.landParcelId || ''} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" disabled={!formData.farmerId}>
                            <option value="">Select Parcel</option>
                            {landParcels.map(p => <option key={p.id} value={p.id}>{p.surveyNumber}</option>)}
                        </select>
                        <input type="text" name="requestType" value={formData.requestType || ''} onChange={handleChange} required placeholder="Visit Purpose (e.g., Pest Issue)" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        <select name="urgency" value={formData.urgency || 'Normal'} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                         <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="Description..." className="md:col-span-2 bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                        <select name="assignedAgentId" value={formData.assignedAgentId || ''} onChange={handleChange} className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                             <option value="">Assign Agent (Optional)</option>
                             {fieldAgents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                        </select>
                        <input type="date" name="visitDate" value={formData.visitDate || ''} onChange={handleChange} title="Scheduled Visit Date" className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500"/>
                         <select name="status" value={formData.status || 'Pending'} onChange={handleChange} required className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500">
                           {Object.keys(visitStatusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <textarea name="agentNotes" value={formData.agentNotes || ''} onChange={handleChange} rows={3} placeholder="Agent Notes (Optional)..." className="md:col-span-2 bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-teal-500" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageVisits: React.FC<ManageVisitsProps> = ({ allVisitRequests, onAddRequest, onUpdateRequest, filterAgentId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVisit, setCurrentVisit] = useState<Partial<FarmVisitRequest> | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<FarmVisitRequestStatus | 'All'>('All');
    const [filterAgent, setFilterAgent] = useState<string>(filterAgentId || 'All');
    
    useEffect(() => {
        setFilterAgent(filterAgentId || 'All');
    }, [filterAgentId]);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const landParcelMap = useMemo(() => new Map(mockLandParcels.map(p => [p.id, p.surveyNumber])), []);
    const userMap = useMemo(() => new Map(mockUsers.map(u => [u.id, u.fullName])), []);
    const fieldAgents = useMemo(() => mockUsers.filter(u => u.role === 'Field Agent'), []);
    const initialAgentName = useMemo(() => {
        if (!filterAgentId) return null;
        return userMap.get(filterAgentId) || null;
    }, [filterAgentId, userMap]);

    const handleOpenModal = (visit?: FarmVisitRequest) => {
        setCurrentVisit(visit || { requestDate: new Date().toISOString(), status: 'Pending', urgency: 'Normal' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = (visitData: Partial<FarmVisitRequest>) => {
        const now = new Date().toISOString();
        if (visitData.id) {
            onUpdateRequest({ ...visitData, updatedAt: now } as FarmVisitRequest);
        } else {
            onAddRequest({
                id: `FVR-M${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...visitData,
            } as FarmVisitRequest);
        }
        handleCloseModal();
    };
    
    const filteredRequests = useMemo(() => {
        return allVisitRequests.filter(req => 
            (filterStatus === 'All' || req.status === filterStatus) &&
            (filterAgent === 'All' || req.assignedAgentId === filterAgent)
        ).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [allVisitRequests, filterStatus, filterAgent]);

    return (
        <DashboardCard title="Manage Farmer Visits" icon={<ClipboardDocumentListIcon />}>
            {isModalOpen && currentVisit && <VisitModal visit={currentVisit} onSave={handleSave} onCancel={handleCloseModal} />}

            {initialAgentName && filterAgent === filterAgentId && (
                <div className="bg-teal-900/50 text-teal-300 text-sm px-4 py-2 rounded-md mb-4">
                    Showing visits for: <strong>{initialAgentName}</strong>. Change the agent filter below to see others.
                </div>
            )}
            
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="All">All Statuses</option>
                        {Object.keys(visitStatusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="All">All Agents</option>
                        {fieldAgents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                    </select>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Add New Visit</button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th className="px-6 py-3">Request ID</th>
                            <th className="px-6 py-3">Farmer</th>
                            <th className="px-6 py-3">Purpose</th>
                            <th className="px-6 py-3">Urgency</th>
                            <th className="px-6 py-3">Agent</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <React.Fragment key={req.id}>
                                <tr className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-mono text-white">{req.id}</td>
                                    <td className="px-6 py-4 text-white">{farmerMap.get(req.farmerId) || 'N/A'}</td>
                                    <td className="px-6 py-4">{req.requestType}</td>
                                    <td className={`px-6 py-4 ${visitUrgencyStyles[req.urgency]}`}>{req.urgency}</td>
                                    <td className="px-6 py-4">{userMap.get(req.assignedAgentId || '') || <span className="text-gray-500">Unassigned</span>}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${visitStatusStyles[req.status]}`}>{req.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setExpandedRowId(expandedRowId === req.id ? null : req.id)} className="font-medium text-teal-400 hover:text-teal-300">
                                                {expandedRowId === req.id ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                                            </button>
                                            <button onClick={() => handleOpenModal(req)} className="font-medium text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRowId === req.id && (
                                    <tr className="bg-gray-900/50">
                                        <td colSpan={7} className="p-4">
                                            <div className="bg-gray-800/50 p-4 rounded-lg space-y-3 text-sm">
                                                <p><strong className="text-gray-400">Parcel Survey No:</strong> {landParcelMap.get(req.landParcelId)}</p>
                                                <p><strong className="text-gray-400">Request Date:</strong> {new Date(req.requestDate).toLocaleString()}</p>
                                                {req.visitDate && <p><strong className="text-gray-400">Scheduled Visit Date:</strong> {req.visitDate}</p>}
                                                <div><strong className="text-gray-400">Description:</strong><p className="pl-2 italic text-gray-300">{req.description || 'N/A'}</p></div>
                                                <div><strong className="text-gray-400">Agent Notes:</strong><p className="pl-2 italic text-gray-300">{req.agentNotes || 'N/A'}</p></div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default ManageVisits;