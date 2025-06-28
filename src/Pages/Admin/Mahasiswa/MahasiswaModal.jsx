import React, { useState, useEffect } from 'react';
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import Input from "../../../Components/Input";
import Label from "../../../Components/Label";
import { showInfoToast } from '../../../utils/toastHelper';

const initialFormState = { nim: '', nama: '', status: true, max_sks: '' };

const MahasiswaModal = ({ isOpen, onClose, onSubmit, selectedMahasiswa, isSubmitting }) => {
  const [form, setForm] = useState({ nim: '', nama: '', status: true });
  const [formErrors, setFormErrors] = useState({ nim: '', nama: '' });

  useEffect(() => {
  if (isOpen) {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim || '',
        nama: selectedMahasiswa.nama || '',
        status: typeof selectedMahasiswa.status === 'boolean' ? selectedMahasiswa.status : true,
        max_sks: selectedMahasiswa.max_sks !== undefined ? String(selectedMahasiswa.max_sks) : '',
      });
    } else {
      setForm(initialFormState);
    }
    setFormErrors({});
  }
}, [isOpen, selectedMahasiswa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (!form.nim.trim()) {
        errors.nim = "NIM tidak boleh kosong."; isValid = false;
    } else if (!/^\d+$/.test(form.nim)) {
        errors.nim = "NIM harus berupa angka."; isValid = false;
    }
    if (!form.nama.trim()) {
        errors.nama = "Nama tidak boleh kosong."; isValid = false;
    }
    if (!form.max_sks.trim()) { 
    errors.max_sks = "Max SKS tidak boleh kosong."; isValid = false;
    } else if (isNaN(parseInt(form.max_sks, 10)) || parseInt(form.max_sks, 10) <= 0) {
    errors.max_sks = "Max SKS harus berupa angka positif."; isValid = false;
}
    setFormErrors(errors);
    return isValid;
  };

   const handleSubmitInternal = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form); 
    }
  };

   const handleCancelAndClose = () => {
    if (selectedMahasiswa) {
      showInfoToast("Pengeditan data dibatalkan.");
    } else if (form.nim || form.nama) {
      showInfoToast("Penambahan data baru dibatalkan.");
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <form onSubmit={handleSubmitInternal}>
          <Heading as="h3" className="mb-4">
            {selectedMahasiswa ? `Edit Mahasiswa (ID: ${selectedMahasiswa.id})` : 'Tambah Mahasiswa Baru'}
          </Heading>
          <div className="mb-4">
            <Label htmlFor="modal-nim">NIM</Label>
            <Input
              type="text"
              id="modal-nim"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              className={`${formErrors.nim ? 'border-red-500' : 'border-gray-300'} ${selectedMahasiswa !== null ? '' : ''}`}
              placeholder="Masukkan NIM"
            />
            {formErrors.nim && <p className="text-red-600 text-xs mt-1">{formErrors.nim}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="modal-nama">Nama</Label>
            <Input
              type="text"
              id="modal-nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className={`${formErrors.nama ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan Nama Lengkap"
            />
             {formErrors.nama && <p className="text-red-600 text-xs mt-1">{formErrors.nama}</p>}
          </div>
          <div className="mb-4">
          <Label htmlFor="modal-mhs-max_sks">Max SKS</Label>
          <Input
            type="number" 
            id="modal-mhs-max_sks"
            name="max_sks"
            value={form.max_sks || ''} 
            onChange={handleChange}
            min="1"
            className={`${formErrors.max_sks ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan Max SKS"
          />
          {formErrors.max_sks && <p className="text-red-500 text-xs mt-1">{formErrors.max_sks}</p>}
        </div>
        <div className="mb-6">
            <Label htmlFor="modal-status" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="modal-status"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Status Aktif</span>
            </Label>
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={handleCancelAndClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : (selectedMahasiswa ? 'Simpan Perubahan' : 'Tambah Mahasiswa')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;