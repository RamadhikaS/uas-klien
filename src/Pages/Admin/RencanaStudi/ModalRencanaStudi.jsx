import React, { useState, useEffect } from 'react';
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Select from "../../../Components/Select"; 
import { showInfoToast, showErrorToast } from '../../../utils/toastHelper';

const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  dosenList,
  mataKuliahBelumAdaKelas,
  isSubmitting
}) => {
  const initialFormState = { mata_kuliah_id: "", dosen_id: "" };
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialFormState);
      setFormErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (!form.mata_kuliah_id) {
      errors.mata_kuliah_id = "Mata Kuliah harus dipilih."; isValid = false;
    }
    if (!form.dosen_id) {
      errors.dosen_id = "Dosen Pengampu harus dipilih."; isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...form,
        mahasiswa_ids: [] 
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleCancelAndClose = () => {
    if (form.mata_kuliah_id || form.dosen_id) {
        showInfoToast("Penambahan kelas baru dibatalkan.");
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
          <div className="flex justify-between items-center pb-3 mb-4 border-b">
            <Heading as="h3" className="!mb-0">Tambah Kelas Baru</Heading>
            <button
              type="button"
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <Label htmlFor="modal-kelas-mk">Mata Kuliah</Label>
            <Select
              id="modal-kelas-mk"
              name="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={handleChange}
              options={(mataKuliahBelumAdaKelas || []).map(mk => ({ value: mk.id, label: `${mk.namaMk} (${mk.sks} SKS)` }))}
              defaultOptionText="-- Pilih Mata Kuliah --"
              className={formErrors.mata_kuliah_id ? 'border-red-500' : 'border-gray-300'}
              disabled={isSubmitting}
              required
            />
            {formErrors.mata_kuliah_id && <p className="text-red-500 text-xs mt-1">{formErrors.mata_kuliah_id}</p>}
            {mataKuliahBelumAdaKelas.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">Semua mata kuliah sudah memiliki kelas atau tidak ada data mata kuliah.</p>
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="modal-kelas-dosen">Dosen Pengampu</Label>
            <Select
              id="modal-kelas-dosen"
              name="dosen_id"
              value={form.dosen_id}
              onChange={handleChange}
              options={(dosenList || []).map(d => ({ value: d.id, label: d.namaDosen }))}
              defaultOptionText="-- Pilih Dosen Pengampu --"
              className={formErrors.dosen_id ? 'border-red-500' : 'border-gray-300'}
              disabled={isSubmitting}
              required
            />
            {formErrors.dosen_id && <p className="text-red-600 text-xs mt-1">{formErrors.dosen_id}</p>}
             {dosenList.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">Tidak ada data dosen tersedia.</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleCancelAndClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || mataKuliahBelumAdaKelas.length === 0 || dosenList.length === 0}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kelas'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;