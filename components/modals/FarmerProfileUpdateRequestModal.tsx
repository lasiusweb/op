import React, { useState } from 'react';
import type { Farmer, FarmerProfileChangeRequest } from '../../types';
import { XMarkIcon } from '../Icons';

interface FarmerProfileUpdateRequestModalProps {
  farmer: Farmer;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: FarmerProfileChangeRequest) => void;
}

const FarmerProfileUpdateRequestModal: React.FC<FarmerProfileUpdateRequestModalProps> = ({ farmer, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    mobile: farmer.mobile,
    bankName: farmer.bankName,
    bankAccountNumber: farmer.bankAccountNumber,
    ifscCode: farmer.ifscCode,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestedChanges: Partial<Pick<Farmer, 'mobile' | 'bankName' | 'bankAccountNumber' | 'ifscCode'>> = {};
    if (formData.mobile !== farmer.mobile) requestedChanges.mobile = formData.mobile;
    if (formData.bankName !== farmer.bankName) requestedChanges.bankName = formData.bankName;
    if (formData.bankAccountNumber !== farmer.bankAccountNumber) requestedChanges.bankAccountNumber = formData.bankAccountNumber;
    if (formData.ifscCode.toUpperCase() !== farmer.ifscCode.toUpperCase()) requestedChanges.ifscCode = formData.ifscCode.toUpperCase();
    
    if (Object.keys(requestedChanges).length > 0) {
        const newRequest: FarmerProfileChangeRequest = {
            id: `FPCR-${Date.now()}`,
            farmerId: farmer.id,
            requestDate: new Date().toISOString(),
            status: 'Pending',
            requestedChanges,
        };
        onSubmit(newRequest);
    } else {
        onClose(); // No changes, just close
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Request Profile Update</h2>
        <p className="text-sm text-gray-400 mb-6">Request changes to your contact or bank details. Your request will be reviewed by an administrator.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">Mobile Number</label>
            <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-300">Bank Name</label>
            <input type="text" name="bankName" id="bankName" value={formData.bankName} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-300">Bank Account Number</label>
            <input type="text" name="bankAccountNumber" id="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-300">IFSC Code</label>
            <input type="text" name="ifscCode" id="ifscCode" value={formData.ifscCode} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfileUpdateRequestModal;
