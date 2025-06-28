import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showConfirmationDialog } from '../utils/swalHelper';
import { showInfoToast } from '../utils/toastHelper';     
import Button from './Button';

import { useAuthStateContext } from '../utils/Contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoadingAuth } = useAuthStateContext(); 

  const handleLogout = () => {
    showConfirmationDialog({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari sesi ini?',
      icon: 'question',
      confirmButtonText: 'Ya, Logout',
      onConfirm: () => {
        logout(); 
        showInfoToast('Anda telah berhasil logout.');
        setTimeout(() => {
            navigate('/');
        }, 1000);
      },
    });
  };

  if (isLoadingAuth) {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">Memuat user...</span>
        </div>
      </header>
    );
  }

  const displayName = isAuthenticated && user ? user.name : 'Pengguna';
  const displayRole = isAuthenticated && user ? user.role : '';

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1>
        {isAuthenticated && user && (
             <span className="text-xs text-blue-600 font-medium uppercase">
                (Role: {displayRole})
             </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated && user && ( 
          <>
            <span className="text-gray-600">Selamat datang, {displayName}!</span>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
        {!isAuthenticated && ( 
            <Button variant="primary" onClick={() => navigate('/')}>
                Login
            </Button>
        )}
      </div>
    </header>
  );
};

export default Header;