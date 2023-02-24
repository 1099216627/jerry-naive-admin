import { http } from "@/utils/http";

export const uploadApi = (file: File) => {
  return http.uploadFile(
    {
      url: "/admin/api/v1/upload/image",
    },
    {
      file,
    }
  );
};
