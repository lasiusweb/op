import React, { useMemo } from 'react';
import type { Employee } from '../types';
import DashboardCard from '../components/DashboardCard';
import { CalendarDaysIcon } from '../components/Icons';

interface UpcomingRetirementsProps {
    allEmployees: Employee[];
}

const RETIREMENT_AGE = 60;
const NOTICE_PERIOD_MONTHS = 6;

const UpcomingRetirements: React.FC<UpcomingRetirementsProps> = ({ allEmployees }) => {
    
    const upcomingRetirees = useMemo(() => {
        const today = new Date();
        const noticeDate = new Date();
        noticeDate.setMonth(today.getMonth() + NOTICE_PERIOD_MONTHS);

        return allEmployees
            .filter(e => e.status === 'Active' && e.dob)
            .map(employee => {
                const dob = new Date(employee.dob);
                const retirementDate = new Date(dob);
                retirementDate.setFullYear(dob.getFullYear() + RETIREMENT_AGE);
                const age = today.getFullYear() - dob.getFullYear();

                return {
                    ...employee,
                    age,
                    retirementDate,
                };
            })
            .filter(e => e.retirementDate > today && e.retirementDate <= noticeDate)
            .sort((a, b) => a.retirementDate.getTime() - b.retirementDate.getTime());
    }, [allEmployees]);


    return (
        <DashboardCard title="Upcoming Retirements" icon={<CalendarDaysIcon />}>
            <p className="text-sm text-gray-400 mb-6">
                Showing active employees who will reach the retirement age of {RETIREMENT_AGE} within the next {NOTICE_PERIOD_MONTHS} months.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Date of Birth</th>
                            <th scope="col" className="px-6 py-3">Current Age</th>
                            <th scope="col" className="px-6 py-3">Retirement Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingRetirees.length > 0 ? (
                            upcomingRetirees.map((employee) => (
                                <tr key={employee.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{employee.fullName}</td>
                                    <td className="px-6 py-4">{employee.role}</td>
                                    <td className="px-6 py-4">{new Date(employee.dob).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{employee.age}</td>
                                    <td className="px-6 py-4 font-semibold text-yellow-300">{employee.retirementDate.toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-16 text-gray-500">
                                    No employees are scheduled for retirement in the upcoming {NOTICE_PERIOD_MONTHS} months.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default UpcomingRetirements;