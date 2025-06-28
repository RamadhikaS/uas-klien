import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKelasApi,
  storeKelasApi,
  updateKelasApi,
  deleteKelasApi
} from "../Apis/KelasApi";

import { showSuccessToast, showErrorToast } from "../toastHelper";

const KELAS_QUERY_KEY = "kelas";

export const useGetAllKelas = (queryParams = {}) => {
  return useQuery({
    queryKey: [KELAS_QUERY_KEY, queryParams],
    queryFn: () => getAllKelasApi(queryParams),
    select: (response) => { 
      console.log("useGetAllKelas - SELECT - response:", response); 
      const data = response?.data || [];
      const totalCount = parseInt(response?.headers?.['x-total-count'] || "0", 10);
      console.log("useGetAllKelas - SELECT - extracted:", { data, totalCount }); 
      return { data, totalCount };
    },
    keepPreviousData: true,
    onError: (error) => {  }
  });
};

export const useStoreKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeKelasApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [KELAS_QUERY_KEY] });
      showSuccessToast("Kelas baru berhasil ditambahkan!");
      console.log("Kelas stored:", data);
    },
    onError: (error) => {
      console.error("Error storing kelas (useMutation):", error);
      const errorMessage = error.response?.data?.message || "Gagal menambahkan kelas baru.";
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataPayload }) => updateKelasApi(id, dataPayload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [KELAS_QUERY_KEY] });
      showSuccessToast("Data kelas berhasil diperbarui!"); 
      console.log("Kelas updated:", data);
    },
    onError: (error) => {
      console.error("Error updating kelas (useMutation):", error);
      const errorMessage = error.response?.data?.message || "Gagal memperbarui data kelas.";
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKelasApi, 
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [KELAS_QUERY_KEY] });
      showSuccessToast("Kelas berhasil dihapus!");
      console.log(`Kelas with id ${id} deleted:`, data);
    },
    onError: (error) => {
      console.error("Error deleting kelas (useMutation):", error);
      showErrorToast("Gagal menghapus kelas.");
    },
  });
};