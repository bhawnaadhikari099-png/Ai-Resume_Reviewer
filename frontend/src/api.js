import axios from "axios";

const BASE = "http://localhost:5000/api/review";

// Send PDF file to backend
export async function reviewPDF(file, jobRole) {
  const form = new FormData();
  form.append("resume", file);
  form.append("jobRole", jobRole);

  const { data } = await axios.post(`${BASE}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// Send plain text to backend
export async function reviewText(resumeText, jobRole) {
  const { data } = await axios.post(`${BASE}/text`, {
    resumeText,
    jobRole,
  });
  return data;
}