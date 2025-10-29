

export interface DistrictVolume {
  district: string;
  volume: number;
}

export interface FarmerYield {
  rank: number;
  name: string;
  yield: number;
  location: string;
}

export interface PaymentStatus {
  month: string;
  pending: number;
  released: number;
}

// New types based on schema

export type EmployeeRole = 'Admin' | 'Field Agent' | 'Reviewer' | 'Accountant' | 'Mandal Coordinator' | 'Procurement Center Manager' | 'Factory Manager' | 'HR Manager' | 'IT Support';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  aliasName?: string;
  role: EmployeeRole;
  department?: string;
  subDepartment?: string;
  grade?: string;
  shift?: string;
  email: string;
  countryCode?: string;
  mobile: string;
  region: string; // Branch
  jobLocation?: string;
  status: 'Active' | 'Inactive';
  reportingManagerId?: string;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  joiningDate: string;
  dob: string; 
  probationPeriodDays?: number;
  trainingCompletionDate?: string;
  dateOfPermanentEmployee?: string;
  gender: 'Male' | 'Female' | 'Other';
  employmentType?: 'Permanent' | 'Contract' | 'Internship';
  insuranceNumber?: string;
  insuranceCompany?: string;
  insuranceExpiryDate?: string;
  retirementAge?: number;
  idProof?: string; 
  resignationDate?: string;
  lastWorkingDate?: string;
}


export type LifecycleTaskStatus = 'Pending' | 'Completed' | 'Not Applicable';

export interface LifecycleTask {
    id: string;
    description: string;
    status: LifecycleTaskStatus;
    responsible: 'HR' | 'IT' | 'Manager';
}

export interface EmployeeLifecycle {
    employeeId: string;
    processType: 'Onboarding' | 'Offboarding';
    status: 'In Progress' | 'Completed';
    startDate: string;
    completionDate?: string;
    tasks: LifecycleTask[];
}


export interface ProfileChangeRequest {
    id: string;
    employeeId: string;
    requestedById: string; // Could be the employee themselves or HR
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedChanges: Partial<Pick<Employee, 'fullName' | 'mobile' | 'email' | 'region'>>;
    reviewNotes?: string;
    reviewedById?: string;
    reviewedAt?: string;
}

export interface Farmer {
  id: string;
  fullName:string;
  fatherName: string;
  mobile: string;
  aadhaar: string;
  village: string;
  mandal: string;
  district: string;
  status: 'Active' | 'Inactive';
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  cropType: string;
  accountVerified: boolean;
  photoUploaded: boolean;
  remarks: string | null;
  photoUrl?: string;
  assignedAgentId: string; // Added
  createdAt: string; // Added
  updatedAt: string; // Added
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToId: string; // Refers to Employee.id
  relatedFarmerId?: string; // Added
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  latitude?: number;
  longitude?: number;
  createdAt: string; // Added
  updatedAt: string; // Added
  completedAt?: string; // Added
}

// NEW TYPES from schema

export interface LandParcel {
    id: string;
    farmerId: string;
    surveyNumber: string;
    areaAcres: number;
    soilType: string;
    irrigationSource: 'Borewell' | 'Canal' | 'Rainfed';
    latitude: number;
    longitude: number;
    status: 'Active' | 'Sold' | 'Fallow';
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    id: string;
    name: string;
    type: 'Procurement Center' | 'Factory' | 'Warehouse';
    mandal: string;
    district: string;
    latitude: number;
    longitude: number;
    managerId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProcurementBatch {
    id: string;
    farmerId: string;
    procurementCenterId: string;
    weightKg: number;
    qualityGrade: 'A' | 'B' | 'C';
    oilContentPercentage: number;
    procurementDate: string;
    pricePerKg: number;
    totalAmount: number;
    paymentStatus: 'Paid' | 'Pending' | 'Partial';
    status: 'Active' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    procurementBatchId: string;
    farmerId: string;
    amount: number;
    paymentDate: string;
    transactionId: string;
    paymentMethod: 'Bank Transfer' | 'Cheque';
    status: 'Success' | 'Failed' | 'Processing';
    createdAt: string;
    updatedAt: string;
}

export interface QualityInspection {
    id: string;
    procurementBatchId: string;
    inspectorId: string;
    inspectionDate: string;
    ffaLevel: number; // Free Fatty Acid
    moistureContent: number;
    bruisingPercentage: number;
    notes?: string;
    status: 'Passed' | 'Failed';
    createdAt: string;
    updatedAt: string;
}

// Master Data Types
export interface District {
  id: string;
  name: string;
  code: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Mandal {
  id: string;
  name: string;
  districtId: string;
  code: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  name: string;
  mandalId: string;
  code: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  mandalId: string;
  managerId?: string;
  contactPerson: string;
  contactMobile: string;
  status: 'Active' | 'Inactive';
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Factory {
  id: string;
  name: string;
  mandalId: string;
  managerId?: string;
  capacityTonsPerDay: number;
  contactMobile: string;
  status: 'Active' | 'Inactive';
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Office {
  id: string;
  name: string;
  type: 'Head Office' | 'Regional Office' | 'Zonal Office';
  address: string;
  mandalId: string;
  contactPerson: string;
  contactMobile: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

// Operations Types
export type SubsidyApplicationStatus = 'Submitted' | 'Documents Pending' | 'Under Review' | 'Approved' | 'Rejected';
export interface SubsidyApplication {
    id: string;
    farmerId: string;
    applicationDate: string;
    subsidyType: 'Drip Irrigation' | 'New Seedlings' | 'Fertilizer';
    status: SubsidyApplicationStatus;
    requestedAmount: number;
    approvedAmount?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';
export interface Document {
    id: string;
    subsidyApplicationId: string;
    documentType: 'Aadhaar Card' | 'Land Record (Pattadar)' | 'Bank Statement';
    fileUrl?: string; // In a real app, this would point to the stored file
    status: DocumentStatus;
    verifiedById?: string;
    verifiedAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type InspectionStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type InspectionOutcome = 'Passed' | 'Failed' | 'Needs Follow-up';
export interface Inspection {
    id: string;
    relatedEntityType: 'SubsidyApplication' | 'LandParcel';
    relatedEntityId: string;
    inspectorId: string;
    inspectionDate: string;
    status: InspectionStatus;
    outcome?: InspectionOutcome;
    reportUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type HOSanctionStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Query Raised';
export type HOSanctionType = 'High Value Subsidy' | 'Bulk Procurement Payment' | 'Operational Expense';
export interface HOSanction {
  id: string;
  sanctionType: HOSanctionType;
  relatedEntityId: string; // e.g., SUB001 or PB003
  amount: number;
  status: HOSanctionStatus;
  submittedById: string; // Employee ID
  reviewedById?: string; // Employee ID
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CultivationActivityType = 'Planting' | 'Fertilizing' | 'Pest Control' | 'Weeding' | 'Pruning' | 'Harvesting' | 'Soil Testing';

export interface CultivationLog {
  id: string;
  farmerId: string;
  landParcelId: string;
  activityType: CultivationActivityType;
  activityDate: string;
  materialsUsed?: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  laborCount?: number;
  performedById: string; // Employee ID
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type HarvestQualityGrade = 'A' | 'B' | 'C' | 'Ungraded';
export interface HarvestLog {
  id: string;
  farmerId: string;
  landParcelId: string;
  harvestDate: string;
  quantityTonnes: number;
  qualityGrade: HarvestQualityGrade;
  harvestedById: string; // Employee ID
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IrrigationInstallationType = 'Drip' | 'Sprinkler';
export type IrrigationInstallationStatus = 'Pending Installation' | 'Installation in Progress' | 'Completed' | 'Pending Inspection' | 'Verified';

export interface MicroIrrigationInstallation {
  id: string;
  farmerId: string;
  landParcelId: string;
  subsidyApplicationId: string;
  installationType: IrrigationInstallationType;
  vendorName: string;
  installationDate?: string;
  totalCost: number;
  subsidyAmount: number;
  status: IrrigationInstallationStatus;
  inspectedById?: string; // Employee ID
  inspectionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Farmer Portal Types
export type FarmVisitRequestStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
export type FarmVisitUrgency = 'Normal' | 'Urgent';

export interface FarmVisitRequest {
    id: string;
    farmerId: string;
    landParcelId: string;
    requestType: string;
    urgency: FarmVisitUrgency;
    description: string;
    requestDate: string;
    status: FarmVisitRequestStatus;
    assignedAgentId?: string;
    visitDate?: string;
    agentNotes?: string;
    createdAt: string;
    updatedAt: string;
}

// NEW - Farmer Profile Update Request
export interface FarmerProfileChangeRequest {
    id: string;
    farmerId: string;
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedChanges: Partial<Pick<Farmer, 'mobile' | 'bankName' | 'bankAccountNumber' | 'ifscCode'>>;
    reviewNotes?: string;
}

// NEW - Crop Insurance Policy
export interface CropInsurancePolicy {
    id: string;
    farmerId: string;
    policyNumber: string;
    insurer: string;
    coverageType: 'Yield-Based' | 'Weather-Based';
    sumInsured: number;
    premium: number;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Claimed';
}


// Inventory Types
export type NurseryItemType = 'Seedling' | 'Fertilizer' | 'Pesticide' | 'Tool';
export interface NurseryInventoryItem {
    id: string;
    name: string;
    type: NurseryItemType;
    quantity: number;
    unit: string;
    supplier: string;
    purchaseDate: string;
    costPerUnit: number;
    createdAt: string;
    updatedAt: string;
}

export type FactoryItemType = 'Raw FFB' | 'Crude Palm Oil' | 'Palm Kernel' | 'Consumable';
export interface FactoryInventoryItem {
    id: string;
    factoryId: string;
    name: string;
    type: FactoryItemType;
    quantity: number;
    unit: 'Tonnes' | 'Litres' | 'Units';
    qualityGrade?: 'A' | 'B' | 'C';
    storageLocation: string;
    receivedDate: string;
    createdAt: string;
    updatedAt: string;
}

export type PCInventoryStatus = 'Awaiting Transport' | 'In Transit' | 'Received at Factory';
export interface ProcurementCenterInventory {
    id: string;
    procurementCenterId: string;
    quantityTonnes: number;
    averageQualityGrade: 'A' | 'B' | 'C';
    lastUpdated: string;
    status: PCInventoryStatus;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeActivity {
  id: string;
  employeeId: string;
  action: string;
  timestamp: string;
  details?: string;
  icon: 'task' | 'employee' | 'subsidy' | 'payment';
}