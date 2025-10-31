
import React, { useState, useEffect, useRef } from 'react';
import type { Employee, Task } from '../../types';
import { UserIcon, Bars3Icon, BellIcon, ArrowLeftIcon } from '../Icons';

interface HeaderProps {
    title: string;
    currentEmployee: Employee;
    allEmployees: Employee[];
    allTasks: Task[];
    setCurrentEmployee: (employee: Employee) => void;
    onViewProfile: () => void;
    onToggleSidebar: () => void;
    onGoBack: () => void;
    canGoBack: boolean;
}

const getDueDateStatus = (dueDateStr: string): { text: string; className: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
        return { text: `Overdue by ${Math.abs(daysDiff)} day(s)`, className: 'text-red-400' };
    }
    if (daysDiff === 0) {
        return { text: 'Due today', className: 'text-yellow-400' };
    }
    return { text: `Due in ${daysDiff} day(s)`, className: 'text-yellow-300' };
};

const Header: React.FC<HeaderProps> = ({ title, currentEmployee, allEmployees, allTasks, setCurrentEmployee, onViewProfile, onToggleSidebar, onGoBack, canGoBack }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [dueTasks, setDueTasks] = useState<Task[]>([]);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to the start of the day for accurate comparison

        const upcomingOrOverdue = allTasks.filter(task => {
            if (task.status === 'Completed' || task.status === 'Rejected') {
                return false;
            }
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const timeDiff = dueDate.getTime() - now.getTime();
            // Get difference in days, rounding up.
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // Includes overdue tasks (daysDiff < 0) and tasks due in 0, 1, 2, or 3 days.
            return daysDiff <= 3; 
        }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        setDueTasks(upcomingOrOverdue);
    }, [allTasks]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmployee = allEmployees.find(u => u.id === event.target.value);
        if (selectedEmployee) {
            setCurrentEmployee(selectedEmployee);
        }
    };
    
    return (
        <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-700/50 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white lg:hidden" aria-label="Open sidebar">
                    <Bars3Icon className="h-6 w-6" />
                </button>
                {canGoBack && (
                    <button onClick={onGoBack} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50 -ml-1" aria-label="Go back">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {title}
                </h1>
            </div>
             <div className="flex items-center gap-4">
                 <div ref={notificationRef} className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50"
                        aria-label="View notifications"
                    >
                        <BellIcon className="h-6 w-6" />
                        {dueTasks.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-gray-900">
                                {dueTasks.length}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                            <div className="p-3 font-semibold text-white border-b border-gray-700">Notifications</div>
                            <ul className="py-1 max-h-96 overflow-y-auto">
                                {dueTasks.length > 0 ? (
                                    dueTasks.map(task => {
                                        const dueDateInfo = getDueDateStatus(task.dueDate);
                                        return (
                                            <li key={task.id}>
                                                <div className="px-4 py-3 hover:bg-gray-700/50">
                                                    <p className="text-sm font-semibold text-white truncate">{task.title}</p>
                                                    <p className="text-xs text-gray-400">Assigned to: {allEmployees.find(u => u.id === task.assignedToId)?.fullName || 'N/A'}</p>
                                                    <p className={`text-xs font-bold ${dueDateInfo.className}`}>{dueDateInfo.text}</p>
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li>
                                        <p className="text-center text-gray-400 py-4 text-sm">No new notifications.</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <button onClick={onViewProfile} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="text-right">
                        <p className="font-semibold text-white text-sm">{currentEmployee.fullName}</p>
                        <p className="text-xs text-teal-400 font-medium group-hover:text-teal-300">{currentEmployee.role}</p>
                    </div>
                    <div className="relative">
                        {currentEmployee.profilePhotoUrl ? (
                            <img src={currentEmployee.profilePhotoUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-gray-400 p-2 bg-gray-700/50 rounded-full" />
                        )}
                        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${currentEmployee.status === 'Active' ? 'bg-green-400' : 'bg-red-400'} ring-2 ring-gray-800`}></span>
                    </div>
                </button>
                
                <div className="relative">
                    <label htmlFor="employee-switcher" className="sr-only">Switch Employee</label>
                    <select
                        id="employee-switcher"
                        value={currentEmployee.id}
                        onChange={handleEmployeeChange}
                        className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                        aria-label="Switch logged in employee"
                    >
                        {allEmployees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.fullName}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
