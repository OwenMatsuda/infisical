import { ForbiddenError } from "@casl/ability";

import { CredentialType } from "@app/db/schemas";
import { OrgPermissionActions, OrgPermissionSubjects } from "@app/ee/services/permission/org-permission";
import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";

import { TOrgDALFactory } from "../org/org-dal";
import { TCredentialsDALFactory } from "./credentials-dal";
import { TCreateCredentialDTO, TGetCredentialsDTO } from "./credentials-types";

type TCredentialsServiceFactoryDep = {
  credentialsDAL: TCredentialsDALFactory;
  orgDAL: TOrgDALFactory;
  permissionService: TPermissionServiceFactory;
};

export type TCredentialsServiceFactory = ReturnType<typeof credentialsServiceFactory>;

export const credentialsServiceFactory = ({
  credentialsDAL,
  orgDAL,
  permissionService
}: TCredentialsServiceFactoryDep) => {
  const createCredential = async ({
    actor,
    actorId,
    actorOrgId,
    actorAuthMethod,
    credential
  }: TCreateCredentialDTO) => {
    const organization = await orgDAL.findOne({ id: actorOrgId });

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      organization.id,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Create, OrgPermissionSubjects.Credentials);

    const results = await credentialsDAL.transaction(async (tx) => {
      switch (credential.type) {
        case CredentialType.Login: {
          const newCredential = await credentialsDAL.create(
            {
              orgId: organization.id,
              userId: actorId,
              name: credential.data.name,
              website: credential.data.website,
              username: credential.data.username,
              password: credential.data.password
            },
            tx
          );

          return { ...newCredential };
        }
        default: {
          throw new Error("Invalid Credential Type");
        }
      }
    });

    return results;
  };

  const getCredentials = async ({ actor, actorId, actorOrgId, actorAuthMethod }: TGetCredentialsDTO) => {
    const organization = await orgDAL.findOne({ id: actorOrgId });

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      organization.id,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Create, OrgPermissionSubjects.Credentials);

    const results = await credentialsDAL.transaction(async (tx) => {
      const credentials = await credentialsDAL.find({ orgId: organization.id, userId: actorId }, tx);
      return credentials;
    });

    return results;
  };

  return { createCredential, getCredentials };
};
