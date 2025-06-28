import React, { useState, useEffect } from 'react';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import UserTable from './UserTable';
import EditUserModal from './EditUserModal';

import {
  getAllUsersApi,
  updateUserApi
} from "../../../utils/Apis/UserApi";

import { showSuccessToast, showErrorToast, showInfoToast } from "../../../utils/toastHelper";
import { showConfirmationDialog } from "../../../utils/swalHelper";

import { useAuthStateContext } from '../../../utils/Contexts/AuthContext';

const UserManagement = () => {
  const { user: currentUser, isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const permissions = currentUser?.permission || [];

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      if (permissions.includes("user.read") || permissions.includes("user.management.page")) {
        fetchUsersData();
      } else {
        setUserList([]);
      }
    }
  }, [isLoadingAuth, isAuthenticated, currentUser]);

  const fetchUsersData = async () => {
    console.log("UserManagement.jsx: Memulai fetchUsersData...");
    setIsLoading(true);
    try {
      const data = await getAllUsersApi();
      console.log("UserManagement.jsx: Data user diterima:", data);
      setUserList(data || []);
    } catch (error) {
      showErrorToast("Gagal mengambil data pengguna.");
      console.error("UserManagement.jsx: Error saat fetchUsersData:", error);
      setUserList([]);
    } finally {
      setIsLoading(false);
      console.log("UserManagement.jsx: fetchUsersData selesai.");
    }
  };

  const handleApiUpdateUser = async (updatedUserData) => {
    const userToUpdate = userList.find(u => u.id === updatedUserData.id);
    if (!userToUpdate) {
        showErrorToast("User tidak ditemukan untuk diupdate.");
        return false;
    }

    const dataForApi = {
        ...userToUpdate,
        role: updatedUserData.role,
        permission: updatedUserData.permission,s
    };


    try {
      await updateUserApi(updatedUserData.id, dataForApi);
      return true;
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Gagal memperbarui data pengguna.");
      console.error("Error update user:", error);
      return false;
    }
  };

  const openEditUserModal = (userToEdit) => {
    setSelectedUser(userToEdit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitFromModal = (formDataFromModal) => {
    const userNameForToast = formDataFromModal.name || selectedUser?.name || 'User';

    showConfirmationDialog({
      title: `Konfirmasi Perubahan Data User`,
      text: `Apakah Anda yakin ingin menyimpan perubahan untuk ${userNameForToast}?`,
      icon: 'question',
      confirmButtonText: `Ya, Simpan!`,
      onConfirm: async () => {
        setIsSubmitting(true);
        const success = await handleApiUpdateUser(formDataFromModal);
        setIsSubmitting(false);

        if (success) {
          console.log("LOG: Akan menampilkan toast UPDATE USER sukses");
          showSuccessToast(`Data pengguna ${userNameForToast} berhasil diperbarui!`);
          await fetchUsersData();
          handleCloseModal();  
        }
      }
    });
  };

  if (isLoadingAuth) {
    return <Card><p className="text-center text-gray-500 my-4">Memeriksa autentikasi...</p></Card>;
  }

  if (!isAuthenticated || (!permissions.includes("user.management.page") && !permissions.includes("user.read"))) {
    return (
      <Card>
        <Heading as="h2" className="text-red-600 text-center">Akses Ditolak</Heading>
        <p className="text-center text-gray-600">
          Anda tidak memiliki izin untuk mengakses halaman manajemen pengguna.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-left">Manajemen Pengguna</Heading>
      </div>

      {isLoading && <p className="text-center text-gray-500 my-4">Memuat data pengguna...</p>}
      
      <UserTable
        userList={userList}
        onEditUser={openEditUserModal}
        canEdit={permissions.includes("user.update.role") || permissions.includes("user.update.permission")}
      />

      {selectedUser && ( 
        <EditUserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFromModal}
          selectedUser={selectedUser}
          isSubmitting={isSubmitting}
        />
      )}
    </Card>
  );
};

export default UserManagement;