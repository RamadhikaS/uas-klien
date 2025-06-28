import AxiosInstance from "../AxiosInstance";

export const getAllDosen = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/dosen", { params });
    return response;
  } catch (error) {
    console.error("Error fetching all dosen:", error);
    throw error;
  }
};

export const getDosenById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/dosen/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dosen with id ${id}:`, error);
    throw error;
  }
};

export const storeDosenApi = async (data) => {
  try {
    const response = await AxiosInstance.post("/dosen", data);
    return response.data;
  } catch (error) {
    console.error("Error storing dosen:", error);
    throw error;
  }
};

export const updateDosenApi = async (id, data) => {
  try {
    const response = await AxiosInstance.put(`/dosen/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating dosen with id ${id}:`, error);
    throw error;
  }
};

export const deleteDosenApi = async (id) => {
  try {
    await AxiosInstance.delete(`/dosen/${id}`);
    return { message: "Dosen berhasil dihapus" };
  } catch (error) {
    console.error(`Error deleting dosen with id ${id}:`, error);
    throw error;
  }
};