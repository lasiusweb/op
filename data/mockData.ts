import type { Farmer, Task, User, LandParcel, Location, ProcurementBatch, Payment, QualityInspection, District, Mandal, Village, ProcurementCenter, Factory, SubsidyApplication, Document, Inspection, Office, HOSanction, PlantationLog, HarvestLog, MicroIrrigationInstallation, NurseryInventoryItem, FactoryInventoryItem, ProcurementCenterInventory, FarmVisitRequest, UserActivity } from '../types';

const now = new Date();
const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const mockUsers: User[] = [
    { id: 'USR001', fullName: 'Anil Kumar', role: 'Field Agent', email: 'anil.k@example.com', mobile: '9123456780', region: 'Warangal', status: 'Active', reportingManagerId: 'USR002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR001', createdAt: pastDate(30), updatedAt: pastDate(2) },
    { id: 'USR002', fullName: 'Sunita Sharma', role: 'Mandal Coordinator', email: 'sunita.s@example.com', mobile: '9123456781', region: 'Warangal', status: 'Active', reportingManagerId: 'USR005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR002', createdAt: pastDate(100), updatedAt: pastDate(10) },
    { id: 'USR003', fullName: 'Vijay Singh', role: 'Reviewer', email: 'vijay.s@example.com', mobile: '9123456782', region: 'Mulugu', status: 'Active', reportingManagerId: 'USR005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR003', createdAt: pastDate(80), updatedAt: pastDate(5) },
    { id: 'USR004', fullName: 'Priya Patel', role: 'Accountant', email: 'priya.p@example.com', mobile: '9123456783', region: 'Head Office', status: 'Inactive', reportingManagerId: 'USR005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR004', createdAt: pastDate(120), updatedAt: pastDate(20) },
    { id: 'USR005', fullName: 'Rajesh Gupta', role: 'Admin', email: 'rajesh.g@example.com', mobile: '9123456784', region: 'Head Office', status: 'Active', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR005', createdAt: pastDate(200), updatedAt: pastDate(1) },
    { id: 'USR006', fullName: 'Kavita Rao', role: 'Procurement Center Manager', email: 'kavita.r@example.com', mobile: '9123456785', region: 'Hanmakonda', status: 'Active', reportingManagerId: 'USR005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR006', createdAt: pastDate(90), updatedAt: pastDate(8) },
    { id: 'USR007', fullName: 'Manoj Reddy', role: 'Factory Manager', email: 'manoj.r@example.com', mobile: '9123456786', region: 'Mulugu', status: 'Active', reportingManagerId: 'USR005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=USR007', createdAt: pastDate(110), updatedAt: pastDate(12) },
];

export const mockFarmersData: Farmer[] = [
  { id: '0701001-24-0001', fullName: 'R. Venkatesh', fatherName: 'R. Rao', mobile: '9876543210', aadhaar: '**** **** 1234', village: 'Kothawada', mandal: 'Warangal', district: 'Warangal', status: 'Active', gender: 'Male', dob: '1975-05-20', bankName: 'State Bank of India', bankAccountNumber: '**** **** 2034', ifscCode: 'SBIN0001234', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Consistently high yield producer.', photoUrl: 'https://i.pravatar.cc/150?u=0701001-24-0001', assignedAgentId: 'USR001', createdAt: pastDate(50), updatedAt: pastDate(3) },
  { id: '3501008-24-0001', fullName: 'S. Kumar', fatherName: 'S. Reddy', mobile: '9876543211', aadhaar: '**** **** 5678', village: 'Eturnagaram', mandal: 'Eturnagaram', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1982-11-15', bankName: 'HDFC Bank', bankAccountNumber: '**** **** 8876', ifscCode: 'HDFC0005678', cropType: 'Oil Palm', accountVerified: true, photoUploaded: false, remarks: null, photoUrl: undefined, assignedAgentId: 'USR001', createdAt: pastDate(60), updatedAt: pastDate(4) },
  { id: '0702001-24-0001', fullName: 'M. Laxmi', fatherName: 'M. Gupta', mobile: '9876543212', aadhaar: '**** **** 9012', village: 'Gorrekunta', mandal: 'Geesugonda', district: 'Warangal', status: 'Inactive', gender: 'Female', dob: '1990-02-10', bankName: 'ICICI Bank', bankAccountNumber: '**** **** 4321', ifscCode: 'ICIC0009012', cropType: 'Oil Palm', accountVerified: false, photoUploaded: true, remarks: 'Account inactive due to land sale.', photoUrl: 'https://i.pravatar.cc/150?u=0702001-24-0001', assignedAgentId: 'USR001', createdAt: pastDate(70), updatedAt: pastDate(15) },
  { id: '1005001-24-0001', fullName: 'K. Srinivas', fatherName: 'K. Murthy', mobile: '9876543213', aadhaar: '**** **** 3456', village: 'Hasanparthy', mandal: 'Hasanparthy', district: 'Hanmakonda', status: 'Active', gender: 'Male', dob: '1968-07-30', bankName: 'Axis Bank', bankAccountNumber: '**** **** 6543', ifscCode: 'UTIB0003456', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Participated in the drip irrigation subsidy program.', photoUrl: undefined, assignedAgentId: 'USR001', createdAt: pastDate(45), updatedAt: pastDate(8) },
  { id: '3502001-24-0001', fullName: 'G. Prasad', fatherName: 'G. Naidu', mobile: '9876543214', aadhaar: '**** **** 7890', village: 'Govindaraopet', mandal: 'Govindaraopet', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1978-09-05', bankName: 'State Bank of India', bankAccountNumber: '**** **** 0987', ifscCode: 'SBIN0007890', cropType: 'Oil Palm', accountVerified: false, photoUploaded: false, remarks: 'Awaiting bank account verification.', photoUrl: 'https://i.pravatar.cc/150?u=3502001-24-0001', assignedAgentId: 'USR003', createdAt: pastDate(55), updatedAt: pastDate(1) },
];

export const mockTasks: Task[] = [
  { id: 'TSK001', title: 'Inspect Farmer R. Venkatesh\'s Plot', description: 'Conduct a routine inspection of plot #45B and report on crop health. Check for signs of pest infestation and verify irrigation system functionality. Document findings with photographic evidence.', assignedToId: 'USR001', relatedFarmerId: '0701001-24-0001', dueDate: '2024-08-15', status: 'In Progress', priority: 'High', latitude: 17.98, longitude: 79.59, createdAt: pastDate(10), updatedAt: pastDate(3), completedAt: undefined },
  { id: 'TSK002', title: 'Verify Subsidy Application #S4521', description: 'Check submitted documents for farmer S. Kumar and verify land records.', assignedToId: 'USR003', relatedFarmerId: '3501008-24-0001', dueDate: '2024-08-10', status: 'Completed', priority: 'Medium', latitude: 18.25, longitude: 80.29, createdAt: pastDate(12), updatedAt: pastDate(1), completedAt: pastDate(1) },
  { id: 'TSK003', title: 'Collect Soil Samples from Hanmakonda', description: 'Collect 5 soil samples from designated areas in Hasanparthy mandal. Samples should be taken from a depth of 15cm and properly labeled for lab analysis.', assignedToId: 'USR001', dueDate: '2024-08-20', status: 'Pending', priority: 'Medium', latitude: 18.00, longitude: 79.58, createdAt: pastDate(8), updatedAt: pastDate(8), completedAt: undefined },
  { id: 'TSK004', title: 'Review Q2 Financial Reports', description: 'Audit and approve the financial statements for the second quarter.', assignedToId: 'USR004', dueDate: '2024-08-12', status: 'Rejected', priority: 'Low', createdAt: pastDate(20), updatedAt: pastDate(5), completedAt: undefined },
  { id: 'TSK005', title: 'Onboard New Farmers in Mulugu', description: 'Complete the registration and onboarding process for 10 new farmers.', assignedToId: 'USR002', dueDate: '2024-08-18', status: 'Pending', priority: 'High', createdAt: pastDate(5), updatedAt: pastDate(5), completedAt: undefined },
];

export const mockUserActivity: UserActivity[] = [
  { id: 'ACT001', userId: 'USR001', action: 'Completed Task', details: 'TSK002 - Verify Subsidy Application #S4521', timestamp: pastDate(1), icon: 'task' },
  { id: 'ACT002', userId: 'USR001', action: 'Updated Farmer Profile', details: 'R. Venkatesh', timestamp: pastDate(3), icon: 'user' },
  { id: 'ACT003', userId: 'USR002', action: 'Onboarded New Farmers', details: '10 new farmers in Mulugu', timestamp: pastDate(5), icon: 'user' },
  { id: 'ACT004', userId: 'USR003', action: 'Verified Documents', details: 'SUB002 - Aadhaar Card', timestamp: pastDate(4), icon: 'subsidy' },
  { id: 'ACT005', userId: 'USR005', action: 'Approved Sanction', details: 'SAN001 - High Value Subsidy', timestamp: pastDate(9), icon: 'payment' },
  { id: 'ACT006', userId: 'USR001', action: 'Logged Plantation Activity', details: 'Fertilizing for R. Venkatesh', timestamp: pastDate(20), icon: 'task' },
];

export const mockLandParcels: LandParcel[] = [
    { id: 'LP001', farmerId: '0701001-24-0001', surveyNumber: 'SN-WGL-01', areaAcres: 5.2, soilType: 'Red Loam', irrigationSource: 'Borewell', latitude: 17.98, longitude: 79.59, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'LP002', farmerId: '0701001-24-0001', surveyNumber: 'SN-WGL-02', areaAcres: 3.0, soilType: 'Red Loam', irrigationSource: 'Canal', latitude: 17.99, longitude: 79.60, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'LP003', farmerId: '3501008-24-0001', surveyNumber: 'SN-MUL-01', areaAcres: 10.5, soilType: 'Black Cotton', irrigationSource: 'Borewell', latitude: 18.25, longitude: 80.29, status: 'Active', createdAt: pastDate(400), updatedAt: pastDate(50) },
    { id: 'LP004', farmerId: '1005001-24-0001', surveyNumber: 'SN-HNK-01', areaAcres: 8.0, soilType: 'Sandy Loam', irrigationSource: 'Rainfed', latitude: 18.00, longitude: 79.58, status: 'Active', createdAt: pastDate(250), updatedAt: pastDate(20) },
    { id: 'LP005', farmerId: '1005001-24-0001', surveyNumber: 'SN-HNK-02', areaAcres: 4.5, soilType: 'Sandy Loam', irrigationSource: 'Borewell', latitude: 18.01, longitude: 79.59, status: 'Active', createdAt: pastDate(250), updatedAt: pastDate(20) },
    { id: 'LP006', farmerId: '3502001-24-0001', surveyNumber: 'SN-MUL-02', areaAcres: 6.0, soilType: 'Red Sandy', irrigationSource: 'Canal', latitude: 18.26, longitude: 80.30, status: 'Fallow', createdAt: pastDate(300), updatedAt: pastDate(100) },
    { id: 'LP007', farmerId: '0702001-24-0001', surveyNumber: 'SN-WGL-03', areaAcres: 7.1, soilType: 'Alluvial', irrigationSource: 'Canal', latitude: 17.97, longitude: 79.58, status: 'Sold', createdAt: pastDate(500), updatedAt: pastDate(15) },
];

export const mockLocations: Location[] = [
    { id: 'LOC01', name: 'Warangal Central PC', type: 'Procurement Center', mandal: 'Warangal', district: 'Warangal', latitude: 17.98, longitude: 79.59, managerId: 'USR002', createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'LOC02', name: 'Mulugu Hub', type: 'Procurement Center', mandal: 'Mulugu', district: 'Mulugu', latitude: 18.25, longitude: 80.29, managerId: 'USR003', createdAt: pastDate(180), updatedAt: pastDate(15) },
    { id: 'LOC03', name: 'Eturnagaram Factory', type: 'Factory', mandal: 'Eturnagaram', district: 'Mulugu', latitude: 18.37, longitude: 80.43, managerId: 'USR007', createdAt: pastDate(300), updatedAt: pastDate(45) },
    { id: 'LOC04', name: 'Hasanparthy Warehouse', type: 'Warehouse', mandal: 'Hasanparthy', district: 'Hanmakonda', latitude: 18.06, longitude: 79.53, managerId: 'USR006', createdAt: pastDate(150), updatedAt: pastDate(10) },
    { id: 'LOC05', name: 'Govindaraopet Collection Point', type: 'Procurement Center', mandal: 'Govindaraopet', district: 'Mulugu', latitude: 18.24, longitude: 80.21, createdAt: pastDate(90), updatedAt: pastDate(5) },
];

export const mockProcurementBatches: ProcurementBatch[] = [
    { id: 'PB001', farmerId: '0701001-24-0001', procurementCenterId: 'LOC01', weightKg: 1250.5, qualityGrade: 'A', oilContentPercentage: 22.5, procurementDate: pastDate(10), pricePerKg: 12.5, totalAmount: 15631.25, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(10), updatedAt: pastDate(8) },
    { id: 'PB002', farmerId: '3501008-24-0001', procurementCenterId: 'LOC02', weightKg: 2100.0, qualityGrade: 'B', oilContentPercentage: 20.1, procurementDate: pastDate(8), pricePerKg: 11.0, totalAmount: 23100.00, paymentStatus: 'Pending', status: 'Active', createdAt: pastDate(8), updatedAt: pastDate(8) },
    { id: 'PB003', farmerId: '1005001-24-0001', procurementCenterId: 'LOC04', weightKg: 850.75, qualityGrade: 'A', oilContentPercentage: 23.1, procurementDate: pastDate(5), pricePerKg: 12.5, totalAmount: 10634.38, paymentStatus: 'Partial', status: 'Active', createdAt: pastDate(5), updatedAt: pastDate(2) },
    { id: 'PB004', farmerId: '3502001-24-0001', procurementCenterId: 'LOC05', weightKg: 1500.0, qualityGrade: 'C', oilContentPercentage: 18.5, procurementDate: pastDate(2), pricePerKg: 9.5, totalAmount: 14250.00, paymentStatus: 'Pending', status: 'Cancelled', createdAt: pastDate(2), updatedAt: pastDate(1) },
];

export const mockPayments: Payment[] = [
    { id: 'PAY001', procurementBatchId: 'PB001', farmerId: '0701001-24-0001', amount: 15631.25, paymentDate: pastDate(8), transactionId: 'TXN12345678', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(8), updatedAt: pastDate(8) },
    { id: 'PAY002', procurementBatchId: 'PB003', farmerId: '1005001-24-0001', amount: 5000.00, paymentDate: pastDate(2), transactionId: 'TXN98765432', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(2), updatedAt: pastDate(2) },
];

export const mockSubsidyApplications: SubsidyApplication[] = [
    { id: 'SUB001', farmerId: '1005001-24-0001', applicationDate: pastDate(40), subsidyType: 'Drip Irrigation', status: 'Approved', requestedAmount: 50000, approvedAmount: 45000, notes: 'Approved with 10% reduction.', createdAt: pastDate(40), updatedAt: pastDate(10) },
    { id: 'SUB002', farmerId: '3501008-24-0001', applicationDate: pastDate(35), subsidyType: 'New Seedlings', status: 'Under Review', requestedAmount: 25000, createdAt: pastDate(35), updatedAt: pastDate(5) },
    { id: 'SUB003', farmerId: '3502001-24-0001', applicationDate: pastDate(30), subsidyType: 'Fertilizer', status: 'Documents Pending', requestedAmount: 10000, createdAt: pastDate(30), updatedAt: pastDate(30) },
    { id: 'SUB004', farmerId: '0701001-24-0001', applicationDate: pastDate(25), subsidyType: 'Drip Irrigation', status: 'Rejected', requestedAmount: 60000, notes: 'Ineligible due to prior subsidy claim.', createdAt: pastDate(25), updatedAt: pastDate(15) },
];

export const mockDocuments: Document[] = [
    { id: 'DOC001', subsidyApplicationId: 'SUB002', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(4), createdAt: pastDate(35), updatedAt: pastDate(4) },
    { id: 'DOC002', subsidyApplicationId: 'SUB002', documentType: 'Land Record (Pattadar)', status: 'Pending', createdAt: pastDate(35), updatedAt: pastDate(35) },
    { id: 'DOC003', subsidyApplicationId: 'SUB003', documentType: 'Aadhaar Card', status: 'Pending', createdAt: pastDate(30), updatedAt: pastDate(30) },
];

export const mockDistricts: District[] = [
    { id: 'DIST07', name: 'Warangal', code: 7, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'DIST10', name: 'Hanmakonda', code: 10, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'DIST35', name: 'Mulugu', code: 35, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
];

export const mockMandals: Mandal[] = [
    { id: 'MAND0701', name: 'Warangal', districtId: 'DIST07', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'MAND0702', name: 'Geesugonda', districtId: 'DIST07', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'MAND1005', name: 'Hasanparthy', districtId: 'DIST10', code: '05', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'MAND3501', name: 'Eturnagaram', districtId: 'DIST35', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'MAND3502', name: 'Govindaraopet', districtId: 'DIST35', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
];

export const mockVillages: Village[] = [
    { id: 'VILL0701001', name: 'Kothawada', mandalId: 'MAND0701', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'VILL0702001', name: 'Gorrekunta', mandalId: 'MAND0702', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'VILL1005001', name: 'Hasanparthy', mandalId: 'MAND1005', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'VILL3501008', name: 'Eturnagaram', mandalId: 'MAND3501', code: '008', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
    { id: 'VILL3502001', name: 'Govindaraopet', mandalId: 'MAND3502', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(365) },
];

export const mockInspections: Inspection[] = [
    { id: 'INSP001', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB001', inspectorId: 'USR001', inspectionDate: pastDate(12), status: 'Completed', outcome: 'Passed', createdAt: pastDate(15), updatedAt: pastDate(12) },
    { id: 'INSP002', relatedEntityType: 'LandParcel', relatedEntityId: 'LP003', inspectorId: 'USR001', inspectionDate: pastDate(5), status: 'Completed', outcome: 'Needs Follow-up', notes: 'Possible pest issue on northern edge.', createdAt: pastDate(8), updatedAt: pastDate(5) },
    { id: 'INSP003', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB002', inspectorId: 'USR003', inspectionDate: futureDate(2), status: 'Scheduled', createdAt: pastDate(3), updatedAt: pastDate(3) },
];

export const mockHOSanctions: HOSanction[] = [
    { id: 'SAN001', sanctionType: 'High Value Subsidy', relatedEntityId: 'SUB001', amount: 45000, status: 'Approved', submittedById: 'USR003', reviewedById: 'USR005', createdAt: pastDate(10), updatedAt: pastDate(9) },
    { id: 'SAN002', sanctionType: 'Bulk Procurement Payment', relatedEntityId: 'PB002', amount: 23100, status: 'Pending Approval', submittedById: 'USR004', createdAt: pastDate(7), updatedAt: pastDate(7) },
    { id: 'SAN003', sanctionType: 'Operational Expense', relatedEntityId: 'EXP0724', amount: 150000, status: 'Rejected', submittedById: 'USR002', reviewedById: 'USR005', notes: 'Insufficient documentation for expense claim.', createdAt: pastDate(5), updatedAt: pastDate(4) },
];

export const mockPlantationLogs: PlantationLog[] = [
    { id: 'PLOG001', farmerId: '0701001-24-0001', landParcelId: 'LP001', activityType: 'Fertilizing', activityDate: pastDate(20), materialsUsed: 'Urea', quantity: 50, unit: 'kg', cost: 1500, laborCount: 2, performedById: 'USR001', createdAt: pastDate(20), updatedAt: pastDate(20) },
    { id: 'PLOG002', farmerId: '3501008-24-0001', landParcelId: 'LP003', activityType: 'Pest Control', activityDate: pastDate(15), materialsUsed: 'Neem Oil', quantity: 5, unit: 'liters', cost: 2500, laborCount: 1, performedById: 'USR001', createdAt: pastDate(15), updatedAt: pastDate(15) },
];

export const mockHarvestLogs: HarvestLog[] = [
    { id: 'HARV001', farmerId: '0701001-24-0001', landParcelId: 'LP001', harvestDate: pastDate(10), quantityTonnes: 5.5, qualityGrade: 'A', harvestedById: 'USR001', createdAt: pastDate(10), updatedAt: pastDate(10) },
    { id: 'HARV002', farmerId: '3501008-24-0001', landParcelId: 'LP003', harvestDate: pastDate(8), quantityTonnes: 8.2, qualityGrade: 'B', harvestedById: 'USR001', createdAt: pastDate(8), updatedAt: pastDate(8) },
];

export const mockMicroIrrigationInstallations: MicroIrrigationInstallation[] = [
    { id: 'MI001', farmerId: '1005001-24-0001', landParcelId: 'LP004', subsidyApplicationId: 'SUB001', installationType: 'Drip', vendorName: 'Jain Irrigation', installationDate: pastDate(5), totalCost: 80000, subsidyAmount: 45000, status: 'Verified', inspectedById: 'USR001', inspectionDate: pastDate(3), createdAt: pastDate(40), updatedAt: pastDate(3) },
    { id: 'MI002', farmerId: '0701001-24-0001', landParcelId: 'LP002', subsidyApplicationId: 'SUB004', installationType: 'Drip', vendorName: 'Netafim', totalCost: 65000, subsidyAmount: 0, status: 'Pending Installation', createdAt: pastDate(25), updatedAt: pastDate(25) },
];

export const mockNurseryInventory: NurseryInventoryItem[] = [
    { id: 'NINV001', name: 'Oil Palm Seedling (Tenera)', type: 'Seedling', quantity: 5000, unit: 'units', supplier: 'Govt. Nursery', purchaseDate: pastDate(60), costPerUnit: 150, createdAt: pastDate(60), updatedAt: pastDate(10) },
    { id: 'NINV002', name: 'NPK Fertilizer 10-26-26', type: 'Fertilizer', quantity: 2500, unit: 'kg', supplier: 'Coromandel', purchaseDate: pastDate(30), costPerUnit: 35, createdAt: pastDate(30), updatedAt: pastDate(5) },
    { id: 'NINV003', name: 'Cypermethrin', type: 'Pesticide', quantity: 100, unit: 'liters', supplier: 'Bayer', purchaseDate: pastDate(45), costPerUnit: 800, createdAt: pastDate(45), updatedAt: pastDate(15) },
];

export const mockFactoryInventory: FactoryInventoryItem[] = [
    { id: 'FINV001', factoryId: 'FACT01', name: 'Raw FFB from Mulugu', type: 'Raw FFB', quantity: 250, unit: 'Tonnes', qualityGrade: 'B', storageLocation: 'Bay 01', receivedDate: pastDate(2), createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'FINV002', factoryId: 'FACT01', name: 'Crude Palm Oil (CPO)', type: 'Crude Palm Oil', quantity: 55, unit: 'Tonnes', storageLocation: 'Tank A', receivedDate: pastDate(1), createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockProcurementCenterInventory: ProcurementCenterInventory[] = [
    { id: 'PCINV001', procurementCenterId: 'PC01', quantityTonnes: 150.5, averageQualityGrade: 'B', lastUpdated: pastDate(1), status: 'Awaiting Transport', createdAt: pastDate(10), updatedAt: pastDate(1) },
    { id: 'PCINV002', procurementCenterId: 'PC02', quantityTonnes: 88.0, averageQualityGrade: 'A', lastUpdated: pastDate(2), status: 'Awaiting Transport', createdAt: pastDate(12), updatedAt: pastDate(2) },
];

export const mockFarmVisitRequests: FarmVisitRequest[] = [
    { id: 'FVR001', farmerId: '0701001-24-0001', landParcelId: 'LP001', requestType: 'Pest/Disease Issue', urgency: 'Urgent', description: 'Yellowing leaves on several trees, suspecting bud rot.', requestDate: pastDate(3), status: 'Scheduled', assignedAgentId: 'USR001', visitDate: futureDate(1), createdAt: pastDate(3), updatedAt: pastDate(1) },
    { id: 'FVR002', farmerId: '3501008-24-0001', landParcelId: 'LP003', requestType: 'Irrigation Problem', urgency: 'Normal', description: 'Drip irrigation system pressure is low in one section of the plot.', requestDate: pastDate(5), status: 'Pending', createdAt: pastDate(5), updatedAt: pastDate(5) },
];

export const mockProcurementCenters: ProcurementCenter[] = [
    {id: 'PC01', name: 'Warangal Central PC', mandalId: 'MAND0701', managerId: 'USR006', contactPerson: 'Suresh Kumar', contactMobile: '9988776655', status: 'Active', latitude: 17.9784, longitude: 79.5941, createdAt: pastDate(180), updatedAt: pastDate(10)},
    {id: 'PC02', name: 'Eturnagaram PC', mandalId: 'MAND3501', managerId: 'USR002', contactPerson: 'Lakshmi Priya', contactMobile: '9988776644', status: 'Active', latitude: 18.3377, longitude: 80.4300, createdAt: pastDate(120), updatedAt: pastDate(5)},
];

export const mockFactories: Factory[] = [
    {id: 'FACT01', name: 'Mulugu Oil Mill', mandalId: 'MAND3501', managerId: 'USR007', capacityTonsPerDay: 200, contactMobile: '9876543210', status: 'Active', latitude: 18.25, longitude: 80.29, createdAt: pastDate(365), updatedAt: pastDate(30)},
];