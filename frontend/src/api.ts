import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const uploadFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const askQuestion = async (question: string): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/ask`, null, {
    params: { question },
  });
  return response.data.answer;
};
