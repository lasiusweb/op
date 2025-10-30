import React, { useState } from 'react';
import type { Employee } from '../../types';
import { XMarkIcon } from '../Icons';

interface ProfileUpdateRequestModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestedChanges: Partial<Pick<Employee, 'fullName' | 'mobile' | 'email' | 'region'>>) => void;
}

const ProfileUpdateRequestModal: React.FC<ProfileUpdateRequestModalProps> = ({ employee, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: employee.fullName,
    mobile: employee.mobile,
    email: employee.email,
    region: employee.region,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestedChanges: Partial<Pick<Employee, 'fullName' | 'mobile' | 'email' | 'region'>> = {};
    if (formData.fullName !== employee.fullName) requestedChanges.fullName = formData.fullName;
    if (formData.mobile !== employee.mobile) requestedChanges.mobile = formData.mobile;
    if (formData.email !== employee.email) requestedChanges.email = formData.email;
    if (formData.region !== employee.region) requestedChanges.region = formData.region;

    if (Object.keys(requestedChanges).length > 0) {
      onSubmit(requestedChanges);
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
        <p className="text-sm text-gray-400 mb-6">Your changes will be submitted for approval by an administrator.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">Mobile</label>
            <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
          </div>
           <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-300">Region (Branch)</label>
            <input type="text" name="region" id="region" value={formData.region} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 sm:text-sm" />
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

export default ProfileUpdateRequestModal;
