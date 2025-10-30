

import React, { useState, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from './DashboardCard';
import { CreditCardIcon, LightBulbIcon, SparklesIcon } from './Icons';
import type { PaymentStatus } from '../types';
import { getGeminiInsights } from '../services/geminiService';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

interface FinancialDashboardProps {
  paymentData: PaymentStatus[];
  agingData: { invoice: string; farmer: string; days: number; amount: string }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg text-sm">
        <p className="text-white font-semibold">{label}</p>
        <p style={{ color: '#f87171' }}>{`Pending: ₹${payload[0].value}K`}</p>
        <p style={{ color: '#4ade80' }}>{`Released: ₹${payload[1].value}K`}</p>
      </div>
    );
  }
  return null;
};

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ paymentData, agingData }) => {
    const [insights, setInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleGetInsights = useCallback(async () => {
        setIsLoadingInsights(true);
        setInsights('');
        const dataSummary = {
            paymentStatus: paymentData,
            agingReport: agingData,
        };
        const prompt = `
            As a financial analyst for an agricultural company, review the following JSON data.
            Provide a brief, 2-3 bullet point summary of the most critical financial insights a manager should know.
            Focus on payment trends (pending vs. released) and the aging report for overdue invoices.
            Keep the language concise and actionable.

            Data:
            ${JSON.stringify(dataSummary, null, 2)}
        `;
        const result = await getGeminiInsights(prompt);
        setInsights(result);
        setIsLoadingInsights(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentData, agingData]);

    const exportDataSections = [
        { title: 'Pending vs. Released Payments (in ₹1000s)', data: paymentData },
        { title: 'Aging Report for Unpaid Invoices', data: agingData },
    ];

    const handleExportCSV = () => {
        exportToCSV(exportDataSections, 'financial_data.csv');
    };

    const handleExportExcel = () => {
        let sectionsForExcel: { title: string; data: Record<string, any>[] }[] = [...exportDataSections];
        if (insights) {
            const plainTextInsights = insights.replace(/<[^>]+>/g, '').replace(/•/g, '- ').replace(/\*/g, '- ');
            sectionsForExcel.push({ title: 'AI Summary', data: [{ Summary: plainTextInsights }] });
        }
        exportToExcel(sectionsForExcel, 'financial_data');
    };

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'financial_dashboard', 'Financials Dashboard');
        }
    };

    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

  return (
    <DashboardCard 
        title="Financials" 
        icon={<CreditCardIcon />} 
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
       <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Pending vs. Released Payments (in ₹1000s)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Bar dataKey="pending" stackId="a" fill="#f87171" name="Pending" />
                        <Bar dataKey="released" stackId="a" fill="#4ade80" name="Released" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Aging Report for Unpaid Invoices</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Invoice #</th>
                            <th scope="col" className="px-4 py-3">Farmer</th>
                            <th scope="col" className="px-4 py-3 text-center">Days Overdue</th>
                            <th scope="col" className="px-4 py-3 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agingData.map((item) => (
                            <tr key={item.invoice} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-4 py-3 font-medium text-white">{item.invoice}</td>
                                <td className="px-4 py-3">{item.farmer}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.days > 30 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {item.days}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-white">{item.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5" />
                    AI-Powered Summary
                </h3>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
                    <button
                        onClick={handleGetInsights}
                        disabled={isLoadingInsights}
                        className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoadingInsights ? 'Analyzing Financials...' : 'Generate Insights'}
                    </button>
                    {isLoadingInsights && (
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    )}
                    {insights && (
                        <div className="text-gray-300 text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\*/g, '•') }} />
                    )}
                </div>
            </div>
        </div>
    </DashboardCard>
  );
};

export default FinancialDashboard;