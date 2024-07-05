import Head from "next/head";

import { UserSecretsPage } from "@app/views/UserSecretsPage";

const UserSecrets = () => {
  return (
    <>
      <Head>
        <title>User Secrets</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
        <meta property="og:title" content="" />
        <meta name="og:description" content="" />
      </Head>
      <div className="h-full">
        <UserSecretsPage />
      </div>
    </>
  );
};

export default UserSecrets;

UserSecrets.requireAuth = true;
