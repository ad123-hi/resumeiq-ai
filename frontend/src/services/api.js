import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = import.meta.env.DEV
  ? "http://127.0.0.1:8000"
  : "https://resumeiq-backend.onrender.com";

const api = axios.create({
  baseURL: (configuredApiUrl || defaultApiUrl).replace(/\/+$/, ""),
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});
export async function analyzeResume({ file, jobDescription }) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  try {
    const { data } = await api.post("/resume/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      (error.code === "ERR_NETWORK"
        ? "Unable to reach the API. Check that the deployed frontend points to the live backend URL."
        : null) ||
      error.message ||
      "Unable to analyze the resume right now.";

    throw new Error(message);
  }
}

export default api;
