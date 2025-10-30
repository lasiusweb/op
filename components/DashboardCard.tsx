import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownTrayIcon } from './Icons';

interface ExportAction {
    label: string;
    action: () => void;
    isSeparator?: boolean;
}

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  exportOptions?: ExportAction[];
  contentRef?: React.RefObject<HTMLDivElement>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className = '', exportOptions, contentRef }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
              setIsExportMenuOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const hasExportOptions = exportOptions && exportOptions.length > 0;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            {icon && <div className="mr-3 text-cyan-400">{icon}</div>}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        {hasExportOptions && (
            <div className="relative" ref={exportMenuRef}>
                <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                    aria-label={`Export ${title} data`}
                    title={`Export ${title} data`}
                >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20">
                        <ul className="py-1">
                            {exportOptions.map((option, index) => {
                                if (option.isSeparator) {
                                    return <li key={index} className="my-1 h-px bg-gray-600"></li>;
                                }
                                return (
                                    <li key={index}>
                                        <button
                                            onClick={() => { option.action(); setIsExportMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        )}
      </div>
      <div className="flex-grow" ref={contentRef}>{children}</div>
    </div>
  );
};

export default DashboardCard;