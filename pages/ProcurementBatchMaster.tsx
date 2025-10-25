
import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import type { ProcurementBatch, Farmer, Location, Payment } from '../types';
import { mockProcurementBatches, mockFarmersData, mockLocations, mockPayments } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, ScaleIcon, CreditCardIcon } from '../components/Icons';

const AddPaymentModal: React.FC<{
    batch: ProcurementBatch;
    farmerName: string;
    onSave: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}> = ({ batch, farmerName, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>>({
        procurementBatchId: batch.id,
        farmerId: batch.farmerId,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        status: 'Success',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['amount'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData.amount && formData.amount > 0) {
            onSave(formData as Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>);
        } else {
            alert('Please enter a valid amount.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex justify-center items-center p-4" onClick={onCancel}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Add New Payment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Batch ID</label>
                            <input type="text" value={batch.id} readOnly className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Farmer Name</label>
                            <input type="text" value={farmerName} readOnly className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-300">Payment Date</label>
                            <input type="date" name="paymentDate" id="paymentDate" value={formData.paymentDate} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount (₹)</label>
                            <input type="number" step="0.01" name="amount" id="amount" value={formData.amount || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300">Transaction ID</label>
                            <input type="text" name="transactionId" id="transactionId" value={formData.transactionId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">Payment Method</label>
                            <select name="paymentMethod" id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm">
                                <option value="Success">Success</option>
                                <option value="Failed">Failed</option>
                                <option value="Processing">Processing</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ProcurementBatchModal: React.FC<{
    batch: Partial<ProcurementBatch>;
    farmers: Farmer[];
    locations: Location[];
    onSave: (batch: Partial<ProcurementBatch>) => void;
    onCancel: () => void;
}> = ({ batch, farmers, locations, onSave, onCancel }) => {
    const [formData, setFormData] = useState(batch);

    useEffect(() => {
        const weight = typeof formData.weightKg === 'number' ? formData.weightKg : 0;
        const price = typeof formData.pricePerKg === 'number' ? formData.pricePerKg : 0;
        setFormData(prev => ({ ...prev, totalAmount: weight * price }));
    }, [formData.weightKg, formData.pricePerKg]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['weightKg', 'pricePerKg', 'oilContentPercentage'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const procurementCenters = locations.filter(l => l.type === 'Procurement Center');

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">{batch.id ? 'Edit Procurement Batch' : 'Add New Procurement Batch'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="farmerId" className="block text-sm font-medium text-gray-300">Farmer</label>
                            <select name="farmerId" id="farmerId" value={formData.farmerId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select Farmer</option>
                                {farmers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="procurementCenterId" className="block text-sm font-medium text-gray-300">Procurement Center</label>
                            <select name="procurementCenterId" id="procurementCenterId" value={formData.procurementCenterId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select Center</option>
                                {procurementCenters.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="procurementDate" className="block text-sm font-medium text-gray-300">Procurement Date</label>
                            <input type="date" name="procurementDate" id="procurementDate" value={formData.procurementDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="weightKg" className="block text-sm font-medium text-gray-300">Weight (Kg)</label>
                            <input type="number" step="0.01" name="weightKg" id="weightKg" value={formData.weightKg || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-300">Price / Kg (₹)</label>
                            <input type="number" step="0.01" name="pricePerKg" id="pricePerKg" value={formData.pricePerKg || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-300">Total Amount (₹)</label>
                            <input type="text" name="totalAmount" id="totalAmount" value={formData.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'} readOnly className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="qualityGrade" className="block text-sm font-medium text-gray-300">Quality Grade</label>
                            <select name="qualityGrade" id="qualityGrade" value={formData.qualityGrade || 'A'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="oilContentPercentage" className="block text-sm font-medium text-gray-300">Oil Content (%)</label>
                            <input type="number" step="0.1" name="oilContentPercentage" id="oilContentPercentage" value={formData.oilContentPercentage || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-300">Payment Status</label>
                            <select name="paymentStatus" id="paymentStatus" value={formData.paymentStatus || 'Pending'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="Pending">Pending</option>
                                <option value="Partial">Partial</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Batch</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ProcurementBatchMaster: React.FC = () => {
    const [batches, setBatches] = useState<ProcurementBatch[]>(mockProcurementBatches);
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBatch, setCurrentBatch] = useState<Partial<ProcurementBatch> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState<'All' | 'A' | 'B' | 'C'>('All');
    const [filterPayment, setFilterPayment] = useState<'All' | 'Paid' | 'Pending' | 'Partial'>('All');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [selectedBatchForPayments, setSelectedBatchForPayments] = useState<ProcurementBatch | null>(null);

    const farmerMap = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f.fullName])), []);
    const locationMap = useMemo(() => new Map(mockLocations.map(l => [l.id, l.name])), []);

    const PaymentDetailsModal: React.FC<{
        batch: ProcurementBatch;
        payments: Payment[];
        onClose: () => void;
        onAddPayment: () => void;
    }> = ({ batch, payments, onClose, onAddPayment }) => {
        const farmerName = farmerMap.get(batch.farmerId) || 'N/A';
        const totalPaid = payments.reduce((sum, p) => sum + (p.status === 'Success' ? p.amount : 0), 0);
        const balanceDue = batch.totalAmount - totalPaid;
    
        const paymentStatusStyles: { [key: string]: string } = {
            'Success': 'bg-green-500/20 text-green-300',
            'Failed': 'bg-red-500/20 text-red-300',
            'Processing': 'bg-blue-500/20 text-blue-300',
        };
    
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
                <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Payment Details for Batch <span className="text-teal-400">{batch.id}</span></h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Farmer</p>
                            <p className="font-semibold text-white">{farmerName}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-400 uppercase">Total Amount</p>
                            <p className="font-semibold text-white">₹{batch.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Amount Paid</p>
                            <p className="font-semibold text-green-400">₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Balance Due</p>
                            <p className={`font-semibold ${balanceDue > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
    
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Transaction History</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-700/50 max-h-64">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-800 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Transaction ID</th>
                                    <th scope="col" className="px-6 py-3">Payment Date</th>
                                    <th scope="col" className="px-6 py-3">Method</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount (₹)</th>
                                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/50">
                                {payments.length > 0 ? payments.map(payment => (
                                    <tr key={payment.id} className="border-b border-gray-700">
                                        <td className="px-6 py-4 font-mono text-white">{payment.transactionId}</td>
                                        <td className="px-6 py-4">{payment.paymentDate}</td>
                                        <td className="px-6 py-4">{payment.paymentMethod}</td>
                                        <td className="px-6 py-4 text-right font-mono text-white">{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusStyles[payment.status]}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">No payment records found for this batch.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={onAddPayment} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Add Payment</button>
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleOpenModal = (batch?: ProcurementBatch) => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentBatch(batch || { status: 'Active', procurementDate: today });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBatch(null);
    };
    
    const handleViewPayments = (batch: ProcurementBatch) => {
        setSelectedBatchForPayments(batch);
        setIsPaymentModalOpen(true);
    };
    
    const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newPayment: Payment = {
            id: `PAY${Date.now()}`,
            createdAt: now,
            updatedAt: now,
            ...paymentData,
        };
        const updatedPayments = [...payments, newPayment];
        setPayments(updatedPayments);

        // Update batch payment status
        const relatedBatch = batches.find(b => b.id === newPayment.procurementBatchId);
        if (relatedBatch) {
            const batchPayments = updatedPayments.filter(p => p.procurementBatchId === relatedBatch.id && p.status === 'Success');
            const totalPaid = batchPayments.reduce((sum, p) => sum + p.amount, 0);
            
            let newStatus: ProcurementBatch['paymentStatus'] = 'Pending';
            if (totalPaid >= relatedBatch.totalAmount) {
                newStatus = 'Paid';
            } else if (totalPaid > 0) {
                newStatus = 'Partial';
            }

            const updatedBatch = { ...relatedBatch, paymentStatus: newStatus, updatedAt: now };
            setBatches(batches.map(b => b.id === updatedBatch.id ? updatedBatch : b));
            setSelectedBatchForPayments(updatedBatch); // Refresh the details modal view
        }
        
        setIsAddPaymentModalOpen(false);
    };


    const handleSaveBatch = (batchData: Partial<ProcurementBatch>) => {
        const now = new Date().toISOString();
        if (batchData.id) { // Edit
            setBatches(batches.map(b => b.id === batchData.id ? { ...b, ...batchData, updatedAt: now } as ProcurementBatch : b));
        } else { // Add
            const newBatch: ProcurementBatch = {
                id: `PB${Date.now()}`,
                status: 'Active',
                createdAt: now,
                updatedAt: now,
                ...batchData,
            } as ProcurementBatch;
            setBatches(prev => [newBatch, ...prev]);
        }
        handleCloseModal();
    };

    const handleToggleStatus = (batch: ProcurementBatch) => {
        const newStatus: 'Active' | 'Cancelled' = batch.status === 'Active' ? 'Cancelled' : 'Active';
        const updatedBatch = { ...batch, status: newStatus, updatedAt: new Date().toISOString() };
        setBatches(batches.map(b => b.id === batch.id ? updatedBatch : b));
    };

    const filteredBatches = useMemo(() => {
        return batches.filter(batch => {
            const farmerName = farmerMap.get(batch.farmerId)?.toLowerCase() || '';
            const centerName = locationMap.get(batch.procurementCenterId)?.toLowerCase() || '';
            const searchMatch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                farmerName.includes(searchTerm.toLowerCase()) ||
                                centerName.includes(searchTerm.toLowerCase());
            
            const gradeMatch = filterGrade === 'All' || batch.qualityGrade === filterGrade;
            const paymentMatch = filterPayment === 'All' || batch.paymentStatus === filterPayment;

            return searchMatch && gradeMatch && paymentMatch;
        });
    }, [batches, searchTerm, filterGrade, filterPayment, farmerMap, locationMap]);
    
    const paymentStatusStyles: { [key: string]: string } = {
        'Paid': 'bg-green-500/20 text-green-300',
        'Pending': 'bg-yellow-500/20 text-yellow-300',
        'Partial': 'bg-blue-500/20 text-blue-300',
    };

    return (
        <DashboardCard title="Procurement Batch Management" icon={<ScaleIcon />}>
            {isModalOpen && currentBatch && (
                <ProcurementBatchModal batch={currentBatch} farmers={mockFarmersData} locations={mockLocations} onSave={handleSaveBatch} onCancel={handleCloseModal} />
            )}
            {isPaymentModalOpen && selectedBatchForPayments && (
                <PaymentDetailsModal
                    batch={selectedBatchForPayments}
                    payments={payments.filter(p => p.procurementBatchId === selectedBatchForPayments.id)}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onAddPayment={() => setIsAddPaymentModalOpen(true)}
                />
            )}
            {isAddPaymentModalOpen && selectedBatchForPayments && (
                <AddPaymentModal
                    batch={selectedBatchForPayments}
                    farmerName={farmerMap.get(selectedBatchForPayments.farmerId) || 'N/A'}
                    onSave={handleSavePayment}
                    onCancel={() => setIsAddPaymentModalOpen(false)}
                />
            )}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                 <div className="flex items-center gap-4 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="Search by ID, farmer, center..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                     <div>
                        <label htmlFor="grade-filter" className="text-sm font-medium text-gray-400 mr-2">Grade:</label>
                        <select id="grade-filter" value={filterGrade} onChange={e => setFilterGrade(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All Grades</option><option value="A">A</option><option value="B">B</option><option value="C">C</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="payment-filter" className="text-sm font-medium text-gray-400 mr-2">Payment:</label>
                        <select id="payment-filter" value={filterPayment} onChange={e => setFilterPayment(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                           <option value="All">All</option><option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Partial">Partial</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add New Batch
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Batch ID</th>
                            <th scope="col" className="px-6 py-3">Farmer</th>
                            <th scope="col" className="px-6 py-3">Center</th>
                            <th scope="col" className="px-6 py-3 text-right">Weight (Kg)</th>
                            <th scope="col" className="px-6 py-3 text-center">Grade</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount (₹)</th>
                            <th scope="col" className="px-6 py-3">Payment</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBatches.map((batch) => (
                            <tr key={batch.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{batch.id}</td>
                                <td className="px-6 py-4 text-white">{farmerMap.get(batch.farmerId) || 'N/A'}</td>
                                <td className="px-6 py-4">{locationMap.get(batch.procurementCenterId) || 'N/A'}</td>
                                <td className="px-6 py-4 text-right font-mono">{batch.weightKg.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center font-semibold">{batch.qualityGrade}</td>
                                <td className="px-6 py-4">{batch.procurementDate}</td>
                                <td className="px-6 py-4 text-right font-mono">{batch.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusStyles[batch.paymentStatus]}`}>
                                        {batch.paymentStatus}
                                    </span>
                                </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        batch.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {batch.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleViewPayments(batch)} className="font-medium text-green-400 hover:text-green-300" aria-label={`View payments for ${batch.id}`}>
                                            <CreditCardIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleOpenModal(batch)} className="font-medium text-blue-400 hover:text-blue-300" aria-label={`Edit ${batch.id}`}>
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleToggleStatus(batch)} className={`font-medium ${batch.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                                            {batch.status === 'Active' ? 'Cancel' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default ProcurementBatchMaster;