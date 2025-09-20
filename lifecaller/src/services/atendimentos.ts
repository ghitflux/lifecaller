import { http } from "./http";
export type ID = number|string;

export function getQueue(name: string, params?: any) {
  return http.get(`/atendimentos/queue/${name}/`, { params }).then(r=>r.data);
}
export function getItem(id: ID) {
  return http.get(`/atendimentos/${id}/`).then(r=>r.data);
}
export function actions(id: ID) {
  return http.get(`/atendimentos/${id}/actions/`).then(r=>r.data);
}
export function claim(id: ID) {
  return http.post(`/atendimentos/${id}/claim/`, {}).then(r=>r.data);
}
export function releaseItem(id: ID) {
  return http.post(`/atendimentos/${id}/release/`, {}).then(r=>r.data);
}
export function forward(id: ID, payload: any) {
  return http.post(`/atendimentos/${id}/forward/`, payload).then(r=>r.data);
}
export function importCsvFormData(fd: FormData) {
  return http.post(`/atendimentos/import_csv/`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(r=>r.data);
}
export function addNote(id: ID, note: string) {
  return http.post(`/atendimentos/${id}/note/`, { note }).then(r=>r.data);
}
export function listEvents(id: ID) {
  return http.get(`/atendimentos/${id}/events/`).then(r=>r.data);
}
export function simulate(id: ID, payload: any) {
  return http.post(`/atendimentos/${id}/simulate/`, payload).then(r=>r.data);
}
