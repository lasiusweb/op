import React, { useState } from 'react';
import type { Employee } from '../types';
import { UserCircleIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';

interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

interface OrgChartNodeProps {
  node: TreeNode;
  onViewProfile: (employeeId: string) => void;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ node, onViewProfile }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const hasChildren = node.children && node.children.length > 0;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <li className="relative">
             {/* The vertical line connecting to the parent */}
            <div className="absolute left-[18px] top-0 bottom-6 w-px bg-gray-600"></div>

            <div className="relative pl-12 pt-1">
                {/* The horizontal line connecting to the node */}
                <div className="absolute left-[18px] top-9 w-6 h-px bg-gray-600"></div>

                <div className="relative flex items-start space-x-3 mb-1">
                    {/* The node itself */}
                    <div className="flex-shrink-0">
                         <div className="relative group">
                            {node.employee.profilePhotoUrl ? (
                                <img
                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-700 bg-gray-800"
                                    src={node.employee.profilePhotoUrl}
                                    alt={node.employee.fullName}
                                />
                            ) : (
                                <UserCircleIcon className="h-10 w-10 rounded-full text-gray-500 bg-gray-800 ring-2 ring-gray-700" />
                            )}
                            <span
                                className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-gray-800 ${
                                    node.employee.status === 'Active' ? 'bg-green-400' : 'bg-red-500'
                                }`}
                            />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div>
                             <button onClick={() => onViewProfile(node.employee.id)} className="text-left">
                                <p className="text-sm font-semibold text-white hover:text-teal-400 transition-colors">{node.employee.fullName}</p>
                            </button>
                             <p className="text-xs text-gray-400">{node.employee.role}</p>
                        </div>
                    </div>
                     {hasChildren && (
                        <button
                            onClick={handleToggle}
                            className="absolute -left-5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 z-10"
                        >
                            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                        </button>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <ul className="pl-0 mt-2 space-y-2">
                        {node.children.map(childNode => (
                            <OrgChartNode key={childNode.employee.id} node={childNode} onViewProfile={onViewProfile} />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
};

export default OrgChartNode;