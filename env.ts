import dotenv from 'dotenv'
dotenv.config()

interface EnvVariables {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_SES_REGION: string;
    AWS_S3_REGION: string;
    VERIFIED_EMAIL: string;
    AWS_ACCESS_KEY_S3: string;
    AWS_SECRET_ACCESS_KEY_S3: string;
    AWS_S3_BUCKET_NAME: string;
    STRIPE_SECRET_KEY: string;
    DB_PASSWORD: string;
    SECRET_PSW: string;
}

export const env = process.env as unknown as EnvVariables