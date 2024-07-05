import { MutationOptions, useMutation } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TCreateUserSecretV3DTO, UserSecretType } from "./types";

export const useCreateUserSecretV3 = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TCreateUserSecretV3DTO>, "mutationFn">;
} = {}) => {
  return useMutation<{}, {}, TCreateUserSecretV3DTO>({
    mutationFn: async ({
      name,
      username,
      password,
      website
    }) => {
      const reqBody = {
        type: UserSecretType.Login,
        username,
        password,
        website,
      };
      const { data } = await apiRequest.post(`/api/v3/credentials/${name}`, reqBody);
      return data;
    },
    ...options
  });
};
