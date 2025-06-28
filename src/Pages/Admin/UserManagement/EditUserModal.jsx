import React, { useState, useEffect } from 'react';
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import { showInfoToast } from '../../../utils/toastHelper';
import Select from "../../../Components/Select";
import Checkbox from "../../../Components/Checkbox";
const AVAILABLE_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "mahasiswa", label: "Mahasiswa" },
];

const ALL_POSSIBLE_PERMISSIONS = [
  "dashboard.page",
  "mahasiswa.page", "mahasiswa.read", "mahasiswa.create", "mahasiswa.update", "mahasiswa.delete",
  "dosen.page", "dosen.read", "dosen.create", "dosen.update", "dosen.delete",
  "matakuliah.page", "matakuliah.read", "matakuliah.create", "matakuliah.update", "matakuliah.delete",
  "user.management.page", "user.read", "user.update.role", "user.update.permission", "user.delete",
  "krs.page", "krs.read",
];

const EditUserModal = ({ isOpen, onClose, onSubmit, selectedUser, isSubmitting }) => {
  const initialFormState = {
    id: null,
    name: '',
    email: '',
    role: '',
    permission: [],
  };
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({}); 

  useEffect(() => {
    if (isOpen) {
      if (selectedUser) {
        setForm({
          id: selectedUser.id,
          name: selectedUser.name || '',
          email: selectedUser.email || '',
          role: selectedUser.role || '',
          permission: Array.isArray(selectedUser.permission) ? [...selectedUser.permission] : [],
        });
      } else {
        setForm(initialFormState);
      }
      setFormErrors({});
    }
  }, [isOpen, selectedUser]);

  const handleRoleChange = (e) => {
    setForm(prevForm => ({ ...prevForm, role: e.target.value }));
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setForm(prevForm => {
      const currentPermissions = prevForm.permission || [];
      if (checked) {
        return { ...prevForm, permission: [...currentPermissions, value] };
      } else {
        return { ...prevForm, permission: currentPermissions.filter(p => p !== value) };
      }
    });
  };

  const validateForm = () => {
    return true; 
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        id: form.id,
        name: form.name, 
        email: form.email,
        role: form.role,
        permission: form.permission,
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleCancelAndClose = () => {
    showInfoToast("Perubahan role/permission dibatalkan.");
    onClose();
  };

  if (!isOpen || !selectedUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg md:max-w-2xl">
        <form onSubmit={handleSubmitInternal}>
          <Heading as="h3" className="mb-6 text-gray-800 border-b pb-2">
            Edit Role & Permission untuk: <span className="font-bold">{selectedUser.name}</span> (ID: {selectedUser.id})
          </Heading>

          <div className="mb-4 p-3 bg-gray-50 rounded-md border">
            <p className="text-sm"><span className="font-semibold">Nama:</span> {selectedUser.name}</p>
            <p className="text-sm"><span className="font-semibold">Email:</span> {selectedUser.email}</p>
          </div>

          <div className="mb-6">
            <Label htmlFor="modal-user-role">Role Pengguna</Label>
            <Select
              id="modal-user-role"
              name="role"
              value={form.role}
              onChange={handleRoleChange}
              options={AVAILABLE_ROLES}
              className={formErrors.role ? 'border-red-500' : 'border-gray-300'}
              disabled={isSubmitting}
            />
            {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
          </div>

          <div className="mb-6">
            <Label className="mb-2">Permissions</Label>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_POSSIBLE_PERMISSIONS.map(perm => (
                <Checkbox
                  key={perm}
                  id={`perm-${perm.replace(/\./g, '-')}`}
                  name="permission" 
                  value={perm}
                  checked={(form.permission || []).includes(perm)}
                  onChange={handlePermissionChange}
                  label={perm}
                  disabled={isSubmitting}
                  className="text-sm"
                />
              ))}
            </div>
            {formErrors.permission && <p className="text-red-500 text-xs mt-1">{formErrors.permission}</p>}
          </div>


          <div className="flex justify-end space-x-3 mt-8">
            <Button type="button" variant="secondary" onClick={handleCancelAndClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;