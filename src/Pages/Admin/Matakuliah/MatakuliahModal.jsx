import React, { useState, useEffect } from 'react';
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import Input from "../../../Components/Input";
import Label from "../../../Components/Label";
import { showInfoToast } from '../../../utils/toastHelper';

const MatakuliahModal = ({ isOpen, onClose, onSubmit, selectedMatakuliah, isSubmitting }) => {
  const initialFormState = {
    kodeMk: '',
    namaMk: '',
    sks: '', 
    semester: '', 
    status: true,
  };
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (selectedMatakuliah) {
        setForm({
          kodeMk: selectedMatakuliah.kodeMk || '',
          namaMk: selectedMatakuliah.namaMk || '',
          sks: selectedMatakuliah.sks !== undefined ? String(selectedMatakuliah.sks) : '',
          semester: selectedMatakuliah.semester !== undefined ? String(selectedMatakuliah.semester) : '', 
          status: typeof selectedMatakuliah.status === 'boolean' ? selectedMatakuliah.status : true,
        });
      } else {
        setForm(initialFormState);
      }
      setFormErrors({});
    }
  }, [isOpen, selectedMatakuliah]);

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

    if (!form.kodeMk.trim()) {
      errors.kodeMk = "Kode Mata Kuliah tidak boleh kosong."; isValid = false;
    }

    if (!form.namaMk.trim()) {
      errors.namaMk = "Nama Mata Kuliah tidak boleh kosong."; isValid = false;
    }

    if (!form.sks.trim()) {
      errors.sks = "SKS tidak boleh kosong."; isValid = false;
    } else if (!/^\d+$/.test(form.sks) || parseInt(form.sks, 10) <= 0 || parseInt(form.sks, 10) > 6) { 
      errors.sks = "SKS harus berupa angka positif (misal: 1-6)."; isValid = false;
    }

    if (!form.semester.trim()) {
      errors.semester = "Semester tidak boleh kosong."; isValid = false;
    } else if (!/^\d+$/.test(form.semester) || parseInt(form.semester, 10) <= 0 || parseInt(form.semester, 10) > 8) {
      errors.semester = "Semester harus berupa angka positif (misal: 1-8)."; isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...form,
        sks: parseInt(form.sks, 10),
        semester: parseInt(form.semester, 10),
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleCancelAndClose = () => {
    if (selectedMatakuliah) {
      showInfoToast("Pengeditan data mata kuliah dibatalkan.");
    } else if (form.kodeMk || form.namaMk || form.sks || form.semester ) {
      showInfoToast("Penambahan data mata kuliah baru dibatalkan.");
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <form onSubmit={handleSubmitInternal}>
          <Heading as="h3" className="mb-6 text-gray-800 border-b pb-2">
            {selectedMatakuliah ? `Edit Mata Kuliah (ID: ${selectedMatakuliah.id})` : 'Tambah Mata Kuliah Baru'}
          </Heading>

          <div className="mb-4">
            <Label htmlFor="modal-mk-kode">Kode Mata Kuliah</Label>
            <Input
              type="text"
              id="modal-mk-kode"
              name="kodeMk"
              value={form.kodeMk}
              onChange={handleChange}
              className={`${formErrors.kodeMk ? 'border-red-500' : 'border-gray-300'} ${selectedMatakuliah !== null ? '' : ''}`}
              placeholder="Contoh: IF201"
            />
            {formErrors.kodeMk && <p className="text-red-600 text-xs mt-1">{formErrors.kodeMk}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="modal-mk-nama">Nama Mata Kuliah</Label>
            <Input
              type="text"
              id="modal-mk-nama"
              name="namaMk"
              value={form.namaMk}
              onChange={handleChange}
              className={`${formErrors.namaMk ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Contoh: Dasar Pemrograman"
            />
             {formErrors.namaMk && <p className="text-red-600 text-xs mt-1">{formErrors.namaMk}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="modal-mk-sks">SKS</Label>
              <Input
                type="number" 
                id="modal-mk-sks"
                name="sks"
                value={form.sks}
                onChange={handleChange}
                min="1" 
                className={`${formErrors.sks ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Jumlah SKS"
              />
              {formErrors.sks && <p className="text-red-600 text-xs mt-1">{formErrors.sks}</p>}
            </div>
            <div>
              <Label htmlFor="modal-mk-semester">Semester</Label>
              <Input
                type="number" 
                id="modal-mk-semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                min="1" 
                max="8" 
                className={`${formErrors.semester ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Semester (1-8)"
              />
              {formErrors.semester && <p className="text-red-600 text-xs mt-1">{formErrors.semester}</p>}
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="modal-mk-status" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="modal-mk-status"
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
              {isSubmitting ? 'Memproses...' : (selectedMatakuliah ? 'Simpan Perubahan' : 'Tambah Mata Kuliah')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatakuliahModal;