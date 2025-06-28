
import AxiosInstance from "../AxiosInstance";

export const getAllMahasiswa = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/mahasiswa", { params });
    return response;
  } catch (error) {
    console.error("Error fetching all mahasiswa:", error);
    throw error;
  }
};

export const getMahasiswaById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/mahasiswa/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mahasiswa with id ${id}:`, error);
    throw error;
  }
};

export const storeMahasiswaApi = async (data) => { 
  try {
    const response = await AxiosInstance.post("/mahasiswa", data);
    return response.data;
  } catch (error) {
    console.error("Error storing mahasiswa:", error);
    throw error;
  }
};

export const updateMahasiswaApi = async (id, data) => {
  try {
    const response = await AxiosInstance.put(`/mahasiswa/${id}`, data);
    return response.data;
  } catch (error)
 {
    console.error(`Error updating mahasiswa with id ${id}:`, error);
    throw error;
  }
};

export const deleteMahasiswaApi = async (id) => {
  try {
    const response = await AxiosInstance.delete(`/mahasiswa/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting mahasiswa with id ${id}:`, error);
    throw error;
  }
};