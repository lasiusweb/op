import React, { useState, useRef, useMemo, useCallback } from 'react';
import type { Employee, Task, TaskStatus, TaskPriority, EmployeeActivity } from '../types';
import DashboardCard from '../components/DashboardCard';
import { UserCircleIcon, CameraIcon, MailIcon, PhoneIcon, PencilIcon, BriefcaseIcon, MapPinIcon, CalendarDaysIcon, CheckCircleIcon, CubeIcon, BanknotesIcon, SparklesIcon } from '../components/Icons';
import { getStrategicInsights } from '../services/geminiService';
import { marked } from 'marked';

// --- PROPS ---
interface ProfileProps {
    viewingEmployee: Employee;
    currentEmployee: Employee;
    allEmployees: Employee[];
    allTasks: Task[];
    allActivity: EmployeeActivity[];
    onUpdateEmployee: (updatedEmployee: Employee) => void;
    onUpdateTask: (updatedTask: Task) => void;
}

// --- SUB-COMPONENTS ---

const DetailItem: React.FC<{ icon?: React.ReactNode; label: string; value?: string | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        {icon && <div className="flex-shrink-0 w-6 text-gray-400 mt-1">{icon}</div>}
        <div className="flex-grow">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
            <div className="font-semibold text-white">{value || 'Not specified'}</div>
        </div>
    </div>
);

const EditableInput: React.FC<{ label: string; name: keyof Employee; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
    </div>
);

const ProfilePhoto: React.FC<{ employee: Employee | null; isEditing: boolean; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ employee, isEditing, onFileChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="relative w-40 h-40 mx-auto">
            {employee?.profilePhotoUrl ? (
                <img src={employee.profilePhotoUrl} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gray-700" />
            ) : (
                <div className="w-40 h-40 rounded-full bg-gray-700/50 flex items-center justify-center border-4 border-gray-700">
                    <UserCircleIcon className="w-32 h-32 text-gray-600" />
                </div>
            )}
            {isEditing && (
                <>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-2 transition-transform hover:scale-110"
                        aria-label="Upload new profile photo"
                    >
                        <CameraIcon className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};

const statusStyles: { [key in TaskStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300', 'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300', 'Rejected': 'bg-red-500/20 text-red-300',
};

const priorityStyles: { [key in TaskPriority]: string } = {
    'Low': 'bg-green-500/20 text-green-300', 'Medium': 'bg-yellow-500/20 text-yellow-300', 'High': 'bg-red-500/20 text-red-300',
};

const activityIconMap: { [key in EmployeeActivity['icon']]: React.ReactNode } = {
    task: <CheckCircleIcon className="h-5 w-5 text-green-400"/>,
    employee: <UserCircleIcon className="h-5 w-5 text-blue-400"/>,
    subsidy: <CubeIcon className="h-5 w-5 text-purple-400"/>,
    payment: <BanknotesIcon className="h-5 w-5 text-yellow-400"/>,
};

// --- MAIN COMPONENT ---
const Profile: React.FC<ProfileProps> = ({ viewingEmployee, currentEmployee, allEmployees, allTasks, allActivity, onUpdateEmployee, onUpdateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableEmployeeData, setEditableEmployeeData] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'tasks' | 'activity'>('details');
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
    const [performanceSummary, setPerformanceSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const canEdit = currentEmployee.id === viewingEmployee.id;

    const managerName = useMemo(() => {
        if (!viewingEmployee.reportingManagerId) return 'N/A';
        const manager = allEmployees.find(u => u.id === viewingEmployee.reportingManagerId);
        return manager?.fullName || 'Unknown Manager';
    }, [viewingEmployee, allEmployees]);

    const assignedTasks = useMemo(() => allTasks.filter(task => task.assignedToId === viewingEmployee.id), [allTasks, viewingEmployee]);
    const employeeActivity = useMemo(() => allActivity.filter(act => act.employeeId === viewingEmployee.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [allActivity, viewingEmployee]);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        setPerformanceSummary('');
    
        const dataForAnalysis = {
            employee: {
                fullName: viewingEmployee.fullName,
                role: viewingEmployee.role,
                joiningDate: viewingEmployee.joiningDate
            },
            assignedTasks: assignedTasks.map(t => ({ title: t.title, status: t.status, priority: t.priority, dueDate: t.dueDate })),
            recentActivity: employeeActivity.slice(0, 10).map(a => ({ action: a.action, details: a.details, timestamp: a.timestamp }))
        };
    
        const prompt = `
            As an HR analyst, provide a concise performance summary for the employee based on the data provided.
            - Start with a brief overview.
            - Highlight their task management (e.g., number of completed vs. pending tasks).
            - Comment on their recent activity.
            - Conclude with one or two potential development suggestions based on their role and data.
            Format the response in markdown.
    
            Data:
            ${JSON.stringify(dataForAnalysis, null, 2)}
        `;
    
        const result = await getStrategicInsights(prompt);
        setPerformanceSummary(result);
        setIsLoadingSummary(false);
    }, [viewingEmployee, assignedTasks, employeeActivity]);


    const handleEditClick = () => {
        setEditableEmployeeData({ ...viewingEmployee });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setEditableEmployeeData(null);
        setIsEditing(false);
    };
    
    const handleSaveClick = () => {
        if (editableEmployeeData) {
            onUpdateEmployee({ ...editableEmployeeData, updatedAt: new Date().toISOString()});
        }
        setIsEditing(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editableEmployeeData) return;
        const { name, value } = e.target;
        setEditableEmployeeData({ ...editableEmployeeData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editableEmployeeData) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableEmployeeData({ ...editableEmployeeData, profilePhotoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleToggleTaskComplete = (task: Task) => {
        const isCompleted = task.status === 'Completed';
        const newStatus: TaskStatus = isCompleted ? 'In Progress' : 'Completed';
        
        if (!isCompleted) {
            // Add to set to trigger animation
            setCompletedTasks(prev => new Set(prev).add(task.id));
            // Remove from set after animation
            setTimeout(() => {
                setCompletedTasks(prev => {
                    const next = new Set(prev);
                    next.delete(task.id);
                    return next;
                });
            }, 1000); // Animation duration: 1s
        }

        onUpdateTask({ ...task, status: newStatus, completedAt: !isCompleted ? new Date().toISOString() : undefined });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details': return (
                <div className="space-y-6">
                    {isEditing && editableEmployeeData ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <EditableInput label="Email" name="email" value={editableEmployeeData.email} onChange={handleInputChange} />
                             <EditableInput label="Mobile" name="mobile" value={editableEmployeeData.mobile} onChange={handleInputChange} />
                             <EditableInput label="Region" name="region" value={editableEmployeeData.region} onChange={handleInputChange} />
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<MailIcon />} label="Email Address" value={viewingEmployee.email} />
                            <DetailItem icon={<PhoneIcon />} label="Mobile Number" value={viewingEmployee.mobile} />
                            <DetailItem icon={<MapPinIcon />} label="Region" value={viewingEmployee.region} />
                            <DetailItem icon={<CalendarDaysIcon />} label="Member Since" value={new Date(viewingEmployee.createdAt).toLocaleDateString()} />
                        </div>
                    )}
                </div>
            );
            case 'tasks': return (
                 <div className="overflow-x-auto">
                    {assignedTasks.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                                <tr>
                                    <th className="p-4 w-4">
                                        <span className="sr-only">Complete</span>
                                    </th>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Priority</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedTasks.map(task => {
                                    const isCompleted = task.status === 'Completed';
                                    const isAnimating = completedTasks.has(task.id);

                                    return (
                                        <tr 
                                            key={task.id} 
                                            className={`border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-500 ${isAnimating ? 'opacity-30 line-through' : ''} ${isCompleted && !isAnimating ? 'text-gray-500 line-through' : ''}`}
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isCompleted}
                                                    onChange={() => handleToggleTaskComplete(task)}
                                                    className="w-4 h-4 text-teal-600 bg-gray-800 border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                                                    aria-label={`Mark task ${task.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                                />
                                            </td>
                                            <td className={`px-4 py-3 font-medium ${isCompleted && !isAnimating ? 'text-gray-400' : 'text-white'}`}>{task.title}</td>
                                            <td className="px-4 py-3">
                                                {isCompleted && !isAnimating ? (
                                                    <span>{task.priority}</span>
                                                ) : (
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {isCompleted && !isAnimating ? (
                                                    <span>{task.status}</span>
                                                ) : (
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[task.status]}`}>{task.status}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">{task.dueDate}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : <p className="text-gray-400 text-center py-4">No tasks assigned to this employee.</p>}
                </div>
            );
            case 'activity': return (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {employeeActivity.length > 0 ? employeeActivity.map(act => (
                        <div key={act.id} className="flex items-start gap-4 p-3 bg-gray-900/40 rounded-lg">
                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">
                                {activityIconMap[act.icon]}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{act.action}</p>
                                {act.details && <p className="text-sm text-gray-400">{act.details}</p>}
                                <p className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-center py-4">No recent activity.</p>}
                </div>
            );
        }
    };
    
    const TabButton: React.FC<{ tabId: 'details' | 'tasks' | 'activity', children: React.ReactNode }> = ({ tabId, children }) => (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{children}</button>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <DashboardCard title="">
                    <div className="flex flex-col items-center text-center -mt-4">
                        <ProfilePhoto employee={isEditing ? editableEmployeeData : viewingEmployee} isEditing={isEditing} onFileChange={handleFileChange} />
                        
                        {isEditing && editableEmployeeData ? (
                           <div className="w-full mt-4"><EditableInput label="Full Name" name="fullName" value={editableEmployeeData.fullName} onChange={handleInputChange} /></div>
                        ) : (
                           <h2 className="text-2xl font-bold text-white mt-4">{viewingEmployee.fullName}</h2>
                        )}

                        <p className="text-teal-400 font-medium mt-1">{viewingEmployee.role}</p>
                        <span className={`mt-3 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${viewingEmployee.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {viewingEmployee.status}
                        </span>

                        <div className="w-full border-t border-gray-700 my-6"></div>
                        
                        <div className="w-full text-left space-y-4">
                            <DetailItem icon={<BriefcaseIcon />} label="Reporting Manager" value={managerName} />
                        </div>
                        
                        {canEdit && (
                            <div className="mt-6 w-full flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleCancelClick} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                                        <button onClick={handleSaveClick} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
                                    </>
                                ) : (
                                    <button onClick={handleEditClick} className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">
                                        <PencilIcon className="h-4 w-4"/> Edit Profile
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </DashboardCard>
                 <DashboardCard title="AI Performance Review" icon={<SparklesIcon className="text-yellow-300"/>}>
                    <div className="flex flex-col h-full">
                        <p className="text-sm text-gray-400 mb-4">
                          Generate an AI-powered summary of this employee's recent tasks and activities.
                        </p>

                        <button
                          onClick={handleGenerateSummary}
                          disabled={isLoadingSummary}
                          className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          {isLoadingSummary ? 'Analyzing...' : 'Generate Performance Summary'}
                        </button>
                        
                        {isLoadingSummary && (
                            <div className="flex justify-center items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                        
                        {performanceSummary && (
                            <div 
                                className="mt-4 prose prose-sm prose-invert max-w-none text-gray-300" 
                                dangerouslySetInnerHTML={{ __html: marked.parse(performanceSummary) }} 
                            />
                        )}
                    </div>
                </DashboardCard>
            </div>

            <div className="lg:col-span-2">
                <DashboardCard title="">
                    <div className="mb-4 border-b border-gray-700">
                        <div className="flex gap-2 -mb-px">
                            <TabButton tabId="details">Details</TabButton>
                            <TabButton tabId="tasks">Tasks ({assignedTasks.length})</TabButton>
                            <TabButton tabId="activity">Activity</TabButton>
                        </div>
                    </div>
                    <div>
                        {renderTabContent()}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default Profile;
