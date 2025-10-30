import React, { useState, useMemo, useRef } from 'react';
import type { Task, TaskStatus, TaskPriority, Employee, Farmer } from '../types';
import { mockTasks, mockEmployees, mockFarmersData } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { MapPinIcon, TableCellsIcon, MapIcon, ClockIcon } from '../components/Icons';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';

const statusStyles: { [key in TaskStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300', 'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300', 'Rejected': 'bg-red-500/20 text-red-300',
};
const priorityStyles: { [key in TaskPriority]: string } = {
    'Low': 'bg-green-500/20 text-green-300', 'Medium': 'bg-yellow-500/20 text-yellow-300', 'High': 'bg-red-500/20 text-red-300',
};

const FieldAgentTasks: React.FC = () => {
    const [tasks] = useState<Task[]>(mockTasks.filter(t => mockEmployees.find(u => u.id === t.assignedToId)?.role === 'Field Agent'));
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
    const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(tasks.find(t => t.latitude && t.longitude)?.id || null);
    const contentRef = useRef<HTMLDivElement>(null);

    const usersById = useMemo(() => new Map(mockEmployees.map(u => [u.id, u])), []);
    const farmersById = useMemo(() => new Map(mockFarmersData.map(f => [f.id, f])), []);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => 
            (filterStatus === 'All' || task.status === filterStatus) &&
            (filterPriority === 'All' || task.priority === filterPriority)
        );
    }, [tasks, filterStatus, filterPriority]);

    const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'field_agent_tasks', 'Field Agent Task Board');
        }
    };

    const getDataForExport = () => {
        return filteredTasks.map(task => {
            const farmer = task.relatedFarmerId ? farmersById.get(task.relatedFarmerId) : null;
            return {
                'Task ID': task.id,
                'Title': task.title,
                'Farmer': farmer?.fullName || 'N/A',
                'Due Date': task.dueDate,
                'Priority': task.priority,
                'Status': task.status,
                'Assigned To': usersById.get(task.assignedToId)?.fullName || 'N/A',
                'Location': task.latitude && task.longitude ? `${task.latitude}, ${task.longitude}` : 'N/A',
            };
        });
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Field Agent Tasks', data: getDataForExport() }], 'field_agent_tasks.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Field Agent Tasks', data: getDataForExport() }], 'field_agent_tasks');
    };

    // FIX: Changed exportOptions from an object to an array of objects to match the DashboardCard's expected prop type.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];

    const ListView = () => (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th className="px-4 py-3">Task</th>
                        <th className="px-4 py-3">Farmer</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map(task => {
                        const farmer = task.relatedFarmerId ? farmersById.get(task.relatedFarmerId) : null;
                        return (
                            <tr key={task.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                <td className="px-4 py-3 font-medium text-white">{task.title}</td>
                                <td className="px-4 py-3">{farmer?.fullName || 'N/A'}</td>
                                <td className="px-4 py-3">{task.dueDate}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</span></td>
                                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[task.status]}`}>{task.status}</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const MapView = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{minHeight: '600px'}}>
            <div className="md:col-span-1 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-y-auto max-h-[70vh]">
                 <ul className="divide-y divide-gray-700/50">
                    {filteredTasks.map(task => (
                        <li key={task.id}>
                            <button 
                                onClick={() => setSelectedTaskId(task.id)}
                                className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors ${selectedTaskId === task.id ? 'bg-teal-500/20' : ''}`}
                            >
                                <p className="font-semibold text-white">{task.title}</p>
                                <p className="text-sm text-gray-400">{farmersById.get(task.relatedFarmerId || '')?.fullName || 'General Task'}</p>
                                {!task.latitude && <p className="text-xs text-yellow-500 mt-1">GPS data not available</p>}
                            </button>
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="md:col-span-2 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
                {selectedTask?.latitude && selectedTask?.longitude ? (
                    <iframe
                        key={selectedTask.id}
                        width="100%"
                        height="100%"
                        className="rounded-lg"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${selectedTask.latitude},${selectedTask.longitude}&hl=en&z=14&output=embed`}>
                    </iframe>
                ) : (
                    <div className="text-center text-gray-500 p-8">
                        <MapIcon className="h-16 w-16 mx-auto mb-4 text-gray-600"/>
                        <p className="font-semibold">Select a task to view it on the map</p>
                        <p className="text-sm mt-1">The selected task may not have GPS coordinates assigned.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <DashboardCard title="Field Agent Task Board" icon={<MapPinIcon />} exportOptions={exportOptions} contentRef={contentRef}>
            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Filters */}
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="All">All Statuses</option>
                        {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="All">All Priorities</option>
                        {Object.keys(priorityStyles).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div className="flex items-center rounded-md bg-gray-800 border border-gray-700 p-1">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                       <TableCellsIcon /> List
                    </button>
                    <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                       <MapIcon /> Map
                    </button>
                </div>
            </div>
            {viewMode === 'list' ? <ListView /> : <MapView />}
        </DashboardCard>
    );
};

export default FieldAgentTasks;