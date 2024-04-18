import { X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import './CoursesSidebar.css';

interface CoursesSidebarProps {
    onClose: () => void;
}

interface Prof {
    username: string;
    role: string;
    profile: {
        firstName: string;
        lastName: string;
        email: string;
    };
    currency: number | null;
    resetPasswordConfig: boolean;
}

const Profile: React.FC<CoursesSidebarProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<Prof | null>(null);
    // const [resetPasswordConfig, setResetPasswordConfig] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/profile", {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                });

                setProfile(await response.json());
                if (!response.ok) {
                    throw new Error("Failed to fetch the user profile");
                }
            } catch (error) {
                console.error("Error checking for profile", error);
            }
        };
        checkProfile();
        // setResetPasswordConfig(profile?.resetPasswordConfig || false);

        // Add event listener to close sidebar when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // const handleResetPasswordConfig = () => {
    //     setResetPasswordConfig(!resetPasswordConfig);
    // }

    return (
        <div className='main-container' ref={profileRef}>
            <div className='header-container is-rounded'>
                <div className='close-button'>
                    <X onClick={onClose} />
                </div>
            </div>
            
            {profile?.role === 'student' ? (
                <div>
                    <hr className='nes-line' />
                    <div className="nes-container is-dark with-title">
                    <p className="title">Balance</p>
                    <p className='nes-text'>$ {profile?.currency}</p>
                </div>
                </div>
                
            ) : null}
            <hr className='nes-line' />
            <div className="nes-container is-dark with-title">
                    <p className="title">Profile</p>

                    <div className="nes-container is-rounded is-dark">
                        <p>Username: {profile?.username}</p>
                    </div>
           
                    <div className="nes-container is-rounded is-dark">
                        <p>Name: {profile?.profile.firstName} {profile?.profile.lastName}</p>
                    </div>

                    <div className="nes-container is-rounded is-dark">
                        <p>Email: {profile?.profile.email}</p>
                    </div>
            </div>
            {/* <hr className='nes-line' />
            <div className="nes-container is-dark with-title">
                <label>
                    <input type="checkbox" className="nes-checkbox is-dark" checked={resetPasswordConfig} onChange={handleResetPasswordConfig}/>
                    <span>Create password when students logges in for first time?</span>
                </label>
            </div> */}
            <hr className='nes-line' />

            <div className="nes-container is-dark with-title">
                <p className="title">Role</p>
                <p className='nes-text'>{profile?.role === 'student' ? 'Student' : 'Instructor'}</p>
            </div>
            
            <hr className='nes-line' />
        </div>
    );
};

export default Profile;