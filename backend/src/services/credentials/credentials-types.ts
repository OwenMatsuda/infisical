import { CredentialType } from "@app/db/schemas";

import { ActorAuthMethod, ActorType } from "../auth/auth-type";

export type CredentialData = {
  name: string;
  website: string;
  username: string;
  password: string;
};

export type Credential = {
  type: CredentialType;
  data: CredentialData;
};

export type TCreateCredentialDTO = {
  actor: ActorType;
  actorAuthMethod: ActorAuthMethod;
  actorId: string;
  actorOrgId?: string;
  credential: Credential;
};
