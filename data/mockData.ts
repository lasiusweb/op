import type { Farmer, Task, Employee, LandParcel, Location, ProcurementBatch, Payment, QualityInspection, District, Mandal, Village, ProcurementCenter, Factory, SubsidyApplication, Document, Inspection, Office, HOSanction, PlantationLog, HarvestLog, MicroIrrigationInstallation, NurseryInventoryItem, FactoryInventoryItem, ProcurementCenterInventory, FarmVisitRequest, EmployeeActivity, EmployeeLifecycle, ProfileChangeRequest, LifecycleTask } from '../types';

const now = new Date();
const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const mockEmployees: Employee[] = [
    { id: 'EMP001', firstName: 'Anil', lastName: 'Kumar', fullName: 'Anil Kumar', role: 'Field Agent', department: 'Field Operations', email: 'anil.k@example.com', mobile: '9123456780', region: 'Warangal', status: 'Active', reportingManagerId: 'EMP002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP001', createdAt: pastDate(30), updatedAt: pastDate(2), joiningDate: pastDate(30), dob: '1995-08-15', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Warangal (India)' },
    { id: 'EMP002', firstName: 'Sunita', lastName: 'Sharma', fullName: 'Sunita Sharma', role: 'Mandal Coordinator', department: 'Operations', email: 'sunita.s@example.com', mobile: '9123456781', region: 'Warangal', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP002', createdAt: pastDate(100), updatedAt: pastDate(10), joiningDate: pastDate(100), dob: '1988-05-20', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Warangal (India)' },
    { id: 'EMP003', firstName: 'Vijay', lastName: 'Singh', fullName: 'Vijay Singh', role: 'Field Agent', department: 'Field Operations', email: 'vijay.s@example.com', mobile: '9123456782', region: 'Mulugu', status: 'Active', reportingManagerId: 'EMP002', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP003', createdAt: pastDate(80), updatedAt: pastDate(5), joiningDate: pastDate(80), dob: '1992-11-30', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Mulugu (India)' },
    { id: 'EMP004', firstName: 'Priya', lastName: 'Patel', fullName: 'Priya Patel', role: 'Accountant', department: 'Finance', email: 'priya.p@example.com', mobile: '9123456783', region: 'Head Office', status: 'Inactive', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP004', createdAt: pastDate(120), updatedAt: pastDate(20), joiningDate: pastDate(120), dob: '1990-02-10', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Delhi (India)', resignationDate: pastDate(25), lastWorkingDate: pastDate(20) },
    { id: 'EMP005', firstName: 'Rajesh', lastName: 'Gupta', fullName: 'Rajesh Gupta', role: 'Admin', department: 'Management', email: 'rajesh.g@example.com', mobile: '9123456784', region: 'Head Office', status: 'Active', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP005', createdAt: pastDate(200), updatedAt: pastDate(1), joiningDate: pastDate(200), dob: '1974-01-01', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Delhi (India)' },
    { id: 'EMP006', firstName: 'Kavita', lastName: 'Rao', fullName: 'Kavita Rao', role: 'Procurement Center Manager', department: 'Procurement', email: 'kavita.r@example.com', mobile: '9123456785', region: 'Hanmakonda', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP006', createdAt: pastDate(90), updatedAt: pastDate(8), joiningDate: pastDate(90), dob: '1985-07-22', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Hanmakonda (India)' },
    { id: 'EMP007', firstName: 'Manoj', lastName: 'Reddy', fullName: 'Manoj Reddy', role: 'Factory Manager', department: 'Production', email: 'manoj.r@example.com', mobile: '9123456786', region: 'Mulugu', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP007', createdAt: pastDate(110), updatedAt: pastDate(12), joiningDate: pastDate(110), dob: '1982-03-12', gender: 'Male', employmentType: 'Permanent', jobLocation: 'Mulugu (India)' },
    { id: 'EMP008', firstName: 'Meena', lastName: 'Kumari', fullName: 'Meena Kumari', role: 'Reviewer', department: 'Compliance', email: 'meena.k@example.com', mobile: '9123456787', region: 'Head Office', status: 'Active', reportingManagerId: 'EMP005', profilePhotoUrl: 'https://i.pravatar.cc/150?u=EMP008', createdAt: pastDate(60), updatedAt: pastDate(6), joiningDate: pastDate(60), dob: '1965-10-10', gender: 'Female', employmentType: 'Permanent', jobLocation: 'Delhi (India)', retirementAge: 60 },
];

const onboardingTasks: LifecycleTask[] = [
    { id: 'OBT01', description: 'Background Verification', status: 'Pending', responsible: 'HR' },
    { id: 'OBT02', description: 'Issue Offer Letter', status: 'Pending', responsible: 'HR' },
    { id: 'OBT03', description: 'Create Official Email ID', status: 'Pending', responsible: 'IT' },
    { id: 'OBT04', description: 'Assign Laptop/Hardware', status: 'Pending', responsible: 'IT' },
    { id: 'OBT05', description: 'Schedule Team Introduction', status: 'Pending', responsible: 'Manager' },
];

const offboardingTasks: LifecycleTask[] = [
    { id: 'OFFBT01', description: 'Conduct Exit Interview', status: 'Pending', responsible: 'HR' },
    { id: 'OFFBT02', description: 'Deactivate Email & System Access', status: 'Pending', responsible: 'IT' },
    { id: 'OFFBT03', description: 'Collect Company Assets (Laptop, ID)', status: 'Pending', responsible: 'IT' },
    { id: 'OFFBT04', description: 'Process Final Settlement', status: 'Pending', responsible: 'HR' },
];

export const mockEmployeeLifecycleData: EmployeeLifecycle[] = [
    { 
        employeeId: 'EMP001', 
        processType: 'Onboarding', 
        status: 'Completed', 
        startDate: pastDate(30),
        completionDate: pastDate(25),
        tasks: onboardingTasks.map(t => ({...t, status: 'Completed'}))
    },
    { 
        employeeId: 'EMP004', 
        processType: 'Offboarding', 
        status: 'In Progress', 
        startDate: pastDate(25),
        tasks: [
            {...offboardingTasks[0], status: 'Completed'},
            {...offboardingTasks[1], status: 'Completed'},
            {...offboardingTasks[2], status: 'Pending'},
            {...offboardingTasks[3], status: 'Pending'},
        ]
    },
    { 
        employeeId: 'EMP008', 
        processType: 'Onboarding', 
        status: 'In Progress', 
        startDate: pastDate(60),
        tasks: [
            {...onboardingTasks[0], status: 'Completed'},
            {...onboardingTasks[1], status: 'Completed'},
            {...onboardingTasks[2], status: 'Completed'},
            {...onboardingTasks[3], status: 'Pending'},
            {...onboardingTasks[4], status: 'Pending'},
        ]
    }
];

export const mockProfileChangeRequests: ProfileChangeRequest[] = [
    {
        id: 'PCR001',
        employeeId: 'EMP001',
        requestedById: 'EMP001',
        requestDate: pastDate(5),
        status: 'Pending',
        requestedChanges: { mobile: '9988776655' }
    },
    {
        id: 'PCR002',
        employeeId: 'EMP003',
        requestedById: 'EMP005',
        requestDate: pastDate(10),
        status: 'Approved',
        requestedChanges: { region: 'Warangal' },
        reviewedById: 'EMP005',
        reviewedAt: pastDate(8),
        reviewNotes: 'Approved based on transfer order.'
    },
    {
        id: 'PCR003',
        employeeId: 'EMP006',
        requestedById: 'EMP006',
        requestDate: pastDate(3),
        status: 'Rejected',
        requestedChanges: { fullName: 'Kavita Rao Sharma' },
        reviewedById: 'EMP005',
        reviewedAt: pastDate(1),
        reviewNotes: 'Name change requires legal documentation proof.'
    }
];

export const mockFarmersData: Farmer[] = [
  { id: '0701001-24-0001', fullName: 'R. Venkatesh', fatherName: 'R. Rao', mobile: '9876543210', aadhaar: '**** **** 1234', village: 'Kothawada', mandal: 'Warangal', district: 'Warangal', status: 'Active', gender: 'Male', dob: '1975-05-20', bankName: 'State Bank of India', bankAccountNumber: '**** **** 2034', ifscCode: 'SBIN0001234', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Consistently high yield producer.', photoUrl: 'https://i.pravatar.cc/150?u=0701001-24-0001', assignedAgentId: 'EMP001', createdAt: pastDate(50), updatedAt: pastDate(3) },
  { id: '3501008-24-0001', fullName: 'S. Kumar', fatherName: 'S. Reddy', mobile: '9876543211', aadhaar: '**** **** 5678', village: 'Eturnagaram', mandal: 'Eturnagaram', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1982-11-15', bankName: 'HDFC Bank', bankAccountNumber: '**** **** 8876', ifscCode: 'HDFC0005678', cropType: 'Oil Palm', accountVerified: true, photoUploaded: false, remarks: null, photoUrl: undefined, assignedAgentId: 'EMP001', createdAt: pastDate(60), updatedAt: pastDate(4) },
  { id: '0702001-24-0001', fullName: 'M. Laxmi', fatherName: 'M. Gupta', mobile: '9876543212', aadhaar: '**** **** 9012', village: 'Gorrekunta', mandal: 'Geesugonda', district: 'Warangal', status: 'Inactive', gender: 'Female', dob: '1990-02-10', bankName: 'ICICI Bank', bankAccountNumber: '**** **** 4321', ifscCode: 'ICIC0009012', cropType: 'Oil Palm', accountVerified: false, photoUploaded: true, remarks: 'Account inactive due to land sale.', photoUrl: 'https://i.pravatar.cc/150?u=0702001-24-0001', assignedAgentId: 'EMP001', createdAt: pastDate(70), updatedAt: pastDate(15) },
  { id: '1005001-24-0001', fullName: 'K. Srinivas', fatherName: 'K. Murthy', mobile: '9876543213', aadhaar: '**** **** 3456', village: 'Hasanparthy', mandal: 'Hasanparthy', district: 'Hanmakonda', status: 'Active', gender: 'Male', dob: '1968-07-30', bankName: 'Axis Bank', bankAccountNumber: '**** **** 6543', ifscCode: 'UTIB0003456', cropType: 'Oil Palm', accountVerified: true, photoUploaded: true, remarks: 'Participated in the drip irrigation subsidy program.', photoUrl: undefined, assignedAgentId: 'EMP001', createdAt: pastDate(45), updatedAt: pastDate(8) },
  { id: '3502001-24-0001', fullName: 'G. Prasad', fatherName: 'G. Naidu', mobile: '9876543214', aadhaar: '**** **** 7890', village: 'Govindaraopet', mandal: 'Govindaraopet', district: 'Mulugu', status: 'Active', gender: 'Male', dob: '1978-01-25', bankName: 'State Bank of India', bankAccountNumber: '**** **** 0987', ifscCode: 'SBIN0007890', cropType: 'Oil Palm', accountVerified: false, photoUploaded: false, remarks: null, photoUrl: undefined, assignedAgentId: 'EMP003', createdAt: pastDate(85), updatedAt: pastDate(2) },
];

export const mockTasks: Task[] = [
  { id: 'TSK001', title: 'Verify R. Venkatesh Documents', description: 'Cross-check Aadhaar and land records for subsidy application SUB001.', assignedToId: 'EMP008', relatedFarmerId: '0701001-24-0001', dueDate: futureDate(2), status: 'In Progress', priority: 'High', createdAt: pastDate(1), updatedAt: pastDate(0) },
  { id: 'TSK002', title: 'Field Visit to S. Kumar', description: 'Inspect new plantation area and verify GPS coordinates for LP002.', assignedToId: 'EMP001', relatedFarmerId: '3501008-24-0001', dueDate: futureDate(5), status: 'Pending', priority: 'Medium', latitude: 18.35, longitude: 80.42, createdAt: pastDate(2), updatedAt: pastDate(2) },
  { id: 'TSK003', title: 'Process Payment for PB003', description: 'Release payment for K. Srinivas for procurement batch PB003.', assignedToId: 'EMP004', relatedFarmerId: '1005001-24-0001', dueDate: pastDate(1), status: 'Completed', priority: 'High', completedAt: pastDate(1), createdAt: pastDate(4), updatedAt: pastDate(1) },
  { id: 'TSK004', title: 'Quarterly Report Generation', description: 'Generate and submit Q2 procurement and financial reports.', assignedToId: 'EMP002', dueDate: futureDate(10), status: 'Pending', priority: 'Low', createdAt: pastDate(5), updatedAt: pastDate(5) },
  { id: 'TSK005', title: 'Follow-up on G. Prasad land', description: 'Check on irrigation installation status for LP005.', assignedToId: 'EMP003', relatedFarmerId: '3502001-24-0001', dueDate: futureDate(3), status: 'Pending', priority: 'Medium', latitude: 18.22, longitude: 80.35, createdAt: pastDate(1), updatedAt: pastDate(1) },
];

export const mockLandParcels: LandParcel[] = [
    { id: 'LP001', farmerId: '0701001-24-0001', surveyNumber: '123/A', areaAcres: 5.2, soilType: 'Red Loam', irrigationSource: 'Borewell', latitude: 18.00, longitude: 79.58, status: 'Active', createdAt: pastDate(50), updatedAt: pastDate(3) },
    { id: 'LP002', farmerId: '3501008-24-0001', surveyNumber: '45/B/1', areaAcres: 10.0, soilType: 'Black Cotton', irrigationSource: 'Canal', latitude: 18.35, longitude: 80.42, status: 'Active', createdAt: pastDate(60), updatedAt: pastDate(4) },
    { id: 'LP003', farmerId: '0702001-24-0001', surveyNumber: '210', areaAcres: 3.5, soilType: 'Red Loam', irrigationSource: 'Rainfed', latitude: 17.95, longitude: 79.62, status: 'Sold', createdAt: pastDate(70), updatedAt: pastDate(15) },
    { id: 'LP004', farmerId: '1005001-24-0001', surveyNumber: '88/C', areaAcres: 8.0, soilType: 'Sandy Loam', irrigationSource: 'Borewell', latitude: 18.05, longitude: 79.53, status: 'Active', createdAt: pastDate(45), updatedAt: pastDate(8) },
    { id: 'LP005', farmerId: '3502001-24-0001', surveyNumber: '15/2', areaAcres: 12.5, soilType: 'Black Cotton', irrigationSource: 'Canal', latitude: 18.22, longitude: 80.35, status: 'Active', createdAt: pastDate(85), updatedAt: pastDate(2) },
];

export const mockLocations: Location[] = [
    { id: 'LOC001', name: 'Warangal Central PC', type: 'Procurement Center', mandal: 'Warangal', district: 'Warangal', latitude: 17.97, longitude: 79.6, managerId: 'EMP006', createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'LOC002', name: 'Mulugu Factory', type: 'Factory', mandal: 'Mulugu', district: 'Mulugu', latitude: 18.18, longitude: 80.28, managerId: 'EMP007', createdAt: pastDate(300), updatedAt: pastDate(30) },
    { id: 'LOC003', name: 'Geesugonda Warehouse', type: 'Warehouse', mandal: 'Geesugonda', district: 'Warangal', latitude: 17.90, longitude: 79.70, managerId: 'EMP002', createdAt: pastDate(150), updatedAt: pastDate(15) },
];

export const mockProcurementBatches: ProcurementBatch[] = [
    { id: 'PB001', farmerId: '0701001-24-0001', procurementCenterId: 'LOC001', weightKg: 1250.5, qualityGrade: 'A', oilContentPercentage: 22.5, procurementDate: pastDate(5), pricePerKg: 20.50, totalAmount: 25635.25, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(5), updatedAt: pastDate(4) },
    { id: 'PB002', farmerId: '3501008-24-0001', procurementCenterId: 'LOC002', weightKg: 2100.0, qualityGrade: 'B', oilContentPercentage: 20.1, procurementDate: pastDate(8), pricePerKg: 18.00, totalAmount: 37800.00, paymentStatus: 'Partial', status: 'Active', createdAt: pastDate(8), updatedAt: pastDate(8) },
    { id: 'PB003', farmerId: '1005001-24-0001', procurementCenterId: 'LOC001', weightKg: 850.0, qualityGrade: 'A', oilContentPercentage: 23.1, procurementDate: pastDate(10), pricePerKg: 21.00, totalAmount: 17850.00, paymentStatus: 'Paid', status: 'Active', createdAt: pastDate(10), updatedAt: pastDate(9) },
    { id: 'PB004', farmerId: '3502001-24-0001', procurementCenterId: 'LOC002', weightKg: 3500.2, qualityGrade: 'C', oilContentPercentage: 18.5, procurementDate: pastDate(12), pricePerKg: 15.50, totalAmount: 54253.10, paymentStatus: 'Pending', status: 'Cancelled', createdAt: pastDate(12), updatedAt: pastDate(11) },
];

export const mockPayments: Payment[] = [
    { id: 'PAY001', procurementBatchId: 'PB001', farmerId: '0701001-24-0001', amount: 25635.25, paymentDate: pastDate(4), transactionId: 'TRN' + Date.now(), paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(4), updatedAt: pastDate(4) },
    { id: 'PAY002', procurementBatchId: 'PB002', farmerId: '3501008-24-0001', amount: 20000.00, paymentDate: pastDate(7), transactionId: 'TRN' + (Date.now() - 1000), paymentMethod: 'Bank Transfer', status: 'Success', createdAt: pastDate(7), updatedAt: pastDate(7) },
    { id: 'PAY003', procurementBatchId: 'PB003', farmerId: '1005001-24-0001', amount: 17850.00, paymentDate: pastDate(9), transactionId: 'TRN' + (Date.now() - 2000), paymentMethod: 'Cheque', status: 'Success', createdAt: pastDate(9), updatedAt: pastDate(9) },
];

export const mockQualityInspections: QualityInspection[] = [
    { id: 'QI001', procurementBatchId: 'PB001', inspectorId: 'EMP006', inspectionDate: pastDate(5), ffaLevel: 2.5, moistureContent: 0.2, bruisingPercentage: 5, status: 'Passed', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'QI002', procurementBatchId: 'PB004', inspectorId: 'EMP007', inspectionDate: pastDate(12), ffaLevel: 5.8, moistureContent: 0.8, bruisingPercentage: 25, status: 'Failed', notes: 'High bruising and FFA levels.', createdAt: pastDate(12), updatedAt: pastDate(12) },
];

export const mockDistricts: District[] = [
  { id: 'DIST07', name: 'Warangal', code: 7, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'DIST10', name: 'Hanmakonda', code: 10, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'DIST35', name: 'Mulugu', code: 35, status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
];

export const mockMandals: Mandal[] = [
  { id: 'MAND0701', name: 'Warangal', districtId: 'DIST07', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'MAND0702', name: 'Geesugonda', districtId: 'DIST07', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'MAND1005', name: 'Hasanparthy', districtId: 'DIST10', code: '05', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'MAND3501', name: 'Mulugu', districtId: 'DIST35', code: '01', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'MAND3502', name: 'Govindaraopet', districtId: 'DIST35', code: '02', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'MAND3508', name: 'Eturnagaram', districtId: 'DIST35', code: '08', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
];

export const mockVillages: Village[] = [
  { id: 'VILL0701001', name: 'Kothawada', mandalId: 'MAND0701', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'VILL0702001', name: 'Gorrekunta', mandalId: 'MAND0702', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'VILL1005001', name: 'Hasanparthy', mandalId: 'MAND1005', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'VILL3501001', name: 'Mulugu', mandalId: 'MAND3501', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'VILL3502001', name: 'Govindaraopet', mandalId: 'MAND3502', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
  { id: 'VILL3508001', name: 'Eturnagaram', mandalId: 'MAND3508', code: '001', status: 'Active', createdAt: pastDate(365), updatedAt: pastDate(30) },
];

export const mockProcurementCenters: ProcurementCenter[] = [
    { id: 'PC001', name: 'Warangal Central PC', mandalId: 'MAND0701', managerId: 'EMP006', contactPerson: 'Kavita Rao', contactMobile: '9123456785', status: 'Active', latitude: 17.97, longitude: 79.6, createdAt: pastDate(200), updatedAt: pastDate(20) },
    { id: 'PC002', name: 'Mulugu Town PC', mandalId: 'MAND3501', managerId: 'EMP002', contactPerson: 'Sunita Sharma', contactMobile: '9123456781', status: 'Active', latitude: 18.18, longitude: 80.28, createdAt: pastDate(180), updatedAt: pastDate(18) },
];

export const mockFactories: Factory[] = [
    { id: 'FACT01', name: 'Mulugu Oil Factory', mandalId: 'MAND3501', managerId: 'EMP007', capacityTonsPerDay: 50, contactMobile: '9123456786', status: 'Active', latitude: 18.20, longitude: 80.30, createdAt: pastDate(300), updatedAt: pastDate(30) },
];

export const mockSubsidyApplications: SubsidyApplication[] = [
    { id: 'SUB001', farmerId: '0701001-24-0001', applicationDate: pastDate(20), subsidyType: 'Drip Irrigation', status: 'Under Review', requestedAmount: 50000, createdAt: pastDate(20), updatedAt: pastDate(5) },
    { id: 'SUB002', farmerId: '1005001-24-0001', applicationDate: pastDate(30), subsidyType: 'New Seedlings', status: 'Approved', requestedAmount: 25000, approvedAmount: 22000, createdAt: pastDate(30), updatedAt: pastDate(10) },
    { id: 'SUB003', farmerId: '3501008-24-0001', applicationDate: pastDate(15), subsidyType: 'Fertilizer', status: 'Documents Pending', requestedAmount: 10000, createdAt: pastDate(15), updatedAt: pastDate(15) },
];

export const mockDocuments: Document[] = [
    { id: 'DOC001', subsidyApplicationId: 'SUB001', documentType: 'Aadhaar Card', status: 'Verified', verifiedById: 'EMP008', verifiedAt: pastDate(8), createdAt: pastDate(20), updatedAt: pastDate(8) },
    { id: 'DOC002', subsidyApplicationId: 'SUB001', documentType: 'Land Record (Pattadar)', status: 'Pending', createdAt: pastDate(20), updatedAt: pastDate(20) },
    { id: 'DOC003', subsidyApplicationId: 'SUB003', documentType: 'Aadhaar Card', status: 'Pending', createdAt: pastDate(15), updatedAt: pastDate(15) },
];

export const mockInspections: Inspection[] = [
    { id: 'INSP001', relatedEntityType: 'SubsidyApplication', relatedEntityId: 'SUB001', inspectorId: 'EMP001', inspectionDate: pastDate(3), status: 'Scheduled', createdAt: pastDate(5), updatedAt: pastDate(5) },
    { id: 'INSP002', relatedEntityType: 'LandParcel', relatedEntityId: 'LP002', inspectorId: 'EMP003', inspectionDate: pastDate(10), status: 'Completed', outcome: 'Passed', reportUrl: '/reports/insp002.pdf', createdAt: pastDate(12), updatedAt: pastDate(10) },
];

export const mockOffices: Office[] = [];
export const mockHOSanctions: HOSanction[] = [
    { id: 'SAN001', sanctionType: 'High Value Subsidy', relatedEntityId: 'SUB002', amount: 22000, status: 'Approved', submittedById: 'EMP002', reviewedById: 'EMP005', createdAt: pastDate(11), updatedAt: pastDate(10) },
    { id: 'SAN002', sanctionType: 'Bulk Procurement Payment', relatedEntityId: 'PB002', amount: 37800, status: 'Pending Approval', submittedById: 'EMP004', createdAt: pastDate(7), updatedAt: pastDate(7) },
];

export const mockPlantationLogs: PlantationLog[] = [
    { id: 'PLOG001', farmerId: '0701001-24-0001', landParcelId: 'LP001', activityType: 'Fertilizing', activityDate: pastDate(15), materialsUsed: 'Urea', quantity: 50, unit: 'kg', cost: 1500, laborCount: 2, performedById: 'EMP001', createdAt: pastDate(15), updatedAt: pastDate(15) },
];
export const mockHarvestLogs: HarvestLog[] = [
    { id: 'HARV001', farmerId: '0701001-24-0001', landParcelId: 'LP001', harvestDate: pastDate(5), quantityTonnes: 1.25, qualityGrade: 'A', harvestedById: 'EMP001', createdAt: pastDate(5), updatedAt: pastDate(5) },
];
export const mockMicroIrrigationInstallations: MicroIrrigationInstallation[] = [
    { id: 'MI001', farmerId: '1005001-24-0001', landParcelId: 'LP004', subsidyApplicationId: 'SUB002', installationType: 'Drip', vendorName: 'Jain Irrigation', installationDate: pastDate(8), totalCost: 75000, subsidyAmount: 22000, status: 'Completed', inspectedById: 'EMP001', inspectionDate: pastDate(6), createdAt: pastDate(9), updatedAt: pastDate(6) },
];
export const mockNurseryInventory: NurseryInventoryItem[] = [
    { id: 'NINV001', name: 'Oil Palm Seedling (Tenera)', type: 'Seedling', quantity: 5000, unit: 'units', supplier: 'Govt. Nursery', purchaseDate: pastDate(45), costPerUnit: 150, createdAt: pastDate(45), updatedAt: pastDate(5) },
    { id: 'NINV002', name: 'NPK Fertilizer (19-19-19)', type: 'Fertilizer', quantity: 200, unit: 'bags (50kg)', supplier: 'Local Agro Agency', purchaseDate: pastDate(10), costPerUnit: 1200, createdAt: pastDate(10), updatedAt: pastDate(2) },
];
export const mockFactoryInventory: FactoryInventoryItem[] = [
    { id: 'FINV001', factoryId: 'FACT01', name: 'Raw FFB', type: 'Raw FFB', quantity: 250, unit: 'Tonnes', qualityGrade: 'B', storageLocation: 'Yard A', receivedDate: pastDate(2), createdAt: pastDate(2), updatedAt: pastDate(1) },
    { id: 'FINV002', factoryId: 'FACT01', name: 'Crude Palm Oil', type: 'Crude Palm Oil', quantity: 50, unit: 'Tonnes', storageLocation: 'Tank 2', receivedDate: pastDate(1), createdAt: pastDate(1), updatedAt: pastDate(1) },
];
export const mockProcurementCenterInventory: ProcurementCenterInventory[] = [
    { id: 'PCINV001', procurementCenterId: 'PC001', quantityTonnes: 120, averageQualityGrade: 'B', lastUpdated: pastDate(1), status: 'Awaiting Transport', createdAt: pastDate(1), updatedAt: pastDate(1) },
    { id: 'PCINV002', procurementCenterId: 'PC002', quantityTonnes: 85, averageQualityGrade: 'A', lastUpdated: pastDate(2), status: 'In Transit', createdAt: pastDate(2), updatedAt: pastDate(2) },
];

export const mockFarmVisitRequests: FarmVisitRequest[] = [
    { id: 'FVR001', farmerId: '3502001-24-0001', landParcelId: 'LP005', requestType: 'Pest/Disease Issue', urgency: 'Urgent', description: 'Seeing yellowing on leaves and some fruit rot.', requestDate: pastDate(2), status: 'Pending', createdAt: pastDate(2), updatedAt: pastDate(2) },
    { id: 'FVR002', farmerId: '0701001-24-0001', landParcelId: 'LP001', requestType: 'Harvesting Advice', urgency: 'Normal', description: 'Not sure if the current batch is ready for harvest.', requestDate: pastDate(8), status: 'Completed', assignedAgentId: 'EMP001', visitDate: pastDate(6), agentNotes: 'Advised farmer to wait one more week for optimal ripeness.', createdAt: pastDate(8), updatedAt: pastDate(6) },
];

export const mockEmployeeActivity: EmployeeActivity[] = [
    { id: 'ACT001', employeeId: 'EMP001', action: 'Completed Task', details: 'Field Visit to S. Kumar', timestamp: pastDate(1), icon: 'task' },
    { id: 'ACT002', employeeId: 'EMP008', action: 'Verified Document', details: 'Aadhaar for SUB001', timestamp: pastDate(2), icon: 'subsidy' },
    { id: 'ACT003', employeeId: 'EMP004', action: 'Processed Payment', details: '₹17,850 for PB003', timestamp: pastDate(3), icon: 'payment' },
    { id: 'ACT004', employeeId: 'EMP002', action: 'Updated Employee Record', details: 'Changed status for Priya Patel', timestamp: pastDate(4), icon: 'employee' },
];