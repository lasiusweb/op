import React, { useState } from 'react';
import { CubeIcon, PeopleIcon, UserGroupIcon, ClipboardListIcon, GlobeAltIcon, ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon, BanknotesIcon, DocumentChartBarIcon, ReceiptPercentIcon, WrenchScrewdriverIcon, MapPinIcon, HomeModernIcon, BuildingLibraryIcon, BeakerIcon, CreditCardIcon, ShieldCheckIcon, CloudIcon, BookOpenIcon, LinkIcon, SignalIcon, RectangleGroupIcon, UmbrellaIcon, FolderIcon, Squares2X2Icon, RectangleStackIcon, XMarkIcon, BriefcaseIcon, ClipboardDocumentListIcon as VisitIcon } from '../Icons';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) => {
  const dashboardsAndReportsPagesInfo = [
    { name: 'Executive Dashboard', page: 'dashboard', icon: <CubeIcon className="h-5 w-5 mr-3"/> },
    { name: 'Analytics', page: 'analyticsDashboard', icon: <DocumentChartBarIcon className="h-5 w-5 mr-3"/> },
    { name: 'Sustainability', page: 'sustainability', icon: <GlobeAltIcon className="h-5 w-5 mr-3"/> },
    { name: 'Environmental', page: 'environmentalMonitoring', icon: <CloudIcon className="h-5 w-5 mr-3"/> },
    { name: 'IoT & Sensor Data', page: 'iotSensorData', icon: <SignalIcon className="h-5 w-5 mr-3"/> },
  ];

  const coreManagementPagesInfo = [
    { name: 'Farmer Management', page: 'farmers', icon: <PeopleIcon className="h-5 w-5 mr-3"/> },
    { name: 'Partner & Vendor Mgmt', page: 'vendorManagement', icon: <BriefcaseIcon className="h-5 w-5 mr-3"/> },
  ];

  const employeeHubPagesInfo = [
      { name: 'Employee List', page: 'employees' },
      { name: 'Org Chart', page: 'employeeHierarchy' },
      { name: 'On/Offboarding', page: 'employeeLifecycle' },
      { name: 'Change Requests', page: 'profileChangeRequests' },
      { name: 'Retirements', page: 'upcomingRetirements' },
  ];

  const taskManagementPagesInfo = [
    { name: 'Field Agent Tasks', page: 'fieldAgentTasks', icon: <MapPinIcon className="h-5 w-5 mr-3"/> },
    { name: 'General Tasks', page: 'generalTasks', icon: <ClipboardListIcon className="h-5 w-5 mr-3"/> },
  ];

  const farmerServicesPagesInfo = [
      { name: 'Farmer Self-Service', page: 'farmerPortal', icon: <RectangleGroupIcon className="h-5 w-5 mr-3"/> },
      { name: 'Subsidy Applications', page: 'subsidyApplications', icon: <DocumentTextIcon className="h-5 w-5 mr-3"/> },
      { name: 'Document Verification', page: 'documentVerification', icon: <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3"/> },
      { name: 'Crop Insurance', page: 'cropInsurance', icon: <UmbrellaIcon className="h-5 w-5 mr-3"/> },
      { name: 'Farmer Assistance', page: 'farmerAssistanceLedger', icon: <ReceiptPercentIcon className="h-5 w-5 mr-3"/> },
  ];
  
  const visitManagementPagesInfo = [
    { name: 'Manage Visits', page: 'manageVisits' },
    { name: 'Add Visit', page: 'addVisit' },
    { name: 'Manage Visit Slots', page: 'manageVisitSlots' },
    { name: 'Visit Report', page: 'visitReport' },
    { name: 'Visit Count Report', page: 'visitCountReport' },
    { name: 'Visit Map View', page: 'visitMapView' },
    { name: 'Visit Travel Time', page: 'visitTravelTime' },
    { name: 'Visit Setting', page: 'visitSetting' },
    { name: 'Visit Summary Report', page: 'visitSummaryReport' },
    { name: 'Monthly Visit Report', page: 'monthlyVisitReport' },
    { name: 'Employee Visit Setting', page: 'employeeVisitSetting' },
    { name: 'Missed Route Visit Report', page: 'missedRouteVisitReport' },
    { name: 'Manage Assign Visit Template', page: 'manageAssignVisitTemplate' },
    { name: 'Manage Assign Equipment Template', page: 'manageAssignEquipmentTemplate' },
    { name: 'Visit Template Report', page: 'visitTemplateReport' },
    { name: 'Average Meeting Monthly', page: 'averageMeetingMonthly' },
    { name: 'Hourly Visit Report', page: 'hourlyVisitReport' },
  ];
  
  const farmAndProcurementOpsPagesInfo = [
      { name: 'Procurement Batches', page: 'procurementBatches', icon: <CubeIcon className="h-5 w-5 mr-3"/> },
      { name: 'Plantation Log', page: 'plantationLog', icon: <DocumentChartBarIcon className="h-5 w-5 mr-3"/> },
      { name: 'Harvest Log', page: 'harvestLog', icon: <ReceiptPercentIcon className="h-5 w-5 mr-3"/> },
      { name: 'Irrigation Tracker', page: 'microIrrigationTracker', icon: <WrenchScrewdriverIcon className="h-5 w-5 mr-3"/> },
      { name: 'Oil Extraction', page: 'oilExtraction', icon: <BeakerIcon className="h-5 w-5 mr-3"/> },
      { name: 'Inspection Log', page: 'inspections', icon: <MagnifyingGlassIcon className="h-5 w-5 mr-3"/> },
  ];

  const financialsPagesInfo = [
      { name: 'Financial Sanctions', page: 'financialSanctions', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Billing & Financials', page: 'billing', icon: <CreditCardIcon className="h-5 w-5 mr-3"/> },
      { name: 'Payment Reconciliation', page: 'paymentReconciliation', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Non-Subsidy Payments', page: 'nonSubsidyPaymentLog', icon: <BanknotesIcon className="h-5 w-5 mr-3"/> },
      { name: 'Banking Integration', page: 'bankingIntegration', icon: <LinkIcon className="h-5 w-5 mr-3" /> },
  ];
  
  const inventoryPagesInfo = [
      { name: 'Nursery Inventory', page: 'nurseryInventory', icon: <WrenchScrewdriverIcon className="h-5 w-5 mr-3"/> },
      { name: 'Procurement Centers', page: 'procurementCenterInventory', icon: <HomeModernIcon className="h-5 w-5 mr-3"/> },
      { name: 'Factory Inventory', page: 'factoryInventory', icon: <BuildingLibraryIcon className="h-5 w-5 mr-3"/> },
      { name: 'Stock Reconciliation', page: 'stockReconciliation', icon: <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3"/> },
  ];
  
  const masterPagesInfo = [
    { name: 'Districts', page: 'districtMaster' },
    { name: 'Mandals', page: 'mandalMaster' },
    { name: 'Villages', page: 'villageMaster' },
    { name: 'Land Parcels', page: 'landParcelMaster' },
    { name: 'Procurement Centers', page: 'procurementCenterMaster' },
    { name: 'Factory Master', page: 'factoryMaster' },
    { name: 'All Locations', page: 'locationMaster' },
  ];

  const systemAndResourcesPagesInfo = [
    { name: 'SLA & Performance', page: 'slaPerformanceManager', icon: <ShieldCheckIcon className="h-5 w-5 mr-3" /> },
    { name: 'Knowledge Base', page: 'knowledgeBase', icon: <BookOpenIcon className="h-5 w-5 mr-3" /> },
    { name: 'Document Management', page: 'documentManager', icon: <FolderIcon className="h-5 w-5 mr-3" /> },
  ];


  const [isDashboardsOpen, setIsDashboardsOpen] = useState(dashboardsAndReportsPagesInfo.some(p => p.page === currentPage));
  const [isCoreManagementOpen, setIsCoreManagementOpen] = useState(coreManagementPagesInfo.some(p => p.page === currentPage));
  const [isEmployeeHubOpen, setIsEmployeeHubOpen] = useState(employeeHubPagesInfo.some(p => p.page === currentPage));
  const [isTaskManagementOpen, setIsTaskManagementOpen] = useState(taskManagementPagesInfo.some(p => p.page === currentPage));
  const [isFarmerServicesOpen, setIsFarmerServicesOpen] = useState(farmerServicesPagesInfo.some(p => p.page === currentPage));
  const [isVisitManagementOpen, setIsVisitManagementOpen] = useState(visitManagementPagesInfo.some(p => p.page === currentPage));
  const [isOpsOpen, setIsOpsOpen] = useState(farmAndProcurementOpsPagesInfo.some(p => p.page === currentPage));
  const [isFinancialsOpen, setIsFinancialsOpen] = useState(financialsPagesInfo.some(p => p.page === currentPage));
  const [isInventoryOpen, setIsInventoryOpen] = useState(inventoryPagesInfo.some(p => p.page === currentPage));
  const [isMastersOpen, setIsMastersOpen] = useState(masterPagesInfo.some(p => p.page === currentPage));
  const [isSystemResourcesOpen, setIsSystemResourcesOpen] = useState(systemAndResourcesPagesInfo.some(p => p.page === currentPage));


  const renderCollapsibleMenu = (
    title: string,
    icon: React.ReactNode,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    pages: { name: string; page: string; icon?: React.ReactNode }[]
  ) => (
      <li>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 my-1 rounded-lg transition-colors duration-200 ${
            isOpen || pages.some(p => p.page === currentPage)
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
            <div className="flex items-center">
            {icon}
            <span className="font-semibold">{title}</span>
            </div>
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
        {isOpen && (
            <ul className="mt-1 space-y-0.5 pl-8">
            {pages.map(item => (
                <li key={item.name}>
                    <button
                    onClick={() => setCurrentPage(item.page)}
                    className={`w-full flex items-center text-left py-2 px-3 rounded-md text-sm transition-colors duration-200 ${
                        currentPage === item.page
                        ? 'bg-teal-500/10 text-teal-300 font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    >
                    {item.icon ? item.icon : <span className="w-5 mr-3 h-5 flex-shrink-0"></span>}
                    {item.name}
                    </button>
                </li>
            ))}
            </ul>
        )}
    </li>
  );

  return (
    <aside className={`bg-gray-900/70 backdrop-blur-md border-r border-gray-700/50 p-4 flex flex-col transition-transform duration-300 ease-in-out w-64 fixed inset-y-0 left-0 z-30 lg:static lg:translate-x-0 flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="text-white text-2xl font-bold mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4v7m0 0l-3-3m3 3l3-3m-3 7a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span className="tracking-tight">Hapsara</span>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white" aria-label="Close sidebar">
            <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto -mr-2 pr-2">
        <ul className="space-y-1">
            {renderCollapsibleMenu("Dashboards & Reports", <Squares2X2Icon className="h-5 w-5 mr-3" />, isDashboardsOpen, setIsDashboardsOpen, dashboardsAndReportsPagesInfo)}
            {renderCollapsibleMenu("Core Management", <UserGroupIcon className="h-5 w-5 mr-3" />, isCoreManagementOpen, setIsCoreManagementOpen, coreManagementPagesInfo)}
            {renderCollapsibleMenu("Employee Hub", <BriefcaseIcon className="h-5 w-5 mr-3" />, isEmployeeHubOpen, setIsEmployeeHubOpen, employeeHubPagesInfo)}
            {renderCollapsibleMenu("Task Management", <ClipboardListIcon className="h-5 w-5 mr-3" />, isTaskManagementOpen, setIsTaskManagementOpen, taskManagementPagesInfo)}
            {renderCollapsibleMenu("Farmer Services", <PeopleIcon className="h-5 w-5 mr-3" />, isFarmerServicesOpen, setIsFarmerServicesOpen, farmerServicesPagesInfo)}
            {renderCollapsibleMenu("Visit Management", <VisitIcon className="h-5 w-5 mr-3" />, isVisitManagementOpen, setIsVisitManagementOpen, visitManagementPagesInfo)}
            {renderCollapsibleMenu("Farm & Procurement Ops", <WrenchScrewdriverIcon className="h-5 w-5 mr-3" />, isOpsOpen, setIsOpsOpen, farmAndProcurementOpsPagesInfo)}
            {renderCollapsibleMenu("Financials", <CreditCardIcon className="h-5 w-5 mr-3" />, isFinancialsOpen, setIsFinancialsOpen, financialsPagesInfo)}
            {renderCollapsibleMenu("Inventory Management", <RectangleStackIcon className="h-5 w-5 mr-3" />, isInventoryOpen, setIsInventoryOpen, inventoryPagesInfo)}
            {renderCollapsibleMenu("Masters", <GlobeAltIcon className="h-5 w-5 mr-3" />, isMastersOpen, setIsMastersOpen, masterPagesInfo)}
            {renderCollapsibleMenu("System & Resources", <BookOpenIcon className="h-5 w-5 mr-3" />, isSystemResourcesOpen, setIsSystemResourcesOpen, systemAndResourcesPagesInfo)}
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>Version 1.3.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;