
import type { Farmer, Task, User, LandParcel, Location, ProcurementBatch, Payment, QualityInspection, District, Mandal, Village, ProcurementCenter, Factory, SubsidyApplication, Document, Inspection, Office, HOSanction, PlantationLog, HarvestLog, MicroIrrigationInstallation, NurseryInventoryItem, FactoryInventoryItem, ProcurementCenterInventory } from '../types';

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
  { id: 'FARM001', fullName: 'R. Venkatesh', fatherName: 'R. Rao', mobile: '9876543210', aadhaar: '**** **** 1234', village: 'Kothawada', mandal: 'Warangal', district: 'Warangal', status: 'Active', gender: 'Male', dob: '1975-05-20', bankName: 'State Bank of India', bankAccountNumber: '**** **** 2034', ifscCode: 'SBIN0001234', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Consistently high yield producer.', photoUrl: 'https://i.pravatar.cc/150?u=FARM001', assignedAgentId: 'USR001', createdAt: pastDate(50), updatedAt: pastDate(3) },
  { id: 'FARM002', fullName: 'S. Kumar', fatherName: 'S. Reddy', mobile: '9876543211', aadhaar: '**** **** 5678', village: 'Eturnagaram', mandal: 'Eturnagaram', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1982-11-15', bankName: 'HDFC Bank', bankAccountNumber: '**** **** 8876', ifscCode: 'HDFC0005678', cropType: 'Oil Palm', accountVerified: true, photoUploaded: false, remarks: null, photoUrl: undefined, assignedAgentId: 'USR001', createdAt: pastDate(60), updatedAt: pastDate(4) },
  { id: 'FARM003', fullName: 'M. Laxmi', fatherName: 'M. Gupta', mobile: '9876543212', aadhaar: '**** **** 9012', village: 'Gorrekunta', mandal: 'Geesugonda', district: 'Warangal', status: 'Inactive', gender: 'Female', dob: '1990-02-10', bankName: 'ICICI Bank', bankAccountNumber: '**** **** 4321', ifscCode: 'ICIC0009012', cropType: 'Oil Palm', accountVerified: false, photoUploaded: true, remarks: 'Account inactive due to land sale.', photoUrl: 'https://i.pravatar.cc/150?u=FARM003', assignedAgentId: 'USR001', createdAt: pastDate(70), updatedAt: pastDate(15) },
  { id: 'FARM004', fullName: 'K. Srinivas', fatherName: 'K. Murthy', mobile: '9876543213', aadhaar: '**** **** 3456', village: 'Hasanparthy', mandal: 'Hasanparthy', district: 'Hanmakonda', status: 'Active', gender: 'Male', dob: '1968-07-30', bankName: 'Axis Bank', bankAccountNumber: '**** **** 6543', ifscCode: 'UTIB0003456', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Participated in the drip irrigation subsidy program.', photoUrl: undefined, assignedAgentId: 'USR001', createdAt: pastDate(45), updatedAt: pastDate(8) },
  { id: 'FARM005', fullName: 'G. Prasad', fatherName: 'G. Naidu', mobile: '9876543214', aadhaar: '**** **** 7890', village: 'Govindaraopet', mandal: 'Govindaraopet', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1978-09-05', bankName: 'State Bank of India', bankAccountNumber: '**** **** 0987', ifscCode: 'SBIN0007890', cropType: 'Oil Palm', accountVerified: false, photoUploaded: false, remarks: 'Awaiting bank account verification.', photoUrl: 'https://i.pravatar.cc/150?u=FARM005', assignedAgentId: 'USR003', createdAt: pastDate(55), updatedAt: pastDate(1) },
];

export const mockTasks: Task[] = [
  { id: 'TSK001', title: 'Inspect Farmer R. Venkatesh\'s Plot', description: 'Conduct a routine inspection of plot #45B and report on crop health. Check for signs of pest infestation and verify irrigation system functionality. Document findings with photographic evidence.', assignedToId: 'USR001', relatedFarmerId: 'FARM001', dueDate: '2024-08-15', status: 'In Progress', priority: 'High', latitude: 17.98, longitude: 79.59, createdAt: pastDate(10), updatedAt: pastDate(3), completedAt: undefined },
  { id: 'TSK002', title: 'Verify Subsidy Application #S4521', description: 'Check submitted documents for farmer S. Kumar and verify land records.', assignedToId: 'USR003', relatedFarmerId: 'FARM002', dueDate: '2024-08-10', status: 'Completed', priority: 'Medium', latitude: 18.25, longitude: 80.29, createdAt: pastDate(12), updatedAt: pastDate(1), completedAt: pastDate(1) },
  { id: 'TSK003', title: 'Collect Soil Samples from Hanmakonda', description: 'Collect 5 soil samples from designated areas in Hasanparthy mandal. Samples should be taken from a depth of 15cm and properly labeled for lab analysis.', assignedToId: 'USR001', dueDate: '2024-08-20', status: 'Pending', priority: 'Medium', latitude: 18.00, longitude: 79.58, createdAt: pastDate(8), updatedAt: pastDate(8), completedAt: undefined },
  { id: 'TSK004', title: 'Review Q2 Financial Reports', description: 'Audit and approve the financial statements for the second quarter.', assignedToId: 'USR004', dueDate: '2024-08-12', status: 'Rejected', priority: 'Low', createdAt: pastDate(20), updatedAt: pastDate(5), completedAt: undefined },
  { id: 'TSK005', title: 'Onboard New Farmers in Mulugu', description: 'Complete the registration and onboarding process for 10 new farmers.', assignedToId: 'USR002', dueDate: '2024-08-18', status: 'Pending', priority: 'High', createdAt: pastDate(5), updatedAt: pastDate(5), completedAt: undefined },
];

export const mockLandParcels: LandParcel[] = [
    { id: 'LP001', farmerId: 'FARM001', surveyNumber: 'SN-WGL-01', areaAcres: 5.2, soilType: 'Red Loam', irrigationSource: 'Borewell', latitude: 17.98, longitude: 79.59, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'LP002', farmerId: 'FARM001', surveyNumber: 'SN-WGL-02', areaAcres: 3.0, soilType: 'Red Loam', irrigationSource: 'Canal', latitude: 17.99, longitude: 79.60, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'LP003', farmerId: 'FARM002', surveyNumber: 'SN-MUL-01', areaAcres: 10.5, soilType: 'Black Cotton', irrigationSource: 'Borewell', latitude: 18.25, longitude: 80.29, status: 'Active', createdAt: pastDate(400), updatedAt: pastDate(50) },
    { id: 'LP004', farmerId: 'FARM004', surveyNumber: 'SN-HNK-01', areaAcres: 8.0, soilType: 'Sandy Loam', irrigationSource: 'Rainfed', latitude: 18.00, longitude: 79.58, status: 'Active', createdAt: pastDate(250), updatedAt: pastDate(20) },
    { id: 'LP005', farmerId: 'FARM004', surveyNumber: 'SN-HNK-02', areaAcres: 4.5, soilType: 'Sandy Loam', irrigationSource: 'Borewell', latitude: 18.01, longitude: 79.59, status: 'Active', createdAt: pastDate(250), updatedAt: pastDate(20) },
    { id: 'LP006', farmerId: 'FARM005', surveyNumber: 'SN-MUL-02', areaAcres: 6.0, soilType: 'Red Sandy', irrigationSource: 'Canal', latitude: 18.26, longitude: 80.30, status: 'Fallow', createdAt: pastDate(300), updatedAt: pastDate(100) },
    { id: 'LP007', farmerId: 'FARM003', surveyNumber: 'SN-WGL-03', areaAcres: 7.1, soilType: 'Alluvial', irrigationSource: 'Canal', latitude: 17.97, longitude: 79.58, status: 'Sold', createdAt: pastDate(500), updatedAt: pastDate(15) },

];

export const mockLocations: Location[] = [
    { id: 'LOC01', name: 'Warangal Central PC', type: 'Procurement Center', mandal: 'Warangal', district: 'Warangal', latitude: 17.98, longitude: 79.59, managerId: 'USR002', createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'LOC02', name: 'Mulugu Hub', type: 'Procurement Center', mandal: 'Mulugu', district: 'Mulugu', latitude: 18.25, longitude: 80.29, managerId: 'USR003', createdAt: pastDate(180), updatedAt: pastDate(15) },
    { id: 'LOC03', name: 'Eturnagaram Factory', type: 'Factory', mandal: 'Eturnagaram', district: 'Mulugu', latitude: 18.37, longitude: 80.43, managerId: 'USR007', createdAt: pastDate(300), updatedAt: pastDate(45) },
    { id: 'LOC04', name: 'Hasanparthy Warehouse', type: 'Warehouse', mandal: 'Hasanparthy', district: 'Hanmakonda', latitude: 18.06, longitude: 79.53, managerId: 'USR006', createdAt: pastDate(150), updatedAt: pastDate(10) },
    { id: 'LOC05', name: 'Govindaraopet Collection Point', type: 'Procurement Center', mandal: 'Govindaraopet', district: 'Mulugu', latitude: 18.24, longitude: 80.21, createdAt: pastDate(90), updatedAt: pastDate(5) },
];

export const mockProcurementBatches: ProcurementBatch[] = [
    { id: 'PB001', farmerId: 'FARM001', procurementCenterId: 'LOC01', weightKg: 1250.5, qualityGrade: 'A', oilContentPercentage: 22.5, procurementDate: pastDate(2).split('T')[0], pricePerKg: 15.50, totalAmount: 19382.75, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'PB002', farmerId: 'FARM002', procurementCenterId: 'LOC03', weightKg: 875.0, qualityGrade: 'B', oilContentPercentage: 19.8, procurementDate: pastDate(3).split('T')[0], pricePerKg: 14.00, totalAmount: 12250.00, paymentStatus: 'Pending', status: 'Active', createdAt: pastDate(3), updatedAt: pastDate(3) },
    { id: 'PB003', farmerId: 'FARM004', procurementCenterId: 'LOC04', weightKg: 2100.0, qualityGrade: 'A', oilContentPercentage: 23.1, procurementDate: pastDate(5).split('T')[0], pricePerKg: 15.75, totalAmount: 33075.00, paymentStatus: 'Pending', status: 'Active', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'PB004', farmerId: 'FARM005', procurementCenterId: 'LOC05', weightKg: 950.2, qualityGrade: 'C', oilContentPercentage: 17.2, procurementDate: pastDate(6).split('T')[0], pricePerKg: 12.00, totalAmount: 11402.40, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(6), updatedAt: pastDate(4) },
    { id: 'PB005', farmerId: 'FARM001', procurementCenterId: 'LOC01', weightKg: 1500.0, qualityGrade: 'B', oilContentPercentage: 20.1, procurementDate: pastDate(8).split('T')[0], pricePerKg: 14.25, totalAmount: 21375.00, paymentStatus: 'Partial', status: 'Active', createdAt: pastDate(8), updatedAt: pastDate(8) },
    { id: 'PB006', farmerId: 'FARM002', procurementCenterId: 'LOC03', weightKg: 650.0, qualityGrade: 'A', oilContentPercentage: 21.9, procurementDate: pastDate(10).split('T')[0], pricePerKg: 15.50, totalAmount: 10075.00, paymentStatus: 'Paid', status: 'Cancelled', createdAt: pastDate(10), updatedAt: pastDate(9) },
];

export const mockProcurementCenters: ProcurementCenter[] = [
    { id: 'PC001', name: 'Warangal Central PC', mandalId: 'MAND01', managerId: 'USR002', contactPerson: 'Srinivas Rao', contactMobile: '9988776655', status: 'Active', latitude: 17.98, longitude: 79.59, createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'PC002', name: 'Mulugu Hub', mandalId: 'MAND20', managerId: 'USR003', contactPerson: 'Lakshmi Devi', contactMobile: '9988776654', status: 'Active', latitude: 18.25, longitude: 80.29, createdAt: pastDate(180), updatedAt: pastDate(15) },
    { id: 'PC003', name: 'Govindaraopet Collection Point', mandalId: 'MAND17', managerId: 'USR006', contactPerson: 'Ramesh Yadav', contactMobile: '9988776653', status: 'Active', latitude: 18.24, longitude: 80.21, createdAt: pastDate(90), updatedAt: pastDate(5) },
    { id: 'PC004', name: 'Hasanparthy Center', mandalId: 'MAND11', status: 'Active', contactPerson: 'Anjali Reddy', contactMobile: '9988776652', latitude: 18.06, longitude: 79.53, createdAt: pastDate(150), updatedAt: pastDate(60) },
];

export const mockFactories: Factory[] = [
    { id: 'FACT01', name: 'Eturnagaram Oil Mill', mandalId: 'MAND16', managerId: 'USR007', capacityTonsPerDay: 500, contactMobile: '9876543210', status: 'Active', latitude: 18.37, longitude: 80.43, createdAt: pastDate(300), updatedAt: pastDate(45) },
    { id: 'FACT02', name: 'Hasanparthy Processing Unit', mandalId: 'MAND11', managerId: 'USR007', capacityTonsPerDay: 350, contactMobile: '9876543211', status: 'Active', latitude: 18.06, longitude: 79.53, createdAt: pastDate(250), updatedAt: pastDate(30) },
    { id: 'FACT03', name: 'Warangal Refinery', mandalId: 'MAND01', capacityTonsPerDay: 750, contactMobile: '9876543212', status: 'Inactive', createdAt: pastDate(400), updatedAt: pastDate(100) },
];

export const mockPayments: Payment[] = [
    { id: 'PAY001', procurementBatchId: 'PB001', farmerId: 'FARM001', amount: 19382.75, paymentDate: pastDate(1).split('T')[0], transactionId: 'TXN1002345', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(1), updatedAt: pastDate(1) },
    { id: 'PAY002', procurementBatchId: 'PB004', farmerId: 'FARM005', amount: 11402.40, paymentDate: pastDate(3).split('T')[0], transactionId: 'TXN1002346', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(3), updatedAt: pastDate(3) },
    { id: 'PAY003', procurementBatchId: 'PB005', farmerId: 'FARM001', amount: 10000.00, paymentDate: pastDate(7).split('T')[0], transactionId: 'TXN1002347', paymentMethod: 'Cheque', status: 'Processing', createdAt: pastDate(7), updatedAt: pastDate(7) },
    { id: 'PAY004', procurementBatchId: 'PB005', farmerId: 'FARM001', amount: 5000.00, paymentDate: pastDate(6).split('T')[0], transactionId: 'TXN1002348', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(6), updatedAt: pastDate(6) },
    { id: 'PAY005', procurementBatchId: 'PB006', farmerId: 'FARM002', amount: 10075.00, paymentDate: pastDate(9).split('T')[0], transactionId: 'TXN1002349', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(9), updatedAt: pastDate(9) },
];
export const mockQualityInspections: QualityInspection[] = [];

// Master Data
export const mockDistricts: District[] = [
    { id: 'DIST05', name: 'Hanmakonda', code: 10, status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(5) },
    { id: 'DIST06', name: 'Mulugu', code: 35, status: 'Active', createdAt: pastDate(120), updatedAt: pastDate(8) },
    { id: 'DIST07', name: 'Warangal', code: 7, status: 'Active', createdAt: pastDate(200), updatedAt: pastDate(10) },
];

export const mockMandals: Mandal[] = [
    // Warangal Mandals (repurposed)
    { id: 'MAND01', name: 'Warangal', districtId: 'DIST07', code: '01', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND02', name: 'Geesugonda', districtId: 'DIST07', code: '02', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND03', name: 'Narsampet', districtId: 'DIST07', code: '03', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    // Hanmakonda Mandals
    { id: 'MAND07', name: 'Bheemadavarp', districtId: 'DIST05', code: '01', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND08', name: 'Dharmasagar', districtId: 'DIST05', code: '02', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND09', name: 'Elkathurthi', districtId: 'DIST05', code: '03', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND10', name: 'Hanamkonda', districtId: 'DIST05', code: '04', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND11', name: 'Hasanparthy', districtId: 'DIST05', code: '05', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND12', name: 'Inavolu', districtId: 'DIST05', code: '06', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND13', name: 'Kamalapur', districtId: 'DIST05', code: '07', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND14', name: 'Khazipet', districtId: 'DIST05', code: '08', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND15', name: 'Velair', districtId: 'DIST05', code: '09', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    // Mulugu Mandals
    { id: 'MAND16', name: 'Eturnagaram', districtId: 'DIST06', code: '01', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND17', name: 'Govindaraopet', districtId: 'DIST06', code: '02', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND18', name: 'Kannaigudem', districtId: 'DIST06', code: '03', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND19', name: 'Mangapet', districtId: 'DIST06', code: '04', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND20', name: 'Mulugu', districtId: 'DIST06', code: '05', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND21', name: 'Tadvai (SS)', districtId: 'DIST06', code: '06', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND22', name: 'Venkata Puram', districtId: 'DIST06', code: '07', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND23', name: 'Venkatapur', districtId: 'DIST06', code: '08', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
    { id: 'MAND24', name: 'Wazeed', districtId: 'DIST06', code: '09', status: 'Active', createdAt: pastDate(180), updatedAt: pastDate(5) },
];

export const mockVillages: Village[] = [
    { id: 'VILL001', name: 'Abbapur', mandalId: 'MAND07', code: '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL002', name: 'Bheemadavarpalli', mandalId: 'MAND07', code: '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL003', name: 'Baopet', mandalId: 'MAND07', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL004', name: 'Chittapur', mandalId: 'MAND07', code: '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL005', name: 'Devannapeta', mandalId: 'MAND07', code: '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL006', name: 'Gatla Narsingapur', mandalId: 'MAND07', code: '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL007', name: 'Gopalpur', mandalId: 'MAND07', code: '008', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL008', name: 'Koppur', mandalId: 'MAND07', code: '010', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL009', name: 'Kothapalli', mandalId: 'MAND07', code: '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL010', name: 'Jeelgul', mandalId: 'MAND07', code: '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL011', name: 'Kistajipet', mandalId: 'MAND07', code: '013', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL012', name: 'Laknavaram', mandalId: 'MAND07', code: '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL013', name: 'Manikyapur', mandalId: 'MAND07', code: '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL014', name: 'Mallampalli', mandalId: 'MAND07', code: '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL015', name: 'Mothlapally', mandalId: 'MAND07', code: '018', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL016', name: 'Muchela', mandalId: 'MAND07', code: '019', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL017', name: 'Mulkanoor', mandalId: 'MAND07', code: '017', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL018', name: 'Pembalthy', mandalId: 'MAND07', code: '022', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL019', name: 'Ramanajapet', mandalId: 'MAND07', code: '020', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL020', name: 'Sudanpalle', mandalId: 'MAND07', code: '019', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL021', name: 'Thimmapur', mandalId: 'MAND07', code: '024', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL022', name: 'Vangapahad', mandalId: 'MAND07', code: '025', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL023', name: 'Vellapur', mandalId: 'MAND07', code: '026', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL024', name: 'Venkatraopalle', mandalId: 'MAND07', code: '023', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL025', name: 'Devnoor', mandalId: 'MAND08', code: '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL026', name: 'Dharmasagar', mandalId: 'MAND08', code: '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL027', name: 'Dharmaram', mandalId: 'MAND08', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL028', name: 'Elkurthy', mandalId: 'MAND08', code: '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL029', name: 'Jhanikipur', mandalId: 'MAND08', code: '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL030', name: 'Kyathampalle', mandalId: 'MAND08', code: '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL031', name: 'Mulkanoor', mandalId: 'MAND08', code: '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL032', name: 'Narayanagiri', mandalId: 'MAND08', code: '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL033', name: 'Somadevpalli', mandalId: 'MAND08', code: '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL034', name: 'Unikicherla', mandalId: 'MAND08', code: '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL035', name: 'Velukurthi Dha', mandalId: 'MAND08', code: '017', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL036', name: 'Elkathurthi', mandalId: 'MAND09', code: '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL037', name: 'Gunturpally', mandalId: 'MAND09', code: '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL038', name: 'Indiranagar', mandalId: 'MAND09', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL039', name: 'Madikonda', mandalId: 'MAND09', code: '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL040', name: 'Somidi', mandalId: 'MAND09', code: '008', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL041', name: 'Thimmapur', mandalId: 'MAND09', code: '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL042', name: 'Tekulaguden', mandalId: 'MAND09', code: '010', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL043', name: 'Haralkurthi', mandalId: 'MAND09', code: '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL044', name: 'Waddepalle', mandalId: 'MAND10', code: '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL045', name: 'Desarajpalle', mandalId: 'MAND10', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL046', name: 'Amruthnagar', mandalId: 'MAND11', code: '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL047', name: 'Jujnoor', mandalId: 'MAND11', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL048', name: 'Maddelagudem', mandalId: 'MAND11', code: '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL049', name: 'Mucherla Nagul', mandalId: 'MAND11', code: '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL050', name: 'Panthini', mandalId: 'MAND11', code: '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL051', name: 'Pegadapalli', mandalId: 'MAND11', code: '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL052', name: 'Singaram', mandalId: 'MAND11', code: '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL053', name: 'Vanadurgam', mandalId: 'MAND11', code: '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL054', name: 'Varalakakantap', mandalId: 'MAND11', code: '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL055', name: 'Vambala', mandalId: 'MAND11', code: '017', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL056', name: 'Bheempalli', mandalId: 'MAND12', code: '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL057', name: 'Gudur', mandalId: 'MAND12', code: '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL058', name: 'Inavolu', mandalId: 'MAND12', code: '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL059', name: 'Kondaparthy', mandalId: 'MAND12', code: '008', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL060', name: 'Mutharam(P.K)', mandalId: 'MAND12', code: '010', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL061', name: 'Ambala', mandalId: 'MAND13', code: '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL062', name: 'Desarajpalli', mandalId: 'MAND13', code: '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL063', name: 'Guniparthi', mandalId: 'MAND13', code: '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL064', name: 'Kaniparthi', mandalId: 'MAND13', code: '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL065', name: 'Kannapeta', mandalId: 'MAND13', code: '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL066', 'name': 'Mallur', 'mandalId': 'MAND13', 'code': '009', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL067', 'name': 'Narsampalligudem', 'mandalId': 'MAND13', 'code': '010', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL068', 'name': 'Sanigaram', 'mandalId': 'MAND13', 'code': '012', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL069', 'name': 'Uppal', 'mandalId': 'MAND13', 'code': '013', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL070', 'name': 'Vangapalle', 'mandalId': 'MAND13', 'code': '014', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL071', 'name': 'Ammavaripet', 'mandalId': 'MAND14', 'code': '001', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL072', 'name': 'Kadipikonda', 'mandalId': 'MAND14', 'code': '003', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL073', 'name': 'Kothapalli', 'mandalId': 'MAND14', 'code': '004', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL074', 'name': 'Rampur', 'mandalId': 'MAND14', 'code': '005', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL075', 'name': 'Somaram', 'mandalId': 'MAND14', 'code': '006', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL076', 'name': 'Tekulaguden', 'mandalId': 'MAND14', 'code': '007', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL077', 'name': 'Chinthala Thanda', 'mandalId': 'MAND15', 'code': '001', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL078', 'name': 'Kondaguda', 'mandalId': 'MAND15', 'code': '002', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL079', 'name': 'Shalapally', 'mandalId': 'MAND15', 'code': '004', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL080', 'name': 'Velair', 'mandalId': 'MAND15', 'code': '007', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL081', 'name': 'Akulavari Ghanpur', 'mandalId': 'MAND16', 'code': '001', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL082', 'name': 'Alugupalli', 'mandalId': 'MAND16', 'code': '003', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL083', 'name': 'Challapaka', 'mandalId': 'MAND16', 'code': '005', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL084', 'name': 'Chapala', 'mandalId': 'MAND16', 'code': '004', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL085', 'name': 'Eturnagaram', 'mandalId': 'MAND16', 'code': '008', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL086', 'name': 'Lingapur', 'mandalId': 'MAND16', 'code': '011', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL087', 'name': 'Mullakatta', 'mandalId': 'MAND16', 'code': '013', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL088', 'name': 'Ramannagudem', 'mandalId': 'MAND16', 'code': '016', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL089', 'name': 'Roheer', 'mandalId': 'MAND16', 'code': '019', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL090', 'name': 'Shapalle', 'mandalId': 'MAND16', 'code': '022', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL091', 'name': 'Veerapuram', 'mandalId': 'MAND16', 'code': '024', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL092', 'name': 'Bussapur', 'mandalId': 'MAND17', 'code': '001', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL093', 'name': 'Chalwai', 'mandalId': 'MAND17', 'code': '002', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL094', 'name': 'Durgaram', 'mandalId': 'MAND17', 'code': '003', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL095', 'name': 'Machapur', 'mandalId': 'MAND17', 'code': '005', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL096', 'name': 'Mothlagudem', 'mandalId': 'MAND17', 'code': '007', 'status': 'Active', 'createdAt': pastDate(150), 'updatedAt': pastDate(2) },
    { id: 'VILL097', 'name': 'Muthapur', 'mandalId': 'MAND17', 'code': '010', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL098', 'name': 'Poshettigudem', 'mandalId': 'MAND17', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL099', 'name': 'Projectnagar', 'mandalId': 'MAND17', 'code': '013', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL100', 'name': 'Rangapur', 'mandalId': 'MAND17', 'code': '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL101', 'name': 'Allapur', 'mandalId': 'MAND18', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL102', 'name': 'Bhopathipuram', 'mandalId': 'MAND18', 'code': '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL103', 'name': 'Brhamanpalle', 'mandalId': 'MAND18', 'code': '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL104', 'name': 'Chityal', 'mandalId': 'MAND18', 'code': '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL105', 'name': 'Gangaram Gut', 'mandalId': 'MAND18', 'code': '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL106', 'name': 'Gurrevula', 'mandalId': 'MAND18', 'code': '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL107', 'name': 'Kanthanpalle', 'mandalId': 'MAND18', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL108', 'name': 'Muppanapalle', 'mandalId': 'MAND18', 'code': '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL109', 'name': 'Rajannapeta', 'mandalId': 'MAND18', 'code': '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL110', 'name': 'Thupakulagudem', 'mandalId': 'MAND18', 'code': '020', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL111', 'name': 'Akinepalli', 'mandalId': 'MAND19', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL112', 'name': 'Balannagudem', 'mandalId': 'MAND19', 'code': '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL113', 'name': 'Barlagudem', 'mandalId': 'MAND19', 'code': '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL114', 'name': 'Cherupalle', 'mandalId': 'MAND19', 'code': '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL115', 'name': 'Domeda', 'mandalId': 'MAND19', 'code': '008', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL116', 'name': 'Kamalapur', 'mandalId': 'MAND19', 'code': '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL117', 'name': 'Kathigudem', 'mandalId': 'MAND19', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL118', 'name': 'Kishtapur', 'mandalId': 'MAND19', 'code': '013', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL119', 'name': 'Mallur', 'mandalId': 'MAND19', 'code': '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL120', 'name': 'Narsalgudem', 'mandalId': 'MAND19', 'code': '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL121', 'name': 'Palimela', 'mandalId': 'MAND19', 'code': '017', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL122', 'name': 'Poredupalle', 'mandalId': 'MAND19', 'code': '019', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL123', 'name': 'Rajupeta', 'mandalId': 'MAND19', 'code': '022', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL124', 'name': 'Thakkalagude', 'mandalId': 'MAND19', 'code': '024', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL125', 'name': 'Thimmapuram', 'mandalId': 'MAND19', 'code': '026', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL126', 'name': 'Wadagudem', 'mandalId': 'MAND19', 'code': '027', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL127', 'name': 'Abbapur', 'mandalId': 'MAND20', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL128', 'name': 'Achutapur', 'mandalId': 'MAND20', 'code': '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL129', 'name': 'Incherla', 'mandalId': 'MAND20', 'code': '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL130', 'name': 'Jakaram', 'mandalId': 'MAND20', 'code': '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL131', 'name': 'Kistagudem', 'mandalId': 'MAND20', 'code': '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL132', 'name': 'Kothur', 'mandalId': 'MAND20', 'code': '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL133', 'name': 'Pathipalle', 'mandalId': 'MAND20', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL134', 'name': 'Rajendra', 'mandalId': 'MAND20', 'code': '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL135', 'name': 'Adharwayi', 'mandalId': 'MAND21', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL136', 'name': 'Ailapur', 'mandalId': 'MAND21', 'code': '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL137', 'name': 'Annaram', 'mandalId': 'MAND21', 'code': '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL138', 'name': 'Beerelli', 'mandalId': 'MAND21', 'code': '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL139', 'name': 'Bollapalli', 'mandalId': 'MAND21', 'code': '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL140', 'name': 'Durgaram', 'mandalId': 'MAND21', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL141', 'name': 'Gudam', 'mandalId': 'MAND21', 'code': '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL142', 'name': 'Jamnapangavai', 'mandalId': 'MAND21', 'code': '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL143', 'name': 'Kamaram', 'mandalId': 'MAND21', 'code': '020', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL144', 'name': 'Kannepalli', 'mandalId': 'MAND21', 'code': '023', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL145', 'name': 'Kondaparthi', 'mandalId': 'MAND21', 'code': '026', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL146', 'name': 'Lakkavaram', 'mandalId': 'MAND21', 'code': '028', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL147', 'name': 'Lingala', 'mandalId': 'MAND21', 'code': '029', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL148', 'name': 'Narlapur', 'mandalId': 'MAND21', 'code': '031', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL149', 'name': 'Narsapur', 'mandalId': 'MAND21', 'code': '034', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL150', 'name': 'Pambapur', 'mandalId': 'MAND21', 'code': '036', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL151', 'name': 'Tadvai', 'mandalId': 'MAND21', 'code': '039', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL152', 'name': 'Ashannaguda', 'mandalId': 'MAND22', 'code': '002', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL153', 'name': 'Ankannagudem', 'mandalId': 'MAND22', 'code': '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL154', 'name': 'Eturunagaram', 'mandalId': 'MAND22', 'code': '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL155', 'name': 'Nallagunta', 'mandalId': 'MAND22', 'code': '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL156', 'name': 'Thimmapur', 'mandalId': 'MAND22', 'code': '008', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL157', 'name': 'Alubaka', 'mandalId': 'MAND23', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL158', 'name': 'Baragudem', 'mandalId': 'MAND23', 'code': '003', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL159', 'name': 'Desarajupalle', 'mandalId': 'MAND23', 'code': '006', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL160', 'name': 'Gangaram', 'mandalId': 'MAND23', 'code': '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL161', 'name': 'Koya Bestagudem', 'mandalId': 'MAND23', 'code': '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL162', 'name': 'Nuguru', 'mandalId': 'MAND23', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL163', 'name': 'Palem', 'mandalId': 'MAND23', 'code': '014', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL164', 'name': 'Peddamidisileru', 'mandalId': 'MAND23', 'code': '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL165', 'name': 'Punem Veera', 'mandalId': 'MAND23', 'code': '017', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL166', 'name': 'Suddibaka', 'mandalId': 'MAND23', 'code': '020', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL167', 'name': 'UP', 'mandalId': 'MAND23', 'code': '022', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL168', 'name': 'Veerabhadra', 'mandalId': 'MAND23', 'code': '023', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL169', 'name': 'Wadagudem', 'mandalId': 'MAND23', 'code': '025', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL170', 'name': 'Bandarupally', 'mandalId': 'MAND23', 'code': '028', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL171', 'name': 'Kothagudem', 'mandalId': 'MAND23', 'code': '029', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL172', 'name': 'Motlagudem', 'mandalId': 'MAND23', 'code': '030', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL173', 'name': 'Musiriguda', 'mandalId': 'MAND23', 'code': '031', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL174', 'name': 'Arunachalapur', 'mandalId': 'MAND24', 'code': '001', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL175', 'name': 'Chandur', 'mandalId': 'MAND24', 'code': '004', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL176', 'name': 'Cherukur', 'mandalId': 'MAND24', 'code': '005', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL177', 'name': 'Dubba', 'mandalId': 'MAND24', 'code': '007', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL178', 'name': 'Edjarlapalle', 'mandalId': 'MAND24', 'code': '009', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL179', 'name': 'Gummadidoddi', 'mandalId': 'MAND24', 'code': '011', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL180', 'name': 'Kacharam', 'mandalId': 'MAND24', 'code': '012', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL181', 'name': 'Konjed', 'mandalId': 'MAND24', 'code': '013', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL182', 'name': 'Koyaveerapura', 'mandalId': 'MAND24', 'code': '015', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL183', 'name': 'Lingapet', 'mandalId': 'MAND24', 'code': '016', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL184', 'name': 'Nagram', 'mandalId': 'MAND24', 'code': '020', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL185', 'name': 'Peruru', 'mandalId': 'MAND24', 'code': '022', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL186', 'name': 'Pragallapalle', 'mandalId': 'MAND24', 'code': '023', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL187', 'name': 'Tekula', 'mandalId': 'MAND24', 'code': '025', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
    { id: 'VILL188', 'name': 'Ippagudem', 'mandalId': 'MAND24', 'code': '026', status: 'Active', createdAt: pastDate(150), updatedAt: pastDate(2) },
];

export const mockOffices: Office[] = [
    { id: 'OFF01', name: 'Head Office', type: 'Head Office', address: '8-2-293/82/A, Plot No 73, Rd Number 7, Jubilee Hills', mandalId: 'MAND10', contactPerson: 'Rajesh Gupta', contactMobile: '9123456784', status: 'Active', createdAt: pastDate(500), updatedAt: pastDate(10) },
    { id: 'OFF02', name: 'Warangal Regional Office', type: 'Regional Office', address: 'Naimnagar, Hanamkonda', mandalId: 'MAND10', contactPerson: 'Sunita Sharma', contactMobile: '9123456781', status: 'Active', createdAt: pastDate(300), updatedAt: pastDate(20) },
    { id: 'OFF03', name: 'Mulugu Zonal Office', type: 'Zonal Office', address: 'Main Road, Mulugu', mandalId: 'MAND20', contactPerson: 'Vijay Singh', contactMobile: '9123456782', status: 'Active', createdAt: pastDate(250), updatedAt: pastDate(30) },
];

// New Operations Mock Data
export const mockSubsidyApplications: SubsidyApplication[] = [
    { id: 'SUB001', farmerId: 'FARM001', applicationDate: pastDate(25).split('T')[0], subsidyType: 'Drip Irrigation', status: 'Approved', requestedAmount: 50000, approvedAmount: 45000, notes: 'Approved after field inspection.', createdAt: pastDate(25), updatedAt: pastDate(5) },
    { id: 'SUB002', farmerId: 'FARM004', applicationDate: pastDate(15).split('T')[0], subsidyType: 'New Seedlings', status: 'Under Review', requestedAmount: 25000, notes: 'Awaiting inspection report.', createdAt: pastDate(15), updatedAt: pastDate(2) },
    { id: 'SUB003', farmerId: 'FARM002', applicationDate: pastDate(30).split('T')[0], subsidyType: 'Fertilizer', status: 'Rejected', requestedAmount: 10000, notes: 'Ineligible due to prior subsidy claim this year.', createdAt: pastDate(30), updatedAt: pastDate(10) },
    { id: 'SUB004', farmerId: 'FARM005', applicationDate: pastDate(5).split('T')[0], subsidyType: 'Drip Irrigation', status: 'Documents Pending', requestedAmount: 75000, createdAt: pastDate(5), updatedAt: pastDate(5) },
];

export const mockDocuments: Document[] = [
    // Application SUB001 (All Verified)
    { id: 'DOC001', subsidyApplicationId: 'SUB001', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(10).split('T')[0], createdAt: pastDate(25), updatedAt: pastDate(10) },
    { id: 'DOC002', subsidyApplicationId: 'SUB001', documentType: 'Land Record (Pattadar)', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(10).split('T')[0], createdAt: pastDate(25), updatedAt: pastDate(10) },
    { id: 'DOC003', subsidyApplicationId: 'SUB001', documentType: 'Bank Statement', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(10).split('T')[0], createdAt: pastDate(25), updatedAt: pastDate(10) },
    // Application SUB002 (Partially Verified)
    { id: 'DOC004', subsidyApplicationId: 'SUB002', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(8).split('T')[0], createdAt: pastDate(15), updatedAt: pastDate(8) },
    { id: 'DOC005', subsidyApplicationId: 'SUB002', documentType: 'Land Record (Pattadar)', status: 'Pending', createdAt: pastDate(15), updatedAt: pastDate(15) },
    // Application SUB003 (One Rejected)
    { id: 'DOC006', subsidyApplicationId: 'SUB003', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'USR003', verifiedAt: pastDate(12).split('T')[0], createdAt: pastDate(30), updatedAt: pastDate(12) },
    { id: 'DOC007', subsidyApplicationId: 'SUB003', documentType: 'Land Record (Pattadar)', status: 'Rejected', notes: 'Land record does not match farmer name.', verifiedById: 'USR003', verifiedAt: pastDate(11).split('T')[0], createdAt: pastDate(30), updatedAt: pastDate(11) },
    // Application SUB004 (All Pending)
    { id: 'DOC008', subsidyApplicationId: 'SUB004', documentType: 'Aadhaar Card', status: 'Pending', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'DOC009', subsidyApplicationId: 'SUB004', documentType: 'Land Record (Pattadar)', status: 'Pending', createdAt: pastDate(5), updatedAt: pastDate(5) },
];

export const mockInspections: Inspection[] = [
    { id: 'INSP001', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB001', inspectorId: 'USR001', inspectionDate: pastDate(8).split('T')[0], status: 'Completed', outcome: 'Passed', notes: 'Drip irrigation setup potential confirmed for 5 acres.', createdAt: pastDate(15), updatedAt: pastDate(8) },
    { id: 'INSP002', relatedEntityType: 'LandParcel', relatedEntityId: 'LP003', inspectorId: 'USR001', inspectionDate: pastDate(2).split('T')[0], status: 'Completed', outcome: 'Needs Follow-up', notes: 'Signs of minor pest activity detected. Recommended treatment.', createdAt: pastDate(10), updatedAt: pastDate(2) },
    { id: 'INSP003', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB002', inspectorId: 'USR001', inspectionDate: futureDate(3).split('T')[0], status: 'Scheduled', createdAt: pastDate(4), updatedAt: pastDate(4) },
    { id: 'INSP004', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB004', inspectorId: 'USR002', inspectionDate: futureDate(7).split('T')[0], status: 'Scheduled', createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockHOSanctions: HOSanction[] = [
    { id: 'HOS001', sanctionType: 'High Value Subsidy', relatedEntityId: 'SUB001', amount: 45000, status: 'Approved', submittedById: 'USR003', reviewedById: 'USR005', createdAt: pastDate(4), updatedAt: pastDate(1) },
    { id: 'HOS002', sanctionType: 'Bulk Procurement Payment', relatedEntityId: 'PB003', amount: 33075, status: 'Pending Approval', submittedById: 'USR006', notes: 'Bulk payment for Hasanparthy Hub, requires immediate approval.', createdAt: pastDate(2), updatedAt: pastDate(2) },
    { id: 'HOS003', sanctionType: 'Operational Expense', relatedEntityId: 'OPEX-Q3-LOGISTICS', amount: 150000, status: 'Rejected', submittedById: 'USR002', reviewedById: 'USR005', notes: 'Budget exceeded for this quarter. Resubmit with justification.', createdAt: pastDate(8), updatedAt: pastDate(3) },
    { id: 'HOS004', sanctionType: 'High Value Subsidy', relatedEntityId: 'SUB004', amount: 75000, status: 'Query Raised', submittedById: 'USR003', reviewedById: 'USR005', notes: 'Farmer eligibility requires re-verification based on new guidelines.', createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockPlantationLogs: PlantationLog[] = [
    { id: 'PLOG001', farmerId: 'FARM001', landParcelId: 'LP001', activityType: 'Fertilizing', activityDate: pastDate(5).split('T')[0], materialsUsed: 'Urea, Potash', quantity: 50, unit: 'kg', cost: 2500, laborCount: 2, performedById: 'USR001', notes: 'Standard NPK application for pre-fruiting stage.', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'PLOG002', farmerId: 'FARM002', landParcelId: 'LP003', activityType: 'Pest Control', activityDate: pastDate(10).split('T')[0], materialsUsed: 'Neem Oil', quantity: 5, unit: 'liters', cost: 1200, laborCount: 1, performedById: 'USR001', notes: 'Sprayed neem oil solution to control leaf-eating caterpillars.', createdAt: pastDate(10), updatedAt: pastDate(10) },
    { id: 'PLOG003', farmerId: 'FARM004', landParcelId: 'LP004', activityType: 'Weeding', activityDate: pastDate(2).split('T')[0], cost: 3000, laborCount: 4, performedById: 'USR001', notes: 'Manual weeding completed across 8 acres.', createdAt: pastDate(2), updatedAt: pastDate(2) },
    { id: 'PLOG004', farmerId: 'FARM001', landParcelId: 'LP002', activityType: 'Pruning', activityDate: pastDate(15).split('T')[0], laborCount: 3, performedById: 'USR001', notes: 'Removed old fronds to improve air circulation.', cost: 2000, createdAt: pastDate(15), updatedAt: pastDate(15) },
    { id: 'PLOG005', farmerId: 'FARM005', landParcelId: 'LP006', activityType: 'Soil Testing', activityDate: pastDate(30).split('T')[0], performedById: 'USR001', notes: 'Soil sample collected and sent to lab for analysis.', createdAt: pastDate(30), updatedAt: pastDate(30) },
];

export const mockHarvestLogs: HarvestLog[] = [
    { id: 'HARV001', farmerId: 'FARM001', landParcelId: 'LP001', harvestDate: pastDate(20).split('T')[0], quantityTonnes: 12.5, qualityGrade: 'A', harvestedById: 'USR001', notes: 'First harvest of the season.', createdAt: pastDate(20), updatedAt: pastDate(20) },
    { id: 'HARV002', farmerId: 'FARM002', landParcelId: 'LP003', harvestDate: pastDate(18).split('T')[0], quantityTonnes: 25.0, qualityGrade: 'B', harvestedById: 'USR001', notes: 'Slight bruising noted on 10% of the yield.', createdAt: pastDate(18), updatedAt: pastDate(18) },
    { id: 'HARV003', farmerId: 'FARM004', landParcelId: 'LP004', harvestDate: pastDate(15).split('T')[0], quantityTonnes: 18.2, qualityGrade: 'A', harvestedById: 'USR002', createdAt: pastDate(15), updatedAt: pastDate(15) },
    { id: 'HARV004', farmerId: 'FARM001', landParcelId: 'LP002', harvestDate: pastDate(12).split('T')[0], quantityTonnes: 8.1, qualityGrade: 'C', harvestedById: 'USR001', notes: 'Lower yield due to irrigation issues last month.', createdAt: pastDate(12), updatedAt: pastDate(12) },
];

export const mockMicroIrrigationInstallations: MicroIrrigationInstallation[] = [
    { id: 'MI001', farmerId: 'FARM001', landParcelId: 'LP001', subsidyApplicationId: 'SUB001', installationType: 'Drip', vendorName: 'Jain Irrigation', installationDate: pastDate(3).split('T')[0], totalCost: 120000, subsidyAmount: 45000, status: 'Verified', inspectedById: 'USR003', inspectionDate: pastDate(1).split('T')[0], notes: 'System functioning correctly.', createdAt: pastDate(10), updatedAt: pastDate(1) },
    { id: 'MI002', farmerId: 'FARM004', landParcelId: 'LP005', subsidyApplicationId: 'SUB002', installationType: 'Sprinkler', vendorName: 'Netafim', installationDate: pastDate(5).split('T')[0], totalCost: 85000, subsidyAmount: 30000, status: 'Pending Inspection', notes: 'Installation complete, awaiting verification.', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'MI003', farmerId: 'FARM005', landParcelId: 'LP006', subsidyApplicationId: 'SUB004', installationType: 'Drip', vendorName: 'Jain Irrigation', totalCost: 150000, subsidyAmount: 75000, status: 'Pending Installation', notes: 'Awaiting document approval to begin installation.', createdAt: pastDate(2), updatedAt: pastDate(2) },
];

// Inventory Mock Data
export const mockNurseryInventory: NurseryInventoryItem[] = [
    { id: 'NINV001', name: 'Tenera Palm Seedling (6 months)', type: 'Seedling', quantity: 5000, unit: 'units', supplier: 'Govt. Nursery Warangal', purchaseDate: pastDate(30), costPerUnit: 150, createdAt: pastDate(30), updatedAt: pastDate(2) },
    { id: 'NINV002', name: 'Urea (46-0-0)', type: 'Fertilizer', quantity: 250, unit: 'bags (50kg)', supplier: 'Coromandel International', purchaseDate: pastDate(15), costPerUnit: 300, createdAt: pastDate(15), updatedAt: pastDate(5) },
    { id: 'NINV003', name: 'Chlorpyrifos 20% EC', type: 'Pesticide', quantity: 100, unit: 'litres', supplier: 'Bayer CropScience', purchaseDate: pastDate(45), costPerUnit: 800, createdAt: pastDate(45), updatedAt: pastDate(10) },
    { id: 'NINV004', name: 'Harvesting Sickle', type: 'Tool', quantity: 50, unit: 'units', supplier: 'Local Agro Tools', purchaseDate: pastDate(60), costPerUnit: 450, createdAt: pastDate(60), updatedAt: pastDate(20) },
];

export const mockFactoryInventory: FactoryInventoryItem[] = [
    { id: 'FINV001', factoryId: 'FACT01', name: 'Fresh Fruit Bunches (FFB)', type: 'Raw FFB', quantity: 250, unit: 'Tonnes', qualityGrade: 'A', storageLocation: 'Receiving Bay 1', receivedDate: pastDate(1), createdAt: pastDate(1), updatedAt: pastDate(1) },
    { id: 'FINV002', factoryId: 'FACT01', name: 'Crude Palm Oil (CPO)', type: 'Crude Palm Oil', quantity: 50000, unit: 'Litres', storageLocation: 'Storage Tank A-1', receivedDate: pastDate(2), createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'FINV003', factoryId: 'FACT01', name: 'Palm Kernel', type: 'Palm Kernel', quantity: 50, unit: 'Tonnes', storageLocation: 'Warehouse Section B', receivedDate: pastDate(2), createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'FINV004', factoryId: 'FACT02', name: 'Fresh Fruit Bunches (FFB)', type: 'Raw FFB', quantity: 180, unit: 'Tonnes', qualityGrade: 'B', storageLocation: 'Receiving Bay', receivedDate: pastDate(1), createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockProcurementCenterInventory: ProcurementCenterInventory[] = [
    { id: 'PCINV001', procurementCenterId: 'PC001', quantityTonnes: 125.5, averageQualityGrade: 'A', lastUpdated: pastDate(1), status: 'Awaiting Transport', createdAt: pastDate(1), updatedAt: pastDate(1) },
    { id: 'PCINV002', procurementCenterId: 'PC002', quantityTonnes: 88.0, averageQualityGrade: 'B', lastUpdated: pastDate(2), status: 'Awaiting Transport', createdAt: pastDate(2), updatedAt: pastDate(2) },
    { id: 'PCINV003', procurementCenterId: 'PC003', quantityTonnes: 210.2, averageQualityGrade: 'B', lastUpdated: pastDate(1), status: 'In Transit', createdAt: pastDate(1), updatedAt: pastDate(0) },
    { id: 'PCINV004', procurementCenterId: 'PC004', quantityTonnes: 0, averageQualityGrade: 'A', lastUpdated: pastDate(10), status: 'Awaiting Transport', createdAt: pastDate(10), updatedAt: pastDate(10) },
];
