import React, { useState, useEffect } from 'react';
import type { Employee, EmployeeRole } from '../types';
import { mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';

// --- PROPS ---
interface AddEmployeeProps {
    onAddEmployee: (newEmployee: Employee) => void;
    onCancel: () => void;
    allEmployees: Employee[];
}

// --- STATIC DATA ---
const jobLocations = ["Andaman and Nicobar Islands (India)", "Andhra Pradesh (India)", "Arunachal Pradesh (India)", "Assam (India)", "Bihar (India)", "Chandigarh (India)", "Chhattisgarh (India)", "Dadra and Nagar Haveli (India)", "Daman and Diu (India)", "Delhi (India)", "Goa (India)", "Gujarat (India)", "Haryana (India)", "Himachal Pradesh (India)", "Jammu and Kashmir (India)", "Jharkhand (India)", "Karnataka (India)", "Kerala (India)", "Lakshadweep (India)", "Madhya Pradesh (India)", "Maharashtra (India)", "Manipur (India)", "Meghalaya (India)", "Mizoram (India)", "Nagaland (India)", "Odisha (India)", "Pondicherry (India)", "Punjab (India)", "Rajasthan (India)", "Sikkim (India)", "Tamil Nadu (India)", "Telangana (India)", "Tripura (India)", "Uttar Pradesh (India)", "Uttarakhand (India)", "West Bengal (India)", "Kinshasa (Congo The Democratic Republic Of The)", "Kongo Central (Congo The Democratic Republic Of The)", "Kwango (Congo The Democratic Republic Of The)", "Kwilu (Congo The Democratic Republic Of The)", "Mai-Ndombe (Congo The Democratic Republic Of The)", "Kasaï (Congo The Democratic Republic Of The)", "Kasaï-Central (Congo The Democratic Republic Of The)", "Kasaï-Oriental (Congo The Democratic Republic Of The)", "Lomami (Congo The Democratic Republic Of The)", "Sankuru (Congo The Democratic Republic Of The)", "Maniema (Congo The Democratic Republic Of The)", "South Kivu (Congo The Democratic Republic Of The)", "North Kivu (Congo The Democratic Republic Of The)", "Ituri (Congo The Democratic Republic Of The)", "Haut-Uele (Congo The Democratic Republic Of The)", "Tshopo (Congo The Democratic Republic Of The)", "Bas-Uele (Congo The Democratic Republic Of The)", "Nord-Ubangi (Congo The Democratic Republic Of The)", "Mongala (Congo The Democratic Republic Of The)", "Sud-Ubangi (Congo The Democratic Republic Of The)", "Équateur (Congo The Democratic Republic Of The)", "Tshuapa (Congo The Democratic Republic Of The)", "Tanganyika (Congo The Democratic Republic Of The)", "Haut-Lomami (Congo The Democratic Republic Of The)", "Lualaba (Congo The Democratic Republic Of The)", "Haut-Katanga (Congo The Democratic Republic Of The)"];
const roles: EmployeeRole[] = ['Field Agent', 'Mandal Coordinator', 'Reviewer', 'Accountant', 'Procurement Center Manager', 'Factory Manager', 'HR Manager', 'IT Support', 'Admin'];

type FormErrors = { [key in keyof Partial<Employee>]?: string } & { [key: string]: string };

const AddEmployee: React.FC<AddEmployeeProps> = ({ onAddEmployee, onCancel, allEmployees }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Employee>>({
        countryCode: '+91',
        gender: 'Male',
        employmentType: 'Permanent',
    });
    const [employeeId, setEmployeeId] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const TOTAL_STEPS = 5;

    useEffect(() => {
        const nextIdNumber = allEmployees.length + 1;
        setEmployeeId(`EMP${String(nextIdNumber).padStart(3, '0')}`);
    }, [allEmployees]);
    
    const validateStep = (step: number) => {
        const newErrors: FormErrors = {};
        switch (step) {
            case 1:
                if (!formData.role) newErrors.role = "Designation is required.";
                if (!formData.region) newErrors.region = "Branch is required.";
                if (!formData.department) newErrors.department = "Department is required.";
                break;
            case 2:
                if (!formData.firstName) newErrors.firstName = "First name is required.";
                if (!formData.lastName) newErrors.lastName = "Last name is required.";
                if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
                else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = "Must be a valid 10-digit Indian mobile number.";
                if (!formData.dob) newErrors.dob = "Date of birth is required.";
                else if (new Date(formData.dob) > new Date()) newErrors.dob = "Date of birth cannot be in the future.";
                break;
            case 3:
                if (!formData.joiningDate) newErrors.joiningDate = "Date of joining is required.";
                if (formData.probationPeriodDays !== undefined && formData.probationPeriodDays < 0) newErrors.probationPeriodDays = "Probation period cannot be negative.";
                break;
            case 4:
                // No required fields in this step
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Run all validations before submitting
        const step1Valid = validateStep(1);
        const step2Valid = validateStep(2);
        const step3Valid = validateStep(3);

        if (!step1Valid) { setCurrentStep(1); return; }
        if (!step2Valid) { setCurrentStep(2); return; }
        if (!step3Valid) { setCurrentStep(3); return; }

        const now = new Date().toISOString();
        const newEmployee: Employee = {
            id: employeeId,
            fullName: `${formData.firstName} ${formData.lastName}`,
            status: 'Active',
            createdAt: now,
            updatedAt: now,
            ...formData,
        } as Employee;
        onAddEmployee(newEmployee);
    };

    const FormInput = ({ name, label, required = false, type = 'text', children, error }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400">*</span>}</label>
            {children ? 
                React.cloneElement(children, {
                    id: name, name: name, value: formData[name] || '', onChange: handleChange, required,
                    className: `w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-teal-500'}`
                }) : 
                <input type={type} id={name} name={name} value={formData[name] || ''} onChange={handleChange} required={required} className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-teal-500'}`} />
            }
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );

    const StepIndicator = () => {
        const steps = ["Organizational", "Personal", "Employment", "Other Details", "Review"];
        return (
            <nav className="mb-8"><ol className="flex items-center justify-center space-x-2 sm:space-x-4">
                {steps.map((stepName, i) => {
                    const stepNum = i + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    return (
                        <li key={stepNum} className="flex items-center text-sm font-medium">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrent ? 'bg-teal-500 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>{isCompleted ? '✓' : stepNum}</span>
                            <span className={`hidden sm:inline ml-2 ${isCurrent ? 'text-white' : 'text-gray-400'}`}>{stepName}</span>
                            {stepNum < TOTAL_STEPS && <div className="hidden sm:block w-8 h-px bg-gray-600 ml-4"></div>}
                        </li>
                    );
                })}
            </ol></nav>
        );
    };

    const ReviewDetail: React.FC<{ label: string, value?: string | number }> = ({ label, value }) => (
        value ? <div><p className="text-xs text-gray-400 uppercase">{label}</p><p className="font-medium text-white">{String(value)}</p></div> : null
    );

    return (
        <DashboardCard title="New Employee Registration">
            <StepIndicator />
            <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 1 && <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6"><legend className="sr-only">Organizational Details</legend>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Employee ID</label><input type="text" value={employeeId} readOnly className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-gray-400" /></div>
                    <FormInput name="role" label="Designation" required error={errors.role}><select><option value="">-- Select --</option>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></FormInput>
                    <FormInput name="region" label="Branch" required error={errors.region} />
                    <FormInput name="department" label="Department" required error={errors.department} />
                    <FormInput name="subDepartment" label="Sub Department" />
                    <FormInput name="grade" label="Grade" />
                    <FormInput name="shift" label="Shift" />
                </fieldset>}

                {currentStep === 2 && <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6"><legend className="sr-only">Personal Details</legend>
                    <FormInput name="firstName" label="First Name" required error={errors.firstName} />
                    <FormInput name="lastName" label="Last Name" required error={errors.lastName} />
                    <FormInput name="aliasName" label="Alias Name" />
                    <div className="grid grid-cols-3 gap-2"><div className="col-span-1"><FormInput name="countryCode" label="Code" /></div><div className="col-span-2"><FormInput name="mobile" label="Mobile No." required error={errors.mobile} /></div></div>
                    <FormInput name="dob" label="Date of Birth" required type="date" error={errors.dob} />
                    <FormInput name="email" label="Email ID" type="email" />
                    <FormInput name="gender" label="Gender"><select><option>Male</option><option>Female</option><option>Other</option></select></FormInput>
                </fieldset>}

                {currentStep === 3 && <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6"><legend className="sr-only">Employment Details</legend>
                    <FormInput name="joiningDate" label="Date of Joining" required type="date" error={errors.joiningDate} />
                    <FormInput name="probationPeriodDays" label="Probation Period (Days)" type="number" error={errors.probationPeriodDays} />
                    <FormInput name="trainingCompletionDate" label="Training Completion Date" type="date" />
                    <FormInput name="dateOfPermanentEmployee" label="Date of Permanent Employment" type="date" />
                    <FormInput name="employmentType" label="Employment Type"><select><option>Permanent</option><option>Contract</option><option>Internship</option></select></FormInput>
                    <FormInput name="jobLocation" label="Job Location"><select><option value="">-- Select --</option>{jobLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></FormInput>
                    <FormInput name="reportingManagerId" label="Reporting Person"><select><option value="">-- Select Manager --</option>{allEmployees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}</select></FormInput>
                </fieldset>}
                
                {currentStep === 4 && <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6"><legend className="sr-only">Other Details</legend>
                    <FormInput name="insuranceNumber" label="Insurance Number" />
                    <FormInput name="insuranceCompany" label="Insurance Company Name" />
                    <FormInput name="insuranceExpiryDate" label="Insurance Expiry Date" type="date" />
                    <FormInput name="retirementAge" label="Retirement Age" type="number" />
                    <FormInput name="idProof" label="ID Proof (e.g., Aadhaar No.)" />
                </fieldset>}
                
                {currentStep === 5 && <div><h3 className="text-xl font-bold text-white mb-4">Review Details</h3>
                    <div className="bg-gray-900/50 p-6 rounded-lg space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><ReviewDetail label="Employee ID" value={employeeId} /><ReviewDetail label="Full Name" value={`${formData.firstName} ${formData.lastName}`} /><ReviewDetail label="Designation" value={formData.role} /><ReviewDetail label="Department" value={formData.department} /></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><ReviewDetail label="Mobile" value={`${formData.countryCode} ${formData.mobile}`} /><ReviewDetail label="Email" value={formData.email} /><ReviewDetail label="Gender" value={formData.gender} /><ReviewDetail label="Date of Birth" value={formData.dob} /></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><ReviewDetail label="Joining Date" value={formData.joiningDate} /><ReviewDetail label="Employment Type" value={formData.employmentType} /><ReviewDetail label="Job Location" value={formData.jobLocation} /><ReviewDetail label="Reporting To" value={allEmployees.find(e=>e.id === formData.reportingManagerId)?.fullName} /></div>
                    </div>
                </div>}

                <div className="flex justify-between gap-4 pt-4 border-t border-gray-700/50">
                    <button type="button" onClick={currentStep === 1 ? onCancel : handlePrevious} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">{currentStep === 1 ? 'Cancel' : 'Previous'}</button>
                    {currentStep < TOTAL_STEPS ? <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md">Next</button>
                    : <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md">Submit Registration</button>}
                </div>
            </form>
        </DashboardCard>
    );
};

export default AddEmployee;