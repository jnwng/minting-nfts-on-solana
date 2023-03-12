import { cleanEnv, str, url } from 'envalid';

export default cleanEnv(process.env, {
  KEYPAIR_FILE: str(),
  RPC_URL: url(),
});
