

import React, { useState, useCallback, useRef } from 'react';
import DashboardCard from './DashboardCard';
import { SparklesIcon } from './Icons';
import { getStrategicInsights } from '../services/geminiService';
import { marked } from 'marked';
import { exportElementAsPDF } from '../services/pdfService';
import { exportToText, exportToExcel } from '../services/exportService';

interface StrategicAdvisorProps {
  dashboardData: any;
}

const StrategicAdvisor: React.FC<StrategicAdvisorProps> = ({ dashboardData }) => {
  const [rawReport, setRawReport] = useState<string>('');
  const [htmlReport, setHtmlReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setRawReport('');
    setHtmlReport('');
    
    const prompt = `
      You are a senior strategic advisor for the Telangana Oil Palm Mission. Your task is to perform a deep-dive analysis of the provided operational data snapshot and generate a strategic report for executive management. Use your advanced reasoning capabilities to identify high-level trends, risks, and opportunities.

      Your report should be structured in markdown format with the following sections:
      1.  **Key Observations:** Synthesize the most critical insights from the data. Connect data points across different domains (e.g., how do payment delays affect farmer yield? How does quality impact financial performance?).
      2.  **Potential Risks & Opportunities:** Identify the top 2-3 strategic risks the mission is facing and the top 2-3 opportunities for growth or improvement.
      3.  **Strategic Recommendations:** Provide 3-5 concrete, actionable recommendations for the executive team to address the risks and capitalize on the opportunities.

      Be concise, insightful, and executive-ready.

      **Operational Data Snapshot:**
      ${JSON.stringify(dashboardData, null, 2)}
    `;

    const result = await getStrategicInsights(prompt);
    setRawReport(result);
    const htmlResult = marked.parse(result);
    setHtmlReport(htmlResult as string);
    setIsLoading(false);
  }, [dashboardData]);

  const handleExportCSV = () => {
    if (rawReport) {
        exportToText(rawReport, 'strategic_advisor_report.md');
    } else {
        alert('Please generate the report first.');
    }
  };

  const handleExportExcel = () => {
      if (rawReport) {
          exportToExcel([{ title: 'Strategic Advisor Report', data: [{ Report: rawReport }] }], 'strategic_advisor_report');
      } else {
          alert('Please generate the report first.');
      }
  };
  
  const handleExportPDF = () => {
    if (contentRef.current && htmlReport) {
        exportElementAsPDF(contentRef.current, 'strategic_advisor_report', 'Strategic Advisor Report');
    } else {
        alert('Please generate the report first.');
    }
  };

  const exportOptions = [
    { label: 'Export as Markdown (.md)', action: handleExportCSV },
    { label: 'Export as Excel', action: handleExportExcel },
    { label: 'Export as PDF', action: handleExportPDF },
  ];

  return (
    <DashboardCard 
        title="Strategic Advisor" 
        icon={<SparklesIcon className="text-yellow-300" />}
        exportOptions={exportOptions}
        contentRef={contentRef}
    >
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-400 mb-4">
          Get a deep-dive analysis and strategic recommendations from our AI advisor powered by Gemini 2.5 Pro with Thinking Mode.
        </p>

        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating Deep Dive Analysis...' : 'Generate Strategic Report'}
        </button>
        
        <div className="flex-grow overflow-y-auto pr-2">
            {isLoading && (
                <div className="flex flex-col justify-center items-center h-full text-center">
                    <div className="flex justify-center items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-gray-400 mt-4">AI is thinking... this may take a moment.</p>
                </div>
            )}
            {htmlReport && (
                <div 
                    className="prose prose-sm prose-invert max-w-none text-gray-300" 
                    dangerouslySetInnerHTML={{ __html: htmlReport }} 
                />
            )}
            {!isLoading && !htmlReport && (
                 <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
                    <p>Click the button above to generate your report.</p>
                </div>
            )}
        </div>

      </div>
    </DashboardCard>
  );
};

export default StrategicAdvisor;