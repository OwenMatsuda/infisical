import { z } from "zod";

import { CredentialType } from "@app/db/schemas";
import { CredentialLoginsSchema } from "@app/db/schemas/credential-logins";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerCredentialRouter = async (server: FastifyZodProvider) => {
  server.route({
    url: "/:credentialName",
    method: "POST",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.object({
        type: z.nativeEnum(CredentialType),
        website: z.string().trim(),
        username: z.string().trim(),
        password: z.string().trim()
      }),
      params: z.object({
        credentialName: z.string().trim()
      }),
      response: {
        200: CredentialLoginsSchema
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const { type, website, username, password } = req.body;
      const credential = await server.services.credential.createCredential({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        credential: {
          type,
          data: {
            name: req.params.credentialName,
            website,
            username,
            password
          }
        }
      });

      return credential;
    }
  });

  server.route({
    url: "/",
    method: "GET",
    config: {
      rateLimit: readLimit
    },
    schema: {
      response: {
        200: CredentialLoginsSchema.array()
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const credentials = await server.services.credential.getCredentials({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId
      });

      return credentials;
    }
  });
};
