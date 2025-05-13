import axiosInstance from '@/lib/axiosInstance'; // adjust your path if needed

export const fetchAssets = async (page: number, pageSize: number) => {
  const response = await axiosInstance.get(`/api/makers/assets/?page=${page}&page_size=${pageSize}`);
  console.log("response.data.items",response.data.items)
  return response.data.items; // because axios wraps response inside { data }
};
