import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, DocumentTextIcon } from './Icons';
import { exportToCSV } from '../services/exportService';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => void;
    templateHeaders: string[];
    entityName: string;
}

interface ProcessResult {
    successCount: number;
    errorCount: number;
    errors: { row: number; error: string; data: any }[];
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImport, templateHeaders, entityName }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ProcessResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setIsProcessing(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (selectedFile: File) => {
        if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setFile(selectedFile);
            setError(null);
            setResult(null);
        } else {
            setError('Invalid file type. Please upload a .xlsx file.');
        }
    };
    
    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${entityName} Template`);
        XLSX.writeFile(wb, `${entityName}_import_template.xlsx`);
    };

    const handleDownloadErrors = () => {
        if (!result || result.errors.length === 0) return;
        const errorData = result.errors.map(err => ({
            'Row Number': err.row,
            'Error': err.error,
            ...err.data
        }));
        exportToCSV([{ title: 'Import Errors', data: errorData }], `${entityName}_import_errors.csv`);
    };

    const processFile = useCallback((fileToProcess: File) => {
        setIsProcessing(true);
        setError(null);
        setResult(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    throw new Error("The uploaded file is empty or has no data.");
                }

                // Validate headers
                const fileHeaders = Object.keys(jsonData[0]);
                const missingHeaders = templateHeaders.filter(h => !fileHeaders.includes(h));
                if (missingHeaders.length > 0) {
                    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
                }

                const successfulRows: any[] = [];
                const errorRows: { row: number; error: string; data: any }[] = [];

                jsonData.forEach((row, index) => {
                    const requiredField = templateHeaders[0]; // Assume first header is always required
                    if (!row[requiredField]) {
                        errorRows.push({ row: index + 2, error: `Required field '${requiredField}' is empty.`, data: row });
                    } else {
                        successfulRows.push(row);
                    }
                });
                
                if (successfulRows.length > 0) {
                    onImport(successfulRows);
                }

                setResult({
                    successCount: successfulRows.length,
                    errorCount: errorRows.length,
                    errors: errorRows,
                });

            } catch (err: any) {
                setError(`Error processing file: ${err.message}`);
            } finally {
                setIsProcessing(false);
            }
        };
        reader.onerror = () => {
             setError("Failed to read the file.");
             setIsProcessing(false);
        }
        reader.readAsArrayBuffer(fileToProcess);
    }, [onImport, templateHeaders]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Bulk Import {entityName}</h2>
                
                <div className="space-y-4">
                    <div 
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-teal-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
                    >
                        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-300">
                            Drag & drop your .xlsx file here or 
                            <label htmlFor="file-upload" className="font-medium text-teal-400 hover:text-teal-300 cursor-pointer"> click to browse</label>.
                        </p>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} />
                    </div>

                    <div className="text-center">
                         <button onClick={handleDownloadTemplate} className="text-sm text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-2">
                             <ArrowDownTrayIcon className="h-4 w-4" />
                             Download Template
                         </button>
                    </div>

                    {file && !result && (
                         <div className="bg-gray-700/50 p-3 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-white">{file.name}</span>
                            </div>
                            <button onClick={resetState} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                    )}
                    
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    {result && (
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                             <h3 className="font-semibold text-white mb-2">Import Complete</h3>
                             <p className="text-green-400">{result.successCount} {entityName} imported successfully.</p>
                             {result.errorCount > 0 && (
                                <>
                                <p className="text-yellow-400 mt-1">{result.errorCount} rows had errors.</p>
                                <button onClick={handleDownloadErrors} className="mt-2 text-sm text-teal-400 hover:underline">Download Error Report</button>
                                </>
                            )}
                        </div>
                    )}

                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={handleClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        {result ? 'Close' : 'Cancel'}
                    </button>
                    {!result && (
                        <button 
                            type="button" 
                            onClick={() => file && processFile(file)}
                            disabled={!file || isProcessing}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : `Process File`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkImportModal;