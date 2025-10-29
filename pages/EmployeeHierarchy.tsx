import React, { useMemo } from 'react';
import type { Employee } from '../types';
import DashboardCard from '../components/DashboardCard';
import OrgChartNode from '../components/OrgChartNode';
import { UserGroupIcon } from '../components/Icons';

interface EmployeeHierarchyProps {
  allEmployees: Employee[];
  onViewProfile: (employeeId: string) => void;
}

interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

const buildTree = (employees: Employee[]): TreeNode[] => {
  const tree: TreeNode[] = [];
  const childrenOf: { [key: string]: TreeNode[] } = {};

  employees.forEach(employee => {
    const id = employee.id;
    const parentId = employee.reportingManagerId;

    if (!childrenOf[id]) {
      childrenOf[id] = [];
    }

    const node: TreeNode = {
      employee: employee,
      children: childrenOf[id]
    };

    if (parentId) {
      if (!childrenOf[parentId]) {
        childrenOf[parentId] = [];
      }
      childrenOf[parentId].push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};


const EmployeeHierarchy: React.FC<EmployeeHierarchyProps> = ({ allEmployees, onViewProfile }) => {

    const hierarchy = useMemo(() => buildTree(allEmployees), [allEmployees]);

    return (
        <DashboardCard title="Organizational Hierarchy" icon={<UserGroupIcon/>}>
            <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-6">
                    This chart illustrates the reporting structure of the organization. Click on an employee's name to view their profile. Use the expand/collapse buttons to navigate the hierarchy.
                </p>
                {hierarchy.length > 0 ? (
                    <ul>
                        {hierarchy.map(rootNode => (
                            <OrgChartNode key={rootNode.employee.id} node={rootNode} onViewProfile={onViewProfile} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <p>No organizational data available to build the hierarchy.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};

export default EmployeeHierarchy;