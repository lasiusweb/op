import type { Farmer, Task, Employee, LandParcel, Location, ProcurementBatch, Payment, QualityInspection, District, Mandal, Village, ProcurementCenter, Factory, SubsidyApplication, Document, Inspection, Office, HOSanction, CultivationLog, HarvestLog, MicroIrrigationInstallation, NurseryInventoryItem, FactoryInventoryItem, ProcurementCenterInventory, FarmVisitRequest, EmployeeActivity, EmployeeLifecycle, ProfileChangeRequest, LifecycleTask, CropInsurancePolicy, FarmerProfileChangeRequest } from '../types';

const now = new Date();
const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const mockEmployees: Employee[] = [
    { id: 'EMP001', firstName: 'Anil', lastName: 'Kumar', fullName: 'Anil Kumar', role: 'Field Agent', department: 'Field Operations', email: 'anil.k@example.com', mobile: '9123456780', region: 'Warangal', status: 'Active', reportingManagerId: 'EMP002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP001', createdAt: pastDate(30), updatedAt: pastDate(2), joiningDate: pastDate(30), dob: '1995-08-15', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Warangal (India)' },
    { id: 'EMP002', firstName: 'Sunita', lastName: 'Sharma', fullName: 'Sunita Sharma', role: 'Mandal Coordinator', department: 'Operations', email: 'sunita.s@example.com', mobile: '9123456781', region: 'Warangal', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP002', createdAt: pastDate(100), updatedAt: pastDate(10), joiningDate: pastDate(100), dob: '1988-05-20', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Warangal (India)' },
    { id: 'EMP003', firstName: 'Vijay', lastName: 'Singh', fullName: 'Vijay Singh', role: 'Field Agent', department: 'Field Operations', email: 'vijay.s@example.com', mobile: '9123456782', region: 'Mulugu', status: 'Active', reportingManagerId: 'EMP002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP003', createdAt: pastDate(80), updatedAt: pastDate(5), joiningDate: pastDate(80), dob: '1992-11-30', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Mulugu (India)' },
    { id: 'EMP004', firstName: 'Priya', lastName: 'Patel', fullName: 'Priya Patel', role: 'Accountant', department: 'Finance', email: 'priya.p@example.com', mobile: '9123456783', region: 'Head Office', status: 'Inactive', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP004', createdAt: pastDate(120), updatedAt: pastDate(20), joiningDate: pastDate(120), dob: '1990-02-10', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Delhi (India)', resignationDate: pastDate(25), lastWorkingDate: pastDate(20) },
    { id: 'EMP005', firstName: 'Rajesh', lastName: 'Gupta', fullName: 'Rajesh Gupta', role: 'Admin', department: 'Management', email: 'rajesh.g@example.com', mobile: '9123456784', region: 'Head Office', status: 'Active', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP005', createdAt: pastDate(200), updatedAt: pastDate(1), joiningDate: pastDate(200), dob: '1980-01-25', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Delhi (India)' },
    { id: 'EMP006', firstName: 'Meena', lastName: 'Iyer', fullName: 'Meena Iyer', role: 'Reviewer', department: 'Compliance', email: 'meena.i@example.com', mobile: '9123456785', region: 'Head Office', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP006', createdAt: pastDate(150), updatedAt: pastDate(15), joiningDate: pastDate(150), dob: '1985-03-12', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Delhi (India)' },
    { id: 'EMP007', firstName: 'Sanjay', lastName: 'Rao', fullName: 'Sanjay Rao', role: 'Factory Manager', department: 'Production', email: 'sanjay.r@example.com', mobile: '9123456786', region: 'Warangal', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP007', createdAt: pastDate(180), updatedAt: pastDate(8), joiningDate: pastDate(180), dob: '1982-07-22', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Warangal (India)' },
    { id: 'EMP008', firstName: 'Deepa', lastName: 'Krishnan', fullName: 'Deepa Krishnan', role: 'HR Manager', department: 'Human Resources', email: 'deepa.k@example.com', mobile: '9123456787', region: 'Head Office', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP008', createdAt: pastDate(90), updatedAt: pastDate(4), joiningDate: pastDate(90), dob: '1989-09-05', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Delhi (India)' },
    { id: 'EMP009', firstName: 'Arjun', lastName: 'Nair', fullName: 'Arjun Nair', role: 'Field Agent', department: 'Field Operations', email: 'arjun.n@example.com', mobile: '9123456788', region: 'Hanmakonda', status: 'Active', reportingManagerId: 'EMP002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP009', createdAt: pastDate(60), updatedAt: pastDate(3), joiningDate: pastDate(60), dob: '1996-12-18', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Hanmakonda (India)' },
    { id: 'EMP010', firstName: 'Lakshmi', lastName: 'Menon', fullName: 'Lakshmi Menon', role: 'Procurement Center Manager', department: 'Procurement', email: 'lakshmi.m@example.com', mobile: '9123456789', region: 'Mulugu', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP010', createdAt: pastDate(110), updatedAt: pastDate(12), joiningDate: pastDate(110), dob: '1987-04-28', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Mulugu (India)' },
];

export const mockFarmersData: Farmer[] = [
    { id: 'FARM001', fullName: 'R. Venkatesh', fatherName: 'R. Srinivasa', mobile: '9876543210', aadhaar: '123456789012', village: 'Atmakur', mandal: 'Atmakur', district: 'Warangal', status: 'Active', gender: 'Male', dob: '1975-05-20', bankName: 'State Bank of India', bankAccountNumber: '12345678901', ifscCode: 'SBIN0001234', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: null, assignedAgentId: 'EMP001', createdAt: pastDate(50), updatedAt: pastDate(5), photoUrl: 'https://i.pravatar.cc/150?u=FARM001' },
    { id: 'FARM002', fullName: 'S. Kumar', fatherName: 'S. Raja', mobile: '9876543211', aadhaar: '234567890123', village: 'Mangapet', mandal: 'Mangapet', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1980-11-15', bankName: 'HDFC Bank', bankAccountNumber: '23456789012', ifscCode: 'HDFC0002345', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'High yield farmer.', assignedAgentId: 'EMP003', createdAt: pastDate(100), updatedAt: pastDate(10), photoUrl: 'https://i.pravatar.cc/150?u=FARM002' },
    { id: 'FARM003', fullName: 'M. Laxmi', fatherName: 'M. Prasad', mobile: '9876543212', aadhaar: '345678901234', village: 'Geesugonda', mandal: 'Geesugonda', district: 'Warangal', status: 'Active', gender: 'Female', dob: '1982-02-25', bankName: 'ICICI Bank', bankAccountNumber: '34567890123', ifscCode: 'ICIC0003456', cropType: 'Oil Palm', accountVerified: false, photoUploaded: true, remarks: 'Bank account verification pending.', assignedAgentId: 'EMP001', createdAt: pastDate(20), updatedAt: pastDate(2), photoUrl: 'https://i.pravatar.cc/150?u=FARM003' },
    { id: 'FARM004', fullName: 'K. Srinivas', fatherName: 'K. Reddy', mobile: '9876543213', aadhaar: '456789012345', village: 'Kamalapur', mandal: 'Kamalapur', district: 'Hanmakonda', status: 'Inactive', gender: 'Male', dob: '1970-08-30', bankName: 'Axis Bank', bankAccountNumber: '45678901234', ifscCode: 'AXIS0004567', cropType: 'Oil Palm', accountVerified: true, photoUploaded: false, remarks: 'Moved to a different crop.', assignedAgentId: 'EMP009', createdAt: pastDate(150), updatedAt: pastDate(30), photoUrl: 'https://i.pravatar.cc/150?u=FARM004' },
    { id: 'FARM005', fullName: 'G. Prasad', fatherName: 'G. Mohan', mobile: '9876543214', aadhaar: '567890123456', village: 'Venkatapur', mandal: 'Venkatapur', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1988-01-10', bankName: 'State Bank of India', bankAccountNumber: '56789012345', ifscCode: 'SBIN0005678', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: null, assignedAgentId: 'EMP003', createdAt: pastDate(80), updatedAt: pastDate(8) },
];

export const mockTasks: Task[] = [
    { id: 'TSK001', title: 'Verify land documents for S. Kumar', description: 'Cross-check Pattadar passbook with Aadhaar details.', assignedToId: 'EMP003', relatedFarmerId: 'FARM002', dueDate: futureDate(5), status: 'In Progress', priority: 'High', createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'TSK002', title: 'Soil testing for R. Venkatesh', description: 'Collect soil samples from plot 2 and send to lab.', assignedToId: 'EMP001', relatedFarmerId: 'FARM001', dueDate: futureDate(10), status: 'Pending', priority: 'Medium', latitude: 18.0066, longitude: 79.5962, createdAt: pastDate(3), updatedAt: pastDate(3) },
    { id: 'TSK003', title: 'Follow up on M. Laxmi bank verification', description: 'Contact farmer to get updated bank statement.', assignedToId: 'EMP001', relatedFarmerId: 'FARM003', dueDate: pastDate(1), status: 'Pending', priority: 'High', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'TSK004', title: 'Update records for K. Srinivas', description: 'Mark farmer as inactive in the system.', assignedToId: 'EMP009', relatedFarmerId: 'FARM004', dueDate: pastDate(10), status: 'Completed', priority: 'Low', createdAt: pastDate(15), updatedAt: pastDate(10), completedAt: pastDate(10) },
];

export const mockLandParcels: LandParcel[] = [
    { id: 'LP001', farmerId: 'FARM001', surveyNumber: '123/A', areaAcres: 5.2, soilType: 'Red Loam', irrigationSource: 'Borewell', latitude: 17.98, longitude: 79.58, status: 'Active', createdAt: pastDate(50), updatedAt: pastDate(5) },
    { id: 'LP002', farmerId: 'FARM002', surveyNumber: '45/B/1', areaAcres: 8.0, soilType: 'Black Cotton', irrigationSource: 'Canal', latitude: 18.25, longitude: 80.25, status: 'Active', createdAt: pastDate(100), updatedAt: pastDate(10) },
    { id: 'LP003', farmerId: 'FARM003', surveyNumber: '210', areaAcres: 3.5, soilType: 'Red Loam', irrigationSource: 'Rainfed', latitude: 17.95, longitude: 79.62, status: 'Active', createdAt: pastDate(20), updatedAt: pastDate(2) },
    { id: 'LP004', farmerId: 'FARM001', surveyNumber: '124/C', areaAcres: 2.1, soilType: 'Sandy Loam', irrigationSource: 'Borewell', latitude: 17.99, longitude: 79.59, status: 'Active', createdAt: pastDate(30), updatedAt: pastDate(8) },
];

export const mockLocations: Location[] = [
    { id: 'LOC001', name: 'Atmakur Procurement Center', type: 'Procurement Center', mandal: 'Atmakur', district: 'Warangal', latitude: 18.14, longitude: 79.85, managerId: 'EMP010', createdAt: pastDate(100), updatedAt: pastDate(10) },
    { id: 'LOC002', name: 'Warangal Central Factory', type: 'Factory', mandal: 'Sangem', district: 'Warangal', latitude: 17.91, longitude: 79.71, managerId: 'EMP007', createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'LOC003', name: 'Mulugu Regional Warehouse', type: 'Warehouse', mandal: 'Mulugu', district: 'Mulugu', latitude: 18.18, longitude: 80.09, managerId: 'EMP010', createdAt: pastDate(150), updatedAt: pastDate(15) },
];

export const mockProcurementBatches: ProcurementBatch[] = [
    { id: 'PB001', farmerId: 'FARM001', procurementCenterId: 'LOC001', weightKg: 1250.5, qualityGrade: 'A', oilContentPercentage: 22.5, procurementDate: pastDate(5), pricePerKg: 21.50, totalAmount: 26885.75, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(5), updatedAt: pastDate(2) },
    { id: 'PB002', farmerId: 'FARM002', procurementCenterId: 'LOC001', weightKg: 2100.0, qualityGrade: 'A', oilContentPercentage: 23.1, procurementDate: pastDate(4), pricePerKg: 21.75, totalAmount: 45675.00, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(4), updatedAt: pastDate(1) },
    { id: 'PB003', farmerId: 'FARM003', procurementCenterId: 'LOC001', weightKg: 850.0, qualityGrade: 'B', oilContentPercentage: 19.8, procurementDate: pastDate(3), pricePerKg: 19.50, totalAmount: 16575.00, paymentStatus: 'Pending', status: 'Active', createdAt: pastDate(3), updatedAt: pastDate(3) },
];

export const mockPayments: Payment[] = [
    { id: 'PAY001', procurementBatchId: 'PB001', farmerId: 'FARM001', amount: 26885.75, paymentDate: pastDate(2), transactionId: 'TXN12345', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(2), updatedAt: pastDate(2) },
    { id: 'PAY002', procurementBatchId: 'PB002', farmerId: 'FARM002', amount: 45675.00, paymentDate: pastDate(1), transactionId: 'TXN12346', paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockQualityInspections: QualityInspection[] = [
    { id: 'QI001', procurementBatchId: 'PB001', inspectorId: 'EMP006', inspectionDate: pastDate(5), ffaLevel: 0.5, moistureContent: 0.2, bruisingPercentage: 5, status: 'Passed', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'QI002', procurementBatchId: 'PB003', inspectorId: 'EMP006', inspectionDate: pastDate(3), ffaLevel: 0.8, moistureContent: 0.4, bruisingPercentage: 12, notes: 'Higher bruising, graded B.', status: 'Passed', createdAt: pastDate(3), updatedAt: pastDate(3) },
];

export const mockDistricts: District[] = [
    { id: 'DIST01', name: 'Warangal', code: 31, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'DIST02', name: 'Mulugu', code: 32, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'DIST03', name: 'Hanmakonda', code: 33, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
];

export const mockMandals: Mandal[] = [
    // Hanmakonda District (DIST03)
    { id: 'MAND-HNK-01', name: 'Bheemadavarpalle', districtId: 'DIST03', code: '1', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-02', name: 'Dharmasagar', districtId: 'DIST03', code: '2', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-03', name: 'Elkathurthi', districtId: 'DIST03', code: '3', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-04', name: 'Hanamkonda', districtId: 'DIST03', code: '4', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-05', name: 'Hasanparthy', districtId: 'DIST03', code: '5', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-06', name: 'Inavolu', districtId: 'DIST03', code: '6', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-07', name: 'Kamalapur', districtId: 'DIST03', code: '7', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-08', name: 'Khazipet', districtId: 'DIST03', code: '8', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-HNK-09', name: 'Velair', districtId: 'DIST03', code: '9', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },

    // Mulugu District (DIST02)
    { id: 'MAND-MLG-01', name: 'Eturnagaram', districtId: 'DIST02', code: '1', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-02', name: 'Govindaraopet', districtId: 'DIST02', code: '2', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-03', name: 'Kannaigudem', districtId: 'DIST02', code: '3', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-04', name: 'Mangapet', districtId: 'DIST02', code: '4', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-05', name: 'Mulugu', districtId: 'DIST02', code: '5', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-06', name: 'Tadvai (SS)', districtId: 'DIST02', code: '6', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-07', name: 'Venkatapur', districtId: 'DIST02', code: '7', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-08', name: 'Venkatapuram', districtId: 'DIST02', code: '8', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-MLG-09', name: 'Wazeed', districtId: 'DIST02', code: '9', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },

    // Warangal District (DIST01)
    { id: 'MAND-WGL-01', name: 'Khila Warangal', districtId: 'DIST01', code: '1', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'MAND-WGL-02', name: 'Warangal', districtId: 'DIST01', code: '2', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
];

export const mockVillages: Village[] = [
    // Hanmakonda -> Bheemadavarpalle (MAND-HNK-01)
    { id: 'VILL-HNK-01-01', name: 'Ananthasagar', mandalId: 'MAND-HNK-01', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-02', name: 'Aravapally', mandalId: 'MAND-HNK-01', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-03', name: 'Baopet', mandalId: 'MAND-HNK-01', code: '03', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-04', name: 'Damera', mandalId: 'MAND-HNK-01', code: '04', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-05', name: 'Dandepalle', mandalId: 'MAND-HNK-01', code: '05', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-06', name: 'Devannapeta', mandalId: 'MAND-HNK-01', code: '06', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-07', name: 'Elkathurthy', mandalId: 'MAND-HNK-01', code: '07', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-08', name: 'Gopalpur', mandalId: 'MAND-HNK-01', code: '08', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-09', name: 'Hasanparthy', mandalId: 'MAND-HNK-01', code: '09', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-10', name: 'Jaigiri', mandalId: 'MAND-HNK-01', code: '10', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-11', name: 'Jeelgul', mandalId: 'MAND-HNK-01', code: '11', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-12', name: 'Keshwapur', mandalId: 'MAND-HNK-01', code: '12', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-13', name: 'Kothulnadum', mandalId: 'MAND-HNK-01', code: '13', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-14', name: 'Laknavaram', mandalId: 'MAND-HNK-01', code: '14', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-15', name: 'Madipalle', mandalId: 'MAND-HNK-01', code: '15', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-16', name: 'Mallaredipally', mandalId: 'MAND-HNK-01', code: '16', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-17', name: 'Muchela', mandalId: 'MAND-HNK-01', code: '17', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-18', name: 'Nagaram', mandalId: 'MAND-HNK-01', code: '18', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-19', name: 'Pembartthy', mandalId: 'MAND-HNK-01', code: '19', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-20', name: 'Penchakalpeta', mandalId: 'MAND-HNK-01', code: '20', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-21', name: 'Siddapur', mandalId: 'MAND-HNK-01', code: '21', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-22', name: 'Sudanpalle', mandalId: 'MAND-HNK-01', code: '22', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-23', name: 'Suraram', mandalId: 'MAND-HNK-01', code: '23', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-24', name: 'Thimmapur', mandalId: 'MAND-HNK-01', code: '24', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-25', name: 'Vangapahad', mandalId: 'MAND-HNK-01', code: '25', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-26', name: 'Veeranarayanapur', mandalId: 'MAND-HNK-01', code: '26', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-01-27', name: 'Yellapur', mandalId: 'MAND-HNK-01', code: '27', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },

    // Hanmakonda -> Dharmasagar (MAND-HNK-02)
    { id: 'VILL-HNK-02-01', name: 'Bheemaram', mandalId: 'MAND-HNK-02', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-02', name: 'Chinthagattu', mandalId: 'MAND-HNK-02', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-03', name: 'Devunoor', mandalId: 'MAND-HNK-02', code: '03', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-04', name: 'Dharmapur', mandalId: 'MAND-HNK-02', code: '04', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-05', name: 'Dharmasagar', mandalId: 'MAND-HNK-02', code: '05', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-06', name: 'Jhanakipur', mandalId: 'MAND-HNK-02', code: '06', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-07', name: 'Kyathampalle', mandalId: 'MAND-HNK-02', code: '07', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-08', name: 'Mallakpalli', mandalId: 'MAND-HNK-02', code: '08', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-09', name: 'Mulkanoor', mandalId: 'MAND-HNK-02', code: '09', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-10', name: 'Musthafapur', mandalId: 'MAND-HNK-02', code: '10', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-11', name: 'Narayanagiri', mandalId: 'MAND-HNK-02', code: '11', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-12', name: 'Peddapendayal', mandalId: 'MAND-HNK-02', code: '12', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-13', name: 'Ratnagiri', mandalId: 'MAND-HNK-02', code: '13', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-14', name: 'Somadevrapalli', mandalId: 'MAND-HNK-02', code: '14', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-15', name: 'Thatikayala', mandalId: 'MAND-HNK-02', code: '15', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-16', name: 'Unikicherla', mandalId: 'MAND-HNK-02', code: '16', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-02-17', name: 'Yelukurthi Dharmasagar', mandalId: 'MAND-HNK-02', code: '17', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },

    // Hanmakonda -> Elkathurthi (MAND-HNK-03)
    { id: 'VILL-HNK-03-01', name: 'Arapalli', mandalId: 'MAND-HNK-03', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-02', name: 'Guntrupally', mandalId: 'MAND-HNK-03', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-03', name: 'Indranagar', mandalId: 'MAND-HNK-03', code: '03', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-04', name: 'Kothapalli', mandalId: 'MAND-HNK-03', code: '04', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-05', name: 'Madikonda', mandalId: 'MAND-HNK-03', code: '05', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-06', name: 'Rampur', mandalId: 'MAND-HNK-03', code: '06', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-07', name: 'Shyampet', mandalId: 'MAND-HNK-03', code: '07', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-08', name: 'Somidi', mandalId: 'MAND-HNK-03', code: '08', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-09', name: 'Tekulaguden', mandalId: 'MAND-HNK-03', code: '09', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    { id: 'VILL-HNK-03-10', name: 'Tharalapalli', mandalId: 'MAND-HNK-03', code: '10', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
    
    // ... (All other villages will be added here)
];

export const mockProcurementCenters: ProcurementCenter[] = [
    { id: 'PC01', name: 'Atmakur PC', mandalId: 'MAND01', managerId: 'EMP010', contactPerson: 'Suresh', contactMobile: '9988776655', status: 'Active', latitude: 18.14, longitude: 79.85, createdAt: pastDate(100), updatedAt: pastDate(10) },
    { id: 'PC02', name: 'Mangapet PC', mandalId: 'MAND03', managerId: 'EMP010', contactPerson: 'Ramesh', contactMobile: '9988776654', status: 'Active', latitude: 18.25, longitude: 80.25, createdAt: pastDate(120), updatedAt: pastDate(12) },
];

export const mockFactories: Factory[] = [
    { id: 'FACT01', name: 'Warangal Central Factory', mandalId: 'MAND06', managerId: 'EMP007', capacityTonsPerDay: 500, contactMobile: '9988776650', status: 'Active', latitude: 17.91, longitude: 79.71, createdAt: pastDate(200), updatedAt: pastDate(20) },
];

export const mockSubsidyApplications: SubsidyApplication[] = [
    { id: 'SUB001', farmerId: 'FARM001', applicationDate: pastDate(30), subsidyType: 'Drip Irrigation', status: 'Approved', requestedAmount: 50000, approvedAmount: 45000, notes: 'Approved with 10% reduction.', createdAt: pastDate(30), updatedAt: pastDate(10) },
    { id: 'SUB002', farmerId: 'FARM003', applicationDate: pastDate(15), subsidyType: 'New Seedlings', status: 'Documents Pending', requestedAmount: 25000, notes: 'Aadhaar and Pattadar required.', createdAt: pastDate(15), updatedAt: pastDate(15) },
    { id: 'SUB003', farmerId: 'FARM002', applicationDate: pastDate(20), subsidyType: 'Fertilizer', status: 'Under Review', requestedAmount: 10000, createdAt: pastDate(20), updatedAt: pastDate(5) },
];

export const mockDocuments: Document[] = [
    { id: 'DOC001', subsidyApplicationId: 'SUB001', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'EMP006', verifiedAt: pastDate(12), createdAt: pastDate(30), updatedAt: pastDate(12) },
    { id: 'DOC002', subsidyApplicationId: 'SUB001', documentType: 'Land Record (Pattadar)', status: 'Verified', verifiedById: 'EMP006', verifiedAt: pastDate(12), createdAt: pastDate(30), updatedAt: pastDate(12) },
    { id: 'DOC003', subsidyApplicationId: 'SUB002', documentType: 'Bank Statement', status: 'Pending', createdAt: pastDate(15), updatedAt: pastDate(15) },
];

export const mockInspections: Inspection[] = [
    { id: 'INSP001', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB001', inspectorId: 'EMP001', inspectionDate: pastDate(15), status: 'Completed', outcome: 'Passed', notes: 'Drip system installed as per spec.', createdAt: pastDate(15), updatedAt: pastDate(15) },
    { id: 'INSP002', relatedEntityType: 'LandParcel', relatedEntityId: 'LP002', inspectorId: 'EMP003', inspectionDate: pastDate(8), status: 'Completed', outcome: 'Needs Follow-up', notes: 'Signs of pest activity found in north-west corner.', createdAt: pastDate(8), updatedAt: pastDate(8) },
];

export const mockOffices: Office[] = [];

export const mockHOSanctions: HOSanction[] = [
    { id: 'HOS001', sanctionType: 'High Value Subsidy', relatedEntityId: 'SUB001', amount: 45000, status: 'Approved', submittedById: 'EMP002', reviewedById: 'EMP005', createdAt: pastDate(10), updatedAt: pastDate(9) },
    { id: 'HOS002', sanctionType: 'Bulk Procurement Payment', relatedEntityId: 'PB002', amount: 45675, status: 'Pending Approval', submittedById: 'EMP004', createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockCultivationLogs: CultivationLog[] = [
    { id: 'PLOG001', farmerId: 'FARM001', landParcelId: 'LP001', activityType: 'Fertilizing', activityDate: pastDate(20), materialsUsed: 'Urea', quantity: 50, unit: 'kg', cost: 1500, laborCount: 2, performedById: 'EMP001', createdAt: pastDate(20), updatedAt: pastDate(20) },
    { id: 'PLOG002', farmerId: 'FARM002', landParcelId: 'LP002', activityType: 'Pest Control', activityDate: pastDate(10), materialsUsed: 'Neem Oil', quantity: 5, unit: 'liters', cost: 2500, laborCount: 1, performedById: 'EMP003', createdAt: pastDate(10), updatedAt: pastDate(10) },
];

export const mockHarvestLogs: HarvestLog[] = [];
export const mockMicroIrrigationInstallations: MicroIrrigationInstallation[] = [];
export const mockNurseryInventory: NurseryInventoryItem[] = [];
export const mockFactoryInventory: FactoryInventoryItem[] = [];
export const mockProcurementCenterInventory: ProcurementCenterInventory[] = [];

export const mockFarmVisitRequests: FarmVisitRequest[] = [
    { id: 'FVR001', farmerId: 'FARM002', landParcelId: 'LP002', requestType: 'Pest/Disease Issue', urgency: 'Urgent', description: 'Yellow spots on leaves, spreading quickly.', requestDate: pastDate(2), status: 'Scheduled', assignedAgentId: 'EMP003', visitDate: futureDate(1), createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'FVR002', farmerId: 'FARM001', landParcelId: 'LP004', requestType: 'Soil Health Query', urgency: 'Normal', description: 'Want to test soil before next fertilizer application.', requestDate: pastDate(5), status: 'Pending', createdAt: pastDate(5), updatedAt: pastDate(5) },
];

export const mockEmployeeActivity: EmployeeActivity[] = [
    { id: 'ACT001', employeeId: 'EMP001', action: 'Completed Task', details: 'Followed up on M. Laxmi bank verification.', timestamp: pastDate(1), icon: 'task' },
    { id: 'ACT002', employeeId: 'EMP003', action: 'Scheduled Visit', details: 'Pest/Disease Issue for S. Kumar', timestamp: pastDate(1), icon: 'employee' },
    { id: 'ACT003', employeeId: 'EMP005', action: 'Approved Sanction', details: 'HOS001 - High Value Subsidy for R. Venkatesh', timestamp: pastDate(9), icon: 'payment' },
    { id: 'ACT004', employeeId: 'EMP006', action: 'Verified Documents', details: 'Aadhaar & Land Record for SUB001', timestamp: pastDate(12), icon: 'subsidy' },
];

export const mockEmployeeLifecycleData: EmployeeLifecycle[] = [];
export const mockProfileChangeRequests: ProfileChangeRequest[] = [];

export const mockCropInsurancePolicies: CropInsurancePolicy[] = [
    {
        id: 'CI-001',
        farmerId: 'FARM001', // R. Venkatesh
        policyNumber: 'AGRI-2024-8451',
        insurer: 'AgriCorp Insurance',
        coverageType: 'Weather-Based',
        sumInsured: 250000,
        premium: 12500,
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        status: 'Active'
    }
];
export const mockFarmerProfileChangeRequests: FarmerProfileChangeRequest[] = [];