
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswaApi,
  updateMahasiswaApi,
  deleteMahasiswaApi
} from "../Apis/MahasiswaApi";
import { showSuccessToast, showErrorToast } from "../toastHelper";

const MAHASISWA_QUERY_KEY = "mahasiswa";

export const useGetAllMahasiswa = (queryParams = {}) => { 
  return useQuery({
    queryKey: [MAHASISWA_QUERY_KEY, queryParams],
    queryFn: () => getAllMahasiswa(queryParams), 
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
      console.error("Error fetching mahasiswa (useGetAllMahasiswa hook):", error);
      showErrorToast("Gagal mengambil data mahasiswa dari server.");
    }
  });
};

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswaApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [MAHASISWA_QUERY_KEY] });
      showSuccessToast("Mahasiswa berhasil ditambahkan!");
      console.log("Mahasiswa stored:", data);
    },
    onError: (error) => {
      console.error("Error storing mahasiswa (useMutation):", error);
      const errorMessage = error.response?.data?.message || "Gagal menambahkan mahasiswa.";
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataPayload }) => updateMahasiswaApi(id, dataPayload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [MAHASISWA_QUERY_KEY] });
      showSuccessToast("Mahasiswa berhasil diperbarui!");
      console.log("Mahasiswa updated:", data);
    },
    onError: (error) => {
      console.error("Error updating mahasiswa (useMutation):", error);
      const errorMessage = error.response?.data?.message || "Gagal memperbarui mahasiswa.";
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswaApi,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [MAHASISWA_QUERY_KEY] });
      showSuccessToast("Mahasiswa berhasil dihapus!");
      console.log(`Mahasiswa with id ${id} deleted:`, data);
    },
    onError: (error) => {
      console.error("Error deleting mahasiswa (useMutation):", error);
      showErrorToast("Gagal menghapus mahasiswa.");
    },
  });
};