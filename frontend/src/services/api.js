import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
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
      error.message ||
      "Unable to analyze the resume right now.";

    throw new Error(message);
  }
}

export default api;
