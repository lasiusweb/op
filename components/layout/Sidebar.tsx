import React, { useState } from 'react';
// FIX: Added BuildingStorefrontIcon and BuildingOfficeIcon to imports.
import { CubeIcon, PeopleIcon, UserGroupIcon, ClipboardListIcon, GlobeAltIcon, ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon, BanknotesIcon, DocumentChartBarIcon, ReceiptPercentIcon, WrenchScrewdriverIcon, ArchiveBoxIcon, MapPinIcon, TruckIcon, BuildingStorefrontIcon, BuildingOfficeIcon, BeakerIcon, CreditCardIcon, ShieldCheckIcon, CloudIcon, BookOpenIcon, BriefcaseIcon, LinkIcon, SignalIcon, RectangleGroupIcon, UmbrellaIcon, FolderIcon } from '../Icons';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { name: 'Farmer Management', icon: <PeopleIcon />, page: 'farmers' },
    { name: 'User Management', icon: <UserGroupIcon />, page: 'users' },
    { name: 'Field Agent Tasks', icon: <MapPinIcon />, page: 'fieldAgentTasks' },
    { name: 'General Tasks', icon: <ClipboardListIcon />, page: 'generalTasks' },
  ];

  const dashboardsAndReportsPagesInfo = [
    { name: 'Executive Dashboard', page: 'dashboard', icon: <CubeIcon className="h-5 w-5 mr-3"/> },
    { name: 'Analytics', page: 'analyticsDashboard', icon: <DocumentChartBarIcon className="h-5 w-5 mr-3"/> },
    { name: 'Sustainability', page: 'sustainability', icon: <GlobeAltIcon className="h-5 w-5 mr-3"/> },
    { name: 'Environmental', page: 'environmentalMonitoring', icon: <CloudIcon className="h-5 w-5 mr-3"/> },
    { name: 'IoT & Sensor Data', page: 'iotSensorData', icon: <SignalIcon className="h-5 w-5 mr-3"/> },
  ];

  const masterPagesInfo = [
    { name: 'Districts', page: 'districtMaster' },
    { name: 'Mandals', page: 'mandalMaster' },
    { name: 'Villages', page: 'villageMaster' },
    { name: 'Land Parcels', page: 'landParcelMaster' },
    { name: 'Procurement Centers', page: 'procurementCenterMaster' },
    { name: 'Factory Master', page: 'factoryMaster' },
    { name: 'Partner & Vendor Mgmt', page: 'vendorManagement' },
    { name: 'All Locations', page: 'locationMaster' },
  ];

  const operationsPagesInfo = [
      { name: 'Subsidy Applications', page: 'subsidyApplications', icon: <DocumentTextIcon className="h-5 w-5 mr-3"/> },
      { name: 'Document Verification', page: 'documentVerification', icon: <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3"/> },
      { name: 'Inspection Log', page: 'inspections', icon: <MagnifyingGlassIcon className="h-5 w-5 mr-3"/> },
      { name: 'Procurement Batches', page: 'procurementBatches', icon: <CubeIcon className="h-5 w-5 mr-3"/> },
      { name: 'Financial Sanctions', page: 'financialSanctions', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Cultivation Log', page: 'cultivationLog', icon: <DocumentChartBarIcon className="h-5 w-5 mr-3"/> },
      { name: 'Harvest Log', page: 'harvestLog', icon: <ReceiptPercentIcon className="h-5 w-5 mr-3"/> },
      { name: 'Irrigation Tracker', page: 'microIrrigationTracker', icon: <WrenchScrewdriverIcon className="h-5 w-5 mr-3"/> },
      { name: 'Oil Extraction', page: 'oilExtraction', icon: <BeakerIcon className="h-5 w-5 mr-3"/> },
      { name: 'Billing & Financials', page: 'billing', icon: <CreditCardIcon className="h-5 w-5 mr-3"/> },
      { name: 'Payment Reconciliation', page: 'paymentReconciliation', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Non-Subsidy Payments', page: 'nonSubsidyPaymentLog', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Farmer Assistance', page: 'farmerAssistanceLedger', icon: <ReceiptPercentIcon className="h-5 w-5 mr-3"/> },
  ];
  
  const inventoryPagesInfo = [
      { name: 'Nursery Inventory', page: 'nurseryInventory', icon: <WrenchScrewdriverIcon className="h-5 w-5 mr-3"/> },
      { name: 'Procurement Centers', page: 'procurementCenterInventory', icon: <BuildingStorefrontIcon className="h-5 w-5 mr-3"/> },
      { name: 'Factory Inventory', page: 'factoryInventory', icon: <BuildingOfficeIcon className="h-5 w-5 mr-3"/> },
      { name: 'Stock Reconciliation', page: 'stockReconciliation', icon: <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3"/> },
  ];
  
  const managementPagesInfo = [
    { name: 'SLA & Performance', page: 'slaPerformanceManager', icon: <ShieldCheckIcon className="h-5 w-5 mr-3" /> },
    { name: 'Banking Integration', page: 'bankingIntegration', icon: <LinkIcon className="h-5 w-5 mr-3" /> },
    { name: 'Crop Insurance', page: 'cropInsurance', icon: <UmbrellaIcon className="h-5 w-5 mr-3" /> },
  ];

  const resourcesPagesInfo = [
    { name: 'Knowledge Base', page: 'knowledgeBase', icon: <BookOpenIcon className="h-5 w-5 mr-3" /> },
    { name: 'Document Management', page: 'documentManager', icon: <FolderIcon className="h-5 w-5 mr-3" /> },
  ];

  const [isDashboardsOpen, setIsDashboardsOpen] = useState(dashboardsAndReportsPagesInfo.some(p => p.page === currentPage));
  const [isMastersOpen, setIsMastersOpen] = useState(masterPagesInfo.some(p => p.page === currentPage));
  const [isOperationsOpen, setIsOperationsOpen] = useState(operationsPagesInfo.some(p => p.page === currentPage));
  const [isInventoryOpen, setIsInventoryOpen] = useState(inventoryPagesInfo.some(p => p.page === currentPage));
  const [isManagementOpen, setIsManagementOpen] = useState(managementPagesInfo.some(p => p.page === currentPage));
  const [isResourcesOpen, setIsResourcesOpen] = useState(resourcesPagesInfo.some(p => p.page === currentPage));


  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-md border-r border-gray-700/50 p-4 flex flex-col flex-shrink-0">
      <div className="text-white text-2xl font-bold mb-8 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4v7m0 0l-3-3m3 3l3-3m-3 7a4 4 0 110-8 4 4 0 010 8z" /></svg>
        <span>Agri-Platform</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-1">
            {/* Dashboards & Reports Menu */}
            <li>
                <button
                    onClick={() => setIsDashboardsOpen(!isDashboardsOpen)}
                    className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isDashboardsOpen || dashboardsAndReportsPagesInfo.some(p => p.page === currentPage)
                        ? 'text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <div className="flex items-center">
                    <CubeIcon className="mr-3" />
                    <span className="font-medium">Dashboards & Reports</span>
                    </div>
                    {isDashboardsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isDashboardsOpen && (
                    <ul className="pl-6 border-l border-gray-700 ml-4">
                    {dashboardsAndReportsPagesInfo.map(item => (
                        <li key={item.name}>
                            <button
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                                currentPage === item.page
                                ? 'bg-teal-500/10 text-teal-300'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                            {item.icon}
                            {item.name}
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </li>
             <li>
                <button
                    onClick={() => setCurrentPage('farmerPortal')}
                    className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                        currentPage === 'farmerPortal'
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <div className="mr-3"><RectangleGroupIcon /></div>
                    <span className="font-medium">Farmer Self-Service</span>
                </button>
            </li>
          {navItems.map(item => (
            <li key={item.name}>
              <button
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentPage === item.page
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="mr-3">{item.icon}</div>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
            {/* Operations Menu */}
            <li>
                <button
                    onClick={() => setIsOperationsOpen(!isOperationsOpen)}
                    className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isOperationsOpen || operationsPagesInfo.some(p => p.page === currentPage)
                        ? 'text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <div className="flex items-center">
                    <DocumentTextIcon className="mr-3" />
                    <span className="font-medium">Operations</span>
                    </div>
                    {isOperationsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isOperationsOpen && (
                    <ul className="pl-6 border-l border-gray-700 ml-4">
                    {operationsPagesInfo.map(item => (
                        <li key={item.name}>
                            <button
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                                currentPage === item.page
                                ? 'bg-teal-500/10 text-teal-300'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                            {item.icon}
                            {item.name}
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </li>
             {/* Inventory Menu */}
           <li>
              <button
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                  isInventoryOpen || inventoryPagesInfo.some(p => p.page === currentPage)
                    ? 'text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <ArchiveBoxIcon className="mr-3" />
                  <span className="font-medium">Inventory Mgmt</span>
                </div>
                {isInventoryOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
              {isInventoryOpen && (
                <ul className="pl-6 border-l border-gray-700 ml-4">
                  {inventoryPagesInfo.map(item => (
                     <li key={item.name}>
                        <button
                          onClick={() => setCurrentPage(item.page)}
                           className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                            currentPage === item.page
                              ? 'bg-teal-500/10 text-teal-300'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {item.icon}
                          {item.name}
                        </button>
                     </li>
                  ))}
                </ul>
              )}
            </li>
           {/* Management Menu */}
            <li>
                <button
                    onClick={() => setIsManagementOpen(!isManagementOpen)}
                    className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isManagementOpen || managementPagesInfo.some(p => p.page === currentPage)
                        ? 'text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <div className="flex items-center">
                    <ShieldCheckIcon className="mr-3" />
                    <span className="font-medium">Management</span>
                    </div>
                    {isManagementOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isManagementOpen && (
                    <ul className="pl-6 border-l border-gray-700 ml-4">
                    {managementPagesInfo.map(item => (
                        <li key={item.name}>
                            <button
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                                currentPage === item.page
                                ? 'bg-teal-500/10 text-teal-300'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                            {item.icon}
                            {item.name}
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </li>
           {/* Masters Menu */}
           <li>
              <button
                onClick={() => setIsMastersOpen(!isMastersOpen)}
                className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                  isMastersOpen || masterPagesInfo.some(p => p.page === currentPage)
                    ? 'text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <GlobeAltIcon className="mr-3" />
                  <span className="font-medium">Masters</span>
                </div>
                {isMastersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
              {isMastersOpen && (
                <ul className="pl-6 border-l border-gray-700 ml-4">
                  {masterPagesInfo.map(item => (
                     <li key={item.name}>
                        <button
                          onClick={() => setCurrentPage(item.page)}
                           className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                            currentPage === item.page
                              ? 'bg-teal-500/10 text-teal-300'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {item.name}
                        </button>
                     </li>
                  ))}
                </ul>
              )}
            </li>
            {/* Resources Menu */}
            <li>
                <button
                    onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                    className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isResourcesOpen || resourcesPagesInfo.some(p => p.page === currentPage)
                        ? 'text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <div className="flex items-center">
                    <BookOpenIcon className="mr-3" />
                    <span className="font-medium">Resources</span>
                    </div>
                    {isResourcesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isResourcesOpen && (
                    <ul className="pl-6 border-l border-gray-700 ml-4">
                    {resourcesPagesInfo.map(item => (
                        <li key={item.name}>
                            <button
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center py-2 px-3 my-1 rounded-md text-sm transition-colors duration-200 ${
                                currentPage === item.page
                                ? 'bg-teal-500/10 text-teal-300'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                            {item.icon}
                            {item.name}
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </li>
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>Version 1.2.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
