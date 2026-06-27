import axios from "axios";

function resolveApiBaseUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://127.0.0.1:8000";
  }

  return null;
}

const apiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl || "",
  timeout: 180000,
  headers: {
    Accept: "application/json",
  },
});
export async function analyzeResume({ file, jobDescription }) {
  if (!apiBaseUrl) {
    throw new Error(
      "Frontend is missing VITE_API_URL. Set it to your live FastAPI backend URL before deploying."
    );
  }

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
      (error.response?.status === 404
        ? "The configured API URL is not serving the ResumeIQ backend endpoints."
        : null) ||
      (error.code === "ECONNABORTED"
        ? "The backend took too long to respond. Check whether the deployed API URL is correct or whether the server is cold-starting."
        : null) ||
      (error.code === "ERR_NETWORK"
        ? "Unable to reach the API. Check that VITE_API_URL points to the real live backend URL."
        : null) ||
      error.message ||
      "Unable to analyze the resume right now.";

    throw new Error(message);
  }
}

export default api;
