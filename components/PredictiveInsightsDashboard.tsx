

import React, { useState, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from './DashboardCard';
import { LightBulbIcon, SparklesIcon } from './Icons';
import { getGeminiInsights } from '../services/geminiService';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

interface PredictiveInsightsDashboardProps {
  supplyDemandData: { month: string; supply: number; demand: number }[];
  anomalyData: { id: number; type: string; description: string; severity: string }[];
}

const PredictiveInsightsDashboard: React.FC<PredictiveInsightsDashboardProps> = ({ supplyDemandData, anomalyData }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGetInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    setInsights('');
    const dataSummary = {
      forecast: supplyDemandData,
      anomalies: anomalyData,
    };
    const prompt = `
      As an agricultural data analyst for an oil palm mission, review the following JSON data.
      Provide a brief, 2-3 bullet point summary of the most critical insights a manager should know.
      Focus on supply/demand trends and detected anomalies. Keep the language concise and actionable.

      Data:
      ${JSON.stringify(dataSummary, null, 2)}
    `;
    const result = await getGeminiInsights(prompt);
    setInsights(result);
    setIsLoadingInsights(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplyDemandData, anomalyData]);

  const exportDataSections = [
      { title: 'Supply Forecast vs. Demand Curve (Tons)', data: supplyDemandData },
      { title: 'Anomaly Detection Flags', data: anomalyData },
  ];

  const handleExportCSV = () => {
    exportToCSV(exportDataSections, 'predictive_data.csv');
  };
  
  const handleExportExcel = () => {
    let sectionsForExcel: { title: string; data: Record<string, any>[] }[] = [...exportDataSections];
    if (insights) {
        const plainTextInsights = insights.replace(/<[^>]+>/g, '').replace(/•/g, '- ').replace(/\*/g, '- ');
        sectionsForExcel.push({ title: 'AI Summary', data: [{ Summary: plainTextInsights }] });
    }
    exportToExcel(sectionsForExcel, 'predictive_data');
  };
  
  const handleExportPDF = () => {
    if (contentRef.current) {
        exportElementAsPDF(contentRef.current, 'predictive_insights_dashboard', 'Predictive Insights Dashboard');
    }
  };

  const exportOptions = {
    csv: handleExportCSV,
    excel: handleExportExcel,
    pdf: handleExportPDF,
  };


  return (
    <DashboardCard 
        title="Predictive Insights" 
        icon={<LightBulbIcon />} 
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
       <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Supply Forecast vs. Demand Curve (Tons)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={supplyDemandData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Line type="monotone" dataKey="supply" stroke="#2dd4bf" strokeWidth={2} />
                            <Line type="monotone" dataKey="demand" stroke="#f43f5e" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-medium text-gray-300 mb-2">Anomaly Detection Flags</h3>
                 <div className="space-y-2">
                    {anomalyData.map(item => (
                         <div key={item.id} className="p-3 bg-gray-700/50 rounded-lg flex items-start space-x-3">
                            <span className={`flex-shrink-0 mt-1 w-3 h-3 rounded-full ${item.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                            <div>
                                <p className="font-semibold text-white text-sm">{item.type} Anomaly</p>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

             <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">AI-Powered Summary</h3>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
                    <button 
                        onClick={handleGetInsights} 
                        disabled={isLoadingInsights}
                        className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoadingInsights ? 'Analyzing Data...' : 'Generate Insights'}
                    </button>
                    {isLoadingInsights && (
                        <div className="flex justify-center items-center space-x-2">
                           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
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

export default PredictiveInsightsDashboard;