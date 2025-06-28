import { useQuery } from "@tanstack/react-query";
import { getAllChartDataApi } from "../Apis/ChartApi"; 
import { showErrorToast } from "../toastHelper"; 

const CHART_DATA_QUERY_KEY = "chartData";
export const useGetChartData = () => {
  return useQuery({
    queryKey: [CHART_DATA_QUERY_KEY], 
    queryFn: getAllChartDataApi,
    select: (data) => data || {}, 
    staleTime: 5 * 60 * 1000, 
    onError: (error) => {
      console.error("Error fetching chart data (useGetChartData hook):", error);
      showErrorToast("Gagal memuat data untuk chart."); 
    }
  });
};