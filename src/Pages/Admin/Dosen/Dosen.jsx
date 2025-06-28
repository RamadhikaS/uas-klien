import React, { useState, useEffect, useMemo } from 'react';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import DosenTable from './DosenTable';
import DosenModal from './DosenModal';
import Input from "../../../Components/Input";
import Select from "../../../Components/Select";
import Label from "../../../Components/Label"; 

import {
  useGetAllDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen
} from "../../../utils/Hooks/useDosen";

import { showInfoToast, showErrorToast } from "../../../utils/toastHelper";
import { showConfirmationDialog } from "../../../utils/swalHelper";
import { useAuthStateContext } from '../../../utils/Contexts/AuthContext';

const ITEMS_PER_PAGE_OPTIONS_DSN = [ 
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
];
const SORT_OPTIONS_DSN = [
    { value: "namaDosen", label: "Nama Dosen" },
    { value: "nidn", label: "NIDN" },
    { value: "max_sks", label: "Max SKS" },
    { value: "bidangKeahlian", label: "Bidang Keahlian" },
];
const ORDER_OPTIONS_DSN = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

const Dosen = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const permissions = user?.permission || [];

  // State untuk pagination, sorting, searching
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE_OPTIONS_DSN[0].value);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS_DSN[0].value);
  const [sortOrder, setSortOrder] = useState(ORDER_OPTIONS_DSN[0].value);
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
    data: dosenResult,
    isLoading: isLoadingDosenData,
    isFetching: isFetchingDosen,
  } = useGetAllDosen(queryParams);

  const dosenList = dosenResult?.data || [];
  const totalDosen = dosenResult?.totalCount || 0;
  const totalPages = Math.ceil(totalDosen / perPage);

  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { mutate: storeDosenMutate, isLoading: isStoringDosen } = useStoreDosen();
  const { mutate: updateDosenMutate, isLoading: isUpdatingDosen } = useUpdateDosen();
  const { mutate: deleteDosenMutate, isLoading: isDeletingDosen } = useDeleteDosen();

  const isLoadingPage = isLoadingAuth || isLoadingDosenData;
  const isProcessingForm = isStoringDosen || isUpdatingDosen;
  const isActionInProgress = isProcessingForm || isDeletingDosen || isFetchingDosen;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 1) setPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, page]);

  const openAddModal = () => {
    if (!permissions.includes("dosen.create")) {
      showErrorToast("Anda tidak memiliki izin untuk menambah data dosen."); return;
    }
    setSelectedDosen(null); setModalOpen(true);
  };
  const openEditModal = (dsn) => {
    if (!permissions.includes("dosen.update")) {
      showErrorToast("Anda tidak memiliki izin untuk mengedit data dosen."); return;
    }
    setSelectedDosen(dsn); setModalOpen(true);
  };
  const handleCloseModal = () => { setModalOpen(false); setSelectedDosen(null); };

  const handleSubmitFromModal = (formDataFromModal) => {
    const isEditing = selectedDosen !== null;
    const dosenNameForDialog = isEditing ? selectedDosen.namaDosen : formDataFromModal.namaDosen;

    if (!isEditing) {
      const nidnExists = dosenList.some(d => d.nidn === formDataFromModal.nidn);
      if (nidnExists) {
        showErrorToast(`NIDN ${formDataFromModal.nidn} sudah terdaftar.`); return;
      }
    }
    if (isNaN(parseInt(formDataFromModal.max_sks, 10)) || parseInt(formDataFromModal.max_sks, 10) < 0) {
        showErrorToast("Max SKS harus berupa angka positif atau nol."); return;
    }
    const dataToSubmit = { ...formDataFromModal, max_sks: parseInt(formDataFromModal.max_sks, 10) };

    showConfirmationDialog({
      title: `Konfirmasi ${isEditing ? "Perbarui" : "Tambah"} Data`,
      text: `Yakin ${isEditing ? "memperbarui" : "menambahkan"} data dosen ${dosenNameForDialog}?`,
      onConfirm: () => {
        if (isEditing) {
          updateDosenMutate(
            { id: selectedDosen.id, dataPayload: { id: selectedDosen.id, ...dataToSubmit } },
            { onSuccess: () => handleCloseModal() }
          );
        } else {
          storeDosenMutate(dataToSubmit, { onSuccess: () => handleCloseModal() });
        }
      }
    });
  };

  const handleDeleteFromTable = (dosenId) => {
    if (!permissions.includes("dosen.delete")) {
      showErrorToast("Anda tidak memiliki izin untuk menghapus data dosen."); return;
    }
    const dsnToDelete = dosenList.find(d => d.id === dosenId);
    if (!dsnToDelete) return;

    showConfirmationDialog({
      title: 'Konfirmasi Hapus',
      text: `Yakin hapus data dosen ${dsnToDelete.namaDosen} (NIDN: ${dsnToDelete.nidn})?`,
      onConfirm: () => deleteDosenMutate(dosenId),
      onCancel: () => showInfoToast('Penghapusan dibatalkan.')
    });
  };

  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages || 1));
  const handlePerPageChange = (e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); };
  const handleSortByChange = (e) => { setSortBy(e.target.value); setPage(1); };
  const handleSortOrderChange = (e) => { setSortOrder(e.target.value); setPage(1); };

  if (isLoadingAuth) return <Card><p className="text-center">Memeriksa autentikasi...</p></Card>;
  if (!isAuthenticated || !permissions.includes("dosen.page")) {
    return <Card><Heading as="h2" className="text-red-500 text-center">Akses Ditolak</Heading></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Heading as="h2" className="mb-0 text-left">Daftar Dosen</Heading>
        {permissions.includes("dosen.create") && (
          <Button onClick={openAddModal} disabled={isLoadingPage || isProcessingForm}>
            {isProcessingForm ? 'Memproses...' : (isLoadingPage ? 'Memuat...' : '+ Tambah Dosen')}
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search-dosen">Pencarian</Label>
          <Input id="search-dosen" type="text" placeholder="Cari Nama, NIDN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="sort-by-dosen">Urutkan Berdasarkan</Label>
          <Select id="sort-by-dosen" options={SORT_OPTIONS_DSN} value={sortBy} onChange={handleSortByChange} />
        </div>
        <div>
          <Label htmlFor="sort-order-dosen">Urutan</Label>
          <Select id="sort-order-dosen" options={ORDER_OPTIONS_DSN} value={sortOrder} onChange={handleSortOrderChange} />
        </div>
        <div>
          <Label htmlFor="per-page-dosen">Item per Halaman</Label>
          <Select id="per-page-dosen" options={ITEMS_PER_PAGE_OPTIONS_DSN} value={perPage} onChange={handlePerPageChange} />
        </div>
      </div>

      {(isLoadingDosenData || isFetchingDosen) && <p className="text-center my-4">Memuat data dosen...</p>}

      {!isLoadingPage && permissions.includes("dosen.read") && (
        <>
          {dosenList.length === 0 && !(isLoadingDosenData || isFetchingDosen) && (
            <p className="text-center my-4">
              {debouncedSearchTerm ? `Tidak ada dosen ditemukan untuk "${debouncedSearchTerm}".` : "Belum ada data dosen."}
            </p>
          )}
          {dosenList.length > 0 && (
            <DosenTable
              dosenList={dosenList}
              onEdit={openEditModal}
              onDelete={handleDeleteFromTable}
              canEdit={permissions.includes("dosen.update")}
              canDelete={permissions.includes("dosen.delete")}
              isLoading={isFetchingDosen}
            />
          )}
          {totalPages > 0 && dosenList.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm mb-2 sm:mb-0">
                Hal {page} dari {totalPages} (Total: {totalDosen} dosen)
              </p>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePreviousPage} disabled={page === 1 || isActionInProgress} size="sm" variant="secondary">Sebelumnya</Button>
                <Button onClick={handleNextPage} disabled={page === totalPages || isActionInProgress || totalPages === 0} size="sm" variant="secondary">Selanjutnya</Button>
              </div>
            </div>
          )}
        </>
      )}
      {!isLoadingPage && !permissions.includes("dosen.read") && (
        <p className="text-center text-orange-500 my-4">Anda tidak memiliki izin untuk melihat data dosen.</p>
      )}

      {(permissions.includes("dosen.create") || permissions.includes("dosen.update")) && (
        <DosenModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFromModal}
          selectedDosen={selectedDosen}
          isSubmitting={isProcessingForm}
        />
      )}
    </Card>
  );
};

export default Dosen;