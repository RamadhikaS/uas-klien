import AxiosInstance from "../AxiosInstance";

export const loginApi = async (email, password) => {
  try {
    const response = await AxiosInstance.get("/user", { params: { email } });
    const users = response.data;

    if (!users || users.length === 0) {
      throw new Error("Email tidak ditemukan");
    }

    const user = users[0];

    if (user.password !== password) {
      throw new Error("Password salah");
    }

    return user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
  
};export const registerApi = async (userData) => {
  try {
    const checkEmailResponse = await AxiosInstance.get("/user", { params: { email: userData.email } });
    if (checkEmailResponse.data && checkEmailResponse.data.length > 0) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }
    const response = await AxiosInstance.post("/user", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.message || error);
    throw error;
  }
};

