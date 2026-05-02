import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const createSession = (student_name, class_name) =>
  api.post("/sessions", { student_name, class_name }).then((r) => r.data);

export const getSession = (id) =>
  api.get(`/sessions/${id}`).then((r) => r.data);

export const updateScene = (id, payload) =>
  api.put(`/sessions/${id}/scene`, payload).then((r) => r.data);

export const completeSession = (id) =>
  api.post(`/sessions/${id}/complete`).then((r) => r.data);

export const listTeacherSessions = () =>
  api.get("/teacher/sessions").then((r) => r.data);

export const teacherStats = () =>
  api.get("/teacher/stats").then((r) => r.data);
