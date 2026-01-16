import { env } from '../env.js'

const isLocalhost = env.NODE_ENV === 'localhost' || env.NODE_ENV === 'production'

export const API_BASE_URL = isLocalhost
    ? "http://localhost:3000"
    : "https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws"
console.log(API_BASE_URL)