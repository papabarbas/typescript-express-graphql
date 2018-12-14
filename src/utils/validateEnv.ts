import { cleanEnv, str, num } from 'envalid'

export default function validateEnv() {
  cleanEnv(process.env, {
    MONGODB_USER: str(),
    MONGODB_PASSWORD: str(),
    MONGODB_HOST: str(),
    MONGODB_DATABASE: str(),
    PORT: num()
  })
}
