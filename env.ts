import dotenv from 'dotenv'
dotenv.config()

interface EnvVariables {
    MY_AWS_ACCESS_KEY_ID: string;
    MY_AWS_SECRET_ACCESS_KEY: string;
    AWS_SES_REGION: string;
    AWS_S3_REGION: string;
    VERIFIED_EMAIL: string;
    AWS_ACCESS_KEY_S3: string;
    AWS_SECRET_ACCESS_KEY_S3: string;
    AWS_S3_BUCKET_NAME: string;
    STRIPE_SECRET_KEY: string;
    DB_PASSWORD: string;
    SECRET_PSW: string;
    DB_NAME: string;
    DB_USER: string;
    DB_HOST: string;
    DB_PORT: string;
    NODE_ENV: string;
}

export const env: EnvVariables = {
    MY_AWS_ACCESS_KEY_ID: process.env.MY_AWS_ACCESS_KEY_ID!,
    MY_AWS_SECRET_ACCESS_KEY: process.env.MY_AWS_SECRET_ACCESS_KEY!,
    AWS_SES_REGION: process.env.AWS_SES_REGION!,
    AWS_S3_REGION: process.env.AWS_S3_REGION!,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,
    VERIFIED_EMAIL: process.env.VERIFIED_EMAIL!,
    AWS_ACCESS_KEY_S3: process.env.AWS_ACCESS_KEY_S3!,
    AWS_SECRET_ACCESS_KEY_S3: process.env.AWS_SECRET_ACCESS_KEY_S3!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    SECRET_PSW: process.env.SECRET_PSW!,
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
    NODE_ENV: process.env.NODE_ENV!
}