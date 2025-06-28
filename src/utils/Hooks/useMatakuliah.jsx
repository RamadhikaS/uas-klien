import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatakuliah, // Fungsi API dari MatakuliahApi.js
  storeMatakuliahApi,
  updateMatakuliahApi,
  deleteMatakuliahApi
} from "../Apis/MatakuliahApi";

import { showSuccessToast, showErrorToast } from "../toastHelper";

const MATAKULIAH_QUERY_KEY = "matakuliah";

// == PERBAIKI HOOK INI ==
export const useGetAllMatakuliah = (queryParams = {}) => { // Terima queryParams
  return useQuery({
    queryKey: [MATAKULIAH_QUERY_KEY, queryParams], // Sertakan queryParams di queryKey
    queryFn: () => getAllMatakuliah(queryParams),  // Panggil API dengan queryParams
    select: (response) => { // Proses seluruh response dari Axios
      const data = response?.data || [];
      const totalCount = parseInt(response?.headers?.['x-total-count'] || "0", 10);
      return {
        data,
        totalCount,
      };
    },
    keepPreviousData: true, // Untuk UX pagination yang lebih baik
    onError: (error) => {
      console.error("Error fetching mata kuliah (useGetAllMatakuliah hook):", error);
      showErrorToast("Gagal mengambil data mata kuliah dari server."); // Kembalikan toast error
    }
  });
};

// Hook mutasi lainnya (useStoreMatakuliah, useUpdateMatakuliah, useDeleteMatakuliah)
// sudah benar dan tidak perlu diubah karena mereka mengandalkan invalidasi queryKey dasar.

export const useStoreMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMatakuliahApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [MATAKULIAH_QUERY_KEY] });
      showSuccessToast("Mata kuliah berhasil ditambahkan!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Gagal menambahkan mata kuliah.";
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataPayload }) => updateMatakuliahApi(id, dataPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATAKULIAH_QUERY_KEY] });
      showSuccessToast("Mata kuliah berhasil diperbarui!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Gagal memperbarui mata kuliah.";
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatakuliahApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATAKULIAH_QUERY_KEY] });
      showSuccessToast("Mata kuliah berhasil dihapus!");
    },
    onError: (error) => {
      showErrorToast("Gagal menghapus mata kuliah.");
    },
  });
};