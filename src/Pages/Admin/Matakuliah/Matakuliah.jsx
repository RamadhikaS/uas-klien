import React, { useState, useEffect, useMemo } from 'react';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import MatakuliahTable from './MatakuliahTable';
import MatakuliahModal from './MatakuliahModal';
import Input from "../../../Components/Input";
import Select from "../../../Components/Select";
import Label from "../../../Components/Label";

import {
  useGetAllMatakuliah,
  useStoreMatakuliah,
  useUpdateMatakuliah,
  useDeleteMatakuliah
} from "../../../utils/Hooks/useMatakuliah";

import { showInfoToast, showErrorToast } from "../../../utils/toastHelper";
import { showConfirmationDialog } from "../../../utils/swalHelper";
import { useAuthStateContext } from '../../../utils/Contexts/AuthContext';

const ITEMS_PER_PAGE_OPTIONS_MK = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
];
const SORT_OPTIONS_MK = [
    { value: "namaMk", label: "Nama Mata Kuliah" },
    { value: "kodeMk", label: "Kode MK" },
    { value: "sks", label: "SKS" },
    { value: "semester", label: "Semester" },
];
const ORDER_OPTIONS_MK = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

const Matakuliah = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const permissions = user?.permission || [];

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE_OPTIONS_MK[0].value);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS_MK[0].value);
  const [sortOrder, setSortOrder] = useState(ORDER_OPTIONS_MK[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const queryParams = useMemo(() => ({
    q: debouncedSearchTerm,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: perPage,
  }), [debouncedSearchTerm, sortBy, sortOrder, page, perPage]);

  console.log("Matakuliah.jsx - queryParams:", queryParams);

  const {
    data: matakuliahResult,
    isLoading: isLoadingMatakuliahData,
    isFetching: isFetchingMatakuliah,
  } = useGetAllMatakuliah(queryParams);

  const matakuliahList = matakuliahResult?.data || [];
  const totalMatakuliah = matakuliahResult?.totalCount || 0;
  const totalPages = Math.ceil(totalMatakuliah / perPage);

  const [selectedMatakuliah, setSelectedMatakuliah] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { mutate: storeMatakuliahMutate, isLoading: isStoringMatakuliah } = useStoreMatakuliah();
  const { mutate: updateMatakuliahMutate, isLoading: isUpdatingMatakuliah } = useUpdateMatakuliah();
  const { mutate: deleteMatakuliahMutate, isLoading: isDeletingMatakuliah } = useDeleteMatakuliah();

  const isLoadingPage = isLoadingAuth || isLoadingMatakuliahData;
  const isProcessingForm = isStoringMatakuliah || isUpdatingMatakuliah;
  const isActionInProgress = isProcessingForm || isDeletingMatakuliah || isFetchingMatakuliah;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 1) setPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, page]);

  const openAddModal = () => {
    if (!permissions.includes("matakuliah.create")) {
      showErrorToast("Anda tidak memiliki izin untuk menambah data mata kuliah."); return;
    }
    setSelectedMatakuliah(null); setModalOpen(true);
  };
  const openEditModal = (mk) => {
    if (!permissions.includes("matakuliah.update")) {
      showErrorToast("Anda tidak memiliki izin untuk mengedit data mata kuliah."); return;
    }
    setSelectedMatakuliah(mk); setModalOpen(true);
  };
  const handleCloseModal = () => { setModalOpen(false); setSelectedMatakuliah(null); };

  const handleSubmitFromModal = (formDataFromModal) => {
    const isEditing = selectedMatakuliah !== null;
    const mkNameForDialog = isEditing ? selectedMatakuliah.namaMk : formDataFromModal.namaMk;

    if (!isEditing) {
      const kodeMkExists = matakuliahList.some(mk => mk.kodeMk === formDataFromModal.kodeMk);
      if (kodeMkExists) {
        showErrorToast(`Kode MK ${formDataFromModal.kodeMk} sudah terdaftar.`); return;
      }
    }
    const sksNum = parseInt(formDataFromModal.sks, 10);
    const semesterNum = parseInt(formDataFromModal.semester, 10);
    if (isNaN(sksNum) || sksNum <= 0 || sksNum > 6) { showErrorToast("SKS harus angka 1-6."); return; }
    if (isNaN(semesterNum) || semesterNum <= 0 || semesterNum > 8) { showErrorToast("Semester harus angka 1-8."); return; }

    const dataToSubmit = { ...formDataFromModal, sks: sksNum, semester: semesterNum };

    showConfirmationDialog({
      title: `Konfirmasi ${isEditing ? "Perbarui" : "Tambah"} Data`,
      text: `Yakin ${isEditing ? "memperbarui" : "menambahkan"} data mata kuliah ${mkNameForDialog}?`,
      onConfirm: () => {
        if (isEditing) {
          updateMatakuliahMutate(
            { id: selectedMatakuliah.id, dataPayload: { id: selectedMatakuliah.id, ...dataToSubmit } },
            { onSuccess: () => handleCloseModal() }
          );
        } else {
          storeMatakuliahMutate(dataToSubmit, { onSuccess: () => handleCloseModal() });
        }
      }
    });
  };

  const handleDeleteFromTable = (matakuliahId) => {
    if (!permissions.includes("matakuliah.delete")) {
      showErrorToast("Anda tidak memiliki izin untuk menghapus data mata kuliah."); return;
    }
    const mkToDelete = matakuliahList.find(mk => mk.id === matakuliahId);
    if (!mkToDelete) return;

    showConfirmationDialog({
      title: 'Konfirmasi Hapus',
      text: `Yakin hapus data mata kuliah ${mkToDelete.namaMk} (Kode: ${mkToDelete.kodeMk})?`,
      onConfirm: () => deleteMatakuliahMutate(matakuliahId),
      onCancel: () => showInfoToast('Penghapusan dibatalkan.')
    });
  };

  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages || 1));
  const handlePerPageChange = (e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); };
  const handleSortByChange = (e) => { setSortBy(e.target.value); setPage(1); };
  const handleSortOrderChange = (e) => { setSortOrder(e.target.value); setPage(1); };

  if (isLoadingAuth) return <Card><p className="text-center">Memeriksa autentikasi...</p></Card>;
  if (!isAuthenticated || !permissions.includes("matakuliah.page")) {
    return <Card><Heading as="h2" className="text-red-500 text-center">Akses Ditolak</Heading></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Heading as="h2" className="mb-0 text-left">Daftar Mata Kuliah</Heading>
        {permissions.includes("matakuliah.create") && (
          <Button onClick={openAddModal} disabled={isLoadingPage || isProcessingForm}>
            {isProcessingForm ? 'Memproses...' : (isLoadingPage ? 'Memuat...' : '+ Tambah Mata Kuliah')}
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search-mk">Pencarian</Label>
          <Input id="search-mk" type="text" placeholder="Cari Nama, Kode MK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="sort-by-mk">Urutkan Berdasarkan</Label>
          <Select id="sort-by-mk" options={SORT_OPTIONS_MK} value={sortBy} onChange={handleSortByChange} />
        </div>
        <div>
          <Label htmlFor="sort-order-mk">Urutan</Label>
          <Select id="sort-order-mk" options={ORDER_OPTIONS_MK} value={sortOrder} onChange={handleSortOrderChange} />
        </div>
        <div>
          <Label htmlFor="per-page-mk">Item per Halaman</Label>
          <Select id="per-page-mk" options={ITEMS_PER_PAGE_OPTIONS_MK} value={perPage} onChange={handlePerPageChange} />
        </div>
      </div>

      {(isLoadingMatakuliahData || isFetchingMatakuliah) && <p className="text-center my-4">Memuat data mata kuliah...</p>}

      {!isLoadingPage && permissions.includes("matakuliah.read") && (
        <>
          {matakuliahList.length === 0 && !(isLoadingMatakuliahData || isFetchingMatakuliah) && (
            <p className="text-center my-4">
              {debouncedSearchTerm ? `Tidak ada mata kuliah ditemukan untuk "${debouncedSearchTerm}".` : "Belum ada data mata kuliah."}
            </p>
          )}
          {matakuliahList.length > 0 && (
            <MatakuliahTable
              matakuliahList={matakuliahList}
              onEdit={openEditModal}
              onDelete={handleDeleteFromTable}
              canEdit={permissions.includes("matakuliah.update")}
              canDelete={permissions.includes("matakuliah.delete")}
              isLoading={isFetchingMatakuliah}
            />
          )}
          {totalPages > 0 && matakuliahList.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm mb-2 sm:mb-0">
                Hal {page} dari {totalPages} (Total: {totalMatakuliah} mata kuliah)
              </p>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePreviousPage} disabled={page === 1 || isActionInProgress} size="sm" variant="secondary">Sebelumnya</Button>
                <Button onClick={handleNextPage} disabled={page === totalPages || isActionInProgress || totalPages === 0} size="sm" variant="secondary">Selanjutnya</Button>
              </div>
            </div>
          )}
        </>
      )}
      {!isLoadingPage && !permissions.includes("matakuliah.read") && (
        <p className="text-center text-orange-500 my-4">Anda tidak memiliki izin untuk melihat data mata kuliah.</p>
      )}

      {(permissions.includes("matakuliah.create") || permissions.includes("matakuliah.update")) && (
        <MatakuliahModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFromModal}
          selectedMatakuliah={selectedMatakuliah}
          isSubmitting={isProcessingForm}
        />
      )}
    </Card>
  );
};

export default Matakuliah;