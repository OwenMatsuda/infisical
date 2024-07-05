export enum UserSecretType {
  Login = "login",
}

export type TCreateUserSecretV3DTO = {
  name: string;
  username: string;
  password: string;
  website: string;
};
