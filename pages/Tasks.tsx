import React, { useState, FormEvent, useMemo, useRef, useCallback } from 'react';
import type { Task, Employee, TaskStatus, TaskPriority, Farmer } from '../types';
import DashboardCard from '../components/DashboardCard';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon, LightBulbIcon, SparklesIcon } from '../components/Icons';
import { mockTasks, mockEmployees, mockFarmersData } from '../data/mockData';
import { exportToCSV, exportToExcel } from '../services/exportService';
import { exportElementAsPDF } from '../services/pdfService';
import { getGeminiInsights } from '../services/geminiService';

const statusStyles: { [key in TaskStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
};

const priorityStyles: { [key in TaskPriority]: string } = {
    'Low': 'bg-green-500/20 text-green-300',
    'Medium': 'bg-yellow-500/20 text-yellow-300',
    'High': 'bg-red-500/20 text-red-300',
};

type SortableTaskKeys = 'priority' | 'assignedTo' | 'dueDate';

const TaskModal: React.FC<{
    task: Partial<Task> & { assignedToId?: string };
    employees: Employee[];
    onSave: (task: Partial<Task> & { assignedToId?: string }) => void;
    onCancel: () => void;
}> = ({ task, employees, onSave, onCancel }) => {
    const [formData, setFormData] = useState(task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-white mb-4">{task.id ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                        <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-300">Assigned To</label>
                            <select name="assignedToId" id="assignedToId" value={formData.assignedToId || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option value="">Select Employee</option>
                                {employees.map(employee => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">Due Date</label>
                            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                            <select name="status" id="status" value={formData.status || 'Pending'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                {(Object.keys(statusStyles) as TaskStatus[]).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-300">Priority</label>
                            <select name="priority" id="priority" value={formData.priority || 'Medium'} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                {(Object.keys(priorityStyles) as TaskPriority[]).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task> & { assignedToId?: string } | null>(null);
    const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortableTaskKeys; direction: 'ascending' | 'descending' }>({ key: 'dueDate', direction: 'ascending' });
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [taskAnalysis, setTaskAnalysis] = useState('');
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const employeesById = useMemo(() => Object.fromEntries(mockEmployees.map(u => [u.id, u])), []);
    const farmersById = useMemo(() => Object.fromEntries(mockFarmersData.map(f => [f.id, f])), []);


    const handleOpenModal = (task?: Task) => {
        if (task) {
            setCurrentTask({ ...task });
        } else {
            const today = new Date().toISOString().split('T')[0];
            setCurrentTask({ title: '', description: '', assignedToId: '', dueDate: today, status: 'Pending', priority: 'Medium' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };
    
    const handleToggleRow = (taskId: string) => {
      setExpandedRowId(prevId => (prevId === taskId ? null : taskId));
    };

    const handleSaveTask = (taskData: Partial<Task> & { assignedToId?: string }) => {
        if (!taskData.assignedToId) {
            alert('Please select an employee to assign the task to.');
            return;
        }

        const { assignedToId, ...restTaskData } = taskData;
        const now = new Date().toISOString();

        if (restTaskData.id) { // Editing existing task
            setTasks(tasks.map(t => 
                t.id === restTaskData.id 
                ? { ...t, ...restTaskData, assignedToId: assignedToId!, updatedAt: now } 
                : t
            ));
        } else { // Adding new task
            const newTask: Task = {
                id: `TSK${Date.now()}`,
                title: restTaskData.title || 'New Task',
                description: restTaskData.description || '',
                assignedToId: assignedToId,
                dueDate: restTaskData.dueDate || '',
                status: restTaskData.status || 'Pending',
                priority: restTaskData.priority || 'Medium',
                createdAt: now,
                updatedAt: now,
            };
            setTasks(prevTasks => [...prevTasks, newTask]);
        }
        handleCloseModal();
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== taskId));
        }
    };
    
    const requestSort = (key: SortableTaskKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredTasks = useMemo(() => {
        let sortableItems = [...tasks];

        if (filterPriority !== 'All') {
            sortableItems = sortableItems.filter(task => task.priority === filterPriority);
        }

        const priorityOrder: { [key in TaskPriority]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 };
        
        sortableItems.sort((a, b) => {
            const key = sortConfig.key;
            let valA: string | number;
            let valB: string | number;

            if (key === 'priority') {
                valA = priorityOrder[a.priority];
                valB = priorityOrder[b.priority];
            } else if (key === 'assignedTo') {
                valA = employeesById[a.assignedToId]?.fullName || '';
                valB = employeesById[b.assignedToId]?.fullName || '';
            } else {
                 valA = a[key];
                 valB = b[key];
            }

            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });

        return sortableItems;
    }, [tasks, filterPriority, sortConfig, employeesById]);

    const handleAnalyzeTasks = useCallback(async () => {
        setIsLoadingAnalysis(true);
        setTaskAnalysis('');
        
        const dataToAnalyze = sortedAndFilteredTasks.map(t => ({
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate,
            assignedTo: employeesById[t.assignedToId]?.fullName
        }));
    
        const prompt = `
            Analyze the following list of tasks. Provide a 2-3 bullet point summary highlighting:
            - The overall distribution of tasks by status (Pending, In Progress, etc.).
            - Any notable number of high-priority or overdue tasks that require immediate attention.
            - Any potential workload imbalance based on task assignments.
    
            Data sample:
            ${JSON.stringify(dataToAnalyze.slice(0, 50), null, 2)}
        `;
    
        const result = await getGeminiInsights(prompt);
        setTaskAnalysis(result);
        setIsLoadingAnalysis(false);
    }, [sortedAndFilteredTasks, employeesById]);

    const handleExportPDF = () => {
        if (contentRef.current) {
            exportElementAsPDF(contentRef.current, 'tasks_list', 'General Task Management');
        }
    };

    const getDataForExport = () => {
        return sortedAndFilteredTasks.map(task => ({
            'Task ID': task.id,
            'Title': task.title,
            'Assigned To': employeesById[task.assignedToId]?.fullName || 'Unassigned',
            'Related Farmer': task.relatedFarmerId ? farmersById[task.relatedFarmerId]?.fullName : 'N/A',
            'Due Date': task.dueDate,
            'Priority': task.priority,
            'Status': task.status,
            'Description': task.description
        }));
    };

    const handleExportCSV = () => {
        exportToCSV([{ title: 'Tasks', data: getDataForExport() }], 'tasks_list.csv');
    };

    const handleExportExcel = () => {
        exportToExcel([{ title: 'Tasks', data: getDataForExport() }], 'tasks_list');
    };

    // FIX: exportOptions was an object, but DashboardCard expects an array of ExportAction objects.
    const exportOptions = [
        { label: 'Export as CSV', action: handleExportCSV },
        { label: 'Export as Excel', action: handleExportExcel },
        { label: 'Export as PDF', action: handleExportPDF },
    ];
    
    const SortableHeader: React.FC<{ label: string; sortKey: SortableTaskKeys }> = ({ label, sortKey }) => (
        <th scope="col" className="px-6 py-3">
             <button
                onClick={() => requestSort(sortKey)}
                className="group flex items-center gap-1.5 uppercase font-semibold tracking-wider text-gray-300 hover:text-white transition-colors"
                aria-label={`Sort by ${label}`}
             >
                <span>{label}</span>
                {sortConfig.key === sortKey ? (
                    sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4"/> : <ArrowDownIcon className="w-4 h-4"/>
                ) : (
                    <ChevronUpDownIcon className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </th>
    );


  return (
    <DashboardCard title="General Task Management" exportOptions={exportOptions} contentRef={contentRef}>
       {isModalOpen && currentTask && (
            <TaskModal
                task={currentTask}
                employees={mockEmployees}
                onSave={handleSaveTask}
                onCancel={handleCloseModal}
            />
       )}
       <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div>
                <label htmlFor="priority-filter" className="text-sm text-gray-400 mr-2">Filter Priority:</label>
                <select
                    id="priority-filter"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'All')}
                    className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Add New Task
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">Task ID</th>
              <th scope="col" className="px-6 py-3">Title</th>
              <SortableHeader label="Assigned To" sortKey="assignedTo" />
              <SortableHeader label="Due Date" sortKey="dueDate" />
              <SortableHeader label="Priority" sortKey="priority" />
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTasks.map((task) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Normalize today's date
              const dueDate = new Date(task.dueDate);
              const timeDiff = dueDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
              
              const isDueSoon = daysDiff >= 0 && daysDiff <= 2 && (task.status === 'Pending' || task.status === 'In Progress');

              return (
              <React.Fragment key={task.id}>
                <tr onClick={() => handleToggleRow(task.id)} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {expandedRowId === task.id ? <ChevronUpIcon className="h-4 w-4"/> : <ChevronDownIcon className="h-4 w-4"/>}
                            <span>{task.id}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-white" title={task.description}>{task.title}</td>
                    <td className="px-6 py-4">{employeesById[task.assignedToId]?.fullName || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-2" title={isDueSoon ? "This task is due within 3 days." : ""}>
                        {isDueSoon && <ClockIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />}
                        <span className={isDueSoon ? 'font-semibold text-yellow-300' : ''}>
                        {task.dueDate}
                        </span>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityStyles[task.priority]}`}>
                        {task.priority}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[task.status]}`}>
                        {task.status}
                    </span>
                    </td>
                </tr>
                 {expandedRowId === task.id && (
                    <tr className="bg-gray-900/50">
                        <td colSpan={6} className="p-4 transition-all duration-300 ease-in-out">
                            <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-teal-400 mb-1">Full Description</h4>
                                    <p className="text-gray-300 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                                </div>
                                {task.relatedFarmerId && farmersById[task.relatedFarmerId] && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-teal-400 mb-1">Related Farmer</h4>
                                        <p className="text-white font-medium">{farmersById[task.relatedFarmerId].fullName}</p>
                                    </div>
                                )}
                                <div className="flex justify-end gap-4 pt-4 mt-2 border-t border-gray-700/50">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal(task); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                                        <PencilIcon className="h-4 w-4"/> Edit Task
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                                        <TrashIcon className="h-4 w-4"/> Delete Task
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
              </React.Fragment>
            )})}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5" />
                AI Task Analysis
            </h3>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
                <button
                    onClick={handleAnalyzeTasks}
                    disabled={isLoadingAnalysis}
                    className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon className="w-5 w-5 mr-2" />
                    {isLoadingAnalysis ? 'Analyzing Tasks...' : 'Generate Analysis'}
                </button>
                {isLoadingAnalysis && (
                    <div className="flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}
                {taskAnalysis && (
                    <div className="text-gray-300 text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: taskAnalysis.replace(/\*/g, '•') }} />
                )}
            </div>
        </div>
    </DashboardCard>
  );
};

export default Tasks;