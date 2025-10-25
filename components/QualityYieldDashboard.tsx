
import React, { useRef } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from './DashboardCard';
import { BeakerIcon } from './Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

interface QualityYieldDashboardProps {
  efficiencyData: { name: string; efficiency: number }[];
  defectData: { name: string; value: number }[];
}

const COLORS = ['#f43f5e', '#f97316', '#eab308', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-cyan-400">{`Efficiency: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


const QualityYieldDashboard: React.FC<QualityYieldDashboardProps> = ({ efficiencyData, defectData }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const exportDataSections = [
        { title: 'Extraction Efficiency Trend (%)', data: efficiencyData },
        { title: 'Defect Rate by Batch', data: defectData },
    ];

    const handleExportCSV = () => {
        exportToCSV(exportDataSections, 'quality_yield_data.csv');
    };

    const handleExportExcel = () => {
        exportToExcel(exportDataSections, 'quality_yield_data');
    };
    
    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'quality_yield_dashboard', 'Quality & Yield Dashboard');
        }
    };

    const exportOptions = {
        csv: handleExportCSV,
        excel: handleExportExcel,
        pdf: handleExportPDF,
    };

  return (
    <DashboardCard 
        title="Quality & Yield" 
        icon={<BeakerIcon />} 
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Extraction Efficiency Trend (%)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[85, 95]} stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="efficiency" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4, fill: '#2dd4bf' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Defect Rate by Batch</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={defectData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {defectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                    <Legend iconSize={10}/>
                </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default QualityYieldDashboard;
