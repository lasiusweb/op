import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Farmer, LandParcel, District, Mandal, Village, User } from '../types';
import { mockDistricts, mockMandals, mockVillages, mockUsers } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';

interface AddFarmerProps {
    onAddFarmer: (newFarmer: Farmer, newLandParcel: LandParcel) => void;
    onCancel: () => void;
    allFarmers: Farmer[];
}

const AddFarmer: React.FC<AddFarmerProps> = ({ onAddFarmer, onCancel, allFarmers }) => {
    const [formData, setFormData] = useState<any>({
        gender: 'Male',
        cropType: 'Oil Palm',
        accountVerified: false,
        photoUploaded: false,
        caste: 'BC',
        plantationType: 'Monocrop',
    });
    const [filteredMandals, setFilteredMandals] = useState<Mandal[]>([]);
    const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
    const [farmerCode, setFarmerCode] = useState('Select location to generate code');
    const [plantAreaValidation, setPlantAreaValidation] = useState('');


    const fieldAgents = useMemo(() => mockUsers.filter(u => u.role === 'Field Agent'), []);

    // Handle location dropdown filtering
    useEffect(() => {
        if (formData.districtId) {
            setFilteredMandals(mockMandals.filter(m => m.districtId === formData.districtId));
            setFormData((f: any) => ({ ...f, mandalId: '', villageId: '' }));
            setFilteredVillages([]);
        } else {
            setFilteredMandals([]);
        }
    }, [formData.districtId]);

    useEffect(() => {
        if (formData.mandalId) {
            setFilteredVillages(mockVillages.filter(v => v.mandalId === formData.mandalId));
            setFormData((f: any) => ({ ...f, villageId: '' }));
        } else {
            setFilteredVillages([]);
        }
    }, [formData.mandalId]);
    
    // Auto-calculate Total Plants
    useEffect(() => {
        const mlrd = Number(formData.mlrdPlants) || 0;
        const fullCost = Number(formData.fullCostPlants) || 0;
        setFormData((f: any) => ({ ...f, totalPlants: mlrd + fullCost }));
    }, [formData.mlrdPlants, formData.fullCostPlants]);

    // Plant-to-area validation
    useEffect(() => {
        const area = Number(formData.areaAcres) || 0;
        const totalPlants = Number(formData.totalPlants) || 0;

        if (area > 0 && totalPlants > 0) {
            const expectedPlants = area * 57;
            const lowerBound = expectedPlants - 5;
            const upperBound = expectedPlants + 5;

            if (totalPlants < lowerBound || totalPlants > upperBound) {
                setPlantAreaValidation(`Warning: For ${area} acres, the expected number of plants is around ${Math.round(expectedPlants)}. The current total of ${totalPlants} is outside the typical range.`);
            } else {
                setPlantAreaValidation('');
            }
        } else {
            setPlantAreaValidation('');
        }
    }, [formData.areaAcres, formData.totalPlants]);

    // Auto-generate Farmer Code
    useEffect(() => {
        if (formData.districtId && formData.mandalId && formData.villageId) {
            const district = mockDistricts.find(d => d.id === formData.districtId);
            const mandal = mockMandals.find(m => m.id === formData.mandalId);
            const village = mockVillages.find(v => v.id === formData.villageId);

            if (district && mandal && village) {
                const year = new Date().getFullYear().toString().slice(-2);
                const distCode = String(district.code).padStart(2, '0');
                const mandalCode = String(mandal.code).padStart(2, '0');
                const villageCode = String(village.code).padStart(3, '0');
                const locationCode = `${distCode}${mandalCode}${villageCode}`;
                
                const existingCount = allFarmers.filter(f => f.id.startsWith(`KN-OP-${locationCode}-${year}`)).length;
                const seq = String(existingCount + 1).padStart(4, '0');
                
                setFarmerCode(`KN-OP-${locationCode}-${year}-${seq}`);
            }
        } else {
            setFarmerCode('Select location to generate code');
        }
    }, [formData.districtId, formData.mandalId, formData.villageId, allFarmers]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (farmerCode.startsWith('Select')) {
            alert('Please select a valid location to generate the Farmer Code.');
            return;
        }

        const now = new Date().toISOString();
        const selectedDistrict = mockDistricts.find(d => d.id === formData.districtId);
        const selectedMandal = mockMandals.find(m => m.id === formData.mandalId);
        const selectedVillage = mockVillages.find(v => v.id === formData.villageId);

        const newFarmer: Farmer = {
            id: farmerCode,
            fullName: formData.fullName,
            fatherName: formData.fatherName,
            mobile: formData.mobile,
            aadhaar: formData.aadhaar,
            village: selectedVillage?.name || '',
            mandal: selectedMandal?.name || '',
            district: selectedDistrict?.name || '',
            status: 'Active',
            gender: formData.gender,
            dob: formData.dob,
            bankName: formData.bankName,
            bankAccountNumber: formData.bankAccountNumber,
            ifscCode: formData.ifscCode,
            cropType: formData.cropType,
            accountVerified: false,
            photoUploaded: false,
            remarks: null,
            assignedAgentId: formData.assignedAgentId,
            createdAt: now,
            updatedAt: now,
        };
        
        const newLandParcel: LandParcel = {
            id: `LP${Date.now()}`,
            farmerId: newFarmer.id,
            surveyNumber: formData.surveyNumber,
            areaAcres: Number(formData.areaAcres),
            soilType: '', // Not in form, can be added
            irrigationSource: 'Borewell', // Default, can be added to form
            latitude: 0,
            longitude: 0,
            status: 'Active',
            createdAt: now,
            updatedAt: now,
        };

        onAddFarmer(newFarmer, newLandParcel);
    };

    const FormInput = ({ name, label, required = false, type = 'text', children }: any) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {children ? children : 
                <input type={type} id={name} name={name} value={formData[name] || ''} onChange={handleChange} required={required} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500" />
            }
        </div>
    );

    return (
        <DashboardCard title="New Farmer Registration">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-300">Farmer Code</h3>
                    <p className="font-mono text-xl text-teal-400 bg-gray-900 px-4 py-2 rounded-md">{farmerCode}</p>
                </div>

                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Location Details</legend>
                    <FormInput name="districtId" label="District" required>
                        <select id="districtId" name="districtId" value={formData.districtId || ''} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="">-- Select District --</option>
                            {mockDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </FormInput>
                    <FormInput name="mandalId" label="Mandal" required>
                        <select id="mandalId" name="mandalId" value={formData.mandalId || ''} onChange={handleChange} required disabled={!formData.districtId} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-800">
                            <option value="">-- Select Mandal --</option>
                            {filteredMandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </FormInput>
                    <FormInput name="villageId" label="Village" required>
                         <select id="villageId" name="villageId" value={formData.villageId || ''} onChange={handleChange} required disabled={!formData.mandalId} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-800">
                            <option value="">-- Select Village --</option>
                            {filteredVillages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </FormInput>
                </fieldset>

                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Personal Information</legend>
                    <FormInput name="fullName" label="Full Name" required />
                    <FormInput name="fatherName" label="Father's Name" required />
                    <FormInput name="mobile" label="Mobile Number" required type="tel" />
                    <FormInput name="aadhaar" label="Aadhaar Number" required />
                    <FormInput name="dob" label="Date of Birth" required type="date" />
                    <FormInput name="gender" label="Gender">
                         <select id="gender" name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </FormInput>
                    <FormInput name="caste" label="Caste">
                         <select id="caste" name="caste" value={formData.caste || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="BC">BC</option><option value="OC">OC</option><option value="SC">SC</option><option value="ST">ST</option>
                        </select>
                    </FormInput>
                </fieldset>

                 <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Plantation & Land Details</legend>
                    <FormInput name="surveyNumber" label="Survey Number" required/>
                    <FormInput name="areaAcres" label="Total Area (in Acres)" required type="number" />
                    <FormInput name="mlrdPlants" label="MLRD Plants" required type="number" />
                    <FormInput name="fullCostPlants" label="Full Cost Plants" required type="number" />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Total Plants</label>
                        <input type="text" value={formData.totalPlants || 0} readOnly className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-gray-300" />
                        {plantAreaValidation && (
                            <p className="text-yellow-400 text-xs mt-1">{plantAreaValidation}</p>
                        )}
                    </div>
                     <FormInput name="plantationType" label="Plantation Type">
                         <select id="plantationType" name="plantationType" value={formData.plantationType || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option>Monocrop</option><option>Intercrop</option>
                        </select>
                    </FormInput>
                </fieldset>

                <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Bank Information</legend>
                    <FormInput name="bankName" label="Bank Name" required />
                    <FormInput name="bankAccountNumber" label="Account Number" required />
                    <FormInput name="ifscCode" label="IFSC Code" required />
                </fieldset>

                <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Assignment</legend>
                     <FormInput name="assignedAgentId" label="Assign Field Agent" required>
                         <select id="assignedAgentId" name="assignedAgentId" value={formData.assignedAgentId || ''} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="">-- Select Agent --</option>
                            {fieldAgents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                        </select>
                    </FormInput>
                </fieldset>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Farmer</button>
                </div>
            </form>
        </DashboardCard>
    );
};

export default AddFarmer;