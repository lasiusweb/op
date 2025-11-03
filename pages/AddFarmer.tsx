import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Farmer, LandParcel, District, Mandal, Village, Employee } from '../types';
import { mockDistricts, mockMandals, mockVillages, mockEmployees } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { UserCircleIcon, CameraIcon, ArrowUpTrayIcon, ExclamationCircleIcon } from '../components/Icons';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

// --- Cropping Utility Functions (adapted from react-easy-crop docs) ---

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg');
}


interface AddFarmerProps {
    onAddFarmer: (newFarmer: Farmer, newLandParcel: LandParcel) => void;
    onCancel: () => void;
    allFarmers: Farmer[];
}

// A more specific type for the errors state object
type FormErrors = { [key in keyof (Farmer & LandParcel)]?: string } & { [key: string]: string };

const labelMap: { [key: string]: string } = {
    districtId: "District",
    mandalId: "Mandal",
    villageId: "Village",
    fullName: "Full Name",
    fatherName: "Father's Name",
    mobile: "Mobile Number",
    aadhaar: "Aadhaar Number",
    dob: "Date of Birth",
    caste: "Caste",
    surveyNumber: "Survey Number",
    areaAcres: "Total Area",
    mlrdPlants: "MLRD Plants",
    fullCostPlants: "Full Cost Plants",
    bankName: "Bank Name",
    bankAccountNumber: "Account Number",
    ifscCode: "IFSC Code",
    assignedAgentId: "Assigned Agent",
};

const AddFarmer: React.FC<AddFarmerProps> = ({ onAddFarmer, onCancel, allFarmers }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({
        gender: 'Male',
        cropType: 'Oil Palm',
        accountVerified: false,
        photoUploaded: false,
        plantationType: 'Monocrop',
    });
    const [filteredMandals, setFilteredMandals] = useState<Mandal[]>([]);
    const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
    const [farmerId, setFarmerId] = useState('Select location to generate ID');
    const [plantAreaValidation, setPlantAreaValidation] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [photoError, setPhotoError] = useState<string | null>(null);

    // State for image cropping
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const TOTAL_STEPS = 6;
    const fieldAgents = useMemo(() => mockEmployees.filter(u => u.role === 'Field Agent'), []);

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

    // Auto-generate Farmer ID based on the format: [DistCode][MandalCode][VillageCode][YY][Seq]
    useEffect(() => {
        if (formData.districtId && formData.mandalId && formData.villageId) {
            const district = mockDistricts.find(d => d.id === formData.districtId);
            const mandal = mockMandals.find(m => m.id === formData.mandalId);
            const village = mockVillages.find(v => v.id === formData.villageId);

            if (district && mandal && village) {
                const year = new Date().getFullYear().toString().slice(-2);
                const distCode = district.code; // District code is a letter, no padding needed.
                const mandalCode = String(mandal.code).padStart(2, '0');
                const villageCode = String(village.code).padStart(2, '0');
                
                const idPrefix = `${distCode}${mandalCode}${villageCode}${year}`;
                const existingCount = allFarmers.filter(f => f.id.startsWith(idPrefix)).length;
                const seq = String(existingCount + 1).padStart(3, '0');
                
                setFarmerId(`${idPrefix}${seq}`);
            }
        } else {
            setFarmerId('Select location to generate ID');
        }
    }, [formData.districtId, formData.mandalId, formData.villageId, allFarmers]);


    const validateStep = (step: number) => {
        const newErrors: FormErrors = {};
        switch (step) {
            case 1:
                if (!formData.districtId) newErrors.districtId = "District is required.";
                if (!formData.mandalId) newErrors.mandalId = "Mandal is required.";
                if (!formData.villageId) newErrors.villageId = "Village is required.";
                if (farmerId.startsWith('Select')) newErrors.farmerId = "Please select a valid location to generate the Farmer ID.";
                break;
            case 2:
                if (!formData.fullName) newErrors.fullName = "Full name is required.";
                if (!formData.fatherName) newErrors.fatherName = "Father's name is required.";
                if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
                else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = "Must be a valid 10-digit Indian mobile number.";
                if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar number is required.";
                else if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = "Aadhaar must be 12 digits.";
                if (!formData.dob) newErrors.dob = "Date of birth is required.";
                else if (new Date(formData.dob) > new Date()) newErrors.dob = "Date of birth cannot be in the future.";
                if (!formData.caste) newErrors.caste = "Caste is required.";
                break;
            case 4:
                if (!formData.surveyNumber) newErrors.surveyNumber = "Survey number is required.";
                if (formData.areaAcres === undefined || formData.areaAcres === '') newErrors.areaAcres = "Area is required.";
                else if (Number(formData.areaAcres) <= 0) newErrors.areaAcres = "Area must be greater than 0.";
                if (formData.mlrdPlants === undefined || formData.mlrdPlants === '') newErrors.mlrdPlants = "MLRD plants count is required.";
                else if (Number(formData.mlrdPlants) < 0) newErrors.mlrdPlants = "Cannot be a negative number.";
                if (formData.fullCostPlants === undefined || formData.fullCostPlants === '') newErrors.fullCostPlants = "Full cost plants count is required.";
                else if (Number(formData.fullCostPlants) < 0) newErrors.fullCostPlants = "Cannot be a negative number.";
                break;
            case 5:
                if (!formData.bankName) newErrors.bankName = "Bank name is required.";
                if (!formData.bankAccountNumber) newErrors.bankAccountNumber = "Account number is required.";
                else if (!/^\d{9,18}$/.test(formData.bankAccountNumber)) newErrors.bankAccountNumber = "Account number must be between 9 and 18 digits.";
                if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required.";
                else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) newErrors.ifscCode = "Invalid IFSC code format (e.g., ABCD0123456).";
                if (!formData.assignedAgentId) newErrors.assignedAgentId = "An agent must be assigned.";
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

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const newFormData = { ...prev, [name]: value };

            if (name === 'mlrdPlants' || name === 'fullCostPlants') {
                const mlrd = Number(name === 'mlrdPlants' ? value : prev.mlrdPlants) || 0;
                const fullCost = Number(name === 'fullCostPlants' ? value : prev.fullCostPlants) || 0;
                newFormData.totalPlants = mlrd + fullCost;
            }
            
            return newFormData;
        });

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhotoError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setPhotoError('Invalid file type. Please select a JPG, PNG, or GIF.');
                return;
            }
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSizeInBytes) {
                setPhotoError('File is too large. Maximum size is 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const openCamera = async () => {
        setIsCameraOpen(true);
        setIsCameraLoading(true);
        setPhotoError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setIsCameraLoading(false);
                };
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            setPhotoError("Could not access camera. Please ensure permissions are granted.");
            setIsCameraOpen(false);
            setIsCameraLoading(false);
        }
    };
    
    const closeCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        setIsCameraLoading(false);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImageToCrop(dataUrl);
                closeCamera();
            }
        }
    };
    
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        if (!imageToCrop || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (croppedImage) {
                setPhotoUrl(croppedImage);
                setFormData((prev: any) => ({ ...prev, photoUploaded: true }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setImageToCrop(null);
        }
    }, [imageToCrop, croppedAreaPixels]);

    const onCropCancel = () => {
        setImageToCrop(null);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // One final validation of all fields before submitting
        const allFieldNames = [
            ...Object.keys(labelMap),
            ...Object.keys(formData)
        ];
        const finalErrors: FormErrors = {};
        allFieldNames.forEach(key => {
            const step1Errors = validateStep(1);
            const step2Errors = validateStep(2);
            const step4Errors = validateStep(4);
            const step5Errors = validateStep(5);
            Object.assign(finalErrors, step1Errors, step2Errors, step4Errors, step5Errors);
        });

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            // Find the first step with an error and navigate to it
            if (finalErrors.districtId || finalErrors.mandalId || finalErrors.villageId) setCurrentStep(1);
            else if (finalErrors.fullName || finalErrors.fatherName || finalErrors.mobile || finalErrors.aadhaar || finalErrors.dob || finalErrors.caste) setCurrentStep(2);
            else if (finalErrors.surveyNumber || finalErrors.areaAcres || finalErrors.mlrdPlants || finalErrors.fullCostPlants) setCurrentStep(4);
            else if (finalErrors.bankName || finalErrors.bankAccountNumber || finalErrors.ifscCode || finalErrors.assignedAgentId) setCurrentStep(5);
            return;
        }

        const now = new Date().toISOString();
        const selectedDistrict = mockDistricts.find(d => d.id === formData.districtId);
        const selectedMandal = mockMandals.find(m => m.id === formData.mandalId);
        const selectedVillage = mockVillages.find(v => v.id === formData.villageId);

        const newFarmer: Farmer = {
            id: farmerId,
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
            photoUploaded: !!photoUrl,
            photoUrl: photoUrl || undefined,
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

    const FormInput = ({ name, label, required = false, type = 'text', children, readOnly = false, value, error }: any) => {
        const commonClasses = "w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1";
        const errorClasses = "border-red-500 focus:ring-red-500";
        const normalClasses = "border-gray-600 focus:ring-teal-500";
        const readOnlyClasses = "bg-gray-800/50 text-gray-400 cursor-not-allowed";
        const disabledClasses = "disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400";
    
        const finalClassName = `${commonClasses} ${error ? errorClasses : normalClasses} ${readOnly ? readOnlyClasses : ''}`;
        
        const childWithProps = children ? React.cloneElement(children, {
            className: `${finalClassName} ${disabledClasses}`,
            id: name,
            name: name,
            value: formData[name] || '',
            onChange: handleChange,
            required: required,
        }) : null;
    
        return (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {children ? childWithProps : 
                <input 
                    type={type} 
                    id={name} 
                    name={name} 
                    value={value || formData[name] || ''} 
                    onChange={handleChange} 
                    required={required} 
                    readOnly={readOnly} 
                    className={finalClassName} 
                />
            }
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    )};

    const CameraModal = () => (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-center items-center p-4">
            {isCameraLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                    <p className="text-white mt-4">Starting camera...</p>
                </div>
            )}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`w-full max-w-lg h-auto rounded-lg mb-4 border-2 border-gray-600 transition-opacity duration-300 ${isCameraLoading ? 'opacity-0' : 'opacity-100'}`}
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className={`flex gap-4 transition-opacity duration-300 ${isCameraLoading ? 'opacity-0' : 'opacity-100'}`}>
                <button type="button" onClick={handleCapture} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md">Capture</button>
                <button type="button" onClick={closeCamera} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">Cancel</button>
            </div>
        </div>
    );
    
    const ImageCropperModal = () => (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col justify-center items-center p-4">
            <div className="relative w-full max-w-lg h-96 mb-4 bg-gray-900 rounded-lg">
                <Cropper
                    image={imageToCrop!}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="w-full max-w-lg">
                <label htmlFor="zoom-slider" className="text-white text-sm">Zoom</label>
                <input
                    id="zoom-slider"
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div className="flex gap-4 mt-6">
                <button type="button" onClick={onCropCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">Cancel</button>
                <button type="button" onClick={showCroppedImage} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md">Save Crop</button>
            </div>
        </div>
    );

    const StepIndicator = () => {
        const steps = [
            "Location", "Personal Info", "Photo", "Land Details", "Bank & Assignment", "Review"
        ];
        return (
            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0 mb-8">
                    {steps.map((stepName, stepIdx) => (
                        <li key={stepName} className="md:flex-1">
                            {stepIdx < currentStep ? (
                                <div className="group flex w-full flex-col border-l-4 border-teal-500 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                                    <span className="text-sm font-medium text-teal-500 transition-colors ">{`Step ${stepIdx + 1}`}</span>
                                    <span className="text-sm font-medium text-gray-300">{stepName}</span>
                                </div>
                            ) : stepIdx === currentStep - 1 ? (
                                <div className="flex w-full flex-col border-l-4 border-teal-500 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                                    <span className="text-sm font-medium text-teal-500">{`Step ${stepIdx + 1}`}</span>
                                    <span className="text-sm font-medium text-white">{stepName}</span>
                                </div>
                            ) : (
                                <div className="group flex w-full flex-col border-l-4 border-gray-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                                    <span className="text-sm font-medium text-gray-500 transition-colors">{`Step ${stepIdx + 1}`}</span>
                                    <span className="text-sm font-medium text-gray-500">{stepName}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        );
    };

    return (
        <DashboardCard title="New Farmer Registration">
            {isCameraOpen && <CameraModal />}
            {imageToCrop && <ImageCropperModal />}
            
            <StepIndicator />

            <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 1 && (
                     <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Location & ID Generation</legend>
                        <FormInput name="districtId" label="District" required error={errors.districtId}>
                            <select><option value="">-- Select District --</option>{mockDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                        </FormInput>
                        <FormInput name="mandalId" label="Mandal" required error={errors.mandalId}>
                            <select disabled={!formData.districtId}><option value="">-- Select Mandal --</option>{filteredMandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                        </FormInput>
                        <FormInput name="villageId" label="Village" required error={errors.villageId}>
                            <select disabled={!formData.mandalId}><option value="">-- Select Village --</option>{filteredVillages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
                        </FormInput>
                        <FormInput name="farmerId" label="Generated Farmer ID" readOnly value={farmerId} type="text" error={errors.farmerId}/>
                    </fieldset>
                )}

                {currentStep === 2 && (
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Personal Information</legend>
                        <FormInput name="fullName" label="Full Name" required error={errors.fullName} />
                        <FormInput name="fatherName" label="Father's Name" required error={errors.fatherName} />
                        <FormInput name="mobile" label="Mobile Number" required type="tel" error={errors.mobile} />
                        <FormInput name="aadhaar" label="Aadhaar Number" required error={errors.aadhaar} />
                        <FormInput name="dob" label="Date of Birth" required type="date" error={errors.dob} />
                        <FormInput name="gender" label="Gender" error={errors.gender}><select><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></FormInput>
                        <FormInput name="caste" label="Caste" required error={errors.caste}><select><option value="">-- Select Caste --</option><option>BC</option><option>OC</option><option>SC</option><option>ST</option></select></FormInput>
                    </fieldset>
                )}
                
                {currentStep === 3 && (
                    <fieldset>
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Farmer Photo</legend>
                        <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                            <div className="flex-shrink-0">
                                {photoUrl ? (<img src={photoUrl} alt="Farmer preview" className="h-40 w-40 rounded-full object-cover border-4 border-gray-600" />) 
                                : (<div className="h-40 w-40 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600"><UserCircleIcon className="h-32 w-32 text-gray-500" /></div>)}
                            </div>
                            <div className="flex flex-col gap-4">
                                <input type="file" accept="image/jpeg,image/png,image/gif" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                <button type="button" onClick={handleUploadClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"><ArrowUpTrayIcon className="h-5 w-5"/> Upload Photo</button>
                                <button type="button" onClick={openCamera} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"><CameraIcon className="h-5 w-5"/> Take Photo</button>
                                {photoError && <p className="text-red-400 text-xs">{photoError}</p>}
                                <p className="text-xs text-gray-400">Upload or take a recent, clear photo of the farmer. (Max 5MB)</p>
                            </div>
                        </div>
                    </fieldset>
                )}

                {currentStep === 4 && (
                     <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Plantation & Land Details</legend>
                        <FormInput name="surveyNumber" label="Survey Number" required error={errors.surveyNumber}/>
                        <FormInput name="areaAcres" label="Total Area (in Acres)" required type="number" error={errors.areaAcres} />
                        <FormInput name="mlrdPlants" label="MLRD Plants" required type="number" error={errors.mlrdPlants} />
                        <FormInput name="fullCostPlants" label="Full Cost Plants" required type="number" error={errors.fullCostPlants} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Total Plants</label>
                            <input type="text" value={formData.totalPlants || 0} readOnly className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-gray-300 cursor-not-allowed" />
                            {plantAreaValidation && (<p className="text-yellow-400 text-xs mt-1">{plantAreaValidation}</p>)}
                        </div>
                        <FormInput name="plantationType" label="Plantation Type" error={errors.plantationType}><select><option>Monocrop</option><option>Intercrop</option></select></FormInput>
                    </fieldset>
                )}

                {currentStep === 5 && (
                    <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Bank & Assignment</legend>
                        <FormInput name="bankName" label="Bank Name" required error={errors.bankName} />
                        <FormInput name="bankAccountNumber" label="Account Number" required error={errors.bankAccountNumber} />
                        <FormInput name="ifscCode" label="IFSC Code" required error={errors.ifscCode} />
                        <div className="md:col-span-3">
                            <FormInput name="assignedAgentId" label="Assign Field Agent" required error={errors.assignedAgentId}>
                                <select><option value="">-- Select Agent --</option>{fieldAgents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}</select>
                            </FormInput>
                        </div>
                    </fieldset>
                )}
                
                {currentStep === 6 && (
                    <div>
                        <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Review & Submit</legend>
                        <div className="bg-gray-900/50 p-6 rounded-lg space-y-4">
                            <h3 className="text-xl font-bold text-white">{formData.fullName}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <p><strong className="text-gray-400 block">Farmer ID:</strong> {farmerId}</p>
                                <p><strong className="text-gray-400 block">Mobile:</strong> {formData.mobile}</p>
                                <p><strong className="text-gray-400 block">Location:</strong> {mockVillages.find(v => v.id === formData.villageId)?.name}, {mockMandals.find(m => m.id === formData.mandalId)?.name}</p>
                                <p><strong className="text-gray-400 block">Survey No:</strong> {formData.surveyNumber}</p>
                                <p><strong className="text-gray-400 block">Area:</strong> {formData.areaAcres} Acres</p>
                                <p><strong className="text-gray-400 block">Total Plants:</strong> {formData.totalPlants}</p>
                                <p><strong className="text-gray-400 block">Assigned Agent:</strong> {mockEmployees.find(u => u.id === formData.assignedAgentId)?.fullName}</p>
                            </div>
                             {Object.keys(errors).length > 0 && (
                                <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                                    <p><strong>Warning:</strong> Some fields have errors. Please go back and correct them.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between gap-4 pt-4">
                    <button type="button" onClick={currentStep === 1 ? onCancel : handlePrevious} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">
                        {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </button>
                    {currentStep < TOTAL_STEPS ? (
                        <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Next</button>
                    ) : (
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Farmer</button>
                    )}
                </div>
            </form>
        </DashboardCard>
    );
};

export default AddFarmer;
