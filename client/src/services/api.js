import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, // for cookies (JWT)
});

// ---------- Named exports for all API functions ----------

// Events
export const getPastEvents = () => API.get("/events/past");
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Enquiries
export const submitEnquiry = (data) => API.post("/enquiries", data);
export const getEnquiries = () => API.get("/enquiries");
export const updateEnquiry = (id, data) => API.put(`/enquiries/${id}`, data);

// Uploads
export const uploadSingleImage = (formData) =>
  API.post("/upload/single", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const uploadMultipleImages = (formData) =>
  API.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Services
export const getServices = () => API.get("/services");
export const createService = (data) => API.post("/services", data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// Report
export const sendMonthlyReport = () => API.post("/report/send");

// Default export (Axios instance for direct calls)
export default API;
