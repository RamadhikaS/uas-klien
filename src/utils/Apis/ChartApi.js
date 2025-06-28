import AxiosInstance from "../AxiosInstance";

export const getAllChartDataApi = async () => { 
  try {
    const response = await AxiosInstance.get("/chart");
    return response.data;
  } catch (error) {
    console.error("Error fetching all chart data:", error);
    throw error; 
  }
};