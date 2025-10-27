
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

export type UserRole = 'Admin' | 'Field Agent' | 'Reviewer' | 'Accountant' | 'Mandal Coordinator' | 'Procurement Center Manager' | 'Factory Manager';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
  mobile: string;
  region: string;
  status: 'Active' | 'Inactive';
  reportingManagerId?: string; // Changed from reportingManager
  profilePhotoUrl?: string;
  createdAt: string; // Added
  updatedAt: string; // Added
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
  assignedToId: string; // Changed from assignedTo: User
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
  submittedById: string; // User ID
  reviewedById?: string; // User ID
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlantationActivityType = 'Planting' | 'Fertilizing' | 'Pest Control' | 'Weeding' | 'Pruning' | 'Harvesting' | 'Soil Testing';

export interface PlantationLog {
  id: string;
  farmerId: string;
  landParcelId: string;
  activityType: PlantationActivityType;
  activityDate: string;
  materialsUsed?: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  laborCount?: number;
  performedById: string; // User ID
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
  harvestedById: string; // User ID
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
  inspectedById?: string; // User ID
  inspectionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
