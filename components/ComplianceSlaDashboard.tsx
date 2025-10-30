

import React, { useRef } from 'react';
import DashboardCard from './DashboardCard';
import { ShieldCheckIcon } from './Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

interface ComplianceSlaDashboardProps {
  complianceData: { name: string; compliance: number }[];
  auditLogData: { action: string; user: string; timestamp: string; module: string }[];
}

const ComplianceSlaDashboard: React.FC<ComplianceSlaDashboardProps> = ({ complianceData, auditLogData }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const exportDataSections = [
        { title: 'Overdue Tasks', data: [{ task_type: 'Inspections & Payments', overdue_count: 14 }] },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300">Overdue Tasks</h3>
                <p className="text-6xl font-bold text-rose-500 my-2">14</p>
                <p className="text-sm text-gray-400">Inspections & Payments</p>
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
            <div className="md:col-span-3">
                 <h3 className="text-lg font-medium text-gray-300 mb-2">Recent Audit Log</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Action</th>
                                <th scope="col" className="px-4 py-3">Module</th>
                                <th scope="col" className="px-4 py-3">User Role</th>
                            </tr>
                        </thead>
                        <tbody>
                        {auditLogData.map((item, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-4 py-3 font-medium text-white">{item.action}</td>
                                <td className="px-4 py-3">{item.module}</td>
                                <td className="px-4 py-3">{item.user}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </DashboardCard>
  );
};

export default ComplianceSlaDashboard;