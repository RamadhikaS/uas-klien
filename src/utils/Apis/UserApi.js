import AxiosInstance from "../AxiosInstance";

export const getAllUsersApi = async () => {
  try {
    const response = await AxiosInstance.get("/pengguna");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getUserByIdApi = async (id) => {
  try {
    const response = await AxiosInstance.get(`/pengguna/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const updateUserApi = async (id, userData) => {
  try {
    const response = await AxiosInstance.put(`/pengguna/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const deleteUserApi = async (id) => {
  try {
    await AxiosInstance.delete(`/pengguna/${id}`);
    return { message: "User berhasil dihapus" };
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};