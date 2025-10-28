import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Farmer, LandParcel, District, Mandal, Village, User } from '../types';
import { mockDistricts, mockMandals, mockVillages, mockUsers } from '../data/mockData';
import DashboardCard from '../components/DashboardCard';
import { UserCircleIcon, CameraIcon, ArrowUpTrayIcon } from '../components/Icons';
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
    const [farmerId, setFarmerId] = useState('Select location to generate ID');
    const [plantAreaValidation, setPlantAreaValidation] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [errors, setErrors] = useState<{ mobile?: string }>({});

    // State for image cropping
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


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

    // Auto-generate Farmer ID based on a robust, location-based pattern.
    // Pattern: DD-MM-VVV-YY-SSSS (District-Mandal-Village-Year-Sequence)
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
                
                // Create a structured, human-readable location code.
                const locationCode = `${distCode}-${mandalCode}-${villageCode}`;
                
                // Ensure uniqueness for the current year and location by checking existing records.
                // This creates a simple sequential ID for new farmers in the same location/year.
                const idPrefix = `${locationCode}-${year}`;
                const existingCount = allFarmers.filter(f => f.id.startsWith(idPrefix)).length;
                const seq = String(existingCount + 1).padStart(4, '0');
                
                setFarmerId(`${idPrefix}-${seq}`);
            }
        } else {
            setFarmerId('Select location to generate ID');
        }
    }, [formData.districtId, formData.mandalId, formData.villageId, allFarmers]);


    // Validation function for mobile number
    const validateMobileNumber = (mobile: string): string => {
        if (!mobile) return ""; // Let required attribute handle empty
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return "Must be a valid 10-digit Indian mobile number.";
        }
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        if (name === 'mobile') {
            const error = validateMobileNumber(value);
            setErrors(prev => ({ ...prev, mobile: error }));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
            alert("Could not access the camera. Please ensure you have given permission.");
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

        // Final validation check before submitting
        const mobileError = validateMobileNumber(formData.mobile || '');
        if (mobileError) {
            setErrors({ mobile: mobileError });
            alert(`Validation Error: ${mobileError}`);
            return;
        }

        if (farmerId.startsWith('Select')) {
            alert('Please select a valid location to generate the Farmer ID.');
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

    const FormInput = ({ name, label, required = false, type = 'text', children, readOnly = false, value }: any) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {children ? children : 
                <input type={type} id={name} name={name} value={value || formData[name] || ''} onChange={handleChange} required={required} readOnly={readOnly} className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 ${readOnly ? 'bg-gray-800/50 text-gray-400' : ''}`} />
            }
        </div>
    );

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


    return (
        <DashboardCard title="New Farmer Registration">
            {isCameraOpen && <CameraModal />}
            {imageToCrop && <ImageCropperModal />}
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Location & ID Generation</legend>
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
                     <FormInput name="farmerId" label="Generated Farmer ID" readOnly value={farmerId}>
                        <input
                            type="text"
                            id="farmerId"
                            name="farmerId"
                            value={farmerId}
                            readOnly
                            className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-teal-400 font-mono focus:outline-none"
                        />
                    </FormInput>
                </fieldset>

                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Personal Information</legend>
                    <FormInput name="fullName" label="Full Name" required />
                    <FormInput name="fatherName" label="Father's Name" required />
                    <FormInput name="mobile" label="Mobile Number" required type="tel">
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile || ''}
                            onChange={handleChange}
                            required
                            maxLength={10}
                            className={`w-full bg-gray-700 border ${errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-teal-500'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1`}
                        />
                        {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                    </FormInput>
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

                <fieldset>
                    <legend className="text-lg font-semibold text-teal-400 w-full col-span-full border-b border-gray-700 pb-2 mb-2">Farmer Photo</legend>
                    <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                        <div className="flex-shrink-0">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Farmer preview" className="h-40 w-40 rounded-full object-cover border-4 border-gray-600" />
                            ) : (
                                <div className="h-40 w-40 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                                    <UserCircleIcon className="h-32 w-32 text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button type="button" onClick={handleUploadClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2">
                                <ArrowUpTrayIcon className="h-5 w-5"/> Upload Photo
                            </button>
                            <button type="button" onClick={openCamera} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2">
                               <CameraIcon className="h-5 w-5"/> Take Photo
                            </button>
                            <p className="text-xs text-gray-400">Upload or take a recent, clear photo of the farmer.</p>
                        </div>
                    </div>
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