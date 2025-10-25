import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Users from './pages/Users';
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
import CultivationLog from './pages/CultivationLog';
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


import type { User } from './types';
import { mockUsers, mockTasks } from './data/mockData';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(users[1]); // Default to a non-admin
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const pageTitles: { [key: string]: string } = {
      dashboard: 'Executive Dashboard',
      farmers: 'Farmer Management',
      users: 'User Management',
      generalTasks: 'General Task Management',
      fieldAgentTasks: 'Field Agent Task Board',
      profile: 'User Profile',
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
      cultivationLog: 'Cultivation Log',
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
  }

  const handleViewProfile = (userId: string) => {
    setViewingUserId(userId);
    setCurrentPage('profile');
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    // If the current user updated their own profile, update the currentUser state as well
    if (currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    // Go back to the user list after saving
    setCurrentPage('users');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'farmers':
        return <Farmers />;
      case 'users':
          return <Users currentUser={currentUser} allUsers={users} onViewProfile={handleViewProfile} />;
      case 'generalTasks':
          return <Tasks />;
      case 'fieldAgentTasks':
          return <FieldAgentTasks />;
      case 'nurseryInventory':
          return <NurseryInventory />;
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
        case 'cultivationLog':
            return <CultivationLog />;
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
        return <FarmerPortal />;
      case 'cropInsurance':
        return <CropInsurance />;
      case 'documentManager':
        return <DocumentManager />;
      case 'profile': {
          const viewingUser = users.find(u => u.id === viewingUserId);
          if (viewingUser) {
            return <Profile 
                viewingUser={viewingUser} 
                currentUser={currentUser}
                allTasks={mockTasks}
                onUpdateUser={handleUpdateUser}
             />;
          }
          // Fallback if user not found
          setCurrentPage('users');
          return <Users currentUser={currentUser} allUsers={users} onViewProfile={handleViewProfile} />;
      }
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            title={pageTitles[currentPage] || 'Dashboard'} 
            currentUser={currentUser}
            allUsers={users}
            setCurrentUser={setCurrentUser}
            onViewProfile={() => handleViewProfile(currentUser.id)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800/50 p-4 sm:p-6 lg:p-8">
            {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
