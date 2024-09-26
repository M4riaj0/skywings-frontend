'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

function Profile() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  return (
    <div className="profile-page">
      <h1 className='text-4xl font-bold p-5'>Profile</h1>
      <div className="profile-options mx-5 flex justify-around">
        <Button variant='contained' onClick={handleEditProfile}>Edit Profile</Button>
        <Button variant='contained' onClick={handleChangePassword}>Change Password</Button>
      </div>
    </div>
  );
}

export default Profile;