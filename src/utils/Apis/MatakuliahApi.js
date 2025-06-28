import AxiosInstance from "../AxiosInstance";

export const getAllMatakuliah = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/matakuliah", { params });
    return response;
  } catch (error) {
    console.error("Error fetching all mata kuliah:", error);
    throw error;
  }
};

export const getMatakuliahById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/matakuliah/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mata kuliah with id ${id}:`, error);
    throw error;
  }
};

export const storeMatakuliahApi = async (data) => {
  try {
    const response = await AxiosInstance.post("/matakuliah", data);
    return response.data;
  } catch (error) {
    console.error("Error storing mata kuliah:", error);
    throw error;
  }
};

export const updateMatakuliahApi = async (id, data) => {
  try {
    const response = await AxiosInstance.put(`/matakuliah/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating mata kuliah with id ${id}:`, error);
    throw error;
  }
};

export const deleteMatakuliahApi = async (id) => {
  try {
    await AxiosInstance.delete(`/matakuliah/${id}`);
    return {}; 
  } catch (error) {
    console.error(`Error deleting mata kuliah with id ${id}:`, error);
    throw error;
  }
};