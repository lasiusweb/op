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
                                    <Tooltip cursor={{ fill: 'rgba(107, 114, 128, 0.