import AxiosInstance from "../AxiosInstance"; 

export const getAllKelasApi = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/kelas", { params });
    return response;
  } catch (error) {
    console.error("Error fetching all kelas:", error);
    throw error;
  }
};

export const getKelasByIdApi = async (id) => {
  try {
    const response = await AxiosInstance.get(`/kelas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching kelas with id ${id}:`, error);
    throw error;
  }
};

export const storeKelasApi = async (data) => {
  try {
    const response = await AxiosInstance.post("/kelas", data);
    return response.data;
  } catch (error) {
    console.error("Error storing kelas:", error);
    throw error;
  }
};

export const updateKelasApi = async (id, data) => {
  try {
    const response = await AxiosInstance.put(`/kelas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating kelas with id ${id}:`, error);
    throw error;
  }
};

export const deleteKelasApi = async (id) => {
  try {
    await AxiosInstance.delete(`/kelas/${id}`);
    return { message: "Kelas berhasil dihapus" };
  } catch (error) {
    console.error(`Error deleting kelas with id ${id}:`, error);
    throw error;
  }
};