import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
// FIX: Changed to a named import for Farmers component and fixed path for Employees
import { Farmers } from './pages/Farmers';
import Employees from './pages/Users';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import DistrictMaster from './pages/DistrictMaster';
import MandalMaster from './pages/MandalMaster';
import VillageMaster from './pages/VillageMaster';
import LandParcelMaster from './pages/LandParcelMaster';
import LocationMaster from './pages/LocationMaster';
import ProcurementBatchMaster from './pages/ProcurementBatchMaster';
import ProcurementCenterMaster from './pages/ProcurementCenterMaster';
import FactoryMaster from './pages/FactoryMaster';
import SubsidyApplications from './pages/SubsidyApplications';
import DocumentVerification from './pages/DocumentVerification';
import InspectionLog from './pages/InspectionLog';
import FinancialSanctions from './pages/FinancialSanctions';
import PlantationLog from './pages/PlantationLog';
import HarvestLog from './pages/HarvestLog';
import MicroIrrigationTracker from './pages/MicroIrrigationTracker';
import FieldAgentTasks from './pages/FieldAgentTasks';
import NurseryInventory from './pages/NurseryInventory';
import ProcurementCenterInventory from './pages/ProcurementCenterInventory';
import FactoryInventory from './pages/FactoryInventory';
import StockReconciliation from './pages/StockReconciliation';
import OilExtraction from './pages/OilExtraction';
import Sustainability from './pages/Sustainability';
import Billing from './pages/Billing';
import PaymentReconciliation from './pages/PaymentReconciliation';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SlaPerformanceManager from './pages/SlaPerformanceManager';
import NonSubsidyPaymentLog from './pages/NonSubsidyPaymentLog';
import FarmerAssistanceLedger from './pages/FarmerAssistanceLedger';
import EnvironmentalMonitoring from './pages/EnvironmentalMonitoring';
import KnowledgeBase from './pages/KnowledgeBase';
import VendorManagement from './pages/VendorManagement';
import BankingIntegration from './pages/BankingIntegration';
import IotSensorData from './pages/IotSensorData';
import FarmerPortal from './pages/FarmerPortal';
import CropInsurance from './pages/CropInsurance';
import DocumentManager from './pages/DocumentManager';
import AddFarmer from './pages/AddFarmer';
import AddEmployee from './pages/AddEmployee';
import ManageVisits from './pages/ManageVisits';
import ManageVisitSlots from './pages/ManageVisitSlots';
import VisitReport from './pages/VisitReport';
import VisitCountReport from './pages/VisitCountReport';
import VisitMapView from './pages/VisitMapView';
import VisitTravelTime from './pages/VisitTravelTime';
import VisitSetting from './pages/VisitSetting';
import VisitSummaryReport from './pages/VisitSummaryReport';
import MonthlyVisitReport from './pages/MonthlyVisitReport';
import EmployeeVisitSetting from './pages/EmployeeVisitSetting';
import MissedRouteVisitReport from './pages/MissedRouteVisitReport';
import ManageAssignVisitTemplate from './pages/ManageAssignVisitTemplate';
import ManageAssignEquipmentTemplate from './pages/ManageAssignEquipmentTemplate';
import VisitTemplateReport from './pages/VisitTemplateReport';
import AverageMeetingMonthly from './pages/AverageMeetingMonthly';
import HourlyVisitReport from './pages/HourlyVisitReport';
import EmployeeHierarchy from './pages/EmployeeHierarchy';
import EmployeeLifecycle from './pages/EmployeeLifecycle';
import UpcomingRetirements from './pages/UpcomingRetirements';
import ProfileChangeRequests from './pages/ProfileChangeRequests';


import type { Employee, Farmer, LandParcel, NurseryInventoryItem, PlantationLog as PlantationLogType, FarmVisitRequest, EmployeeActivity, Task, ProfileChangeRequest, FarmerProfileChangeRequest } from './types';
import { mockEmployees, mockTasks, mockFarmersData, mockLandParcels, mockNurseryInventory, mockSubsidyApplications, mockProcurementBatches, mockPlantationLogs, mockFarmVisitRequests, mockEmployeeActivity, mockProfileChangeRequests, mockPayments, mockDocuments, mockCropInsurancePolicies, mockFarmerProfileChangeRequests } from './data/mockData';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [farmers, setFarmers] = useState<Farmer[]>(mockFarmersData);
  const [landParcels, setLandParcels] = useState<LandParcel[]>(mockLandParcels);
  const [nurseryInventory, setNurseryInventory] = useState<NurseryInventoryItem[]>(mockNurseryInventory);
  const [plantationLogs, setPlantationLogs] = useState<PlantationLogType[]>(mockPlantationLogs);
  const [farmVisitRequests, setFarmVisitRequests] = useState<FarmVisitRequest[]>(mockFarmVisitRequests);
  const [employeeActivity, setEmployeeActivity] = useState<EmployeeActivity[]>(mockEmployeeActivity);
  const [profileChangeRequests, setProfileChangeRequests] = useState<ProfileChangeRequest[]>(mockProfileChangeRequests);
  const [farmerProfileChangeRequests, setFarmerProfileChangeRequests] = useState<FarmerProfileChangeRequest[]>(mockFarmerProfileChangeRequests);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employees[1]); // Default to a non-admin
  const [viewingEmployeeId, setViewingEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitFilterAgentId, setVisitFilterAgentId] = useState<string | null>(null);

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

  const handleSetCurrentPage = useCallback((page: string) => {
    if (page !== 'manageVisits') {
        setVisitFilterAgentId(null);
    }
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
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
      vendorManagement: 'Partner & Vendor Management',
      subsidyApplications: 'Subsidy Applications',
      documentVerification: 'Document Verification',
      inspections: 'Inspection Log',
      procurementBatches: 'Procurement Batch Management',
      financialSanctions: 'Financial Sanctions',
      plantationLog: 'Plantation Log',
      harvestLog: 'Harvest Log',
      microIrrigationTracker: 'Micro-Irrigation Tracker',
      nurseryInventory: 'Nursery Inventory',
      procurementCenterInventory: 'Procurement Center Inventory',
      factoryInventory: 'Factory Inventory',
      stockReconciliation: 'Stock Reconciliation',
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
  }

  const handleViewProfile = (employeeId: string) => {
    setViewingEmployeeId(employeeId);
    handleSetCurrentPage('profile');
  };
  
  const handleViewEmployeeVisits = (employeeId: string) => {
    setVisitFilterAgentId(employeeId);
    handleSetCurrentPage('manageVisits');
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const updatedEmployees = employees.map(u => u.id === updatedEmployee.id ? updatedEmployee : u);
    setEmployees(updatedEmployees);
    if (currentEmployee.id === updatedEmployee.id) {
        setCurrentEmployee(updatedEmployee);
    }
    handleSetCurrentPage('employees');
  };

  const handleProfileChangeRequestUpdate = (updatedRequest: ProfileChangeRequest, changes: Partial<Employee>) => {
    setProfileChangeRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
    if(updatedRequest.status === 'Approved') {
        setEmployees(prev => prev.map(emp => emp.id === updatedRequest.employeeId ? { ...emp, ...changes } : emp));
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAddNewFarmer = (newFarmer: Farmer, newLandParcel: LandParcel) => {
    setFarmers(prev => [newFarmer, ...prev]);
    setLandParcels(prev => [newLandParcel, ...prev]);
    handleSetCurrentPage('farmers');
  };

  const handleAddNewEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    handleSetCurrentPage('employees');
  };

  const handleAddPlantationLog = (newLog: PlantationLogType) => {
    setPlantationLogs(prev => [newLog, ...prev]);
  };

  const handleAddFarmVisitRequest = (newRequest: FarmVisitRequest) => {
    setFarmVisitRequests(prev => [newRequest, ...prev]);
  };
  
  const handleAddFarmerProfileChangeRequest = (newRequest: FarmerProfileChangeRequest) => {
      setFarmerProfileChangeRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateFarmVisitRequest = (updatedRequest: FarmVisitRequest) => {
      setFarmVisitRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard loading={loading} />;
      case 'farmers':
        return <Farmers loading={loading} onAddNewFarmer={() => handleSetCurrentPage('addFarmer')} allFarmers={farmers} setAllFarmers={setFarmers} />;
      case 'addFarmer':
        return <AddFarmer onAddFarmer={handleAddNewFarmer} onCancel={() => handleSetCurrentPage('farmers')} allFarmers={farmers} />;
      case 'employees':
          return <Employees
                    currentEmployee={currentEmployee} 
                    allEmployees={employees} 
                    setAllEmployees={setEmployees} 
                    onViewProfile={handleViewProfile} 
                    allVisitRequests={farmVisitRequests}
                    onViewVisits={handleViewEmployeeVisits}
                    onAddNewEmployee={() => handleSetCurrentPage('addEmployee')}
                 />;
      case 'addEmployee':
          return <AddEmployee onAddEmployee={handleAddNewEmployee} onCancel={() => handleSetCurrentPage('employees')} allEmployees={employees} />;
      case 'employeeHierarchy':
          return <EmployeeHierarchy allEmployees={employees} onViewProfile={handleViewProfile} />;
      case 'employeeLifecycle':
          return <EmployeeLifecycle onViewProfile={handleViewProfile} />;
      case 'upcomingRetirements':
          return <UpcomingRetirements allEmployees={employees} />;
      case 'profileChangeRequests':
          return <ProfileChangeRequests requests={profileChangeRequests} employees={employees} onUpdateRequest={handleProfileChangeRequestUpdate} />;
      case 'generalTasks':
          return <Tasks />;
      case 'fieldAgentTasks':
          return <FieldAgentTasks />;
      case 'nurseryInventory':
          return <NurseryInventory allItems={nurseryInventory} setAllItems={setNurseryInventory} />;
      case 'procurementCenterInventory':
          return <ProcurementCenterInventory />;
      case 'factoryInventory':
          return <FactoryInventory />;
       case 'districtMaster':
          return <DistrictMaster />;
       case 'mandalMaster':
          return <MandalMaster />;
       case 'villageMaster':
          return <VillageMaster />;
        case 'landParcelMaster':
            return <LandParcelMaster />;
        case 'locationMaster':
            return <LocationMaster />;
        case 'procurementCenterMaster':
            return <ProcurementCenterMaster />;
        case 'factoryMaster':
            return <FactoryMaster />;
        case 'vendorManagement':
            return <VendorManagement />;
        case 'procurementBatches':
            return <ProcurementBatchMaster />;
        case 'subsidyApplications':
            return <SubsidyApplications />;
        case 'documentVerification':
            return <DocumentVerification />;
        case 'inspections':
            return <InspectionLog />;
        case 'financialSanctions':
            return <FinancialSanctions />;
        case 'plantationLog':
            return <PlantationLog />;
        case 'harvestLog':
            return <HarvestLog />;
        case 'microIrrigationTracker':
            return <MicroIrrigationTracker />;
        case 'stockReconciliation':
            return <StockReconciliation />;
        case 'oilExtraction':
            return <OilExtraction />;
        case 'sustainability':
            return <Sustainability />;
        case 'billing':
            return <Billing />;
        case 'paymentReconciliation':
            return <PaymentReconciliation />;
      case 'analyticsDashboard':
        return <AnalyticsDashboard />;
      case 'slaPerformanceManager':
        return <SlaPerformanceManager />;
      case 'nonSubsidyPaymentLog':
        return <NonSubsidyPaymentLog />;
      case 'farmerAssistanceLedger':
        return <FarmerAssistanceLedger />;
      case 'environmentalMonitoring':
        return <EnvironmentalMonitoring />;
      case 'knowledgeBase':
        return <KnowledgeBase />;
      case 'bankingIntegration':
        return <BankingIntegration />;
      case 'iotSensorData':
        return <IotSensorData />;
      case 'farmerPortal':
        return <FarmerPortal 
          allFarmers={farmers}
          allLandParcels={landParcels}
          allSubsidyApps={mockSubsidyApplications} 
          allProcurementBatches={mockProcurementBatches}
          allPayments={mockPayments}
          allDocuments={mockDocuments}
          allCropInsurancePolicies={mockCropInsurancePolicies}
          plantationLogs={plantationLogs}
          farmVisitRequests={farmVisitRequests}
          onAddLog={handleAddPlantationLog}
          onAddVisitRequest={handleAddFarmVisitRequest}
          onAddProfileChangeRequest={handleAddFarmerProfileChangeRequest}
          setCurrentPage={handleSetCurrentPage}
        />;
      case 'cropInsurance':
        return <CropInsurance />;
      case 'documentManager':
        return <DocumentManager />;
       case 'manageVisits':
            return <ManageVisits 
                allVisitRequests={farmVisitRequests}
                onAddRequest={handleAddFarmVisitRequest}
                onUpdateRequest={handleUpdateFarmVisitRequest}
                filterAgentId={visitFilterAgentId}
            />;
        case 'addVisit': return <ManageVisits allVisitRequests={farmVisitRequests} onAddRequest={handleAddFarmVisitRequest} onUpdateRequest={handleUpdateFarmVisitRequest} />;
        case 'manageVisitSlots': return <ManageVisitSlots />;
        case 'visitReport': return <VisitReport />;
        case 'visitCountReport': return <VisitCountReport />;
        case 'visitMapView': return <VisitMapView />;
        case 'visitTravelTime': return <VisitTravelTime />;
        case 'visitSetting': return <VisitSetting />;
        case 'visitSummaryReport': return <VisitSummaryReport />;
        case 'monthlyVisitReport': return <MonthlyVisitReport />;
        case 'employeeVisitSetting': return <EmployeeVisitSetting />;
        case 'missedRouteVisitReport': return <MissedRouteVisitReport />;
        case 'manageAssignVisitTemplate': return <ManageAssignVisitTemplate />;
        case 'manageAssignEquipmentTemplate': return <ManageAssignEquipmentTemplate />;
        case 'visitTemplateReport': return <VisitTemplateReport />;
        case 'averageMeetingMonthly': return <AverageMeetingMonthly />;
        case 'hourlyVisitReport': return <HourlyVisitReport />;
      case 'profile': {
          const viewingEmployee = employees.find(u => u.id === viewingEmployeeId);
          if (!viewingEmployee) {
            return null;
          }
          return <Profile 
              viewingEmployee={viewingEmployee} 
              currentEmployee={currentEmployee}
              allEmployees={employees}
              allTasks={tasks}
              allActivity={employeeActivity}
              onUpdateEmployee={handleUpdateEmployee}
              onUpdateTask={handleUpdateTask}
           />;
      }
      default:
        return <Dashboard loading={loading}/>;
    }
  };

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
       />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            title={pageTitles[currentPage] || 'Dashboard'} 
            currentEmployee={currentEmployee}
            allEmployees={employees}
            allTasks={tasks}
            setCurrentEmployee={setCurrentEmployee}
            onViewProfile={() => handleViewProfile(currentEmployee.id)}
            onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800/50 p-4 sm:p-6 lg:p-8">
            {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;