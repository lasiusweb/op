

import React, { useRef } from 'react';
import DashboardCard from '../components/DashboardCard';
import { BeakerIcon } from '../components/Icons';
import { exportElementAsPDF } from '../services/pdfService';

interface ComingSoonProps {
    title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, title.toLowerCase().replace(/\s+/g, '_'), title);
        }
    };
    
    const exportOptions = [
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    return (
        <DashboardCard title={title} exportOptions={exportOptions} contentRef={contentRef}>
            <div className="flex flex-col items-center justify-center h-96 text-center text-gray-400">
                <BeakerIcon className="h-24 w-24 text-teal-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-2">Coming Soon!</h2>
                <p className="max-w-md">
                    The "{title}" module is currently under construction. Our team is working hard to bring you this new feature. Please check back later!
                </p>
            </div>
        </DashboardCard>
    );
};

export default ComingSoon;