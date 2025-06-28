import React, { useState, useEffect, useMemo } from 'react';
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Button from "../../../Components/Button";
import TableRencanaStudi from './TableRencanaStudi';
import ModalRencanaStudi from './ModalRencanaStudi';
import Input from "../../../Components/Input";
import Select from "../../../Components/Select";
import Label from "../../../Components/Label";

import {
  useGetAllKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas
} from "../../../utils/Hooks/useKelas";
import { useGetAllDosen } from "../../../utils/Hooks/useDosen";
import { useGetAllMahasiswa } from "../../../utils/Hooks/useMahasiswa";
import { useGetAllMatakuliah } from "../../../utils/Hooks/useMatakuliah";

import { showSuccessToast, showErrorToast, showInfoToast } from "../../../utils/toastHelper";
import { showConfirmationDialog } from "../../../utils/swalHelper";
import { useAuthStateContext } from '../../../utils/Contexts/AuthContext';

const ITEMS_PER_PAGE_OPTIONS_KLS = [
    { value: 3, label: "3 Kelas" }, 
    { value: 5, label: "5 Kelas" },
    { value: 10, label: "10 Kelas" },
];
const SORT_OPTIONS_KLS = [ 
    { value: "id", label: "ID Kelas" },
];
const ORDER_OPTIONS_KLS = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];


const RencanaStudi = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const permissions = user?.permission || [];

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE_OPTIONS_KLS[0].value);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS_KLS[0].value);
  const [sortOrder, setSortOrder] = useState(ORDER_OPTIONS_KLS[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const kelasQueryParams = useMemo(() => ({
    q: debouncedSearchTerm,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: perPage,
    _expand: ["dosen", "matakuliah"]
  }), [debouncedSearchTerm, sortBy, sortOrder, page, perPage]);

  const {
    data: kelasResult, 
    isLoading: isLoadingKelasData,
    isFetching: isFetchingKelas,
  } = useGetAllKelas(kelasQueryParams);

  console.log("Hasil dari useGetAllKelas:", kelasResult);

  const kelasList = kelasResult?.data || []; 
  const totalKelas = kelasResult?.totalCount || 0;
  const totalPages = Math.ceil(totalKelas / perPage);

  const { data: dosenResult, isLoading: isLoadingDosen } = useGetAllDosen({});
  const dosenList = dosenResult?.data || [];

  const { data: mahasiswaResult, isLoading: isLoadingMahasiswa } = useGetAllMahasiswa({});
  const mahasiswaList = mahasiswaResult?.data || []; 

  const { data: matakuliahResult, isLoading: isLoadingMatakuliah } = useGetAllMatakuliah({});
  const matakuliahList = matakuliahResult?.data || []; 

  

  const [isModalTambahKelasOpen, setIsModalTambahKelasOpen] = useState(false);
  const [selectedMhsPerKelas, setSelectedMhsPerKelas] = useState({});
  const [selectedDsnPerKelas, setSelectedDsnPerKelas] = useState({});

  const { mutate: storeKelasMutate, isLoading: isStoringKelas } = useStoreKelas();
  const { mutate: updateKelasMutate, isLoading: isUpdatingKelas } = useUpdateKelas();
  const { mutate: deleteKelasMutate, isLoading: isDeletingKelas } = useDeleteKelas();

  const isLoadingPage = isLoadingAuth || isLoadingKelasData || isLoadingDosen || isLoadingMahasiswa || isLoadingMatakuliah;
  const isProcessingForm = isStoringKelas;
  const isProcessingActionOnTable = isUpdatingKelas || isDeletingKelas || isFetchingKelas;


  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 1) setPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, page]);

   const mataKuliahSudahAdaKelasIds = useMemo(() => (kelasList || []).map(k => k.mata_kuliah_id), [kelasList]);
  const mataKuliahBelumAdaKelas = useMemo(() => (matakuliahList || []).filter(mk => !mataKuliahSudahAdaKelasIds.includes(mk.id)), [matakuliahList, mataKuliahSudahAdaKelasIds]);

  const getSksMatakuliah = (matakuliahId) => (matakuliahList || []).find(mk => mk.id === matakuliahId)?.sks || 0;
  const getNamaMatakuliah = (matakuliahId) => (matakuliahList || []).find(mk => mk.id === matakuliahId)?.namaMk || 'N/A';
  const getNamaDosen = (dosenId) => (dosenList || []).find(d => d.id === dosenId)?.namaDosen || 'N/A';
  const getNamaMahasiswa = (mahasiswaId) => (mahasiswaList || []).find(m => m.id === mahasiswaId)?.nama || 'N/A';
  const getMaxSksMahasiswa = (mahasiswaId) => (mahasiswaList || []).find(m => m.id === mahasiswaId)?.max_sks || 0;
  const getMaxSksDosen = (dosenId) => (dosenList || []).find(d => d.id === dosenId)?.max_sks || 0;

  const getTotalSksDiampuDosen = (dosenId, kelasSaatIniIdToExclude = null) => {
    return (kelasList || []) 
      .filter(k => k.dosen_id === dosenId && k.id !== kelasSaatIniIdToExclude)
      .map(k => getSksMatakuliah(k.mata_kuliah_id))
      .reduce((acc, currentSks) => acc + currentSks, 0);
  };

  const getTotalSksDiambilMahasiswa = (mahasiswaId) => {
    return (kelasList || [])
      .filter(k => (k.mahasiswa_ids || []).includes(String(mahasiswaId)))
      .map(k => getSksMatakuliah(k.mata_kuliah_id))
      .reduce((acc, currentSks) => acc + currentSks, 0);
  };

  const handleStoreKelas = (formDataFromModal) => {
    const { mata_kuliah_id, dosen_id } = formDataFromModal;
    const dosenDipilih = dosenList.find(d => d.id === dosen_id);
    const sksMatkulDipilih = getSksMatakuliah(mata_kuliah_id);
    const totalSksDosenSaatIni = getTotalSksDiampuDosen(dosen_id);

    if (dosenDipilih && (totalSksDosenSaatIni + sksMatkulDipilih > dosenDipilih.max_sks)) {
      showErrorToast(`Dosen ${dosenDipilih.namaDosen} akan melebihi batas SKS.`); return;
    }
    showConfirmationDialog({
      title: "Konfirmasi Tambah Kelas", 
      onConfirm: () => storeKelasMutate(formDataFromModal, { onSuccess: () => closeModalTambahKelas() })
    });
  };

  const handleUpdateKelasDosen = (kelasItem, dosenIdBaru) => {
    if (!dosenIdBaru) { showErrorToast("Pilih dosen."); return; }
    const dosenBaru = dosenList.find(d => d.id === dosenIdBaru);
    const sksKelasIni = getSksMatakuliah(kelasItem.mata_kuliah_id);
    const totalSksDosenLain = getTotalSksDiampuDosen(dosenIdBaru, kelasItem.id);

    if (dosenBaru && (totalSksDosenLain + sksKelasIni > dosenBaru.max_sks)) {
      showErrorToast(`Dosen ${dosenBaru.namaDosen} melebihi batas SKS.`);
      setSelectedDsnPerKelas(prev => ({ ...prev, [kelasItem.id]: kelasItem.dosen_id })); return;
    }
    const dataUpdate = { ...kelasItem, dosen_id: dosenIdBaru };
    showConfirmationDialog({
      title: "Konfirmasi Ganti Dosen", 
      onConfirm: () => updateKelasMutate({ id: kelasItem.id, dataPayload: dataUpdate }, {
        onSuccess: () => setSelectedDsnPerKelas(prev => ({ ...prev, [kelasItem.id]: "" }))
      }),
      onCancel: () => setSelectedDsnPerKelas(prev => ({ ...prev, [kelasItem.id]: kelasItem.dosen_id }))
    });
  };

  const handleAddMahasiswaToKelas = (kelasItem, mahasiswaId) => {
    if (!mahasiswaId) { showErrorToast("Pilih mahasiswa."); return; }
    const sksMKIni = getSksMatakuliah(kelasItem.mata_kuliah_id);
    const totalSksMhs = getTotalSksDiambilMahasiswa(mahasiswaId);
    const maxSksMhs = getMaxSksMahasiswa(mahasiswaId);
    if (totalSksMhs + sksMKIni > maxSksMhs) {
        showErrorToast(`Mahasiswa melebihi batas SKS (${maxSksMhs}).`);
        setSelectedMhsPerKelas(prev => ({ ...prev, [kelasItem.id]: "" })); return;
    }
    const dataUpdate = { ...kelasItem, mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mahasiswaId] };
    updateKelasMutate({ id: kelasItem.id, dataPayload: dataUpdate }, {
        onSuccess: () => {
            showSuccessToast(`Mahasiswa "${getNamaMahasiswa(mahasiswaId)}" ditambahkan.`);
            setSelectedMhsPerKelas(prev => ({ ...prev, [kelasItem.id]: "" }));
        }
    });
  };

  const handleDeleteMahasiswaFromKelas = (kelasItem, mahasiswaId) => {
    const dataUpdate = { ...kelasItem, mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter(id => id !== mahasiswaId) };
    showConfirmationDialog({
        title: "Konfirmasi Keluarkan Mahasiswa", /* ... */
        onConfirm: () => updateKelasMutate({ id: kelasItem.id, dataPayload: dataUpdate }, {
            onSuccess: () => showSuccessToast(`Mahasiswa "${getNamaMahasiswa(mahasiswaId)}" dikeluarkan.`)
        })
    });
  };

  const handleDeleteKelas = (kelasId) => {
    const kls = kelasList.find(k => k.id === kelasId); 
    showConfirmationDialog({
      title: "Konfirmasi Hapus Kelas", 
      onConfirm: () => deleteKelasMutate(kelasId)
    });
  };

  const openModalTambahKelas = () => { if (permissions.includes("rencana-studi.create")) setIsModalTambahKelasOpen(true); else showErrorToast("Akses ditolak."); };
  const closeModalTambahKelas = () => { setIsModalTambahKelasOpen(false); };

  const handleKelasPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleKelasNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages || 1));
  const handleKelasPerPageChange = (e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); };
  const handleKelasSortByChange = (e) => { setSortBy(e.target.value); setPage(1); };
  const handleKelasSortOrderChange = (e) => { setSortOrder(e.target.value); setPage(1); };


  if (isLoadingAuth) return <Card><p className="text-center">Memeriksa autentikasi...</p></Card>;
  if (!isAuthenticated || !permissions.includes("rencana-studi.page")) {
    return <Card><Heading as="h2" className="text-red-500 text-center">Akses Ditolak</Heading></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <Heading as="h2" className="mb-0 text-left">Manajemen Rencana Studi & Kelas</Heading>
        {permissions.includes("rencana-studi.create") && (
          <Button onClick={openModalTambahKelas} disabled={isLoadingPage || isProcessingForm}>
            {isProcessingForm ? 'Memproses...' : (isLoadingPage ? 'Memuat...' : '+ Tambah Kelas Baru')}
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search-kelas">Cari Kelas (MK/Dosen)</Label> 
          <Input id="search-kelas" type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="sort-by-kelas">Urutkan Kelas Berdasarkan</Label>
          <Select id="sort-by-kelas" options={SORT_OPTIONS_KLS} value={sortBy} onChange={handleKelasSortByChange} />
        </div>
        <div>
          <Label htmlFor="sort-order-kelas">Urutan</Label>
          <Select id="sort-order-kelas" options={ORDER_OPTIONS_KLS} value={sortOrder} onChange={handleKelasSortOrderChange} />
        </div>
        <div>
          <Label htmlFor="per-page-kelas">Kelas per Halaman</Label>
          <Select id="per-page-kelas" options={ITEMS_PER_PAGE_OPTIONS_KLS} value={perPage} onChange={handleKelasPerPageChange} />
        </div>
      </div>

      {(isLoadingKelasData || isFetchingKelas) && <p className="text-center my-4">Memuat data kelas...</p>}
      
      {!isLoadingPage && permissions.includes("rencana-studi.read") && (
        <>
          {(kelasList || []).length === 0 && !(isLoadingKelasData || isFetchingKelas) && (
            <p className="text-center my-4">
              {debouncedSearchTerm ? `Tidak ada kelas ditemukan untuk "${debouncedSearchTerm}".` : "Belum ada data kelas."}
            </p>
          )}
          {(kelasList || []).length > 0 && (
            <TableRencanaStudi
              kelas={kelasList} 
              dosenList={dosenList} 
              mahasiswaList={mahasiswaList} 
              matakuliahList={matakuliahList} 
              selectedMhsPerKelas={selectedMhsPerKelas}
              setSelectedMhsPerKelas={setSelectedMhsPerKelas}
              selectedDsnPerKelas={selectedDsnPerKelas}
              setSelectedDsnPerKelas={setSelectedDsnPerKelas}
              onUpdateDosenInKelas={handleUpdateKelasDosen}
              onAddMahasiswaToKelas={handleAddMahasiswaToKelas}
              onDeleteMahasiswaFromKelas={handleDeleteMahasiswaFromKelas}
              onDeleteKelas={handleDeleteKelas}
              getTotalSksDiambilMahasiswa={getTotalSksDiambilMahasiswa}
              getNamaMatakuliah={getNamaMatakuliah}
              getNamaDosen={getNamaDosen}
              getNamaMahasiswa={getNamaMahasiswa}
              canUpdateKelas={permissions.includes("rencana-studi.update")}
              canDeleteKelas={permissions.includes("rencana-studi.delete")}
              isProcessingAction={isProcessingActionOnTable}
            />
          )}
          {totalPages > 0 && (kelasList || []).length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm mb-2 sm:mb-0">
                Hal {page} dari {totalPages} (Total: {totalKelas} kelas)
              </p>
              <div className="flex items-center space-x-2">
                <Button onClick={handleKelasPrevPage} disabled={page === 1 || isActionInProgress} size="sm" variant="secondary">Sebelumnya</Button>
                <Button onClick={handleKelasNextPage} disabled={page === totalPages || isActionInProgress || totalPages === 0} size="sm" variant="secondary">Selanjutnya</Button>
              </div>
            </div>
          )}
        </>
      )}
      {!isLoadingPage && !permissions.includes("rencana-studi.read") && (
          <p className="text-center text-orange-500 my-4">Anda tidak memiliki izin untuk melihat data rencana studi.</p>
      )}

      {permissions.includes("rencana-studi.create") && (
        <ModalRencanaStudi
          isOpen={isModalTambahKelasOpen}
          onClose={closeModalTambahKelas}
          onSubmit={handleStoreKelas}
          dosenList={dosenList || []}
          mataKuliahBelumAdaKelas={mataKuliahBelumAdaKelas || []}
          isSubmitting={isProcessingForm}
        />
      )}
    </Card>
  );
};

export default RencanaStudi;