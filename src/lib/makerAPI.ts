// lib/openai.ts

import axiosInstance from '@/lib/axiosInstance'; // your axios instance

export const generateModel = async (
  prompt: string,
  style: string,
  complexity: string,
  optimizePrinting: boolean
) => {
  const response = await axiosInstance.post('/api/makers/text-to-model/', {
    prompt,
    style,
    complexity,
    optimize_printing: optimizePrinting, // note: convert camelCase to snake_case
  });
  return response.data;
};

// Function to check task status
export const checkTaskStatus = async (taskId: string,prompt: string,
  style: string,
  complexity: string,
  optimizePrinting: boolean) => {
  const response = await axiosInstance.post(`/api/makers/check-task-status/${taskId}/`, {
    task_id: taskId,
    prompt,
    style,
    complexity,
    optimize_printing: optimizePrinting,

  });
  return response.data;
};

export const checkImageTaskStatus = async (taskId: string) => {
  const response = await axiosInstance.post(`/api/makers/check-image-task-status/${taskId}/`, {
    task_id: taskId
  });
  return response.data;
};

export const generateImageToModel = async (file: File) => {
  const formData = new FormData()
  formData.append("image", file)

  try {
    const response = await axiosInstance.post(
      "/api/makers/image-to-model/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error("Error generating 3D model:", error)
    throw error
  }
}
