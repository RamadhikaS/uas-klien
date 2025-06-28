import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from 'react-router-dom';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";

import { getMahasiswaById } from "../../../utils/Apis/MahasiswaApi"; 
import { showErrorToast } from "../../../utils/toastHelper";

const MahasiswaDetail = () => {
  const { id } = useParams();

  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailMahasiswa = async () => {
      console.log("MahasiswaDetail: useEffect dipanggil dengan id:", id);

      if (!id) {
        console.log("MahasiswaDetail: Tidak ada ID, proses fetch dihentikan.");
        setLoading(false);
        setMahasiswa(null);
        return;
      }

      setLoading(true);
      console.log("MahasiswaDetail: Memulai fetch untuk id:", id);

      try {
        const data = await getMahasiswaById(id);
        console.log("MahasiswaDetail: Data diterima dari API:", data);
        setMahasiswa(data);
      } catch (error) {
        console.error("MahasiswaDetail: Error saat fetchDetailMahasiswa:", error);
        showErrorToast("Gagal mengambil detail mahasiswa.");
        setMahasiswa(null);
      } finally {
        setLoading(false);
        console.log("MahasiswaDetail: Proses fetch selesai, loading diatur ke false.");
      }
    };

    fetchDetailMahasiswa();
  }, [id]);

  if (loading) {
    return (
      <Card className="text-center">
        <p className="text-gray-500 py-4">Memuat data detail mahasiswa...</p>
      </Card>
    );
  }

  if (!mahasiswa) {
    return (
        <Card className="text-center">
            <Heading as="h2" className="text-red-600">Data Mahasiswa Tidak Ditemukan</Heading>
            <p className="text-gray-600 mb-4">Mahasiswa dengan ID "{id}" tidak dapat ditemukan.</p>
            <Button as={RouterLink} to="/admin/mahasiswa" variant="primary">
                Kembali ke Daftar Mahasiswa
            </Button>
        </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-6 text-gray-800 border-b pb-2">Detail Mahasiswa (ID: {mahasiswa.id})</Heading>
      <div className="space-y-3 text-sm">
        <div className="flex">
          <p className="w-1/3 font-semibold text-gray-600">NIM:</p>
          <p className="w-2/3 text-gray-800">{mahasiswa.nim}</p>
        </div>
        <div className="flex">
          <p className="w-1/3 font-semibold text-gray-600">Nama:</p>
          <p className="w-2/3 text-gray-800">{mahasiswa.nama}</p>
        </div>
        <div className="flex">
          <p className="w-1/3 font-semibold text-gray-600">Status:</p>
          <p className={`w-2/3 font-medium ${mahasiswa.status ? 'text-green-600' : 'text-red-600'}`}>
            {mahasiswa.status ? 'Aktif' : 'Tidak Aktif'}
          </p>
        </div>
      </div>
      <div className="mt-6 border-t pt-4">
        <Button as={RouterLink} to="/admin/mahasiswa" variant="secondary">
          Kembali ke Daftar Mahasiswa
        </Button>
      </div>
    </Card>
  );
};

export default MahasiswaDetail;