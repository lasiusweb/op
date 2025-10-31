
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { PageLoader } from './components/Skeletons';


// Lazy load all page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Farmers = lazy(() => import('./pages/Farmers'));
const Employees = lazy(() => import('./pages/Users'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Profile = lazy(() => import('./pages/Profile'));
const DistrictMaster = lazy(() => import('./pages/DistrictMaster'));
const MandalMaster = lazy(() => import('./pages/MandalMaster'));
const VillageMaster = lazy(() => import('./pages/VillageMaster'));
const LandParcelMaster = lazy(() => import('./pages/LandParcelMaster'));
const LocationMaster = lazy(() => import('./pages/LocationMaster'));
const ProcurementBatchMaster = lazy(() => import('./pages/ProcurementBatchMaster'));
const ProcurementCenterMaster = lazy(() => import('./pages/ProcurementCenterMaster'));
const FactoryMaster = lazy(() => import('./pages/FactoryMaster'));
const SubsidyApplications = lazy(() => import('./pages/SubsidyApplications'));
const DocumentVerification = lazy(() => import('./pages/DocumentVerification'));
const InspectionLog = lazy(() => import('./pages/InspectionLog'));
const FinancialSanctions = lazy(() => import('./pages/FinancialSanctions'));
const CultivationLog = lazy(() => import('./pages/CultivationLog'));
const HarvestLog = lazy(() => import('./pages/HarvestLog'));
const MicroIrrigationTracker = lazy(() => import('./pages/MicroIrrigationTracker'));
const FieldAgentTasks = lazy(() => import('./pages/FieldAgentTasks'));
const OilExtraction = lazy(() => import('./pages/OilExtraction'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Billing = lazy(() => import('./pages/Billing'));
const PaymentReconciliation = lazy(() => import('./pages/PaymentReconciliation'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const SlaPerformanceManager = lazy(() => import('./pages/SlaPerformanceManager'));
const NonSubsidyPaymentLog = lazy(() => import('./pages/NonSubsidyPaymentLog'));
const FarmerAssistanceLedger = lazy(() => import('./pages/FarmerAssistanceLedger'));
const EnvironmentalMonitoring = lazy(() => import('./pages/EnvironmentalMonitoring'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const BankingIntegration = lazy(() => import('./pages/BankingIntegration'));
const IotSensorData = lazy(() => import('./pages/IotSensorData'));
const FarmerPortal = lazy(() => import('./pages/FarmerPortal'));
const CropInsurance = lazy(() => import('./pages/CropInsurance'));
const DocumentManager = lazy(() => import('./pages/DocumentManager'));
const AddFarmer = lazy(() => import('./pages/AddFarmer'));
const AddEmployee = lazy(() => import('./pages/AddEmployee'));
const ManageVisits = lazy(() => import('./pages/ManageVisits'));
const ManageVisitSlots = lazy(() => import('./pages/ManageVisitSlots'));
const VisitReport = lazy(() => import('./pages/VisitReport'));
const VisitCountReport = lazy(() => import('./pages/VisitCountReport'));
const VisitMapView = lazy(() => import('./pages/VisitMapView'));
const VisitTravelTime = lazy(() => import('./pages/VisitTravelTime'));
const VisitSetting = lazy(() => import('./pages/VisitSetting'));
const VisitSummaryReport = lazy(() => import('./pages/VisitSummaryReport'));
const MonthlyVisitReport = lazy(() => import('./pages/MonthlyVisitReport'));
const EmployeeVisitSetting = lazy(() => import('./pages/EmployeeVisitSetting'));
const MissedRouteVisitReport = lazy(() => import('./pages/MissedRouteVisitReport'));
const ManageAssignVisitTemplate = lazy(() => import('./pages/ManageAssignVisitTemplate'));
const ManageAssignEquipmentTemplate = lazy(() => import('./pages/ManageAssignEquipmentTemplate'));
const VisitTemplateReport = lazy(() => import('./pages/VisitTemplateReport'));
const AverageMeetingMonthly = lazy(() => import('./pages/AverageMeetingMonthly'));
const HourlyVisitReport = lazy(() => import('./pages/HourlyVisitReport'));
const EmployeeHierarchy = lazy(() => import('./pages/EmployeeHierarchy'));
const EmployeeLifecycle = lazy(() => import('./pages/EmployeeLifecycle'));
const UpcomingRetirements = lazy(() => import('./pages/UpcomingRetirements'));
const ProfileChangeRequests = lazy(() => import('./pages/ProfileChangeRequests'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// New Inventory Management Pages
const InventoryAdjustments = lazy(() => import('./pages/InventoryAdjustments'));
const Packages = lazy(() => import('./pages/Packages'));
const Shipments = lazy(() => import('./pages/Shipments'));
const SalesOrders = lazy(() => import('./pages/SalesOrders'));
const Invoices = lazy(() => import('./pages/Invoices'));
const DeliveryChallans = lazy(() => import('./pages/DeliveryChallans'));
const PaymentsReceived = lazy(() => import('./pages/PaymentsReceived'));
const SalesReturns = lazy(() => import('./pages/SalesReturns'));
const CreditNotes = lazy(() => import('./pages/CreditNotes'));
const Vendors = lazy(() => import('./pages/Vendors'));
const Expenses = lazy(() => import('./pages/Expenses'));
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders'));
const PurchaseReceives = lazy(() => import('./pages/PurchaseReceives'));
const Bills = lazy(() => import('./pages/Bills'));
const PaymentsMade = lazy(() => import('./pages/PaymentsMade'));
const VendorCredits = lazy(() => import('./pages/VendorCredits'));
const EWayBills = lazy(() => import('./pages/EWayBills'));


import type { Employee, Farmer, LandParcel, NurseryInventoryItem, CultivationLog as CultivationLogType, FarmVisitRequest, EmployeeActivity, Task, ProfileChangeRequest, FarmerProfileChangeRequest } from './types';
import { mockEmployees, mockTasks, mockFarmersData, mockLandParcels, mockNurseryInventory, mockSubsidyApplications, mockProcurementBatches, mockCultivationLogs, mockFarmVisitRequests, mockEmployeeActivity, mockProfileChangeRequests, mockPayments, mockDocuments, mockCropInsurancePolicies, mockFarmerProfileChangeRequests } from './data/mockData';

interface PageState {
    page: string;
    visitFilterAgentId: string | null;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageHistory, setPageHistory] = useState<PageState[]>([{ page: 'dashboard', visitFilterAgentId: null }]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [farmers, setFarmers] = useState<Farmer[]>(mockFarmersData);
  const [landParcels, setLandParcels] = useState<LandParcel[]>(mockLandParcels);
  const [nurseryInventory, setNurseryInventory] = useState<NurseryInventoryItem[]>(mockNurseryInventory);
  const [cultivationLogs, setCultivationLogs] = useState<CultivationLogType[]>(mockCultivationLogs);
  const [farmVisitRequests, setFarmVisitRequests] = useState<FarmVisitRequest[]>(mockFarmVisitRequests);
  const [employeeActivity, setEmployeeActivity] = useState<EmployeeActivity[]>(mockEmployeeActivity);
  const [profileChangeRequests, setProfileChangeRequests] = useState<ProfileChangeRequest[]>(mockProfileChangeRequests);
  const [farmerProfileChangeRequests, setFarmerProfileChangeRequests] = useState<FarmerProfileChangeRequest[]>(mockFarmerProfileChangeRequests);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employees[1]); // Default to a non-admin
  const [viewingEmployeeId, setViewingEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const currentPageState = pageHistory[pageHistory.length - 1];
  const currentPage = currentPageState.page;
  const visitFilterAgentId = currentPageState.visitFilterAgentId;

  const handleLogin = () => {
    setPageHistory([{ page: 'dashboard', visitFilterAgentId: null }]);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setPageHistory([{ page: 'dashboard', visitFilterAgentId: null }]);
    setIsLoggedIn(false);
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => setLoading(false), 2500); // Simulate loading for skeletons

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, []);

  const handleSetCurrentPage = useCallback((page: string, newState?: Partial<Omit<PageState, 'page'>>) => {
    setPageHistory(prevHistory => {
        const current = prevHistory[prevHistory.length - 1];
        
        const newPageState: PageState = {
            page,
            visitFilterAgentId: page === 'manageVisits' ? (newState?.visitFilterAgentId !== undefined ? newState.visitFilterAgentId : current.visitFilterAgentId) : null,
        };

        if (current.page === newPageState.page && current.visitFilterAgentId === newPageState.visitFilterAgentId) {
            return prevHistory;
        }
        
        return [...prevHistory, newPageState];
    });

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    setPageHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  useEffect(() => {
    if (currentPage === 'profile' && viewingEmployeeId) {
      const employeeExists = employees.some(u => u.id === viewingEmployeeId);
      if (!employeeExists) {
        handleSetCurrentPage('employees');
      }
    }
  }, [currentPage, viewingEmployeeId, employees, handleSetCurrentPage]);


  const pageTitles: { [key: string]: string } = {
      dashboard: 'Executive Dashboard',
      farmers: 'Farmer Management',
      addFarmer: 'Add New Farmer',
      employees: 'Employee & Role Management',
      addEmployee: 'Add New Employee',
      employeeHierarchy: 'Organizational Chart',
      employeeLifecycle: 'Employee Lifecycle',
      profileChangeRequests: 'Profile Change Requests',
      upcomingRetirements: 'Upcoming Retirements',
      generalTasks: 'General Task Management',
      fieldAgentTasks: 'Field Agent Task Board',
      profile: 'Employee Profile',
      districtMaster: 'District Master',
      mandalMaster: 'Mandal Master',
      villageMaster: 'Village Master',
      landParcelMaster: 'Land Parcel Master',
      locationMaster: 'All Location Master',
      procurementCenterMaster: 'Procurement Center Master',
      factoryMaster: 'Factory Master',
      subsidyApplications: 'Subsidy Applications',
      documentVerification: 'Document Verification',
      inspections: 'Inspection Log',
      procurementBatches: 'Procurement Batch Management',
      financialSanctions: 'Financial Sanctions',
      cultivationLog: 'Cultivation Log',
      harvestLog: 'Harvest Log',
      microIrrigationTracker: 'Micro-Irrigation Tracker',
      oilExtraction: 'Oil Extraction Log',
      sustainability: 'Sustainability & Carbon Footprint',
      billing: 'Billing & Financials',
      paymentReconciliation: 'Payment Reconciliation',
      analyticsDashboard: 'Dashboard & Analytics',
      slaPerformanceManager: 'SLA & Performance Manager',
      nonSubsidyPaymentLog: 'Non-Subsidy Payment Log',
      farmerAssistanceLedger: 'Farmer Assistance & Disbursement Ledger',
      environmentalMonitoring: 'Environmental & Weather Monitoring',
      knowledgeBase: 'Knowledge Base & Training',
      bankingIntegration: 'Banking & Payment Gateway Integration',
      iotSensorData: 'IoT & Sensor Data',
      farmerPortal: 'Farmer Self-Service Portal',
      cropInsurance: 'Crop Insurance & Risk Manager',
      documentManager: 'Document Management System',
      manageVisits: "Manage Visits",
      addVisit: "Add Visit",
      manageVisitSlots: "Manage Visit Slots",
      visitReport: "Visit Report",
      visitCountReport: "Visit Count Report",
      visitMapView: "Visit Map View",
      visitTravelTime: "Visit Travel Time",
      visitSetting: "Visit Setting",
      visitSummaryReport: "Visit Summary Report",
      monthlyVisitReport: "Monthly Visit Report",
      employeeVisitSetting: "Employee Visit Setting",
      missedRouteVisitReport: "Missed Route Visit Report",
      manageAssignVisitTemplate: "Manage Assign Visit Template",
      manageAssignEquipmentTemplate: "Manage Assign Equipment Template",
      visitTemplateReport: "Visit Template Report",
      averageMeetingMonthly: "Average Meeting Monthly",
      hourlyVisitReport: "Hourly Visit Report",
      // New Inventory Titles
      inventoryAdjustments: "Inventory Adjustments",
      packages: "Packages",
      shipments: "Shipments",
      salesOrders: "Sales Orders",
      invoices: "Invoices",
      deliveryChallans: "Delivery Challans",
      paymentsReceived: "Payments Received",
      salesReturns: "Sales Returns",
      creditNotes: "Credit Notes",
      vendors: "Vendors",
      expenses: "Expenses",
      purchaseOrders: "Purchase Orders",
      purchaseReceives: "Purchase Receives",
      bills: "Bills",
      paymentsMade: "Payments Made",
      vendorCredits: "Vendor Credits",
      eWayBills: "e-Way Bills",
  }

  const handleViewProfile = useCallback((employeeId: string) => {
    setViewingEmployeeId(employeeId);
    handleSetCurrentPage('profile');
  }, [handleSetCurrentPage]);
  
  const handleViewEmployeeVisits = useCallback((employeeId: string) => {
    handleSetCurrentPage('manageVisits', { visitFilterAgentId: employeeId });
  }, [handleSetCurrentPage]);

  const handleProfileChangeRequestUpdate = useCallback((updatedRequest: ProfileChangeRequest, changes: Partial<Employee>) => {
    setProfileChangeRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
    if(updatedRequest.status === 'Approved') {
        setEmployees(prev => prev.map(emp => emp.id === updatedRequest.employeeId ? { ...emp, ...changes } : emp));
    }
  }, []);
  
  const handleAddProfileChangeRequest = useCallback((newRequest: ProfileChangeRequest) => {
      setProfileChangeRequests(prev => [newRequest, ...prev]);
  }, []);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, []);

  const handleAddNewFarmer = useCallback((newFarmer: Farmer, newLandParcel: LandParcel) => {
    setFarmers(prev => [newFarmer, ...prev]);
    setLandParcels(prev => [newLandParcel, ...prev]);
    setConfirmationMessage(`Farmer ${newFarmer.fullName} added successfully!`);
    handleSetCurrentPage('farmers');
  }, [handleSetCurrentPage]);

  const handleAddNewEmployee = useCallback((newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    setConfirmationMessage(`Employee ${newEmployee.fullName} added successfully!`);
    handleSetCurrentPage('employees');
  }, [handleSetCurrentPage]);

  const handleAddCultivationLog = useCallback((newLog: CultivationLogType) => {
    setCultivationLogs(prev => [newLog, ...prev]);
  }, []);

  const handleAddFarmVisitRequest = useCallback((newRequest: FarmVisitRequest) => {
    setFarmVisitRequests(prev => [newRequest, ...prev]);
  }, []);
  
  const handleAddFarmerProfileChangeRequest = useCallback((newRequest: FarmerProfileChangeRequest) => {
      setFarmerProfileChangeRequests(prev => [newRequest, ...prev]);
  }, []);

  const handleUpdateFarmVisitRequest = useCallback((updatedRequest: FarmVisitRequest) => {
      setFarmVisitRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
  }, []);

  const viewingEmployee = employees.find(u => u.id === viewingEmployeeId);
  
  // Stable callbacks for navigation and actions to prevent re-renders
  const handleGoToAddFarmer = useCallback(() => handleSetCurrentPage('addFarmer'), [handleSetCurrentPage]);
  const handleGoToFarmers = useCallback(() => handleSetCurrentPage('farmers'), [handleSetCurrentPage]);
  const handleGoToAddEmployee = useCallback(() => handleSetCurrentPage('addEmployee'), [handleSetCurrentPage]);
  const handleGoToEmployees = useCallback(() => handleSetCurrentPage('employees'), [handleSetCurrentPage]);

  const handleViewCurrentEmployeeProfile = useCallback(() => {
    handleViewProfile(currentEmployee.id);
  }, [currentEmployee.id, handleViewProfile]);
  
  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  if (!isLoggedIn) {
      return (
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-gray-900"><PageLoader /></div>}>
            <LandingPage onLogin={handleLogin} />
        </Suspense>
      );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
       {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          aria-hidden="true"
        ></div>
      )}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handleSetCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
       />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            title={pageTitles[currentPage] || 'Dashboard'} 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            allTasks={tasks}
            setCurrentEmployee={setCurrentEmployee}
            onViewProfile={handleViewCurrentEmployeeProfile}
            onToggleSidebar={handleOpenSidebar}
            canGoBack={pageHistory.length > 1}
            onGoBack={handleGoBack}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800/50 p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
                {currentPage === 'dashboard' && <Dashboard loading={loading} />}
                {currentPage === 'farmers' && <Farmers 
                    loading={loading} 
                    onAddNewFarmer={handleGoToAddFarmer} 
                    allFarmers={farmers} 
                    setAllFarmers={setFarmers} 
                    confirmationMessage={confirmationMessage}
                    setConfirmationMessage={setConfirmationMessage}
                />}
                {currentPage === 'addFarmer' && <AddFarmer onAddFarmer={handleAddNewFarmer} onCancel={handleGoToFarmers} allFarmers={farmers} />}
                {currentPage === 'employees' && <Employees
                            currentEmployee={currentEmployee} 
                            allEmployees={employees} 
                            setAllEmployees={setEmployees} 
                            onViewProfile={handleViewProfile} 
                            allVisitRequests={farmVisitRequests}
                            onViewVisits={handleViewEmployeeVisits}
                            onAddNewEmployee={handleGoToAddEmployee}
                            confirmationMessage={confirmationMessage}
                            setConfirmationMessage={setConfirmationMessage}
                         />}
                {currentPage === 'addEmployee' && <AddEmployee onAddEmployee={handleAddNewEmployee} onCancel={handleGoToEmployees} allEmployees={employees} />}
                {currentPage === 'employeeHierarchy' && <EmployeeHierarchy allEmployees={employees} onViewProfile={handleViewProfile} />}
                {currentPage === 'employeeLifecycle' && <EmployeeLifecycle onViewProfile={handleViewProfile} />}
                {currentPage === 'upcomingRetirements' && <UpcomingRetirements allEmployees={employees} />}
                {currentPage === 'profileChangeRequests' && <ProfileChangeRequests requests={profileChangeRequests} employees={employees} onUpdateRequest={handleProfileChangeRequestUpdate} />}
                {currentPage === 'generalTasks' && <Tasks />}
                {currentPage === 'fieldAgentTasks' && <FieldAgentTasks />}
                {currentPage === 'districtMaster' && <DistrictMaster />}
                {currentPage === 'mandalMaster' && <MandalMaster />}
                {currentPage === 'villageMaster' && <VillageMaster />}
                {currentPage === 'landParcelMaster' && <LandParcelMaster />}
                {currentPage === 'locationMaster' && <LocationMaster />}
                {currentPage === 'procurementCenterMaster' && <ProcurementCenterMaster />}
                {currentPage === 'factoryMaster' && <FactoryMaster />}
                {currentPage === 'procurementBatches' && <ProcurementBatchMaster />}
                {currentPage === 'subsidyApplications' && <SubsidyApplications />}
                {currentPage === 'documentVerification' && <DocumentVerification />}
                {currentPage === 'inspections' && <InspectionLog />}
                {currentPage === 'financialSanctions' && <FinancialSanctions />}
                {currentPage === 'cultivationLog' && <CultivationLog />}
                {currentPage === 'harvestLog' && <HarvestLog />}
                {currentPage === 'microIrrigationTracker' && <MicroIrrigationTracker />}
                {currentPage === 'oilExtraction' && <OilExtraction />}
                {currentPage === 'sustainability' && <Sustainability />}
                {currentPage === 'billing' && <Billing />}
                {currentPage === 'paymentReconciliation' && <PaymentReconciliation />}
                {currentPage === 'analyticsDashboard' && <AnalyticsDashboard />}
                {currentPage === 'slaPerformanceManager' && <SlaPerformanceManager />}
                {currentPage === 'nonSubsidyPaymentLog' && <NonSubsidyPaymentLog />}
                {currentPage === 'farmerAssistanceLedger' && <FarmerAssistanceLedger />}
                {currentPage === 'environmentalMonitoring' && <EnvironmentalMonitoring />}
                {currentPage === 'knowledgeBase' && <KnowledgeBase />}
                {currentPage === 'bankingIntegration' && <BankingIntegration />}
                {currentPage === 'iotSensorData' && <IotSensorData />}
                {currentPage === 'farmerPortal' && <FarmerPortal 
                  allFarmers={farmers}
                  allLandParcels={landParcels}
                  allSubsidyApps={mockSubsidyApplications} 
                  allProcurementBatches={mockProcurementBatches}
                  allPayments={mockPayments}
                  allDocuments={mockDocuments}
                  allCropInsurancePolicies={mockCropInsurancePolicies}
                  cultivationLogs={cultivationLogs}
                  farmVisitRequests={farmVisitRequests}
                  onAddLog={handleAddCultivationLog}
                  onAddVisitRequest={handleAddFarmVisitRequest}
                  onAddProfileChangeRequest={handleAddFarmerProfileChangeRequest}
                  setCurrentPage={handleSetCurrentPage}
                />}
                {currentPage === 'cropInsurance' && <CropInsurance />}
                {currentPage === 'documentManager' && <DocumentManager />}
                {(currentPage === 'manageVisits' || currentPage === 'addVisit') && <ManageVisits 
                    allVisitRequests={farmVisitRequests}
                    onAddRequest={handleAddFarmVisitRequest}
                    onUpdateRequest={handleUpdateFarmVisitRequest}
                    filterAgentId={visitFilterAgentId}
                />}
                {currentPage === 'manageVisitSlots' && <ManageVisitSlots />}
                {currentPage === 'visitReport' && <VisitReport />}
                {currentPage === 'visitCountReport' && <VisitCountReport />}
                {currentPage === 'visitMapView' && <VisitMapView />}
                {currentPage === 'visitTravelTime' && <VisitTravelTime />}
                {currentPage === 'visitSetting' && <VisitSetting />}
                {currentPage === 'visitSummaryReport' && <VisitSummaryReport />}
                {currentPage === 'monthlyVisitReport' && <MonthlyVisitReport />}
                {currentPage === 'employeeVisitSetting' && <EmployeeVisitSetting />}
                {currentPage === 'missedRouteVisitReport' && <MissedRouteVisitReport />}
                {currentPage === 'manageAssignVisitTemplate' && <ManageAssignVisitTemplate />}
                {currentPage === 'manageAssignEquipmentTemplate' && <ManageAssignEquipmentTemplate />}
                {currentPage === 'visitTemplateReport' && <VisitTemplateReport />}
                {currentPage === 'averageMeetingMonthly' && <AverageMeetingMonthly />}
                {currentPage === 'hourlyVisitReport' && <HourlyVisitReport />}
                {currentPage === 'inventoryAdjustments' && <InventoryAdjustments />}
                {currentPage === 'packages' && <Packages />}
                {currentPage === 'shipments' && <Shipments />}
                {currentPage === 'salesOrders' && <SalesOrders />}
                {currentPage === 'invoices' && <Invoices />}
                {currentPage === 'deliveryChallans' && <DeliveryChallans />}
                {currentPage === 'paymentsReceived' && <PaymentsReceived />}
                {currentPage === 'salesReturns' && <SalesReturns />}
                {currentPage === 'creditNotes' && <CreditNotes />}
                {currentPage === 'vendors' && <Vendors />}
                {currentPage === 'expenses' && <Expenses />}
                {currentPage === 'purchaseOrders' && <PurchaseOrders />}
                {currentPage === 'purchaseReceives' && <PurchaseReceives />}
                {currentPage === 'bills' && <Bills />}
                {currentPage === 'paymentsMade' && <PaymentsMade />}
                {currentPage === 'vendorCredits' && <VendorCredits />}
                {currentPage === 'eWayBills' && <EWayBills />}
                {currentPage === 'profile' && viewingEmployee && (
                        <Profile 
                            viewingEmployee={viewingEmployee} 
                            currentEmployee={currentEmployee}
                            allEmployees={employees}
                            allTasks={tasks}
                            allActivity={employeeActivity}
                            onUpdateTask={handleUpdateTask}
                            onAddProfileChangeRequest={handleAddProfileChangeRequest}
                        />
                )}
            </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
