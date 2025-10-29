import React, { useState, useMemo } from 'react';
import type { EmployeeLifecycle, LifecycleTask, LifecycleTaskStatus, Employee } from '../types';
import { mockEmployeeLifecycleData, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { UserPlusIcon, UserMinusIcon } from '../components/Icons';

interface EmployeeLifecycleProps {
  onViewProfile: (employeeId: string) => void;
}

const EmployeeLifecycle: React.FC<EmployeeLifecycleProps> = ({ onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<'Onboarding' | 'Offboarding'>('Onboarding');
  const [lifecycleData, setLifecycleData] = useState<EmployeeLifecycle[]>(mockEmployeeLifecycleData);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const employeeMap = useMemo(() => new Map(mockEmployees.map(e => [e.id, e])), []);

  const handleToggleTask = (processId: string, taskId: string) => {
    setLifecycleData(prevData =>
      prevData.map(process => {
        if (process.employeeId === processId) {
          const updatedTasks = process.tasks.map(task => {
            if (task.id === taskId) {
              const newStatus: LifecycleTaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
              return { ...task, status: newStatus };
            }
            return task;
          });
          return { ...process, tasks: updatedTasks };
        }
        return process;
      })
    );
  };
  
  const filteredData = useMemo(() => {
      return lifecycleData.filter(item => item.processType === activeTab);
  }, [lifecycleData, activeTab]);

  const TabButton: React.FC<{ tabId: 'Onboarding' | 'Offboarding'; children: React.ReactNode; icon: React.ReactNode }> = ({ tabId, children, icon }) => (
    <button onClick={() => setActiveTab(tabId)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabId ? 'bg-gray-800/50 text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>{icon}{children}</button>
  );

  return (
    <DashboardCard title="Employee Lifecycle Management">
      <div className="mb-4 border-b border-gray-700 flex">
        <TabButton tabId="Onboarding" icon={<UserPlusIcon className="h-5 w-5" />}>Onboarding ({lifecycleData.filter(d => d.processType === 'Onboarding').length})</TabButton>
        <TabButton tabId="Offboarding" icon={<UserMinusIcon className="h-5 w-5" />}>Offboarding ({lifecycleData.filter(d => d.processType === 'Offboarding').length})</TabButton>
      </div>

       <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Start Date</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(process => {
                        const employee = employeeMap.get(process.employeeId);
                        const completedTasks = process.tasks.filter(t => t.status === 'Completed').length;
                        const totalTasks = process.tasks.length;
                        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

                        return (
                             <React.Fragment key={process.employeeId}>
                                <tr className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer" onClick={() => setExpandedRowId(expandedRowId === process.employeeId ? null : process.employeeId)}>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); if (employee) onViewProfile(employee.id); }}
                                            className="font-medium text-white text-left hover:text-teal-400 transition-colors"
                                        >
                                            {employee?.fullName}
                                        </button>
                                        <div className="text-xs text-gray-500">{employee?.role}</div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(process.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="font-mono text-xs">{progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${process.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {process.status}
                                        </span>
                                    </td>
                                </tr>
                                {expandedRowId === process.employeeId && (
                                    <tr className="bg-gray-900/50">
                                        <td colSpan={4} className="p-4">
                                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-white mb-3">Checklist</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {process.tasks.map(task => (
                                                        <label key={task.id} className="flex items-start p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.status === 'Completed'}
                                                                onChange={() => handleToggleTask(process.employeeId, task.id)}
                                                                className="h-4 w-4 mt-1 rounded border-gray-500 text-teal-500 focus:ring-teal-500 flex-shrink-0"
                                                            />
                                                            <div className="ml-3">
                                                                <span className={`text-sm ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-200'}`}>{task.description}</span>
                                                                <span className="block text-xs text-gray-500">Responsible: {task.responsible}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </DashboardCard>
  );
};

export default EmployeeLifecycle;
