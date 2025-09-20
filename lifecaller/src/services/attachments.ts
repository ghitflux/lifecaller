import { http } from "./http";
export function listAttachments(atendimentoId: number|string) {
  return http.get(`/attachments/?atendimento=${atendimentoId}`).then(r=>r.data);
}
export function uploadAttachment(atendimentoId: number|string, file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("atendimento", String(atendimentoId));
  return http.post(`/attachments/`, fd, { headers: { "Content-Type":"multipart/form-data" } }).then(r=>r.data);
}
