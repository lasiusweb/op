import React, { useRef, useState, useMemo, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { ShieldCheckIcon, ExclamationCircleIcon, CheckCircleIcon } from '../components/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { mockDocuments, mockProcurementBatches, mockInspections, mockSubsidyApplications } from '../data/mockData';
import type { Document, ProcurementBatch, Inspection } from '../types';

interface ComplianceSlaDashboardProps {
  complianceData: { name: string; compliance: number }[];
  auditLogData: { action: string; user: string; timestamp: string; module: string }[];
}

const ComplianceSlaDashboard: React.FC<ComplianceSlaDashboardProps> = ({ complianceData, auditLogData }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [slaThresholds, setSlaThresholds] = useState({
        documentVerification: 7,
        paymentProcessing: 14,
        inspectionCompletion: 5,
    });
    const [breaches, setBreaches] = useState<any[]>([]);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    useEffect(() => {
        const calculateBreaches = () => {
            const today = new Date();
            const newBreaches = [];

            // 1. Document Verification Breaches
            const pendingDocs = mockDocuments.filter(d => d.status === 'Pending');
            for (const doc of pendingDocs) {
                const createdDate = new Date(doc.createdAt);
                const daysPending = (today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                if (daysPending > slaThresholds.documentVerification) {
                    const app = mockSubsidyApplications.find(a => a.id === doc.subsidyApplicationId);
                    newBreaches.push({
                        id: `doc-${doc.id}`,
                        type: 'Document Verification',
                        message: `Document '${doc.documentType}' for App ID ${doc.subsidyApplicationId} is overdue by ${Math.floor(daysPending - slaThresholds.documentVerification)} days.`,
                        severity: 'High',
                        details: `Application for subsidy: ${app ? app.subsidyType : 'Unknown'}`,
                    });
                }
            }

            // 2. Payment Processing Breaches
            const pendingPayments = mockProcurementBatches.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partial');
            for (const batch of pendingPayments) {
                 const procurementDate = new Date(batch.procurementDate);
                 const daysPending = (today.getTime() - procurementDate.getTime()) / (1000 * 3600 * 24);
                 if (daysPending > slaThresholds.paymentProcessing) {
                      newBreaches.push({
                         id: `pay-${batch.id}`,
                         type: 'Payment Processing',
                         message: `Payment for Batch ID ${batch.id} is overdue by ${Math.floor(daysPending - slaThresholds.paymentProcessing)} days.`,
                         severity: 'High',
                         details: `Farmer ID: ${batch.farmerId}, Amount: ₹${batch.totalAmount.toLocaleString()}`,
                      });
                 }
            }
            
            // 3. Inspection Completion Breaches
            const scheduledInspections = mockInspections.filter(i => i.status === 'Scheduled');
            for (const inspection of scheduledInspections) {
                const scheduledDate = new Date(inspection.inspectionDate); 
                const daysPending = (today.getTime() - scheduledDate.getTime()) / (1000 * 3600 * 24);
                if (daysPending > slaThresholds.inspectionCompletion) {
                    newBreaches.push({
                        id: `insp-${inspection.id}`,
                        type: 'Inspection Completion',
                        message: `Inspection ID ${inspection.id} is overdue by ${Math.floor(daysPending - slaThresholds.inspectionCompletion)} days.`,
                        severity: 'Medium',
                        details: `Related to ${inspection.relatedEntityType} ${inspection.relatedEntityId}`,
                    });
                }
            }

            setBreaches(newBreaches);
        };

        calculateBreaches();
    }, [slaThresholds]);

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSlaThresholds(prev => ({
            ...prev,
            [name]: Number(value) >= 0 ? Number(value) : 0,
        }));
    };

    const handleSaveSettings = () => {
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 3000);
    };

    const exportDataSections = [
        { title: 'SLA Breaches Count', data: [{ overdue_count: breaches.length }] },
        { title: 'SLA Breach Details', data: breaches.map(b => ({ Type: b.type, Message: b.message, Details: b.details })) },
        { title: 'Task Compliance by Role', data: complianceData },
        { title: 'Recent Audit Log', data: auditLogData },
    ];

    const handleExportCSV = () => {
        exportToCSV(exportDataSections, 'compliance_sla_data.csv');
    };

    const handleExportExcel = () => {
        exportToExcel(exportDataSections, 'compliance_sla_data');
    };

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'compliance_sla_dashboard', 'Compliance & SLA Dashboard');
        }
    };

    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

  return (
    <DashboardCard 
        title="Compliance & SLA" 
        icon={<ShieldCheckIcon />} 
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Left Column */}
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-700/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-300">SLA Breaches</h3>
                        <p className={`text-6xl font-bold my-2 ${breaches.length > 0 ? 'text-rose-500' : 'text-green-500'}`}>{breaches.length}</p>
                        <p className="text-sm text-gray-400">Total items overdue</p>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Task Compliance by Role</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={complianceData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                                    <Bar dataKey="compliance" barSize={20} radius={[0, 10, 10, 0]}>
                                       {complianceData.map((entry) => (
                                           <Cell key={`cell-${entry.name}`} fill={entry.compliance > 90 ? '#2dd4bf' : '#facc15'} />
                                       ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Active SLA Breaches</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {breaches.length > 0 ? breaches.map(b => (
                            <div key={b.id} className="p-3 bg-gray-700/30 rounded-lg flex items-start space-x-3 border-l-4 border-rose-500">
                                <ExclamationCircleIcon className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold text-white text-sm">{b.type}</p>
                                    <p className="text-gray-300 text-sm">{b.message}</p>
                                    <p className="text-xs text-gray-500">{b.details}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-500">
                                <CheckCircleIcon className="h-10 w-10 mx-auto mb-2 text-green-500" />
                                <p>No active SLA breaches. Great job!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-300">SLA Settings (Days)</h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                    <div>
                        <label htmlFor="documentVerification" className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Document Verification</span>
                            <span className="font-mono text-teal-300">{slaThresholds.documentVerification} days</span>
                        </label>
                        <input type="range" min="1" max="30" name="documentVerification" id="documentVerification" value={slaThresholds.documentVerification} onChange={handleThresholdChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <label htmlFor="paymentProcessing" className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Payment Processing</span>
                             <span className="font-mono text-teal-300">{slaThresholds.paymentProcessing} days</span>
                        </label>
                        <input type="range" min="1" max="30" name="paymentProcessing" id="paymentProcessing" value={slaThresholds.paymentProcessing} onChange={handleThresholdChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <label htmlFor="inspectionCompletion" className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Inspection Completion</span>
                             <span className="font-mono text-teal-300">{slaThresholds.inspectionCompletion} days</span>
                        </label>
                        <input type="range" min="1" max="30" name="inspectionCompletion" id="inspectionCompletion" value={slaThresholds.inspectionCompletion} onChange={handleThresholdChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                     <div className="pt-2 text-right">
                        <button onClick={handleSaveSettings} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                            Save Settings
                        </button>
                        {showSaveConfirmation && <span className="text-green-400 text-xs ml-4 animate-pulse">Settings Saved!</span>}
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Recent Audit Log</h3>
                     <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Action</th>
                                    <th scope="col" className="px-4 py-2">Module</th>
                                    <th scope="col" className="px-4 py-2">User Role</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/50">
                            {auditLogData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-700/50 last:border-0">
                                    <td className="px-4 py-2 font-medium text-white">{item.action}</td>
                                    <td className="px-4 py-2">{item.module}</td>
                                    <td className="px-4 py-2">{item.user}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </DashboardCard>
  );
};

export default ComplianceSlaDashboard;