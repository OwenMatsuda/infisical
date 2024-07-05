import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { UserSecret } from "./types";

export const useGetUserSecrets = () => useQuery({
  queryKey: ["getUserSecrets"],
  queryFn: async () => {
    const { data } = await apiRequest.get<UserSecret[]>("/api/v3/credentials");
    return data;
  }
});
