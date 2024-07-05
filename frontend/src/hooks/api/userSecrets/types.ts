export enum UserSecretType {
  Login = "login",
}

export type TCreateUserSecretV3DTO = {
  name: string;
  username: string;
  password: string;
  website: string;
};

export type UserSecret = {
  name: string;
  username: string;
  password: string;
  website: string;
}
