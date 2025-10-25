import React from 'react';
import type { User } from '../../types';
import { UserIcon } from '../Icons';

interface HeaderProps {
    title: string;
    currentUser: User;
    allUsers: User[];
    setCurrentUser: (user: User) => void;
    onViewProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, currentUser, allUsers, setCurrentUser, onViewProfile }) => {
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = allUsers.find(u => u.id === event.target.value);
        if (selectedUser) {
            setCurrentUser(selectedUser);
        }
    };
    
    return (
        <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-700/50 flex justify-between items-center">
             <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {title}
            </h1>
             <div className="flex items-center gap-4">
                <button onClick={onViewProfile} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="text-right">
                        <p className="font-semibold text-white text-sm">{currentUser.fullName}</p>
                        <p className="text-xs text-teal-400 font-medium group-hover:text-teal-300">{currentUser.role}</p>
                    </div>
                    <div className="relative">
                        {currentUser.profilePhotoUrl ? (
                            <img src={currentUser.profilePhotoUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-gray-400 p-2 bg-gray-700/50 rounded-full" />
                        )}
                        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${currentUser.status === 'Active' ? 'bg-green-400' : 'bg-red-400'} ring-2 ring-gray-800`}></span>
                    </div>
                </button>
                
                <div className="relative">
                    <label htmlFor="user-switcher" className="sr-only">Switch User</label>
                    <select
                        id="user-switcher"
                        value={currentUser.id}
                        onChange={handleUserChange}
                        className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                        aria-label="Switch logged in user"
                    >
                        {allUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.fullName}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;