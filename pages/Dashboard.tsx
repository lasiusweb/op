
import React from 'react';
import ProcurementDashboard from '../components/ProcurementDashboard';
import QualityYieldDashboard from '../components/QualityYieldDashboard';
import FinancialDashboard from '../components/FinancialDashboard';
import ComplianceSlaDashboard from '../components/ComplianceSlaDashboard';
import PredictiveInsightsDashboard from '../components/PredictiveInsightsDashboard';
import StrategicAdvisor from '../components/StrategicAdvisor';

// Centralized Data for Dashboard Components
const procurementDistrictData = [
  { district: 'Hanmakonda', volume: 6800 },
  { district: 'Mulugu', volume: 5100 },
];
const procurementFarmerData = [
  { rank: 1, name: 'R. Venkatesh', yield: 142.5, location: 'Hanmakonda' },
  { rank: 2, name: 'S. Kumar', yield: 139.8, location: 'Hanmakonda' },
  { rank: 3, name: 'M. Laxmi', yield: 135.1, location: 'Mulugu' },
  { rank: 4, name: 'K. Srinivas', yield: 128.4, location: 'Mulugu' },
  { rank: 5, name: 'G. Prasad', yield: 122.9, location: 'Hanmakonda' },
];
const procurementTargetData = [
  { name: 'Monthly Target', value: 78, fill: '#06b6d4' },
];

const qualityEfficiencyData = [
  { name: 'Jan', efficiency: 88.2 }, { name: 'Feb', efficiency: 89.1 },
  { name: 'Mar', efficiency: 89.5 }, { name: 'Apr', efficiency: 90.3 },
  { name: 'May', efficiency: 91.2 }, { name: 'Jun', efficiency: 90.8 },
];
const qualityDefectData = [
  { name: 'Pest Damage', value: 25 }, { name: 'Low Oil Content', value: 45 },
  { name: 'Bruising', value: 15 }, { name: 'Other', value: 15 },
];

const financialPaymentData = [
  { month: 'Jan', pending: 400, released: 2400 }, { month: 'Feb', pending: 300, released: 2900 },
  { month: 'Mar', pending: 500, released: 3100 }, { month: 'Apr', pending: 280, released: 2500 },
  { month: 'May', pending: 450, released: 3500 }, { month: 'Jun', pending: 150, released: 1800 },
];
const financialAgingData = [
    { invoice: 'INV-1023', farmer: 'S. Kumar', days: 45, amount: '₹ 85,000' },
    { invoice: 'INV-1019', farmer: 'G. Prasad', days: 32, amount: '₹ 1,12,000' },
    { invoice: 'INV-1012', farmer: 'M. Laxmi', days: 25, amount: '₹ 98,500' },
    { invoice: 'INV-1031', farmer: 'K. Srinivas', days: 12, amount: '₹ 45,200' },
];

const complianceData = [
  { name: 'Field Agent', compliance: 95 }, { name: 'Verification Officer', compliance: 88 },
  { name: 'Lab Technician', compliance: 98 }, { name: 'Finance Officer', compliance: 92 },
];
const complianceAuditLogData = [
    { action: 'Subsidy Approved', user: 'HO Sanction', timestamp: '2024-07-21 10:05 AM', module: 'Sanctions' },
    { action: 'Inspection Logged', user: 'Field Agent', timestamp: '2024-07-21 09:30 AM', module: 'Inspections' },
    { action: 'Payment Released', user: 'Finance Officer', timestamp: '2024-07-20 04:15 PM', module: 'Payments' },
    { action: 'Document Rejected', user: 'Verifier', timestamp: '2024-07-20 11:00 AM', module: 'Applications' },
];

const predictiveSupplyDemandData = [
  { month: 'Jul', supply: 4200, demand: 4000 }, { month: 'Aug', supply: 4500, demand: 4600 },
  { month: 'Sep', supply: 5100, demand: 4800 }, { month: 'Oct', supply: 5300, demand: 5500 },
  { month: 'Nov', supply: 5800, demand: 5600 }, { month: 'Dec', supply: 6200, demand: 6000 },
];
const predictiveAnomalyData = [
    { id: 1, type: 'Quality', description: 'Batch #B789 shows 15% lower oil content than average.', severity: 'High' },
    { id: 2, type: 'Payment', description: 'Payment for Khammam center delayed by 3 days.', severity: 'Medium' },
    { id: 3, type: 'Quantity', description: 'Nalgonda district yield is 20% below forecast.', severity: 'High' },
];

const allDashboardData = {
    procurement: { districtData: procurementDistrictData, farmerData: procurementFarmerData },
    quality: { efficiencyData: qualityEfficiencyData, defectData: qualityDefectData },
    financial: { paymentData: financialPaymentData, agingData: financialAgingData },
    compliance: { complianceData: complianceData, auditLogData: complianceAuditLogData, overdueTasks: 14 },
    predictive: { supplyDemandData: predictiveSupplyDemandData, anomalyData: predictiveAnomalyData },
};

const Dashboard: React.FC = () => {
  return (
    <div>
        <p className="text-gray-400 mb-6 -mt-4">
          Real-time insights for the Telangana Oil Palm Mission ecosystem.
        </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        <ProcurementDashboard 
          districtData={procurementDistrictData}
          farmerData={procurementFarmerData}
          targetData={procurementTargetData}
        />
        <QualityYieldDashboard 
          efficiencyData={qualityEfficiencyData}
          defectData={qualityDefectData}
        />
        <FinancialDashboard 
          paymentData={financialPaymentData}
          agingData={financialAgingData}
        />
        <ComplianceSlaDashboard
          complianceData={complianceData}
          auditLogData={complianceAuditLogData}
        />
        <PredictiveInsightsDashboard 
          supplyDemandData={predictiveSupplyDemandData}
          anomalyData={predictiveAnomalyData}
        />
        <StrategicAdvisor dashboardData={allDashboardData} />
      </div>
       <footer className="text-center mt-8 py-4 text-gray-500 text-sm">
        <p>Built for the Modern Agricultural Ecosystem</p>
      </footer>
    </div>
  );
};

export default Dashboard;