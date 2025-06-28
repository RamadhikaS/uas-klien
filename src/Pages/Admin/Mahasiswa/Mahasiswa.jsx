import React, { useState, useEffect, useMemo } from 'react';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import MahasiswaTable from './MahasiswaTable';
import MahasiswaModal from './MahasiswaModal';
import Input from "../../../Components/Input";      
import Select from "../../../Components/Select";
import Label from "../../../Components/Label";

import {
  useGetAllMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa
} from "../../../utils/Hooks/useMahasiswa";
import { useGetAllKelas } from '../../../utils/Hooks/useKelas';
import { useGetAllMatakuliah } from '../../../utils/Hooks/useMatakuliah';

import { showInfoToast, showErrorToast } from "../../../utils/toastHelper";
import { showConfirmationDialog } from "../../../utils/swalHelper";
import { useAuthStateContext } from '../../../utils/Contexts/AuthContext';

const ITEMS_PER_PAGE_OPTIONS = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
];
const SORT_OPTIONS = [
    { value: "nama", label: "Nama Mahasiswa" },
    { value: "nim", label: "NIM" },
    { value: "max_sks", label: "Max SKS" },
];
const ORDER_OPTIONS = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

const Mahasiswa = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const permissions = user?.permission || [];

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0].value); 
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value); 
  const [sortOrder, setSortOrder] = useState(ORDER_OPTIONS[0].value); 
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); 

  const queryParams = useMemo(() => ({
    q: debouncedSearchTerm, 
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: perPage,
  }), [debouncedSearchTerm, sortBy, sortOrder, page, perPage]);

  const {
    data: mahasiswaResult, 
    isLoading: isLoadingMahasiswaData, 
    isFetching: isFetchingMahasiswa,   
  } = useGetAllMahasiswa(queryParams);

  const mahasiswaList = mahasiswaResult?.data || [];
  const totalMahasiswa = mahasiswaResult?.totalCount || 0;
  const totalPages = Math.ceil(totalMahasiswa / perPage);

  const { data: kelasList = [] } = useGetAllKelas();
  const { data: matakuliahList = [] } = useGetAllMatakuliah();

  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { mutate: storeMahasiswaMutate, isLoading: isStoringMahasiswa } = useStoreMahasiswa();
  const { mutate: updateMahasiswaMutate, isLoading: isUpdatingMahasiswa } = useUpdateMahasiswa();
  const { mutate: deleteMahasiswaMutate, isLoading: isDeletingMahasiswa } = useDeleteMahasiswa();

  const isLoadingPage = isLoadingAuth || isLoadingMahasiswaData; 
  const isProcessingForm = isStoringMahasiswa || isUpdatingMahasiswa; 
  const isActionInProgress = isProcessingForm || isDeletingMahasiswa || isFetchingMahasiswa; 

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 1) setPage(1);
    }, 500); 

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, page]);

  const getTotalSksDiambilMahasiswa = useMemo(() => (mahasiswaId) => {
    if (!kelasList.length || !matakuliahList.length) return 0;
    return kelasList
      .filter(k => (k.mahasiswa_ids || []).includes(String(mahasiswaId)))
      .map(k => matakuliahList.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, currentSks) => acc + currentSks, 0);
  }, [kelasList, matakuliahList]);

  const openAddModal = () => {
    if (!permissions.includes("mahasiswa.create")) {
        showErrorToast("Anda tidak memiliki izin untuk menambah mahasiswa.");
        return;
    }
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    if (!permissions.includes("mahasiswa.update")) {
        showErrorToast("Anda tidak memiliki izin untuk mengedit mahasiswa.");
        return;
    }
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMahasiswa(null);
  };

  const handleSubmitFromModal = (formDataFromModal) => {
    const isEditing = selectedMahasiswa !== null;
    const mhsNameForDialog = isEditing ? selectedMahasiswa.nama : formDataFromModal.nama;

    if (!isEditing) {
      const nimExists = mahasiswaList.some(mhs => mhs.nim === formDataFromModal.nim);
      if (nimExists) {
        showErrorToast(`NIM ${formDataFromModal.nim} sudah terdaftar. Gunakan NIM lain.`);
        return; 
      }
    }

    console.log("Nilai max_sks dari modal:", formDataFromModal.max_sks, "Tipe:", typeof formDataFromModal.max_sks);
    if (isNaN(parseInt(formDataFromModal.max_sks, 10)) || parseInt(formDataFromModal.max_sks, 10) <= 0) {
        showErrorToast("Max SKS harus berupa angka positif.");
        return;
    }
    
    if (isNaN(parseInt(formDataFromModal.max_sks, 10)) || parseInt(formDataFromModal.max_sks, 10) <= 0) {
        showErrorToast("Max SKS harus berupa angka positif.");
        return;
    }
    const dataToSubmit = {
        ...formDataFromModal,
        max_sks: parseInt(formDataFromModal.max_sks, 10)
    };


    showConfirmationDialog({
      title: `Konfirmasi ${isEditing ? "Perbarui" : "Tambah"} Data`,
      text: `Apakah Anda yakin ingin ${isEditing ? "memperbarui" : "menambahkan"} data mahasiswa ${mhsNameForDialog}?`,
      icon: 'question',
      confirmButtonText: `Ya, ${isEditing ? "Perbarui" : "Tambahkan"}!`,
      onConfirm: () => {
        if (isEditing) {
          updateMahasiswaMutate(
            { id: selectedMahasiswa.id, dataPayload: { id: selectedMahasiswa.id, ...dataToSubmit } },
            { onSuccess: () => handleCloseModal() } 
          );
        } else {
          storeMahasiswaMutate(dataToSubmit, {
            onSuccess: () => handleCloseModal()
          });
        }
      }
    });
  };

  const handleDeleteFromTable = (mahasiswaId) => {
    if (!permissions.includes("mahasiswa.delete")) {
        showErrorToast("Anda tidak memiliki izin untuk menghapus mahasiswa.");
        return;
    }
    const mhsToDelete = mahasiswaList.find(mhs => mhs.id === mahasiswaId);
    if (!mhsToDelete) return;

    showConfirmationDialog({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus data mahasiswa ${mhsToDelete.nama} (NIM: ${mhsToDelete.nim})?`,
      icon: 'warning',
      confirmButtonText: 'Ya, hapus!',
      onConfirm: () => {
        deleteMahasiswaMutate(mahasiswaId);
      },
      onCancel: () => {
        showInfoToast('Penghapusan dibatalkan.');
      }
    });
  };

  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages || 1));
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  if (isLoadingAuth) {
    return <Card><p className="text-center text-gray-500 my-4">Memeriksa autentikasi...</p></Card>;
  }
  if (!isAuthenticated || !permissions.includes("mahasiswa.page")) {
    return <Card><Heading as="h2" className="text-red-600 text-center">Akses Ditolak</Heading><p className="text-center">Anda tidak punya izin.</p></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
        {permissions.includes("mahasiswa.create") && (
          <Button onClick={openAddModal} disabled={isLoadingPage || isProcessingForm}>
            {isProcessingForm ? 'Memproses...' : (isLoadingPage ? 'Memuat...' : '+ Tambah Mahasiswa')}
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search-mahasiswa">Pencarian</Label>
          <Input
            id="search-mahasiswa"
            type="text"
            placeholder="Cari Nama, NIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-0" 
          />
        </div>
        <div>
          <Label htmlFor="sort-by-mahasiswa">Urutkan Berdasarkan</Label>
          <Select
            id="sort-by-mahasiswa"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={handleSortByChange}
            className="mt-0"
          />
        </div>
        <div>
          <Label htmlFor="sort-order-mahasiswa">Urutan</Label>
          <Select
            id="sort-order-mahasiswa"
            options={ORDER_OPTIONS}
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="mt-0"
          />
        </div>
        <div>
          <Label htmlFor="per-page-mahasiswa">Item per Halaman</Label>
          <Select
            id="per-page-mahasiswa"
            options={ITEMS_PER_PAGE_OPTIONS}
            value={perPage}
            onChange={handlePerPageChange}
            className="mt-0"
          />
        </div>
      </div>

      {(isLoadingMahasiswaData || isFetchingMahasiswa) && <p className="text-center text-gray-500 my-4">Memuat data mahasiswa...</p>}

      {!isLoadingPage && permissions.includes("mahasiswa.read") && (
        <>
          {mahasiswaList.length === 0 && !(isLoadingMahasiswaData || isFetchingMahasiswa) && (
            <p className="text-center text-gray-500 my-4">
              {debouncedSearchTerm ? `Tidak ada mahasiswa ditemukan untuk "${debouncedSearchTerm}".` : "Belum ada data mahasiswa."}
            </p>
          )}
          {mahasiswaList.length > 0 && (
            <MahasiswaTable
              mahasiswa={mahasiswaList}
              onEdit={openEditModal}
              onDelete={handleDeleteFromTable}
              canEdit={permissions.includes("mahasiswa.update")}
              canDelete={permissions.includes("mahasiswa.delete")}
              getTotalSks={getTotalSksDiambilMahasiswa}
              isLoading={isFetchingMahasiswa} 
            />
          )}
          {totalPages > 0 && mahasiswaList.length > 0 && ( 
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-700 mb-2 sm:mb-0">
                Menampilkan <span className="font-medium">{mahasiswaList.length}</span> dari <span className="font-medium">{totalMahasiswa}</span> hasil
                (Halaman <span className="font-medium">{page}</span> dari <span className="font-medium">{totalPages}</span>)
              </p>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePreviousPage} disabled={page === 1 || isFetchingMahasiswa || isProcessingForm} size="sm" variant="secondary">
                  Sebelumnya
                </Button>
                <Button onClick={handleNextPage} disabled={page === totalPages || isFetchingMahasiswa || isProcessingForm || totalPages === 0} size="sm" variant="secondary">
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {!isLoadingPage && !permissions.includes("mahasiswa.read") && (
        <p className="text-center text-orange-600 my-4">Anda tidak memiliki izin untuk melihat daftar mahasiswa.</p>
      )}

      {(permissions.includes("mahasiswa.create") || permissions.includes("mahasiswa.update")) && (
        <MahasiswaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFromModal}
          selectedMahasiswa={selectedMahasiswa}
          isSubmitting={isProcessingForm}
        />
      )}
    </Card>
  );
};

export default Mahasiswa;