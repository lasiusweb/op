import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-700/60 rounded animate-pulse ${className}`} />
);

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-2/3">
            <Skeleton className="w-8 h-8 rounded mr-3" />
            <Skeleton className="w-1/2 h-6" />
        </div>
      </div>
      <div className="flex-grow space-y-4">
        <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 col-span-2 rounded-md" />
            <Skeleton className="h-20 col-span-1 rounded-md" />
        </div>
        <Skeleton className="w-full h-5 rounded" />
        <Skeleton className="w-3/4 h-5 rounded" />
        <div className="pt-4 space-y-3">
            <Skeleton className="w-full h-8 rounded" />
            <Skeleton className="w-full h-8 rounded" />
            <Skeleton className="w-full h-8 rounded" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th scope="col" className="p-4"><div className="flex items-center"><Skeleton className="h-4 w-4" /></div></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-32" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-40" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-32" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-16" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
                        <th scope="col" className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rows)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-700 bg-gray-800/50">
                            <td className="w-4 p-4"><div className="flex items-center"><Skeleton className="h-4 w-4" /></div></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
