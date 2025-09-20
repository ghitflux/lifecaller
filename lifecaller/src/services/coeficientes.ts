import { http } from "./http";

export const coefAPI = {
  list: (params?: Record<string, unknown>) => http.get("/coeficientes/", { params }).then((r) => r.data),
  importFile: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return http
      .post("/coeficientes/import/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
