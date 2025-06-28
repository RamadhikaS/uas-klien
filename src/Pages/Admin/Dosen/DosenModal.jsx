import React, { useState, useEffect } from 'react';
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import Input from "../../../Components/Input"; 
import Label from "../../../Components/Label";   
import { showInfoToast } from '../../../utils/toastHelper'; 

const DosenModal = ({ isOpen, onClose, onSubmit, selectedDosen, isSubmitting }) => {
  const initialFormState = {
    nidn: '',
    namaDosen: '',
    bidangKeahlian: '',
    status: true,
    max_sks: '',
  };
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (selectedDosen) {
        setForm({
          nidn: selectedDosen.nidn || '',
          namaDosen: selectedDosen.namaDosen || '',
          bidangKeahlian: selectedDosen.bidangKeahlian || '',
          status: typeof selectedDosen.status === 'boolean' ? selectedDosen.status : true,
          max_sks: selectedDosen.max_sks !== undefined ? String(selectedDosen.max_sks) : '',
        });
      } else {
        setForm(initialFormState);
      }
      setFormErrors({});
    }
  }, [isOpen, selectedDosen]);

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

    if (!form.nidn.trim()) {
      errors.nidn = "NIDN tidak boleh kosong."; isValid = false;
    } else if (!/^\d{10}$/.test(form.nidn.trim())) {
        errors.nidn = "NIDN harus terdiri dari 10 digit angka."; isValid = false;
    }

    if (!form.namaDosen.trim()) {
      errors.namaDosen = "Nama Dosen tidak boleh kosong."; isValid = false;
    }
    if (!form.bidangKeahlian.trim()) {
      errors.bidangKeahlian = "Bidang Keahlian tidak boleh kosong."; isValid = false;
    }
    if (!form.max_sks.toString().trim()) {
        errors.max_sks = "Max SKS tidak boleh kosong."; isValid = false;
    } else if (isNaN(parseInt(form.max_sks, 10)) || parseInt(form.max_sks, 10) < 0) {
        errors.max_sks = "Max SKS harus berupa angka positif atau nol."; isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...form,
        max_sks: parseInt(form.max_sks, 10),
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleCancelAndClose = () => {
    if (selectedDosen) {
      showInfoToast("Pengeditan data dosen dibatalkan.");
    } else if (form.nidn || form.namaDosen || form.bidangKeahlian) {
      showInfoToast("Penambahan data dosen baru dibatalkan.");
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"> {/* Lebarkan sedikit modal */}
        <form onSubmit={handleSubmitInternal}>
          <Heading as="h3" className="mb-6 text-gray-800 border-b pb-2">
            {selectedDosen ? `Edit Dosen (ID: ${selectedDosen.id})` : 'Tambah Dosen Baru'}
          </Heading>

          <div className="mb-4">
            <Label htmlFor="modal-dosen-nidn">NIDN</Label>
            <Input
              type="text"
              id="modal-dosen-nidn"
              name="nidn"
              value={form.nidn}
              onChange={handleChange}
              className={`${formErrors.nidn ? 'border-red-500' : 'border-gray-300'} ${selectedDosen !== null ? '' : ''}`}
              placeholder="Masukkan NIDN (10 digit)"
            />
            {formErrors.nidn && <p className="text-red-600 text-xs mt-1">{formErrors.nidn}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="modal-dosen-nama">Nama Dosen</Label>
            <Input
              type="text"
              id="modal-dosen-nama"
              name="namaDosen"
              value={form.namaDosen}
              onChange={handleChange}
              className={`${formErrors.namaDosen ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan Nama Lengkap Dosen (beserta gelar)"
            />
             {formErrors.namaDosen && <p className="text-red-600 text-xs mt-1">{formErrors.namaDosen}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="modal-dosen-bidang">Bidang Keahlian</Label>
            <Input
              type="text"
              id="modal-dosen-bidang"
              name="bidangKeahlian"
              value={form.bidangKeahlian}
              onChange={handleChange}
              className={`${formErrors.bidangKeahlian ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Contoh: Rekayasa Perangkat Lunak, Jaringan, AI"
            />
             {formErrors.bidangKeahlian && <p className="text-red-600 text-xs mt-1">{formErrors.bidangKeahlian}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="modal-dosen-max_sks">Max SKS Mengajar</Label>
            <Input
              type="number" 
              id="modal-dosen-max_sks"
              name="max_sks"
              value={form.max_sks}
              onChange={handleChange}
              min="0" 
              className={`${formErrors.max_sks ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Jumlah maksimal SKS yang diampu"
              disabled={isSubmitting}
            />
            {formErrors.max_sks && <p className="text-red-500 text-xs mt-1">{formErrors.max_sks}</p>}
          </div>
          <div className="mb-6">
            <Label htmlFor="modal-dosen-status" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="modal-dosen-status"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Status Aktif</span>
            </Label>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <Button type="button" variant="secondary" onClick={handleCancelAndClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : (selectedDosen ? 'Simpan Perubahan' : 'Tambah Dosen')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DosenModal;