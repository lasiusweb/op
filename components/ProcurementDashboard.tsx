

import React, { useRef, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import DashboardCard from './DashboardCard';
import { CubeIcon, LightBulbIcon, SparklesIcon } from './Icons';
import type { DistrictVolume, FarmerYield } from '../types';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { getGeminiInsights } from '../services/geminiService';

interface ProcurementDashboardProps {
  districtData: DistrictVolume[];
  farmerData: FarmerYield[];
  targetData: { name: string; value: number; fill: string }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
        <p className="text-white font-semibold">{`${payload[0].payload.district}`}</p>
        <p className="text-cyan-400">{`Volume: ${payload[0].value} tons`}</p>
      </div>
    );
  }
  return null;
};


const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({ districtData, farmerData, targetData }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [insights, setInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

    const handleGetInsights = useCallback(async () => {
        setIsLoadingInsights(true);
        setInsights('');
        const dataSummary = {
            districtVolume: districtData,
            topFarmers: farmerData,
            targetAchievement: targetData,
        };
        const prompt = `
            As an agricultural operations analyst, review the following JSON data about procurement.
            Provide a brief, 2-3 bullet point summary of the most critical insights.
            Focus on district performance, top farmer contributions, and progress towards the monthly target.
            Keep the language concise and actionable.

            Data:
            ${JSON.stringify(dataSummary, null, 2)}
        `;
        const result = await getGeminiInsights(prompt);
        setInsights(result);
        setIsLoadingInsights(false);
    }, [districtData, farmerData, targetData]);


    const exportDataSections = [
      { title: 'Volume by District (Tons)', data: districtData },
      { title: 'Target Achievement (%)', data: targetData.map(d => ({ name: d.name, value: d.value })) },
      { title: 'Top 5 Farmers by Yield', data: farmerData },
    ];

    const handleExportCSV = () => {
        exportToCSV(exportDataSections, 'procurement_data.csv');
    };

    const handleExportExcel = () => {
        let sectionsForExcel: { title: string; data: Record<string, any>[] }[] = [...exportDataSections];
        if (insights) {
            const plainTextInsights = insights.replace(/<[^>]+>/g, '').replace(/•/g, '- ').replace(/\*/g, '- ');
            sectionsForExcel.push({ title: 'AI Summary', data: [{ Summary: plainTextInsights }] });
        }
        exportToExcel(sectionsForExcel, 'procurement_data');
    };
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'procurement_dashboard', 'Procurement Dashboard');
        }
    };

    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

  return (
    <DashboardCard 
        title="Procurement" 
        icon={<CubeIcon />} 
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Volume by District (Tons)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="district" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
                <Bar dataKey="volume" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Target Achievement</h3>
          <div className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    innerRadius="70%" 
                    outerRadius="85%" 
                    data={targetData} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <RadialBar
                        background
                        dataKey='value'
                        cornerRadius={10}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold">
                        {targetData[0].value}%
                    </text>
                    <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-sm">
                        Monthly Goal
                    </text>
                </RadialBarChart>
             </ResponsiveContainer>
          </div>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Top 5 Farmers by Yield</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Rank</th>
                    <th scope="col" className="px-4 py-3">Farmer Name</th>
                    <th scope="col" className="px-4 py-3">Location</th>
                    <th scope="col" className="px-4 py-3 text-right">Yield (tons)</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerData.map((farmer) => (
                    <tr key={farmer.rank} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium text-white">{farmer.rank}</td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{farmer.name}</td>
                       <td className="px-4 py-3">{farmer.location}</td>
                      <td className="px-4 py-3 text-right font-mono text-teal-300">{farmer.yield.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        <div className="md:col-span-3 mt-6">
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
                    {isLoadingInsights ? 'Analyzing Procurement...' : 'Generate Insights'}
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

export default ProcurementDashboard;