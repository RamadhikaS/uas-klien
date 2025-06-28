import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen, 
  storeDosenApi,
  updateDosenApi,
  deleteDosenApi
} from "../Apis/DosenApi";
import { showSuccessToast, showErrorToast } from "../toastHelper";

const DOSEN_QUERY_KEY = "dosen";

export const useGetAllDosen = (queryParams = {}) => {
  return useQuery({
    queryKey: [DOSEN_QUERY_KEY, queryParams], 
    queryFn: () => getAllDosen(queryParams),  
    select: (response) => { 
      const data = response?.data || [];
      const totalCount = parseInt(response?.headers?.['x-total-count'] || "0", 10);
      return {
        data,
        totalCount,
      };
    },
    keepPreviousData: true, 
    onError: (error) => {
      console.error("Error fetching dosen (useGetAllDosen hook):", error);
      showErrorToast("Gagal mengambil data dosen dari server.");
    }
  });
};

export const useStoreDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeDosenApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DOSEN_QUERY_KEY] });
      showSuccessToast("Data dosen berhasil ditambahkan!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Gagal menambahkan data dosen.";
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataPayload }) => updateDosenApi(id, dataPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOSEN_QUERY_KEY] });
      showSuccessToast("Data dosen berhasil diperbarui!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Gagal memperbarui data dosen.";
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDosenApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOSEN_QUERY_KEY] });
      showSuccessToast("Data dosen berhasil dihapus!");
    },
    onError: (error) => {
      showErrorToast("Gagal menghapus data dosen.");
    },
  });
};
