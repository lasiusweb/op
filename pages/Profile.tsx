import React, { useState, useRef } from 'react';
import type { User, Task, TaskStatus, TaskPriority } from '../types';
import DashboardCard from '../components/DashboardCard';
import { UserCircleIcon, CameraIcon, MailIcon, PhoneIcon } from '../components/Icons';

interface ProfileProps {
    viewingUser: User;
    currentUser: User;
    allTasks: Task[];
    onUpdateUser: (updatedUser: User) => void;
}

const statusStyles: { [key in TaskStatus]: string } = {
    'Pending': 'bg-yellow-500/20 text-yellow-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
};

const priorityStyles: { [key in TaskPriority]: string } = {
    'Low': 'bg-green-500/20 text-green-300',
    'Medium': 'bg-yellow-500/20 text-yellow-300',
    'High': 'bg-red-500/20 text-red-300',
};

const DetailItem: React.FC<{ icon?: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0 w-6 text-gray-400">{icon}</div>}
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-semibold text-white">{value || 'Not specified'}</p>
        </div>
    </div>
);

const EditableInput: React.FC<{ label: string; name: keyof User; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="text-xs text-gray-400">{label}</label>
        <input
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
    </div>
);


const Profile: React.FC<ProfileProps> = ({ viewingUser, currentUser, allTasks, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableUserData, setEditableUserData] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const assignedTasks = allTasks.filter(task => task.assignedToId === viewingUser.id);

    const canEdit = currentUser.id === viewingUser.id;

    const handleEditClick = () => {
        setEditableUserData({ ...viewingUser });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setEditableUserData(null);
        setIsEditing(false);
    };
    
    const handleSaveClick = () => {
        if (editableUserData) {
            onUpdateUser({ ...editableUserData, updatedAt: new Date().toISOString()});
        }
        setIsEditing(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editableUserData) return;
        const { name, value } = e.target;
        setEditableUserData({ ...editableUserData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editableUserData) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableUserData({
                    ...editableUserData,
                    profilePhotoUrl: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const ProfilePhoto: React.FC<{ user: User | null; isEditing: boolean }> = ({ user, isEditing }) => (
        <div className="relative w-40 h-40 mx-auto">
            {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gray-700" />
            ) : (
                <div className="w-40 h-40 rounded-full bg-gray-700/50 flex items-center justify-center border-4 border-gray-700">
                    <UserCircleIcon className="w-32 h-32 text-gray-600" />
                </div>
            )}
            {isEditing && (
                <>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-2"
                        aria-label="Upload new profile photo"
                    >
                        <CameraIcon className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
                <DashboardCard title="">
                    <div className="flex flex-col items-center text-center">
                        <ProfilePhoto user={isEditing ? editableUserData : viewingUser} isEditing={isEditing} />
                        
                        {isEditing && editableUserData ? (
                           <div className="w-full mt-4">
                               <EditableInput label="Full Name" name="fullName" value={editableUserData.fullName} onChange={handleInputChange} />
                           </div>
                        ) : (
                           <h2 className="text-2xl font-bold text-white mt-4">{viewingUser.fullName}</h2>
                        )}

                        <p className="text-teal-400 font-medium mt-1">{viewingUser.role}</p>
                        <span className={`mt-3 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${viewingUser.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {viewingUser.status}
                        </span>

                        {canEdit && (
                            <div className="mt-6 w-full flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleCancelClick} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                                        <button onClick={handleSaveClick} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save</button>
                                    </>
                                ) : (
                                    <button onClick={handleEditClick} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Edit Profile</button>
                                )}
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </div>

            {/* Right Column - Details & Tasks */}
            <div className="lg:col-span-2 space-y-6">
                <DashboardCard title="Contact & Regional Information">
                    {isEditing && editableUserData ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <EditableInput label="Email" name="email" value={editableUserData.email} onChange={handleInputChange} />
                             <EditableInput label="Mobile" name="mobile" value={editableUserData.mobile} onChange={handleInputChange} />
                         </div>
                    ) : (
                        <div className="space-y-4">
                            <DetailItem icon={<MailIcon />} label="Email Address" value={viewingUser.email} />
                            <DetailItem icon={<PhoneIcon />} label="Mobile Number" value={viewingUser.mobile} />
                        </div>
                    )}
                    <div className="border-t border-gray-700 my-4"></div>
                     <div className="space-y-4">
                        <DetailItem label="Region" value={viewingUser.region} />
                        <DetailItem label="Reporting Manager" value={viewingUser.reportingManagerId} />
                     </div>
                </DashboardCard>

                <DashboardCard title="Assigned Tasks">
                    {assignedTasks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Priority</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedTasks.map(task => (
                                        <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-medium text-white">{task.title}</td>
                                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</span></td>
                                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[task.status]}`}>{task.status}</span></td>
                                            <td className="px-4 py-3">{task.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">No tasks assigned to this user.</p>
                    )}
                </DashboardCard>
            </div>
        </div>
    );
};

export default Profile;